# Hud.io QA Agentic Solution

## Overview

This repository contains the automated QA test suite for the [hud.io](https://hud.io) web application. It is designed to be a production-grade, agentic-friendly test automation framework built with **Playwright**, using the **Page Object Model (POM)** design pattern and **Object-Oriented Programming (OOP)** principles.

The suite is **read-only against the live site**: it verifies that hud.io's major pages and features work correctly without ever registering, signing up, logging in, or submitting a lead-generation form. See [Testing Constraints](#testing-constraints).

The repository is configured for both **GitHub Copilot** and **Claude Code** — custom instructions, agent/subagent profiles, path-specific guidance, and skills — so AI agents can contribute to, extend, and maintain the test suite with minimal friction. See [AI Agent Setup](#ai-agent-setup) below.

---

## Tech Stack

| Tool / Library | Purpose |
|---|---|
| [Playwright](https://playwright.dev) | Browser automation & test execution |
| [TypeScript](https://www.typescriptlang.org) | Type-safe test authoring |
| [Page Object Model](https://playwright.dev/docs/pom) | Encapsulate UI interactions per page |
| [GitHub Copilot CLI](https://docs.github.com/copilot) | AI-assisted development & agentic test generation |
| [Claude Code](https://code.claude.com/docs) | AI-assisted development via subagents & skills |

---

## Repository Structure

```
.
├── .claude/
│   ├── agents/                     # Claude Code subagents (page-object-scaffolder, qa-test-writer, qa-test-reviewer)
│   ├── skills/                     # Claude Code skills (new-page-object, new-test-suite, run-tests)
│   └── settings.json               # Claude Code permissions
├── .github/
│   ├── copilot-instructions.md     # Repo-wide Copilot instructions
│   ├── instructions/               # Path-specific Copilot instructions
│   │   ├── playwright.instructions.md
│   │   ├── pom.instructions.md
│   │   └── testing.instructions.md
│   ├── workflows/                  # CI/CD GitHub Actions
│   └── README.md                   # .github folder guide
├── pages/                          # Page Object Model classes
│   ├── components/                 # Shared components (e.g. HeaderComponent)
│   └── BasePage.ts
├── tests/                          # Playwright test specs (tagged @smoke/@functional/@regression)
├── fixtures/                       # Shared test fixtures & setup
├── utils/                          # Shared helpers and utilities (URLS from site.config.json)
├── site.config.json                 # Source of truth: base URL + page paths for the site under test
├── playwright.config.ts            # Playwright configuration
├── CLAUDE.md                       # Claude Code entry point (imports AGENTS.md)
├── AGENTS.md                       # Tool-agnostic agent instructions
├── Skills.md                       # Skills reference (Copilot + Claude Code)
└── README.md                       # This file
```

---

## Getting Started

### Prerequisites

- **Node.js** v18+ ([download](https://nodejs.org))
- **npm** v9+
- **GitHub Copilot** or **Claude Code** access (recommended, not required, for AI-assisted development — see [AI Agent Setup](#ai-agent-setup))

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
# Run everything
npx playwright test
# or: npm test

# Run by suite tier (see Test Strategy below)
npm run test:smoke
npm run test:functional
npm run test:regression

# Run tests in headed mode (visible browser)
npx playwright test --headed

# Run a specific test file
npx playwright test tests/home.spec.ts

# Run tests in a specific project (browser)
npx playwright test --project=chromium

# List tests without running them (sanity-check tags/config)
npx playwright test --list

# Generate and view the HTML report
npx playwright show-report
```

### Site Configuration

`site.config.json` at the repo root is the single source of truth for the site under test — its base URL and every page path. `utils/urls.ts` and `playwright.config.ts` both read from it. To point the suite at a different environment (staging, a preview deploy), don't edit `site.config.json` — override `BASE_URL` in `.env` instead:

```env
BASE_URL=https://staging.hud.io
```

### Environment Configuration

Create a `.env` file at the root (do **not** commit this) — see `.env.example`:

```env
# Optional: overrides site.config.json's baseUrl for local/staging runs
BASE_URL=https://www.hud.io
```

There is no test user account for this suite — it never logs in, registers, or submits a form (see [Testing Constraints](#testing-constraints)), so no credentials are configured anywhere.

---

## Test Strategy

Every test carries exactly one Playwright tag, applied via `{ tag: '@name' }`:

| Tag | Scope | Command |
|---|---|---|
| `@smoke` | Critical path only — does each major page load (200 + correct title), is the primary heading/CTA visible. Fast, run on every push. | `npm run test:smoke` |
| `@functional` | Feature-level behavior — correct URL after navigation, secondary content renders, nav links/hrefs are correct. Run on every PR. | `npm run test:functional` |
| `@regression` | Broader/secondary coverage — alternate viewports (mobile nav), cross-page link integrity, less-critical UI states. Run before release. | `npm run test:regression` |

See `AGENTS.md` for the full tagging rules new tests must follow, and `tests/cross-page-links.spec.ts` for an example regression suite that checks link integrity across every major page.

## Testing Constraints

This suite tests hud.io **without ever mutating it**:

- No test registers, signs up, logs in, or submits a lead-generation form (Book a Demo, Contact). Tests assert that forms and widgets render — they never click "Submit."
- No test creates, modifies, or deletes data on the live site.
- There is no test user account and no auth-related environment variables.

If a future feature genuinely needs authenticated or state-changing coverage, that's a deliberate decision to raise with the team first — not something an agent should add unilaterally.

---

## Design Principles

### Page Object Model (POM)

Every page or component of hud.io that is tested must have a corresponding **Page Object class** in the `pages/` directory. Page Objects encapsulate:

- **Locators** — element selectors for that page
- **Actions** — methods that represent user interactions (e.g., `clickBookADemo()`, `openMobileMenu()`)
- **Assertions** — methods that verify the state of the page

```ts
// Example: pages/CareersPage.ts
export class CareersPage extends BasePage {
  readonly header: HeaderComponent;
  readonly pageHeading: Locator;
  readonly jobListings: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.pageHeading = page.getByRole('heading').first();
    this.jobListings = page.locator('[class*="job"], [class*="position"]').first();
  }

  async goto(): Promise<void> {
    await super.goto(URLS.CAREERS);
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
4. **No hardcoded paths** — page paths come from `site.config.json` via `utils/urls.ts`; no hardcoded credentials either (this suite has none to begin with — see Testing Constraints).
5. **No `page.waitForTimeout()`** — use Playwright's built-in auto-waiting and `expect()` assertions.
6. **One concern per test** — tests should be atomic and independent.
7. **Clean up state** — tests must not leave behind data that affects other tests.
8. **Exactly one tag per test/describe block** — `@smoke`, `@functional`, or `@regression` (see Test Strategy above).
9. **Never submit forms or attempt auth flows** — no registration, sign-up, login, or lead-gen form submission against the live site.

### Pull Request Requirements

- PRs must include a description of what was tested and why
- All CI checks must pass before merge
- At least one reviewer approval required
- Follow the commit message format: `type(scope): description`
  - Types: `feat`, `fix`, `test`, `refactor`, `docs`, `chore`

### AI Agent Contributions

When using **GitHub Copilot**, **Claude Code**, or any AI agent to generate tests:

- Review all generated code before committing
- Ensure generated Page Objects follow the `BasePage` pattern
- Verify that generated locators use accessible selectors (`getByRole`, `getByLabel`, `getByText`) over CSS/XPath
- Run the full test suite before opening a PR

---

## AI Agent Setup

This repo is configured for both GitHub Copilot and Claude Code, sharing one source of truth (`AGENTS.md`) so conventions don't drift between tools.

### GitHub Copilot

- [`.github/copilot-instructions.md`](./.github/copilot-instructions.md) — repo-wide instructions injected into every Copilot prompt
- [`.github/instructions/`](./.github/instructions/) — path-specific instructions for `tests/`, `pages/`, and fixtures
- Manage skills with `/skills` and agent profiles with `/agent` in the Copilot CLI

### Claude Code

- [`CLAUDE.md`](./CLAUDE.md) — entry point read every session; imports `AGENTS.md` and adds Claude-specific pointers
- [`.claude/agents/`](./.claude/agents/) — project subagents: `page-object-scaffolder`, `qa-test-writer`, `qa-test-reviewer`
- [`.claude/skills/`](./.claude/skills/) — project skills: `/new-page-object`, `/new-test-suite`, `/run-tests`
- [`.claude/settings.json`](./.claude/settings.json) — permissions (allows routine `npm`/`playwright` commands, requires confirmation before editing config/CI files, blocks `.env` access)

### Both tools

- [`AGENTS.md`](./AGENTS.md) — the shared, tool-agnostic source of truth for conventions, test strategy, and testing constraints
- [`Skills.md`](./Skills.md) — human-readable skills reference for both ecosystems
- [`.github/README.md`](./.github/README.md) — full guide to everything under `.github/` and how it maps to `.claude/`

---

## License

[MIT](./LICENSE)
