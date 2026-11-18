import type { Member, MemberActivity, MemberRole, MemberStatus } from '../types/member';

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
const HOUR_MS = 60 * 60 * 1000;

function seedStatus(index: number): MemberStatus {
  if (index % 7 === 3) return 'invited';
  if (index % 11 === 5) return 'deactivated';
  return 'active';
}

function seedMembers(): Member[] {
  return Array.from({ length: 42 }, (_, index) => {
    const first = FIRST_NAMES[index % FIRST_NAMES.length] ?? 'Sam';
    const last = LAST_NAMES[index % LAST_NAMES.length] ?? 'Doe';
    return {
      id: `mem_${String(index + 1).padStart(3, '0')}`,
      name: `${first} ${last}`,
      email: `${first}.${last}${index + 1}@example.com`.toLowerCase(),
      role: index === 0 ? 'owner' : (ROLES[index % ROLES.length] ?? 'member'),
      status: seedStatus(index),
      createdAt: new Date(Date.UTC(2026, 0, 1 + index, 9, 30)).toISOString(),
    };
  });
}

function offset(iso: string, hours: number) {
  return new Date(new Date(iso).getTime() + hours * HOUR_MS).toISOString();
}

/** Activity per member, oldest first. The handler returns it newest first. */
function seedActivity(members: Member[]): Record<string, MemberActivity[]> {
  return Object.fromEntries(
    members.map((member) => {
      const events: MemberActivity[] = [
        { id: `${member.id}_1`, type: 'invited', at: member.createdAt },
      ];
      if (member.status !== 'invited') {
        events.push({ id: `${member.id}_2`, type: 'joined', at: offset(member.createdAt, 2) });
      }
      if (member.status === 'deactivated') {
        events.push({
          id: `${member.id}_3`,
          type: 'deactivated',
          at: offset(member.createdAt, 72),
        });
      }
      return [member.id, events];
    }),
  );
}

function seed() {
  const members = seedMembers();
  return { members, activity: seedActivity(members) };
}

/** In-memory store shared by the browser mocks and tests. */
export const membersDb = {
  ...seed(),
  addActivity(memberId: string, type: MemberActivity['type']) {
    const events = (this.activity[memberId] ??= []);
    events.push({ id: `${memberId}_${events.length + 1}`, type, at: new Date().toISOString() });
  },
  reset() {
    Object.assign(this, seed());
  },
};
