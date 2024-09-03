import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiService } from "@/api";
import { KEY_GROUP, KEY_GROUPS } from "@/constants";
import { toServerGroup } from "@/lib/utils";

import type { Group } from "@/mocks/model";

export const useCreateGroup = () => {
  const queryClient = useQueryClient();
  return useMutation<Group, Error, Omit<UIGroup, "id">>({
    mutationFn: (newGroup) =>
      apiService.createGroup(toServerGroup({ ...newGroup, id: "" })),
    onSuccess: (data) => {
      queryClient.setQueryData<Group[]>([KEY_GROUPS], (oldData) => {
        if (!oldData) return [data];
        return [...oldData, data];
      });
      queryClient.invalidateQueries({ queryKey: [KEY_GROUPS] });
    },
  });
};

export const useUpdateGroup = () => {
  const queryClient = useQueryClient();
  return useMutation<Group, Error, UIGroup>({
    mutationFn: (group) =>
      apiService.updateGroup(group.id, toServerGroup(group)),
    onSuccess: (data, variables) => {
      queryClient.setQueryData<Group[]>([KEY_GROUPS], (oldData) => {
        if (!oldData) return oldData;
        return oldData.map((g) => (g.id === variables.id ? data : g));
      });
      queryClient.setQueryData([KEY_GROUP, variables.id], data);
    },
  });
};

export const useDeleteGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiService.deleteGroup(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: [KEY_GROUPS] });
      queryClient.removeQueries({ queryKey: [KEY_GROUP, id] });
    },
  });
};
