export const MEMBER_ROLES = ['owner', 'admin', 'member'] as const;
export type MemberRole = (typeof MEMBER_ROLES)[number];

type MemberStatus = 'active' | 'invited';

export const MEMBER_SORT_FIELDS = ['name', 'email', 'createdAt'] as const;
export type MemberSortField = (typeof MEMBER_SORT_FIELDS)[number];

export interface Member {
  id: string;
  name: string;
  email: string;
  role: MemberRole;
  status: MemberStatus;
  createdAt: string;
}
