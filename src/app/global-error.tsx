'use client';

import { useEffect } from 'react';
import NextError from 'next/error';

import { reportError } from '@/observability/report-error';

// Last-resort boundary when the root layout itself fails. Translations are not available here.
export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    reportError(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <NextError statusCode={500} />
      </body>
    </html>
  );
}
