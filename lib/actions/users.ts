"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth";
import { canDeleteAdmin, validateAdminEmail } from "@/lib/utils/admin-protection";

async function requireAdmin() {
  const user = await getSessionUser();

  if (!user || !user.email) {
    throw new Error("Unauthorized: Please sign in");
  }

  return user;
}

export async function addAdminUserAction(formData: FormData) {
  await requireAdmin();
  const supabase = createAdminClient();

  const rawEmail = (formData.get("email") as string || "").trim();
  const validation = validateAdminEmail(rawEmail);

  if (!validation.valid) {
    return { error: validation.error };
  }

  const email = rawEmail.toLowerCase();

  try {
    const { data, error } = await (supabase.from("slog_admin_users") as any)
      .insert({
        email,
        role: "admin",
      })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return { error: `User '${email}' is already an authorized administrator.` };
      }
      return { error: error.message };
    }

    revalidatePath("/admin/users");
    revalidatePath("/admin");
    return { success: true, user: data };
  } catch (err: any) {
    return { error: err.message || "Failed to add administrator" };
  }
}

export async function deleteAdminUserAction(id: string, targetEmail: string) {
  await requireAdmin();
  const supabase = createAdminClient();

  // Review Focus: Strict owner protection rule
  const protectionCheck = canDeleteAdmin(targetEmail);
  if (!protectionCheck.allowed) {
    return { error: protectionCheck.reason };
  }

  try {
    const { error } = await (supabase.from("slog_admin_users") as any)
      .delete()
      .eq("id", id);

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/admin/users");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to remove administrator" };
  }
}
