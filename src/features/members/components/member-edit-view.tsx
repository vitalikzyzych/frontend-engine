'use client';

import { useTranslations } from 'next-intl';

import { ErrorState } from '@/shared/components/error-state';
import { PageBreadcrumbs } from '@/shared/components/page-breadcrumbs';
import { PageHeader } from '@/shared/components/page-header';
import { isAppError } from '@/shared/lib/http/app-error';

import { useMember } from '../api/members.queries';
import { MemberEditForm } from './member-edit-form';
import { MemberNotFound } from './member-not-found';
import { MemberPageSkeleton } from './member-page-skeleton';

/** Full-page edit form. Loads the member first, so the form starts with its current values. */
export function MemberEditView({ id }: { id: string }) {
  const t = useTranslations('members');
  const memberQuery = useMember(id);

  if (memberQuery.isPending) return <MemberPageSkeleton />;
  if (isAppError(memberQuery.error) && memberQuery.error.isNotFound) return <MemberNotFound />;
  if (memberQuery.isError) {
    return <ErrorState error={memberQuery.error} onRetry={() => void memberQuery.refetch()} />;
  }

  const member = memberQuery.data;

  return (
    <>
      <PageBreadcrumbs
        items={[
          { label: t('title'), href: '/members' },
          { label: member.name, href: `/members/${member.id}` },
          { label: t('edit') },
        ]}
      />
      <PageHeader title={t('editPage.title')} description={t('editPage.description')} />
      <MemberEditForm member={member} />
    </>
  );
}
