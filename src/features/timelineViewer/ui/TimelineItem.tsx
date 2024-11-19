import { Eye, EyeOff } from 'lucide-react';

import { useHistoryStore } from '@/entities/history/store';
import { useReadDetector } from '@/features/timelineViewer/hooks';
import { formatDateLocale, getTimestamp } from '@/shared/lib/utcDate';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/ui/shadcn/card';

type TimelineItemProps = {
  item: UIHistory;
};

export function TimelineItem({ item }: TimelineItemProps) {
  const timelineItemref = useReadDetector(item.id);
  const { readState } = useHistoryStore();
  const timestamp = getTimestamp(item.createdAt);
  const localDate = formatDateLocale(item.createdAt, 'ko-KR');
  const isRead = readState[item.id];

  return (
    <Card
      className="bg-light-grey-blue"
      ref={timelineItemref}
      data-timeline-item-id={item.id}
      data-timeline-timestamp={timestamp}
    >
      <CardHeader>
        <CardTitle>{item.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500">{localDate}</p>
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
