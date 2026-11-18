'use client';

import { PencilIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';
import { ErrorState } from '@/shared/components/error-state';
import { PageBreadcrumbs } from '@/shared/components/page-breadcrumbs';
import { PageHeader } from '@/shared/components/page-header';
import { isAppError } from '@/shared/lib/http/app-error';
import { Button } from '@/shared/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';

import { useMember } from '../api/members.queries';
import { MEMBER_TABS, useMemberTab } from '../hooks/use-member-tab';
import { MemberActivityList } from './member-activity-list';
import { MemberNotFound } from './member-not-found';
import { MemberOverview } from './member-overview';
import { MemberPageSkeleton } from './member-page-skeleton';
import { MemberStatusActions } from './member-status-actions';

export function MemberDetailView({ id }: { id: string }) {
  const t = useTranslations('members');
  const memberQuery = useMember(id);
  const [tab, setTab] = useMemberTab();

  if (memberQuery.isPending) return <MemberPageSkeleton />;
  if (isAppError(memberQuery.error) && memberQuery.error.isNotFound) return <MemberNotFound />;
  if (memberQuery.isError) {
    return <ErrorState error={memberQuery.error} onRetry={() => void memberQuery.refetch()} />;
  }

  const member = memberQuery.data;

  return (
    <>
      <PageBreadcrumbs items={[{ label: t('title'), href: '/members' }, { label: member.name }]} />
      <PageHeader
        title={member.name}
        description={member.email}
        actions={
          <>
            <Button variant="outline" asChild>
              <Link href={`/members/${member.id}/edit`}>
                <PencilIcon /> {t('edit')}
              </Link>
            </Button>
            <MemberStatusActions member={member} />
          </>
        }
      />
      <Tabs
        value={tab}
        onValueChange={(value) => {
          const next = MEMBER_TABS.find((item) => item === value);
          if (next) void setTab(next);
        }}
      >
        <TabsList>
          {MEMBER_TABS.map((item) => (
            <TabsTrigger key={item} value={item}>
              {t(`detail.tabs.${item}`)}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="overview" className="pt-4">
          <MemberOverview member={member} />
        </TabsContent>
        <TabsContent value="activity" className="pt-4">
          <MemberActivityList memberId={member.id} />
        </TabsContent>
      </Tabs>
    </>
  );
}
