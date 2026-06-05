import { test as base } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { BlogPage } from '../pages/BlogPage';
import { AboutPage } from '../pages/AboutPage';
import { BookADemoPage } from '../pages/BookADemoPage';
import { ContactPage } from '../pages/ContactPage';
import { CareersPage } from '../pages/CareersPage';
import { GlossaryPage } from '../pages/GlossaryPage';
import { QuestionsPage } from '../pages/QuestionsPage';

type PageFixtures = {
  homePage: HomePage;
  blogPage: BlogPage;
  aboutPage: AboutPage;
  bookADemoPage: BookADemoPage;
  contactPage: ContactPage;
  careersPage: CareersPage;
  glossaryPage: GlossaryPage;
  questionsPage: QuestionsPage;
};

export const test = base.extend<PageFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  blogPage: async ({ page }, use) => {
    await use(new BlogPage(page));
  },
  aboutPage: async ({ page }, use) => {
    await use(new AboutPage(page));
  },
  bookADemoPage: async ({ page }, use) => {
    await use(new BookADemoPage(page));
  },
  contactPage: async ({ page }, use) => {
    await use(new ContactPage(page));
  },
  careersPage: async ({ page }, use) => {
    await use(new CareersPage(page));
  },
  glossaryPage: async ({ page }, use) => {
    await use(new GlossaryPage(page));
  },
  questionsPage: async ({ page }, use) => {
    await use(new QuestionsPage(page));
  },
});

export { expect } from '@playwright/test';
