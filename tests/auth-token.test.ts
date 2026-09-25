import { test, describe } from "node:test";
import assert from "node:assert";
import { createSessionToken, verifySessionToken } from "../lib/auth-token";

describe("Direct Google JWT Session Management", () => {
  test("creates and verifies valid session tokens", async () => {
    const payload = {
      email: "shawn.shiobara@gmail.com",
      name: "Shawn Shiobara",
      role: "owner" as const,
    };

    const token = await createSessionToken(payload);
    assert.ok(typeof token === "string" && token.length > 20);

    const verified = await verifySessionToken(token);
    assert.ok(verified !== null);
    assert.strictEqual(verified.email, "shawn.shiobara@gmail.com");
    assert.strictEqual(verified.role, "owner");
    assert.strictEqual(verified.name, "Shawn Shiobara");
  });

  test("rejects malformed or tampered tokens", async () => {
    assert.strictEqual(await verifySessionToken(""), null);
    assert.strictEqual(await verifySessionToken("not-a-real-jwt"), null);
    assert.strictEqual(await verifySessionToken("eyJhbGciOiJIUzI1NiJ9.tampered.signature"), null);
  });
});
