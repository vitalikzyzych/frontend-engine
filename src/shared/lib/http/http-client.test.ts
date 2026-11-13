import { HttpResponse, http as mswHttp } from 'msw';
import { z } from 'zod';

import { server } from '@/mocks/server';

import { AppError } from './app-error';
import { apiUrl, http } from './http-client';

describe('apiUrl', () => {
  it('joins the base URL and path and skips empty query values', () => {
    const url = apiUrl('/items', { page: 2, search: '', role: null, isActive: true });
    expect(url).toBe('http://localhost:3000/api/items?page=2&isActive=true');
  });
});

describe('http', () => {
  it('returns parsed JSON for successful requests', async () => {
    server.use(mswHttp.get(apiUrl('items'), () => HttpResponse.json([{ id: 1 }])));
    await expect(http.get('items')).resolves.toEqual([{ id: 1 }]);
  });

  it('sends JSON bodies', async () => {
    server.use(
      mswHttp.post(apiUrl('items'), async ({ request }) => HttpResponse.json(await request.json())),
    );
    await expect(http.post('items', { name: 'A' })).resolves.toEqual({ name: 'A' });
  });

  it('returns undefined for 204 responses', async () => {
    server.use(mswHttp.delete(apiUrl('items/1'), () => new HttpResponse(null, { status: 204 })));
    await expect(http.delete('items/1')).resolves.toBeUndefined();
  });

  it('turns error responses into AppError with message, code and field errors', async () => {
    server.use(
      mswHttp.post(apiUrl('items'), () =>
        HttpResponse.json(
          { message: ['name is required'], code: 'INVALID', errors: { name: ['required'] } },
          { status: 422 },
        ),
      ),
    );

    const error = await http.post('items', {}).catch((caught: unknown) => caught);
    expect(error).toBeInstanceOf(AppError);
    expect(error).toMatchObject({
      kind: 'http',
      status: 422,
      message: 'name is required',
      code: 'INVALID',
      fieldErrors: { name: 'required' },
    });
  });

  it('reads RFC 9457 problem details', async () => {
    server.use(
      mswHttp.get(apiUrl('items'), () =>
        HttpResponse.json({ title: 'Forbidden', detail: 'No access' }, { status: 403 }),
      ),
    );
    const error = await http.get('items').catch((caught: unknown) => caught);
    expect(error).toMatchObject({ message: 'No access', isForbidden: true });
  });

  it('reports network failures as AppError with kind network', async () => {
    server.use(mswHttp.get(apiUrl('items'), () => HttpResponse.error()));
    await expect(http.get('items')).rejects.toMatchObject({ kind: 'network', status: 0 });
  });

  it('validates responses when a schema is given', async () => {
    server.use(mswHttp.get(apiUrl('items'), () => HttpResponse.json({ id: 'not-a-number' })));
    const schema = z.object({ id: z.number() });

    await expect(http.get('items', { schema })).rejects.toMatchObject({ kind: 'parse' });
  });
});
