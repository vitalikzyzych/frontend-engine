'use client';

import { type ReactNode } from 'react';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type PaginationState,
  type SortingState,
} from '@tanstack/react-table';
import { useTranslations } from 'next-intl';

import { Skeleton } from '@/shared/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';

import { DataTablePagination } from './data-table-pagination';

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  rowCount: number;
  pagination: PaginationState;
  onPaginationChange: (pagination: PaginationState) => void;
  sorting?: SortingState;
  onSortingChange?: (sorting: SortingState) => void;
  isLoading?: boolean;
  emptyState?: ReactNode;
  getRowId?: (row: TData) => string;
}

/**
 * Table for server-side data: pagination and sorting are controlled by the caller
 * (usually from URL state) and sent to the API.
 */
export function DataTable<TData>({
  columns,
  data,
  rowCount,
  pagination,
  onPaginationChange,
  sorting = [],
  onSortingChange,
  isLoading = false,
  emptyState,
  getRowId,
}: DataTableProps<TData>) {
  const t = useTranslations('table');

  // eslint-disable-next-line react-hooks/incompatible-library -- TanStack Table v8 is not React Compiler compatible yet
  const table = useReactTable({
    data,
    columns,
    rowCount,
    getRowId,
    state: { pagination, sorting },
    manualPagination: true,
    manualSorting: true,
    enableSortingRemoval: false,
    getCoreRowModel: getCoreRowModel(),
    onPaginationChange: (updater) => {
      onPaginationChange(typeof updater === 'function' ? updater(pagination) : updater);
    },
    onSortingChange: (updater) => {
      onSortingChange?.(typeof updater === 'function' ? updater(sorting) : updater);
    },
  });

  const rows = table.getRowModel().rows;
  const columnCount = columns.length;

  return (
    <div className="space-y-4">
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody aria-busy={isLoading}>
            {isLoading && rows.length === 0 ? (
              Array.from({ length: pagination.pageSize }, (_, index) => (
                <TableRow key={index}>
                  <TableCell colSpan={columnCount}>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : rows.length > 0 ? (
              rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columnCount} className="p-0">
                  {emptyState ?? (
                    <p className="p-6 text-center text-sm text-muted-foreground">{t('empty')}</p>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
