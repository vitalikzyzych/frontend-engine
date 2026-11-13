import { useTranslations } from 'next-intl';

import { Badge } from '@/shared/ui/badge';

import type { MemberRole } from '../types/member';

const VARIANTS = {
  owner: 'default',
  admin: 'secondary',
  member: 'outline',
} as const satisfies Record<MemberRole, 'default' | 'secondary' | 'outline'>;

export function MemberRoleBadge({ role }: { role: MemberRole }) {
  const t = useTranslations('members.roles');
  return <Badge variant={VARIANTS[role]}>{t(role)}</Badge>;
}
