import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiService } from "../api";
import { KEY_GROUP, KEY_GROUPS } from "../constants";
import { Group } from "../mocks/models";

export const useCreateGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newGroup: Omit<Group, "id">) =>
      apiService.createGroup(newGroup),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KEY_GROUPS] });
    },
  });
};

export const useGroups = () => {
  return useQuery<Group[], Error>({
    queryKey: [KEY_GROUPS],
    queryFn: apiService.getAllGroups,
  });
};

export const useGroup = (id: string) => {
  return useQuery<Group, Error>({
    queryKey: [KEY_GROUP, id],
    queryFn: () => apiService.getGroupById(id),
  });
};

export const useUpdateGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, group }: { id: string; group: Group }) =>
      apiService.updateGroup(id, group),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [KEY_GROUPS] });
      queryClient.invalidateQueries({ queryKey: [KEY_GROUP, variables.id] });
    },
  });
};

export const useDeleteGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiService.deleteGroup(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KEY_GROUPS] });
    },
  });
};
