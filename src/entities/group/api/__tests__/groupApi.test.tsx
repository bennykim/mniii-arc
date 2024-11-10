import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import React from 'react';

import { apiService } from '../base';
import {
  useCreateGroupMutation,
  useDeleteGroupMutation,
  useUpdateGroupMutation,
} from '../mutations';
import { useGetGroupQuery, useGetGroupsQuery } from '../queries';

jest.mock('../base');

const queryClient = new QueryClient();
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('Group API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  describe('useCreateGroupMutation', () => {
    it('creates a new group', async () => {
      const newGroup = { title: 'New Group', list: [] };
      const createdGroup = {
        id: '1',
        name: 'New Group',
        items: [],
        createdAt: '2023-01-01',
      };
      (apiService.createGroup as jest.Mock).mockResolvedValue(createdGroup);

      const { result } = renderHook(() => useCreateGroupMutation(), {
        wrapper,
      });

      await act(async () => {
        result.current.mutate(newGroup);
      });

      await waitFor(() => result.current.isSuccess);

      expect(apiService.createGroup).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'New Group',
          items: [],
        }),
      );
      expect(result.current.data).toEqual(createdGroup);
    });
  });

  describe('useGetGroupsQuery', () => {
    it('fetches all groups', async () => {
      const mockGroups = [
        { id: '1', name: 'Group 1', items: [], createdAt: '2023-01-01' },
        { id: '2', name: 'Group 2', items: [], createdAt: '2023-01-02' },
      ];
      (apiService.getAllGroups as jest.Mock).mockResolvedValue(mockGroups);

      const { result } = renderHook(() => useGetGroupsQuery(), {
        wrapper,
      });

      await waitFor(() => result.current.isSuccess);

      expect(result.current.data).toEqual([
        { id: '1', title: 'Group 1', list: [], createdAt: '2023-01-01' },
        { id: '2', title: 'Group 2', list: [], createdAt: '2023-01-02' },
      ]);
    });
  });

  describe('useGetGroupQuery', () => {
    it('fetches a single group', async () => {
      const mockGroup = {
        id: '1',
        name: 'Group 1',
        items: [],
        createdAt: '2023-01-01',
      };
      (apiService.getGroupById as jest.Mock).mockResolvedValue(mockGroup);

      const { result } = renderHook(() => useGetGroupQuery('1'), {
        wrapper,
      });

      await waitFor(() => result.current.isSuccess);

      expect(result.current.data).toEqual({
        id: '1',
        title: 'Group 1',
        list: [],
        createdAt: '2023-01-01',
      });
    });
  });

  describe('useUpdateGroupMutation', () => {
    it('updates an existing group', async () => {
      const updatedGroup = {
        id: '1',
        title: 'Updated Group',
        list: [],
        createdAt: '2023-01-01',
      };
      const serverResponse = {
        id: '1',
        name: 'Updated Group',
        items: [],
        createdAt: '2023-01-01',
      };
      (apiService.updateGroup as jest.Mock).mockResolvedValue(serverResponse);

      const { result } = renderHook(() => useUpdateGroupMutation(), {
        wrapper,
      });

      await act(async () => {
        result.current.mutate(updatedGroup);
      });

      await waitFor(() => result.current.isSuccess);

      expect(apiService.updateGroup).toHaveBeenCalledWith(
        '1',
        expect.objectContaining({
          name: 'Updated Group',
          items: [],
        }),
      );
      expect(result.current.data).toEqual(serverResponse);
    });
  });

  describe('useDeleteGroupMutation', () => {
    it('deletes a group', async () => {
      const deletedGroup = {
        id: '1',
        name: 'Deleted Group',
        items: [],
        createdAt: '2023-01-01',
      };
      (apiService.deleteGroup as jest.Mock).mockResolvedValue(deletedGroup);

      const { result } = renderHook(() => useDeleteGroupMutation(), {
        wrapper,
      });

      await act(async () => {
        result.current.mutate('1');
      });

      await waitFor(() => result.current.isSuccess);

      expect(apiService.deleteGroup).toHaveBeenCalledWith('1');
      expect(result.current.data).toEqual(deletedGroup);
    });
  });
});
