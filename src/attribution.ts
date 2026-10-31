/**
 * Collab Kit: Contributor Attribution Generator
 * Copyright (c) 2026 Rustaman Delvianova / crustdev
 */

import { CoAuthor } from "./types.js";

/**
 * Formats a list of CoAuthors into a markdown credits section suitable for release notes.
 */
export function generateReleaseCredits(coAuthors: CoAuthor[], title: string = "Contributors & Co-authors"): string {
  if (coAuthors.length === 0) {
    return "";
  }

  const lines = [
    `### ${title}`,
    "",
    "Thanks to everyone who paired and contributed code in this release:",
    "",
  ];

  for (const author of coAuthors) {
    lines.push(`- **${author.name}** (\`${author.email}\`)`);
  }

  return lines.join("\n");
}
