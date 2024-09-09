import { AxiosResponse } from "axios";

import { http } from "@/entities/base";

import type { Group } from "@/entities/group/model/types";

export const apiService = {
  createGroup: async (
    newGroup: Omit<Group, "id" | "createdAt">
  ): Promise<Group> => {
    const response: AxiosResponse<Group> = await http.post("/groups", newGroup);
    return response.data;
  },
  getAllGroups: async (): Promise<Group[]> => {
    const response: AxiosResponse<Group[]> = await http.get("/groups");
    return response.data;
  },
  getGroupById: async (id: string): Promise<Group> => {
    const response: AxiosResponse<Group> = await http.get(`/groups/${id}`);
    return response.data;
  },
  updateGroup: async (
    id: string,
    updatedGroup: Omit<Group, "id" | "createdAt">
  ): Promise<Group> => {
    const response: AxiosResponse<Group> = await http.put(
      `/groups/${id}`,
      updatedGroup
    );
    return response.data;
  },
  deleteGroup: async (id: string): Promise<Group> => {
    const response: AxiosResponse<Group> = await http.delete(`/groups/${id}`);
    return response.data;
  },
};
