'use client';

import { useCallback, useState } from 'react';
import { PlusIcon, UsersIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { ConfirmDialog } from '@/shared/components/confirm-dialog';
import { DataTable } from '@/shared/components/data-table/data-table';
import { EmptyState } from '@/shared/components/empty-state';
import { ErrorState } from '@/shared/components/error-state';
import { PageHeader } from '@/shared/components/page-header';
import { Button } from '@/shared/ui/button';

import { useDeleteMember, useMembersList } from '../api/members.queries';
import { useMembersSearchParams } from '../hooks/use-members-search-params';
import type { Member, MemberRole } from '../types/member';
import { MemberFormDialog } from './member-form-dialog';
import { useMembersColumns } from './members-columns';
import { MembersToolbar } from './members-toolbar';

export function MembersView() {
  const t = useTranslations('members');
  const [params, setParams] = useMembersSearchParams();
  const [formState, setFormState] = useState<{ open: boolean; member: Member | null }>({
    open: false,
    member: null,
  });
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);

  const membersQuery = useMembersList(params);
  const deleteMember = useDeleteMember();

  const columns = useMembersColumns({
    onEdit: (member) => {
      setFormState({ open: true, member });
    },
    onDelete: setMemberToDelete,
  });

  const onSearchChange = useCallback(
    (search: string) => void setParams({ search: search || null, page: 1 }),
    [setParams],
  );

  function onRoleChange(role: MemberRole | null) {
    void setParams({ role, page: 1 });
  }

  async function confirmDelete() {
    if (!memberToDelete) return;
    try {
      await deleteMember.mutateAsync(memberToDelete.id);
      toast.success(t('deleted', { name: memberToDelete.name }));
      setMemberToDelete(null);
    } catch {
      toast.error(t('deleteFailed'));
    }
  }

  const hasFilters = Boolean(params.search || params.role);

  return (
    <>
      <PageHeader
        title={t('title')}
        description={t('description')}
        actions={
          <Button onClick={() => setFormState({ open: true, member: null })}>
            <PlusIcon /> {t('invite')}
          </Button>
        }
      />

      <MembersToolbar
        search={params.search}
        role={params.role}
        onSearchChange={onSearchChange}
        onRoleChange={onRoleChange}
      />

      {membersQuery.isError ? (
        <ErrorState error={membersQuery.error} onRetry={() => void membersQuery.refetch()} />
      ) : (
        <DataTable
          columns={columns}
          data={membersQuery.data?.items ?? []}
          rowCount={membersQuery.data?.total ?? 0}
          isLoading={membersQuery.isPending}
          getRowId={(member) => member.id}
          pagination={{ pageIndex: params.page - 1, pageSize: params.pageSize }}
          onPaginationChange={({ pageIndex, pageSize }) =>
            void setParams({ page: pageIndex + 1, pageSize })
          }
          sorting={[{ id: params.sort, desc: params.order === 'desc' }]}
          onSortingChange={(sorting) => {
            const [first] = sorting;
            if (
              first &&
              (first.id === 'name' || first.id === 'email' || first.id === 'createdAt')
            ) {
              void setParams({ sort: first.id, order: first.desc ? 'desc' : 'asc', page: 1 });
            }
          }}
          emptyState={
            <EmptyState
              icon={UsersIcon}
              title={t(hasFilters ? 'emptyFilteredTitle' : 'emptyTitle')}
              description={t(hasFilters ? 'emptyFilteredDescription' : 'emptyDescription')}
            />
          }
        />
      )}

      <MemberFormDialog
        open={formState.open}
        member={formState.member}
        onOpenChange={(open) => {
          setFormState((state) => ({ ...state, open }));
        }}
      />

      <ConfirmDialog
        open={memberToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setMemberToDelete(null);
        }}
        title={t('deleteTitle')}
        description={t('deleteDescription', { name: memberToDelete?.name ?? '' })}
        confirmLabel={t('delete')}
        onConfirm={() => void confirmDelete()}
        isPending={deleteMember.isPending}
        isDestructive
      />
    </>
  );
}
