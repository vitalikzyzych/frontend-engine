import { locale as rootLocale } from 'next/root-params';
import { hasLocale, type Messages } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';

import { routing } from './routing';

export default getRequestConfig(async ({ locale: explicitLocale }) => {
  const requested = explicitLocale ?? (await rootLocale());
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
  const messages = (await import(`./messages/${locale}.json`)) as { default: Messages };

  return {
    locale,
    timeZone: 'UTC',
    messages: messages.default,
  };
});
