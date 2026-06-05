import { test, expect } from '../fixtures/base.fixture';
import { URLS } from '../utils/urls';

test.describe('Book a Demo Page', () => {
  test.beforeEach(async ({ bookADemoPage }) => {
    await bookADemoPage.goto();
  });

  test('should load the book-a-demo page with a 200 status', async ({ page }) => {
    const response = await page.goto(URLS.BOOK_A_DEMO);
    expect(response?.status()).toBe(200);
  });

  test('should display the correct page title', async ({ page }) => {
    await expect(page).toHaveTitle(/Book a demo|Hud/i);
  });

  test('should have the book-a-demo URL', async ({ page }) => {
    await expect(page).toHaveURL(new RegExp(URLS.BOOK_A_DEMO));
  });

  test('should display a page heading', async ({ bookADemoPage }) => {
    await expect(bookADemoPage.pageHeading).toBeVisible();
  });

  test('should display a form or booking widget', async ({ bookADemoPage }) => {
    await expect(bookADemoPage.formOrWidget).toBeVisible({ timeout: 10_000 });
  });

  // NOTE: We intentionally do NOT submit the form to avoid creating real demo requests
});
