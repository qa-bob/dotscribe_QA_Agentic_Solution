/**
 * tests/functional/about.spec.ts
 *
 * Functional tests for dotScribe's /about-us page.
 * Verifies the founder story content and call-to-action elements.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('About Us Page @functional', () => {
  test.beforeEach(async ({ aboutPage }) => {
    await aboutPage.navigate();
    await aboutPage.page.waitForLoadState('domcontentloaded');
  });

  // ── Page load ────────────────────────────────────────────────────────────────

  test('about page loads successfully @functional', async ({ aboutPage }) => {
    const loaded = await aboutPage.isLoaded();
    expect(loaded, '"About Us" heading should be present after navigation').toBeTruthy();
  });

  test('about page title contains dotScribe @functional', async ({ aboutPage }) => {
    const title = await aboutPage.page.title();
    expect(title.toLowerCase()).toContain('dotscribe');
  });

  test('about page URL contains /about-us @functional', async ({ aboutPage }) => {
    expect(aboutPage.page.url()).toContain('/about-us');
  });

  // ── Heading ──────────────────────────────────────────────────────────────────

  test('"About Us" heading is visible @functional', async ({ aboutPage }) => {
    await expect(aboutPage.pageHeading).toBeVisible();
  });

  test('"About Us" heading text is correct @functional', async ({ aboutPage }) => {
    const text = await aboutPage.getPageHeadingText();
    expect(text.toLowerCase()).toContain('about');
  });

  // ── Founder content ──────────────────────────────────────────────────────────

  test('founder name "Aaron Barrett" is present @functional', async ({ aboutPage }) => {
    await expect(aboutPage.founderName).toBeVisible();
  });

  test('founder patient-care quote is present @functional', async ({ aboutPage }) => {
    await expect(aboutPage.founderQuote).toBeVisible();
  });

  test('founder content is accessible @functional', async ({ aboutPage }) => {
    const hasContent = await aboutPage.hasFounderContent();
    expect(hasContent, 'Founder content should be discoverable on the About page').toBeTruthy();
  });

  // ── CTA ──────────────────────────────────────────────────────────────────────

  test('Start Free Trial CTA is present on About page @functional', async ({ aboutPage }) => {
    const count = await aboutPage.startFreeTrialLinks.count();
    expect(count, 'About page should have at least one signup CTA').toBeGreaterThan(0);
  });

  test('signup links on About page point to correct URL @functional', async ({ aboutPage }) => {
    const links = await aboutPage.startFreeTrialLinks.all();
    for (const link of links) {
      const href = await link.getAttribute('href');
      expect(href).toContain('library.dotscribe.com/signup');
    }
  });
});
