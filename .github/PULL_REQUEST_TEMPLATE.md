## Summary

<!-- Describe what this PR changes and why -->

## Test changes

<!-- List new or modified test files -->

- [ ] New page object class(es) added to `src/pages/`
- [ ] Tests use fixtures from `@fixtures/site.fixture` (not raw Playwright)
- [ ] All tests are tagged (`@smoke`, `@navigation`, `@forms`, `@functional`, `@visual`, `@responsive`)
- [ ] No hardcoded URLs — uses `baseURL` from config
- [ ] No form submissions in tests

## TypeScript

- [ ] `npm run typecheck` passes (no TypeScript errors)
- [ ] No use of `any` type without justification

## Checklist

- [ ] `npm run lint` passes
- [ ] `npm run test:smoke` passes locally (or screenshot evidence the site is unreachable)
- [ ] Visual snapshots updated with `npm run baseline` if visual tests changed
- [ ] `AGENTS.md` / `CLAUDE.md` updated if architecture or conventions changed

## Related issues

<!-- Closes #123 -->
