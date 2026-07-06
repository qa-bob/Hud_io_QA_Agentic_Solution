---
applyTo: "tests/**/*.spec.ts"
---

# Playwright Test Authoring Instructions

These instructions apply when writing or modifying Playwright test spec files (`.spec.ts`).

## Test File Conventions

- Import Page Objects from `../pages/`, never interact with `page` directly in test files.
- Import `test` and `expect` from `@playwright/test`.
- Group related tests in `test.describe()` blocks named after the feature or page under test.
- Name each test using: `'should <action> when <condition>'`.

## Playwright Best Practices

- Use `expect(locator).toBeVisible()` instead of checking `isVisible()` imperatively.
- Use `expect(page).toHaveURL(...)` for URL assertions after navigation.
- Prefer `await page.goto('/')` in a `test.beforeEach()` or Page Object `goto()` method.
- Use `test.describe.configure({ mode: 'parallel' })` for suites that can run in parallel.
- Use `test.skip()`, `test.fixme()`, or `test.fail()` annotations appropriately.
- Chain `await` correctly — never fire-and-forget Playwright calls.
- Tag every test or `describe` block with exactly one of `@smoke`, `@functional`, `@regression` — see "Test Strategy" in `AGENTS.md`.
- Never submit a form or attempt to register/log in against the live site — see "Testing Constraints" in `AGENTS.md`.

## Example Test Structure

```ts
import { test, expect } from '../fixtures/base.fixture';
import { URLS } from '../utils/urls';

test.describe('Careers Page', () => {
  test.beforeEach(async ({ careersPage }) => {
    await careersPage.goto();
  });

  test('should load the careers page with a 200 status', { tag: '@smoke' }, async ({ page }) => {
    const response = await page.goto(URLS.CAREERS);
    expect(response?.status()).toBe(200);
  });

  test('should display a page heading', { tag: '@functional' }, async ({ careersPage }) => {
    await expect(careersPage.pageHeading).toBeVisible();
  });
});
```
