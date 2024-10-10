import { useMemo, useState } from "react";

import { SORT_DIRECTION } from "@/shared/config/constants";
import { getTimestamp } from "@/shared/lib/utcDate";

type DefaultSortItem = { createdAt: string };

type useSortedDataProps<T> = {
  initialData: T[] | undefined;
  initialDirection?: (typeof SORT_DIRECTION)[keyof typeof SORT_DIRECTION];
};

export const useSortedData = <T extends DefaultSortItem>({
  initialData,
  initialDirection = SORT_DIRECTION.ASC,
}: useSortedDataProps<T>) => {
  const [sortDirection, setSortDirection] = useState(initialDirection);

  const sortedData = useMemo(() => {
    const sortByCreatedAt = (a: T, b: T) => {
      const aTime = getTimestamp(a.createdAt);
      const bTime = getTimestamp(b.createdAt);
      return sortDirection === SORT_DIRECTION.ASC
        ? aTime - bTime
        : bTime - aTime;
    };

    if (!initialData) return [];

    return [...initialData].sort(sortByCreatedAt);
  }, [initialData, sortDirection]);

  return {
    sortedData,
    sortDirection,
    setSortDirection,
  };
};
