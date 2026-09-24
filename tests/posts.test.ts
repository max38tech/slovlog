import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { slugify, resolveUniqueSlug } from "../lib/utils/slug";

describe("Post Slug Generation", () => {
  it("converts titles to clean url-friendly slugs", () => {
    assert.equal(slugify("Arriving in Ljubljana: Dragons & Bridges!"), "arriving-in-ljubljana-dragons-and-bridges");
    assert.equal(slugify("Vršič Pass & Soča Valley"), "vrsic-pass-and-soca-valley");
    assert.equal(slugify("   Lake Bled 2026   "), "lake-bled-2026");
  });

  it("resolves slug collisions by appending incremental suffixes", () => {
    const existing = ["lake-bled", "lake-bled-2"];
    assert.equal(resolveUniqueSlug("lake-bled", existing), "lake-bled-3");
    assert.equal(resolveUniqueSlug("piran-sunset", existing), "piran-sunset");
  });
});
