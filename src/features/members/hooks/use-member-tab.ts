import { parseAsStringLiteral, useQueryState } from 'nuqs';

export const MEMBER_TABS = ['overview', 'activity'] as const;

/** Selected tab of the member page, in the URL (`?tab=activity`). The default tab leaves the URL clean. */
export function useMemberTab() {
  return useQueryState(
    'tab',
    parseAsStringLiteral(MEMBER_TABS).withDefault('overview').withOptions({ history: 'replace' }),
  );
}
