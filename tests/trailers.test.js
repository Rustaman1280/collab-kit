import test from "node:test";
import assert from "node:assert/strict";
import { parseCommitMessage, validateCommitMessage, formatCoAuthorTrailers } from "../dist/trailers.js";

test("parseCommitMessage parses single-line commit without trailers", () => {
  const msg = "feat: initial commit";
  const result = parseCommitMessage(msg);
  assert.equal(result.subject, "feat: initial commit");
  assert.equal(result.body, "");
  assert.equal(result.trailers.length, 0);
  assert.equal(result.coAuthors.length, 0);
});

test("parseCommitMessage extracts Co-authored-by trailers correctly", () => {
  const msg = `feat(core): implement git trailer parser

This introduces robust RFC 2822 trailer extraction.
It supports multiple co-authors and custom key-value trailers.

Signed-off-by: Rustaman Delvianova <rustaman@crusts.dev>
Co-authored-by: Alice Developer <alice@example.com>
Co-authored-by: Bob Engineer <bob@example.com>`;

  const result = parseCommitMessage(msg);
  assert.equal(result.subject, "feat(core): implement git trailer parser");
  assert.ok(result.body.includes("This introduces robust"));
  assert.equal(result.trailers.length, 3);
  assert.equal(result.coAuthors.length, 2);
  assert.deepEqual(result.coAuthors[0], { name: "Alice Developer", email: "alice@example.com" });
  assert.deepEqual(result.coAuthors[1], { name: "Bob Engineer", email: "bob@example.com" });
});

test("validateCommitMessage detects invalid emails", () => {
  const msg = `fix: correct validation logic

Co-authored-by: Charlie <not-an-email>`;
  const result = validateCommitMessage(msg);
  assert.equal(result.valid, false);
  assert.equal(result.errors.length, 1);
  assert.match(result.errors[0], /Invalid email format/);
});

test("validateCommitMessage passes for valid trailers", () => {
  const msg = `fix: correct validation logic

Co-authored-by: Charlie <charlie@crusts.dev>`;
  const result = validateCommitMessage(msg);
  assert.equal(result.valid, true);
  assert.equal(result.errors.length, 0);
  assert.equal(result.coAuthors.length, 1);
});

test("formatCoAuthorTrailers formats and deduplicates entries", () => {
  const authors = [
    { name: "Dev One", email: "one@example.com" },
    { name: "Dev One Dup", email: "ONE@EXAMPLE.COM" },
    { name: "Dev Two", email: "two@example.com" },
  ];

  const formatted = formatCoAuthorTrailers(authors);
  assert.equal(
    formatted,
    "Co-authored-by: Dev One <one@example.com>\nCo-authored-by: Dev Two <two@example.com>"
  );
});
