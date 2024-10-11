import {
  useInfiniteQuery,
  useQuery,
  type InfiniteData,
  type QueryKey,
  type UseInfiniteQueryResult,
} from "@tanstack/react-query";

import {
  apiService,
  type Direction,
  type HistoryResponse,
} from "@/entities/timeline/api/base";
import { KEY_HISTORY, KEY_STATUS } from "@/shared/config/constants";
import { toUIHistory } from "@/shared/lib/transform";

type UIHistoryRespons = {
  data: UIHistories;
  nextCursor: string | null;
  prevCursor: string | null;
};

type UseInfiniteHistoryQueryParams = {
  limit?: number;
  direction?: Direction;
};

export const useGetInfiniteHistoryQuery = (
  params: UseInfiniteHistoryQueryParams
): UseInfiniteQueryResult<
  InfiniteData<UIHistoryRespons, string | null>,
  Error
> => {
  return useInfiniteQuery<
    HistoryResponse,
    Error,
    InfiniteData<UIHistoryRespons, string | null>,
    QueryKey,
    string | null
  >({
    queryKey: [KEY_HISTORY, params],
    queryFn: ({ pageParam }) =>
      apiService.getHistory({
        cursor: pageParam,
        limit: params.limit,
        direction: params.direction,
      }),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    getPreviousPageParam: (firstPage) => firstPage.prevCursor,
    select: (data) => ({
      pages: data.pages.map((page) => ({
        data: toUIHistory(page.data),
        nextCursor: page.nextCursor,
        prevCursor: page.prevCursor,
      })),
      pageParams: data.pageParams,
    }),
  });
};

export const useGetStatusQuery = () => {
  return useQuery({
    queryKey: [KEY_STATUS],
    queryFn: apiService.getStatus,
  });
};
