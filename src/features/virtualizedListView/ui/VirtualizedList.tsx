import { memo } from 'react';

import { type FakerTextDataItem } from '@/entities/faker/model/types';
import { useVirtualization } from '@/features/virtualizedListView/hooks/useVirtualization';
import { VIRTUALIZATION } from '@/features/virtualizedListView/lib/constants';
import { getItemStyle } from '@/features/virtualizedListView/lib/helpers';
import { VirtualizedListItem } from '@/features/virtualizedListView/ui';
import { ScrollArea } from '@/shared/ui/shadcn/scroll-area';
import { ENTRY_TYPE } from '@/widgets/virtualizedListWidget/lib/constants';

type VirtualizedListProps = {
  data: FakerTextDataItem[];
  entryType?: (typeof ENTRY_TYPE)[keyof typeof ENTRY_TYPE];
  hasLatestData?: boolean;
  onLoadMore: () => void;
  onLoadLatest?: () => Promise<boolean>;
};

export const VirtualizedList = memo(function ({
  data,
  entryType = ENTRY_TYPE.APPEND,
  hasLatestData,
  onLoadMore,
  onLoadLatest,
}: VirtualizedListProps) {
  const virtualization = useVirtualization({
    totalItems: data.length,
    itemHeight: VIRTUALIZATION.DEFAULT_ITEM_HEIGHT,
    bufferSize: VIRTUALIZATION.DEFAULT_BUFFER_SIZE,
    entryType,
    hasLatestData,
    onLoadMore,
    onLoadLatest,
  });

  const visibleItems = data.slice(
    virtualization.visibleRange.start,
    virtualization.visibleRange.end,
  );

  return (
    <ScrollArea
      ref={virtualization.containerRef}
      className="relative w-full h-full"
      onScrollCapture={virtualization.handleScroll}
    >
      <ul className="relative" style={{ height: virtualization.totalHeight }}>
        {visibleItems.map((item, index) => {
          const actualIndex = virtualization.visibleRange.start + index;
          return (
            <VirtualizedListItem
              key={item.order}
              order={item.order}
              style={getItemStyle(virtualization.getItemOffset(actualIndex))}
              data={item}
              updateItemHeight={virtualization.updateItemHeight}
              toggleItemExpanded={virtualization.toggleItemExpanded}
              isExpanded={virtualization.isItemExpanded(actualIndex)}
            />
          );
        })}
      </ul>
    </ScrollArea>
  );
});
