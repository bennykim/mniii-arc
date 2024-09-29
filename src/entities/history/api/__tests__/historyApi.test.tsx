import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import React from "react";

import { apiService } from "../base";
import { useUpdateStatusMutation } from "../mutations";
import { useGetHistoryQuery, useGetStatusQuery } from "../queries";

jest.mock("../base");

const queryClient = new QueryClient();
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("History API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  describe("useGetHistoryQuery", () => {
    it("fetches history data", async () => {
      const mockHistory = [
        {
          id: "1",
          name: "Event 1",
          description: "Description 1",
          createdAt: "2023-01-01",
        },
        {
          id: "2",
          name: "Event 2",
          description: "Description 2",
          createdAt: "2023-01-02",
        },
      ];
      (apiService.getHistory as jest.Mock).mockResolvedValue(mockHistory);

      const { result } = renderHook(() => useGetHistoryQuery({}), { wrapper });

      await waitFor(() => result.current.isSuccess);

      expect(result.current.data).toEqual([
        {
          id: "1",
          title: "Event 1",
          content: "Description 1",
          createdAt: "2023-01-01",
        },
        {
          id: "2",
          title: "Event 2",
          content: "Description 2",
          createdAt: "2023-01-02",
        },
      ]);
    });
  });

  describe("useGetStatusQuery", () => {
    it("fetches status data", async () => {
      const mockStatus = { realtime: "off" as const, interval: 60000 };
      (apiService.getStatus as jest.Mock).mockResolvedValue(mockStatus);

      const { result } = renderHook(() => useGetStatusQuery(), { wrapper });

      await waitFor(() => result.current.isSuccess);

      expect(result.current.data).toEqual(mockStatus);
    });
  });

  describe("useUpdateStatusMutation", () => {
    it("updates status", async () => {
      const newStatus = { realtime: "on" as const, interval: 30000 };
      (apiService.updateStatus as jest.Mock).mockResolvedValue({
        success: true,
      });

      const { result } = renderHook(() => useUpdateStatusMutation(), {
        wrapper,
      });

      await act(async () => {
        result.current.mutate(newStatus);
      });

      await waitFor(() => result.current.isSuccess);

      expect(apiService.updateStatus).toHaveBeenCalledWith(newStatus);
      expect(result.current.data).toEqual({ success: true });
    });
  });
});
