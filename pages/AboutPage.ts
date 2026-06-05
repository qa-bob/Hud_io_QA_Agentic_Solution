import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { HeaderComponent } from './components/HeaderComponent';
import { URLS } from '../utils/urls';

export class AboutPage extends BasePage {
  readonly header: HeaderComponent;

  readonly pageHeading: Locator;
  readonly missionStatement: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);

    this.pageHeading = page.getByRole('heading').first();
    this.missionStatement = page.getByText('We believe', { exact: false });
  }

  async goto(): Promise<void> {
    await super.goto(URLS.ABOUT);
  }
}
