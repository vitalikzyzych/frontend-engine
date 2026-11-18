import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';

import { resetMockData } from '@/mocks/handlers';
import { server } from '@/mocks/server';

// Component tests run without the Next.js router: links become anchors, navigation becomes spies.
vi.mock('@/i18n/navigation', async () => {
  const { createElement } = await import('react');
  const { routerMock } = await import('./utils/router');
  return {
    Link: ({ href, ...props }: { href: string } & Record<string, unknown>) =>
      createElement('a', { href, ...props }),
    useRouter: () => routerMock,
    usePathname: () => '/',
    redirect: vi.fn(),
    getPathname: ({ href }: { href: string }) => href,
  };
});

beforeAll(() => {
  server.listen({ onUnhandledFrame: 'error' });
});

afterEach(() => {
  cleanup();
  server.resetHandlers();
  resetMockData();
  vi.clearAllMocks();
});

afterAll(() => {
  server.close();
});

// Radix UI relies on browser APIs that jsdom does not implement.
Object.assign(window.HTMLElement.prototype, {
  scrollIntoView: () => undefined,
  hasPointerCapture: () => false,
  releasePointerCapture: () => undefined,
});
window.matchMedia ??= (query: string) =>
  ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    addListener: () => undefined,
    removeListener: () => undefined,
    dispatchEvent: () => false,
  }) as MediaQueryList;
globalThis.ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
