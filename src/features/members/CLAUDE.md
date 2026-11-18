# Members feature

Workspace members list with invite, edit and remove. Brief with acceptance criteria: `docs/features/members.md`. Route: `/[locale]/members` (`src/app/[locale]/(app)/members/page.tsx`). Public export: `MembersView` only.

## Files

- `types/member.ts`: `Member`, `MEMBER_ROLES`, `MEMBER_SORT_FIELDS`. Adding a role or sort field starts here.
- `api/members.api.ts`: request functions for `GET/POST /members`, `PATCH/DELETE /members/:id`.
- `api/members.keys.ts`: query keys. `api/members.queries.ts`: list query and create, update, delete mutations; every mutation invalidates all member lists.
- `hooks/use-members-search-params.ts`: table state in the URL (page, pageSize, search, role, sort, order) with nuqs.
- `schemas/member-form.schema.ts`: Zod schema shared by the form and the mock handlers. Messages are `validation` keys.
- `components/members-view.tsx`: page component. Owns the form dialog state and the delete confirmation.
- `components/members-columns.tsx`: table columns and the row actions menu.
- `components/members-toolbar.tsx`: search input and role filter.
- `components/member-form-dialog.tsx`: one dialog for create and edit (edit when `member` is passed).
- `components/member-role-badge.tsx`: role badge.
- `mocks/members.data.ts`: in-memory list of 42 members, reset after each test. `mocks/members.handlers.ts`: filtering, sorting, paging and the 409 duplicate email.

## How it works

- The URL is the source of truth for the table. Changing search, role or sort resets `page` to 1.
- The list uses `keepPreviousData`, so the table keeps its rows while the next page loads.
- Server field errors (`fieldErrors` on `AppError`) are set on matching form fields; a duplicate email returns 409 with `fieldErrors.email = 'emailTaken'`. Any other error shows a toast.
- Texts are under `members` in `src/i18n/messages/en.json`; the nav label is `nav.members`.

## Things to know

- The owner cannot be removed: only the UI blocks it (Delete is disabled in `members-columns.tsx`). The mock does not check it.
- The dashboard links to this page with a card (`src/app/[locale]/(app)/dashboard/page.tsx`).
- Tests: `components/members-view.test.tsx`, `schemas/member-form.schema.test.ts`, `tests/e2e/members.spec.ts`. Many tests count on the 42 mock members (for example "41 items" after a delete).
