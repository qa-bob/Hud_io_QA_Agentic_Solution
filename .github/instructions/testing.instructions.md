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

```ts
// fixtures/auth.fixture.ts
import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

type AuthFixtures = {
  loggedInPage: LoginPage;
};

export const test = base.extend<AuthFixtures>({
  loggedInPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(
      process.env.TEST_USER_EMAIL!,
      process.env.TEST_USER_PASSWORD!
    );
    await use(loginPage);
  },
});

export { expect };
```

## Environment Variables

Required environment variables — never hardcode these:

| Variable | Usage |
|---|---|
| `BASE_URL` | Base URL for navigation (set in `playwright.config.ts`) |
| `TEST_USER_EMAIL` | Test account email |
| `TEST_USER_PASSWORD` | Test account password |

Access them safely: `process.env.TEST_USER_EMAIL!`

## Assertions

- Always use Playwright's `expect()` from `@playwright/test` for assertions.
- Use web-first assertions (`toBeVisible`, `toHaveText`, `toHaveURL`) that auto-retry.
- Avoid manual polling loops — Playwright's assertions have built-in retry logic.
