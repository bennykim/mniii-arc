import { type FakerTextDataItem } from "@/entities/faker/api/base";
import { useOptimizedView } from "@/features/optimizedListView/hooks/useOptimizedView";
import { OptimizedListItem } from "@/features/optimizedListView/ui";
import { ENTRY_TYPE } from "@/shared/config/constants";
import { ScrollArea } from "@/shared/ui/shadcn/scroll-area";

const DEFAULT_ITEM_HEIGHT = 150;

type OptimizedListProps = {
  data: FakerTextDataItem[];
  entryType: (typeof ENTRY_TYPE)[keyof typeof ENTRY_TYPE];
  onLoadMore: () => void;
};

export function OptimizedList({
  data,
  onLoadMore,
  entryType = ENTRY_TYPE.APPEND,
}: OptimizedListProps) {
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
    entryType,
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
                minHeight: `${DEFAULT_ITEM_HEIGHT}px`,
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
