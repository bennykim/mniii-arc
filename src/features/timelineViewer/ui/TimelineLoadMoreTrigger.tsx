import { forwardRef } from 'react';

type TimelineLoadMoreTriggerProps = {
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
};

export const TimelineLoadMoreTrigger = forwardRef<
  HTMLDivElement,
  TimelineLoadMoreTriggerProps
>(({ hasNextPage, isFetchingNextPage }, ref) => {
  if (!hasNextPage && !isFetchingNextPage) return null;

  return <div ref={ref} className="h-10" />;
});
TimelineLoadMoreTrigger.displayName = 'LoadMoreTrigger';
