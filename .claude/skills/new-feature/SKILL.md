---
name: new-feature
description: Create a new feature folder following the members reference pattern (api, components, hooks, mocks, schemas, types, index.ts), with route, navigation entry, translations, MSW handlers and tests.
---

# New feature

Copy the shape of `src/features/members/`. Steps:

1. Read the brief in `docs/features/<name>.md`. If there is none, create it from `docs/features/_template.md` and ask for confirmation of the acceptance criteria before writing code.
2. Create `src/features/<name>/`:
   - `types/<entity>.ts`: domain types and `as const` value lists
   - `api/<name>.api.ts`: request functions using `http` from `@/shared/lib/http/http-client`
   - `api/<name>.keys.ts`: query key factory
   - `api/<name>.queries.ts`: `useQuery` and `useMutation` hooks; mutations invalidate affected lists
   - `schemas/<entity>-form.schema.ts`: Zod schema, messages are `validation` keys
   - `hooks/use-<name>-search-params.ts`: nuqs URL state for lists
   - `components/<name>-view.tsx`: the page-level client component
   - `mocks/<name>.data.ts` and `mocks/<name>.handlers.ts`
   - `index.ts`: export only what routes need
3. Register handlers in `src/mocks/handlers.ts`.
4. Add the route `src/app/[locale]/(app)/<name>/page.tsx` (thin, with `generateMetadata`).
5. Add the navigation entry in `src/shared/config/navigation.ts` and the label under `nav` in the messages.
6. Add all texts under a `<name>` namespace in `src/i18n/messages/en.json` (and every other locale file).
7. Tests: schema test, a view test with `renderWithProviders`, one Playwright flow.
8. Run `pnpm verify` and `pnpm e2e`.
