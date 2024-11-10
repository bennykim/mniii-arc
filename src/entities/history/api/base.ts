import { AxiosResponse } from 'axios';

import { http } from '@/entities/base';
import type { History } from '@/entities/history/model/types';
import {
  DIRECTION_NEXT,
  DIRECTION_PREV,
  STATUS_OFF,
  STATUS_ON,
} from '@/shared/config/constants';

export type HistoryResponse = {
  data: History[];
  nextCursor: string | null;
  prevCursor: string | null;
};

export type RealTime = typeof STATUS_ON | typeof STATUS_OFF;

export type Direction = typeof DIRECTION_NEXT | typeof DIRECTION_PREV;

export type RealTimeHandlers = {
  onMessage?: (event: MessageEvent) => void;
  onError?: (event: Event) => void;
};

export const apiService = {
  getHistory: async (params: {
    cursor: string | null;
    limit?: number;
    direction?: Direction;
  }): Promise<HistoryResponse> => {
    const response: AxiosResponse<HistoryResponse> = await http.get(
      '/history',
      {
        params,
      },
    );
    return response.data;
  },

  updateStatus: async (params: {
    realtime: RealTime;
    interval?: number;
  }): Promise<{ success: boolean }> => {
    const response: AxiosResponse<{ success: boolean }> = await http.put(
      '/status',
      null,
      { params },
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
    }> = await http.get('/status');
    return response.data;
  },

  createRealtimeConnection: (
    handlers: RealTimeHandlers,
  ): {
    eventSource: EventSource;
    close: () => void;
  } => {
    const eventSource = new EventSource('/realtime');

    if (handlers.onMessage) {
      eventSource.onmessage = handlers.onMessage;
    }

    if (handlers.onError) {
      eventSource.onerror = handlers.onError;
    }

    return {
      eventSource,
      close: () => eventSource.close(),
    };
  },
};
