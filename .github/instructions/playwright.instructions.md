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

## Example Test Structure

```ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('Login Feature', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should log in successfully with valid credentials', async () => {
    await loginPage.login(
      process.env.TEST_USER_EMAIL!,
      process.env.TEST_USER_PASSWORD!
    );
    await expect(loginPage.dashboardHeading).toBeVisible();
  });

  test('should show an error with invalid credentials', async () => {
    await loginPage.login('wrong@email.com', 'wrongpassword');
    await expect(loginPage.errorMessage).toBeVisible();
  });
});
```
