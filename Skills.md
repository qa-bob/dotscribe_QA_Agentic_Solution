# Skills & Commands Reference

This file documents all Claude Code slash commands and sub-agents available in this repository.
Invoke commands in Claude Code with `/command-name`.

---

## Slash Commands

Defined in `.claude/commands/` — each is a markdown file Claude loads when the command is invoked.

### `/analyze-site`

**File:** `.claude/commands/analyze-site.md`

Crawl the live site defined in `site.config.json` and produce a fully-populated configuration.

**What it does:**
1. Navigates to the site URL with `waitUntil: 'networkidle'`
2. Dismisses cookie banners
3. Extracts nav items, contact form presence, meta description, H1
4. Checks for HTTPS, meta viewport, favicon
5. Outputs an updated `site.config.json` + an issues checklist

**Usage:**
```
/analyze-site
/analyze-site https://dotscribe.com
```

---

### `/generate-full-suite`

**File:** `.claude/commands/generate-full-suite.md`

Analyze the live site and generate a complete set of POM classes and test files from scratch.

**What it does:**
1. Runs `/analyze-site` to discover pages, forms, and nav items
2. Creates or updates page object classes in `src/pages/`
3. Generates test files for each category (smoke, navigation, forms, functional, visual, responsive)
4. Runs `npx tsc --noEmit` to verify TypeScript
5. Produces a summary of what was created

**Usage:**
```
/generate-full-suite
```

---

### `/run-smoke`

**File:** `.claude/commands/run-smoke.md`

Run the `@smoke` test suite and summarize results.

**What it does:**
1. Executes `npm run test:smoke`
2. Parses the JSON results file
3. Reports: total / passed / failed / skipped counts
4. Lists any failed tests with their error messages
5. Recommends next steps if failures are found

**Usage:**
```
/run-smoke
```

---

### `/update-baseline`

**File:** `.claude/commands/update-baseline.md`

Refresh all visual regression snapshot baselines.

**What it does:**
1. Runs `npm run baseline` (`playwright test --grep @visual --update-snapshots`)
2. Reports how many snapshots were updated
3. Lists which pages/viewports changed
4. Reminds you to commit the new snapshots

**Usage:**
```
/update-baseline
```

---

### `/generate-report`

**File:** `.claude/commands/generate-report.md`

Generate a formatted test results summary from the most recent test run.

**What it does:**
1. Reads `test-results/results.json`
2. Calculates pass rate, duration, and per-category breakdown
3. Outputs a formatted markdown table
4. Highlights flaky tests and top failures

**Usage:**
```
/generate-report
```

---

## Sub-Agents

Defined in `.claude/agents/` — Claude delegates to these automatically or when asked.

### `site-analyzer`

**File:** `.claude/agents/site-analyzer.md`

**Role:** Crawl a live website and produce a fully-populated `site.config.json`.

**When Claude uses it:**
- Onboarding a new company repo (first-time config generation)
- Verifying an existing config after a site redesign
- Running `/analyze-site`

**Inputs:** `url` (required), `companyName` (optional)

**Output:** Valid `site.config.json` JSON + issues checklist + confidence assessment

---

### `test-generator`

**File:** `.claude/agents/test-generator.md`

**Role:** Read `site.config.json` and generate site-specific Playwright test files.

**When Claude uses it:**
- A site has unique functionality not covered by generic tests
- Additional coverage requested (pricing page, demo flow, blog pagination)
- Regression tests needed for a recently discovered bug

**Inputs:** `siteConfig` (required), `testScenarios` (optional), `pagesToTest` (optional)

**Output:** TypeScript spec files in `tests/custom/<scenario-name>.spec.ts`

---

## Path-Scoped Rules

Defined in `.claude/rules/` — loaded automatically when Claude works with matching files.

| Rule File | Applies To | Purpose |
|-----------|-----------|---------|
| `playwright-tests.md` | `tests/**/*.spec.ts` | Enforce test file conventions |
| `page-objects.md` | `src/pages/**/*.ts` | Enforce POM class conventions |

---

## Adding New Skills

To add a new slash command:

1. Create `.claude/commands/<command-name>.md`
2. Write clear step-by-step instructions in the file body
3. Document the command in this file
4. Add it to the command table in `CLAUDE.md`

To add a new sub-agent:

1. Create `.claude/agents/<agent-name>.md`
2. Define: Role, When to invoke, Capabilities, Inputs, Output, Step-by-step instructions
3. Document it in this file

---

## Related Files

| File | Purpose |
|------|---------|
| `CLAUDE.md` | Full Claude Code project instructions |
| `AGENTS.md` | AI assistant guidelines (all tools) |
| `README.md` | Developer setup and contributor guide |
| `site.config.json` | Target site URL and feature flags |
