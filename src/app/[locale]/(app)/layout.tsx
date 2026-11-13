import { cookies } from 'next/headers';

import { AppShell } from '@/shared/components/app-shell/app-shell';

const SIDEBAR_COOKIE = 'sidebar_state';

export default async function AppLayout({ children }: LayoutProps<'/[locale]'>) {
  const cookieStore = await cookies();
  const isSidebarOpen = cookieStore.get(SIDEBAR_COOKIE)?.value !== 'false';

  return <AppShell isSidebarOpen={isSidebarOpen}>{children}</AppShell>;
}
