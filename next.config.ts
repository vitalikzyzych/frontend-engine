import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

import { withSentry } from './src/observability/with-sentry';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  // Standalone output is only needed for the Docker image; `next start` and Vercel use the default.
  output: process.env.BUILD_STANDALONE === 'true' ? 'standalone' : undefined,
  poweredByHeader: false,
  reactStrictMode: true,
};

export default withSentry(withNextIntl(nextConfig));
