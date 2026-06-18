# AGENTS.md — AI Assistant Instructions

> This file provides project context for all AI coding assistants (GitHub Copilot, Cursor, Codeium, etc.).
> Claude Code reads `CLAUDE.md` instead — see that file for the full Claude-specific instructions.

---

## Project Overview

This repository is a **Playwright + TypeScript regression test suite** for **dotScribe** (`http://dotscribe.com`), a healthcare documentation SaaS. It follows a **Page Object Model (POM)** architecture.

Target site configuration lives in `site.config.json`.

---

## Architecture

### Page Object Model

```
src/pages/
  base.page.ts      ← BasePage: all page objects extend this
  home.page.ts      ← HomePage
  navigation.page.ts
  contact.page.ts
  *.page.ts         ← one class per page or section
```

- Page classes **extend `BasePage`**
- Locators are **`readonly Locator`** properties on the class
- Methods represent **user actions** (navigate, fill, click)
- **No `expect()` calls** inside page objects — assertions live in test files only

### Tests

```
tests/
  smoke/        @smoke      — site up, loads, no crash
  navigation/   @navigation — nav links, routing, menus
  forms/        @forms      — fields, validation (no submission)
  functional/   @functional — business features, user flows
  visual/       @visual     — screenshot regression
  responsive/   @responsive — layout at mobile/tablet/desktop
  custom/       @custom     — site-specific generated tests
```

- Import from `@fixtures/site.fixture` (never from `@playwright/test` directly)
- Every test has at least one tag: `@smoke | @navigation | @forms | @functional | @visual | @responsive`
- Never hardcode URLs — use `baseURL` from Playwright config (reads `site.config.json`)
- Never submit forms or create accounts

---

## TypeScript Rules

- Strict mode is enabled in `tsconfig.json`
- All page object properties must be typed
- No implicit `any` — use explicit types or `unknown`
- Path aliases: `@pages/*`, `@utils/*`, `@types/*`, `@fixtures/*`
- Run `npx tsc --noEmit` to verify before finishing

---

## Key Constraints

| Rule | Reason |
|------|--------|
| Never submit forms | Tests must be safe to run against production |
| Never hardcode URLs | Site URL comes from `site.config.json` → `playwright.config.ts` |
| No `page.waitForTimeout()` | Use Playwright auto-waiting or `waitForSelector` |
| No assertions in page objects | Keeps page objects reusable across test contexts |
| No `auth.required` login unless config says so | Respect site.config.json flags |

---

## npm Scripts

```bash
npm test                  # All tests
npm run test:smoke        # @smoke only
npm run test:navigation   # @navigation only
npm run test:forms        # @forms only
npm run test:visual       # @visual only
npm run test:responsive   # @responsive only
npm run baseline          # Update visual snapshots
npm run typecheck         # tsc --noEmit
npm run lint              # ESLint
```

---

## site.config.json Schema

```json
{
  "name": "dotScribe",
  "url": "http://dotscribe.com",
  "hasContactForm": true,
  "expectedNavItems": [],
  "viewports": ["desktop", "mobile", "tablet"],
  "skipVisual": false,
  "skipForms": false,
  "auth": { "required": false }
}
```

---

## When Generating Code

1. Read `site.config.json` for the target URL
2. Use the actual page HTML to write real selectors, not placeholders
3. Add new page classes to `src/pages/` extending `BasePage`
4. Add new fixtures to `src/fixtures/site.fixture.ts` if needed
5. Write tests in the correct `tests/<category>/` folder
6. Tag every test correctly
7. Run `npx tsc --noEmit` to verify types
