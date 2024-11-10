import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';

import { apiService, type RealTime } from '../base';
import { useUpdateStatusMutation } from '../mutations';
import { useGetInfiniteHistoryQuery, useGetStatusQuery } from '../queries';

import { initHistoryDB } from '@/mocks/db/historyDB';
import {
  DEFAULT_INTERVAL,
  DIRECTION_NEXT,
  STATUS_OFF,
  STATUS_ON,
} from '@/shared/config/constants';

jest.mock('../base');
jest.mock('@/mocks/db/historyDB', () => ({
  initHistoryDB: jest.fn(),
  getHistoryData: jest.fn(),
  getStatus: jest.fn(),
  updateStatus: jest.fn(),
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('Timeline API', () => {
  beforeAll(async () => {
    await initHistoryDB();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  describe('useGetInfiniteHistoryQuery', () => {
    it('fetches initial history data', async () => {
      const mockHistoryResponse = {
        data: [
          {
            id: '1',
            name: 'Event 1',
            description: 'Description 1',
            createdAt: '2023-01-01',
          },
          {
            id: '2',
            name: 'Event 2',
            description: 'Description 2',
            createdAt: '2023-01-02',
          },
        ],
        nextCursor: 'next-cursor',
        prevCursor: null,
      };
      (apiService.getHistory as jest.Mock).mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve(mockHistoryResponse), 100),
          ),
      );

      const { result } = renderHook(
        () =>
          useGetInfiniteHistoryQuery({ limit: 2, direction: DIRECTION_NEXT }),
        { wrapper },
      );

      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();

      await waitFor(() => expect(result.current.isSuccess).toBe(true), {
        timeout: 3000,
      });

      expect(result.current.data).toBeDefined();
      expect(result.current.data?.pages).toBeDefined();
      expect(result.current.data?.pages[0]).toBeDefined();

      const expectedData = {
        data: [
          {
            id: '1',
            title: 'Event 1',
            content: 'Description 1',
            createdAt: '2023-01-01',
            isRead: false,
          },
          {
            id: '2',
            title: 'Event 2',
            content: 'Description 2',
            createdAt: '2023-01-02',
            isRead: false,
          },
        ],
        nextCursor: 'next-cursor',
        prevCursor: null,
      };
      expect(result.current.data?.pages[0]).toEqual(expectedData);
      expect(apiService.getHistory).toHaveBeenCalledWith({
        cursor: null,
        limit: 2,
        direction: DIRECTION_NEXT,
      });
    });
  });

  describe('useGetStatusQuery', () => {
    it('fetches status data', async () => {
      const mockStatus = { realtime: STATUS_OFF as RealTime, interval: 60000 };
      (apiService.getStatus as jest.Mock).mockResolvedValue(mockStatus);

      const { result } = renderHook(() => useGetStatusQuery(), { wrapper });

      await waitFor(() => result.current.isSuccess);

      expect(result.current.data).toEqual(mockStatus);
    });
  });

  describe('useUpdateStatusMutation', () => {
    it('updates status', async () => {
      const newStatus = {
        realtime: STATUS_ON as RealTime,
        interval: DEFAULT_INTERVAL,
      };
      (apiService.updateStatus as jest.Mock).mockResolvedValue({
        success: true,
      });

      const { result } = renderHook(() => useUpdateStatusMutation(), {
        wrapper,
      });

      result.current.mutate(newStatus);

      await waitFor(() => result.current.isSuccess);

      expect(apiService.updateStatus).toHaveBeenCalledWith(newStatus);
      expect(result.current.data).toEqual({ success: true });
    });
  });
});
