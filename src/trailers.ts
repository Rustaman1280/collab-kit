/**
 * Collab Kit: Git Trailer Parser & Validator Engine
 * Copyright (c) 2026 Rustaman Delvianova / crustdev
 */

import { CoAuthor, GitTrailer, ParsedCommitMessage, TrailerValidationResult } from "./types.js";

const CO_AUTHOR_REGEX = /^\s*Co-authored-by:\s*([^<]+)<([^>]+)>\s*$/i;
const TRAILER_LINE_REGEX = /^([a-zA-Z0-9_-]+):\s*(.+)$/;
const SIMPLE_EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Extracts and parses git trailers from a raw commit message string.
 */
export function parseCommitMessage(rawMessage: string): ParsedCommitMessage {
  let normalized = rawMessage.replace(/\r\n/g, "\n").trim();
  if (!normalized.includes("\n") && normalized.includes("\\n")) {
    normalized = normalized.replace(/\\n/g, "\n");
  }
  const lines = normalized.split("\n");

  if (lines.length === 0 || !lines[0]) {
    return {
      subject: "",
      body: "",
      trailers: [],
      coAuthors: [],
    };
  }

  const subject = lines[0].trim();
  const restLines = lines.slice(1);

  // Git trailers appear in the final block of the commit message
  const trailers: GitTrailer[] = [];
  const coAuthors: CoAuthor[] = [];
  const bodyLines: string[] = [];

  // Find trailer block at the end of the commit message
  let inTrailerBlock = false;
  const trailingNonEmptyLines: string[] = [];

  // Walk backwards to find contiguous trailer lines
  let splitIndex = restLines.length;
  for (let i = restLines.length - 1; i >= 0; i--) {
    const line = restLines[i].trim();
    if (line === "") {
      if (inTrailerBlock) {
        splitIndex = i;
        break;
      }
      continue;
    }

    if (TRAILER_LINE_REGEX.test(line)) {
      inTrailerBlock = true;
      trailingNonEmptyLines.unshift(line);
    } else {
      if (inTrailerBlock) {
        splitIndex = i + 1;
        break;
      }
    }
  }

  if (inTrailerBlock) {
    for (let i = 0; i < splitIndex; i++) {
      bodyLines.push(restLines[i]);
    }
    for (const line of trailingNonEmptyLines) {
      const match = line.match(TRAILER_LINE_REGEX);
      if (match) {
        const token = match[1];
        const value = match[2].trim();
        trailers.push({ token, value, raw: line });

        const coAuthorMatch = line.match(CO_AUTHOR_REGEX);
        if (coAuthorMatch) {
          coAuthors.push({
            name: coAuthorMatch[1].trim(),
            email: coAuthorMatch[2].trim(),
          });
        }
      }
    }
  } else {
    for (const line of restLines) {
      bodyLines.push(line);
    }
  }

  return {
    subject,
    body: bodyLines.join("\n").trim(),
    trailers,
    coAuthors,
  };
}

/**
 * Validates a list of co-authors or a commit message for git trailer compliance.
 */
export function validateCommitMessage(message: string): TrailerValidationResult {
  const parsed = parseCommitMessage(message);
  const errors: string[] = [];

  for (const author of parsed.coAuthors) {
    if (!author.name) {
      errors.push("Co-author name cannot be empty");
    }
    if (!SIMPLE_EMAIL_REGEX.test(author.email)) {
      errors.push(`Invalid email format for co-author "${author.name}": "${author.email}"`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    coAuthors: parsed.coAuthors,
  };
}

/**
 * Formats a list of CoAuthors into valid Git commit trailers.
 */
export function formatCoAuthorTrailers(authors: CoAuthor[]): string {
  const seenEmails = new Set<string>();
  const validTrailers: string[] = [];

  for (const author of authors) {
    const emailKey = author.email.toLowerCase().trim();
    if (seenEmails.has(emailKey)) {
      continue;
    }
    seenEmails.add(emailKey);
    validTrailers.push(`Co-authored-by: ${author.name.trim()} <${author.email.trim()}>`);
  }

  return validTrailers.join("\n");
}
