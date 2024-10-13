import { InfiniteData } from "@tanstack/react-query";
import { LoaderPinwheel } from "lucide-react";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";

import { useHistoryStore } from "@/entities/history/store";
import { useInfiniteTimeline } from "@/features/timelineViewer/hooks/useInfiniteTimeline";
import { Timeline } from "@/features/timelineViewer/ui";
import { ScrollArea } from "@/shared/ui/shadcn/scroll-area";

export function TimelineListContainer() {
  const { infiniteQuery } = useInfiniteTimeline();
  const realtimeData = useHistoryStore((state) => state.realtimeHistory);
  const loadMoreTriggerRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [unreadCount] = useState(1);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (
        entry.isIntersecting &&
        infiniteQuery.hasNextPage &&
        !infiniteQuery.isFetchingNextPage
      ) {
        infiniteQuery.fetchNextPage();
      }
    },
    [infiniteQuery]
  );

  useEffect(() => {
    const currentTriggerElement = loadMoreTriggerRef.current;
    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    });

    if (currentTriggerElement) {
      observer.observe(currentTriggerElement);
    }

    return () => {
      if (currentTriggerElement) {
        observer.unobserve(currentTriggerElement);
      }
    };
  }, [handleIntersection]);

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
    <>
      {data
        .map((item) => <Timeline.Item.Content key={item.id} item={item} />)
        .reverse()}
    </>
  );
}

type InfiniteItemsProps = {
  data: InfiniteData<TimelinePageData> | undefined;
};

function InfiniteItems({ data }: InfiniteItemsProps) {
  const readState = useHistoryStore((state) => state.readState);

  return (
    <>
      {data?.pages.map((page, pageIndex) => (
        <Fragment key={pageIndex}>
          {page.data.map((item) => (
            <Timeline.Item.Content
              key={item.id}
              item={{ ...item, isRead: readState[item.id] || false }}
            />
          ))}
        </Fragment>
      ))}
    </>
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
      {Array.from({ length: 3 }).map((_, index) => (
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
