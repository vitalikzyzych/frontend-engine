import type { Formats } from 'next-intl';

/**
 * Named formats for dates and numbers, used as `format.dateTime(date, 'date')`.
 * Using a name keeps every screen consistent; add a format here instead of passing options inline.
 * Currency needs the currency code from the data, so it is passed inline:
 * `format.number(amount, { style: 'currency', currency })`.
 */
export const formats = {
  dateTime: {
    date: { dateStyle: 'medium' },
    dateTime: { dateStyle: 'medium', timeStyle: 'short' },
  },
  number: {
    integer: { maximumFractionDigits: 0 },
    percent: { style: 'percent', maximumFractionDigits: 1 },
  },
} satisfies Formats;
