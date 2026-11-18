import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

import { withSentry } from './src/observability/with-sentry';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/**
 * Sent with every response. A full Content-Security-Policy (scripts, styles, connections) depends on
 * the backend, analytics and error tracking of each application, so only `frame-ancestors` is set here.
 * Strict-Transport-Security is ignored by browsers over plain HTTP, so it is safe in development.
 */
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Content-Security-Policy', value: "frame-ancestors 'none'" },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
];

const nextConfig: NextConfig = {
  // Standalone output is only needed for the Docker image; `next start` and Vercel use the default.
  output: process.env.BUILD_STANDALONE === 'true' ? 'standalone' : undefined,
  poweredByHeader: false,
  reactStrictMode: true,
  headers: () => Promise.resolve([{ source: '/:path*', headers: securityHeaders }]),
};

export default withSentry(withNextIntl(nextConfig));
