# Project guide for Claude Code

Next.js 16 App Router SaaS frontend. TypeScript strict, Tailwind 4, shadcn/ui, TanStack Query, nuqs, React Hook Form + Zod, next-intl, MSW. Package manager: pnpm.

Read `docs/architecture.md` before structural changes. The members feature (`src/features/members/`) is the reference implementation: new features copy its shape.

## Workflow

Full process in `docs/workflow.md`. In short:

- **Feature:** brief in `docs/features/<name>.md` with acceptance criteria, design and a Tests section, confirmed before any code. Then types and MSW mocks, then failing tests, then implementation. `/new-feature <name>`.
- **Bug:** a test that reproduces it and fails first, then the fix. `/fix-bug <description>`.
- **Finish:** `/done <name>` runs `pnpm verify`, `pnpm e2e` and the AC coverage check (`qa` agent), then writes the feature guide.
- **Feature guide:** each feature has `src/features/<name>/CLAUDE.md` (files, data flow, non-obvious rules). Read it before changing a feature instead of reading every file; update it when the change makes it wrong.
- Tests are written before the code they test. Never weaken or delete a test to make it pass; if a test is wrong, fix it and say why.
- A brief that is unclear or contradicts the code: stop and ask, do not guess scope.

## Commands

- `pnpm dev`: development server on mocks
- `pnpm check`: fast check of changed files (format, lint, types, related tests). Runs automatically before you finish a turn (Stop hook); fix what it reports.
- `pnpm verify`: all gates (format, lint, typecheck, tests, knip, build). Slow: run once at the end, not after every change.
- `pnpm test <path>`: one file or folder. `pnpm e2e`: Playwright (builds the app).
- `pnpm lint:fix`, `pnpm format`: fix lint and formatting

## Working efficiently

- Read only the files the task needs. The members feature and the skills answer most "how is this done here" questions.
- Use `pnpm check` and single test files while working; read only the failing part of long output.
- For broad searches across the codebase, use the Explore agent.
- Keep replies short: what changed, what failed, what needs a decision.

## Rules enforced by lint (they fail CI)

- Routes in `src/app/` are thin: read params, render a feature component.
- A feature is imported from outside only through its `index.ts`. `shared/` never imports features.
- Links and navigation come from `@/i18n/navigation`, not `next/link` or `next/navigation` (except `notFound`).
- Environment variables come from `@/env`, never `process.env` (except `NODE_ENV`).
- Boolean variables start with `is`, `has`, `can`, `should`, `will`, `did` or `was`.
- No `console.log`. No unused exports, files or dependencies (knip).

## Conventions

- File names kebab-case, components PascalCase, one component per file.
- No barrel files except each feature's `index.ts`. Import shared code by its path.
- Server components by default. `'use client'` only for state, effects, event handlers or browser APIs.
- Server data: TanStack Query hooks in `features/<name>/api/`. Never call `fetch` or `http` from components.
- Table filters, sorting and pagination: URL state with nuqs. No global store.
- All visible text goes through next-intl. Add keys to `src/i18n/messages/en.json`; keys are typed.
- Zod error messages are keys of the `validation` namespace.
- Every endpoint a feature uses has an MSW handler in `features/<name>/mocks/`, registered in `src/mocks/handlers.ts`.
- Handle loading, empty and error states (`DataTable`, `EmptyState`, `ErrorState`).
- New shadcn components: `pnpm dlx shadcn@latest add <name>` (they go to `src/shared/ui/`, do not hand-edit them).
- Styling uses tokens from `src/styles/tokens.css`; no hardcoded colors.

## Tests

- Component tests next to the file (`*.test.tsx`), rendered with `renderWithProviders` from `@tests/utils/render`. Network goes through MSW; override handlers with `server.use(...)`.
- Query by role and visible text, as a user would. Test names describe behaviour; the brief maps them to ACs.
- One Playwright flow per feature in `tests/e2e/`.

## Skills

Load the matching skill from `.claude/skills/` before starting: `new-feature`, `data-fetching`, `forms`, `ui`, `translations`, `testing`.

## Do not

- Add dependencies without a clear need; check what is already installed first.
- Edit `src/shared/ui/`, `public/mockServiceWorker.js` or generated files.
- Commit, push or merge. The developer does that after review.
