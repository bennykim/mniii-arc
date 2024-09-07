import axios, { AxiosResponse } from "axios";

import type { Group } from "@/entities/group/model/types";
import type { Item } from "@/entities/item/model/types";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

export const apiService = {
  // Groups API
  createGroup: async (newGroup: Omit<Group, "id">): Promise<Group> => {
    const response: AxiosResponse<Group> = await api.post("/groups", newGroup);
    return response.data;
  },
  getAllGroups: async (): Promise<Group[]> => {
    const response: AxiosResponse<Group[]> = await api.get("/groups");
    return response.data;
  },
  getGroupById: async (id: string): Promise<Group> => {
    const response: AxiosResponse<Group> = await api.get(`/groups/${id}`);
    return response.data;
  },
  updateGroup: async (
    id: string,
    updatedGroup: Omit<Group, "id">
  ): Promise<Group> => {
    const response: AxiosResponse<Group> = await api.put(
      `/groups/${id}`,
      updatedGroup
    );
    return response.data;
  },
  deleteGroup: async (id: string): Promise<Group> => {
    const response: AxiosResponse<Group> = await api.delete(`/groups/${id}`);
    return response.data;
  },

  // Items API
  createItem: async (
    groupId: string,
    newItem: Omit<Item, "id">
  ): Promise<Item> => {
    const response: AxiosResponse<Item> = await api.post(
      `/groups/${groupId}/items`,
      newItem
    );
    return response.data;
  },
  getAllItems: async (groupId: string): Promise<Item[]> => {
    const response: AxiosResponse<Item[]> = await api.get(
      `/groups/${groupId}/items`
    );
    return response.data;
  },
  getItemById: async (groupId: string, itemId: string): Promise<Item> => {
    const response: AxiosResponse<Item> = await api.get(
      `/groups/${groupId}/items/${itemId}`
    );
    return response.data;
  },
  updateItem: async (
    groupId: string,
    itemId: string,
    updatedItem: Item
  ): Promise<Item> => {
    const response: AxiosResponse<Item> = await api.put(
      `/groups/${groupId}/items/${itemId}`,
      updatedItem
    );
    return response.data;
  },
  deleteItem: async (groupId: string, itemId: string): Promise<Item> => {
    const response: AxiosResponse<Item> = await api.delete(
      `/groups/${groupId}/items/${itemId}`
    );
    return response.data;
  },
};
