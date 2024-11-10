import { useMutation, useQueryClient } from '@tanstack/react-query';

import { apiService, type RealTime } from '@/entities/history/api/base';
import { KEY_STATUS } from '@/shared/config/constants';

export const useUpdateStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { realtime: RealTime; interval?: number }) =>
      apiService.updateStatus(params),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KEY_STATUS] });
    },

    onError: (error) => {
      console.error('Failed to update status:', error);
    },
  });
};
