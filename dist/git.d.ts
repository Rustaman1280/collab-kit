/**
 * Collab Kit: Git Repository Inspection Utilities
 * Copyright (c) 2026 Rustaman Delvianova / crustdev
 */
import { CoAuthor } from "./types.js";
/**
 * Executes a git command safely and returns stdout trimmed.
 */
export declare function runGit(args: string[]): string;
/**
 * Checks if current directory is inside a git worktree.
 */
export declare function isGitRepository(): boolean;
/**
 * Extracts all unique co-authors from a range of commits (e.g. "HEAD~10..HEAD" or "origin/main..HEAD").
 */
export declare function getCoAuthorsFromCommitRange(range?: string): CoAuthor[];
//# sourceMappingURL=git.d.ts.map