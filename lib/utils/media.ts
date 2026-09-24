const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
  "image/svg+xml",
]);

const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024; // 20 MB

export function validateMediaUpload(
  mimeType: string,
  sizeBytes: number
): { valid: boolean; error?: string } {
  if (!ALLOWED_MIME_TYPES.has(mimeType.toLowerCase())) {
    return {
      valid: false,
      error: `Only image files (JPEG, PNG, WEBP, AVIF, GIF, SVG) are supported. Received: ${mimeType}`,
    };
  }

  if (sizeBytes > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File size (${(sizeBytes / (1024 * 1024)).toFixed(1)}MB) exceeds maximum limit of 20MB.`,
    };
  }

  return { valid: true };
}

export function sanitizeFileName(originalName: string): string {
  // Strip any leading directories
  const baseName = originalName.split(/[/\\]/).pop() || "image";

  // Split name and extension
  const lastDot = baseName.lastIndexOf(".");
  let name = lastDot !== -1 ? baseName.substring(0, lastDot) : baseName;
  const ext = lastDot !== -1 ? baseName.substring(lastDot).toLowerCase() : "";

  // Normalize and clean name
  name = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${name || "photo"}${ext}`;
}
