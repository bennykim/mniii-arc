import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/ui/shadcn/card";

type TimelineItemProps = {
  item: UIHistory;
};

export function TimelineItem({ item }: TimelineItemProps) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{item.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500">
          {new Date(item.createdAt).toLocaleString()}
        </p>
        <p className="mt-2">{item.content}</p>
      </CardContent>
    </Card>
  );
}
