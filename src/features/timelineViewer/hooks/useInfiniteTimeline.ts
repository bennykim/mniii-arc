import {
  useGetInfiniteHistoryQuery,
  useGetStatusQuery,
  useUpdateStatusMutation,
} from "@/entities/timeline/api";

export const useInfiniteTimeline = (limit: number = 20) => {
  const infiniteQuery = useGetInfiniteHistoryQuery({ limit });
  const statusQuery = useGetStatusQuery();
  const updateStatusMutation = useUpdateStatusMutation();

  const toggleRealtime = async (checked: boolean) => {
    try {
      await updateStatusMutation.mutateAsync({
        realtime: checked ? "on" : "off",
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
