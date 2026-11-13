# Observability

Error tracking with Sentry. It stays inactive until `NEXT_PUBLIC_SENTRY_DSN` is set.

To enable it, set `NEXT_PUBLIC_SENTRY_DSN`, and for readable stack traces also `SENTRY_ORG`, `SENTRY_PROJECT` and `SENTRY_AUTH_TOKEN` in the build environment.

To remove it from an application:

1. Delete this folder, `src/instrumentation.ts` and `src/instrumentation-client.ts`.
2. In `next.config.ts`, remove the `withSentry` import and wrapper.
3. In `src/app/global-error.tsx` and `src/app/[locale]/error.tsx`, remove the `reportError` call.
4. Remove `NEXT_PUBLIC_SENTRY_DSN` from `src/env.ts` and the Sentry lines from `.env.example`.
5. Run `pnpm remove @sentry/nextjs` and `pnpm verify`.
