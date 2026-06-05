import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { HeaderComponent } from './components/HeaderComponent';
import { URLS } from '../utils/urls';

export class HomePage extends BasePage {
  readonly header: HeaderComponent;

  // Hero section
  readonly heroHeading: Locator;
  readonly heroDescription: Locator;
  readonly bookADemoHeroCta: Locator;
  readonly seeHowItWorksCta: Locator;

  // Logo carousel
  readonly logoCarousel: Locator;
  readonly logoCarouselItems: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);

    this.heroHeading = page.locator('.hero__intro h1');
    this.heroDescription = page.locator('.hero__intro p').first();
    this.bookADemoHeroCta = page.locator('.hero__buttons .wp-block-button__link', { hasText: 'Book a demo' });
    this.seeHowItWorksCta = page.locator('.hero__buttons .wp-block-button__link', { hasText: 'See how it works' });

    this.logoCarousel = page.locator('.hero__logotypes');
    this.logoCarouselItems = page.locator('.hero__logotypes-item');
  }

  async goto(): Promise<void> {
    await super.goto(URLS.HOME);
  }
}
