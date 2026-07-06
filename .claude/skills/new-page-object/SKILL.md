---
description: Scaffold a new Playwright Page Object for a hud.io page that doesn't have one yet. Use when adding test coverage for a new page or reusable component.
argument-hint: [PageName] [url-path]
context: fork
agent: page-object-scaffolder
---

Scaffold a Page Object for the page named $0 at site path $1 (e.g. `/careers/`).

1. Add the path to `site.config.json` under `pages` if it isn't already there.
2. Create `pages/$0Page.ts` following this repo's POM/OOP conventions (see `AGENTS.md` and `.github/instructions/pom.instructions.md`).
3. Register the new page in `fixtures/base.fixture.ts`'s `PageFixtures` type and `test.extend` block.
4. Report which locators you inferred from the live DOM vs. guessed, so they can be verified manually.
