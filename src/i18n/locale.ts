import { notFound } from 'next/navigation';
import { hasLocale, type Locale } from 'next-intl';

import { routing } from './routing';

/** Narrows a route param to a supported locale, or renders the not-found page. */
export function resolveLocale(value: string): Locale {
  if (!hasLocale(routing.locales, value)) notFound();
  return value;
}
