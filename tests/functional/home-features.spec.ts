/**
 * tests/functional/home-features.spec.ts
 *
 * Functional tests for dotScribe's homepage.
 * Verifies hero content, CTA buttons, specialty feature sections, AI features,
 * HIPAA messaging, footer links, and social media presence.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('Homepage Features @functional', () => {
  // homePage fixture auto-navigates to site root

  // ── Hero ────────────────────────────────────────────────────────────────────

  test('hero h1 heading is visible @functional', async ({ homePage }) => {
    await expect(homePage.heroHeading).toBeVisible();
  });

  test('hero heading references dotScribe brand @functional', async ({ homePage }) => {
    const text = await homePage.heroHeading.textContent();
    expect(text?.toLowerCase()).toMatch(/dotscribe|describe/i);
  });

  test('hero h2 subheading is visible @functional', async ({ homePage }) => {
    await expect(homePage.heroSubheading).toBeVisible();
  });

  // ── Signup / CTA ────────────────────────────────────────────────────────────

  test('multiple signup CTA links are present on homepage @functional', async ({ homePage }) => {
    const count = await homePage.getSignupLinkCount();
    expect(count, 'Homepage should have at least 2 signup CTA links').toBeGreaterThanOrEqual(2);
  });

  test('sign-in link is present in header @functional', async ({ homePage }) => {
    await expect(homePage.signInLink).toBeVisible();
  });

  test('all signup links point to the correct domain @functional', async ({ homePage }) => {
    const links = await homePage.getCTAButtons();
    for (const link of links) {
      const href = await link.getAttribute('href');
      expect(href, 'Signup CTA should link to library.dotscribe.com/signup').toContain(
        'library.dotscribe.com/signup'
      );
    }
  });

  // ── Specialty feature sections ───────────────────────────────────────────────

  test('Outpatient & Telehealth section is present @functional', async ({ homePage }) => {
    await homePage.outpatientSection.scrollIntoViewIfNeeded();
    await expect(homePage.outpatientSection).toBeVisible();
  });

  test('Inpatient & Surgical section is present @functional', async ({ homePage }) => {
    await homePage.inpatientSection.scrollIntoViewIfNeeded();
    await expect(homePage.inpatientSection).toBeVisible();
  });

  test('Emergency Medicine section is present @functional', async ({ homePage }) => {
    await homePage.emergencySection.scrollIntoViewIfNeeded();
    await expect(homePage.emergencySection).toBeVisible();
  });

  test('Students & Residents section is present @functional', async ({ homePage }) => {
    await homePage.studentsSection.scrollIntoViewIfNeeded();
    await expect(homePage.studentsSection).toBeVisible();
  });

  // ── AI features ──────────────────────────────────────────────────────────────

  test('AI-assistance section heading is present @functional', async ({ homePage }) => {
    await homePage.aiAssistanceSection.scrollIntoViewIfNeeded();
    await expect(homePage.aiAssistanceSection).toBeVisible();
  });

  test('dotphrase section is present @functional', async ({ homePage }) => {
    await homePage.dotphraseSection.scrollIntoViewIfNeeded();
    await expect(homePage.dotphraseSection).toBeVisible();
  });

  // ── Value propositions ───────────────────────────────────────────────────────

  test('HIPAA compliance mention is visible @functional', async ({ homePage }) => {
    await homePage.hipaaText.scrollIntoViewIfNeeded();
    await expect(homePage.hipaaText).toBeVisible();
  });

  // ── Footer ───────────────────────────────────────────────────────────────────

  test('footer Privacy link is present @functional', async ({ homePage }) => {
    await homePage.privacyLink.scrollIntoViewIfNeeded();
    await expect(homePage.privacyLink).toBeVisible();
  });

  test('footer Terms link is present @functional', async ({ homePage }) => {
    await homePage.termsLink.scrollIntoViewIfNeeded();
    await expect(homePage.termsLink).toBeVisible();
  });

  test('footer Support link is present @functional', async ({ homePage }) => {
    await homePage.supportLink.scrollIntoViewIfNeeded();
    await expect(homePage.supportLink).toBeVisible();
  });

  // ── Social media ──────────────────────────────────────────────────────────────

  test('social media links are present (Instagram, Facebook, LinkedIn) @functional', async ({
    homePage,
  }) => {
    const hrefs = await homePage.getSocialLinkHrefs();
    expect(hrefs.length, 'At least 3 social media links expected').toBeGreaterThanOrEqual(3);
    expect(hrefs.some((h) => h.includes('instagram.com'))).toBeTruthy();
    expect(hrefs.some((h) => h.includes('facebook.com'))).toBeTruthy();
    expect(hrefs.some((h) => h.includes('linkedin.com'))).toBeTruthy();
  });

  // ── Page load quality ────────────────────────────────────────────────────────

  test('homepage reports as fully loaded @functional', async ({ homePage }) => {
    const loaded = await homePage.isLoaded();
    expect(loaded, 'HomePage.isLoaded() should return true').toBeTruthy();
  });
});
