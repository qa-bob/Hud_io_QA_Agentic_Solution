import { test, expect } from '../fixtures/base.fixture';
import { URLS } from '../utils/urls';

test.describe('Questions / FAQ Page', () => {
  test.beforeEach(async ({ questionsPage }) => {
    await questionsPage.goto();
  });

  test('should load the questions page with a 200 status', async ({ page }) => {
    const response = await page.goto(URLS.QUESTIONS);
    expect(response?.status()).toBe(200);
  });

  test('should display the correct page title', async ({ page }) => {
    await expect(page).toHaveTitle(/Hud/i);
  });

  test('should have the questions URL', async ({ page }) => {
    await expect(page).toHaveURL(new RegExp(URLS.QUESTIONS));
  });

  test('should display the main content area', async ({ questionsPage }) => {
    await expect(questionsPage.bodyContent).toBeVisible();
  });

  test('should display a page heading', async ({ questionsPage }) => {
    await expect(questionsPage.pageHeading).toBeVisible();
  });
});
