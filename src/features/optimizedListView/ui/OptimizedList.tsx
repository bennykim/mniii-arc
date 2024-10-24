import { useOptimizedView } from "@/features/optimizedListView/hooks/useOptimizedView";
import { ScrollArea } from "@/shared/ui/shadcn/scroll-area";
import { Loader2 } from "lucide-react";
import { useCallback, useState } from "react";
import { OptimizedListItem } from "./OptimizedListItem";

const LOAD_MORE_COUNT = 20;
const DEFAULT_ITEM_HEIGHT = 150;

type OptimizedListProps = {
  items: number[];
};

export function OptimizedList({ items }: OptimizedListProps) {
  const [totalItems, setTotalItems] = useState(items);
  const [isLoading, setIsLoading] = useState(false);

  const onLoadMore = useCallback(() => {
    setIsLoading(true);

    setTimeout(() => {
      setTotalItems((prevItems) => [
        ...prevItems,
        ...Array.from(
          { length: LOAD_MORE_COUNT },
          (_, i) => prevItems.length + i
        ),
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

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
    totalItems: totalItems.length,
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
      <ul className="relative divide-y-2" style={{ height: totalHeight }}>
        {totalItems
          .slice(visibleRange.start, visibleRange.end)
          .map((item, index) => (
            <OptimizedListItem
              key={item}
              index={item}
              className={`absolute left-0 right-0 h-[${DEFAULT_ITEM_HEIGHT}px]`}
              style={{
                top: getItemOffset(visibleRange.start + index),
              }}
              updateItemHeight={updateItemHeight}
              toggleItemExpanded={toggleItemExpanded}
              isExpanded={isItemExpanded(item)}
            />
          ))}
      </ul>
      {isLoading && (
        <div className="absolute bottom-0 left-0 right-0 flex justify-center items-center h-[100px] z-50 mx-auto">
          <Loader2 className="w-8 h-8 text-gray-500 animate-spin" />
        </div>
      )}
    </ScrollArea>
  );
}
