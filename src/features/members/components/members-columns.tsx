'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { EyeIcon, MoreHorizontalIcon, PencilIcon, Trash2Icon } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';
import { DataTableColumnHeader } from '@/shared/components/data-table/data-table-column-header';
import { Button } from '@/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';

import type { Member } from '../types/member';
import { MemberRoleBadge } from './member-role-badge';
import { MemberStatusBadge } from './member-status-badge';

interface MembersColumnsOptions {
  onDelete: (member: Member) => void;
}

export function useMembersColumns({ onDelete }: MembersColumnsOptions) {
  const t = useTranslations('members');
  const format = useFormatter();

  const columns: ColumnDef<Member>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('columns.name')} />,
      cell: ({ row }) => (
        <Link
          href={`/members/${row.original.id}`}
          className="font-medium underline-offset-4 hover:underline"
        >
          {row.original.name}
        </Link>
      ),
    },
    {
      accessorKey: 'email',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('columns.email')} />,
    },
    {
      accessorKey: 'role',
      enableSorting: false,
      header: t('columns.role'),
      cell: ({ row }) => <MemberRoleBadge role={row.original.role} />,
    },
    {
      accessorKey: 'status',
      enableSorting: false,
      header: t('columns.status'),
      cell: ({ row }) => <MemberStatusBadge status={row.original.status} />,
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('columns.createdAt')} />
      ),
      cell: ({ row }) => format.dateTime(new Date(row.original.createdAt), 'date'),
    },
    {
      id: 'actions',
      enableSorting: false,
      header: () => <span className="sr-only">{t('columns.actions')}</span>,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={t('actionsFor', { name: row.original.name })}
            >
              <MoreHorizontalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/members/${row.original.id}`}>
                <EyeIcon /> {t('open')}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/members/${row.original.id}/edit`}>
                <PencilIcon /> {t('edit')}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              disabled={row.original.role === 'owner'}
              onClick={() => onDelete(row.original)}
            >
              <Trash2Icon /> {t('delete')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return columns;
}
