# New application checklist

Steps after `pnpm create-app <dir>`, in order.

## 1. Identity

- [ ] Set `metadata.title` and `metadata.description` in `src/i18n/messages/en.json`.
- [ ] Set brand colors and radius in `src/styles/tokens.css`.
- [ ] Replace the logo icon in `src/shared/components/app-shell/app-sidebar.tsx` and add a favicon in `src/app/[locale]/`.
- [ ] Rewrite `README.md` for the application.

## 2. Repository and CI

- [ ] GitHub: keep `.github/`, delete `bitbucket-pipelines.yml`. Bitbucket: the opposite.
- [ ] Protect `main`: pull requests only, one approval, CI required, squash merge.
- [ ] Enable Renovate for the repository.

## 3. Hosting

- [ ] Vercel: import the repository, set the environment variables from `.env.example`. The Dockerfile can be deleted.
- [ ] Self-hosted: build the Dockerfile with `NEXT_PUBLIC_*` values as build arguments.

## 4. Backend

- [ ] Set `NEXT_PUBLIC_API_URL`. For a same-origin setup, add a rewrite from `/api/:path*` to the backend in `next.config.ts`.
- [ ] Adapt `AppError.fromResponse` in `src/shared/lib/http/app-error.ts` to the backend error format.
- [ ] Agree on the pagination shape and adapt `src/shared/types/pagination.ts`.
- [ ] If the backend publishes an OpenAPI document, consider generating request functions and types from it.

## 5. Authentication

- [ ] Choose the approach with the backend (cookie session or bearer token, or a provider).
- [ ] Credentials or headers in `src/shared/lib/http/http-client.ts`, 401 handling in one place.
- [ ] Route protection in `src/proxy.ts` and in `src/app/[locale]/(app)/layout.tsx`.

## 6. Optional

- [ ] Sentry: set the variables, or remove it (see `src/observability/README.md`).
- [ ] More locales: see "Translations" in `docs/architecture.md`.
- [ ] Workspace or tenant in the URL: add a `[workspace]` segment under `(app)` before the first features.

## 7. First feature

- [ ] Write the brief in `docs/features/`.
- [ ] Build it from the members pattern (`/new-feature <name>` in Claude Code).
- [ ] Delete the members feature once the first feature exists. Keep it until then, it is the reference.
  - `src/features/members/` and `docs/features/members.md`
  - the routes in `src/app/[locale]/(app)/members/`
  - the navigation entry and the `'/members'` value of `NavItem.href` in `src/shared/config/navigation.ts`
  - the members card in `src/app/[locale]/(app)/dashboard/page.tsx` and its `dashboard.members*` messages
  - `members` and `nav.members` in every messages file
  - its handlers and its mock store in `src/mocks/handlers.ts`
  - `tests/e2e/members.spec.ts`, and the step that clicks Members in `tests/e2e/navigation.spec.ts`
  - Run `pnpm verify` and `pnpm e2e`; knip reports shared components no feature uses any more. Keep them if the application will need them.
