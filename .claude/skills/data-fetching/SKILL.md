---
name: data-fetching
description: How to load and change server data - http client, AppError, query keys, TanStack Query hooks, invalidation, URL state and MSW mocks.
---

# Data fetching

- Request functions call `http.get/post/put/patch/delete` from `@/shared/lib/http/http-client`. Paths are relative to `NEXT_PUBLIC_API_URL`.
- Pass `signal` from the query function so requests cancel. Pass a Zod `schema` when the shape matters at runtime.
- Errors are `AppError` (`status`, `code`, `fieldErrors`, `isNotFound`, `isConflict`...). Check with `isAppError`.
- Query keys come from the feature's key factory: `all`, `lists()`, `list(params)`, `detail(id)`.
- Use `queryOptions(...)` and wrap in a `useXxx` hook. Lists use `placeholderData: keepPreviousData`.
- Mutations: `useMutation` with `onSuccess` invalidating `keys.lists()` (and `detail(id)` when it exists).
- Components never call `http` or `fetch` directly.
- List parameters (page, filters, sort) come from nuqs URL state and are part of the query key.
- Every endpoint has an MSW handler in `features/<name>/mocks/`. Use `apiUrl('<path>')` for handler URLs.
- Retries are set globally in `src/shared/lib/query/query-client.ts`; do not override per query without a reason.
