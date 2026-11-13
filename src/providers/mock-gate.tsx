'use client';

import { useEffect, useState, type PropsWithChildren } from 'react';

import { worker } from '@/mocks/browser';

/** Starts the MSW service worker, then renders the app. Loaded in the browser only. */
export default function MockGate({ children }: PropsWithChildren) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    void worker.start({ onUnhandledFrame: 'bypass', quiet: true }).then(() => {
      setIsReady(true);
    });
  }, []);

  return isReady ? children : null;
}
