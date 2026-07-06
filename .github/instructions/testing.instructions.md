---
applyTo: "**/*.spec.ts,fixtures/**/*.ts"
---

# General Testing Standards

These instructions apply to all test files and fixture files across the repository.

## Test Independence

- Every test must be able to run in isolation — no shared mutable state between tests.
- Use `test.beforeEach()` to reset or navigate to the required state.
- Use `test.afterEach()` to clean up any data created during the test.
- Never rely on a previous test's side effects.

## Fixtures

- Shared setup logic that is used across multiple test files belongs in `fixtures/`.
- Define custom fixtures using Playwright's `test.extend<{}>()` pattern.
- Export the extended `test` and `expect` from the fixture file for use in specs.
- See `fixtures/base.fixture.ts` for this repo's actual pattern: one fixture per Page Object, injected by name.

```ts
// fixtures/base.fixture.ts (excerpt)
import { test as base } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

type PageFixtures = {
  homePage: HomePage;
};

export const test = base.extend<PageFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
});

export { expect } from '@playwright/test';
```

## Environment Variables and Site Config

- `site.config.json` (repo root) is the source of truth for the base URL and every page path. Read paths via `utils/urls.ts` (`URLS.*`) — never hardcode a path string in a test or Page Object.
- `BASE_URL` (optional, in `.env`) overrides `site.config.json`'s `site.baseUrl` for local or staging runs. Access it via `playwright.config.ts`, not directly in tests.
- This suite has no login, signup, or account state — there is no `TEST_USER_EMAIL`/`TEST_USER_PASSWORD` to configure. See the Testing Constraints in `AGENTS.md` before adding any test that touches a form.

## Test Tagging

Every test or `test.describe()` block carries exactly one tag: `@smoke`, `@functional`, or `@regression`. See the "Test Strategy" section in `AGENTS.md` for what belongs in each tier, and run `npm run test:smoke` / `test:functional` / `test:regression` to execute one tier at a time.

## Assertions

- Always use Playwright's `expect()` from `@playwright/test` for assertions.
- Use web-first assertions (`toBeVisible`, `toHaveText`, `toHaveURL`) that auto-retry.
- Avoid manual polling loops — Playwright's assertions have built-in retry logic.
