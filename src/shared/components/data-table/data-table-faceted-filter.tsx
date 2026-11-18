'use client';

import { ListFilterIcon } from 'lucide-react';

import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';

interface FacetOption<TValue extends string> {
  value: TValue;
  label: string;
}

interface DataTableFacetedFilterProps<TValue extends string> {
  title: string;
  options: FacetOption<TValue>[];
  selected: TValue[];
  onChange: (selected: TValue[]) => void;
}

/** Filter that allows several values at once, for example statuses. The menu stays open while picking. */
export function DataTableFacetedFilter<TValue extends string>({
  title,
  options,
  selected,
  onChange,
}: DataTableFacetedFilterProps<TValue>) {
  function toggle(value: TValue, isChecked: boolean) {
    const next = isChecked ? [...selected, value] : selected.filter((item) => item !== value);
    // Keep the order of the options, so the URL does not depend on the click order.
    onChange(options.map((option) => option.value).filter((item) => next.includes(item)));
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="justify-start">
          <ListFilterIcon />
          {title}
          {selected.length > 0 ? (
            <Badge variant="secondary" className="ml-1 px-1.5" aria-hidden>
              {selected.length}
            </Badge>
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {options.map((option) => (
          <DropdownMenuCheckboxItem
            key={option.value}
            checked={selected.includes(option.value)}
            onCheckedChange={(isChecked) => {
              toggle(option.value, isChecked);
            }}
            onSelect={(event) => {
              event.preventDefault();
            }}
          >
            {option.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
