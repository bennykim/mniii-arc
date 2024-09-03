import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiService } from "@/api";
import { KEY_GROUP, KEY_ITEM, KEY_ITEMS } from "@/constants";
import { toServerItem } from "@/lib/utils";

import type { Item } from "@/mocks/model";

export const useCreateItem = (groupId: string) => {
  const queryClient = useQueryClient();
  return useMutation<Item, Error, Omit<UIItem, "id">>({
    mutationFn: (newItem) =>
      apiService.createItem(groupId, toServerItem({ ...newItem, id: "" })),
    onSuccess: (data) => {
      queryClient.setQueryData<Item[]>([KEY_ITEMS, groupId], (oldData) => {
        if (!oldData) return [data];
        return [...oldData, data];
      });
      queryClient.invalidateQueries({ queryKey: [KEY_GROUP, groupId] });
    },
  });
};

export const useUpdateItem = (groupId: string) => {
  const queryClient = useQueryClient();
  return useMutation<Item, Error, UIItem>({
    mutationFn: (item) =>
      apiService.updateItem(groupId, item.id, toServerItem(item)),
    onSuccess: (data, variables) => {
      queryClient.setQueryData<Item[]>([KEY_ITEMS, groupId], (oldData) => {
        if (!oldData) return oldData;
        return oldData.map((item) => (item.id === variables.id ? data : item));
      });
      queryClient.setQueryData([KEY_ITEM, groupId, variables.id], data);
      queryClient.invalidateQueries({ queryKey: [KEY_GROUP, groupId] });
    },
  });
};

export const useDeleteItem = (groupId: string) => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, UIItem["id"]>({
    mutationFn: async (itemId) => {
      await apiService.deleteItem(groupId, itemId);
    },
    onSuccess: (_, itemId) => {
      queryClient.setQueryData<Item[]>([KEY_ITEMS, groupId], (oldData) => {
        if (!oldData) return oldData;
        return oldData.filter((item) => item.id !== itemId);
      });
      queryClient.removeQueries({ queryKey: [KEY_ITEM, groupId, itemId] });
      queryClient.invalidateQueries({ queryKey: [KEY_GROUP, groupId] });
    },
  });
};
