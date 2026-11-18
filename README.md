# Frontend Engine

A tested starting point for SaaS frontends. The engine is itself a running Next.js application with a committed lockfile and its own CI. A new application is a copy of it, so every application starts from exactly what was tested.

It replaces the frontend part of mvp-engine: the same goals, rebuilt as a tested template instead of a scaffold generator. What was kept and dropped, and why, is in [docs/PLAN.md](docs/PLAN.md).

The engine is frontend only and makes no assumptions about the backend, authentication, git host or hosting provider. Those are chosen when an application starts (see [docs/new-app-checklist.md](docs/new-app-checklist.md)).

## What is included

- **Next.js 16** App Router, React 19, TypeScript in strict mode
- **UI**: Tailwind CSS 4, shadcn/ui, lucide icons, dark mode, toasts, an application shell with a collapsible sidebar
- **Data**: TanStack Query with a small fetch client and one normalized error type, MSW mocks for development and tests
- **URL state**: nuqs, so filters, sorting and pagination survive a reload and can be shared as links
- **Forms**: React Hook Form with Zod, translated validation messages, server field errors mapped onto the form
- **Translations**: next-intl with the locale in the URL (`/en/...`) and typed message keys
- **Tables**: a generic DataTable on TanStack Table with server-side pagination and sorting
- **Validated environment**: `src/env.ts`, the build fails on missing or invalid variables
- **Error tracking**: Sentry, inactive until a DSN is set, removable in five steps
- **Reference feature**: team members management, the pattern to copy for new features
- **Quality gates**: ESLint with architecture rules, Prettier, TypeScript, Vitest, Playwright, knip, husky, lint-staged, commitlint, Renovate
- **CI**: GitHub Actions and Bitbucket Pipelines, both calling the same `pnpm verify`
- **Hosting**: works on Vercel as is; a Dockerfile with standalone output covers self-hosting
- **AI**: `CLAUDE.md`, focused skills, `/new-feature`, `/fix-bug` and `/done` commands, a short guide in each feature folder, and a hook that checks the changed code before Claude finishes a turn

## Requirements

- Node.js 22 (see `.nvmrc`)
- pnpm through corepack: `corepack enable`

## Start a new application

```bash
cd frontend-engine
pnpm install
pnpm create-app ../my-app
cd ../my-app
cp .env.example .env.local
pnpm dev
```

`create-app` copies the engine without its git history and engine-only files, renames the package, installs dependencies and makes the first commit. Then follow [docs/new-app-checklist.md](docs/new-app-checklist.md).

## Work on the engine itself

```bash
pnpm install
cp .env.example .env.local
pnpm dev            # http://localhost:3000, runs on MSW mocks
```

## Commands

| Command                                                | What it does                                                               |
| ------------------------------------------------------ | -------------------------------------------------------------------------- |
| `pnpm dev`                                             | Development server                                                         |
| `pnpm build` / `pnpm start`                            | Production build and server                                                |
| `pnpm check`                                           | Fast check of changed files: format, lint, types, related tests            |
| `pnpm verify`                                          | Every quality gate: format, lint, types, tests, knip, build                |
| `pnpm lint` / `pnpm lint:fix`                          | ESLint, including architecture rules                                       |
| `pnpm format`                                          | Prettier                                                                   |
| `pnpm typecheck`                                       | Route type generation and TypeScript                                       |
| `pnpm test` / `pnpm test:watch` / `pnpm test:coverage` | Vitest                                                                     |
| `pnpm e2e`                                             | Playwright against a production build with mocks (`pnpm e2e:install` once) |
| `pnpm knip`                                            | Unused files, exports and dependencies                                     |
| `pnpm create-app <dir>`                                | New application from the engine (engine only)                              |
| `pnpm engine:check`                                    | Creates a fresh application and runs `pnpm verify` on it (engine only)     |

## Documentation

- [docs/workflow.md](docs/workflow.md): how a feature or bug fix goes from brief to pull request, tests first, and working with Claude Code
- [docs/architecture.md](docs/architecture.md): folder structure, import rules, data fetching, state, forms, translations, errors
- [CONTRIBUTING.md](CONTRIBUTING.md): workflow for the team, branches, reviews, definition of done
- [docs/new-app-checklist.md](docs/new-app-checklist.md): steps when an application starts
- [docs/features/](docs/features/): feature briefs
- [docs/PLAN.md](docs/PLAN.md): the plan and the decisions behind the engine
- [src/observability/README.md](src/observability/README.md): enabling or removing Sentry
