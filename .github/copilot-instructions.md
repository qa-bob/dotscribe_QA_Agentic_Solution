# GitHub Copilot Instructions

> This file provides project context for GitHub Copilot.
> See `AGENTS.md` for the full AI assistant guidelines and `CLAUDE.md` for Claude Code instructions.

## Project

Playwright + TypeScript regression test suite for **dotScribe** (`http://dotscribe.com`).
Uses Page Object Model (POM). Target URL and flags are in `site.config.json`.

## Code conventions

- All tests import from `@fixtures/site.fixture` — never `@playwright/test` directly
- Page objects extend `BasePage` in `src/pages/base.page.ts`
- Locators are `readonly Locator` properties on page classes
- Methods in page objects represent user actions — no `expect()` calls inside them
- Tags on every test: `@smoke | @navigation | @forms | @functional | @visual | @responsive`
- Never hardcode `http://dotscribe.com` — use `baseURL` or `siteConfig.url`
- Never submit forms or create accounts
- No `page.waitForTimeout()` — use `waitForSelector` or Playwright's auto-waiting
- TypeScript strict mode: no implicit `any`

## Path aliases

| Alias | Resolves to |
|-------|------------|
| `@pages/*` | `src/pages/*` |
| `@utils/*` | `src/utils/*` |
| `@types/*` | `src/types/*` |
| `@fixtures/*` | `src/fixtures/*` |

## File naming

- Page objects: `src/pages/<name>.page.ts`
- Test files: `tests/<category>/<feature>.spec.ts`
- Custom tests: `tests/custom/<scenario>.spec.ts`

## Snippet patterns

```typescript
// Page object skeleton
import { type Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';

export class ExamplePage extends BasePage {
  readonly primaryButton: Locator = this.page.getByRole('button', { name: /example/i });

  async clickPrimary(): Promise<void> {
    await this.primaryButton.click();
  }
}

// Test file skeleton
import { test, expect } from '@fixtures/site.fixture';

test.describe('Feature Name @functional', () => {
  test('should do something @functional', async ({ page, siteConfig }) => {
    await page.goto(`${siteConfig.url}/path`);
    await expect(page.getByRole('heading')).toBeVisible();
  });
});
```
