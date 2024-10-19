import { useCallback, useRef, useState } from "react";

const ITEM_HEIGHT = 200;
const BUFFER_SIZE = 5;

export const useOptimizedView = (totalItems: number) => {
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 20 });
  const containerRef = useRef<HTMLDivElement>(null);

  const calculateVisibleRange = useCallback(
    (scrollTop: number, clientHeight: number) => {
      const startIndex = Math.floor(scrollTop / ITEM_HEIGHT);
      const endIndex = Math.ceil((scrollTop + clientHeight) / ITEM_HEIGHT);

      return {
        start: Math.max(0, startIndex - BUFFER_SIZE),
        end: Math.min(totalItems, endIndex + BUFFER_SIZE),
      };
    },
    [totalItems]
  );

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, clientHeight } = e.target as HTMLDivElement;
      const newVisibleRange = calculateVisibleRange(scrollTop, clientHeight);
      setVisibleRange(newVisibleRange);
    },
    [calculateVisibleRange]
  );

  return {
    visibleRange,
    containerRef,
    handleScroll,
    totalHeight: totalItems * ITEM_HEIGHT,
    ITEM_HEIGHT,
  };
};
