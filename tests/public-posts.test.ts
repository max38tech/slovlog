import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { isPostVisibleToUser, calculateReadingTime } from "../lib/utils/public-posts";

describe("Public Post Visibility & Reading Metrics", () => {
  it("hides draft posts from unauthenticated public visitors", () => {
    assert.equal(isPostVisibleToUser({ published: false }, false), false);
  });

  it("shows published posts to all visitors", () => {
    assert.equal(isPostVisibleToUser({ published: true }, false), true);
    assert.equal(isPostVisibleToUser({ published: true }, true), true);
  });

  it("permits admins to preview draft posts", () => {
    assert.equal(isPostVisibleToUser({ published: false }, true), true);
  });

  it("calculates estimated reading time", () => {
    const shortText = "Word ".repeat(150); // ~150 words
    assert.equal(calculateReadingTime(shortText), "1 min read");

    const longText = "Word ".repeat(600); // ~600 words
    assert.equal(calculateReadingTime(longText), "3 min read");
  });
});
