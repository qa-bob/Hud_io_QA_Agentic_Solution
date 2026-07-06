import { test, expect } from '../fixtures/base.fixture';
import { URLS } from '../utils/urls';

test.describe('Careers Page', () => {
  test.beforeEach(async ({ careersPage }) => {
    await careersPage.goto();
  });

  test('should load the careers page with a 200 status', { tag: '@smoke' }, async ({ page }) => {
    const response = await page.goto(URLS.CAREERS);
    expect(response?.status()).toBe(200);
  });

  test('should display the correct page title', { tag: '@smoke' }, async ({ page }) => {
    await expect(page).toHaveTitle(/Hud/i);
  });

  test('should have the careers URL', { tag: '@functional' }, async ({ page }) => {
    await expect(page).toHaveURL(new RegExp(URLS.CAREERS));
  });

  test('should display the main content area', { tag: '@functional' }, async ({ careersPage }) => {
    await expect(careersPage.bodyContent).toBeVisible();
  });

  test('should display a page heading', { tag: '@functional' }, async ({ careersPage }) => {
    await expect(careersPage.pageHeading).toBeVisible();
  });
});
