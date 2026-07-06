# AGENTS.md — Agent Instructions

This file provides authoritative instructions for all AI agents (GitHub Copilot, Claude Code, cloud agents, CLI agents) operating in this repository, following the cross-tool [AGENTS.md spec](https://agents.md). All agents must follow these instructions when reading, writing, or reasoning about code in this project.

Claude Code specifically reads `CLAUDE.md` at the repo root, which imports this file (`@AGENTS.md`) and adds a few Claude-specific pointers (subagents in `.claude/agents/`, skills in `.claude/skills/`). See `.github/README.md` for the full breakdown of which tool reads which file.

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
├── utils/          # Shared helper utilities (URLS derived from site.config.json)
├── site.config.json       # Source of truth: base URL + page paths for the site under test
├── playwright.config.ts   # Playwright configuration — browsers, baseURL, timeouts
├── .env            # Local environment variables (NOT committed)
├── CLAUDE.md       # Claude Code entry point (imports this file)
├── .claude/        # Claude Code agents, skills, and permission settings
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
5. **No hardcoded URLs** — page paths come from `site.config.json` via `utils/urls.ts` (`URLS.*`); `baseURL` in `playwright.config.ts` handles the host.
6. **No hardcoded credentials** — if a future test ever needs one, use environment variables. Today this suite has no login/account state at all (see Testing Constraints below).
7. **No `page.waitForTimeout()`** — rely on Playwright's auto-waiting and `expect()`.
8. **Tests must be independent** — do not depend on execution order.
9. **One assertion theme per test** — keep tests atomic and focused.
10. **Exactly one tag per test or `describe` block** — `@smoke`, `@functional`, or `@regression`. See Test Strategy below.

### Test File Template

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

## Test Strategy

Every test carries exactly one tag, applied via Playwright's `{ tag: '@name' }` option on `test()` or `test.describe()`:

| Tag | Scope | Run when |
|---|---|---|
| `@smoke` | Critical path only: page loads (200 + correct title), primary heading/CTA visible. Few, fast tests per page. | Every push (`npm run test:smoke`) |
| `@functional` | Feature-level behavior: correct URL after navigation, secondary content renders, nav links/hrefs are correct. | Every PR (`npm run test:functional`) |
| `@regression` | Broader/secondary coverage: alternate viewports, cross-page consistency, less-critical UI states. | Before release (`npm run test:regression`) |

`npm test` runs everything, untagged.

## Testing Constraints

- **Never register, sign up, log in, or submit a lead-generation form** (Book a Demo, Contact) against the live site. Assert that forms/widgets render — do not submit them.
- This is a read-only test suite: no test should create, modify, or delete data on hud.io.
- There is no test user account and no `TEST_USER_EMAIL`/`TEST_USER_PASSWORD` — if a future feature genuinely requires authenticated coverage, raise it with a human before adding credentials.

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

## Site Config and Environment Variables

- `site.config.json` (repo root) is the single source of truth for the base URL and every page path (`URLS.*` in `utils/urls.ts` reads from it). Update paths there when hud.io's site structure changes — never hardcode a path in a Page Object or test.
- `BASE_URL` (optional, in `.env` locally or as a CI secret) overrides `site.config.json`'s `site.baseUrl` for staging/preview runs.

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
