import { Eye, EyeOff } from "lucide-react";

import { useHistoryStore } from "@/entities/history/store";
import { useReadDetector } from "@/features/timelineViewer/hooks/useReadDetector";
import { formatDateLocale } from "@/shared/lib/utcDate";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/shadcn/card";

type TimelineItemProps = {
  item: UIHistory;
};

export function TimelineItem({ item }: TimelineItemProps) {
  const timelineItemref = useReadDetector(item.id);
  const isRead = useHistoryStore((state) => state.readState[item.id]);

  return (
    <Card className="mb-4" ref={timelineItemref}>
      <CardHeader>
        <CardTitle>{item.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500">
          {formatDateLocale(item.createdAt, "ko-KR")}
        </p>
        <p className="mt-2">{item.content}</p>
      </CardContent>
      <CardFooter className="flex justify-end">
        {isRead ? (
          <Eye className="w-4 h-4 text-gray-500" />
        ) : (
          <EyeOff className="w-4 h-4 text-gray-500" />
        )}
      </CardFooter>
    </Card>
  );
}
