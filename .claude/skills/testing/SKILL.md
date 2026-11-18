---
name: testing
description: How to write tests - Vitest with renderWithProviders and MSW for components and hooks, router and links in tests, Playwright for user flows, what to test and how to query.
---

# Testing

Tests come first (see `docs/workflow.md`):

- Features: tests are written from the brief's acceptance criteria before the implementation, and must fail for the right reason before code is written.
- Bugs: a test that reproduces the bug comes first and must fail before the fix.
- Never weaken or delete a test to make it pass. If a test is wrong, fix it and say why. When an acceptance criterion changes, its tests change with the brief.
- Test names describe behaviour ("removes a member after confirmation"), not AC numbers. The mapping lives in the brief's Tests section.

How:

- Unit and component tests sit next to the file: `*.test.ts(x)`. Shared helpers in `tests/utils/`.
- Render with `renderWithProviders(ui, { searchParams, onUrlUpdate })` from `@tests/utils/render`. It returns `user` (user-event) and `queryClient`. URL updates persist between renders, as in a browser.
- Network: MSW handlers are active in every test. Override per test with `server.use(http.get(apiUrl('x'), () => HttpResponse.json(...)))` from `@/mocks/server`. Mock data resets after each test: a feature with an in-memory mock store registers it in `mockStores` in `src/mocks/handlers.ts`.
- Links and navigation: `@/i18n/navigation` is mocked in `tests/setup.ts`. `Link` renders an anchor with the `href` as passed (no locale), so check links with `toHaveAttribute('href', '/members/mem_001')`. Check navigation with `routerMock.push` from `@tests/utils/router`.
- Query like a user: `getByRole`, `getByLabelText`, visible text. Avoid test ids and implementation details.
- Wait for async UI with `findBy...` or `waitFor`.
- Cover per feature: schema rules, list rendering, filters from the URL, loading, empty and error states, create or edit flow, server field errors, and for detail pages the not-found state.
- Use known seed records by id in detail tests (`mem_002`) and say in a comment what they are.
- Playwright (`tests/e2e/`): one main flow per feature against a production build on mocks. Mock data lives in the page, so a flow uses client navigation, not reloads, after changing data. Run `pnpm e2e`.
- Coverage threshold applies to `src/shared/lib/` (80 percent) and is checked by `pnpm verify`.
