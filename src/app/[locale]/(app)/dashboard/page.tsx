import { type Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { resolveLocale } from '@/i18n/locale';
import { Link } from '@/i18n/navigation';
import { PageHeader } from '@/shared/components/page-header';
import { Card, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/dashboard'>): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: 'dashboard' });
  return { title: t('title') };
}

export default async function DashboardPage() {
  const t = await getTranslations('dashboard');

  return (
    <>
      <PageHeader title={t('title')} description={t('description')} />
      <div className="grid gap-4 md:grid-cols-2">
        <Link href="/members" className="rounded-xl focus-visible:outline-2">
          <Card className="h-full transition-colors hover:bg-accent/50">
            <CardHeader>
              <CardTitle>{t('membersCardTitle')}</CardTitle>
              <CardDescription>{t('membersCardDescription')}</CardDescription>
            </CardHeader>
          </Card>
        </Link>
        <Card>
          <CardHeader>
            <CardTitle>{t('nextStepsTitle')}</CardTitle>
            <CardDescription>{t('nextStepsDescription')}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </>
  );
}
