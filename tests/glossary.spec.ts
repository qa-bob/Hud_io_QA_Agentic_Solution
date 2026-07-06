import { test, expect } from '../fixtures/base.fixture';
import { URLS } from '../utils/urls';

test.describe('Glossary Page', () => {
  test.beforeEach(async ({ glossaryPage }) => {
    await glossaryPage.goto();
  });

  test('should load the glossary page with a 200 status', { tag: '@smoke' }, async ({ page }) => {
    const response = await page.goto(URLS.GLOSSARY);
    expect(response?.status()).toBe(200);
  });

  test('should display the correct page title', { tag: '@smoke' }, async ({ page }) => {
    await expect(page).toHaveTitle(/Hud/i);
  });

  test('should have the glossary URL', { tag: '@functional' }, async ({ page }) => {
    await expect(page).toHaveURL(new RegExp(URLS.GLOSSARY));
  });

  test('should display the main content area', { tag: '@functional' }, async ({ glossaryPage }) => {
    await expect(glossaryPage.bodyContent).toBeVisible();
  });

  test('should display a page heading', { tag: '@functional' }, async ({ glossaryPage }) => {
    await expect(glossaryPage.pageHeading).toBeVisible();
  });
});
