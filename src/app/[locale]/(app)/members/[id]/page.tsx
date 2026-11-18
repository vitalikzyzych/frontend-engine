import { Suspense } from 'react';
import { type Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { MemberDetailView } from '@/features/members';
import { resolveLocale } from '@/i18n/locale';

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/members/[id]'>): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: 'members.detail' });
  return { title: t('title') };
}

export default async function MemberPage({ params }: PageProps<'/[locale]/members/[id]'>) {
  const { id } = await params;
  return (
    <Suspense>
      <MemberDetailView id={id} />
    </Suspense>
  );
}
