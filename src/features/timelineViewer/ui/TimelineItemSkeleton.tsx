import { Card, CardContent, CardHeader } from "@/shared/ui/shadcn/card";
import { Skeleton } from "@/shared/ui/shadcn/skeleton";

export function TimelineItemSkeleton() {
  return (
    <Card className="mb-4">
      <CardHeader>
        <Skeleton className="w-3/4 h-4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="w-1/4 h-3 mb-2" />
        <Skeleton className="w-full h-20" />
      </CardContent>
    </Card>
  );
}
