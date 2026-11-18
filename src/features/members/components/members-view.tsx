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
import { MEMBER_SORT_FIELDS, type Member } from '../types/member';
import { MemberInviteDialog } from './member-invite-dialog';
import { useMembersColumns } from './members-columns';
import { MembersToolbar, type MembersFilters } from './members-toolbar';

export function MembersView() {
  const t = useTranslations('members');
  const [params, setParams] = useMembersSearchParams();
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);

  const membersQuery = useMembersList(params);
  const deleteMember = useDeleteMember();

  const columns = useMembersColumns({ onDelete: setMemberToDelete });

  // Any filter change starts again from the first page. Empty values are removed from the URL.
  const onFiltersChange = useCallback(
    (changes: Partial<MembersFilters>) =>
      void setParams({
        ...changes,
        ...(changes.search === '' ? { search: null } : {}),
        ...('status' in changes && changes.status?.length === 0 ? { status: null } : {}),
        page: 1,
      }),
    [setParams],
  );

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

  const hasFilters =
    params.search !== '' ||
    params.role !== null ||
    params.status.length > 0 ||
    params.joinedFrom !== null ||
    params.joinedTo !== null;

  return (
    <>
      <PageHeader
        title={t('title')}
        description={t('description')}
        actions={
          <Button
            onClick={() => {
              setIsInviteOpen(true);
            }}
          >
            <PlusIcon /> {t('invite')}
          </Button>
        }
      />

      <MembersToolbar filters={params} onFiltersChange={onFiltersChange} />

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
            const sort = MEMBER_SORT_FIELDS.find((field) => field === first?.id);
            if (first && sort) {
              void setParams({ sort, order: first.desc ? 'desc' : 'asc', page: 1 });
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

      <MemberInviteDialog open={isInviteOpen} onOpenChange={setIsInviteOpen} />

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
