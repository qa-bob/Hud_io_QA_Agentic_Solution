import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import siteConfig from './site.config.json';

dotenv.config();

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
  ],

  use: {
    // site.config.json is the source of truth for the site under test;
    // BASE_URL in .env overrides it for local/staging runs. `||` (not `??`) is
    // deliberate: an empty-string env var (e.g. an unset GitHub Actions secret,
    // which interpolates to "" rather than being unset) must also fall through.
    baseURL: process.env.BASE_URL || siteConfig.site.baseUrl,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
