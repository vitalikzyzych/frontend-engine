# Workflow

How a feature or a bug fix goes from idea to pull request, with or without Claude Code. The same steps apply to both developers; Claude Code follows them through `CLAUDE.md`, the skills and the commands in `.claude/`.

## Feature

1. **Brief.** Copy `docs/features/_template.md` to `docs/features/<name>.md`. Fill in the goal, acceptance criteria, screens, data and out of scope. Each criterion describes something a user can see or do, so one test can check it.
2. **Design.** Link the Figma frame or add screenshots under `docs/features/<name>/`. Without a design, describe the layout in a few lines and follow the members screen. Agree on the screens before writing tests, because the tests query by visible text and roles.
3. **Contract and mocks.** Types, MSW handlers and mock data from the Data section. The handlers are the contract until the backend exists, and they let tests and the UI run without it.
4. **Tests first.** Fill in the Tests section of the brief (which test covers which criterion), then write those tests. Run them and see them fail because the behaviour is missing, not because of a typo.
5. **Implementation.** Write code until the tests pass. A test is changed only when the test itself is wrong, never to make a failing implementation pass.
6. **Check while working.** `pnpm check` runs Prettier and ESLint on the changed files, the type check, and the tests related to the changes. In Claude Code it runs automatically before Claude finishes a turn.
7. **Done.** `/done <name>` in Claude Code, or by hand: `pnpm verify`, `pnpm e2e`, and a read of the brief against the tests. Every criterion needs a test that would fail if the behaviour broke.
8. **Pull request** with the template, reviewed by the other developer.

In Claude Code, `/new-feature <name>` runs steps 1 to 7. It stops after the brief for confirmation of the acceptance criteria and the design.

### Starting from API documentation and a design file

1. Put the source files in `docs/features/<name>/`, for example `docs/features/orders/api.md` (or an OpenAPI `.yaml`/`.json`) and `docs/features/orders/design.html` (or screenshots).
2. In a fresh session: `/new-feature orders`. Extra context can follow the name, for example `/new-feature orders orders can be cancelled, not deleted`.
3. Claude reads the files and drafts `docs/features/orders.md`: Data from the API documentation, Screens from the design, acceptance criteria and the Tests section. Differences between the API and the design are listed as open questions. It stops there.
4. Review the acceptance criteria, Data and Out of scope, correct them, and confirm.
5. For a larger feature, `/clear` and run `/new-feature orders` again; the brief exists, so it goes straight to mocks, failing tests and implementation. Otherwise continue in the same session.
6. `pnpm dev` to try it on the mocks, then `/done orders`.

The HTML design is a reference for layout, columns, labels and actions. The screen is built with the project's components and tokens, not by copying the markup. The tests run against MSW mocks built from the API documentation, so a backend that later differs from its documentation shows up only when the real backend is connected.

## Bug fix

1. Reproduce the bug in a test at the lowest level that shows it: schema, hook, component with an MSW override, or Playwright when it needs a real browser.
2. Run the test and see it fail because of the bug.
3. Fix the cause. Keep the change limited to the fix.
4. `pnpm check`, then a pull request. The test stays as a guard against the bug coming back.

In Claude Code: `/fix-bug <description or ticket>`.

## Checks

- **Every Claude Code turn with edits:** a Stop hook runs `pnpm check`.
- **While working:** `pnpm check`.
- **Every commit:** ESLint and Prettier on staged files, commitlint on the message.
- **Before a pull request:** `/done <name>`, or `pnpm verify` and `pnpm e2e` by hand.
- **Every pull request:** CI runs `pnpm verify` and the end-to-end tests.

The Stop hook skips the check when nothing changed, when only Markdown changed, or when the same changes already passed. When the check fails it sends Claude back to fix it, at most three times in a row, then stops and leaves it to the developer. `SKIP_CLAUDE_CHECK=1` turns it off for a session.

## Working with Claude Code efficiently

Most tokens are spent on context: long conversations, large command output and files read without need. These habits keep it small.

- **One task per session.** Start a feature or a bug in a fresh session and `/clear` between tasks. The brief carries the context from one session to the next, so nothing needs to be explained again.
- **Plan in one session, build in the next.** For a larger feature, write and confirm the brief, `/clear`, then run `/new-feature <name>`. The implementation session starts from one page instead of a long discussion.
- **Model per step.** Opus for briefs, unclear bugs and reviews; Sonnet for implementing against a confirmed brief and written tests (`/model`). The `qa` agent used by `/done` already runs on Sonnet.
- **Small checks while working.** `pnpm check` instead of `pnpm verify`; one test file instead of the whole suite (`pnpm test src/features/<name>`). `pnpm verify` and `pnpm e2e` build the app, take minutes and print a lot, so they run once at the end.
- **Point, do not paste.** Give file paths, test names and the failing line rather than whole files or full logs. For a large search across the codebase, ask Claude to use the Explore agent so the search results stay out of the main conversation.
- **Keep `CLAUDE.md` short.** It is loaded in every session. Details belong in skills, which load only when needed, and in `docs/`.
- **Let lint carry the rules.** A rule enforced by ESLint costs no tokens until it is broken. When a review comment repeats, turn it into a lint rule or a line in the matching skill.
