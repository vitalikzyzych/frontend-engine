---
name: testing
description: How to write tests - Vitest with renderWithProviders and MSW for components and hooks, Playwright for user flows, what to test and how to query.
---

# Testing

- Unit and component tests sit next to the file: `*.test.ts(x)`. Shared helpers in `tests/utils/`.
- Render with `renderWithProviders(ui, { searchParams, onUrlUpdate })` from `@tests/utils/render`. It returns `user` (user-event) and `queryClient`.
- Network: MSW handlers are active in every test. Override per test with `server.use(http.get(apiUrl('x'), () => HttpResponse.json(...)))` from `@/mocks/server`. Mock data resets after each test.
- Query like a user: `getByRole`, `getByLabelText`, visible text. Avoid test ids and implementation details.
- Wait for async UI with `findBy...` or `waitFor`.
- Cover per feature: schema rules, list rendering, filters from the URL, empty and error states, create or edit flow, server field errors.
- Playwright (`tests/e2e/`): one main flow per feature against a production build on mocks. Run `pnpm e2e`.
- Coverage threshold applies to `src/shared/lib/` (80 percent).
