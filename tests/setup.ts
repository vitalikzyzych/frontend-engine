import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';

import { membersDb } from '@/features/members/mocks/members.data';
import { server } from '@/mocks/server';

beforeAll(() => {
  server.listen({ onUnhandledFrame: 'error' });
});

afterEach(() => {
  cleanup();
  server.resetHandlers();
  membersDb.reset();
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
