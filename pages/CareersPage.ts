import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { HeaderComponent } from './components/HeaderComponent';
import { URLS } from '../utils/urls';

export class CareersPage extends BasePage {
  readonly header: HeaderComponent;

  readonly pageHeading: Locator;
  readonly jobListings: Locator;
  readonly bodyContent: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);

    this.pageHeading = page.getByRole('heading').first();
    this.jobListings = page.locator('[class*="job"], [class*="position"], [class*="career"], [class*="opening"]').first();
    this.bodyContent = page.locator('main');
  }

  async goto(): Promise<void> {
    await super.goto(URLS.CAREERS);
  }
}
