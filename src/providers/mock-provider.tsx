'use client';

import { type PropsWithChildren } from 'react';
import dynamic from 'next/dynamic';

import { env } from '@/env';

const MockGate = dynamic(() => import('./mock-gate'), { ssr: false });

/** Runs the app on MSW mocks when NEXT_PUBLIC_API_MOCKING=enabled. */
export function MockProvider({ children }: PropsWithChildren) {
  if (env.NEXT_PUBLIC_API_MOCKING !== 'enabled') return children;
  return <MockGate>{children}</MockGate>;
}
