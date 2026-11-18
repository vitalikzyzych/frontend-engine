import { membersDb } from '@/features/members/mocks/members.data';
import { resetMockData } from '@/mocks/handlers';

describe('resetMockData', () => {
  it("restores every feature's mock data to its seed", () => {
    const seedCount = membersDb.members.length;
    membersDb.members = [];

    resetMockData();

    expect(membersDb.members).toHaveLength(seedCount);
  });
});
