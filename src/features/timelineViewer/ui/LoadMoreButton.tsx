import { Button } from "@/shared/ui/shadcn/button";

type LoadMoreButtonProps = {
  enabled: boolean;
  fetchNextPage: () => void;
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
};

export function LoadMoreButton({
  enabled = false,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}: LoadMoreButtonProps) {
  if (!enabled) return null;

  return (
    <Button
      onClick={fetchNextPage}
      disabled={!hasNextPage || isFetchingNextPage}
    >
      {isFetchingNextPage
        ? "Loading more..."
        : hasNextPage
        ? "Load More"
        : "Nothing more to load"}
    </Button>
  );
}
