---
name: translations
description: How to add and use translated text with next-intl - message files, typed keys, plurals, formatting dates and numbers, locale-aware links.
---

# Translations

- Messages: `src/i18n/messages/<locale>.json`, one namespace per feature plus shared ones (`common`, `errors`, `validation`, `table`, `nav`).
- Client and server components: `useTranslations('<namespace>')`. Async server code: `await getTranslations('<namespace>')`.
- Keys are typed from `en.json`. Every locale file must have the same keys (a test checks this).
- Plurals and variables use ICU: `"{count, plural, one {# item} other {# items}}"`.
- Dates and numbers: `useFormatter()` (`format.dateTime`, `format.number`). Never `toLocaleDateString`.
- Links and redirects: `Link`, `useRouter`, `usePathname`, `redirect` from `@/i18n/navigation`.
- Page titles: `generateMetadata` with `getTranslations({ locale: resolveLocale(...), namespace })`.
- New locale: add it to `src/i18n/routing.ts`, create the messages file, add the language name under `locale`.
