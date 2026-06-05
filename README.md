# Hud.io QA Agentic Solution

## Overview

This repository contains the automated QA test suite for the [hud.io](https://hud.io) web application. It is designed to be a production-grade, agentic-friendly test automation framework built with **Playwright**, using the **Page Object Model (POM)** design pattern and **Object-Oriented Programming (OOP)** principles.

The repository is fully configured for **GitHub Copilot** — including custom instructions, agent profiles, path-specific guidance, and skills — so that AI agents can contribute to, extend, and maintain the test suite with minimal friction.

---

## Tech Stack

| Tool / Library | Purpose |
|---|---|
| [Playwright](https://playwright.dev) | Browser automation & test execution |
| [TypeScript](https://www.typescriptlang.org) | Type-safe test authoring |
| [Page Object Model](https://playwright.dev/docs/pom) | Encapsulate UI interactions per page |
| [GitHub Copilot CLI](https://docs.github.com/copilot) | AI-assisted development & agentic test generation |

---

## Repository Structure

```
.
├── .github/
│   ├── copilot-instructions.md     # Repo-wide Copilot instructions
│   ├── instructions/               # Path-specific Copilot instructions
│   │   ├── playwright.instructions.md
│   │   ├── pom.instructions.md
│   │   └── testing.instructions.md
│   ├── workflows/                  # CI/CD GitHub Actions
│   └── README.md                   # .github folder guide
├── pages/                          # Page Object Model classes
│   └── BasePage.ts
├── tests/                          # Playwright test specs
├── fixtures/                       # Shared test fixtures & setup
├── utils/                          # Shared helpers and utilities
├── playwright.config.ts            # Playwright configuration
├── AGENTS.md                       # Copilot agent instructions
├── Skills.md                       # Copilot skills reference
└── README.md                       # This file
```

---

## Getting Started

### Prerequisites

- **Node.js** v18+ ([download](https://nodejs.org))
- **npm** v9+
- A GitHub account with **GitHub Copilot** access (recommended for development)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/qa-bob/Hud_io_QA_Agentic_Solution.git
cd Hud_io_QA_Agentic_Solution

# 2. Install dependencies
npm install

# 3. Install Playwright browsers
npx playwright install --with-deps
```

### Running Tests

```bash
# Run all tests
npx playwright test

# Run tests in headed mode (visible browser)
npx playwright test --headed

# Run a specific test file
npx playwright test tests/login.spec.ts

# Run tests in a specific project (browser)
npx playwright test --project=chromium

# Generate and view the HTML report
npx playwright show-report
```

### Environment Configuration

Create a `.env` file at the root (do **not** commit this):

```env
BASE_URL=https://hud.io
TEST_USER_EMAIL=your-test-user@example.com
TEST_USER_PASSWORD=your-test-password
```

---

## Design Principles

### Page Object Model (POM)

Every page or component of hud.io that is tested must have a corresponding **Page Object class** in the `pages/` directory. Page Objects encapsulate:

- **Locators** — element selectors for that page
- **Actions** — methods that represent user interactions (e.g., `login()`, `clickSubmit()`)
- **Assertions** — methods that verify the state of the page

```ts
// Example: pages/LoginPage.ts
export class LoginPage extends BasePage {
  readonly emailInput = this.page.getByLabel('Email');
  readonly passwordInput = this.page.getByLabel('Password');
  readonly submitButton = this.page.getByRole('button', { name: 'Sign in' });

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}
```

### OOP Principles

- All Page Objects extend `BasePage`
- Use `constructor` injection to pass the Playwright `Page` instance
- Prefer composition over inheritance for complex component structures

---

## Contributor Rules

All contributors — human and AI — must follow these rules:

### Branching Strategy

| Branch | Purpose |
|---|---|
| `main` | Protected. Only merged via approved PRs. |
| `develop` | Integration branch for features |
| `feature/<name>` | New test coverage or framework features |
| `fix/<name>` | Bug fixes in existing tests or framework code |

### Code Standards

1. **TypeScript only** — no plain `.js` test files.
2. **POM required** — all UI interactions go through Page Objects; no raw locators in test files.
3. **Descriptive test names** — use `test('should <action> when <condition>', ...)` naming.
4. **No hardcoded credentials** — use environment variables or test fixtures.
5. **No `page.waitForTimeout()`** — use Playwright's built-in auto-waiting and `expect()` assertions.
6. **One concern per test** — tests should be atomic and independent.
7. **Clean up state** — tests must not leave behind data that affects other tests.

### Pull Request Requirements

- PRs must include a description of what was tested and why
- All CI checks must pass before merge
- At least one reviewer approval required
- Follow the commit message format: `type(scope): description`
  - Types: `feat`, `fix`, `test`, `refactor`, `docs`, `chore`

### AI Agent Contributions

When using **GitHub Copilot** or any AI agent to generate tests:

- Review all generated code before committing
- Ensure generated Page Objects follow the `BasePage` pattern
- Verify that generated locators use accessible selectors (`getByRole`, `getByLabel`, `getByText`) over CSS/XPath
- Run the full test suite before opening a PR

---

## GitHub Copilot Setup

This repo is fully configured for GitHub Copilot. See:

- [`AGENTS.md`](./AGENTS.md) — Agent behavior instructions
- [`Skills.md`](./Skills.md) — Available skills for AI-assisted development
- [`.github/README.md`](./.github/README.md) — Full guide to `.github` folder contents

---

## License

[MIT](./LICENSE)
