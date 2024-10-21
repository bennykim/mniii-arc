import { ScrollArea } from "@/shared/ui/shadcn/scroll-area";
import { useOptimizedView } from "../hooks/useOptimizedView";
import { OptimizedListItem } from "./OptimizedListItem";

type OptimizedListProps = {
  items: number[];
};

export function OptimizedList({ items }: OptimizedListProps) {
  const {
    visibleRange,
    containerRef,
    handleScroll,
    totalHeight,
    getItemOffset,
    updateItemHeight,
    toggleItemExpanded,
    isItemExpanded,
  } = useOptimizedView(items.length);

  return (
    <ScrollArea
      ref={containerRef}
      className="w-full h-full"
      onScrollCapture={handleScroll}
    >
      <ul className="relative divide-y-2" style={{ height: totalHeight }}>
        {items
          .slice(visibleRange.start, visibleRange.end)
          .map((item, index) => (
            <OptimizedListItem
              key={item}
              index={item}
              className="absolute left-0 right-0"
              style={{
                top: getItemOffset(visibleRange.start + index),
              }}
              updateItemHeight={updateItemHeight}
              toggleItemExpanded={toggleItemExpanded}
              isExpanded={isItemExpanded(item)}
            />
          ))}
      </ul>
    </ScrollArea>
  );
}
