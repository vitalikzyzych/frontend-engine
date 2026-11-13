'use client';

import { AlertTriangleIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { isAppError } from '@/shared/lib/http/app-error';
import { Button } from '@/shared/ui/button';

interface ErrorStateProps {
  error: unknown;
  onRetry?: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  const t = useTranslations('errors');

  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-10 text-center"
    >
      <AlertTriangleIcon className="size-8 text-destructive" aria-hidden />
      <div className="space-y-1">
        <p className="font-medium">{t(errorMessageKey(error))}</p>
        <p className="text-sm text-muted-foreground">{t('tryAgainHint')}</p>
      </div>
      {onRetry ? (
        <Button variant="outline" size="sm" onClick={onRetry}>
          {t('retry')}
        </Button>
      ) : null}
    </div>
  );
}

function errorMessageKey(error: unknown) {
  if (!isAppError(error)) return 'unexpected';
  if (error.kind === 'network') return 'network';
  if (error.isForbidden) return 'forbidden';
  if (error.isNotFound) return 'notFound';
  if (error.status >= 500) return 'server';
  return 'unexpected';
}
