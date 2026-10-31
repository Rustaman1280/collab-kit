/**
 * Collab Kit: Git Repository Inspection Utilities
 * Copyright (c) 2026 Rustaman Delvianova / crustdev
 */
import { execSync } from "node:child_process";
import { parseCommitMessage } from "./trailers.js";
/**
 * Executes a git command safely and returns stdout trimmed.
 */
export function runGit(args) {
    try {
        return execSync(`git ${args.join(" ")}`, {
            encoding: "utf-8",
            stdio: ["pipe", "pipe", "pipe"],
        }).trim();
    }
    catch (error) {
        throw new Error(`Git command failed: git ${args.join(" ")} - ${error.message}`);
    }
}
/**
 * Checks if current directory is inside a git worktree.
 */
export function isGitRepository() {
    try {
        runGit(["rev-parse", "--is-inside-work-tree"]);
        return true;
    }
    catch {
        return false;
    }
}
/**
 * Extracts all unique co-authors from a range of commits (e.g. "HEAD~10..HEAD" or "origin/main..HEAD").
 */
export function getCoAuthorsFromCommitRange(range = "HEAD~10..HEAD") {
    if (!isGitRepository()) {
        return [];
    }
    try {
        const rawLogs = runGit(["log", range, "--format=%B%x00"]);
        const commitMessages = rawLogs.split("\0").filter(Boolean);
        const map = new Map();
        for (const msg of commitMessages) {
            const parsed = parseCommitMessage(msg);
            for (const author of parsed.coAuthors) {
                const key = author.email.toLowerCase();
                if (!map.has(key)) {
                    map.set(key, author);
                }
            }
        }
        return Array.from(map.values());
    }
    catch {
        return [];
    }
}
//# sourceMappingURL=git.js.map