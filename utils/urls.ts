import siteConfig from '../site.config.json';

/**
 * Single source of truth for the site under test lives in `site.config.json`
 * at the repo root. Update paths there — not here — when hud.io's IA changes.
 */
export const SITE = siteConfig.site;

export const URLS = {
  HOME: siteConfig.pages.home,
  BLOG: siteConfig.pages.blog,
  ABOUT: siteConfig.pages.about,
  BOOK_A_DEMO: siteConfig.pages.bookADemo,
  CONTACT: siteConfig.pages.contact,
  CAREERS: siteConfig.pages.careers,
  GLOSSARY: siteConfig.pages.glossary,
  QUESTIONS: siteConfig.pages.questions,
  THANK_YOU: siteConfig.pages.thankYou,

  // External — used for href assertions only, never navigated to
  EXTERNAL_DOCS: siteConfig.external.docs,
  EXTERNAL_APP: siteConfig.external.app,
} as const;
