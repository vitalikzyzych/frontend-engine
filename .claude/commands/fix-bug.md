---
description: Fix a bug test-first - reproduce it in a failing test, then fix. Usage: /fix-bug <description or ticket>
---

Fix this bug: $ARGUMENTS

1. Find the smallest place the bug can be reproduced: a schema or hook test, a component test with `renderWithProviders` and an MSW override, or a Playwright test only when it needs a real browser.
2. Write a test that describes the correct behaviour. Run it and confirm it fails because of the bug. If it cannot be reproduced, stop and say what information is missing.
3. Fix the cause, not the symptom. Keep the change as small as the fix allows; no unrelated refactoring.
4. Run the new test, then `pnpm check`.
5. Report: the cause in one or two sentences, the fix, and the test that now guards it. If the bug changes behaviour described in a brief, update that brief.
