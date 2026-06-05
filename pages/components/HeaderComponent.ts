import { Page, Locator } from '@playwright/test';
import { URLS } from '../../utils/urls';

export class HeaderComponent {
  readonly page: Page;

  // Desktop nav
  readonly logo: Locator;
  readonly blogLink: Locator;
  readonly docsLink: Locator;
  readonly aboutLink: Locator;
  readonly bookADemoCta: Locator;
  readonly loginLink: Locator;

  // Mobile
  readonly menuToggle: Locator;
  readonly mobileDrawer: Locator;
  readonly mobileBlogLink: Locator;
  readonly mobileDocsLink: Locator;
  readonly mobileAboutLink: Locator;
  readonly mobileBookADemoCta: Locator;
  readonly mobileLoginLink: Locator;

  constructor(page: Page) {
    this.page = page;

    this.logo = page.locator('.header__logo');
    this.blogLink = page.locator('.header__nav.-desktop .header__nav-link', { hasText: 'Blog' });
    this.docsLink = page.locator('.header__nav.-desktop .header__nav-link', { hasText: 'Docs' });
    this.aboutLink = page.locator('.header__nav.-desktop .header__nav-link', { hasText: 'About us' });
    this.bookADemoCta = page.locator('.header__actions.-desktop .wp-block-button__link', { hasText: 'Book a demo' });
    this.loginLink = page.locator('.header__login:not(.-drawer)');

    this.menuToggle = page.locator('.header__menu-toggle');
    this.mobileDrawer = page.locator('.header__drawer');
    this.mobileBlogLink = page.locator('.header__nav.-drawer .header__nav-link', { hasText: 'Blog' });
    this.mobileDocsLink = page.locator('.header__nav.-drawer .header__nav-link', { hasText: 'Docs' });
    this.mobileAboutLink = page.locator('.header__nav.-drawer .header__nav-link', { hasText: 'About us' });
    this.mobileBookADemoCta = page.locator('.header__cta.-drawer .wp-block-button__link');
    this.mobileLoginLink = page.locator('.header__login.-drawer');
  }

  async openMobileMenu(): Promise<void> {
    await this.menuToggle.click();
  }

  async closeMobileMenu(): Promise<void> {
    await this.menuToggle.click();
  }

  async clickLogo(): Promise<void> {
    await this.logo.click();
  }

  async clickBlog(): Promise<void> {
    await this.blogLink.click();
  }

  async clickAbout(): Promise<void> {
    await this.aboutLink.click();
  }

  async clickBookADemo(): Promise<void> {
    await this.bookADemoCta.click();
  }

  getDocsHref(): Promise<string | null> {
    return this.docsLink.getAttribute('href');
  }

  getLoginHref(): Promise<string | null> {
    return this.loginLink.getAttribute('href');
  }
}
