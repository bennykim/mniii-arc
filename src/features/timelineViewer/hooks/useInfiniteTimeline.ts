import {
  useGetInfiniteHistoryQuery,
  useGetStatusQuery,
  useUpdateStatusMutation,
} from "@/entities/history/api";
import {
  DEFAULT_LIMIT,
  STATUS_OFF,
  STATUS_ON,
} from "@/shared/config/constants";

export const useInfiniteTimeline = (limit: number = DEFAULT_LIMIT) => {
  const infiniteQuery = useGetInfiniteHistoryQuery({ limit });
  const statusQuery = useGetStatusQuery();
  const updateStatusMutation = useUpdateStatusMutation();

  const toggleRealtime = async (checked: boolean) => {
    try {
      await updateStatusMutation.mutateAsync({
        realtime: checked ? STATUS_ON : STATUS_OFF,
        interval: statusQuery.data?.interval,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return {
    infiniteQuery,
    statusQuery,
    toggleRealtime,
  };
};
