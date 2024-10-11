import { AxiosResponse } from "axios";

import { http } from "@/entities/base";
import {
  DIRECTION_NEXT,
  DIRECTION_PREV,
  STATUS_OFF,
  STATUS_ON,
} from "@/shared/config/constants";

import type { History } from "@/entities/timeline/model/types";

export type HistoryResponse = {
  data: History[];
  nextCursor: string | null;
  prevCursor: string | null;
};

export type RealTime = typeof STATUS_ON | typeof STATUS_OFF;

export type Direction = typeof DIRECTION_NEXT | typeof DIRECTION_PREV;

export const apiService = {
  getHistory: async (params: {
    cursor: string | null;
    limit?: number;
    direction?: Direction;
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
    realtime: RealTime;
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
    realtime: RealTime;
    interval: number;
  }> => {
    const response: AxiosResponse<{
      realtime: RealTime;
      interval: number;
    }> = await http.get("/status");
    return response.data;
  },
};