# <Feature name>

Owner: <name>

## Goal

One or two sentences: what the user can do and why.

## Acceptance criteria

Each criterion is observable (what the user sees or can do) and can be checked by one automated test.

- AC-1: ...
- AC-2: ...

## Screens

Routes and the main states (loading, empty, error). Design: a Figma link to the frame, or an HTML file or screenshots in `docs/features/<name>/`. When there is no design, describe the layout in a few lines and follow the members screen.

## Data

Endpoints or data the feature needs, and the agreed request and response shapes. Until the backend exists, the MSW handlers in `src/features/<name>/mocks/` follow this.

## Tests

Written before the implementation. One line per AC: the level and what the test does.

- AC-1: component, `<name>-view.test.tsx`: ...
- AC-2: e2e, `tests/e2e/<name>.spec.ts`: ...

## Open questions

Differences between the API documentation and the design, and anything either one leaves open. Each question is answered in the brief or moved to Out of scope before tests are written; this section is empty when the brief is confirmed.

- ...

## Out of scope

What this feature deliberately does not do.
