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

function useInvalidateMemberLists() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: memberKeys.lists() });
}

export function useCreateMember() {
  const invalidate = useInvalidateMemberLists();
  return useMutation({
    mutationFn: (input: MemberFormValues) => membersApi.create(input),
    onSuccess: invalidate,
  });
}

export function useUpdateMember() {
  const invalidate = useInvalidateMemberLists();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: MemberFormValues }) =>
      membersApi.update(id, input),
    onSuccess: invalidate,
  });
}

export function useDeleteMember() {
  const invalidate = useInvalidateMemberLists();
  return useMutation({
    mutationFn: (id: string) => membersApi.remove(id),
    onSuccess: invalidate,
  });
}
