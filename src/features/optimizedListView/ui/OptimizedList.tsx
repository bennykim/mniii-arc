import { ScrollArea } from "@/shared/ui/shadcn/scroll-area";
import { useOptimizedView } from "../hooks/useOptimizedView";
import { OptimizedListItem } from "./OptimizedListItem";

type OptimizedListProps = {
  items: number[];
};

export function OptimizedList({ items }: OptimizedListProps) {
  const { visibleRange, containerRef, handleScroll, totalHeight, ITEM_HEIGHT } =
    useOptimizedView(items.length);

  return (
    <ScrollArea
      ref={containerRef}
      className="w-full h-full"
      onScrollCapture={handleScroll}
    >
      <div className="relative" style={{ height: totalHeight }}>
        {items
          .slice(visibleRange.start, visibleRange.end)
          .map((item, index) => (
            <OptimizedListItem
              key={item}
              index={item}
              style={{
                position: "absolute",
                top: (visibleRange.start + index) * ITEM_HEIGHT,
                left: 0,
                right: 0,
              }}
            />
          ))}
      </div>
    </ScrollArea>
  );
}
