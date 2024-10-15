import { InfiniteData } from "@tanstack/react-query";
import { LoaderPinwheel } from "lucide-react";
import { Fragment, useRef, useState } from "react";

import { useHistoryStore } from "@/entities/history/store";
import {
  useInfiniteTimeline,
  useIntersectionTrigger,
  useLastReadItem,
} from "@/features/timelineViewer/hooks";
import { Timeline } from "@/features/timelineViewer/ui";
import { DEFAULT_LIMIT } from "@/shared/config/constants";
import { getElapsedTime } from "@/shared/lib/utils";
import { ScrollArea } from "@/shared/ui/shadcn/scroll-area";

export function TimelineListContainer() {
  const {
    realtimeHistory: realtimeData,
    setLastReadItemId,
    setLastReadTime,
  } = useHistoryStore();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [unreadCount] = useState(1);
  const { infiniteQuery } = useInfiniteTimeline();
  const loadMoreTriggerRef = useIntersectionTrigger(() => {
    if (infiniteQuery.hasNextPage && !infiniteQuery.isFetchingNextPage) {
      infiniteQuery.fetchNextPage();
    }
  });
  useLastReadItem({
    scrollAreaRef,
    isFetching: infiniteQuery.isFetching,
    setLastReadItemId,
    setLastReadTime,
  });

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;
    setShowScrollToTop(target.scrollTop > 300);
  };

  if (infiniteQuery.isLoading) {
    return <InitialLoadingIndicator />;
  }

  return (
    <ScrollArea
      className="h-[500px] relative"
      ref={scrollAreaRef}
      onScrollCapture={handleScroll}
    >
      <RealtimeItems data={realtimeData} />
      <InfiniteItems data={infiniteQuery.data} />
      {infiniteQuery.hasNextPage ? (
        <>
          <Timeline.Controls.LoadMoreTrigger
            ref={loadMoreTriggerRef}
            hasNextPage={infiniteQuery.hasNextPage}
            isFetchingNextPage={infiniteQuery.isFetchingNextPage}
          />
          {infiniteQuery.isFetchingNextPage && <LoadingMoreIndicator />}
        </>
      ) : (
        <EndOfListIndicator />
      )}
      {showScrollToTop && (
        <Timeline.Controls.ScrollToTop
          scrollAreaRef={scrollAreaRef}
          unreadCount={unreadCount}
        />
      )}
    </ScrollArea>
  );
}

type TimelinePageData = {
  data: UIHistories;
};

function RealtimeItems({ data }: TimelinePageData) {
  return (
    <div className="flex flex-col gap-6 mb-6">
      {data
        .map((item) => <Timeline.Item.Content key={item.id} item={item} />)
        .reverse()}
    </div>
  );
}

type InfiniteItemsProps = {
  data: InfiniteData<TimelinePageData> | undefined;
};

function InfiniteItems({ data }: InfiniteItemsProps) {
  const { readState, lastReadItemId, lastReadTime } = useHistoryStore();
  const elapsedTime = lastReadTime ? getElapsedTime(lastReadTime) : null;

  return (
    <div className="flex flex-col gap-6">
      {data?.pages.map((page, pageIndex) => (
        <Fragment key={pageIndex}>
          {page.data.map((item) => (
            <Fragment key={item.id}>
              <Timeline.Item.Content
                key={item.id}
                item={{ ...item, isRead: readState[item.id] || false }}
              />
              {item.id === lastReadItemId && elapsedTime && (
                <div className="relative flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative px-4 text-xs text-center text-gray-500 bg-white">
                    Read up to here {elapsedTime}
                  </div>
                </div>
              )}
            </Fragment>
          ))}
        </Fragment>
      ))}
    </div>
  );
}

function InitialLoadingIndicator() {
  return (
    <div className="flex items-center justify-center h-full">
      <LoaderPinwheel size={22} className="animate-spin" />
    </div>
  );
}

function LoadingMoreIndicator() {
  return (
    <div className="space-y-4">
      {Array.from({ length: DEFAULT_LIMIT }).map((_, index) => (
        <Timeline.Item.Skeleton key={index} />
      ))}
    </div>
  );
}

function EndOfListIndicator() {
  return (
    <div className="py-8 text-center text-gray-500">
      <p>Nothing more to load</p>
    </div>
  );
}
