import { AxiosResponse } from "axios";

import { http } from "@/entities/base";

import type { History } from "@/entities/timeline/model/types";

export type HistoryResponse = {
  data: History[];
  nextCursor: string | null;
  prevCursor: string | null;
};

export const apiService = {
  getHistory: async (params: {
    cursor: string | null;
    limit?: number;
    direction?: "next" | "prev";
  }): Promise<HistoryResponse> => {
    const response: AxiosResponse<HistoryResponse> = await http.get(
      "/history",
      {
        params,
      }
    );
    return response.data;
  },

  updateStatus: async (params: {
    realtime: "on" | "off";
    interval?: number;
  }): Promise<{ success: boolean }> => {
    const response: AxiosResponse<{ success: boolean }> = await http.put(
      "/status",
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
    }> = await http.get("/status");
    return response.data;
  },
};
