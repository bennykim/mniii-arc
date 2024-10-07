import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiService } from "@/entities/timeline/api/base";
import { KEY_STATUS } from "@/shared/config/constants";

export const useUpdateStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { realtime: "on" | "off"; interval?: number }) =>
      apiService.updateStatus(params),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KEY_STATUS] });
    },

    onError: (error) => {
      console.error("Failed to update status:", error);
    },
  });
};
