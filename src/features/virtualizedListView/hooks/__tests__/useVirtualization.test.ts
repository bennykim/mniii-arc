import { act, renderHook } from '@testing-library/react';

import {
  useVirtualization,
  type UseVirtualizationProps,
} from '@/features/virtualizedListView/hooks/useVirtualization';
import { VIRTUALIZATION } from '@/features/virtualizedListView/lib/constants';
import { getScrollElement } from '@/features/virtualizedListView/lib/helpers';
import { ENTRY_TYPE } from '@/widgets/virtualizedListWidget/lib/constants';

jest.mock('../../lib/helpers', () => {
  const originalModule = jest.requireActual('../../lib/helpers');
  return {
    ...originalModule,
    getScrollElement: jest.fn(),
  };
});

describe('useVirtualization', () => {
  const mockProps: UseVirtualizationProps = {
    totalItems: 100,
    itemHeight: 50,
    bufferSize: 5,
    threshold: 0.8,
  };

  const mockScroll = {
    scrollTop: 0,
    clientHeight: 500,
    scrollHeight: 5000,
    dataset: {},
  };

  beforeEach(() => {
    jest.clearAllMocks();
    global.ResizeObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));
    Element.prototype.getBoundingClientRect = jest.fn(
      () => new DOMRect(0, 0, 0, 0),
    );
    (getScrollElement as jest.Mock).mockReset();
  });

  describe('initialization', () => {
    it('sets default values correctly', () => {
      const { result } = renderHook(() => useVirtualization(mockProps));

      expect(result.current.visibleRange).toEqual(VIRTUALIZATION.INITIAL_RANGE);
      expect(result.current.totalHeight).toBe(
        mockProps.totalItems * mockProps.itemHeight,
      );
      expect(result.current.itemHeights).toHaveLength(mockProps.totalItems);
      expect(
        result.current.itemHeights.every((h) => h === mockProps.itemHeight),
      ).toBe(true);
      expect(result.current.expandedItems).toHaveLength(mockProps.totalItems);
      expect(result.current.expandedItems.every((e) => e === false)).toBe(true);
    });
  });

  describe('item operations', () => {
    it('manages item heights and expansion states', () => {
      const { result } = renderHook(() => useVirtualization(mockProps));

      act(() => {
        result.current.updateItemHeight(5, 100);
        result.current.toggleItemExpanded(3);
      });

      expect(result.current.itemHeights[5]).toBe(100);
      expect(result.current.isItemExpanded(3)).toBe(true);

      act(() => result.current.toggleItemExpanded(3));
      expect(result.current.isItemExpanded(3)).toBe(false);
    });

    it('calculates offsets correctly with varying heights', () => {
      const { result } = renderHook(() => useVirtualization(mockProps));

      act(() => {
        result.current.updateItemHeight(0, 100);
        result.current.updateItemHeight(1, 150);
      });

      expect(result.current.getItemOffset(0)).toBe(0);
      expect(result.current.getItemOffset(1)).toBe(100);
      expect(result.current.getItemOffset(2)).toBe(250);
    });
  });

  describe('scroll handling', () => {
    const setupScrollTest = (
      scrollTop: number,
      onLoadMore = jest.fn(),
      onLoadLatest = jest.fn(),
    ) => {
      (getScrollElement as jest.Mock).mockReturnValue({
        ...mockScroll,
        scrollTop,
        dataset: { lastScrollTop: String(scrollTop > 0 ? scrollTop - 100 : 0) },
      });

      return renderHook(() =>
        useVirtualization({
          ...mockProps,
          onLoadMore,
          onLoadLatest,
          hasLatestData: true,
        }),
      );
    };

    it('triggers load more near bottom', () => {
      const onLoadMore = jest.fn();
      const { result } = setupScrollTest(4000, onLoadMore);

      act(() => result.current.handleScroll());
      expect(onLoadMore).toHaveBeenCalled();
    });

    it('triggers load latest near top', async () => {
      const onLoadLatest = jest.fn().mockResolvedValue(true);
      const { result } = setupScrollTest(0, jest.fn(), onLoadLatest);

      await act(async () => result.current.handleScroll());
      expect(onLoadLatest).toHaveBeenCalled();
    });

    it('handles load failures gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const onLoadLatest = jest
        .fn()
        .mockRejectedValue(new Error('Load failed'));
      const { result } = setupScrollTest(0, jest.fn(), onLoadLatest);

      await act(async () => result.current.handleScroll());

      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to load latest data:',
        expect.any(Error),
      );
      consoleSpy.mockRestore();
    });
  });

  describe('data updates', () => {
    const mockData = Array.from({ length: 15 }, (_, i) => ({
      id: String(i),
      order: i,
      author: '',
      title: '',
      content: '',
    }));

    it('handles append and prepend updates', async () => {
      const { result: appendResult, rerender: appendRerender } = renderHook(
        ({ data }) =>
          useVirtualization({
            totalItems: data.length,
            itemHeight: 50,
            entryType: ENTRY_TYPE.APPEND,
          }),
        { initialProps: { data: mockData.slice(0, 10) } },
      );

      await act(async () => appendRerender({ data: mockData }));
      expect(appendResult.current.itemHeights).toHaveLength(15);

      (getScrollElement as jest.Mock).mockReturnValue({
        ...mockScroll,
        scrollTop: 100,
      });

      const { result: prependResult, rerender: prependRerender } = renderHook(
        ({ data }) =>
          useVirtualization({
            totalItems: data.length,
            itemHeight: 50,
            entryType: ENTRY_TYPE.PREPEND,
          }),
        { initialProps: { data: mockData.slice(5) } },
      );

      await act(async () => prependRerender({ data: mockData }));
      expect(prependResult.current.itemHeights).toHaveLength(15);
    });
  });

  describe('edge cases', () => {
    it('handles zero items and missing scroll element', () => {
      const { result } = renderHook(() =>
        useVirtualization({ ...mockProps, totalItems: 0 }),
      );

      expect(result.current.totalHeight).toBe(0);
      expect(result.current.itemHeights).toHaveLength(0);
      expect(result.current.expandedItems).toHaveLength(0);

      (getScrollElement as jest.Mock).mockReturnValue(null);
      act(() => result.current.handleScroll());
      expect(result.current.visibleRange).toEqual(VIRTUALIZATION.INITIAL_RANGE);
    });
  });
});
