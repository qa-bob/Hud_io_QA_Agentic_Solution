import { test, expect } from '../fixtures/base.fixture';
import { URLS } from '../utils/urls';

test.describe('Navigation — Desktop', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
  });

  test('should display the Hud logo in the header', async ({ homePage }) => {
    await expect(homePage.header.logo).toBeVisible();
  });

  test('should navigate to the Blog page via the header nav link', async ({ page, homePage }) => {
    await homePage.header.clickBlog();
    await expect(page).toHaveURL(new RegExp(URLS.BLOG));
  });

  test('should navigate to the About Us page via the header nav link', async ({ page, homePage }) => {
    await homePage.header.clickAbout();
    await expect(page).toHaveURL(new RegExp(URLS.ABOUT));
  });

  test('should have the Docs link pointing to docs.hud.io', async ({ homePage }) => {
    const href = await homePage.header.getDocsHref();
    expect(href).toContain('docs.hud.io');
  });

  test('should have the Log in link pointing to app.hud.io', async ({ homePage }) => {
    const href = await homePage.header.getLoginHref();
    expect(href).toContain('app.hud.io');
  });

  test('should navigate to the Book a Demo page via the header CTA', async ({ page, homePage }) => {
    await homePage.header.clickBookADemo();
    await expect(page).toHaveURL(new RegExp(URLS.BOOK_A_DEMO));
  });
});

test.describe('Navigation — Mobile Menu', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
  });

  test('should display the mobile menu toggle button', async ({ homePage }) => {
    await expect(homePage.header.menuToggle).toBeVisible();
  });

  test('should open the mobile navigation drawer when the menu toggle is clicked', async ({ homePage }) => {
    await homePage.header.openMobileMenu();
    await expect(homePage.header.mobileDrawer).not.toHaveAttribute('aria-hidden', 'true');
  });

  test('should show Blog link in the mobile nav after opening the menu', async ({ homePage }) => {
    await homePage.header.openMobileMenu();
    await expect(homePage.header.mobileBlogLink).toBeVisible();
  });

  test('should show About us link in the mobile nav after opening the menu', async ({ homePage }) => {
    await homePage.header.openMobileMenu();
    await expect(homePage.header.mobileAboutLink).toBeVisible();
  });

  test('should show the Book a demo CTA in the mobile nav after opening the menu', async ({ homePage }) => {
    await homePage.header.openMobileMenu();
    await expect(homePage.header.mobileBookADemoCta).toBeVisible();
  });
});
