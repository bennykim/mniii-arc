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
  CardHeader,
  CardTitle,
} from "@/shared/ui/shadcn/card";
import { useEffect, useState } from "react";

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

export function OptimizedListWidget() {
  const [page, setPage] = useState(1);
  const [accumData, setAccumData] = useState<FakerTextDataItem[]>([]);
  const [entryType, setEntryType] = useState<
    (typeof ENTRY_TYPE)[keyof typeof ENTRY_TYPE]
  >(ENTRY_TYPE.APPEND);

  const {
    data: appendData,
    isLoading,
    isFetching: isAppendFetching,
  } = useGetFakerTexts({
    page,
    quantity: 20,
    characters: 500,
  });
  const { data: prependData, isFetching: isPrependFetching } =
    useDynamicPrependTexts({
      characters: 500,
    });

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  useEffect(() => {
    if (prependData) {
      setEntryType(ENTRY_TYPE.PREPEND);
      setAccumData((prev) => {
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
          onLoadMore={handleLoadMore}
          entryType={entryType}
        />
        <FetchIndicator position={POSITION.BOTTOM} enabled={isAppendFetching} />
      </CardContent>
    </Card>
  );
}
