import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

/**
 * Every environment variable the app reads is declared and validated here.
 * The build fails when a value is missing or invalid. Import `env` instead of reading process.env.
 */
export const env = createEnv({
  server: {},
  client: {
    NEXT_PUBLIC_API_URL: z.string().min(1).default('/api'),
    NEXT_PUBLIC_API_MOCKING: z.enum(['enabled', 'disabled']).default('disabled'),
    NEXT_PUBLIC_SENTRY_DSN: z.url().optional(),
  },
  runtimeEnv: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_API_MOCKING: process.env.NEXT_PUBLIC_API_MOCKING,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  },
  emptyStringAsUndefined: true,
});
