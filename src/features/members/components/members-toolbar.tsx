'use client';

import { useEffect, useState } from 'react';
import { SearchIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { DataTableFacetedFilter } from '@/shared/components/data-table/data-table-faceted-filter';
import { DateRangeFilter } from '@/shared/components/date-range-filter';
import { useDebouncedValue } from '@/shared/hooks/use-debounced-value';
import { Input } from '@/shared/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';

import { MEMBER_ROLES, MEMBER_STATUSES, type MemberRole, type MemberStatus } from '../types/member';

const ALL_ROLES = 'all';

export interface MembersFilters {
  search: string;
  role: MemberRole | null;
  status: MemberStatus[];
  joinedFrom: Date | null;
  joinedTo: Date | null;
}

interface MembersToolbarProps {
  filters: MembersFilters;
  /** Called with the changed filters only. */
  onFiltersChange: (changes: Partial<MembersFilters>) => void;
}

export function MembersToolbar({ filters, onFiltersChange }: MembersToolbarProps) {
  const t = useTranslations('members');
  const [searchInput, setSearchInput] = useState(filters.search);
  const debouncedSearch = useDebouncedValue(searchInput);

  useEffect(() => {
    if (debouncedSearch !== filters.search) onFiltersChange({ search: debouncedSearch });
  }, [debouncedSearch, filters.search, onFiltersChange]);

  return (
    <div className="flex flex-col gap-2 lg:flex-row lg:flex-wrap">
      <div className="relative lg:max-w-xs lg:flex-1">
        <SearchIcon className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={searchInput}
          onChange={(event) => {
            setSearchInput(event.target.value);
          }}
          placeholder={t('searchPlaceholder')}
          aria-label={t('searchPlaceholder')}
          className="pl-8"
        />
      </div>
      <Select
        value={filters.role ?? ALL_ROLES}
        onValueChange={(value) => {
          onFiltersChange({ role: MEMBER_ROLES.find((item) => item === value) ?? null });
        }}
      >
        <SelectTrigger className="lg:w-44" aria-label={t('filterByRole')}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_ROLES}>{t('allRoles')}</SelectItem>
          {MEMBER_ROLES.map((item) => (
            <SelectItem key={item} value={item}>
              {t(`roles.${item}`)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <DataTableFacetedFilter
        title={t('filterByStatus')}
        options={MEMBER_STATUSES.map((value) => ({ value, label: t(`statuses.${value}`) }))}
        selected={filters.status}
        onChange={(status) => {
          onFiltersChange({ status });
        }}
      />
      <DateRangeFilter
        from={filters.joinedFrom}
        to={filters.joinedTo}
        fromLabel={t('joinedFrom')}
        toLabel={t('joinedTo')}
        onChange={({ from, to }) => {
          onFiltersChange({ joinedFrom: from, joinedTo: to });
        }}
      />
    </div>
  );
}
