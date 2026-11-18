---
name: new-feature
description: Create a new feature test-first following the members reference pattern (api, components, hooks, mocks, schemas, types, index.ts), with route, navigation entry, translations, MSW handlers and tests.
---

# New feature

Copy the shape of `src/features/members/`. Order matters: brief, contract, tests, code. See `docs/workflow.md`.

1. **Brief.** Read `docs/features/<name>.md`. If there is none, create it from `docs/features/_template.md` (including the Tests section) and ask for confirmation of the acceptance criteria and the design before writing code.
2. **Contract and mocks.** From the brief's Data section:
   - `types/<entity>.ts`: domain types and `as const` value lists
   - `mocks/<name>.data.ts` and `mocks/<name>.handlers.ts`, registered in `src/mocks/handlers.ts`
   - `api/<name>.api.ts`: request functions using `http` from `@/shared/lib/http/http-client`
   - `api/<name>.keys.ts`: query key factory
3. **Failing tests**, one or more per AC as listed in the brief's Tests section:
   - `schemas/<entity>-form.schema.test.ts` for validation rules
   - `components/<name>-view.test.tsx` for list, filters, states and forms
   - `tests/e2e/<name>.spec.ts` for the main flow
   - Create empty component and schema stubs so the tests compile, then run them (`pnpm test src/features/<name>`) and confirm they fail because the behaviour is missing.
4. **Implementation** until the tests pass:
   - `api/<name>.queries.ts`: `useQuery` and `useMutation` hooks; mutations invalidate affected lists
   - `schemas/<entity>-form.schema.ts`: Zod schema, messages are `validation` keys
   - `hooks/use-<name>-search-params.ts`: nuqs URL state for lists
   - `components/<name>-view.tsx`: the page-level client component
   - `index.ts`: export only what routes need
   - route `src/app/[locale]/(app)/<name>/page.tsx` (thin, with `generateMetadata`)
   - navigation entry in `src/shared/config/navigation.ts`, label under `nav` in the messages
   - all texts under a `<name>` namespace in `src/i18n/messages/en.json` (and every other locale file)
5. **Check.** `pnpm check` while working; `/done <name>` at the end (runs `pnpm verify`, `pnpm e2e` and the AC coverage check).
6. **Feature guide.** `/done` writes `src/features/<name>/CLAUDE.md` in the shape of `src/features/members/CLAUDE.md`: files, data flow, non-obvious rules, under 50 lines.
