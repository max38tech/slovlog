import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { isInitialAdmin, normalizeEmail } from "../lib/auth";

describe("Auth admin validation", () => {
  it("normalizes emails to lowercase and trims whitespace", () => {
    assert.equal(normalizeEmail("  Shawn.Shiobara@Gmail.COM  "), "shawn.shiobara@gmail.com");
    assert.equal(normalizeEmail(""), "");
    assert.equal(normalizeEmail(undefined), "");
  });

  it("recognizes initial admin owner email regardless of case", () => {
    assert.equal(isInitialAdmin("shawn.shiobara@gmail.com"), true);
    assert.equal(isInitialAdmin("SHAWN.SHIOBARA@GMAIL.COM"), true);
    assert.equal(isInitialAdmin("shawn.shiobara+test@gmail.com"), false);
    assert.equal(isInitialAdmin("random@example.com"), false);
  });
});
