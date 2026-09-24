"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { slugify, resolveUniqueSlug } from "@/lib/utils/slug";
import { verifyAdminUser } from "@/lib/auth";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !user.email) {
    throw new Error("Unauthorized: Please sign in");
  }

  const check = await verifyAdminUser(user.email);
  if (!check.authorized) {
    throw new Error("Forbidden: Not an authorized administrator");
  }

  return user;
}

export async function createPostAction(formData: FormData) {
  await requireAdmin();
  const supabase = createAdminClient();

  const title = (formData.get("title") as string || "").trim();
  const customSlug = (formData.get("slug") as string || "").trim();
  const location = (formData.get("location") as string || "Slovenia").trim();
  const tripDate = (formData.get("trip_date") as string || new Date().toISOString().split("T")[0]).trim();
  const excerpt = (formData.get("excerpt") as string || "").trim();
  const content = (formData.get("content") as string || "").trim();
  const coverImage = (formData.get("cover_image") as string || "").trim() || null;
  const published = formData.get("published") === "true";
  const featured = formData.get("featured") === "true";
  const galleryImagesRaw = (formData.get("gallery_images") as string || "").trim();
  const galleryImages = galleryImagesRaw ? galleryImagesRaw.split(",").map((s) => s.trim()).filter(Boolean) : [];

  if (!title) {
    return { error: "Post title is required." };
  }

  const baseSlug = customSlug ? slugify(customSlug) : slugify(title);

  // Fetch existing slugs to prevent collisions
  const { data: existingRows } = await (supabase.from("slog_posts") as any).select("slug");
  const existingSlugs = (existingRows || []).map((r: { slug: string }) => r.slug);
  const uniqueSlug = resolveUniqueSlug(baseSlug, existingSlugs);

  const { data, error } = await (supabase.from("slog_posts") as any)
    .insert({
      title,
      slug: uniqueSlug,
      location,
      trip_date: tripDate,
      excerpt: excerpt || null,
      content,
      cover_image: coverImage,
      published,
      featured,
      gallery_images: galleryImages,
    })
    .select("id, slug")
    .single();

  if (error) {
    console.error("Error creating post:", error);
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/posts");
  redirect("/admin/posts");
}

export async function updatePostAction(id: string, formData: FormData) {
  await requireAdmin();
  const supabase = createAdminClient();

  const title = (formData.get("title") as string || "").trim();
  const customSlug = (formData.get("slug") as string || "").trim();
  const location = (formData.get("location") as string || "Slovenia").trim();
  const tripDate = (formData.get("trip_date") as string || new Date().toISOString().split("T")[0]).trim();
  const excerpt = (formData.get("excerpt") as string || "").trim();
  const content = (formData.get("content") as string || "").trim();
  const coverImage = (formData.get("cover_image") as string || "").trim() || null;
  const published = formData.get("published") === "true";
  const featured = formData.get("featured") === "true";
  const galleryImagesRaw = (formData.get("gallery_images") as string || "").trim();
  const galleryImages = galleryImagesRaw ? galleryImagesRaw.split(",").map((s) => s.trim()).filter(Boolean) : [];

  if (!title) {
    return { error: "Post title is required." };
  }

  const baseSlug = customSlug ? slugify(customSlug) : slugify(title);

  // Check existing slugs excluding current post
  const { data: existingRows } = await (supabase.from("slog_posts") as any)
    .select("slug")
    .neq("id", id);
  const existingSlugs = (existingRows || []).map((r: { slug: string }) => r.slug);
  const uniqueSlug = resolveUniqueSlug(baseSlug, existingSlugs);

  const { error } = await (supabase.from("slog_posts") as any)
    .update({
      title,
      slug: uniqueSlug,
      location,
      trip_date: tripDate,
      excerpt: excerpt || null,
      content,
      cover_image: coverImage,
      published,
      featured,
      gallery_images: galleryImages,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("Error updating post:", error);
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath(`/posts/${uniqueSlug}`);
  revalidatePath("/admin");
  revalidatePath("/admin/posts");
  redirect("/admin/posts");
}

export async function deletePostAction(id: string) {
  await requireAdmin();
  const supabase = createAdminClient();

  const { error } = await (supabase.from("slog_posts") as any).delete().eq("id", id);

  if (error) {
    console.error("Error deleting post:", error);
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/posts");
  return { success: true };
}

export async function togglePostPublishAction(id: string, currentPublished: boolean) {
  await requireAdmin();
  const supabase = createAdminClient();

  const { error } = await (supabase.from("slog_posts") as any)
    .update({ published: !currentPublished, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    console.error("Error toggling publish status:", error);
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/posts");
  return { success: true, published: !currentPublished };
}
