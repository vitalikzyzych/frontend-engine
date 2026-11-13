import { delay, http, HttpResponse } from 'msw';

import { apiUrl } from '@/shared/lib/http/http-client';

import { memberFormSchema } from '../schemas/member-form.schema';
import { MEMBER_SORT_FIELDS, type Member, type MemberSortField } from '../types/member';
import { membersDb } from './members.data';

const MOCK_DELAY_MS = process.env.NODE_ENV === 'test' ? 0 : 300;

function isSortField(value: string | null): value is MemberSortField {
  return MEMBER_SORT_FIELDS.some((field) => field === value);
}

export const membersHandlers = [
  http.get(apiUrl('members'), async ({ request }) => {
    await delay(MOCK_DELAY_MS);
    const params = new URL(request.url).searchParams;
    const page = Number(params.get('page') ?? 1);
    const pageSize = Number(params.get('pageSize') ?? 10);
    const search = (params.get('search') ?? '').toLowerCase();
    const role = params.get('role');
    const sortParam = params.get('sort');
    const sort: MemberSortField = isSortField(sortParam) ? sortParam : 'createdAt';
    const direction = params.get('order') === 'asc' ? 1 : -1;

    const filtered = membersDb.members
      .filter(
        (member) => !search || `${member.name} ${member.email}`.toLowerCase().includes(search),
      )
      .filter((member) => !role || member.role === role)
      .sort((a, b) => a[sort].localeCompare(b[sort]) * direction);

    return HttpResponse.json({
      items: filtered.slice((page - 1) * pageSize, page * pageSize),
      total: filtered.length,
      page,
      pageSize,
    });
  }),

  http.post(apiUrl('members'), async ({ request }) => {
    await delay(MOCK_DELAY_MS);
    const input = memberFormSchema.parse(await request.json());
    if (membersDb.members.some((member) => member.email === input.email)) {
      return HttpResponse.json(
        {
          message: 'Email already exists',
          code: 'MEMBER_EXISTS',
          fieldErrors: { email: 'emailTaken' },
        },
        { status: 409 },
      );
    }
    const member: Member = {
      id: `mem_${crypto.randomUUID().slice(0, 8)}`,
      ...input,
      status: 'invited',
      createdAt: new Date().toISOString(),
    };
    membersDb.members.unshift(member);
    return HttpResponse.json(member, { status: 201 });
  }),

  http.patch(apiUrl('members/:id'), async ({ params, request }) => {
    await delay(MOCK_DELAY_MS);
    const member = membersDb.members.find((item) => item.id === params.id);
    if (!member) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    Object.assign(member, memberFormSchema.parse(await request.json()));
    return HttpResponse.json(member);
  }),

  http.delete(apiUrl('members/:id'), async ({ params }) => {
    await delay(MOCK_DELAY_MS);
    membersDb.members = membersDb.members.filter((member) => member.id !== params.id);
    return new HttpResponse(null, { status: 204 });
  }),
];
