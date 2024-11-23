import { useCallback, useEffect, useRef, useState } from 'react';

import {
  useDynamicPrependTexts,
  useGetFakerImages,
  useGetFakerTexts,
} from '@/entities/faker/api/queries';
import { type FakerTextDataItem } from '@/entities/faker/model/types';
import { VirtualizedList } from '@/features/virtualizedListView/ui';
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

  const isEnabledTextData = page > 0 && page % 2 === 1;
  const isEnabledImageData = page > 0 && page % 2 === 0;

  const {
    data: appendTextData,
    isLoading: isTextLoading,
    isFetching: isTextFetching,
  } = useGetFakerTexts(
    {
      page,
      quantity: 20,
      characters: 500,
    },
    {
      enabled: isEnabledTextData,
    },
  );
  const {
    data: appendImageData,
    isLoading: isImageLoading,
    isFetching: isImageFetching,
  } = useGetFakerImages(
    {
      page,
      quantity: 20,
      height: 300,
    },
    {
      enabled: isEnabledImageData,
    },
  );
  const { data: prependData } = useDynamicPrependTexts({
    characters: 400,
  });

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  const handleLoadLatest = useCallback(async () => {
    if (latestData.length === 0) return false;

    setEntryType(ENTRY_TYPE.PREPEND);
    setIsPrependFetching(true);

    // NOTE: Artificial delay added for development purposes
    await new Promise((resolve) => setTimeout(resolve, LOADING_DELAY));

    setAccumData((prev) => {
      const itemsToAdd = latestData.slice(-PREPEND_BATCH_SIZE);
      const remainingLatest = latestData.slice(0, -PREPEND_BATCH_SIZE);
      setLatestData(remainingLatest);

      const offsetOrder = itemsToAdd.length;
      const adjustedPrev = prev.map((item) => ({
        ...item,
        order: item.order + offsetOrder,
      }));
      return [...itemsToAdd, ...adjustedPrev];
    });

    setIsPrependFetching(false);

    return latestData.length > 0;
  }, [latestData]);

  useEffect(() => {
    if (prependData) {
      setLatestData((prev) => {
        const shiftedPrev = prev.map((item) => ({
          ...item,
          order: item.order + prependData.length,
        }));
        return [...prependData, ...shiftedPrev];
      });
    }
  }, [prependData]);

  useEffect(() => {
    const newData = page % 2 === 1 ? appendTextData : appendImageData;

    if (newData) {
      setEntryType(ENTRY_TYPE.APPEND);
      setAccumData((prev) => {
        const lookup: Record<number, boolean> = {};
        prev.forEach((item) => (lookup[item.order] = true));
        return [...prev, ...newData.filter((item) => !lookup[item.order])];
      });
    }
  }, [appendTextData, appendImageData, page]);

  const isLoading = isTextLoading || isImageLoading;
  const isFetching = isTextFetching || isImageFetching;

  if (isLoading && accumData.length === 0) {
    return <LoadingIndicator />;
  }

  if (accumData.length === 0) {
    return null;
  }

  return (
    <Card className="w-full max-w-4xl mx-auto mt-8 glass">
      <CardHeader className="relative flex flex-row items-center justify-between">
        <CardTitle>Optimized List</CardTitle>
        <ScrollProgressWheel scrollContainerRef={cardContentRef} />
      </CardHeader>
      <CardContent className="h-[600px] relative" ref={cardContentRef}>
        <FetchIndicator position={POSITION.TOP} enabled={isPrependFetching} />
        <VirtualizedList
          data={accumData}
          entryType={entryType}
          hasLatestData={latestData.length > 0}
          onLoadMore={handleLoadMore}
          onLoadLatest={handleLoadLatest}
        />
        <FetchIndicator position={POSITION.BOTTOM} enabled={isFetching} />
      </CardContent>
      <CardFooter>
        <NewItemsIndicator latestData={latestData} />
      </CardFooter>
    </Card>
  );
}
