# GitHub Copilot — Repository-Wide Custom Instructions

This file is automatically read by GitHub Copilot for every prompt made in the context of this repository. It provides Copilot with the essential context needed to generate accurate, consistent, and high-quality contributions to this codebase.

---

## Project Summary

This repository is a **Playwright-based end-to-end test automation framework** for the [hud.io](https://hud.io) web application. It uses:

- **TypeScript** as the language
- **Playwright** as the browser automation and test runner framework
- **Page Object Model (POM)** as the structural design pattern
- **OOP (Object-Oriented Programming)** principles throughout

The framework is designed to be maintained and extended by both human engineers and AI agents (GitHub Copilot, cloud agents, CLI agents).

---

## Architecture

- All UI interactions are encapsulated in **Page Object classes** located in `pages/`.
- All Page Objects extend `BasePage` (`pages/BasePage.ts`).
- All test specs are in `tests/` and end in `.spec.ts`.
- Shared fixtures and test setup/teardown logic live in `fixtures/`.
- Shared utilities and helpers live in `utils/`.
- Playwright configuration is in `playwright.config.ts`.

---

## Code Standards

### TypeScript

- All files must be `.ts` — no plain JavaScript.
- Use `async/await` for all asynchronous calls.
- Prefer Playwright's built-in types (`Page`, `Locator`, `BrowserContext`) over `any`.
- Use `readonly` for locator properties in Page Objects.

### Locators (priority order — highest to lowest)

1. `page.getByRole()` — semantic ARIA roles (most resilient)
2. `page.getByLabel()` — form field labels
3. `page.getByText()` — visible text content
4. `page.getByTestId()` — `data-testid` attributes
5. `page.locator('css')` — CSS selectors (last resort)
6. Never use XPath.

### Tests

- Test names follow the pattern: `'should <action> when <condition>'`
- No raw locators in test files — always use Page Object properties/methods.
- No `page.waitForTimeout()` — use Playwright auto-waiting and `expect()`.
- No hardcoded credentials — use `process.env.TEST_USER_EMAIL` / `process.env.TEST_USER_PASSWORD`.
- Tests must be independent and atomic.

### Page Objects

- One class per page or major reusable component.
- Extend `BasePage`.
- Locators are `readonly` class properties.
- Actions are `async` methods.

---

## Running Tests

```bash
npm install
npx playwright install --with-deps
npx playwright test
npx playwright show-report
```

---

## Important Constraints

- **Do not** modify `playwright.config.ts` base settings or CI workflow YAML files without explicit human instruction.
- **Do not** commit `.env` files.
- **Do not** add `page.waitForTimeout()` — it is a test smell in Playwright.
- **Always** create a Page Object before writing a test if the target page doesn't have one.
