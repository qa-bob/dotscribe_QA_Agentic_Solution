/**
 * tests/functional/pricing-faq.spec.ts
 *
 * Functional tests for dotScribe's /pricing page.
 * Verifies CTA buttons, the Contact Sales option, and the FAQ section.
 * Pricing tiers are rendered as images, so plan-specific content is not tested.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('Pricing Page @functional', () => {
  test.beforeEach(async ({ pricingPage }) => {
    await pricingPage.navigate();
    await pricingPage.page.waitForLoadState('load');
  });

  // ── Page load ────────────────────────────────────────────────────────────────

  test('pricing page loads with a 200 response @functional', async ({ pricingPage }) => {
    const response = await pricingPage.page.goto(
      `${pricingPage.url.replace(/\/$/, '')}/pricing`,
      { waitUntil: 'domcontentloaded' }
    );
    expect(response?.status()).toBeLessThan(400);
  });

  test('pricing page title contains dotScribe @functional', async ({ pricingPage }) => {
    const title = await pricingPage.page.title();
    expect(title.toLowerCase()).toContain('dotscribe');
  });

  // ── CTA buttons ──────────────────────────────────────────────────────────────

  test('at least one Start Free Trial CTA is present @functional', async ({ pricingPage }) => {
    const count = await pricingPage.getStartFreeTrialCount();
    expect(count, 'Pricing page should have at least one Start Free Trial link').toBeGreaterThan(0);
  });

  test('all Start Free Trial links point to signup page @functional', async ({ pricingPage }) => {
    const links = await pricingPage.startFreeTrialLinks.all();
    for (const link of links) {
      const href = await link.getAttribute('href');
      expect(href).toContain('library.dotscribe.com/signup');
    }
  });

  test('Contact Sales option is present @functional', async ({ pricingPage }) => {
    const hasContact = await pricingPage.hasContactSalesOption();
    expect(hasContact, 'Pricing page should have a Contact Sales link').toBeTruthy();
  });

  test('Contact Sales link uses the correct email @functional', async ({ pricingPage }) => {
    const href = await pricingPage.contactSalesLink.getAttribute('href');
    expect(href).toContain('team@dotscribe.com');
  });

  // ── FAQ section ───────────────────────────────────────────────────────────────

  test('FAQ question "What makes dotScribe different?" is present @functional', async ({
    pricingPage,
  }) => {
    await pricingPage.faqDifferent.scrollIntoViewIfNeeded();
    await expect(pricingPage.faqDifferent).toBeVisible();
  });

  test('FAQ question about HIPAA compliance is present @functional', async ({ pricingPage }) => {
    await pricingPage.faqHipaa.scrollIntoViewIfNeeded();
    await expect(pricingPage.faqHipaa).toBeVisible();
  });

  test('FAQ question about EHR integration is present @functional', async ({ pricingPage }) => {
    await pricingPage.faqEhr.scrollIntoViewIfNeeded();
    await expect(pricingPage.faqEhr).toBeVisible();
  });

  test('FAQ question about cancellation is present @functional', async ({ pricingPage }) => {
    await pricingPage.faqCancel.scrollIntoViewIfNeeded();
    await expect(pricingPage.faqCancel).toBeVisible();
  });

  test('multiple FAQ questions are present on the pricing page @functional', async ({
    pricingPage,
  }) => {
    const questions = await pricingPage.getVisibleFaqQuestions();
    expect(
      questions.length,
      'Pricing page FAQ should contain multiple discoverable questions'
    ).toBeGreaterThanOrEqual(3);
  });

  // ── FAQ interactivity (expand/collapse) ──────────────────────────────────────

  test('clicking a FAQ item does not navigate away from pricing page @functional', async ({
    pricingPage,
    page,
  }) => {
    const urlBefore = page.url();
    await pricingPage.toggleFaqItem('What makes dotScribe different?');
    // Allow brief render time for accordion animation
    await page.waitForLoadState('domcontentloaded');
    const urlAfter = page.url();
    expect(urlAfter).toContain('/pricing');
    expect(urlAfter).toBe(urlBefore);
  });
});
