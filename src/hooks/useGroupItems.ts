import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiService } from "../api";
import { KEY_GROUP, KEY_ITEM, KEY_ITEMS } from "../constants";
import { Item } from "../mocks/models";

export const useCreateItem = (groupId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newItem: Omit<Item, "id">) =>
      apiService.createItem(groupId, newItem),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KEY_ITEMS, groupId] });
      queryClient.invalidateQueries({ queryKey: [KEY_GROUP, groupId] });
    },
  });
};

export const useItems = (groupId: string) => {
  return useQuery<Item[], Error>({
    queryKey: [KEY_ITEMS, groupId],
    queryFn: () => apiService.getAllItems(groupId),
  });
};

export const useItem = (groupId: string, itemId: string) => {
  return useQuery<Item, Error>({
    queryKey: [KEY_ITEM, groupId, itemId],
    queryFn: () => apiService.getItemById(groupId, itemId),
  });
};

export const useUpdateItem = (groupId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, item }: { itemId: string; item: Item }) =>
      apiService.updateItem(groupId, itemId, item),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [KEY_ITEMS, groupId] });
      queryClient.invalidateQueries({
        queryKey: [KEY_ITEM, groupId, variables.itemId],
      });
      queryClient.invalidateQueries({ queryKey: [KEY_GROUP, groupId] });
    },
  });
};

export const useDeleteItem = (groupId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (itemId: string) => apiService.deleteItem(groupId, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KEY_ITEMS, groupId] });
      queryClient.invalidateQueries({ queryKey: [KEY_GROUP, groupId] });
    },
  });
};
