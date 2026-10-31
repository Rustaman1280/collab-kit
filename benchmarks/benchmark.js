import { performance } from "node:perf_hooks";
import { parseCommitMessage, validateCommitMessage, formatCoAuthorTrailers } from "../dist/trailers.js";
import { generateReleaseCredits } from "../dist/attribution.js";

console.log("=== @crustdev/collab-kit Performance Benchmarks ===");

// 1. Commit message parsing & validation throughput
{
  const sampleCommit = `feat(engine): integrate deterministic voxel density sampler

This commit introduces continuous fBm sampling into the voxel grid pipeline,
enabling multithreaded terrain meshing with zero external dependencies.

Signed-off-by: Rustaman Delvianova <rustaman@crusts.dev>
Co-authored-by: Alice Engineer <alice@crusts.dev>
Co-authored-by: Bob Dev <bob@crusts.dev>
Closes: #142`;

  const iterations = 50_000;
  const t0 = performance.now();
  let validCount = 0;
  for (let i = 0; i < iterations; i++) {
    const valid = validateCommitMessage(sampleCommit);
    if (valid.valid) validCount++;
  }
  const elapsed = performance.now() - t0;
  const rate = Math.round((iterations / elapsed) * 1000);
  console.log(`- Commit Validation: ${iterations.toLocaleString()} commits in ${elapsed.toFixed(2)}ms (${rate.toLocaleString()} ops/sec)`);
}

// 2. Attribution release notes generation
{
  const contributors = Array.from({ length: 500 }, (_, i) => ({
    name: `Contributor ${i + 1}`,
    email: `dev${i + 1}@crusts.dev`,
  }));

  const iterations = 1_000;
  const t0 = performance.now();
  let totalLength = 0;
  for (let i = 0; i < iterations; i++) {
    const md = generateReleaseCredits(contributors, { title: "Release v1.2.0" });
    totalLength += md.length;
  }
  const elapsed = performance.now() - t0;
  const rate = Math.round((iterations / elapsed) * 1000);
  console.log(`- Release Notes Generation (500 contributors): ${iterations.toLocaleString()} docs in ${elapsed.toFixed(2)}ms (${rate.toLocaleString()} docs/sec)`);
}

console.log("==================================================");
