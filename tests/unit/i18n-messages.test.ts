import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { routing } from '@/i18n/routing';

const MESSAGES_DIR = join(process.cwd(), 'src/i18n/messages');

function flattenKeys(value: unknown, prefix = ''): string[] {
  if (typeof value !== 'object' || value === null) return [prefix];
  return Object.entries(value).flatMap(([key, child]) =>
    flattenKeys(child, prefix ? `${prefix}.${key}` : key),
  );
}

function loadKeys(locale: string) {
  const file = readFileSync(join(MESSAGES_DIR, `${locale}.json`), 'utf8');
  return flattenKeys(JSON.parse(file)).sort();
}

describe('translations', () => {
  it('has a messages file for every configured locale and no extra files', () => {
    const files = readdirSync(MESSAGES_DIR).map((file) => file.replace(/\.json$/, ''));
    expect(files.sort()).toEqual([...routing.locales].sort());
  });

  it.each(routing.locales)('%s has exactly the same keys as the default locale', (locale) => {
    expect(loadKeys(locale)).toEqual(loadKeys(routing.defaultLocale));
  });
});
