import { test, expect } from '../fixtures/base.fixture';
import { URLS } from '../utils/urls';

test.describe('Contact Us Page', () => {
  test.beforeEach(async ({ contactPage }) => {
    await contactPage.goto();
  });

  test('should load the contact-us page with a 200 status', async ({ page }) => {
    const response = await page.goto(URLS.CONTACT);
    expect(response?.status()).toBe(200);
  });

  test('should display the correct page title', async ({ page }) => {
    await expect(page).toHaveTitle(/Hud/i);
  });

  test('should have the contact-us URL', async ({ page }) => {
    await expect(page).toHaveURL(new RegExp(URLS.CONTACT));
  });

  test('should display the main content area', async ({ contactPage }) => {
    await expect(contactPage.bodyContent).toBeVisible();
  });

  test('should display a page heading', async ({ contactPage }) => {
    await expect(contactPage.pageHeading).toBeVisible();
  });
});
