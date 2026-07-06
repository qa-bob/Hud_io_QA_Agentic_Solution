---
description: Run the Playwright suite by tag (smoke, functional, regression, or all) and summarize the results.
argument-hint: [smoke|functional|regression|all]
disable-model-invocation: true
allowed-tools: Bash(npm test), Bash(npm run test:*), Bash(npx playwright *)
---

Run the Playwright suite scoped to "$ARGUMENTS" (treat empty input as "all"):

- `smoke` → `npm run test:smoke`
- `functional` → `npm run test:functional`
- `regression` → `npm run test:regression`
- `all` (or empty) → `npm test`

Report pass/fail counts and list any failing test titles with their file path. If tests fail, report the failures — do not modify source code or tests unless separately asked to.
