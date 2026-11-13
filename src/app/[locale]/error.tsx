'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

import { reportError } from '@/observability/report-error';
import { Button } from '@/shared/ui/button';

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('errors');

  useEffect(() => {
    reportError(error);
  }, [error]);

  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-2xl font-semibold">{t('pageTitle')}</h1>
      <p className="text-muted-foreground">{t('tryAgainHint')}</p>
      <Button onClick={reset}>{t('retry')}</Button>
    </main>
  );
}
