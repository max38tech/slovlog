export const PROTECTED_OWNER_EMAIL = (
  process.env.INITIAL_ADMIN_EMAIL || "shawn.shiobara@gmail.com"
).toLowerCase().trim();

export function canDeleteAdmin(email: string): { allowed: boolean; reason?: string } {
  const normalized = email.toLowerCase().trim();
  if (normalized === PROTECTED_OWNER_EMAIL) {
    return {
      allowed: false,
      reason: "Cannot delete or demote the owner super-user.",
    };
  }
  return { allowed: true };
}

export function validateAdminEmail(email: string): { valid: boolean; error?: string } {
  const trimmed = email.trim();
  if (!trimmed) {
    return { valid: false, error: "Email address cannot be empty." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(trimmed)) {
    return { valid: false, error: "Please enter a valid email address (e.g., user@gmail.com)." };
  }

  return { valid: true };
}
