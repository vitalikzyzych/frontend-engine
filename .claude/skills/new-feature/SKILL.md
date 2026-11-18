---
name: new-feature
description: Build a feature test-first from its brief, API documentation and design, following the members reference pattern (api, components, hooks, mocks, schemas, types, index.ts, routes, translations, tests). Usage: /new-feature <name> [extra context]
argument-hint: <name> [extra context]
---

# New feature

Arguments: $ARGUMENTS

The first word is the feature name (`<name>` below); anything after it is extra context from the developer. Copy the shape of `src/features/members/` (read its `CLAUDE.md` first). Order matters: brief, contract, tests, code. The full process is in `docs/workflow.md`.

## 1. Brief

If `docs/features/<name>.md` exists, read it and go to step 2. Otherwise draft it and stop:

1. Read every file in `docs/features/<name>/` (API documentation, HTML designs, screenshots) and any paths in the arguments. For a large HTML export, read the parts that show screens and states, not the whole file.
2. Copy `docs/features/_template.md` to `docs/features/<name>.md` and fill it in:
   - **Data** from the API documentation: endpoints, request and response shapes, error responses.
   - **Screens** from the design, following `docs/design.md`: routes, layout, columns, fields, labels and actions exactly as written, states, and any component the project does not have yet.
   - **Acceptance criteria**, each one observable and checkable by one test, and the **Tests** section mapping each criterion to a test.
   - **Open questions**: where the API documentation and the design disagree, where either is silent (missing states, permissions, validation rules), and where the API's shapes differ from the engine's (`Paginated<T>`, error format, sort params).
3. Stop. Ask for confirmation of the acceptance criteria, the screens and answers to the open questions. Write no code before that.

## 2. Contract and mocks

Only when the brief is confirmed and its Open questions section is empty or answered. From the brief's Data section:

- `types/<entity>.ts`: domain types and `as const` value lists
- `mocks/<name>.data.ts`: seed data with a `reset()`, and `mocks/<name>.handlers.ts` with every endpoint and the server rules from the brief (409, forbidden transitions). Register both in `src/mocks/handlers.ts`: handlers in `handlers`, the store in `mockStores`.
- `api/<name>.api.ts`: request functions using `http`. API shapes that differ from the UI's are mapped here, not in `shared/`.
- `api/<name>.keys.ts`: query key factory

## 3. Failing tests

One or more per acceptance criterion, as listed in the brief's Tests section:

- `schemas/<entity>-form.schema.test.ts` for validation rules
- `components/<name>-view.test.tsx` for the list, filters, states and forms
- `components/<entity>-detail-view.test.tsx` and `<entity>-edit-view.test.tsx` when the feature has a detail or edit page
- `tests/e2e/<name>.spec.ts` for the main flow

Create empty component and schema stubs so the tests compile, then run `pnpm test src/features/<name>` and confirm they fail because the behaviour is missing, not because of a typo or import error.

## 4. Implementation

Until the tests pass. Do not change a test to make it pass unless the test itself is wrong; say so when that happens.

- `api/<name>.queries.ts`: `useQuery` and `useMutation` hooks; mutations invalidate the lists and the detail they affect
- `schemas/<entity>-form.schema.ts`: Zod schema, messages are `validation` keys
- `hooks/use-<name>-search-params.ts`: nuqs URL state for lists
- `components/<name>-view.tsx`: the list page component
- detail page (`<entity>-detail-view.tsx`, route `<name>/[id]/page.tsx`) and edit page (`<entity>-edit-view.tsx`, route `<name>/[id]/edit/page.tsx`) when the brief has them, built like the members ones
- `index.ts`: export only what routes need
- routes under `src/app/[locale]/(app)/<name>/` (thin, with `generateMetadata`; `Suspense` around components that read URL state)
- navigation entry in `src/shared/config/navigation.ts`, label under `nav` in the messages
- all texts under a `<name>` namespace in `src/i18n/messages/en.json` (and every other locale file)

Load the `data-fetching`, `forms`, `ui`, `translations` and `testing` skills as the work reaches them.

## 5. Finish

`pnpm check` while working. At the end run `/done <name>`: `pnpm verify`, `pnpm e2e`, the acceptance criteria coverage check and the feature guide `src/features/<name>/CLAUDE.md`.
