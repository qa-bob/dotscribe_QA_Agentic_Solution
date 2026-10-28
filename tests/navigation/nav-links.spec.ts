/**
 * tests/navigation/nav-links.spec.ts
 *
 * Navigation tests for dotScribe.
 * Verifies the primary nav is present, all 4 links resolve, mobile menu
 * works, and link text is accessible.
 *
 * Expected nav items: Overview, Pricing, About Us, Blog | News
 *
 * Tag: @navigation
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('Navigation @navigation', () => {
  test.beforeEach(async ({ navigationPage }) => {
    await navigationPage.navigate();
    await navigationPage.waitForLoad();
  });

  // ── Visibility ──────────────────────────────────────────────────────────────

  test('navigation menu is visible @navigation', async ({ navigationPage }, testInfo) => {
    // Small viewports usually hide the nav behind a toggle — covered by the mobile nav test
    test.skip(testInfo.project.name !== 'chromium-desktop', 'Runs only in the "chromium-desktop" project');
    const isVisible = await navigationPage.isNavVisible();
    expect(isVisible, 'A nav / [role="navigation"] element should be visible').toBeTruthy();
  });

  // ── Expected items ──────────────────────────────────────────────────────────

  test('nav contains "Overview" link @navigation', async ({ page, siteConfig }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium-desktop', 'Runs only in the "chromium-desktop" project');
    const link = page.getByRole('link', { name: /overview/i }).first();
    await expect(link).toBeVisible();
  });

  test('nav contains "Pricing" link @navigation', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium-desktop', 'Runs only in the "chromium-desktop" project');
    const link = page.getByRole('link', { name: /pricing/i }).first();
    await expect(link).toBeVisible();
  });

  test('nav contains "About Us" link @navigation', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium-desktop', 'Runs only in the "chromium-desktop" project');
    const link = page.getByRole('link', { name: /about us/i }).first();
    await expect(link).toBeVisible();
  });

  test('nav contains "Blog" or "News" link @navigation', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium-desktop', 'Runs only in the "chromium-desktop" project');
    const link = page.getByRole('link', { name: /blog|news/i }).first();
    await expect(link).toBeVisible();
  });

  test('header has "START FREE TRIAL" button @navigation', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium-desktop', 'Runs only in the "chromium-desktop" project');
    const cta = page.getByRole('link', { name: /start free trial/i }).first();
    await expect(cta).toBeVisible();
  });

  test('header has "SIGN IN" button @navigation', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium-desktop', 'Runs only in the "chromium-desktop" project');
    const signIn = page.getByRole('link', { name: /sign in/i }).first();
    await expect(signIn).toBeVisible();
  });

  // ── Link routing ────────────────────────────────────────────────────────────

  test('"Pricing" nav link navigates to /pricing @navigation', async ({ page, siteConfig }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium-desktop', 'Runs only in the "chromium-desktop" project');
    const link = page.getByRole('link', { name: /pricing/i }).first();
    await link.click();
    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('/pricing');
  });

  test('"About Us" nav link navigates to /about-us @navigation', async ({ page, siteConfig }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium-desktop', 'Runs only in the "chromium-desktop" project');
    const link = page.getByRole('link', { name: /about us/i }).first();
    await link.click();
    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('/about-us');
  });

  test('"Blog" nav link navigates to /blog-news @navigation', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium-desktop', 'Runs only in the "chromium-desktop" project');
    const link = page.getByRole('link', { name: /blog|news/i }).first();
    await link.click();
    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('/blog-news');
  });

  // ── Link reachability ───────────────────────────────────────────────────────

  test('all nav links are reachable (no 404s) @navigation', async ({ navigationPage }) => {
    const results = await navigationPage.checkAllNavLinksReachable();

    test.skip(results.length === 0, 'No nav links found to check');

    // Exclude external domains (library subdomain, social media) from 404 check
    const internalResults = results.filter(
      (r) =>
        r.url.includes('dotscribe.com') &&
        !r.url.includes('library.dotscribe.com') &&
        !r.url.includes('support.dotscribe.com')
    );

    const broken = internalResults.filter((r) => !r.ok && r.status !== 0);
    const unreachable = internalResults.filter((r) => r.status === 0);

    if (unreachable.length > 0) {
      console.warn(
        '[navigation] Could not reach (network):\n' +
          unreachable.map((r) => `  ${r.url}`).join('\n')
      );
    }

    expect(
      broken,
      `Found ${broken.length} broken internal nav link(s):\n` +
        broken.map((r) => `  ${r.url} → HTTP ${r.status}`).join('\n')
    ).toHaveLength(0);
  });

  // ── Mobile nav ──────────────────────────────────────────────────────────────

  test('mobile nav menu toggles correctly @navigation', async ({ navigationPage, page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile-chrome', 'Runs only in the "mobile-chrome" project');
    await page.setViewportSize({ width: 390, height: 844 });
    await navigationPage.navigate();
    await navigationPage.waitForLoad();

    const toggle = await navigationPage.getMobileMenuToggle();

    if (!toggle) {
      const navVisible = await navigationPage.isNavVisible();
      expect(
        navVisible,
        'At mobile viewport, either a menu toggle or visible nav should exist'
      ).toBeTruthy();
      return;
    }

    await expect(toggle, 'Mobile menu toggle should be visible').toBeVisible();
    await navigationPage.openMobileMenu();

    const navLinks = await navigationPage.getNavLinks();
    expect(
      navLinks.length,
      'After opening mobile menu, nav links should be discoverable'
    ).toBeGreaterThan(0);
  });

  // ── Accessible link text ────────────────────────────────────────────────────

  test('nav links have descriptive text (not just "click here") @navigation', async ({
    navigationPage,
  }) => {
    const navLinks = await navigationPage.getNavLinks();

    test.skip(navLinks.length === 0, 'No nav links found');

    const badPhrases = /^(click here|here|more|read more|learn more|link|go)$/i;
    const genericLinks = navLinks.filter((link) => badPhrases.test(link.text.trim()));

    expect(
      genericLinks,
      `Found nav links with non-descriptive text:\n` +
        genericLinks.map((l) => `  "${l.text}" → ${l.href}`).join('\n')
    ).toHaveLength(0);
  });

  // ── Logo home link ──────────────────────────────────────────────────────────

  test('logo links back to homepage @navigation', async ({ page, siteConfig }) => {
    const logoLink = page.locator(
      'a[class*="logo" i], a[aria-label*="home" i], a[aria-label*="logo" i], ' +
        `header a[href="/"], header a[href="${siteConfig.url}"], ` +
        'header a[href="https://www.dotscribe.com"], header a[href="https://www.dotscribe.com/"]'
    ).first();

    test.skip(await logoLink.count() === 0, 'Could not identify a logo link');

    const href = await logoLink.getAttribute('href');
    expect(href).not.toBeNull();

    const resolvedHref = new URL(href!, siteConfig.url).toString();
    const siteOrigin = new URL(siteConfig.url).origin;
    expect(
      resolvedHref.startsWith(siteOrigin),
      `Logo link "${href}" should point to the site homepage (origin: ${siteOrigin})`
    ).toBeTruthy();
  });

  // ── Footer links ────────────────────────────────────────────────────────────

  test('footer Privacy Policy link is present @navigation', async ({ page }) => {
    const link = page
      .locator('footer a, [role="contentinfo"] a')
      .filter({ hasText: /privacy/i })
      .first();
    if (await link.count() === 0) {
      const anyPrivacy = page.getByRole('link', { name: /privacy/i }).last();
      await expect(anyPrivacy).toBeVisible();
      return;
    }
    await link.scrollIntoViewIfNeeded();
    await expect(link).toBeVisible();
  });

  test('footer Terms of Service link is present @navigation', async ({ page }) => {
    const link = page
      .locator('footer a, [role="contentinfo"] a')
      .filter({ hasText: /terms/i })
      .first();
    if (await link.count() === 0) {
      const anyTerms = page.getByRole('link', { name: /terms/i }).last();
      await expect(anyTerms).toBeVisible();
      return;
    }
    await link.scrollIntoViewIfNeeded();
    await expect(link).toBeVisible();
  });

  test('footer Support / HelpDesk link is present @navigation', async ({ page }) => {
    const link = page.getByRole('link', { name: /support|helpdesk/i }).last();
    await link.scrollIntoViewIfNeeded();
    await expect(link).toBeVisible();
  });
});
