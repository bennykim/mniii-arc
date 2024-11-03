import { memo } from "react";

import { type FakerTextDataItem } from "@/entities/faker/api/base";
import { useOptimizedView } from "@/features/optimizedListView/hooks/useOptimizedView";
import { OptimizedListItem } from "@/features/optimizedListView/ui";
import { ENTRY_TYPE } from "@/shared/config/constants";
import { ScrollArea } from "@/shared/ui/shadcn/scroll-area";

const DEFAULT_ITEM_HEIGHT = 150;
const DEFAULT_BUFFER_SIZE = 3;

type OptimizedListProps = {
  data: FakerTextDataItem[];
  entryType?: (typeof ENTRY_TYPE)[keyof typeof ENTRY_TYPE];
  onLoadMore: () => void;
  onLoadLatest?: () => Promise<boolean>;
};

const getItemStyle = (offset: number) => ({
  position: "absolute" as const,
  left: 0,
  right: 0,
  top: offset,
  minHeight: `${DEFAULT_ITEM_HEIGHT}px`,
});

export function OptimizedList({
  data,
  entryType = ENTRY_TYPE.APPEND,
  onLoadMore,
  onLoadLatest,
}: OptimizedListProps) {
  const {
    visibleRange,
    containerRef,
    totalHeight,
    handleScroll,
    getItemOffset,
    updateItemHeight,
    toggleItemExpanded,
    isItemExpanded,
  } = useOptimizedView({
    totalItems: data.length,
    itemHeight: DEFAULT_ITEM_HEIGHT,
    bufferSize: DEFAULT_BUFFER_SIZE,
    entryType,
    onLoadMore,
    onLoadLatest,
  });

  const visibleItems = data.slice(visibleRange.start, visibleRange.end);
  return (
    <ScrollArea
      ref={containerRef}
      className="relative w-full h-full"
      onScrollCapture={handleScroll}
    >
      <ul className="relative" style={{ height: totalHeight }}>
        {visibleItems.map((item, index) => {
          const actualIndex = visibleRange.start + index;
          return (
            <OptimizedListItem
              key={item.order}
              order={item.order}
              style={getItemStyle(getItemOffset(actualIndex))}
              data={item}
              updateItemHeight={updateItemHeight}
              toggleItemExpanded={toggleItemExpanded}
              isExpanded={isItemExpanded(actualIndex)}
            />
          );
        })}
      </ul>
    </ScrollArea>
  );
}

export default memo(OptimizedList);
