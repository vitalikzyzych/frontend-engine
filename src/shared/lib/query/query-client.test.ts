import { AppError } from '@/shared/lib/http/app-error';

import { getQueryClient } from './query-client';

function httpError(status: number) {
  return new AppError({ kind: 'http', status, message: 'Failed' });
}

describe('getQueryClient', () => {
  it('returns one shared client in the browser', () => {
    expect(getQueryClient()).toBe(getQueryClient());
  });

  it('retries server and network errors twice and never retries 4xx', () => {
    const retry = getQueryClient().getDefaultOptions().queries?.retry;
    if (typeof retry !== 'function') throw new Error('retry should be a function');

    expect(retry(0, httpError(500))).toBe(true);
    expect(retry(1, new AppError({ kind: 'network', status: 0, message: 'Offline' }))).toBe(true);
    expect(retry(2, httpError(500))).toBe(false);
    expect(retry(0, httpError(404))).toBe(false);
    expect(retry(0, httpError(401))).toBe(false);
  });

  it('does not retry mutations', () => {
    expect(getQueryClient().getDefaultOptions().mutations?.retry).toBe(false);
  });
});
