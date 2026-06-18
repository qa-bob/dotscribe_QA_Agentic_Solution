---
paths:
  - "tests/**/*.spec.ts"
  - "tests/**/*.test.ts"
---

# Playwright Test File Rules

These rules apply whenever Claude reads or writes files under `tests/`.

## Required structure

- Import `test` and `expect` from `@fixtures/site.fixture` — never from `@playwright/test`
- Every `test()` must have at least one tag in its name: `@smoke | @navigation | @forms | @functional | @visual | @responsive | @custom`
- Use `test.describe('Description @tag', ...)` to group related tests

## Selectors

- Prefer role-based locators: `getByRole`, `getByLabel`, `getByText`, `getByPlaceholder`
- Avoid XPath and CSS class selectors unless role-based selectors are unavailable
- Never hardcode pixel coordinates

## Assertions

- Use `await expect(locator).toBeVisible()` — never `toBePresent()` (deprecated)
- Use `toHaveText()` or `toContainText()` for text assertions
- Prefer `toHaveScreenshot()` for visual tests, not pixel comparisons

## Waits

- Never use `page.waitForTimeout()` — let Playwright auto-wait
- Use `page.waitForSelector()` or `locator.waitFor()` when explicit waiting is required
- Set `waitUntil: 'domcontentloaded'` for fast navigation; use `'networkidle'` only for SPAs

## Constraints

- Never submit forms — test field interactions and validation only
- Never create accounts or enter real credentials
- Never hardcode `http://dotscribe.com` — use `siteConfig.url` or `baseURL`
- Use `siteConfig.url.replace(/\/$/, '') + '/path'` for sub-page navigation
