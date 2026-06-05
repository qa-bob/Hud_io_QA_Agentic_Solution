import { test, expect } from '../fixtures/base.fixture';
import { URLS } from '../utils/urls';

test.describe('Blog Page', () => {
  test.beforeEach(async ({ blogPage }) => {
    await blogPage.goto();
  });

  test('should load the blog page with a 200 status', async ({ page }) => {
    const response = await page.goto(URLS.BLOG);
    expect(response?.status()).toBe(200);
  });

  test('should display the correct page title', async ({ page }) => {
    await expect(page).toHaveTitle(/Hud/i);
  });

  test('should have the blog URL', async ({ page }) => {
    await expect(page).toHaveURL(new RegExp(URLS.BLOG));
  });

  test('should display the main content area', async ({ blogPage }) => {
    await expect(blogPage.bodyContent).toBeVisible();
  });
});
