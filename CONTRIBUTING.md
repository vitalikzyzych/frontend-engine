# Contributing

## Setup

1. Clone the repository.
2. `nvm use` and `corepack enable`.
3. `pnpm install` (also installs the git hooks).
4. `cp .env.example .env.local`.
5. `pnpm dev`. With `NEXT_PUBLIC_API_MOCKING=enabled` the app runs on MSW mocks, no backend needed.
6. Read [docs/workflow.md](docs/workflow.md), [docs/architecture.md](docs/architecture.md) and the members feature in `src/features/members/`.

## Branches and commits

- Trunk-based: short branches from `main`, merged within one to three days.
- Branch names: `feat/<feature>-<topic>`, `fix/<topic>`, `chore/<topic>`.
- Commit messages follow conventional commits (`feat: ...`, `fix: ...`, `chore: ...`). commitlint checks this on every commit.
- Large features are split into several pull requests. Unfinished screens stay unlinked from navigation until they are complete.

## Working in parallel

- Each feature folder has one owner during a sprint, so two people rarely edit the same files.
- Changes to `src/shared/` go in small separate pull requests, since they affect everyone.
- A new feature starts with a short brief in `docs/features/<name>.md` (copy `_template.md`), confirmed before code is written.
- Tests come before the implementation, for features and for bug fixes. The steps are in [docs/workflow.md](docs/workflow.md).
- In Claude Code: `/new-feature <name>`, `/fix-bug <description>` and `/done <name>`.

## Checks

- While working: `pnpm check` (changed files, types, related tests). Claude Code runs it automatically before finishing a turn.
- On commit: ESLint with `--fix` and Prettier on staged files, commitlint on the message.
- Before opening a pull request: `pnpm verify` and `pnpm e2e`, or `/done <name>` in Claude Code.
- In CI: `pnpm verify` and the Playwright tests.

## Pull requests

- One approval and green CI are required. Squash merge.
- Fill in the template: what changed, how to test, screenshots for UI changes.
- Reviews look at: behaviour against the brief, loading, empty and error states, translations, tests, and whether new code follows the members pattern.

## Definition of done

- Acceptance criteria in the brief are met, and each one is covered by a test listed in the brief.
- Bug fixes include a test that failed before the fix.
- `pnpm verify` and Playwright pass.
- Loading, empty and error states are handled.
- All text is translated, no hardcoded strings.
- The feature guide `src/features/<name>/CLAUDE.md` matches the code.
- MSW handlers and tests are added or updated.
- Reviewed and approved.
