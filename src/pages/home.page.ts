/**
 * src/pages/home.page.ts
 *
 * HomePage models dotScribe's root marketing page.
 * Selectors are based on actual HTML discovered at https://www.dotscribe.com.
 */

import { type Page, type Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';
import type { SiteConfig } from '@site-types/site-config.types';

export class HomePage extends BasePage {
  // ── Hero / above-the-fold ───────────────────────────────────────────────────
  readonly heroHeading: Locator;
  readonly heroSubheading: Locator;
  readonly heroTagline: Locator;

  // ── Signup / auth links ─────────────────────────────────────────────────────
  /** All CTA links pointing to the signup page (multiple on homepage) */
  readonly signupLinks: Locator;
  readonly signInLink: Locator;
  /** Primary "Get Started for FREE" CTA in the hero */
  readonly heroCta: Locator;

  // ── Medical specialty feature sections ──────────────────────────────────────
  readonly outpatientSection: Locator;
  readonly inpatientSection: Locator;
  readonly emergencySection: Locator;
  readonly studentsSection: Locator;

  // ── AI features section ─────────────────────────────────────────────────────
  readonly aiAssistanceSection: Locator;
  readonly dotphraseSection: Locator;
  readonly cloudLibrarySection: Locator;

  // ── Value propositions ──────────────────────────────────────────────────────
  readonly hipaaText: Locator;

  // ── Footer ──────────────────────────────────────────────────────────────────
  readonly footer: Locator;
  readonly privacyLink: Locator;
  readonly termsLink: Locator;
  readonly supportLink: Locator;
  readonly socialLinks: Locator;

  constructor(page: Page, config: SiteConfig) {
    super(page, config);

    // Hero
    this.heroHeading = page.locator('h1');
    this.heroSubheading = page.locator('h2').first();
    this.heroTagline = page.getByText(/from thought to solution in seconds/i).first();

    // Signup / auth — all CTAs on this site go to the external library subdomain
    this.signupLinks = page.locator('a[href*="library.dotscribe.com/signup"]');
    this.signInLink = page.locator('a[href*="library.dotscribe.com/login"]').first();
    this.heroCta = page.getByRole('link', { name: /get started for free/i }).first();

    // Specialty sections — each is an h2 heading followed by feature lists
    this.outpatientSection = page.getByRole('heading', { name: /outpatient.*telehealth/i });
    this.inpatientSection = page.getByRole('heading', { name: /inpatient.*surgical/i });
    this.emergencySection = page.getByRole('heading', { name: /emergency medicine/i });
    this.studentsSection = page.getByRole('heading', { name: /students.*residents/i });

    // AI features section
    this.aiAssistanceSection = page.getByRole('heading', { name: /ai-assistance for all/i });
    this.dotphraseSection = page.getByRole('heading', { name: /dotphrase/i });
    this.cloudLibrarySection = page.getByRole('heading', { name: /medical library/i });

    // Value propositions
    this.hipaaText = page.getByText(/hipaa compliance/i).first();

    // Footer — uses last() because "Privacy" / "Terms" appear in footer, not header
    this.footer = page.locator('footer, [role="contentinfo"]').first();
    this.privacyLink = page.getByRole('link', { name: /privacy/i }).last();
    this.termsLink = page.getByRole('link', { name: /terms/i }).last();
    this.supportLink = page.getByRole('link', { name: /support/i }).last();
    this.socialLinks = page.locator(
      'a[href*="instagram.com/dotscribe"], a[href*="facebook.com/dotScribe"], a[href*="linkedin.com/company/dotscribe"]'
    );
  }

  // ── Hero content ────────────────────────────────────────────────────────────

  async getHeroText(): Promise<string> {
    if (await this.heroHeading.count() > 0) {
      return (await this.heroHeading.textContent())?.trim() ?? '';
    }
    return '';
  }

  async getMainHeading(): Promise<string> {
    return this.getHeroText();
  }

  // ── CTA helpers ─────────────────────────────────────────────────────────────

  async getSignupLinkCount(): Promise<number> {
    return this.signupLinks.count();
  }

  /** Returns all visible CTA / signup button locators on the page. */
  async getCTAButtons(): Promise<Locator[]> {
    return this.signupLinks.all();
  }

  // ── Social links ────────────────────────────────────────────────────────────

  async getSocialLinkHrefs(): Promise<string[]> {
    const links = await this.socialLinks.all();
    const hrefs: string[] = [];
    for (const link of links) {
      const href = await link.getAttribute('href');
      if (href) hrefs.push(href);
    }
    return hrefs;
  }

  // ── Load check ──────────────────────────────────────────────────────────────

  async isLoaded(): Promise<boolean> {
    try {
      if (await this.heroHeading.count() === 0) return false;
      if ((await this.signupLinks.count()) === 0) return false;
      const bodyText = await this.page.evaluate<string>(() => document.body.innerText);
      return bodyText.trim().length > 100;
    } catch {
      return false;
    }
  }
}
