import { AxiosResponse } from "axios";

import { http } from "@/entities/base";

import type { History } from "@/entities/history/model/types";

export const apiService = {
  getHistory: async (params: {
    id?: string;
    offset?: number;
    limit?: number;
  }): Promise<History[]> => {
    const response: AxiosResponse<History[]> = await http.get("/api/history", {
      params,
    });
    return response.data;
  },

  updateStatus: async (params: {
    realtime: "on" | "off";
    interval?: number;
  }): Promise<{ success: boolean }> => {
    const response: AxiosResponse<{ success: boolean }> = await http.put(
      "/api/status",
      null,
      { params }
    );
    return response.data;
  },

  getStatus: async (): Promise<{
    realtime: "on" | "off";
    interval: number;
  }> => {
    const response: AxiosResponse<{
      realtime: "on" | "off";
      interval: number;
    }> = await http.get("/api/status");
    return response.data;
  },
};
