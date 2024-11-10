import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { VIRTUALIZATION } from '@/features/virtualizedListView/lib/constants';
import {
  createArrayWithValue,
  getScrollElement,
} from '@/features/virtualizedListView/lib/helpers';
import { ENTRY_TYPE } from '@/widgets/virtualizedListWidget/lib/constants';

type VisibleRange = {
  start: number;
  end: number;
};

type UseVirtualizationProps = {
  totalItems: number;
  itemHeight: number;
  bufferSize?: number;
  threshold?: number;
  entryType?: (typeof ENTRY_TYPE)[keyof typeof ENTRY_TYPE];
  onLoadMore?: () => void;
  onLoadLatest?: () => Promise<boolean>;
};

type UseVirtualizationReturn = {
  visibleRange: VisibleRange;
  containerRef: React.RefObject<HTMLDivElement>;
  expandedItems: boolean[];
  totalHeight: number;
  itemHeights: number[];
  handleScroll: () => void;
  getItemOffset: (index: number) => number;
  updateItemHeight: (index: number, newHeight: number) => void;
  toggleItemExpanded: (index: number) => void;
  isItemExpanded: (index: number) => boolean;
};

export const useVirtualization = ({
  totalItems,
  itemHeight,
  bufferSize = VIRTUALIZATION.DEFAULT_BUFFER_SIZE,
  threshold = VIRTUALIZATION.DEFAULT_THRESHOLD,
  entryType = ENTRY_TYPE.APPEND,
  onLoadMore,
  onLoadLatest,
}: UseVirtualizationProps): UseVirtualizationReturn => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isLoadingRef = useRef(false);
  const previousTotalRef = useRef(totalItems);

  const [visibleRange, setVisibleRange] = useState<VisibleRange>(
    VIRTUALIZATION.INITIAL_RANGE,
  );
  const [itemHeights, setItemHeights] = useState<number[]>(() =>
    createArrayWithValue(totalItems, itemHeight),
  );
  const [expandedItems, setExpandedItems] = useState<boolean[]>(() =>
    createArrayWithValue(totalItems, false),
  );

  useLayoutEffect(() => {
    const handlePrependScroll = () => {
      const scrollElement = getScrollElement(containerRef);
      if (!scrollElement) return;

      const currentScrollTop = scrollElement.scrollTop;
      const newItemsCount = totalItems - previousTotalRef.current;
      const heightDiff = newItemsCount * itemHeight;

      scrollElement.scrollTop = currentScrollTop + heightDiff;
    };

    const updateArrays = () => {
      const updateArray = <T>(prev: T[], defaultValue: T) => {
        if (prev.length < totalItems) {
          const newItems = createArrayWithValue(
            totalItems - prev.length,
            defaultValue,
          );
          return entryType === ENTRY_TYPE.PREPEND
            ? [...newItems, ...prev]
            : [...prev, ...newItems];
        }
        return prev;
      };

      setItemHeights((prev) => updateArray(prev, itemHeight));
      setExpandedItems((prev) => updateArray(prev, false));
    };

    if (
      entryType === ENTRY_TYPE.PREPEND &&
      totalItems > previousTotalRef.current
    ) {
      handlePrependScroll();
    }

    updateArrays();
    previousTotalRef.current = totalItems;
    isLoadingRef.current = false;
  }, [totalItems, itemHeight, entryType]);

  const totalHeight = useMemo(
    () => itemHeights.reduce((sum, height) => sum + height, 0),
    [itemHeights],
  );

  const getItemOffset = useCallback(
    (index: number) =>
      itemHeights.slice(0, index).reduce((sum, height) => sum + height, 0),
    [itemHeights],
  );

  const isItemExpanded = useCallback(
    (index: number) => expandedItems[index],
    [expandedItems],
  );

  const updateItemHeight = useCallback((index: number, newHeight: number) => {
    setItemHeights((prev) => {
      const newHeights = [...prev];
      newHeights[index] = newHeight;
      return newHeights;
    });
  }, []);

  const toggleItemExpanded = useCallback((index: number) => {
    setExpandedItems((prev) => {
      const newExpanded = [...prev];
      newExpanded[index] = !newExpanded[index];
      return newExpanded;
    });
  }, []);

  const calculateVisibleRangeChunked = useCallback((): VisibleRange => {
    const scrollElement = getScrollElement(containerRef);
    if (!scrollElement) return VIRTUALIZATION.INITIAL_RANGE;

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
        start = i === 0 || scrollTop <= itemTop ? 0 : i;
      }

      if (itemTop > viewportEnd && end === 0) {
        end = i + 1;
        break;
      }

      prevAccumulatedHeight = accumulatedHeight;
    }

    end = end || itemHeights.length;

    return {
      start: Math.max(0, start - bufferSize),
      end: Math.min(itemHeights.length, end + bufferSize),
    };
  }, [itemHeights, bufferSize]);

  const handleScroll = useCallback(() => {
    const handleInfiniteScroll = async () => {
      const scrollElement = getScrollElement(containerRef);

      if (!scrollElement || isLoadingRef.current) return;

      const { scrollTop, clientHeight, scrollHeight } = scrollElement;

      const previousScrollTop = Number(
        scrollElement.dataset.lastScrollTop || 0,
      );
      const isScrollingUp = scrollTop < previousScrollTop;

      scrollElement.dataset.lastScrollTop = String(scrollTop);

      const bottomScrollPercentage = (scrollTop + clientHeight) / scrollHeight;
      if (onLoadMore && bottomScrollPercentage > threshold) {
        isLoadingRef.current = true;
        onLoadMore();
        return;
      }

      const topScrollPercentage = scrollTop / scrollHeight;

      if (
        onLoadLatest &&
        isScrollingUp &&
        topScrollPercentage < 1 - threshold
      ) {
        isLoadingRef.current = true;
        try {
          const hasMoreData = await onLoadLatest();
          if (!hasMoreData) {
            isLoadingRef.current = false;
          }
        } catch (error) {
          isLoadingRef.current = false;
          console.error('Failed to load latest data:', error);
        }
      }
    };

    setVisibleRange(calculateVisibleRangeChunked());
    handleInfiniteScroll();
  }, [calculateVisibleRangeChunked, onLoadMore, onLoadLatest, threshold]);

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
