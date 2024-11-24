import { useCallback, useEffect, useRef, useState } from 'react';

import { useDataFetching } from '../hooks/useDataFetching';
import { ScrollControls } from './components/ScrollControls';

import { useDynamicPrependTexts } from '@/entities/faker/api/queries';
import { type FakerTextDataItem } from '@/entities/faker/model/types';
import { Virtualized } from '@/features/virtualizedListView/ui';
import { VirtualizationControls } from '@/features/virtualizedListView/ui/VirtualizedList';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/ui/shadcn/card';
import {
  ENTRY_TYPE,
  LOADING_DELAY,
  POSITION,
  PREPEND_BATCH_SIZE,
} from '@/widgets/virtualizedListWidget/lib/constants';
import {
  FetchIndicator,
  LoadingIndicator,
  NewItemsIndicator,
  ScrollProgressWheel,
} from '@/widgets/virtualizedListWidget/ui/components';

export function VirtualizedListWidget() {
  const cardContentRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const [accumData, setAccumData] = useState<FakerTextDataItem[]>([]);
  const [latestData, setLatestData] = useState<FakerTextDataItem[]>([]);
  const [entryType, setEntryType] = useState<
    (typeof ENTRY_TYPE)[keyof typeof ENTRY_TYPE]
  >(ENTRY_TYPE.APPEND);
  const [isPrependFetching, setIsPrependFetching] = useState(false);
  const [virtualizationControls, setVirtualizationControls] =
    useState<VirtualizationControls | null>(null);

  const { appendData, isLoading, isFetching } = useDataFetching({ page });
  const { data: prependData } = useDynamicPrependTexts({
    characters: 400,
  });

  const handleVirtualizationReady = useCallback(
    (controls: VirtualizationControls) => {
      setVirtualizationControls(controls);
    },
    [],
  );

  const handleLoadMore = useCallback(() => {
    setPage((prev) => prev + 1);
  }, []);

  const handleLoadLatest = useCallback(async () => {
    if (latestData.length === 0 || isPrependFetching) {
      return false;
    }

    try {
      setEntryType(ENTRY_TYPE.PREPEND);
      setIsPrependFetching(true);

      await new Promise((resolve) => setTimeout(resolve, LOADING_DELAY));

      const itemsToAdd = latestData.slice(-PREPEND_BATCH_SIZE);
      const remainingLatest = latestData.slice(0, -PREPEND_BATCH_SIZE);
      const offsetOrder = itemsToAdd.length;

      setLatestData(remainingLatest);
      setAccumData((prev) => {
        const adjustedPrev = prev.map((item) => ({
          ...item,
          order: item.order + offsetOrder,
        }));
        return [...itemsToAdd, ...adjustedPrev];
      });

      return true;
    } catch (error) {
      console.error('Error in handleLoadLatest:', error);
      return false;
    } finally {
      setIsPrependFetching(false);
    }
  }, [latestData, isPrependFetching]);

  useEffect(() => {
    if (prependData) {
      setLatestData((prev) => [
        ...prependData,
        ...prev.map((item) => ({
          ...item,
          order: item.order + prependData.length,
        })),
      ]);
    }
  }, [prependData]);

  useEffect(() => {
    if (appendData) {
      setEntryType(ENTRY_TYPE.APPEND);
      setAccumData((prev) => {
        const lookup = new Set(prev.map((item) => item.order));
        return [
          ...prev,
          ...appendData.filter((item) => !lookup.has(item.order)),
        ];
      });
    }
  }, [appendData]);

  if (isLoading && accumData.length === 0) {
    return <LoadingIndicator />;
  }

  if (accumData.length === 0) {
    return null;
  }

  return (
    <Card className="w-full max-w-4xl mx-auto mt-8 glass">
      <CardHeader className="relative flex flex-row items-center justify-between">
        <CardTitle>Virtualized List</CardTitle>
        <ScrollProgressWheel scrollContainerRef={cardContentRef} />
      </CardHeader>
      <CardContent className="h-[600px] relative" ref={cardContentRef}>
        <FetchIndicator position={POSITION.TOP} enabled={isPrependFetching} />
        <Virtualized.List
          data={accumData}
          entryType={entryType}
          hasLatestData={latestData.length > 0}
          onLoadMore={handleLoadMore}
          onLoadLatest={handleLoadLatest}
          onVirtualizationReady={handleVirtualizationReady}
        >
          {({
            order,
            style,
            data,
            updateItemHeight,
            toggleItemExpanded,
            isExpanded,
          }) => (
            <Virtualized.Item
              key={order}
              order={order}
              style={style}
              data={data}
              updateItemHeight={updateItemHeight}
              toggleItemExpanded={toggleItemExpanded}
              isExpanded={isExpanded}
            />
          )}
        </Virtualized.List>
        <FetchIndicator position={POSITION.BOTTOM} enabled={isFetching} />
      </CardContent>
      <CardFooter className="justify-end">
        <ScrollControls controls={virtualizationControls}>
          <NewItemsIndicator latestData={latestData} />
        </ScrollControls>
      </CardFooter>
    </Card>
  );
}
