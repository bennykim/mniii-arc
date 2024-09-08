import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiService } from "@/shared/api/base";
import { KEY_GROUP, KEY_GROUPS } from "@/shared/config/constants";
import { toServerGroup, toServerGroupExceptId } from "@/shared/lib/utils";

import type { Group } from "@/entities/group/model/types";

type CreateGroupsContext = {
  tempId: string;
  previousGroups: Group[] | undefined;
};

type UpdateGroupContext = {
  previousGroups: Group[] | undefined;
  previousGroup: Group | undefined;
};

type DeleteGroupContext = {
  previousGroups: Group[] | undefined;
};

export const useCreateGroupMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    Group,
    Error,
    Omit<UIGroup, "id">,
    CreateGroupsContext
  >({
    mutationFn: (newGroup) =>
      apiService.createGroup(toServerGroupExceptId({ ...newGroup })),

    onMutate: async (newGroup) => {
      await queryClient.cancelQueries({ queryKey: [KEY_GROUPS] });

      const previousGroups = queryClient.getQueryData<Group[]>([KEY_GROUPS]);

      const tempId = `temp-id`;
      const newTempGroup: Group = {
        ...toServerGroupExceptId({ ...newGroup }),
        id: tempId,
      };
      queryClient.setQueryData<Group[]>([KEY_GROUPS], (oldData) => {
        return oldData ? [...oldData, newTempGroup] : [newTempGroup];
      });

      return { tempId, previousGroups };
    },

    onSuccess: (createdGroup, _, context) => {
      queryClient.setQueryData<Group[]>([KEY_GROUPS], (oldData) => {
        return (
          oldData?.map((group) =>
            group.id === context?.tempId ? createdGroup : group
          ) ?? []
        );
      });
    },

    onError: (err, _, context) => {
      if (context?.previousGroups) {
        queryClient.setQueryData([KEY_GROUPS], context.previousGroups);
      }

      console.log("Failed to create group:", err);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [KEY_GROUPS] });
    },
  });

  return mutation;
};

export const useUpdateGroupMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<Group, Error, UIGroup, UpdateGroupContext>({
    mutationFn: (group) =>
      apiService.updateGroup(group.id, toServerGroupExceptId(group)),

    onMutate: async (newGroup) => {
      await queryClient.cancelQueries({ queryKey: [KEY_GROUPS] });
      await queryClient.cancelQueries({ queryKey: [KEY_GROUP, newGroup.id] });

      const previousGroups = queryClient.getQueryData<Group[]>([KEY_GROUPS]);
      const previousGroup = queryClient.getQueryData<Group>([
        KEY_GROUP,
        newGroup.id,
      ]);

      const newGroupData = toServerGroup(newGroup);
      queryClient.setQueryData<Group[]>([KEY_GROUPS], (oldData) => {
        return (
          oldData?.map((group) =>
            group.id === newGroup.id ? newGroupData : group
          ) ?? []
        );
      });
      queryClient.setQueryData<Group>([KEY_GROUP, newGroup.id], newGroupData);

      return { previousGroups, previousGroup };
    },

    onSuccess: (data, variables) => {
      queryClient.setQueryData<Group[]>([KEY_GROUPS], (oldData) => {
        return (
          oldData?.map((group) => (group.id === variables.id ? data : group)) ??
          []
        );
      });
      queryClient.setQueryData([KEY_GROUP, variables.id], data);
    },

    onError: (err, variables, context) => {
      if (context?.previousGroups) {
        queryClient.setQueryData<Group[]>([KEY_GROUPS], context.previousGroups);
      }
      if (context?.previousGroup) {
        queryClient.setQueryData<Group>(
          [KEY_GROUP, variables.id],
          context.previousGroup
        );
      }
      console.error(`Failed to update group with id ${variables.id}:`, err);
    },

    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({ queryKey: [KEY_GROUPS] });
      queryClient.invalidateQueries({ queryKey: [KEY_GROUP, variables.id] });
    },
  });

  return mutation;
};

export const useDeleteGroupMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<Group, Error, string, DeleteGroupContext>({
    mutationFn: (id: string) => apiService.deleteGroup(id),

    onMutate: async (deletedGroupId) => {
      await queryClient.cancelQueries({ queryKey: [KEY_GROUPS] });
      await queryClient.cancelQueries({
        queryKey: [KEY_GROUP, deletedGroupId],
      });

      const previousGroups = queryClient.getQueryData<Group[]>([KEY_GROUPS]);

      queryClient.setQueryData<Group[]>(
        [KEY_GROUPS],
        (old) => old?.filter((group) => group.id !== deletedGroupId) ?? []
      );

      queryClient.removeQueries({ queryKey: [KEY_GROUP, deletedGroupId] });

      return { previousGroups };
    },

    onError: (err, deletedGroupId, context) => {
      if (context?.previousGroups) {
        queryClient.setQueryData<Group[]>([KEY_GROUPS], context.previousGroups);
      }

      console.error(`Failed to delete group with id ${deletedGroupId}:`, err);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [KEY_GROUPS] });
      queryClient.invalidateQueries({ queryKey: [KEY_GROUP] });
    },
  });

  return mutation;
};
