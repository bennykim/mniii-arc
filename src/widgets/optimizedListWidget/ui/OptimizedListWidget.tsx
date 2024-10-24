import { OptimizedList } from "@/features/optimizedListView/ui";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/ui/shadcn/card";

export function OptimizedListWidget() {
  const listLength = 30;
  const items = Array.from({ length: listLength }, (_, i) => i);

  return (
    <Card className="w-full max-w-4xl mx-auto mt-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Optimized ListWidget</CardTitle>
      </CardHeader>
      <CardContent className="h-[600px]">
        <OptimizedList items={items} />
      </CardContent>
    </Card>
  );
}
