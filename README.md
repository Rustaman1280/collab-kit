# Collab Kit

[![CI Status](https://github.com/Rustaman1280/collab-kit/actions/workflows/ci.yml/badge.svg)](https://github.com/Rustaman1280/collab-kit/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)

Production-grade developer toolkit for engineering collectives, pair programming, and multi-agent workflow attribution. Built by [crustdev](https://crusts.dev).

---

## Overview

When engineering teams and AI agents collaborate on modern software, tracking co-authorship and crediting contributors is essential. **Collab Kit** provides an automated engine to parse, format, validate, and credit git commit trailers (such as `Co-authored-by: Name <email>`) according to RFC 2822 specifications and GitHub contribution guidelines.

### Features

- **Trailer Parser**: Robust extraction of commit subjects, bodies, and terminal git trailer blocks.
- **Co-author Formatter**: Generates RFC-compliant `Co-authored-by` commit trailers with automatic deduplication.
- **Validation Engine**: Verifies name and email syntax on staged commit messages or git hook files (`COMMIT_EDITMSG`).
- **Release Credits Generator**: Scans git commit ranges and produces clean markdown tables or lists for release notes.
- **GitHub Action & Git Hooks**: Integrates seamlessly into CI pipelines and local pre-commit hooks.

---

## Installation

```bash
npm install -g @crustdev/collab-kit
```

Or run directly via `npx`:

```bash
npx @crustdev/collab-kit help
```

---

## CLI Usage

### 1. Validate Commit Message

Validate whether a commit message has properly formatted trailers and valid emails:

```bash
# Validate a git hook file
collab-kit validate .git/COMMIT_EDITMSG

# Or validate an inline commit string
collab-kit validate "feat: core update\n\nCo-authored-by: Alice <alice@example.com>"
```

### 2. Generate Co-author Trailer

Format a standard co-author trailer:

```bash
collab-kit format "Rustaman Delvianova" "rustaman@crusts.dev"
```

Output:
```text
Co-authored-by: Rustaman Delvianova <rustaman@crusts.dev>
```

### 3. Generate Release Attribution Credits

Scan commits between branches or tags to generate markdown attribution for your changelog:

```bash
collab-kit credits origin/main..HEAD
```

Output:
```markdown
### Contributors & Co-authors

Thanks to everyone who paired and contributed code in this release:
- **Rustaman Delvianova** (`rustaman@crusts.dev`)
- **github-actions[bot]** (`41898282+github-actions[bot]@users.noreply.github.com`)
```

---

## Programmatic API

```typescript
import {
  parseCommitMessage,
  validateCommitMessage,
  formatCoAuthorTrailers,
  generateReleaseCredits
} from "@crustdev/collab-kit";

// Parse commit message
const parsed = parseCommitMessage(rawMessage);
console.log(parsed.coAuthors);

// Validate
const result = validateCommitMessage(rawMessage);
if (!result.valid) {
  console.error(result.errors);
}

// Generate release markdown
const credits = generateReleaseCredits(parsed.coAuthors);
```

---

## GitHub Actions Integration

Add this step to your PR validation workflow to ensure all paired commits follow clean trailer conventions:

```yaml
- name: Validate PR Co-authors
  uses: Rustaman1280/collab-kit@main
  with:
    range: origin/main..HEAD
```

---

## License

MIT (c) 2026 Rustaman Delvianova / crustdev.
