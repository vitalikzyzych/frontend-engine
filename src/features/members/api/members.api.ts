import { http } from '@/shared/lib/http/http-client';
import type { Paginated, SortOrder } from '@/shared/types/pagination';

import type { MemberFormValues } from '../schemas/member-form.schema';
import type { Member, MemberRole, MemberSortField } from '../types/member';

export interface MembersListParams {
  page: number;
  pageSize: number;
  search?: string;
  role?: MemberRole | null;
  sort: MemberSortField;
  order: SortOrder;
}

export const membersApi = {
  list: (params: MembersListParams, signal?: AbortSignal) =>
    http.get<Paginated<Member>>('members', { query: { ...params }, signal }),
  create: (input: MemberFormValues) => http.post<Member>('members', input),
  update: (id: string, input: MemberFormValues) => http.patch<Member>(`members/${id}`, input),
  remove: (id: string) => http.delete(`members/${id}`),
};
