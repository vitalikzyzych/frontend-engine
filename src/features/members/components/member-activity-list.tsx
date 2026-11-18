'use client';

import { HistoryIcon } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';

import { EmptyState } from '@/shared/components/empty-state';
import { ErrorState } from '@/shared/components/error-state';
import { Skeleton } from '@/shared/ui/skeleton';

import { useMemberActivity } from '../api/members.queries';

/** Loads only when the Activity tab is open, because inactive tab content is not mounted. */
export function MemberActivityList({ memberId }: { memberId: string }) {
  const t = useTranslations('members');
  const format = useFormatter();
  const activityQuery = useMemberActivity(memberId);

  if (activityQuery.isPending) {
    return (
      <div className="space-y-3" aria-busy>
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }
  if (activityQuery.isError) {
    return <ErrorState error={activityQuery.error} onRetry={() => void activityQuery.refetch()} />;
  }
  if (activityQuery.data.length === 0) {
    return <EmptyState icon={HistoryIcon} title={t('detail.activityEmpty')} />;
  }

  return (
    <ul aria-label={t('detail.tabs.activity')} className="divide-y rounded-lg border">
      {activityQuery.data.map((event) => (
        <li key={event.id} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
          <span className="font-medium">{t(`activity.${event.type}`)}</span>
          <time dateTime={event.at} className="text-muted-foreground">
            {format.dateTime(new Date(event.at), 'dateTime')}
          </time>
        </li>
      ))}
    </ul>
  );
}
