import { useQuery } from "@tanstack/react-query";

import { apiService } from "@/entities/history/api/base";
import { KEY_HISTORY, KEY_STATUS } from "@/shared/config/constants";
import { toUIHistory } from "@/shared/lib/transform";

import type { History } from "@/entities/history/model/types";

export const useGetHistoryQuery = (params: {
  id?: string;
  offset?: number;
  limit?: number;
}) => {
  const query = useQuery<History[], Error, UIHistories>({
    queryKey: [KEY_HISTORY, params],
    queryFn: () => apiService.getHistory(params),
    select: toUIHistory,
  });

  return query;
};

export const useGetStatusQuery = () => {
  const query = useQuery({
    queryKey: [KEY_STATUS],
    queryFn: apiService.getStatus,
  });

  return query;
};
