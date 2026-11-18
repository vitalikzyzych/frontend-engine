import { UserXIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';
import { EmptyState } from '@/shared/components/empty-state';
import { Button } from '@/shared/ui/button';

/**
 * Shown inside the app shell when a member does not exist (404). The page keeps the sidebar and
 * offers a way back, which the global not-found page cannot.
 */
export function MemberNotFound() {
  const t = useTranslations('members.detail');

  return (
    <EmptyState
      icon={UserXIcon}
      title={t('notFoundTitle')}
      description={t('notFoundDescription')}
      action={
        <Button variant="outline" asChild>
          <Link href="/members">{t('backToList')}</Link>
        </Button>
      }
    />
  );
}
