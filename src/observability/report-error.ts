import * as Sentry from '@sentry/nextjs';

/** Sends an error to the error tracker. Does nothing when Sentry is not configured. */
export function reportError(error: unknown) {
  Sentry.captureException(error);
}
