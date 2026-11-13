'use client';

import { useTransition } from 'react';
import { useLocale, useTranslations, type Locale } from 'next-intl';

import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';

const LOCALES: readonly Locale[] = routing.locales;

/** Renders nothing while the app has a single locale. */
export function LocaleSwitcher() {
  const t = useTranslations('locale');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  if (LOCALES.length < 2) return null;

  function onChange(next: string) {
    startTransition(() => {
      router.replace(pathname, { locale: next as Locale });
    });
  }

  return (
    <Select value={locale} onValueChange={onChange} disabled={isPending}>
      <SelectTrigger size="sm" aria-label={t('label')}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {LOCALES.map((item) => (
          <SelectItem key={item} value={item}>
            {t(item)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
