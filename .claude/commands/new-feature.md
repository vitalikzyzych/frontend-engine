---
description: Create a new feature from the members reference pattern. Usage: /new-feature <name>
---

Create the feature "$ARGUMENTS".

1. Load the `new-feature` skill and follow it.
2. If `docs/features/$ARGUMENTS.md` does not exist, draft it from the template and stop for confirmation of the acceptance criteria.
3. After confirmation, build the feature, run `pnpm verify` and `pnpm e2e`, and report what was created and any open questions.
