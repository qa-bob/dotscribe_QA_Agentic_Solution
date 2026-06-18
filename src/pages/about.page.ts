/**
 * src/pages/about.page.ts
 *
 * AboutPage models dotScribe's /about-us page.
 * Content focuses on the founder story and brand mission.
 */

import { type Page, type Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';
import type { SiteConfig } from '@site-types/site-config.types';

export class AboutPage extends BasePage {
  // ── Page heading ─────────────────────────────────────────────────────────────
  readonly pageHeading: Locator;

  // ── Founder content ──────────────────────────────────────────────────────────
  /** Founder's name — Aaron Barrett, MD */
  readonly founderName: Locator;
  /** Core founder quote about the product mission */
  readonly founderQuote: Locator;
  /** Founder role/title text */
  readonly founderTitle: Locator;

  // ── CTA ──────────────────────────────────────────────────────────────────────
  readonly startFreeTrialLinks: Locator;
  readonly signInLink: Locator;

  constructor(page: Page, config: SiteConfig) {
    super(page, config);

    this.pageHeading = page.getByRole('heading', { name: /about us/i }).first();

    this.founderName = page.getByText(/aaron barrett/i).first();
    this.founderQuote = page.getByText(/spend more time with patients/i).first();
    this.founderTitle = page.getByText(/family physician.*founder|founder.*family physician/i).first();

    this.startFreeTrialLinks = page.locator('a[href*="library.dotscribe.com/signup"]');
    this.signInLink = page.locator('a[href*="library.dotscribe.com/login"]').first();
  }

  async navigate(): Promise<void> {
    await this.page.goto(
      `${this.url.replace(/\/$/, '')}/about-us`,
      { waitUntil: 'domcontentloaded' }
    );
  }

  async getPageHeadingText(): Promise<string> {
    if (await this.pageHeading.count() > 0) {
      return (await this.pageHeading.textContent())?.trim() ?? '';
    }
    return '';
  }

  async hasFounderContent(): Promise<boolean> {
    return (await this.founderName.count()) > 0;
  }

  async isLoaded(): Promise<boolean> {
    try {
      return (await this.pageHeading.count()) > 0;
    } catch {
      return false;
    }
  }
}
