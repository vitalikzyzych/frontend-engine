import { membersDb } from '@/features/members/mocks/members.data';
import { membersHandlers } from '@/features/members/mocks/members.handlers';

/** Every feature's MSW handlers. A new feature adds its handlers here. */
export const handlers = [...membersHandlers];

/**
 * In-memory mock stores. A feature whose handlers keep data adds its store here,
 * so tests start from the seed data every time (`tests/setup.ts` resets after each test).
 */
const mockStores: { reset: () => void }[] = [membersDb];

export function resetMockData() {
  for (const store of mockStores) store.reset();
}
