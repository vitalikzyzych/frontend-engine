import type { NextConfig } from 'next';
import { withSentryConfig } from '@sentry/nextjs/config';

/** Wraps the Next.js config with Sentry only when a DSN is configured. */
export function withSentry(config: NextConfig): NextConfig {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) return config;

  return withSentryConfig(config, {
    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,
    authToken: process.env.SENTRY_AUTH_TOKEN,
    silent: !process.env.CI,
    widenClientFileUpload: true,
    tunnelRoute: '/monitoring',
    sourcemaps: { disable: !process.env.SENTRY_AUTH_TOKEN },
  });
}
