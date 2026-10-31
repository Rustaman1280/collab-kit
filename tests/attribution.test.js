import test from "node:test";
import assert from "node:assert/strict";
import { generateReleaseCredits } from "../dist/attribution.js";

test("generateReleaseCredits returns empty string for empty list", () => {
  assert.equal(generateReleaseCredits([]), "");
});

test("generateReleaseCredits formats markdown release notes with contributors", () => {
  const authors = [
    { name: "Rustaman Delvianova", email: "rustaman@crusts.dev" },
    { name: "AI Pairing Partner", email: "partner@example.com" },
  ];

  const credits = generateReleaseCredits(authors);
  assert.ok(credits.includes("### Contributors & Co-authors"));
  assert.ok(credits.includes("- **Rustaman Delvianova** (`rustaman@crusts.dev`)"));
  assert.ok(credits.includes("- **AI Pairing Partner** (`partner@example.com`)"));
});
