import type { Member, MemberRole } from '../types/member';

const FIRST_NAMES = [
  'Ada',
  'Grace',
  'Alan',
  'Linus',
  'Margaret',
  'Dennis',
  'Barbara',
  'Ken',
  'Frances',
  'Tim',
];
const LAST_NAMES = [
  'Lovelace',
  'Hopper',
  'Turing',
  'Torvalds',
  'Hamilton',
  'Ritchie',
  'Liskov',
  'Thompson',
];
const ROLES: MemberRole[] = ['member', 'member', 'admin', 'member'];

function seedMembers(): Member[] {
  return Array.from({ length: 42 }, (_, index) => {
    const first = FIRST_NAMES[index % FIRST_NAMES.length] ?? 'Sam';
    const last = LAST_NAMES[index % LAST_NAMES.length] ?? 'Doe';
    return {
      id: `mem_${String(index + 1).padStart(3, '0')}`,
      name: `${first} ${last}`,
      email: `${first}.${last}${index + 1}@example.com`.toLowerCase(),
      role: index === 0 ? 'owner' : (ROLES[index % ROLES.length] ?? 'member'),
      status: index % 7 === 3 ? 'invited' : 'active',
      createdAt: new Date(Date.UTC(2026, 0, 1 + index, 9, 30)).toISOString(),
    };
  });
}

/** In-memory store shared by the browser mocks and tests. */
export const membersDb = {
  members: seedMembers(),
  reset() {
    this.members = seedMembers();
  },
};
