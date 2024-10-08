import { InfiniteData } from "@tanstack/react-query";
import { LoaderPinwheel } from "lucide-react";
import { Fragment, useCallback, useEffect, useRef } from "react";

import { useInfiniteTimeline } from "@/features/timelineViewer/hooks/useInfiniteTimeline";
import {
  LoadMoreTrigger,
  TimelineItem,
  TimelineItemSkeleton,
} from "@/features/timelineViewer/ui";
import { ScrollArea } from "@/shared/ui/shadcn/scroll-area";

export function TimelineList() {
  const { infiniteQuery } = useInfiniteTimeline();
  const loadMoreTriggerRef = useRef<HTMLDivElement>(null);

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

  if (infiniteQuery.isLoading) {
    return <InitialLoadingIndicator />;
  }

  return (
    <ScrollArea className="h-[500px]">
      <TimelineItems data={infiniteQuery.data} />
      {infiniteQuery.hasNextPage ? (
        <>
          <LoadMoreTrigger
            ref={loadMoreTriggerRef}
            hasNextPage={infiniteQuery.hasNextPage}
            isFetchingNextPage={infiniteQuery.isFetchingNextPage}
          />
          {infiniteQuery.isFetchingNextPage && <LoadingMoreIndicator />}
        </>
      ) : (
        <EndOfListIndicator />
      )}
    </ScrollArea>
  );
}

function InitialLoadingIndicator() {
  return (
    <div className="flex items-center justify-center h-full">
      <LoaderPinwheel size={22} className="animate-spin" />
    </div>
  );
}

type TimelinePageData = {
  data: UIHistories;
};

type TimelineItemsProps = {
  data: InfiniteData<TimelinePageData> | undefined;
};

function TimelineItems({ data }: TimelineItemsProps) {
  return (
    <>
      {data?.pages.map((page, pageIndex) => (
        <Fragment key={pageIndex}>
          {page.data.map((item) => (
            <TimelineItem key={item.id} item={item} />
          ))}
        </Fragment>
      ))}
    </>
  );
}

function LoadingMoreIndicator() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <TimelineItemSkeleton key={index} />
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
