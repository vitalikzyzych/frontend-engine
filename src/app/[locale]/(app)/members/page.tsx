import { Suspense } from 'react';
import { type Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { MembersView } from '@/features/members';
import { resolveLocale } from '@/i18n/locale';

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/members'>): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: 'members' });
  return { title: t('title') };
}

export default function MembersPage() {
  return (
    <Suspense>
      <MembersView />
    </Suspense>
  );
}
