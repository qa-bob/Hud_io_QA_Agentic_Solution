import { test, expect } from '../fixtures/base.fixture';
import { URLS } from '../utils/urls';

test.describe('Glossary Page', () => {
  test.beforeEach(async ({ glossaryPage }) => {
    await glossaryPage.goto();
  });

  test('should load the glossary page with a 200 status', async ({ page }) => {
    const response = await page.goto(URLS.GLOSSARY);
    expect(response?.status()).toBe(200);
  });

  test('should display the correct page title', async ({ page }) => {
    await expect(page).toHaveTitle(/Hud/i);
  });

  test('should have the glossary URL', async ({ page }) => {
    await expect(page).toHaveURL(new RegExp(URLS.GLOSSARY));
  });

  test('should display the main content area', async ({ glossaryPage }) => {
    await expect(glossaryPage.bodyContent).toBeVisible();
  });

  test('should display a page heading', async ({ glossaryPage }) => {
    await expect(glossaryPage.pageHeading).toBeVisible();
  });
});
