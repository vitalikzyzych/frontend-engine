import type { MembersListParams } from './members.api';

/** All query keys of the feature come from here, so invalidation stays predictable. */
export const memberKeys = {
  all: ['members'] as const,
  lists: () => [...memberKeys.all, 'list'] as const,
  list: (params: MembersListParams) => [...memberKeys.lists(), params] as const,
};
