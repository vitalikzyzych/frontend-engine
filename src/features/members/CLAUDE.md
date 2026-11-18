# Members feature

Workspace members: list with filters, invite dialog, member page with tabs, full-page edit, deactivate and reactivate, remove. Brief with acceptance criteria: `docs/features/members.md`. Routes: `/[locale]/members`, `/[locale]/members/[id]`, `/[locale]/members/[id]/edit` (under `src/app/[locale]/(app)/members/`). Public exports: `MembersView`, `MemberDetailView`, `MemberEditView`.

## Files

- `types/member.ts`: `Member`, `MemberActivity`, `MEMBER_ROLES`, `MEMBER_STATUSES`, `MEMBER_SORT_FIELDS`. Adding a role, status or sort field starts here.
- `api/members.api.ts`: request functions. Translates UI values to the API: status list to `status=a,b`, dates to `YYYY-MM-DD`.
- `api/members.keys.ts`: query keys. `activity(id)` sits under `detail(id)`.
- `api/members.queries.ts`: list, detail and activity queries; create, update, deactivate, reactivate, delete mutations. Every mutation invalidates all lists, and the member's detail (with its activity) when it has an id.
- `hooks/use-members-search-params.ts`: table state in the URL (page, pageSize, search, role, status, joinedFrom, joinedTo, sort, order).
- `hooks/use-member-tab.ts`: selected tab of the member page (`?tab=activity`).
- `schemas/member-form.schema.ts`: Zod schema shared by both forms and the mock handlers. Messages are `validation` keys.
- `components/members-view.tsx`: list page. Owns the invite dialog state and the delete confirmation. Any filter change resets `page` to 1.
- `components/members-columns.tsx`: columns; the name links to the member page; row menu with Open, Edit (links) and Delete.
- `components/members-toolbar.tsx`: search, role select, status multi-select (`DataTableFacetedFilter`), join date range (`DateRangeFilter`).
- `components/member-invite-dialog.tsx`: create form in a dialog.
- `components/member-detail-view.tsx`: member page: breadcrumbs, header actions, Overview and Activity tabs.
- `components/member-overview.tsx`, `member-activity-list.tsx`: tab contents. Activity loads only when its tab is open.
- `components/member-status-actions.tsx`: Deactivate (with confirmation) or Reactivate.
- `components/member-edit-view.tsx` and `member-edit-form.tsx`: edit page; the form mounts only after the member has loaded.
- `components/member-form-fields.tsx`: the fields shared by the invite dialog and the edit form.
- `components/member-not-found.tsx`, `member-page-skeleton.tsx`, `member-role-badge.tsx`, `member-status-badge.tsx`: states and badges.
- `mocks/members.data.ts`: 42 members and their activity, reset after each test. `mocks/members.handlers.ts`: every endpoint in the brief.

## How it works

- The URL is the source of truth for the table and for the selected tab.
- A 404 on the member page or edit page shows `MemberNotFound` inside the app shell; any other error shows `ErrorState` with retry.
- Server field errors go through `applyFieldErrors` (`src/shared/lib/forms/`); a duplicate email returns 409 with `fieldErrors.email = 'emailTaken'` on create and on update. Any other error shows a toast.
- After saving, the edit page navigates to the member page.
- Texts are under `members` in `src/i18n/messages/en.json`; the nav label is `nav.members`. Dates use the named formats `date` and `dateTime`.

## Things to know

- The owner cannot be removed or deactivated. Remove is blocked only in the UI; deactivate is blocked in the UI and the mock returns 409.
- Seed data used by tests: `mem_001` Ada Lovelace (owner), `mem_002` Grace Hopper (active member), `mem_006` deactivated with three events. Status counts: 33 active, 6 invited, 3 deactivated.
- Many tests count on the 42 mock members (for example "41 items" after a delete).
- The dashboard links to the list with a card (`src/app/[locale]/(app)/dashboard/page.tsx`).
- Tests: `components/members-view.test.tsx`, `member-detail-view.test.tsx`, `member-edit-view.test.tsx`, `schemas/member-form.schema.test.ts`, `tests/e2e/members.spec.ts`.
