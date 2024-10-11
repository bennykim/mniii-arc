import { useInfiniteTimeline } from "@/features/timelineViewer/hooks/useInfiniteTimeline";
import { RealtimeToggle, TimelineList } from "@/features/timelineViewer/ui";
import { STATUS_ON } from "@/shared/config/constants";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/ui/shadcn/card";

export function TimelineDashboard() {
  const { statusQuery, toggleRealtime } = useInfiniteTimeline();

  return (
    <Card className="w-full max-w-4xl mx-auto mt-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Timeline Dashboard</CardTitle>
        <RealtimeToggle
          isRealtimeOn={statusQuery.data?.realtime === STATUS_ON}
          toggleRealtime={toggleRealtime}
          isLoading={statusQuery.isLoading}
        />
      </CardHeader>
      <CardContent>
        <TimelineList />
      </CardContent>
    </Card>
  );
}
