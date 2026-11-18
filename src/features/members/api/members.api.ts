import { http } from '@/shared/lib/http/http-client';
import type { Paginated, SortOrder } from '@/shared/types/pagination';

import type { MemberFormValues } from '../schemas/member-form.schema';
import type {
  Member,
  MemberActivity,
  MemberRole,
  MemberSortField,
  MemberStatus,
} from '../types/member';

export interface MembersListParams {
  page: number;
  pageSize: number;
  search?: string;
  role?: MemberRole | null;
  status?: MemberStatus[];
  joinedFrom?: Date | null;
  joinedTo?: Date | null;
  sort: MemberSortField;
  order: SortOrder;
}

/** `YYYY-MM-DD`, the date format the API expects. */
function toApiDate(date: Date | null | undefined) {
  return date ? date.toISOString().slice(0, 10) : undefined;
}

/**
 * Request functions. This is the place that translates between the UI's shapes and the API's:
 * here the status list becomes a comma-separated value and dates become `YYYY-MM-DD`.
 */
export const membersApi = {
  list: ({ status, joinedFrom, joinedTo, ...params }: MembersListParams, signal?: AbortSignal) =>
    http.get<Paginated<Member>>('members', {
      query: {
        ...params,
        status: status?.join(','),
        joinedFrom: toApiDate(joinedFrom),
        joinedTo: toApiDate(joinedTo),
      },
      signal,
    }),
  get: (id: string, signal?: AbortSignal) => http.get<Member>(`members/${id}`, { signal }),
  activity: (id: string, signal?: AbortSignal) =>
    http.get<MemberActivity[]>(`members/${id}/activity`, { signal }),
  create: (input: MemberFormValues) => http.post<Member>('members', input),
  update: (id: string, input: MemberFormValues) => http.patch<Member>(`members/${id}`, input),
  deactivate: (id: string) => http.post<Member>(`members/${id}/deactivate`),
  reactivate: (id: string) => http.post<Member>(`members/${id}/reactivate`),
  remove: (id: string) => http.delete(`members/${id}`),
};
