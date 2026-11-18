# Members

Owner: engine (reference feature)

## Goal

Workspace admins see who has access, invite new people, open a member's page, change their details and status, and remove members. The feature exists as the pattern to copy for new features: a list, a detail page with tabs, a dialog form, a full-page form and a status action.

## Acceptance criteria

- AC-1: The list shows name, email, role, status and join date, ten per page by default. The name links to the member's page.
- AC-2: Search by name or email, filter by role, by one or more statuses and by a join date range. Filters, sorting and page are in the URL and survive a reload.
- AC-3: Inviting a member happens in a dialog that validates name, email and role. An email that already exists shows an error on the email field.
- AC-4: Editing a member opens its own page with the current values. Saving returns to the member's page; an email that belongs to another member shows an error on the email field.
- AC-5: Removing a member asks for confirmation. The owner cannot be removed.
- AC-6: The list shows loading, empty, filtered-empty and error states, with a retry on error.
- AC-7: The member's page shows email, role, status and join date, with an Overview and an Activity tab. The selected tab is in the URL. A member that does not exist shows a not-found state with a link back to the list; other errors show the error state with a retry.
- AC-8: The Activity tab lists the member's events, newest first, with date and time.
- AC-9: A member who is not deactivated can be deactivated after confirmation; a deactivated member can be reactivated. The owner cannot be deactivated. The new status shows on the member's page and in the list.

## Screens

- `/[locale]/members`: list with toolbar (search, role, status, join date range), row actions (open, edit, delete), invite dialog.
- `/[locale]/members/[id]`: breadcrumbs, header with name, email and actions (edit, deactivate or reactivate), tabs Overview and Activity (`?tab=activity`).
- `/[locale]/members/[id]/edit`: breadcrumbs, full-page form with Save and Cancel.

No design; the layout follows the shared components.

## Data

- `GET /members?page&pageSize&search&role&status&joinedFrom&joinedTo&sort&order` returns `{ items, total, page, pageSize }`. `status` is a comma-separated list (`active,invited`); `joinedFrom` and `joinedTo` are `YYYY-MM-DD` and inclusive.
- `GET /members/:id` returns the member, or 404.
- `GET /members/:id/activity` returns `ActivityEvent[]` (`{ id, type, at }`, `type` one of `invited`, `joined`, `updated`, `deactivated`, `reactivated`), newest first.
- `POST /members` with `{ name, email, role }` returns the member, or 409 with `fieldErrors.email`.
- `PATCH /members/:id` with `{ name, email, role }` returns the member, or 409 with `fieldErrors.email` when another member has that email.
- `POST /members/:id/deactivate` and `POST /members/:id/reactivate` return the member. Deactivating the owner returns 409.
- `DELETE /members/:id` returns 204.

Member `status` is one of `active`, `invited`, `deactivated`.

## Tests

- AC-1: component, `members-view.test.tsx`: "shows the first page of members", "links each name to the member's page"
- AC-2: component, "reads filters from the URL", "searches members and writes the search to the URL", "filters by several statuses and writes them to the URL", "filters by join date range from the URL"; e2e, "keeps table state in the URL after a reload"
- AC-3: schema, `member-form.schema.test.ts`; component, "invites a member and refreshes the list", "shows validation errors from the schema", "maps server field errors onto the form"
- AC-4: component, `member-edit-view.test.tsx`: "fills the form with the current values and saves", "maps server field errors onto the form", "shows a not-found state for an unknown member"; component, `members-view.test.tsx`: "links the edit action to the edit page"
- AC-5: component, "removes a member after confirmation", "does not allow removing the owner"
- AC-6: component, "shows a loading state while the list loads", "shows an empty state when nothing matches", "shows an error state with retry when the request fails"
- AC-7: component, `member-detail-view.test.tsx`: "shows the member's details", "opens the tab from the URL and writes tab changes to the URL", "shows a not-found state for an unknown member", "shows an error state with retry when the request fails"
- AC-8: component, "lists activity newest first"
- AC-9: component, "deactivates a member after confirmation and reactivates them", "does not allow deactivating the owner"
- Main flow: e2e, `tests/e2e/members.spec.ts`: "lists, filters and invites members", "opens a member, checks activity, deactivates and edits"

## Out of scope

Invitation emails, permissions, bulk actions, unsaved-changes warning on the edit page.
