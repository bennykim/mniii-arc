import { AxiosResponse } from "axios";

import { http } from "@/entities/base";

import type { Item } from "@/entities/item/model/types";

export const apiService = {
  createItem: async (
    groupId: string,
    newItem: Omit<Item, "id" | "createdAt">
  ): Promise<Item> => {
    const response: AxiosResponse<Item> = await http.post(
      `/groups/${groupId}/items`,
      newItem
    );
    return response.data;
  },
  getAllItems: async (groupId: string): Promise<Item[]> => {
    const response: AxiosResponse<Item[]> = await http.get(
      `/groups/${groupId}/items`
    );
    return response.data;
  },
  getItemById: async (groupId: string, itemId: string): Promise<Item> => {
    const response: AxiosResponse<Item> = await http.get(
      `/groups/${groupId}/items/${itemId}`
    );
    return response.data;
  },
  updateItem: async (
    groupId: string,
    itemId: string,
    updatedItem: Item
  ): Promise<Item> => {
    const response: AxiosResponse<Item> = await http.put(
      `/groups/${groupId}/items/${itemId}`,
      updatedItem
    );
    return response.data;
  },
  deleteItem: async (groupId: string, itemId: string): Promise<Item> => {
    const response: AxiosResponse<Item> = await http.delete(
      `/groups/${groupId}/items/${itemId}`
    );
    return response.data;
  },
};
