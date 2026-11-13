# Members

Owner: engine (reference feature)

## Goal

Workspace admins see who has access, invite new people, change roles and remove members. The feature exists as the pattern to copy for new features.

## Acceptance criteria

- AC-1: The list shows name, email, role, status and join date, ten per page by default.
- AC-2: Search by name or email and filter by role. Filters, sorting and page are in the URL and survive a reload.
- AC-3: Inviting a member validates name, email and role. An email that already exists shows an error on the email field.
- AC-4: Editing a member opens the same form with the current values.
- AC-5: Removing a member asks for confirmation. The owner cannot be removed.
- AC-6: Loading, empty, filtered-empty and error states are shown, with a retry on error.

## Screens

`/[locale]/members`

## Data

- `GET /members?page&pageSize&search&role&sort&order` returns `{ items, total, page, pageSize }`
- `POST /members` with `{ name, email, role }` returns the member, or 409 with `fieldErrors.email`
- `PATCH /members/:id` with `{ name, email, role }` returns the member
- `DELETE /members/:id` returns 204

## Out of scope

Invitation emails, permissions, bulk actions.
