/**
 * Collab Kit: Git Trailer Parser & Validator Engine
 * Copyright (c) 2026 Rustaman Delvianova / crustdev
 */
import { CoAuthor, ParsedCommitMessage, TrailerValidationResult } from "./types.js";
/**
 * Extracts and parses git trailers from a raw commit message string.
 */
export declare function parseCommitMessage(rawMessage: string): ParsedCommitMessage;
/**
 * Validates a list of co-authors or a commit message for git trailer compliance.
 */
export declare function validateCommitMessage(message: string): TrailerValidationResult;
/**
 * Formats a list of CoAuthors into valid Git commit trailers.
 */
export declare function formatCoAuthorTrailers(authors: CoAuthor[]): string;
//# sourceMappingURL=trailers.d.ts.map