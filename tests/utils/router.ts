/**
 * Router used by component tests in place of `useRouter` from `@/i18n/navigation`
 * (mocked in `tests/setup.ts`). Assert navigation with `expect(routerMock.push).toHaveBeenCalledWith(...)`.
 * Links render as plain anchors with the `href` the component passed, without the locale.
 */
export const routerMock = {
  push: vi.fn(),
  replace: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
  prefetch: vi.fn(),
};
