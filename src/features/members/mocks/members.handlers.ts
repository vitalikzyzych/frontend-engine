import { delay, http, HttpResponse } from 'msw';

import { apiUrl } from '@/shared/lib/http/http-client';

import { memberFormSchema } from '../schemas/member-form.schema';
import { MEMBER_SORT_FIELDS, type Member, type MemberSortField } from '../types/member';
import { membersDb } from './members.data';

const MOCK_DELAY_MS = process.env.NODE_ENV === 'test' ? 0 : 300;

function isSortField(value: string | null): value is MemberSortField {
  return MEMBER_SORT_FIELDS.some((field) => field === value);
}

function findMember(id: unknown) {
  return membersDb.members.find((member) => member.id === id);
}

const notFound = () => HttpResponse.json({ message: 'Member not found' }, { status: 404 });

const emailTaken = () =>
  HttpResponse.json(
    {
      message: 'Email already exists',
      code: 'MEMBER_EXISTS',
      fieldErrors: { email: 'emailTaken' },
    },
    { status: 409 },
  );

export const membersHandlers = [
  http.get(apiUrl('members'), async ({ request }) => {
    await delay(MOCK_DELAY_MS);
    const params = new URL(request.url).searchParams;
    const page = Number(params.get('page') ?? 1);
    const pageSize = Number(params.get('pageSize') ?? 10);
    const search = (params.get('search') ?? '').toLowerCase();
    const role = params.get('role');
    const statuses = (params.get('status') ?? '').split(',').filter(Boolean);
    // Dates are YYYY-MM-DD and inclusive: compare on the date part of createdAt.
    const joinedFrom = params.get('joinedFrom');
    const joinedTo = params.get('joinedTo');
    const sortParam = params.get('sort');
    const sort: MemberSortField = isSortField(sortParam) ? sortParam : 'createdAt';
    const direction = params.get('order') === 'asc' ? 1 : -1;

    const filtered = membersDb.members
      .filter(
        (member) => !search || `${member.name} ${member.email}`.toLowerCase().includes(search),
      )
      .filter((member) => !role || member.role === role)
      .filter((member) => statuses.length === 0 || statuses.includes(member.status))
      .filter((member) => !joinedFrom || member.createdAt.slice(0, 10) >= joinedFrom)
      .filter((member) => !joinedTo || member.createdAt.slice(0, 10) <= joinedTo)
      .sort((a, b) => a[sort].localeCompare(b[sort]) * direction);

    return HttpResponse.json({
      items: filtered.slice((page - 1) * pageSize, page * pageSize),
      total: filtered.length,
      page,
      pageSize,
    });
  }),

  http.get(apiUrl('members/:id'), async ({ params }) => {
    await delay(MOCK_DELAY_MS);
    const member = findMember(params.id);
    return member ? HttpResponse.json(member) : notFound();
  }),

  http.get(apiUrl('members/:id/activity'), async ({ params }) => {
    await delay(MOCK_DELAY_MS);
    const member = findMember(params.id);
    if (!member) return notFound();
    return HttpResponse.json([...(membersDb.activity[member.id] ?? [])].reverse());
  }),

  http.post(apiUrl('members'), async ({ request }) => {
    await delay(MOCK_DELAY_MS);
    const input = memberFormSchema.parse(await request.json());
    if (membersDb.members.some((member) => member.email === input.email)) return emailTaken();
    const member: Member = {
      id: `mem_${crypto.randomUUID().slice(0, 8)}`,
      ...input,
      status: 'invited',
      createdAt: new Date().toISOString(),
    };
    membersDb.members.unshift(member);
    membersDb.addActivity(member.id, 'invited');
    return HttpResponse.json(member, { status: 201 });
  }),

  http.patch(apiUrl('members/:id'), async ({ params, request }) => {
    await delay(MOCK_DELAY_MS);
    const member = findMember(params.id);
    if (!member) return notFound();
    const input = memberFormSchema.parse(await request.json());
    if (membersDb.members.some((other) => other.id !== member.id && other.email === input.email)) {
      return emailTaken();
    }
    Object.assign(member, input);
    membersDb.addActivity(member.id, 'updated');
    return HttpResponse.json(member);
  }),

  http.post(apiUrl('members/:id/deactivate'), async ({ params }) => {
    await delay(MOCK_DELAY_MS);
    const member = findMember(params.id);
    if (!member) return notFound();
    if (member.role === 'owner') {
      return HttpResponse.json(
        { message: 'The owner cannot be deactivated', code: 'OWNER_CANNOT_BE_DEACTIVATED' },
        { status: 409 },
      );
    }
    member.status = 'deactivated';
    membersDb.addActivity(member.id, 'deactivated');
    return HttpResponse.json(member);
  }),

  http.post(apiUrl('members/:id/reactivate'), async ({ params }) => {
    await delay(MOCK_DELAY_MS);
    const member = findMember(params.id);
    if (!member) return notFound();
    member.status = 'active';
    membersDb.addActivity(member.id, 'reactivated');
    return HttpResponse.json(member);
  }),

  http.delete(apiUrl('members/:id'), async ({ params }) => {
    await delay(MOCK_DELAY_MS);
    membersDb.members = membersDb.members.filter((member) => member.id !== params.id);
    return new HttpResponse(null, { status: 204 });
  }),
];
