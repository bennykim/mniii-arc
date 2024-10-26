import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { SCROLL_AREA_VIEWPORT_ATTR } from "@/shared/config/constants";

const INITIAL_RANGE = { start: 0, end: 4 };

type UseOptimizedViewProps = {
  totalItems: number;
  itemHeight: number;
  bufferSize?: number;
  threshold?: number;
  onLoadMore?: () => void;
};

export const useOptimizedView = ({
  totalItems,
  itemHeight,
  bufferSize = 2,
  threshold = 0.9,
  onLoadMore,
}: UseOptimizedViewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isLoadingRef = useRef(false);

  const [visibleRange, setVisibleRange] = useState(INITIAL_RANGE);
  const [itemHeights, setItemHeights] = useState<number[]>(() =>
    new Array(totalItems).fill(itemHeight)
  );
  const [expandedItems, setExpandedItems] = useState<boolean[]>(() =>
    new Array(totalItems).fill(false)
  );

  useEffect(() => {
    setItemHeights((prev) => {
      if (prev.length < totalItems) {
        return [
          ...prev,
          ...new Array(totalItems - prev.length).fill(itemHeight),
        ];
      }
      return prev;
    });

    setExpandedItems((prev) => {
      if (prev.length < totalItems) {
        return [...prev, ...new Array(totalItems - prev.length).fill(false)];
      }
      return prev;
    });

    isLoadingRef.current = false;
  }, [totalItems, itemHeight]);

  const totalHeight = useMemo(
    () => itemHeights.reduce((sum, height) => sum + height, 0),
    [itemHeights]
  );

  const getItemOffset = useCallback(
    (index: number) =>
      itemHeights.slice(0, index).reduce((sum, height) => sum + height, 0),
    [itemHeights]
  );

  const isItemExpanded = useCallback(
    (index: number) => expandedItems[index],
    [expandedItems]
  );

  const updateItemHeight = useCallback((index: number, newHeight: number) => {
    setItemHeights((prevHeights) => {
      const newHeights = [...prevHeights];
      newHeights[index] = newHeight;
      return newHeights;
    });
  }, []);

  const toggleItemExpanded = useCallback((index: number) => {
    setExpandedItems((prevExpanded) => {
      const newExpanded = [...prevExpanded];
      newExpanded[index] = !newExpanded[index];
      return newExpanded;
    });
  }, []);

  const calculateVisibleRangeChunked = useCallback(() => {
    const scrollElement = containerRef.current?.querySelector(
      `[${SCROLL_AREA_VIEWPORT_ATTR}]`
    ) as HTMLElement | null;

    if (!scrollElement) return INITIAL_RANGE;

    const { scrollTop, clientHeight } = scrollElement;
    const viewportEnd = scrollTop + clientHeight;

    let start = 0;
    let end = 0;
    let accumulatedHeight = 0;
    let prevAccumulatedHeight = 0;

    for (let i = 0; i < itemHeights.length; i++) {
      const currentHeight = itemHeights[i];
      accumulatedHeight += currentHeight;

      const itemTop = prevAccumulatedHeight;
      const itemBottom = accumulatedHeight;
      const isItemVisible =
        (itemTop <= viewportEnd && itemBottom >= scrollTop) ||
        (itemTop <= scrollTop && itemBottom >= viewportEnd);

      if (isItemVisible && start === 0) {
        if (i === 0 || scrollTop <= itemTop) {
          start = 0;
        } else {
          start = i;
        }
      }

      if (itemTop > viewportEnd && end === 0) {
        end = i + 1;
        break;
      }

      prevAccumulatedHeight = accumulatedHeight;
    }

    if (end === 0) {
      end = itemHeights.length;
    }

    const finalStart = Math.max(0, start - bufferSize);
    const finalEnd = Math.min(itemHeights.length, end + bufferSize);

    return {
      start: finalStart,
      end: finalEnd,
    };
  }, [itemHeights, bufferSize]);

  const handleScroll = useCallback(() => {
    const newRange = calculateVisibleRangeChunked();
    setVisibleRange(newRange);

    const scrollElement = containerRef.current?.querySelector(
      `[${SCROLL_AREA_VIEWPORT_ATTR}]`
    ) as HTMLElement | null;

    if (scrollElement && !isLoadingRef.current) {
      const { scrollTop, clientHeight, scrollHeight } = scrollElement;
      const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

      if (onLoadMore && scrollPercentage > threshold) {
        isLoadingRef.current = true;
        onLoadMore();
      }
    }
  }, [calculateVisibleRangeChunked, onLoadMore, threshold]);

  return {
    visibleRange,
    containerRef,
    expandedItems,
    totalHeight,
    itemHeights,
    handleScroll,
    getItemOffset,
    updateItemHeight,
    toggleItemExpanded,
    isItemExpanded,
  };
};
