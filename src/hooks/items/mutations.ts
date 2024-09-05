import { useMutation, useQueryClient } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";

import { apiService } from "@/api";
import { KEY_GROUP, KEY_ITEM, KEY_ITEMS } from "@/constants";
import { toServerItem, toServerItemExceptId } from "@/lib/utils";

import type { Item } from "@/mocks/model";

type CreateItemContext = {
  tempId: string;
  previousItems: Item[] | undefined;
};

type UpdateItemContext = {
  previousItems: Item[] | undefined;
  previousItem: Item | undefined;
};

type DeleteItemContext = {
  previousItems: Item[] | undefined;
};

export const useCreateItem = (groupId: string) => {
  const queryClient = useQueryClient();

  return useMutation<Item, Error, Omit<UIItem, "id">, CreateItemContext>({
    mutationFn: (newItem) =>
      apiService.createItem(groupId, toServerItemExceptId(newItem)),

    onMutate: async (newItem) => {
      await queryClient.cancelQueries({ queryKey: [KEY_ITEMS, groupId] });

      const previousItems = queryClient.getQueryData<Item[]>([
        KEY_ITEMS,
        groupId,
      ]);

      const tempId = `temp-${uuidv4()}`;
      const newTempItem: Item = {
        ...toServerItemExceptId(newItem),
        id: tempId,
      };

      queryClient.setQueryData<Item[]>([KEY_ITEMS, groupId], (oldData) => {
        return oldData ? [...oldData, newTempItem] : [newTempItem];
      });

      return { tempId, previousItems };
    },

    onSuccess: (createdItem, _, context) => {
      queryClient.setQueryData<Item[]>([KEY_ITEMS, groupId], (oldData) => {
        return (
          oldData?.map((item) =>
            item.id === context?.tempId ? createdItem : item
          ) ?? []
        );
      });
    },

    onError: (err, _, context) => {
      if (context?.previousItems) {
        queryClient.setQueryData([KEY_ITEMS, groupId], context.previousItems);
      }
      console.error("Failed to create item:", err);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [KEY_ITEMS, groupId] });
      queryClient.invalidateQueries({ queryKey: [KEY_GROUP, groupId] });
    },
  });
};

export const useUpdateItem = (groupId: string) => {
  const queryClient = useQueryClient();

  return useMutation<Item, Error, UIItem, UpdateItemContext>({
    mutationFn: (item) =>
      apiService.updateItem(groupId, item.id, toServerItem(item)),

    onMutate: async (newItem) => {
      await queryClient.cancelQueries({ queryKey: [KEY_ITEMS, groupId] });
      await queryClient.cancelQueries({
        queryKey: [KEY_ITEM, groupId, newItem.id],
      });

      const previousItems = queryClient.getQueryData<Item[]>([
        KEY_ITEMS,
        groupId,
      ]);
      const previousItem = queryClient.getQueryData<Item>([
        KEY_ITEM,
        groupId,
        newItem.id,
      ]);

      const newItemData = toServerItem(newItem);
      queryClient.setQueryData<Item[]>([KEY_ITEMS, groupId], (oldData) => {
        return (
          oldData?.map((item) =>
            item.id === newItem.id ? newItemData : item
          ) ?? []
        );
      });
      queryClient.setQueryData<Item>(
        [KEY_ITEM, groupId, newItem.id],
        newItemData
      );

      return { previousItems, previousItem };
    },

    onSuccess: (data, variables) => {
      queryClient.setQueryData<Item[]>([KEY_ITEMS, groupId], (oldData) => {
        return (
          oldData?.map((item) => (item.id === variables.id ? data : item)) ?? []
        );
      });
      queryClient.setQueryData([KEY_ITEM, groupId, variables.id], data);
    },

    onError: (err, variables, context) => {
      if (context?.previousItems) {
        queryClient.setQueryData<Item[]>(
          [KEY_ITEMS, groupId],
          context.previousItems
        );
      }
      if (context?.previousItem) {
        queryClient.setQueryData<Item>(
          [KEY_ITEM, groupId, variables.id],
          context.previousItem
        );
      }
      console.error(`Failed to update item with id ${variables.id}:`, err);
    },

    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({ queryKey: [KEY_ITEMS, groupId] });
      queryClient.invalidateQueries({
        queryKey: [KEY_ITEM, groupId, variables.id],
      });
      queryClient.invalidateQueries({ queryKey: [KEY_GROUP, groupId] });
    },
  });
};

export const useDeleteItem = (groupId: string) => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, UIItem["id"], DeleteItemContext>({
    mutationFn: async (itemId) => {
      await apiService.deleteItem(groupId, itemId);
    },

    onMutate: async (deletedItemId) => {
      await queryClient.cancelQueries({ queryKey: [KEY_ITEMS, groupId] });
      await queryClient.cancelQueries({
        queryKey: [KEY_ITEM, groupId, deletedItemId],
      });

      const previousItems = queryClient.getQueryData<Item[]>([
        KEY_ITEMS,
        groupId,
      ]);

      queryClient.setQueryData<Item[]>(
        [KEY_ITEMS, groupId],
        (old) => old?.filter((item) => item.id !== deletedItemId) ?? []
      );

      queryClient.removeQueries({
        queryKey: [KEY_ITEM, groupId, deletedItemId],
      });

      return { previousItems };
    },

    onError: (err, deletedItemId, context) => {
      if (context?.previousItems) {
        queryClient.setQueryData<Item[]>(
          [KEY_ITEMS, groupId],
          context.previousItems
        );
      }
      console.error(`Failed to delete item with id ${deletedItemId}:`, err);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [KEY_ITEMS, groupId] });
      queryClient.invalidateQueries({ queryKey: [KEY_ITEM, groupId] });
      queryClient.invalidateQueries({ queryKey: [KEY_GROUP, groupId] });
    },
  });
};
