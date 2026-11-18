'use client';

import { Input } from '@/shared/ui/input';

interface DateRange {
  from: Date | null;
  to: Date | null;
}

interface DateRangeFilterProps extends DateRange {
  fromLabel: string;
  toLabel: string;
  onChange: (range: DateRange) => void;
}

/**
 * Two native date inputs. Dates are whole days in UTC, the same as nuqs `parseAsIsoDate`,
 * so `2026-01-05` in the URL, in the input and in the API all mean the same day.
 */
export function DateRangeFilter({ from, to, fromLabel, toLabel, onChange }: DateRangeFilterProps) {
  return (
    <div className="flex gap-2">
      <Input
        type="date"
        aria-label={fromLabel}
        title={fromLabel}
        value={toInputValue(from)}
        max={toInputValue(to) || undefined}
        onChange={(event) => {
          onChange({ from: fromInputValue(event.target.value), to });
        }}
        className="sm:w-40"
      />
      <Input
        type="date"
        aria-label={toLabel}
        title={toLabel}
        value={toInputValue(to)}
        min={toInputValue(from) || undefined}
        onChange={(event) => {
          onChange({ from, to: fromInputValue(event.target.value) });
        }}
        className="sm:w-40"
      />
    </div>
  );
}

function toInputValue(date: Date | null) {
  return date ? date.toISOString().slice(0, 10) : '';
}

function fromInputValue(value: string) {
  return value ? new Date(value) : null;
}
