import { createNavigation } from 'next-intl/navigation';

import { routing } from './routing';

/** @public Locale-aware replacements for next/link and next/navigation. */
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
