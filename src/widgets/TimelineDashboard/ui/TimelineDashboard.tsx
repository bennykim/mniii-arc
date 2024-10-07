import { useInfiniteTimeline } from "@/features/timelineViewer/hooks/useInfiniteTimeline";
import {
  LoadMoreButton,
  RealtimeToggle,
  TimelineList,
} from "@/features/timelineViewer/ui";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/shadcn/card";

export function TimelineDashboard() {
  const { infiniteQuery, statusQuery, toggleRealtime } = useInfiniteTimeline();

  return (
    <Card className="w-full max-w-4xl mx-auto mt-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Timeline Dashboard</CardTitle>
        <RealtimeToggle
          isRealtimeOn={statusQuery.data?.realtime === "on"}
          toggleRealtime={toggleRealtime}
          isLoading={statusQuery.isLoading}
        />
      </CardHeader>
      <CardContent>
        <TimelineList />
      </CardContent>
      <CardFooter className="justify-center">
        <LoadMoreButton
          enabled={!infiniteQuery.isLoading}
          fetchNextPage={infiniteQuery.fetchNextPage}
          hasNextPage={infiniteQuery.hasNextPage}
          isFetchingNextPage={infiniteQuery.isFetchingNextPage}
        />
      </CardFooter>
    </Card>
  );
}
