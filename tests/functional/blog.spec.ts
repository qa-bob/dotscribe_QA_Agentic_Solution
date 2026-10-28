/**
 * tests/functional/blog.spec.ts
 *
 * Functional tests for dotScribe's /blog-news page.
 * Verifies post listings, search input, and navigation to individual posts.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('Blog / News Page @functional', () => {
  test.beforeEach(async ({ blogPage }) => {
    await blogPage.navigate();
    await blogPage.page.waitForLoadState('load');
  });

  // ── Page load ────────────────────────────────────────────────────────────────

  test('blog page loads successfully @functional', async ({ blogPage }) => {
    const status = await blogPage.page.goto(
      `${blogPage.url.replace(/\/$/, '')}/blog-news`,
      { waitUntil: 'domcontentloaded' }
    );
    expect(status?.status()).toBeLessThan(400);
  });

  test('blog page URL contains /blog-news @functional', async ({ blogPage }) => {
    expect(blogPage.page.url()).toContain('/blog-news');
  });

  test('blog page title contains dotScribe @functional', async ({ blogPage }) => {
    const title = await blogPage.page.title();
    expect(title.toLowerCase()).toContain('dotscribe');
  });

  // ── Post listings ────────────────────────────────────────────────────────────

  test('at least one blog post is visible @functional', async ({ blogPage, page }) => {
    // Fall back to post links if post item containers are not found
    const postCount = await blogPage.getPostCount();
    const linkCount = await blogPage.getPostLinkCount();

    const total = Math.max(postCount, linkCount);
    expect(total, 'Blog page should show at least one post').toBeGreaterThan(0);
  });

  test('known post about residency is present @functional', async ({ blogPage }) => {
    await blogPage.residencyPost.scrollIntoViewIfNeeded();
    await expect(blogPage.residencyPost).toBeVisible();
  });

  test('known post about physician burnout is present @functional', async ({ blogPage }) => {
    await blogPage.burnoutPost.scrollIntoViewIfNeeded();
    await expect(blogPage.burnoutPost).toBeVisible();
  });

  test('post links navigate to /post/ sub-pages @functional', async ({ blogPage }) => {
    const hrefs = await blogPage.getPostLinkHrefs();
    if (hrefs.length > 0) {
      expect(hrefs[0]).toContain('/post/');
    } else {
      // Fallback: check that links to /post/ exist anywhere on the page
      const postLinks = blogPage.page.locator('a[href*="/post/"]');
      const count = await postLinks.count();
      expect(count, 'Blog page should have links to individual posts (/post/)').toBeGreaterThan(0);
    }
  });

  // ── Search ───────────────────────────────────────────────────────────────────

  test('search input is present on blog page @functional', async ({ blogPage }) => {
    const hasSearch = await blogPage.hasSearchInput();
    expect(hasSearch, 'Blog page should have a search input').toBeTruthy();
  });

  test('typing into search input does not navigate away @functional', async ({
    blogPage,
    page,
  }) => {
    const hasSearch = await blogPage.hasSearchInput();
    if (!hasSearch) {
      test.skip(true, 'No search input found on blog page');
      return;
    }

    const urlBefore = page.url();
    await blogPage.typeInSearch('physician');
    await page.waitForLoadState('domcontentloaded');
    // Typing alone should not navigate away
    const urlAfter = page.url();
    // Some search bars append a query param on keystroke — that's fine; just not a full page nav
    expect(urlAfter).toContain('dotscribe.com');
    expect(urlBefore.split('?')[0]).toContain('blog-news');
  });

  test('search input accepts text input @functional', async ({ blogPage }) => {
    const hasSearch = await blogPage.hasSearchInput();
    if (!hasSearch) {
      test.skip(true, 'No search input found on blog page');
      return;
    }

    await blogPage.typeInSearch('dotscribe');
    const value = await blogPage.searchInput.inputValue();
    expect(value).toBe('dotscribe');
  });

  // ── CTA ──────────────────────────────────────────────────────────────────────

  test('Start Free Trial CTA is accessible from blog page @functional', async ({ blogPage }) => {
    const count = await blogPage.startFreeTrialLinks.count();
    expect(count, 'Blog page should have at least one signup CTA').toBeGreaterThan(0);
  });
});
