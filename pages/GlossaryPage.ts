import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { HeaderComponent } from './components/HeaderComponent';
import { URLS } from '../utils/urls';

export class GlossaryPage extends BasePage {
  readonly header: HeaderComponent;

  readonly pageHeading: Locator;
  readonly glossaryTerms: Locator;
  readonly bodyContent: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);

    this.pageHeading = page.getByRole('heading').first();
    this.glossaryTerms = page.locator('[class*="glossary"], [class*="term"], dt, .entry-content h2, .entry-content h3').first();
    this.bodyContent = page.locator('main');
  }

  async goto(): Promise<void> {
    await super.goto(URLS.GLOSSARY);
  }
}
