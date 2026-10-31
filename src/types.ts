/**
 * Collab Kit: Core Data Types
 * Copyright (c) 2026 Rustaman Delvianova / crustdev
 */

export interface CoAuthor {
  name: string;
  email: string;
}

export interface GitTrailer {
  token: string;
  value: string;
  raw: string;
}

export interface ParsedCommitMessage {
  subject: string;
  body: string;
  trailers: GitTrailer[];
  coAuthors: CoAuthor[];
}

export interface TrailerValidationResult {
  valid: boolean;
  errors: string[];
  coAuthors: CoAuthor[];
}
