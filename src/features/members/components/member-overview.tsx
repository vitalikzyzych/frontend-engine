import { type ReactNode } from 'react';
import { useFormatter, useTranslations } from 'next-intl';

import type { Member } from '../types/member';
import { MemberRoleBadge } from './member-role-badge';
import { MemberStatusBadge } from './member-status-badge';

export function MemberOverview({ member }: { member: Member }) {
  const t = useTranslations('members.detail.fields');
  const format = useFormatter();

  const rows: [string, ReactNode][] = [
    [t('email'), member.email],
    [t('role'), <MemberRoleBadge key="role" role={member.role} />],
    [t('status'), <MemberStatusBadge key="status" status={member.status} />],
    [t('joined'), format.dateTime(new Date(member.createdAt), 'date')],
  ];

  return (
    <dl className="grid gap-x-6 gap-y-4 rounded-lg border p-6 sm:grid-cols-[10rem_1fr]">
      {rows.map(([label, value]) => (
        <div key={label} className="contents">
          <dt className="text-sm text-muted-foreground">{label}</dt>
          <dd className="text-sm">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
