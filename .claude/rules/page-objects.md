---
paths:
  - "src/pages/**/*.ts"
---

# Page Object Rules

These rules apply whenever Claude reads or writes files under `src/pages/`.

## Class structure

- Every page object class **must extend `BasePage`** from `./base.page`
- Import: `import { BasePage } from '@pages/base.page';`
- Constructor signature: `constructor(page: Page, config: SiteConfig)` — call `super(page, config)`

## Locators

- Declare locators as `readonly` properties: `readonly submitButton: Locator`
- Initialize locators in the class body using `this.page.*` locators
- Prefer role-based locators: `this.page.getByRole(...)`, `this.page.getByLabel(...)`

## Methods

- Methods represent **user actions**: `clickSubmit()`, `fillEmail()`, `openMobileMenu()`
- Method names use camelCase verbs
- Return type must be explicit: `async clickSubmit(): Promise<void>`
- Use `async/await` — no `.then()` chains

## No assertions

- **Never call `expect()`** inside a page object class
- Page objects are action libraries — assertions belong exclusively in test files
- If a method needs to verify state, return a value and let the test assert it

## TypeScript

- All properties and return types must be explicitly typed
- No `any` type without a `// eslint-disable-next-line` comment explaining why
- Import types with `import { type Locator } from '@playwright/test'`
