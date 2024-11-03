import { Loader2, LoaderPinwheel } from "lucide-react";

import { FakerTextDataItem } from "@/entities/faker/api/base";
import {
  useDynamicPrependTexts,
  useGetFakerTexts,
} from "@/entities/faker/api/queries";
import { OptimizedList } from "@/features/optimizedListView/ui";
import { ENTRY_TYPE, POSITION } from "@/shared/config/constants";
import { cn } from "@/shared/lib/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/shadcn/card";
import { useCallback, useEffect, useState } from "react";

const PREPEND_BATCH_SIZE = 20;
const LOADING_DELAY = 1000;

const LoadingIndicator = () => (
  <Card className="w-full h-40 max-w-4xl mx-auto mt-8">
    <div className="flex items-center justify-center h-full">
      <LoaderPinwheel size={22} className="animate-spin" />
    </div>
  </Card>
);

type FetchIndicatorProps = {
  position: (typeof POSITION)[keyof typeof POSITION];
  enabled: boolean;
};

const FetchIndicator = ({
  position = POSITION.BOTTOM,
  enabled = false,
}: FetchIndicatorProps) => (
  <div
    className={cn(
      "absolute left-0 right-0 flex justify-center items-center h-[100px] z-50 mx-auto",
      {
        "-top-[56px]": position === POSITION.TOP,
        "-bottom-[36px]": position === POSITION.BOTTOM,
        hidden: !enabled,
      }
    )}
  >
    <Loader2 className="w-5 h-5 text-pink-500 animate-spin" />
  </div>
);

type NewItemsIndicatorProps = {
  latestData: FakerTextDataItem[];
};

const NewItemsIndicator = ({ latestData }: NewItemsIndicatorProps) => {
  return (
    <div className="flex items-center justify-end w-full h-12">
      <p className="text-sm text-gray-500">
        {latestData.length} new items added
      </p>
    </div>
  );
};

export function OptimizedListWidget() {
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

    // delay for loading indicator
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
        <OptimizedList
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
