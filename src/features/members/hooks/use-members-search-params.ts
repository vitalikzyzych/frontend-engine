import { parseAsInteger, parseAsString, parseAsStringLiteral, useQueryStates } from 'nuqs';

import { MEMBER_ROLES, MEMBER_SORT_FIELDS } from '../types/member';

const membersSearchParams = {
  page: parseAsInteger.withDefault(1),
  pageSize: parseAsInteger.withDefault(10),
  search: parseAsString.withDefault(''),
  role: parseAsStringLiteral(MEMBER_ROLES),
  sort: parseAsStringLiteral(MEMBER_SORT_FIELDS).withDefault('createdAt'),
  order: parseAsStringLiteral(['asc', 'desc'] as const).withDefault('desc'),
};

/** Table state lives in the URL, so every view can be shared and survives a reload. */
export function useMembersSearchParams() {
  return useQueryStates(membersSearchParams, { history: 'replace' });
}
