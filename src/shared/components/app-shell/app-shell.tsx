import { type PropsWithChildren } from 'react';

import { SidebarInset, SidebarProvider } from '@/shared/ui/sidebar';

import { AppHeader } from './app-header';
import { AppSidebar } from './app-sidebar';

interface AppShellProps extends PropsWithChildren {
  isSidebarOpen?: boolean;
}

export function AppShell({ children, isSidebarOpen = true }: AppShellProps) {
  return (
    <SidebarProvider defaultOpen={isSidebarOpen}>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
