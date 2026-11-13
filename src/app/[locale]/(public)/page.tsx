import { ArrowRightIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';
import { Button } from '@/shared/ui/button';

export default function HomePage() {
  const t = useTranslations('home');

  return (
    <main className="mx-auto flex min-h-svh max-w-2xl flex-col items-center justify-center gap-6 p-6 text-center">
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{t('title')}</h1>
      <p className="text-lg text-muted-foreground">{t('description')}</p>
      <Button size="lg" asChild>
        <Link href="/dashboard">
          {t('cta')} <ArrowRightIcon />
        </Link>
      </Button>
    </main>
  );
}
