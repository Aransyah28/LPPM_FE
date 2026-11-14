---
description: Pre-deployment quality gate verifying types, linting, tests, and bundle performance.
---

<!-- Command: /predeploy -->
<!-- Source: generated -->
<!-- Run before every deployment — BLOCKS if any check fails -->

# /predeploy — Pre-deployment Gate

Run in order. STOP and report if any step fails:

1. TypeScript: tsc --noEmit (must pass)
2. Lint: biome check (must pass)
3. Tests: run full test suite (must pass)
4. Console errors: grep for console.error in src/ (must be 0)
5. Bundle: verify bundle size < SSoT performance budget
6. Token violations: run /token-audit src/ (must be 0 CRITICAL)
7. Env vars: verify all required .env keys are present

Output: PASS or BLOCK with specific failure details.
