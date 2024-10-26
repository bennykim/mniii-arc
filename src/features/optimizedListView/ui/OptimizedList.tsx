import { type FakerTextDataItem } from "@/entities/faker/api/base";
import { useOptimizedView } from "@/features/optimizedListView/hooks/useOptimizedView";
import { OptimizedListItem } from "@/features/optimizedListView/ui";
import { ScrollArea } from "@/shared/ui/shadcn/scroll-area";

const DEFAULT_ITEM_HEIGHT = 150;

type OptimizedListProps = {
  data: FakerTextDataItem[];
  onLoadMore: () => void;
};

export function OptimizedList({ data, onLoadMore }: OptimizedListProps) {
  const {
    visibleRange,
    containerRef,
    handleScroll,
    totalHeight,
    getItemOffset,
    updateItemHeight,
    toggleItemExpanded,
    isItemExpanded,
  } = useOptimizedView({
    totalItems: data.length,
    itemHeight: DEFAULT_ITEM_HEIGHT,
    bufferSize: 3,
    onLoadMore,
  });

  return (
    <ScrollArea
      ref={containerRef}
      className="relative w-full h-full"
      onScrollCapture={handleScroll}
    >
      <ul className="relative" style={{ height: totalHeight }}>
        {data.slice(visibleRange.start, visibleRange.end).map((item, index) => {
          const actualIndex = visibleRange.start + index;
          return (
            <OptimizedListItem
              key={item.order}
              order={item.order}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: getItemOffset(actualIndex),
                minHeight: DEFAULT_ITEM_HEIGHT,
              }}
              data={item}
              updateItemHeight={updateItemHeight}
              toggleItemExpanded={toggleItemExpanded}
              isExpanded={isItemExpanded(actualIndex)}
              enableAnimation
            />
          );
        })}
      </ul>
    </ScrollArea>
  );
}
