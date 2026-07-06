---
description: Add a new Playwright test spec for a hud.io page or feature, correctly tagged smoke/functional/regression. Use when filling a gap in test coverage.
argument-hint: [PageName or feature]
context: fork
agent: qa-test-writer
---

Write test coverage for $ARGUMENTS.

- Use its Page Object from `pages/` — scaffold one first with `/new-page-object` if it doesn't exist yet.
- Put the spec in `tests/<name>.spec.ts`, importing `test`/`expect` from `../fixtures/base.fixture`.
- Tag every test or `test.describe()` with exactly one of `@smoke`, `@functional`, `@regression` per the strategy in `AGENTS.md`.
- Never submit a form, log in, register, or sign up against the live site — assert visibility only.
