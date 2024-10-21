import { useCallback, useMemo, useRef, useState } from "react";

import { SCROLL_AREA_VIEWPORT_ATTR } from "@/shared/config/constants";

const DEFAULT_ITEM_HEIGHT = 200;
const BUFFER_SIZE = 2;
const INITIAL_RANGE = { start: 0, end: 4 };

export const useOptimizedView = (totalItems: number) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleRange, setVisibleRange] = useState(INITIAL_RANGE);
  const [itemHeights, setItemHeights] = useState<number[]>(() =>
    new Array(totalItems).fill(DEFAULT_ITEM_HEIGHT)
  );
  const [expandedItems, setExpandedItems] = useState<boolean[]>(() =>
    new Array(totalItems).fill(false)
  );

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

  const calculateVisibleRange = useCallback(() => {
    const scrollElement = containerRef.current?.querySelector(
      `[${SCROLL_AREA_VIEWPORT_ATTR}]`
    ) as HTMLElement | null;

    if (!scrollElement) return INITIAL_RANGE;

    const { scrollTop, clientHeight } = scrollElement;
    const totalScrollHeight = scrollTop + clientHeight;

    let start = 0;
    let end = 0;
    let accumulatedHeight = 0;

    for (let i = 0; i < itemHeights.length; i++) {
      if (start === 0 && accumulatedHeight > scrollTop) {
        start = Math.max(0, i - BUFFER_SIZE);
      }

      accumulatedHeight += itemHeights[i];

      if (accumulatedHeight > totalScrollHeight) {
        end = Math.min(itemHeights.length, i + 1 + BUFFER_SIZE);
        break;
      }
    }

    return { start, end };
  }, [itemHeights]);

  const handleScroll = useCallback(() => {
    setVisibleRange(calculateVisibleRange());
  }, [calculateVisibleRange]);

  return {
    visibleRange,
    containerRef,
    expandedItems,
    handleScroll,
    totalHeight,
    getItemOffset,
    updateItemHeight,
    toggleItemExpanded,
    itemHeights,
    isItemExpanded,
  };
};
