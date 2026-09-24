import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { canDeleteAdmin, validateAdminEmail } from "../lib/utils/admin-protection";

describe("Admin User Management & Owner Protection", () => {
  it("strictly prevents deleting or demoting the owner super-user", () => {
    assert.deepEqual(canDeleteAdmin("shawn.shiobara@gmail.com"), {
      allowed: false,
      reason: "Cannot delete or demote the owner super-user.",
    });

    assert.deepEqual(canDeleteAdmin("SHAWN.SHIOBARA@GMAIL.COM"), {
      allowed: false,
      reason: "Cannot delete or demote the owner super-user.",
    });
  });

  it("permits deleting secondary administrators", () => {
    assert.deepEqual(canDeleteAdmin("collaborator@example.com"), {
      allowed: true,
    });
  });

  it("validates email addresses before adding them as admins", () => {
    assert.equal(validateAdminEmail("friend@gmail.com").valid, true);
    assert.equal(validateAdminEmail("").valid, false);
    assert.equal(validateAdminEmail("invalid-email").valid, false);
    assert.equal(validateAdminEmail("missing@domain").valid, false);
  });
});
