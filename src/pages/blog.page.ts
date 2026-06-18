/**
 * src/pages/blog.page.ts
 *
 * BlogPage models dotScribe's /blog-news page.
 * Covers post listing, search, and navigation to individual posts.
 */

import { type Page, type Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';
import type { SiteConfig } from '@site-types/site-config.types';

export class BlogPage extends BasePage {
  // ── Search ───────────────────────────────────────────────────────────────────
  readonly searchInput: Locator;

  // ── Post listings ────────────────────────────────────────────────────────────
  /**
   * Individual blog post items.
   * Wix blog renders posts as article elements or list items.
   */
  readonly postItems: Locator;
  /** All post title links — each should navigate to the post detail page */
  readonly postTitleLinks: Locator;

  // ── Known post content (verified from live site) ────────────────────────────
  readonly residencyPost: Locator;
  readonly burnoutPost: Locator;

  // ── CTA ──────────────────────────────────────────────────────────────────────
  readonly startFreeTrialLinks: Locator;

  constructor(page: Page, config: SiteConfig) {
    super(page, config);

    // Wix blog search — renders as a standard search input
    this.searchInput = page.locator(
      'input[type="search"], input[placeholder*="search" i], [role="searchbox"]'
    ).first();

    // Wix blog items: article elements or items with post-related classes
    this.postItems = page.locator(
      'article, [class*="post-item"], [class*="blog-item"], [class*="PostItem"]'
    );

    // Post title links: anchors inside post items
    this.postTitleLinks = page.locator(
      'article a[href*="/post/"], a[href*="/post/"]'
    );

    // Known post titles (text-based selectors)
    this.residencyPost = page.getByText(/from match day to mastery/i).first();
    this.burnoutPost = page.getByText(/physician burnout is a systemic issue/i).first();

    this.startFreeTrialLinks = page.locator('a[href*="library.dotscribe.com/signup"]');
  }

  async navigate(): Promise<void> {
    await this.page.goto(
      `${this.url.replace(/\/$/, '')}/blog-news`,
      { waitUntil: 'domcontentloaded' }
    );
  }

  async getPostCount(): Promise<number> {
    return this.postItems.count();
  }

  async getPostLinkCount(): Promise<number> {
    return this.postTitleLinks.count();
  }

  async hasSearchInput(): Promise<boolean> {
    return (await this.searchInput.count()) > 0;
  }

  /** Type into the search input without submitting. */
  async typeInSearch(query: string): Promise<void> {
    const input = this.searchInput;
    if (await input.count() > 0) {
      await input.fill(query);
    }
  }

  /** Return hrefs of all discovered post links. */
  async getPostLinkHrefs(): Promise<string[]> {
    const links = await this.postTitleLinks.all();
    const hrefs: string[] = [];
    for (const link of links) {
      const href = await link.getAttribute('href');
      if (href) hrefs.push(href);
    }
    return hrefs;
  }
}
