# AGENTS.md — GitHub Copilot Agent Instructions

This file provides authoritative instructions for all AI agents (GitHub Copilot, cloud agents, CLI agents) operating in this repository. All agents must follow these instructions when reading, writing, or reasoning about code in this project.

---

## Project Identity

- **Repository:** Hud.io QA Agentic Solution
- **Purpose:** Automated end-to-end test suite for the [hud.io](https://hud.io) web application
- **Framework:** [Playwright](https://playwright.dev) with TypeScript
- **Design Pattern:** Page Object Model (POM)
- **Paradigm:** Object-Oriented Programming (OOP)

---

## Repository Layout

```
.
├── pages/          # Page Object classes (one file per page/component)
├── tests/          # Playwright test spec files
├── fixtures/       # Shared Playwright fixtures and test setup/teardown
├── utils/          # Shared helper utilities (e.g., data generators, API helpers)
├── playwright.config.ts   # Playwright configuration — browsers, baseURL, timeouts
├── .env            # Local environment variables (NOT committed)
└── .github/        # Copilot instructions, CI workflows
```

---

## Page Object Model Rules

- Every hud.io page or reusable UI component that is interacted with in tests **must** have a corresponding Page Object class in `pages/`.
- All Page Objects **must** extend `BasePage` (found in `pages/BasePage.ts`).
- Locators are defined as `readonly` properties on the class using Playwright's `page.getBy*` API.
- Actions are `async` methods that encapsulate a user workflow on that page.
- Assertions (page-level `expect` calls) may optionally be exposed as named methods.

### Page Object Template

```ts
import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ExamplePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Locators
  readonly heading = this.page.getByRole('heading', { name: 'Example' });
  readonly submitButton = this.page.getByRole('button', { name: 'Submit' });

  // Actions
  async clickSubmit(): Promise<void> {
    await this.submitButton.click();
  }
}
```

---

## Test Authoring Rules

1. **Test files** live in `tests/` and must end in `.spec.ts`.
2. **No raw locators in test files** — always use Page Object methods and properties.
3. **Test naming:** `test('should <action> when <condition>', ...)`
4. **Imports:** Always import the relevant Page Object(s), not `page` directly.
5. **No hardcoded URLs** — use `baseURL` from `playwright.config.ts` and Page Objects for navigation.
6. **No hardcoded credentials** — use environment variables (`process.env.TEST_USER_EMAIL`, etc.).
7. **No `page.waitForTimeout()`** — rely on Playwright's auto-waiting and `expect()`.
8. **Tests must be independent** — do not depend on execution order.
9. **One assertion theme per test** — keep tests atomic and focused.

### Test File Template

```ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('Login', () => {
  test('should log in successfully with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(
      process.env.TEST_USER_EMAIL!,
      process.env.TEST_USER_PASSWORD!
    );
    await expect(loginPage.dashboardHeading).toBeVisible();
  });
});
```

---

## Locator Strategy (Priority Order)

When writing or generating locators, follow this priority order:

1. `getByRole()` — semantic ARIA roles (preferred)
2. `getByLabel()` — form fields by their label text
3. `getByText()` — elements by visible text
4. `getByTestId()` — `data-testid` attributes (when added by the team)
5. `locator('css')` — CSS selectors (last resort, avoid if possible)
6. **Never** use XPath unless absolutely unavoidable

---

## How to Run Tests

```bash
# Install dependencies (always run after cloning or pulling)
npm install
npx playwright install --with-deps

# Run all tests
npx playwright test

# Run in headed mode
npx playwright test --headed

# Run a specific spec
npx playwright test tests/<spec-file>.spec.ts

# View HTML report
npx playwright show-report
```

---

## Environment Variables

Tests rely on the following environment variables. These must be set in `.env` (local) or as CI secrets:

| Variable | Description |
|---|---|
| `BASE_URL` | Base URL of the hud.io app under test |
| `TEST_USER_EMAIL` | Email address of the test user account |
| `TEST_USER_PASSWORD` | Password for the test user account |

---

## Agent Behavior Guidelines

- **When adding a new test:** First check if the target page already has a Page Object in `pages/`. If not, create one before writing the test.
- **When updating a locator:** Update it in the Page Object class only — never in the test file directly.
- **When refactoring:** Maintain OOP inheritance chain (all Page Objects extend `BasePage`).
- **When generating fixtures:** Place shared setup/teardown logic in `fixtures/`, not inline in tests.
- **When in doubt about a selector:** Prefer `getByRole` or `getByLabel` for accessibility and resilience.
- **Before committing:** Run `npx playwright test` and ensure zero failures.
- **Do not** modify `.env`, `playwright.config.ts` base settings, or CI workflow files without explicit human approval.

---

## CI / Continuous Integration

Tests are run on every pull request via GitHub Actions (`.github/workflows/`). All checks must pass before a PR can be merged. The CI pipeline:

1. Installs Node.js dependencies
2. Installs Playwright browsers
3. Runs the full test suite
4. Uploads the Playwright HTML report as an artifact
