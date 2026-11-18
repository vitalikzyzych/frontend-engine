import type { MembersListParams } from './members.api';

/**
 * All query keys of the feature come from here, so invalidation stays predictable.
 * Activity sits under the member's detail key, so invalidating a detail also refreshes its activity.
 */
export const memberKeys = {
  all: ['members'] as const,
  lists: () => [...memberKeys.all, 'list'] as const,
  list: (params: MembersListParams) => [...memberKeys.lists(), params] as const,
  details: () => [...memberKeys.all, 'detail'] as const,
  detail: (id: string) => [...memberKeys.details(), id] as const,
  activity: (id: string) => [...memberKeys.detail(id), 'activity'] as const,
};
