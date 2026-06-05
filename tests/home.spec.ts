import { test, expect } from '../fixtures/base.fixture';

test.describe('Home Page', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
  });

  test('should display the correct page title', async ({ page }) => {
    await expect(page).toHaveTitle(/Hud/i);
  });

  test('should display the hero heading containing "Runtime Intelligence"', async ({ homePage }) => {
    await expect(homePage.heroHeading).toBeVisible();
    await expect(homePage.heroHeading).toContainText('Runtime Intelligence');
  });

  test('should display the "Book a demo" primary CTA button in the hero', async ({ homePage }) => {
    await expect(homePage.bookADemoHeroCta).toBeVisible();
  });

  test('should display the "See how it works" secondary CTA button in the hero', async ({ homePage }) => {
    await expect(homePage.seeHowItWorksCta).toBeVisible();
  });

  test('should display the customer logo carousel', async ({ homePage }) => {
    await expect(homePage.logoCarousel).toBeVisible();
  });

  test('should display at least one customer logo in the carousel', async ({ homePage }) => {
    const count = await homePage.logoCarouselItems.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should display the hero description text', async ({ homePage }) => {
    await expect(homePage.heroDescription).toBeVisible();
    await expect(homePage.heroDescription).not.toBeEmpty();
  });
});
