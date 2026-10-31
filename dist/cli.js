#!/usr/bin/env node
/**
 * Collab Kit: Command Line Interface
 * Copyright (c) 2026 Rustaman Delvianova / crustdev
 */
import { readFileSync } from "node:fs";
import { validateCommitMessage, formatCoAuthorTrailers } from "./trailers.js";
import { getCoAuthorsFromCommitRange } from "./git.js";
import { generateReleaseCredits } from "./attribution.js";
function printHelp() {
    console.log(`
@crustdev/collab-kit - Developer toolkit for distributed teams and pair programming

Usage:
  collab-kit <command> [options]

Commands:
  validate <file|message>    Validate commit message trailers
  credits [range]            Generate markdown release credits from commit range (default: HEAD~10..HEAD)
  format <name> <email>      Generate properly formatted Co-authored-by trailer
  help                       Display this help message

Examples:
  collab-kit validate .git/COMMIT_EDITMSG
  collab-kit credits origin/main..HEAD
  collab-kit format "John Doe" "john@example.com"
`);
}
function run() {
    const args = process.argv.slice(2);
    const command = args[0];
    if (!command || command === "help" || command === "--help" || command === "-h") {
        printHelp();
        process.exit(0);
    }
    switch (command) {
        case "validate": {
            const target = args[1];
            if (!target) {
                console.error("Error: Please provide a commit message file path or raw string to validate.");
                process.exit(1);
            }
            let content = target;
            try {
                content = readFileSync(target, "utf-8");
            }
            catch {
                // Use target as raw message string directly
            }
            const result = validateCommitMessage(content);
            if (result.valid) {
                console.log(`✓ Commit message trailers are valid. Found ${result.coAuthors.length} co-author(s).`);
                process.exit(0);
            }
            else {
                console.error("✗ Commit trailer validation failed:");
                for (const err of result.errors) {
                    console.error(`  - ${err}`);
                }
                process.exit(1);
            }
            break;
        }
        case "credits": {
            const range = args[1] || "HEAD~10..HEAD";
            const authors = getCoAuthorsFromCommitRange(range);
            if (authors.length === 0) {
                console.log("No co-authors found in the specified commit range.");
            }
            else {
                console.log(generateReleaseCredits(authors));
            }
            break;
        }
        case "format": {
            const name = args[1];
            const email = args[2];
            if (!name || !email) {
                console.error('Error: Please provide name and email. Example: collab-kit format "John Doe" "john@example.com"');
                process.exit(1);
            }
            console.log(formatCoAuthorTrailers([{ name, email }]));
            break;
        }
        default:
            console.error(`Unknown command: "${command}"`);
            printHelp();
            process.exit(1);
    }
}
run();
//# sourceMappingURL=cli.js.map