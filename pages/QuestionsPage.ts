import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { HeaderComponent } from './components/HeaderComponent';
import { URLS } from '../utils/urls';

export class QuestionsPage extends BasePage {
  readonly header: HeaderComponent;

  readonly pageHeading: Locator;
  readonly faqItems: Locator;
  readonly bodyContent: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);

    this.pageHeading = page.getByRole('heading').first();
    this.faqItems = page.locator('[class*="question"], [class*="faq"], [class*="accordion"], details').first();
    this.bodyContent = page.locator('main');
  }

  async goto(): Promise<void> {
    await super.goto(URLS.QUESTIONS);
  }
}
