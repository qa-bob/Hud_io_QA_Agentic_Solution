# Skills.md — GitHub Copilot Skills Reference

This file documents the **skills** relevant to contributing to and extending this repository. It serves as a reference for both human contributors and AI agents (GitHub Copilot) to understand what capabilities and domain knowledge are required or available.

---

## What Are Skills?

In the context of GitHub Copilot CLI, **skills** are specialized capabilities that can be invoked to help complete tasks more effectively. You can manage skills via:

```bash
# Browse and manage available skills
/skills
```

Skills augment the default Copilot experience by adding focused domain expertise — for example, a skill that knows how to scaffold a new Playwright Page Object, or one that knows how to interpret a failing test report.

---

## Required Skills for This Repository

### 1. Playwright Test Automation

**Domain:** Browser automation, end-to-end testing

**What Copilot should know:**
- Playwright API: `page`, `expect`, `locator`, `BrowserContext`, `Page`
- Auto-waiting behavior — Playwright waits for elements before interacting
- Test isolation — each test gets a fresh browser context by default
- Parallelism — tests run in parallel by default; write tests accordingly
- Fixtures — `test.extend()` for custom fixtures in `fixtures/`
- Configuration — `playwright.config.ts` controls browsers, retries, reporters

**Key Playwright APIs used in this project:**
```ts
// Navigation
await page.goto('/path');

// Locators (see AGENTS.md for priority order)
page.getByRole('button', { name: 'Submit' })
page.getByLabel('Email')
page.getByText('Welcome')

// Assertions
await expect(locator).toBeVisible();
await expect(locator).toHaveText('...');
await expect(page).toHaveURL('/dashboard');

// Actions
await locator.click();
await locator.fill('value');
await locator.selectOption('value');
```

---

### 2. Page Object Model (POM)

**Domain:** Test architecture, design patterns

**What Copilot should know:**
- POM separates test logic from UI interaction code
- Each page of the application has one corresponding class in `pages/`
- Page classes extend `BasePage` and receive a Playwright `Page` instance
- Locators are class properties; actions are class methods
- Test files import and use Page Objects — never interact with `page` directly in tests

**Scaffold a new Page Object:**
```ts
import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class <PageName>Page extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Define locators as readonly class properties
  readonly <locatorName> = this.page.getByRole('<role>', { name: '<name>' });

  // Define actions as async methods
  async <actionName>(): Promise<void> {
    await this.<locatorName>.click();
  }
}
```

---

### 3. TypeScript

**Domain:** Language, type safety

**What Copilot should know:**
- All files in this repo are TypeScript (`.ts`)
- Use `async/await` for all Playwright calls
- Use `readonly` for locator properties in Page Objects
- Use `process.env.VARIABLE_NAME` for environment variables (with `!` assertion when certain they exist)
- Avoid `any` types — use Playwright's built-in types (`Page`, `Locator`, `BrowserContext`)

---

### 4. Test Data Management

**Domain:** Test fixtures, data generation

**What Copilot should know:**
- Test data lives in `fixtures/` or is generated inline using utilities from `utils/`
- **Never hardcode credentials** — use environment variables
- For reusable test setup, use Playwright's `test.extend()` fixtures pattern
- Prefer test data isolation — each test creates its own data where possible

---

### 5. GitHub Copilot CLI & Agentic Workflows

**Domain:** AI-assisted development, Copilot configuration

**What Copilot should know:**
- This repo uses `AGENTS.md` for agent-wide instructions
- Path-specific instructions are in `.github/instructions/`
- Repo-wide instructions are in `.github/copilot-instructions.md`
- Use `/skills` to see available CLI skills
- Use `/agent` to switch between specialized agent profiles
- The `/delegate` command can send a task to a Copilot cloud agent to create a PR

---

## Skill Usage Tips

| Task | Recommended Approach |
|---|---|
| Add a new test for a page | Ask Copilot to scaffold a Page Object first, then write the spec |
| Debug a flaky test | Ask Copilot to analyze the test and suggest more resilient locators or waits |
| Refactor locators | Ask Copilot to update all usages of a locator across Page Objects |
| Generate test data | Ask Copilot to create a utility function in `utils/` |
| Review a test PR | Use `/review` slash command in Copilot CLI |
| Research a hud.io feature | Use the **Research** agent via `/agent` |

---

## Adding a Custom Skill

To add a custom skill to Copilot CLI for this project:

1. Run `/skills` in the Copilot CLI
2. Follow prompts to define the skill's name, description, and behavior
3. Document the skill in this file under a new section

Custom skills are stored locally and can be shared with the team by documenting them here and providing setup instructions.

---

## Further Reading

- [GitHub Copilot CLI Docs](https://docs.github.com/copilot/how-tos/use-copilot-agents/use-copilot-cli)
- [Playwright Docs](https://playwright.dev/docs/intro)
- [Page Object Model with Playwright](https://playwright.dev/docs/pom)
- [Custom Instructions Guide](https://docs.github.com/copilot/how-tos/copilot-cli/add-custom-instructions)
