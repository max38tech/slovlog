import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { validateMediaUpload, sanitizeFileName } from "../lib/utils/media";

describe("Media Validation & Sanitization", () => {
  it("allows standard image MIME types", () => {
    assert.equal(validateMediaUpload("image/jpeg", 1024 * 1024).valid, true);
    assert.equal(validateMediaUpload("image/png", 5 * 1024 * 1024).valid, true);
    assert.equal(validateMediaUpload("image/webp", 2 * 1024 * 1024).valid, true);
    assert.equal(validateMediaUpload("image/avif", 2 * 1024 * 1024).valid, true);
  });

  it("rejects non-image MIME types", () => {
    const result = validateMediaUpload("application/pdf", 1024);
    assert.equal(result.valid, false);
    assert.match(result.error || "", /only image files/i);
  });

  it("rejects files exceeding 20MB", () => {
    const result = validateMediaUpload("image/jpeg", 25 * 1024 * 1024);
    assert.equal(result.valid, false);
    assert.match(result.error || "", /exceeds/i);
  });

  it("sanitizes file names to prevent directory traversal and special chars", () => {
    const sanitized = sanitizeFileName("../../Lake Bled & Castle (Final).jpg");
    assert.ok(!sanitized.includes(".."));
    assert.ok(!sanitized.includes("/"));
    assert.ok(!sanitized.includes("&"));
    assert.match(sanitized, /lake-bled.*castle.*final\.jpg/i);
  });
});
