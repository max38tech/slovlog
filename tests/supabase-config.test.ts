import { test, describe } from "node:test";
import assert from "node:assert";
import {
  sanitizeSupabaseUrl,
  sanitizeSupabaseKey,
  isSupabaseConfigured,
  getSupabaseCredentials,
  FALLBACK_SUPABASE_URL,
} from "../lib/supabase/config";

describe("Supabase Configuration & URL Sanitizer", () => {
  test("handles missing or empty URLs", () => {
    assert.strictEqual(sanitizeSupabaseUrl(""), "");
    assert.strictEqual(sanitizeSupabaseUrl(undefined), "");
    assert.strictEqual(sanitizeSupabaseUrl(null), "");
    assert.strictEqual(sanitizeSupabaseUrl("   "), "");
  });

  test("prepends https:// when protocol is missing", () => {
    assert.strictEqual(
      sanitizeSupabaseUrl("dcprobqwbbkpcyrwmvom.supabase.co"),
      "https://dcprobqwbbkpcyrwmvom.supabase.co"
    );
  });

  test("strips trailing slashes and surrounding quotes", () => {
    assert.strictEqual(
      sanitizeSupabaseUrl('"https://dcprobqwbbkpcyrwmvom.supabase.co/"'),
      "https://dcprobqwbbkpcyrwmvom.supabase.co"
    );
    assert.strictEqual(
      sanitizeSupabaseUrl("'dcprobqwbbkpcyrwmvom.supabase.co/'"),
      "https://dcprobqwbbkpcyrwmvom.supabase.co"
    );
    assert.strictEqual(
      sanitizeSupabaseUrl("  https://dcprobqwbbkpcyrwmvom.supabase.co/  "),
      "https://dcprobqwbbkpcyrwmvom.supabase.co"
    );
  });

  test("expands bare 20-character project references to full Supabase domain", () => {
    assert.strictEqual(
      sanitizeSupabaseUrl("dcprobqwbbkpcyrwmvom"),
      "https://dcprobqwbbkpcyrwmvom.supabase.co"
    );
  });

  test("sanitizes API keys by trimming and removing quotes", () => {
    assert.strictEqual(sanitizeSupabaseKey("  my-secret-key  "), "my-secret-key");
    assert.strictEqual(sanitizeSupabaseKey('"my-secret-key"'), "my-secret-key");
    assert.strictEqual(sanitizeSupabaseKey("'my-secret-key'"), "my-secret-key");
    assert.strictEqual(sanitizeSupabaseKey(""), "");
    assert.strictEqual(sanitizeSupabaseKey(undefined), "");
  });

  test("fallback credentials provided when env is unconfigured", () => {
    const creds = getSupabaseCredentials();
    assert.ok(creds.url.startsWith("https://"));
    assert.ok(creds.key.length > 0);
  });
});
