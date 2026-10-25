/**
 * tests/visual/visual-regression.spec.ts
 *
 * Visual regression tests — compare screenshots against stored baselines.
 * Run `npm run baseline` to capture new baselines after intentional design changes.
 *
 * Covers: homepage (3 viewports), pricing page (desktop), about page (desktop).
 *
 * Each test runs only in the Playwright project whose viewport it targets, and
 * is skipped (not failed) until a baseline has been captured for it.
 *
 * Tag: @visual
 */

import * as fs from 'fs';
import { test, expect } from '@fixtures/site.fixture';
import { dismissCookieBanner } from '@utils/visual-helper';

// Shared screenshot options applied to all visual tests
const SCREENSHOT_OPTIONS = {
  maxDiffPixels: 500,
  animations: 'disabled',
  caret: 'hide',
  fullPage: true,
} as const;

const VISUAL_CASES = [
  { name: 'homepage', label: 'desktop', project: 'chromium-desktop', path: '', snapshot: 'homepage-desktop.png' },
  { name: 'homepage', label: 'mobile', project: 'mobile-chrome', path: '', snapshot: 'homepage-mobile.png' },
  { name: 'homepage', label: 'tablet', project: 'tablet', path: '', snapshot: 'homepage-tablet.png' },
  { name: 'pricing page', label: 'desktop', project: 'chromium-desktop', path: '/pricing', snapshot: 'pricing-desktop.png' },
  { name: 'about page', label: 'desktop', project: 'chromium-desktop', path: '/about-us', snapshot: 'about-desktop.png' },
] as const;

test.describe('Visual Regression @visual', () => {
  // Skip entire suite when site config opts out
  test.beforeEach(async ({ siteConfig }) => {
    if (siteConfig.skipVisual) {
      test.skip(true, `Visual regression skipped for "${siteConfig.name}" (skipVisual: true)`);
    }
  });

  for (const { name, label, project, path, snapshot } of VISUAL_CASES) {
    test(`${name} visual regression - ${label} @visual`, async ({ page, siteConfig }, testInfo) => {
      test.skip(testInfo.project.name !== project, `Runs only in the "${project}" project`);

      // Only `--update-snapshots` (all/changed) should create a missing baseline
      const isUpdating = ['all', 'changed'].includes(testInfo.config.updateSnapshots);
      const baselinePath = testInfo.snapshotPath(snapshot, { kind: 'screenshot' });
      test.skip(
        !isUpdating && !fs.existsSync(baselinePath),
        `No baseline at ${baselinePath} — run "npm run baseline" to capture one`
      );

      const url = path ? `${siteConfig.url.replace(/\/$/, '')}${path}` : siteConfig.url;
      await page.goto(url, { waitUntil: 'load' });

      // Dismiss any cookie/consent banners that would interfere with comparison
      await dismissCookieBanner(page);

      await expect(page).toHaveScreenshot(snapshot, { ...SCREENSHOT_OPTIONS });
    });
  }
});
