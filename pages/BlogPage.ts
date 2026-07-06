import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { HeaderComponent } from './components/HeaderComponent';
import { URLS } from '../utils/urls';

export class BlogPage extends BasePage {
  readonly header: HeaderComponent;

  readonly pageHeading: Locator;
  readonly articleList: Locator;
  readonly firstArticle: Locator;
  readonly bodyContent: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);

    this.pageHeading = page.getByRole('heading').first();
    this.articleList = page.locator('article, .post, .blog-post, .entry').first();
    this.firstArticle = page.locator('article').first();
    this.bodyContent = page.locator('main');
  }

  async goto(): Promise<void> {
    await super.goto(URLS.BLOG);
  }
}
