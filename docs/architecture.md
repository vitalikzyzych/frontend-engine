# Architecture

## Folder structure

```
src/
  app/[locale]/              routes only: page, layout, loading, error, not-found
    (public)/                public pages
    (app)/                   pages inside the application shell (sidebar and header)
  features/<name>/           one business capability
    api/                     request functions, query keys, query and mutation hooks
    components/              UI used only by this feature
    hooks/                   feature hooks (for example URL state)
    mocks/                   MSW handlers and mock data
    schemas/                 Zod schemas for forms
    types/                   domain types
    index.ts                 public API: the only file other code may import
  shared/
    ui/                      shadcn components (generated with the shadcn CLI)
    components/              app-wide components: AppShell, PageHeader, PageBreadcrumbs, DataTable and its
                             filters, DateRangeFilter, EmptyState, ErrorState, ConfirmDialog
    hooks/                   generic hooks
    lib/http/                fetch client and AppError
    lib/forms/               form helpers such as applyFieldErrors
    lib/query/               QueryClient defaults
    config/                  navigation and other app-wide configuration
    types/                   shared types such as Paginated<T>
  i18n/                      routing, navigation helpers, request config, named formats, messages
  providers/                 client providers: theme, query, URL state, tooltips, toasts, mocks
  mocks/                     MSW setup that combines the handlers of all features
  observability/             Sentry (removable)
  styles/                    globals.css and tokens.css
  env.ts                     validated environment variables
  proxy.ts                   locale detection and redirects
tests/
  setup.ts                   Vitest setup with the MSW server
  utils/render.tsx           renderWithProviders for component tests
  unit/                      tests that do not belong to one file
  e2e/                       Playwright tests
```

## Import rules

ESLint enforces these rules (`eslint-plugin-boundaries`), so a violation fails CI:

- `app` may import from `features` (only their `index.ts`), `shared`, `providers`, `i18n` and `observability`.
- A feature may import from `shared`, `i18n`, and from another feature only through that feature's `index.ts`.
- `shared` may import only from `i18n`. It never knows about features.
- `providers` may import from `shared`, `i18n` and `mocks`.
- `mocks` may import feature mocks and `shared`.
- Files directly in `src/` may not import from `app`, `features`, `shared` or `providers`.
- Tests may import anything.

Further rules:

- Links and navigation use `@/i18n/navigation`, not `next/link` or `next/navigation`, so the locale is kept.
- Environment variables are read through `@/env`, never through `process.env` (except `NODE_ENV`).
- There are no barrel files except each feature's `index.ts`. Shared code is imported by its path.
- File names are kebab-case; React components are PascalCase exports.

## State

| Kind of state                              | Where it lives                               |
| ------------------------------------------ | -------------------------------------------- |
| Server data                                | TanStack Query                               |
| Filters, sorting, pagination, selected tab | URL, through nuqs                            |
| Form state                                 | React Hook Form                              |
| Local UI state                             | `useState`                                   |
| Shared client state                        | Zustand, added only when a real case appears |

There is no global store. Adding one needs a concrete case that the options above do not cover.

## Data fetching

The pattern, as used in `src/features/members/api/`:

1. `members.api.ts`: plain request functions built on `http` from `@/shared/lib/http/http-client`. This is the only place that knows the API's shapes; differences from the engine's shared types are mapped here, not in `shared/`.
2. `members.keys.ts`: one query key factory per feature (`lists`, `list`, `details`, `detail`), so invalidation is predictable. Data that belongs to one record sits under its `detail` key.
3. `members.queries.ts`: `useQuery` and `useMutation` hooks. Mutations invalidate the lists and the detail they affect. Status changes are action endpoints (`POST /members/:id/deactivate`) with their own hook.
4. Components use these hooks, never `http` or `fetch` directly.

`http` sends JSON, includes credentials, and turns every failure into an `AppError` with `status`, `code` and `fieldErrors`. Passing a Zod `schema` validates the response at runtime. `AppError.fromResponse` is the single place to adapt when a backend uses a different error format.

Retries: queries retry server and network errors twice and never retry 4xx responses. Mutations do not retry.

## Mocks

Every feature ships MSW handlers in `features/<name>/mocks/`, registered in `src/mocks/handlers.ts`. A feature whose handlers keep data in memory also registers its store there (`mockStores`), so tests reset it after each test. The handlers serve three purposes:

- development without a backend (`NEXT_PUBLIC_API_MOCKING=enabled`)
- component tests (`tests/setup.ts` starts the MSW server)
- Playwright tests against a production build

In mock mode the app waits in the browser until the mock worker has started, so pages are rendered on the client and status codes (such as 404) are not the real ones. Server rendering and status codes are only realistic with `NEXT_PUBLIC_API_MOCKING=disabled`.

## Forms

React Hook Form with `zodResolver`. Zod error messages are keys of the `validation` namespace in the messages file, so the same schema works in every language. Field errors returned by the server (`AppError.fieldErrors`) are set on the matching fields with `applyFieldErrors`; other failures show a toast.

Small create forms open in a dialog (`member-invite-dialog.tsx`). Editing and larger forms have their own page (`member-edit-view.tsx`). Both use one shared fields component.

## Translations

- Messages live in `src/i18n/messages/<locale>.json`. Keys are typed: a missing key is a TypeScript error.
- A test fails when a locale file is missing keys that the default locale has.
- Dates and numbers are formatted with `useFormatter` from next-intl and the named formats in `src/i18n/formats.ts` (`format.dateTime(date, 'date')`). Currency is passed inline because the currency code comes with the data. The time zone is set in `src/i18n/request.ts`.
- Adding a locale: add it to `src/i18n/routing.ts`, add the messages file, add its name under `locale` in every messages file. The language switcher appears automatically once there are two locales.

## Errors and loading

- `app/[locale]/error.tsx` catches rendering errors and reports them to Sentry.
- `app/global-error.tsx` is the last resort when the root layout fails.
- `app/[locale]/not-found.tsx` is the localized 404 page; `[...rest]` sends unknown paths to it.
- `app/[locale]/(app)/loading.tsx` shows a skeleton during navigation.
- Inside pages, `ErrorState`, `EmptyState` and the DataTable skeleton cover request states.
- A record that does not exist (404 from the API) shows the feature's not-found state inside the app shell, with a link back to the list. `notFound()` is used only for routes that do not exist, not for API data, because in mock mode pages render in the browser.

## Styling

- Brand colors and radius live in `src/styles/tokens.css`. That is the only file to edit when an application gets its own look.
- New shadcn components: `pnpm dlx shadcn@latest add <component>`. They land in `src/shared/ui/`.
- Class names are merged with `cn` and sorted by the Prettier Tailwind plugin.
- How a design file becomes a screen: `docs/design.md`.

## Security headers

`next.config.ts` sends `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security` and a Content-Security-Policy with only `frame-ancestors 'none'`. A full Content-Security-Policy depends on each application's backend, analytics and error tracking, so it is added per application.
