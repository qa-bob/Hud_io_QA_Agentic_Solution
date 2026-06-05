---
applyTo: "pages/**/*.ts"
---

# Page Object Model (POM) Instructions

These instructions apply when writing or modifying Page Object classes in the `pages/` directory.

## Page Object Conventions

- Every Page Object class must extend `BasePage` from `./BasePage`.
- The `constructor` must accept a Playwright `Page` parameter and pass it to `super(page)`.
- Locators are defined as `readonly` class properties using `this.page.getBy*()` APIs.
- Actions are `async` methods that return `Promise<void>` (or a specific type if they return data).
- Name the class `<PageName>Page` matching the hud.io page it represents.
- Name the file `<PageName>Page.ts` (PascalCase).

## Locator Strategy

Use this priority order for selectors (most resilient to least):

1. `this.page.getByRole('role', { name: '...' })`
2. `this.page.getByLabel('...')`
3. `this.page.getByText('...')`
4. `this.page.getByTestId('...')`
5. `this.page.locator('css-selector')` — last resort only

## Template

```ts
import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ExamplePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Locators
  readonly pageHeading = this.page.getByRole('heading', { name: 'Example' });
  readonly submitButton = this.page.getByRole('button', { name: 'Submit' });
  readonly emailInput = this.page.getByLabel('Email');

  // Navigation
  async goto(): Promise<void> {
    await this.page.goto('/example');
  }

  // Actions
  async clickSubmit(): Promise<void> {
    await this.submitButton.click();
  }

  async fillEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }
}
```

## What NOT to Do

- Do not add `page.waitForTimeout()` calls.
- Do not put `expect()` assertions in test files that bypass the Page Object.
- Do not duplicate locators across multiple Page Objects — extract to a shared component class if reused.
- Do not put test logic or assertion logic in the Page Object unless it's a page-level guard check.
