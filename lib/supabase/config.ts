export const FALLBACK_SUPABASE_URL = "https://placeholder-project.supabase.co";
export const FALLBACK_SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder";

/**
 * Sanitizes and normalizes Supabase URL strings.
 * Handles missing protocol (https://), bare project refs, surrounding quotes, trailing slashes, and whitespace.
 */
export function sanitizeSupabaseUrl(rawUrl?: string | null): string {
  if (!rawUrl) return "";
  let url = rawUrl.trim().replace(/^["']|["']$/g, "").trim();
  if (!url) return "";

  // If only a project reference was provided (e.g. "dcprobqwbbkpcyrwmvom")
  if (/^[a-z0-9]{20}$/i.test(url)) {
    return `https://${url}.supabase.co`;
  }

  // Prepend https:// if protocol is missing
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = `https://${url}`;
  }

  // Remove trailing slashes
  url = url.replace(/\/+$/, "");

  // Validate URL format
  try {
    const parsed = new URL(url);
    if (!parsed.protocol.startsWith("http")) return "";
    return parsed.origin;
  } catch {
    return "";
  }
}

/**
 * Sanitizes Supabase API key strings.
 * Removes accidental quotes and whitespace.
 */
export function sanitizeSupabaseKey(rawKey?: string | null): string {
  if (!rawKey) return "";
  return rawKey.trim().replace(/^["']|["']$/g, "").trim();
}

/**
 * Checks if Supabase credentials are configured with valid non-placeholder values.
 */
export function isSupabaseConfigured(): boolean {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const url = sanitizeSupabaseUrl(rawUrl);
  const key = sanitizeSupabaseKey(rawKey);

  return Boolean(
    url &&
    key &&
    !url.includes("placeholder") &&
    !url.includes("your-project") &&
    !url.includes("example.supabase.co")
  );
}

/**
 * Returns safe credentials for client creation, falling back to dummy values if not configured.
 */
export function getSupabaseCredentials() {
  const sanitizedUrl = sanitizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const sanitizedKey = sanitizeSupabaseKey(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  const url = sanitizedUrl || FALLBACK_SUPABASE_URL;
  const key = sanitizedKey || FALLBACK_SUPABASE_KEY;

  return { url, key };
}

/**
 * Returns safe credentials for admin/service-role client creation.
 */
export function getSupabaseAdminCredentials() {
  const sanitizedUrl = sanitizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const sanitizedServiceKey = sanitizeSupabaseKey(
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const url = sanitizedUrl || FALLBACK_SUPABASE_URL;
  const key = sanitizedServiceKey || FALLBACK_SUPABASE_KEY;

  return { url, key };
}
