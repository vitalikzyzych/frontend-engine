'use client';

import { useEffect, useState } from 'react';
import { SearchIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { useDebouncedValue } from '@/shared/hooks/use-debounced-value';
import { Input } from '@/shared/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';

import { MEMBER_ROLES, type MemberRole } from '../types/member';

const ALL_ROLES = 'all';

interface MembersToolbarProps {
  search: string;
  role: MemberRole | null;
  onSearchChange: (search: string) => void;
  onRoleChange: (role: MemberRole | null) => void;
}

export function MembersToolbar({
  search,
  role,
  onSearchChange,
  onRoleChange,
}: MembersToolbarProps) {
  const t = useTranslations('members');
  const [searchInput, setSearchInput] = useState(search);
  const debouncedSearch = useDebouncedValue(searchInput);

  useEffect(() => {
    if (debouncedSearch !== search) onSearchChange(debouncedSearch);
  }, [debouncedSearch, search, onSearchChange]);

  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <div className="relative sm:max-w-xs sm:flex-1">
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
        value={role ?? ALL_ROLES}
        onValueChange={(value) => {
          onRoleChange(MEMBER_ROLES.find((item) => item === value) ?? null);
        }}
      >
        <SelectTrigger className="sm:w-44" aria-label={t('filterByRole')}>
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
    </div>
  );
}
