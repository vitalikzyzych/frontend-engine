import { LayoutDashboardIcon, UsersIcon, type LucideIcon } from 'lucide-react';
import type { Messages } from 'next-intl';

export interface NavItem {
  href: '/dashboard' | '/members';
  labelKey: keyof Messages['nav'];
  icon: LucideIcon;
}

/** Sidebar navigation. Add an entry here when a feature gets its own page. */
export const mainNavigation: NavItem[] = [
  { href: '/dashboard', labelKey: 'dashboard', icon: LayoutDashboardIcon },
  { href: '/members', labelKey: 'members', icon: UsersIcon },
];
