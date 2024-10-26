import { Loader2, LoaderPinwheel } from "lucide-react";

import { FakerTextDataItem } from "@/entities/faker/api/base";
import { useGetFakerTexts } from "@/entities/faker/api/queries";
import { OptimizedList } from "@/features/optimizedListView/ui";
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

const FetchIndicator = () => (
  <div className="absolute -bottom-[38px] left-0 right-0 flex justify-center items-center h-[100px] z-50 mx-auto">
    <Loader2 className="w-5 h-5 text-pink-500 animate-spin" />
  </div>
);

export function OptimizedListWidget() {
  const [page, setPage] = useState(1);
  const [accumData, setAccumData] = useState<FakerTextDataItem[]>([]);

  const { data, isLoading, isFetching } = useGetFakerTexts({
    page,
    quantity: 20,
    characters: 500,
  });

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  useEffect(() => {
    if (data) {
      setAccumData((prev) => {
        const lookup: Record<number, boolean> = {};
        prev.forEach((item) => (lookup[item.order] = true));
        return [...prev, ...data.filter((item) => !lookup[item.order])];
      });
    }
  }, [data]);

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
        <OptimizedList data={accumData} onLoadMore={handleLoadMore} />
        {isFetching && <FetchIndicator />}
      </CardContent>
    </Card>
  );
}
