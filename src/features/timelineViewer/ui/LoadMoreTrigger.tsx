import { forwardRef } from "react";

type LoadMoreTriggerProps = {
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
};

export const LoadMoreTrigger = forwardRef<HTMLDivElement, LoadMoreTriggerProps>(
  ({ hasNextPage, isFetchingNextPage }, ref) => {
    if (!hasNextPage && !isFetchingNextPage) return null;
    return <div ref={ref} className="h-10" />;
  }
);
LoadMoreTrigger.displayName = "LoadMoreTrigger";
