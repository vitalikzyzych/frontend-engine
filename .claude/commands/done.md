---
description: Final check before a pull request - full gates, end-to-end tests and acceptance criteria coverage. Usage: /done [feature-name]
---

Run the final check for "$ARGUMENTS" (if empty, take the feature from the changed files under `src/features/`).

1. `pnpm verify`. On failure, fix and rerun. Read only the failing part of the output.
2. `pnpm e2e`, when the change touches screens or flows.
3. If `docs/features/$ARGUMENTS.md` exists, run the `qa` agent with the brief path and the feature name. If it reports missing coverage, add the tests and rerun from step 1.
4. Check the definition of done in `CONTRIBUTING.md` that tools cannot check: loading, empty and error states shown, no hardcoded text, new endpoints have MSW handlers.

Report briefly: each step passed or what was fixed, the QA result, and anything that needs a decision. Do not commit.
