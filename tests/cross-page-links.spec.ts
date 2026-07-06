import { test, expect } from '../fixtures/base.fixture';
import { URLS } from '../utils/urls';

// Broader, slower-running checks that don't need to run on every commit:
// every major page resolves without error, and the header's external links
// stay consistent regardless of which page they're rendered on.
test.describe('Cross-Page Link Integrity', { tag: '@regression' }, () => {
  const majorPages: Array<[string, string]> = [
    ['home', URLS.HOME],
    ['blog', URLS.BLOG],
    ['about-us', URLS.ABOUT],
    ['book-a-demo', URLS.BOOK_A_DEMO],
    ['contact-us', URLS.CONTACT],
    ['careers', URLS.CAREERS],
    ['glossary', URLS.GLOSSARY],
    ['questions', URLS.QUESTIONS],
  ];

  for (const [name, path] of majorPages) {
    test(`should load the ${name} page without a client or server error`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status(), `${path} should not 4xx/5xx`).toBeLessThan(400);
    });
  }

  test('should point the header Docs link at docs.hud.io from the About Us page', async ({ aboutPage }) => {
    await aboutPage.goto();
    const href = await aboutPage.header.getDocsHref();
    expect(href).toContain('docs.hud.io');
  });

  test('should point the header Log in link at app.hud.io from the Blog page', async ({ blogPage }) => {
    await blogPage.goto();
    const href = await blogPage.header.getLoginHref();
    expect(href).toContain('app.hud.io');
  });

  test('should display the header logo consistently across every major page', async ({ homePage, aboutPage, blogPage, careersPage }) => {
    for (const target of [homePage, aboutPage, blogPage, careersPage]) {
      await target.goto();
      await expect(target.header.logo).toBeVisible();
    }
  });

  // NOTE: External links (docs.hud.io, app.hud.io) are asserted by href only —
  // this suite never navigates to them or to third-party domains.
});
