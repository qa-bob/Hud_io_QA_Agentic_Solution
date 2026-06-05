import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { HeaderComponent } from './components/HeaderComponent';
import { URLS } from '../utils/urls';

export class BookADemoPage extends BasePage {
  readonly header: HeaderComponent;

  readonly pageHeading: Locator;
  readonly formOrWidget: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);

    this.pageHeading = page.getByRole('heading').first();
    // The demo page may use a third-party calendar embed or a form
    this.formOrWidget = page.locator('form, iframe, [class*="calendar"], [class*="demo"], [class*="form"]').first();
  }

  async goto(): Promise<void> {
    await super.goto(URLS.BOOK_A_DEMO);
  }
}
