import {
  keepPreviousData,
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import type { MemberFormValues } from '../schemas/member-form.schema';
import { membersApi, type MembersListParams } from './members.api';
import { memberKeys } from './members.keys';

function membersListQueryOptions(params: MembersListParams) {
  return queryOptions({
    queryKey: memberKeys.list(params),
    queryFn: ({ signal }) => membersApi.list(params, signal),
    placeholderData: keepPreviousData,
  });
}

export function useMembersList(params: MembersListParams) {
  return useQuery(membersListQueryOptions(params));
}

export function useMember(id: string) {
  return useQuery({
    queryKey: memberKeys.detail(id),
    queryFn: ({ signal }) => membersApi.get(id, signal),
  });
}

export function useMemberActivity(id: string) {
  return useQuery({
    queryKey: memberKeys.activity(id),
    queryFn: ({ signal }) => membersApi.activity(id, signal),
  });
}

/**
 * Refreshes every list, and the member's detail and activity when an id is given.
 * Every mutation calls this, so lists and pages never show stale data.
 */
function useInvalidateMembers() {
  const queryClient = useQueryClient();
  return (id?: string) =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: memberKeys.lists() }),
      id ? queryClient.invalidateQueries({ queryKey: memberKeys.detail(id) }) : undefined,
    ]);
}

export function useCreateMember() {
  const invalidate = useInvalidateMembers();
  return useMutation({
    mutationFn: (input: MemberFormValues) => membersApi.create(input),
    onSuccess: () => invalidate(),
  });
}

export function useUpdateMember() {
  const invalidate = useInvalidateMembers();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: MemberFormValues }) =>
      membersApi.update(id, input),
    onSuccess: (member) => invalidate(member.id),
  });
}

/** A status change is an action endpoint, not an edit: `POST /members/:id/deactivate`. */
export function useDeactivateMember() {
  const invalidate = useInvalidateMembers();
  return useMutation({
    mutationFn: (id: string) => membersApi.deactivate(id),
    onSuccess: (member) => invalidate(member.id),
  });
}

export function useReactivateMember() {
  const invalidate = useInvalidateMembers();
  return useMutation({
    mutationFn: (id: string) => membersApi.reactivate(id),
    onSuccess: (member) => invalidate(member.id),
  });
}

export function useDeleteMember() {
  const invalidate = useInvalidateMembers();
  return useMutation({
    mutationFn: (id: string) => membersApi.remove(id),
    onSuccess: () => invalidate(),
  });
}
