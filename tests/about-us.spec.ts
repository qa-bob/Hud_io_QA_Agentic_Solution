import { test, expect } from '../fixtures/base.fixture';
import { URLS } from '../utils/urls';

test.describe('About Us Page', () => {
  test.beforeEach(async ({ aboutPage }) => {
    await aboutPage.goto();
  });

  test('should load the about us page with a 200 status', async ({ page }) => {
    const response = await page.goto(URLS.ABOUT);
    expect(response?.status()).toBe(200);
  });

  test('should display the correct page title', async ({ page }) => {
    await expect(page).toHaveTitle(/Hud/i);
  });

  test('should have the about-us URL', async ({ page }) => {
    await expect(page).toHaveURL(new RegExp(URLS.ABOUT));
  });

  test('should display the mission statement', async ({ aboutPage }) => {
    await expect(aboutPage.missionStatement).toBeVisible();
  });

  test('should display a page heading', async ({ aboutPage }) => {
    await expect(aboutPage.pageHeading).toBeVisible();
  });
});
