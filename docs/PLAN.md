# Frontend Engine: decisions

This engine is a working Next.js application that serves as the starting point for new SaaS frontends. It is frontend only and is reused across several applications, so it makes no assumptions about the backend, the git host or the hosting provider. This file records what was decided and why. How the code works is in `docs/architecture.md`, how work is done in `docs/workflow.md` and `CONTRIBUTING.md`. It is not copied into new applications.

## Scope

Settled in the engine, because it is expensive to change after a few weeks of development:

- folder structure and import boundaries
- data fetching and state management patterns
- routing shape and translations (locale in the URL)
- design tokens and theming
- error handling, loading, empty and not-found states
- list, detail and form screen patterns (the members feature)
- quality gates and the review process

Decided per application, not in the engine: API contract and client generation, authentication and permissions, multi-tenancy (workspace in the URL), git host and CI service, hosting provider, brand (see `docs/design.md`).

Left out until a real need appears: Storybook, analytics, feature flags, global client state, extra UI libraries.

## Key decisions

**Template repository, not a generator.** The earlier mvp-engine built each project by running create-next-app, `shadcn@latest` and unpinned installs at scaffold time, so every scaffold came out different. This engine is itself a running app with a committed lockfile and its own CI. A new application is a copy of it (`pnpm create-app`), so what CI tested is exactly what the application receives. The engine's CI also creates a fresh application and runs `pnpm verify` on it.

**No presets.** One opinionated stack. Parts an application may not need (error tracking) live in their own folder and are removed by deleting that folder.

**No Redux.** In a SaaS frontend almost all state is server data, which belongs in a server-state cache. Server data in TanStack Query, filters, sorting, pagination and tabs in the URL through nuqs, form state in React Hook Form, local UI state in `useState`. Zustand is added only when a real case appears, for example a wizard spanning routes.

**Backend-neutral data layer.** A small fetch client with one error type (`AppError`), and every example runs on MSW mocks. Connecting a real backend happens in `src/shared/lib/http` and in each feature's `*.api.ts`, without touching components.

**Feature-based structure with enforced boundaries.** Code is grouped by feature, so two developers rarely touch the same files. ESLint enforces what may import what. No barrel files except each feature's `index.ts`.

**Translations from day one, locale in the URL.** All UI text goes through next-intl, with routes under `/[locale]/...`. Adding a language later is a content task, not a refactor.

**Neutral on git host and hosting.** All checks run through `pnpm verify`, so any CI only needs to call it. Pipelines for GitHub Actions and Bitbucket Pipelines are included; an application keeps one. The build works on Vercel as is; `output: 'standalone'` with the Dockerfile covers self-hosting.

**One reference feature instead of many examples.** Members covers a list with filters in the URL, a detail page with tabs, a dialog form, a full-page form, a status action, deletion, and every state. New features copy its shape, which keeps code consistent between developers and AI tools.

**Tests first, with Claude Code as the main tool.** Briefs with acceptance criteria, mocks as the contract, failing tests before code. One `CLAUDE.md`, focused skills, the `/new-feature`, `/fix-bug` and `/done` entry points and a Stop hook that runs `pnpm check`. Rules that matter are enforced by lint, not only described in text.

## Stack

- Next.js 16 (App Router), React 19, TypeScript in strict mode with `noUncheckedIndexedAccess`
- pnpm, Node LTS pinned through `.nvmrc` and the `packageManager` field
- Tailwind CSS 4, shadcn/ui, lucide-react, next-themes, sonner
- TanStack Query, TanStack Table, React Hook Form, Zod, nuqs, next-intl
- MSW for mocks in development, unit tests and end-to-end tests
- @t3-oss/env-nextjs for validated environment variables
- Vitest, React Testing Library, Playwright
- ESLint 9 (Next.js, typescript-eslint strict type-checked, eslint-plugin-boundaries), Prettier with Tailwind and import sorting, knip
- husky, lint-staged, a small commit message check (`scripts/check-commit-message.mjs`)
- Sentry in a removable folder, inactive without a DSN
- Renovate, grouped weekly updates

All versions are pinned in `package.json` and the lockfile is committed.

## Quality gates

- **Every commit:** ESLint and Prettier on staged files, a length check on the first line of the message. No prefix format: pull requests are squash merged, so the pull request title is what lands on `main`.
- **`pnpm verify`, run by every CI:** Prettier check, ESLint, type check, unit and integration tests with coverage, knip, production build. The coverage threshold (80 percent) applies only to `src/shared/lib/`, so it protects shared logic without pushing tests for markup.
- **Separately in CI:** Playwright against the production build on mocks.
- **Repository rules, set per application:** `main` protected, pull requests only, one approval and green CI, squash merge.

## Versions that differ from the plan

- **TypeScript 6.0**, not 7: typescript-eslint does not support TypeScript 7 yet.
- **ESLint 9.39**, not 10: the plugins inside eslint-config-next do not support ESLint 10 yet. Move once they do; Renovate will propose it.
- **TanStack Table 8**, not 9: version 9 changed its API substantially.
- **`cn` package** instead of clsx and tailwind-merge: the current shadcn CLI generates components that import it.

## Behaviour worth knowing

- **Locale from `next/root-params`:** `[locale]/layout.tsx` is the root layout, so pages do not call `setRequestLocale`.
- **Standalone output only for Docker** (`BUILD_STANDALONE=true`), so `pnpm start` and Vercel keep the default output.
- **Mock mode renders on the client:** the app waits for the MSW worker in the browser. Status codes and server rendering are realistic only with mocks disabled. For the same reason a missing record shows a not-found state inside the page instead of calling `notFound()`.
- **`NEXT_PUBLIC_*` values are set at build time**, so a Docker image is built per environment.
- **Sentry's client SDK** is part of the browser bundle even without a DSN. Applications that do not use it remove it as described in `src/observability/README.md`.
- **Security headers** are set in `next.config.ts`. A full Content-Security-Policy is added per application.

## Reused from mvp-engine and dropped

Reused: the design token approach in `tokens.css`, the shadcn setup, empty, loading and error states, the boolean naming rule, the feature brief idea, the test-first loop and the acceptance criteria coverage check.

Dropped: Redux and RTK Query, presets, the step-by-step generator, the upgrade command, the spec status CI gate, the multi-stage agent pipeline, three copies of the AI guidance, custom lint rules that existing plugins cover, auth and backend-specific code.
