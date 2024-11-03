import { useCallback, useEffect, useState } from "react";

import {
  useDynamicPrependTexts,
  useGetFakerTexts,
} from "@/entities/faker/api/queries";
import { type FakerTextDataItem } from "@/entities/faker/model/types";
import { VirtualizedList } from "@/features/virtualizedListView/ui";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/shadcn/card";
import {
  ENTRY_TYPE,
  LOADING_DELAY,
  POSITION,
  PREPEND_BATCH_SIZE,
} from "@/widgets/virtualizedListWidget/lib/constants";
import {
  FetchIndicator,
  LoadingIndicator,
  NewItemsIndicator,
} from "@/widgets/virtualizedListWidget/ui/components";

export function VirtualizedListWidget() {
  const [page, setPage] = useState(1);
  const [accumData, setAccumData] = useState<FakerTextDataItem[]>([]);
  const [latestData, setLatestData] = useState<FakerTextDataItem[]>([]);
  const [entryType, setEntryType] = useState<
    (typeof ENTRY_TYPE)[keyof typeof ENTRY_TYPE]
  >(ENTRY_TYPE.APPEND);
  const [isPrependFetching, setIsPrependFetching] = useState(false);

  const {
    data: appendData,
    isLoading,
    isFetching: isAppendFetching,
  } = useGetFakerTexts({
    page,
    quantity: 20,
    characters: 500,
  });
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
    if (appendData) {
      setEntryType(ENTRY_TYPE.APPEND);
      setAccumData((prev) => {
        const lookup: Record<number, boolean> = {};
        prev.forEach((item) => (lookup[item.order] = true));
        return [...prev, ...appendData.filter((item) => !lookup[item.order])];
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
    <Card className="w-full max-w-4xl mx-auto mt-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Optimized List</CardTitle>
      </CardHeader>
      <CardContent className="h-[600px] relative">
        <FetchIndicator position={POSITION.TOP} enabled={isPrependFetching} />
        <VirtualizedList
          data={accumData}
          entryType={entryType}
          onLoadMore={handleLoadMore}
          onLoadLatest={handleLoadLatest}
        />
        <FetchIndicator position={POSITION.BOTTOM} enabled={isAppendFetching} />
      </CardContent>
      <CardFooter>
        <NewItemsIndicator latestData={latestData} />
      </CardFooter>
    </Card>
  );
}
