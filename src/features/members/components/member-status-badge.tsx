import { useTranslations } from 'next-intl';

import { Badge } from '@/shared/ui/badge';

import type { MemberStatus } from '../types/member';

const VARIANTS = {
  active: 'secondary',
  invited: 'outline',
  deactivated: 'destructive',
} as const satisfies Record<MemberStatus, 'secondary' | 'outline' | 'destructive'>;

export function MemberStatusBadge({ status }: { status: MemberStatus }) {
  const t = useTranslations('members.statuses');
  return <Badge variant={VARIANTS[status]}>{t(status)}</Badge>;
}
