import { Fragment } from "react";

import { ScrollArea } from "@/shared/ui/shadcn/scroll-area";

import { LoaderPinwheel } from "lucide-react";
import { useInfiniteTimeline } from "../hooks/useInfiniteTimeline";
import { TimelineItem } from "./TimelineItem";
import { TimelineItemSkeleton } from "./TimelineItemSkeleton";

const DEFAULTLIMIT = 20;

export function TimelineList() {
  const { infiniteQuery } = useInfiniteTimeline();

  const renderContent = () => {
    if (infiniteQuery.isLoading) {
      return (
        <div className="flex items-center justify-center h-full">
          <LoaderPinwheel size={22} className="animate-spin" />
        </div>
      );
    }

    return infiniteQuery.data?.pages.map((page, pageIndex) => (
      <Fragment key={pageIndex}>
        {page.data.map((item) => (
          <TimelineItem key={item.id} item={item} />
        ))}
      </Fragment>
    ));
  };

  const renderUpdatedContent = () => {
    return null;
  };

  const loadMore = () => {
    if (infiniteQuery.isFetchingNextPage) {
      return Array.from({ length: DEFAULTLIMIT }).map((_, index) => (
        <TimelineItemSkeleton key={index} />
      ));
    }

    return null;
  };

  return (
    <ScrollArea className="h-[500px]">
      {renderUpdatedContent()}
      {renderContent()}
      {loadMore()}
    </ScrollArea>
  );
}
