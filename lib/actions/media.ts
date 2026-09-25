"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/server";
import { validateMediaUpload, sanitizeFileName } from "@/lib/utils/media";
import { getSessionUser } from "@/lib/auth";

const BUCKET_NAME = "slog-media";

async function requireAdmin() {
  const user = await getSessionUser();

  if (!user || !user.email) {
    throw new Error("Unauthorized: Please sign in");
  }

  return user;
}

export async function uploadMediaAction(formData: FormData) {
  await requireAdmin();
  const supabase = createAdminClient();

  const file = formData.get("file") as File | null;
  const caption = (formData.get("caption") as string || "").trim();
  const location = (formData.get("location") as string || "Slovenia").trim();

  if (!file) {
    return { error: "No file provided for upload." };
  }

  const validation = validateMediaUpload(file.type, file.size);
  if (!validation.valid) {
    return { error: validation.error };
  }

  const cleanName = sanitizeFileName(file.name);
  const timestamp = Date.now();
  const filePath = `uploads/${timestamp}-${cleanName}`;

  try {
    const fileBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(fileBuffer);

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      return {
        error: `Storage upload failed: ${uploadError.message}. Ensure the '${BUCKET_NAME}' bucket exists in your Supabase project.`,
      };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    const publicUrl = urlData.publicUrl;

    // Record in database
    const { data: mediaRecord, error: dbError } = await (supabase.from("slog_media") as any)
      .insert({
        file_name: cleanName,
        file_path: filePath,
        public_url: publicUrl,
        mime_type: file.type,
        size_bytes: file.size,
        caption: caption || null,
        location: location || null,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database insert error for media:", dbError);
      return {
        error: `Uploaded to storage, but failed to save record: ${dbError.message}`,
        publicUrl,
      };
    }

    revalidatePath("/admin/media");
    revalidatePath("/admin");
    return { success: true, media: mediaRecord };
  } catch (err: any) {
    console.error("Exception during media upload:", err);
    return { error: err.message || "Failed to upload media file" };
  }
}

export async function deleteMediaAction(id: string, filePath: string) {
  await requireAdmin();
  const supabase = createAdminClient();

  try {
    // Remove from storage
    if (filePath) {
      await supabase.storage.from(BUCKET_NAME).remove([filePath]);
    }

    // Remove from database
    const { error: dbError } = await (supabase.from("slog_media") as any)
      .delete()
      .eq("id", id);

    if (dbError) {
      return { error: dbError.message };
    }

    revalidatePath("/admin/media");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to delete media" };
  }
}
