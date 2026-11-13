'use client';

import { type Table } from '@tanstack/react-table';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/shared/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';

const PAGE_SIZE_OPTIONS = [10, 20, 50];

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export function DataTablePagination<TData>({ table }: DataTablePaginationProps<TData>) {
  const t = useTranslations('table');
  const { pageIndex, pageSize } = table.getState().pagination;
  const pageCount = Math.max(table.getPageCount(), 1);

  return (
    <div className="flex flex-col-reverse items-center justify-between gap-3 sm:flex-row">
      <p className="text-sm text-muted-foreground">{t('total', { count: table.getRowCount() })}</p>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm">{t('rowsPerPage')}</span>
          <Select
            value={String(pageSize)}
            onValueChange={(value) => {
              table.setPagination({ pageIndex: 0, pageSize: Number(value) });
            }}
          >
            <SelectTrigger size="sm" className="w-18" aria-label={t('rowsPerPage')}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZE_OPTIONS.map((option) => (
                <SelectItem key={option} value={String(option)}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <span className="text-sm">{t('page', { page: pageIndex + 1, pageCount })}</span>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label={t('previous')}
          >
            <ChevronLeftIcon />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            aria-label={t('next')}
          >
            <ChevronRightIcon />
          </Button>
        </div>
      </div>
    </div>
  );
}
