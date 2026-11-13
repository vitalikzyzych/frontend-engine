# Frontend Engine: Plan

This engine is a working Next.js application that serves as the starting point for new SaaS frontends. It is frontend only and is reused across several applications, so it makes no assumptions about the backend, the git host or the hosting provider. Those are decided when a new application starts.

Expensive to change after a few weeks of development, and therefore settled here before the first feature:

- folder structure and import boundaries
- data fetching and state management patterns
- routing shape and translations (locale in the URL)
- design tokens and theming
- error handling, loading and empty states
- quality gates and the review process

Decided per application, not in the engine: API contract and client generation, authentication, multi-tenancy (workspace in the URL), git host and CI service, hosting provider.

Left out until a real need appears: Storybook, analytics, feature flags, global client state, extra UI libraries.

## 1. Key decisions

**Template repository, not a generator.** The current mvp-engine builds each project by running create-next-app, `shadcn@latest` and unpinned installs at scaffold time. Every scaffold comes out different, and breakages show up only after the scaffold. The new engine is itself a running app with a committed lockfile and its own CI. A new application is a copy of it, so what CI tested is exactly what the application receives.

**No presets.** One opinionated stack. Parts that an application may not need (for example error tracking) live in their own folder and are removed by deleting that folder.

**No Redux.** In a SaaS frontend almost all state is server data, and that belongs in a server-state cache, not in a global store. The split is:

- server data: TanStack Query
- filters, sorting, pagination, selected tab: the URL, through nuqs, so every view is linkable and survives a reload
- form state: React Hook Form with Zod
- local UI state: `useState`
- shared client state: Zustand, added only when a real case appears (for example a multi-step wizard spanning routes)

**Backend-neutral data layer.** The engine provides a small fetch helper and TanStack Query setup, and every example works against MSW mocks. How an application talks to its real backend (generated client, hand-written client, auth headers or cookies) is added when that application starts, in one place (`shared/lib/http`), without touching features.

**Feature-based structure with enforced boundaries.** Code is grouped by feature, not by file type, so two developers working on two features rarely touch the same files. Lint rules enforce what may import what.

**Translations from day one, locale in the URL.** All UI text goes through next-intl, with routes under `/[locale]/...`. With one language this costs almost nothing; adding a language later is a content task, not a refactor.

**Neutral on git host and hosting.** All checks run through one command, `pnpm verify`, so any CI service only needs to call it. The engine includes ready pipelines for GitHub Actions and Bitbucket Pipelines; an application keeps the one it needs and deletes the other. The build works on Vercel as is, and `output: 'standalone'` with an included Dockerfile covers self-hosting.

## 2. Stack

- Next.js 16 (App Router), React 19, TypeScript in strict mode with `noUncheckedIndexedAccess`
- pnpm, Node LTS pinned through `.nvmrc` and the `packageManager` field
- Tailwind CSS 4, shadcn/ui, lucide-react icons, next-themes for dark mode, sonner for toasts
- TanStack Query for server state, TanStack Table for data tables
- React Hook Form and Zod for forms and validation
- nuqs for typed URL state
- next-intl for translations
- MSW for mocks in development and tests
- @t3-oss/env-nextjs for validated environment variables
- Vitest, React Testing Library and MSW for unit and integration tests, Playwright for end-to-end tests
- ESLint 9 flat config: Next.js rules, typescript-eslint strict type-checked rules, eslint-plugin-boundaries for import rules, Prettier compatibility
- Prettier with the Tailwind class sorting plugin and an import sorting plugin (replaces the custom sort-imports rule from mvp-engine, which would otherwise need maintaining)
- knip for unused files, exports and dependencies
- husky, lint-staged and commitlint for local checks
- Sentry for error tracking, in its own removable folder, inactive when no DSN is set
- Renovate for dependency updates (works on both GitHub and Bitbucket)

All versions are pinned in `package.json` and the lockfile is committed.

## 3. Folder structure

```
src/
  app/                        routes only: page, layout, loading, error, not-found
    [locale]/
      (public)/               public pages
      (app)/                  application area with the sidebar shell
        members/page.tsx      thin: reads params, renders a feature component
  features/
    members/
      api/                    query keys, queries and mutations for this feature
      components/             UI used only by this feature
      hooks/
      schemas/                form schemas
      utils/
      index.ts                public API of the feature, the only import entry
  shared/
    ui/                       shadcn components (generated, lightly edited)
    components/               app-wide components: DataTable, EmptyState, PageHeader, ConfirmDialog
    hooks/
    lib/
      http/                   fetch helper, error normalization (backend specifics added per app)
      query/                  QueryClient defaults
      format/                 dates, numbers, currency through next-intl
    config/                   navigation, routes, constants
  i18n/
    messages/en.json
    routing.ts
  providers/                  QueryClientProvider, ThemeProvider, intl
  styles/                     globals.css, tokens.css
  env.ts                      validated environment variables
  proxy.ts                    locale detection and redirects (Next.js 16)
tests/
  e2e/
  mocks/                      MSW handlers and test utilities
```

Import rules, enforced by eslint-plugin-boundaries:

- `app` may import from `features`, `shared`, `providers`.
- A feature may import from `shared`, and from another feature only through that feature's `index.ts`.
- `shared` may not import from `features` or `app`.

There are no barrel files except each feature's `index.ts`. Shared code is imported by its path. This removes the circular import and merge conflict problems the current engine has with its barrels.

## 4. Data fetching pattern

- Each feature owns its query keys, queries and mutations in `features/<name>/api/`. Query keys come from one factory per feature, so invalidation is predictable.
- Components use feature hooks, never the fetch helper directly.
- Server Components may prefetch and pass data to the client through TanStack Query hydration when a page benefits from it; otherwise data is fetched on the client.
- Errors are normalized into one `AppError` type in `shared/lib/http`, so every screen shows errors the same way.
- Every feature has MSW handlers, so the UI can be built and tested before or without the real backend.

When an application starts, `shared/lib/http` is connected to its backend: base URL, auth, error format and, if the backend publishes an OpenAPI document, a generated client. Features keep the same shape.

## 5. Quality gates

**Local, on every commit:** lint-staged runs ESLint with `--fix` and Prettier on staged files; commitlint checks the commit message (conventional commits). Fast, so it is never skipped.

**`pnpm verify`, the single command every CI service runs:**

1. Prettier check
2. ESLint
3. type check
4. unit and integration tests
5. knip
6. production build

**Separately in CI:** Playwright tests against the production build with MSW mocks.

**Coverage:** reported on every pull request. A threshold applies only to `shared/lib`, not globally, so it protects critical logic without pushing tests for markup.

**Repository rules (set up per application, on any host):** `main` protected, merges only through pull requests, one approval and green CI required, squash merge, pull request template with feature name, screenshots and checklist. Renovate opens grouped dependency updates weekly.

**Engine CI:** the engine repository has its own job that creates a fresh application with the create script and runs `pnpm verify` and Playwright on it, so a broken engine is caught before an application starts.

## 6. Reference feature

The engine ships one complete feature as the pattern to copy: team members management, a screen almost every SaaS product needs. It runs on MSW mocks and covers:

- table with pagination, sorting and filters stored in the URL
- empty, loading and error states
- create and edit form in a dialog with Zod validation and server error mapping
- delete with a confirmation dialog
- cache invalidation after mutations
- translated text, formatted dates
- tests at each level: a unit test for a hook, an integration test for the table with MSW, one Playwright flow

New features are built by copying its shape, which keeps code consistent between developers and AI tools. An application deletes the feature once its own first feature exists.

## 7. Team workflow

**Branches:** trunk-based. Short branches named `feat/<feature>-<topic>`, `fix/...`, `chore/...`, merged within one to three days. Large features are split into several pull requests; unfinished screens stay unlinked from navigation until complete.

**Ownership:** each feature folder has one owner during a sprint, so parallel work rarely conflicts. Changes to `shared/` go in small separate pull requests, since they affect both developers.

**Feature brief:** before work starts, a short file in `docs/features/<name>.md`: goal, acceptance criteria, screens, data needed, out of scope. This keeps the useful part of the spec-driven idea from mvp-engine without a CI gate on spec status.

**Definition of done:**

- acceptance criteria in the brief are met
- `pnpm verify` and Playwright pass
- loading, empty and error states handled
- all text translated, no hardcoded strings
- MSW handlers and tests added for the feature
- reviewed and approved by the other developer

**Onboarding the second developer:**

1. clone the repository
2. `nvm use` and `corepack enable`
3. `pnpm install`
4. copy `.env.example` to `.env.local`
5. `pnpm dev` (runs on MSW mocks when the backend is not available)
6. read `CONTRIBUTING.md` and the reference feature

## 8. AI assistance

- One `CLAUDE.md`, under 150 lines, describing the code as it actually is.
- A few focused skills: new feature, data fetching, forms, UI, translations, testing. Claude Code only, so there is one copy of the guidance and nothing to keep in sync.
- Project command `/new-feature <name>` creates the feature folder, MSW handlers and brief from the reference feature.
- Rules that matter are enforced by lint, not only described in text.

## 9. Reused from mvp-engine and dropped

Reused: the design token approach in `tokens.css`, the shadcn setup, EmptyState, LoadingState and ErrorBoundary, the boolean naming rule, parts of the guardrails text, the feature brief idea.

Dropped: Redux and RTK Query, presets, the step-by-step generator, the upgrade command, the spec status CI gate, the three copies of the AI guidance, custom lint rules that existing plugins already cover, auth and backend-specific code.

## 10. Build phases

**Phase 1, repository and tooling.** Next.js app, TypeScript, ESLint with boundaries, Prettier, knip, husky, lint-staged, commitlint, Vitest, Playwright, `pnpm verify`, GitHub Actions and Bitbucket Pipelines files, Renovate, Dockerfile. Done when an empty app passes every gate. About 1 to 2 days.

**Phase 2, application shell.** Locale routing with next-intl and `proxy.ts`, route groups, providers, theming with dark mode, validated env, error, loading and not-found pages, application layout with sidebar and navigation config, shared components. About 2 days.

**Phase 3, data layer.** Fetch helper with error normalization, QueryClient defaults, query key pattern, MSW for development, tests and Playwright. About 1 day.

**Phase 4, reference feature.** Team members management as described in section 6. About 2 to 3 days.

**Phase 5, documentation and creation.** `CLAUDE.md`, skills, `CONTRIBUTING.md`, `README.md` (including a checklist for connecting a backend and choosing CI and hosting), the create script that copies the engine into a new application with a fresh git history, and the engine CI job that verifies a fresh application. About 1 to 2 days.

Total: about one and a half to two weeks for one developer.

## 11. Decisions

Confirmed:

- API contract and auth: out of the engine, added per application
- workspace in the URL: no, added per application
- translations: next-intl with the locale in the URL
- git host and hosting: neutral, chosen per application
- engine name and location: `frontend-engine`, next to `mvp-engine`
- error tracking: removable Sentry folder, inactive without a DSN
- AI tools: Claude Code only

## 12. Implementation notes

Status: all phases are built. `pnpm verify`, the Playwright suite and `pnpm engine:check` pass.

Differences from the plan, and why:

- **TypeScript 6.0**, not 7: typescript-eslint does not support TypeScript 7 yet.
- **ESLint 9.39**, not 10: the React and accessibility plugins inside eslint-config-next do not support ESLint 10 yet. ESLint 9 is marked deprecated upstream; move to 10 once eslint-config-next supports it (Renovate will propose it).
- **TanStack Table 8**, not 9: version 9 changed its API substantially; the DataTable uses the stable version 8 API.
- **`cn` package** instead of clsx and tailwind-merge: the current shadcn CLI generates components that import it.
- **Locale from `next/root-params`**: `[locale]/layout.tsx` is the root layout, so pages do not call `setRequestLocale`.
- **Standalone output only for Docker** (`BUILD_STANDALONE=true`), so `pnpm start` and Vercel keep the default output.
- **Mock mode renders on the client**: the app waits for the MSW worker in the browser. Status codes and server rendering are realistic only with mocks disabled.
- **Sentry client SDK** is part of the browser bundle even when no DSN is set (it stays inactive). Applications that do not use Sentry remove it as described in `src/observability/README.md`.
