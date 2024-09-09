import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import React from "react";

import { apiService } from "../base";
import {
  useCreateItemMutation,
  useDeleteItemMutation,
  useUpdateItemMutation,
} from "../mutations";
import { useGetItemQuery, useGetItemsQuery } from "../queries";

jest.mock("../base");

const queryClient = new QueryClient();
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("Item API", () => {
  const groupId = "group-1";

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  describe("useCreateItemMutation", () => {
    it("creates a new item", async () => {
      const newItem = { title: "New Item" };
      const createdItem = {
        id: "1",
        name: "New Item",
        createdAt: "2023-01-01",
      };
      (apiService.createItem as jest.Mock).mockResolvedValue(createdItem);

      const { result } = renderHook(() => useCreateItemMutation(groupId), {
        wrapper,
      });

      await act(async () => {
        result.current.mutate(newItem);
      });

      await waitFor(() => result.current.isSuccess);

      expect(apiService.createItem).toHaveBeenCalledWith(
        groupId,
        expect.objectContaining({
          name: "New Item",
        })
      );
      expect(result.current.data).toEqual(createdItem);
    });
  });

  describe("useGetItemsQuery", () => {
    it("fetches all items for a group", async () => {
      const mockItems = [
        { id: "1", name: "Item 1", createdAt: "2023-01-01" },
        { id: "2", name: "Item 2", createdAt: "2023-01-02" },
      ];
      (apiService.getAllItems as jest.Mock).mockResolvedValue(mockItems);

      const { result } = renderHook(() => useGetItemsQuery(groupId), {
        wrapper,
      });

      await waitFor(() => result.current.isSuccess);

      expect(result.current.data).toEqual({
        list: [
          { id: "1", title: "Item 1", createdAt: "2023-01-01" },
          { id: "2", title: "Item 2", createdAt: "2023-01-02" },
        ],
      });
    });
  });

  describe("useGetItemQuery", () => {
    it("fetches a single item", async () => {
      const mockItem = { id: "1", name: "Item 1", createdAt: "2023-01-01" };
      (apiService.getItemById as jest.Mock).mockResolvedValue(mockItem);

      const { result } = renderHook(() => useGetItemQuery(groupId, "1"), {
        wrapper,
      });

      await waitFor(() => result.current.isSuccess);

      expect(result.current.data).toEqual({
        id: "1",
        title: "Item 1",
        createdAt: "2023-01-01",
      });
    });
  });

  describe("useUpdateItemMutation", () => {
    it("updates an existing item", async () => {
      const updatedItem = {
        id: "1",
        title: "Updated Item",
        createdAt: "2023-01-01",
      };
      const serverResponse = {
        id: "1",
        name: "Updated Item",
        createdAt: "2023-01-01",
      };
      (apiService.updateItem as jest.Mock).mockResolvedValue(serverResponse);

      const { result } = renderHook(() => useUpdateItemMutation(groupId), {
        wrapper,
      });

      await act(async () => {
        result.current.mutate(updatedItem);
      });

      await waitFor(() => result.current.isSuccess);

      expect(apiService.updateItem).toHaveBeenCalledWith(
        groupId,
        "1",
        expect.objectContaining({
          name: "Updated Item",
        })
      );
      expect(result.current.data).toEqual(serverResponse);
    });
  });

  describe("useDeleteItemMutation", () => {
    it("deletes an item", async () => {
      const deletedItem = {
        id: "1",
        name: "Deleted Item",
        createdAt: "2023-01-01",
      };
      (apiService.deleteItem as jest.Mock).mockResolvedValue(deletedItem);

      const { result } = renderHook(() => useDeleteItemMutation(groupId), {
        wrapper,
      });

      await act(async () => {
        result.current.mutate("1");
      });

      await waitFor(() => result.current.isSuccess);

      expect(apiService.deleteItem).toHaveBeenCalledWith(groupId, "1");
      expect(result.current.data).toEqual(deletedItem);
    });
  });
});
