import { type Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { MemberEditView } from '@/features/members';
import { resolveLocale } from '@/i18n/locale';

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/members/[id]/edit'>): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: 'members.editPage' });
  return { title: t('title') };
}

export default async function MemberEditPage({ params }: PageProps<'/[locale]/members/[id]/edit'>) {
  const { id } = await params;
  return <MemberEditView id={id} />;
}
