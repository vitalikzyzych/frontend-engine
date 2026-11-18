---
name: data-fetching
description: How to load and change server data - http client, AppError, query keys, TanStack Query hooks, invalidation, detail pages, action endpoints, URL state and MSW mocks.
---

# Data fetching

- Request functions call `http.get/post/put/patch/delete` from `@/shared/lib/http/http-client`. Paths are relative to `NEXT_PUBLIC_API_URL`.
- The feature's `*.api.ts` is the only place that knows the API's shapes. Translate there: arrays to the API's list format, `Date` to the API's date format, renamed fields. When the API differs from the engine's shared types (`Paginated<T>`, sort params), map it in `*.api.ts`; do not change `shared/` for one feature.
- Pass `signal` from the query function so requests cancel. Pass a Zod `schema` when the shape matters at runtime.
- Errors are `AppError` (`status`, `code`, `fieldErrors`, `isNotFound`, `isConflict`...). Check with `isAppError`.
- Query keys come from the feature's key factory: `all`, `lists()`, `list(params)`, `details()`, `detail(id)`. Data that belongs to one record (activity, comments) goes under `detail(id)`, so invalidating the detail refreshes it too.
- Use `queryOptions(...)` and wrap in a `useXxx` hook. Lists use `placeholderData: keepPreviousData`.
- Mutations: `useMutation` with `onSuccess` invalidating `keys.lists()` and, when the mutation has an id, `keys.detail(id)`. See `useInvalidateMembers` in `members.queries.ts`.
- Status changes (deactivate, cancel, approve) are action endpoints (`POST /<entity>/:id/<action>`) with their own mutation hook, not a generic update.
- Detail pages: a 404 shows the feature's not-found state inside the page (`member-not-found.tsx`), other errors `ErrorState` with retry. Do not call `notFound()` for API data.
- Components never call `http` or `fetch` directly.
- List parameters (page, filters, sort) come from nuqs URL state and are part of the query key.
- Every endpoint has an MSW handler in `features/<name>/mocks/`. Use `apiUrl('<path>')` for handler URLs. The handler also enforces the brief's server rules (409 on duplicates, forbidden transitions), so the UI's error handling can be tested.
- Retries are set globally in `src/shared/lib/query/query-client.ts`; do not override per query without a reason.
- Reference: `src/features/members/api/`.
