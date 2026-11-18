---
description: Build a feature test-first from its brief, following the members pattern. Usage: /new-feature <name>
---

Build a feature from "$ARGUMENTS". The first word is the feature name (`<name>` below); anything after it is extra context from the developer. Follow `docs/workflow.md` and the `new-feature` skill.

1. If `docs/features/<name>.md` does not exist, read every file in `docs/features/<name>/` (API documentation, HTML designs, screenshots) and any paths given in the arguments. Take the Data section from the API documentation and the Screens section from the design. An HTML design is a reference for layout, columns, labels and actions; build it with the project's components and tokens, do not copy its markup. When the API documentation and the design disagree, list the differences in the brief as open questions. Draft the brief from `docs/features/_template.md`, including the Tests section, then stop and ask for confirmation of the acceptance criteria and the design. Do not write code before that.
2. After confirmation: types, MSW handlers and mock data from the brief's Data section.
3. Write the tests from the brief's Tests section. Run them and confirm they fail for the right reason (missing behaviour, not a typo or import error).
4. Implement until the tests pass. Do not change a test to make it pass unless the test itself is wrong; say so when that happens.
5. Finish with `/done <name>`.
