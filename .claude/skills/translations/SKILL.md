---
name: translations
description: How to add and use translated text with next-intl - message files, typed keys, plurals, named date and number formats, currency, locale-aware links.
---

# Translations

- Messages: `src/i18n/messages/<locale>.json`, one namespace per feature plus shared ones (`common`, `errors`, `validation`, `table`, `nav`).
- Client and server components: `useTranslations('<namespace>')`. Async server code: `await getTranslations('<namespace>')`.
- Keys are typed from `en.json`. Every locale file must have the same keys (a test checks this). A key is either a string or a group, never both: `members.edit` is the label, `members.editPage.title` the page title.
- Plurals and variables use ICU: `"{count, plural, one {# item} other {# items}}"`.
- Dates and numbers: `useFormatter()` with the named formats from `src/i18n/formats.ts`: `format.dateTime(date, 'date')`, `format.dateTime(date, 'dateTime')`, `format.number(value, 'percent')`. Add a named format there instead of passing options inline. Never `toLocaleDateString`.
- Currency comes with the data, so it is passed inline: `format.number(amount, { style: 'currency', currency: order.currency })`.
- Links and redirects: `Link`, `useRouter`, `usePathname`, `redirect` from `@/i18n/navigation`.
- Page titles: `generateMetadata` with `getTranslations({ locale: resolveLocale(...), namespace })`.
- New locale: add it to `src/i18n/routing.ts`, create the messages file, add the language name under `locale`.
