'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { MoreHorizontalIcon, PencilIcon, Trash2Icon } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';

import { DataTableColumnHeader } from '@/shared/components/data-table/data-table-column-header';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';

import type { Member } from '../types/member';
import { MemberRoleBadge } from './member-role-badge';

interface MembersColumnsOptions {
  onEdit: (member: Member) => void;
  onDelete: (member: Member) => void;
}

export function useMembersColumns({ onEdit, onDelete }: MembersColumnsOptions) {
  const t = useTranslations('members');
  const format = useFormatter();

  const columns: ColumnDef<Member>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('columns.name')} />,
      cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
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
      cell: ({ row }) => (
        <Badge variant={row.original.status === 'active' ? 'secondary' : 'outline'}>
          {t(`statuses.${row.original.status}`)}
        </Badge>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('columns.createdAt')} />
      ),
      cell: ({ row }) => format.dateTime(new Date(row.original.createdAt), { dateStyle: 'medium' }),
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
            <DropdownMenuItem onClick={() => onEdit(row.original)}>
              <PencilIcon /> {t('edit')}
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
