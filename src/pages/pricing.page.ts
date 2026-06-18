/**
 * src/pages/pricing.page.ts
 *
 * PricingPage models dotScribe's /pricing page.
 * Pricing tiers are rendered as images (not text), so tests focus on
 * interactive elements: CTA buttons, the "Contact Sales" option, and the FAQ.
 */

import { type Page, type Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';
import type { SiteConfig } from '@site-types/site-config.types';

export class PricingPage extends BasePage {
  // ── CTA buttons ─────────────────────────────────────────────────────────────
  /** All "Start Free Trial" links on the pricing page */
  readonly startFreeTrialLinks: Locator;
  /** "Contact Sales" mailto link for enterprise inquiries */
  readonly contactSalesLink: Locator;

  // ── FAQ section ─────────────────────────────────────────────────────────────
  /**
   * FAQ items: each is a clickable element (button or heading) containing
   * the question text. Wix renders these as interactive accordion items.
   */
  readonly faqItems: Locator;

  // ── Known FAQ questions (verified from live site) ───────────────────────────
  readonly faqDifferent: Locator;
  readonly faqHipaa: Locator;
  readonly faqEhr: Locator;
  readonly faqCancel: Locator;

  constructor(page: Page, config: SiteConfig) {
    super(page, config);

    this.startFreeTrialLinks = page.locator('a[href*="library.dotscribe.com/signup"]');
    this.contactSalesLink = page.locator('a[href*="mailto:team@dotscribe.com"]');

    // FAQ: Wix accordion uses expandable buttons or role="button" elements
    this.faqItems = page.locator('[role="button"], button').filter({
      hasText: /what makes dotscribe|how does dotscribe|is dotscribe hipaa|what happens if|can i change my plan/i,
    });

    // Individual FAQ questions for targeted assertions
    this.faqDifferent = page.getByText(/what makes dotscribe different/i).first();
    this.faqHipaa = page.getByText(/is dotscribe hipaa compliant/i).first();
    this.faqEhr = page.getByText(/how does dotscribe integrate with my existing ehr/i).first();
    this.faqCancel = page.getByText(/what happens if i cancel/i).first();
  }

  async navigate(): Promise<void> {
    await this.page.goto(
      `${this.url.replace(/\/$/, '')}/pricing`,
      { waitUntil: 'domcontentloaded' }
    );
  }

  async getStartFreeTrialCount(): Promise<number> {
    return this.startFreeTrialLinks.count();
  }

  async hasContactSalesOption(): Promise<boolean> {
    return (await this.contactSalesLink.count()) > 0;
  }

  /** Click a FAQ question to expand/collapse its answer. */
  async toggleFaqItem(questionText: string): Promise<void> {
    const item = this.page.locator('[role="button"], button, h3, h4').filter({
      hasText: questionText,
    }).first();
    if (await item.count() > 0) {
      await item.click();
    }
  }

  /** Return visible FAQ question texts found on the page. */
  async getVisibleFaqQuestions(): Promise<string[]> {
    const candidates = this.page.locator('*').filter({
      hasText: /what makes dotscribe|how does dotscribe|hipaa|ehr system|cancel|change my plan|free trial|basic.*ai plan/i,
    });
    const count = await candidates.count();
    const texts: string[] = [];
    for (let i = 0; i < Math.min(count, 30); i++) {
      const text = ((await candidates.nth(i).textContent()) ?? '').trim();
      if (text.length > 10 && text.length < 200) {
        texts.push(text);
      }
    }
    return [...new Set(texts)];
  }
}
