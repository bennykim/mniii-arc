import { useEffect, useRef } from "react";

import { getISODateString } from "@/shared/lib/utcDate";

interface UseLastReadItemProps {
  scrollAreaRef: React.RefObject<HTMLDivElement>;
  isFetching: boolean;
  setLastReadItemId: (id: string | null) => void;
  setLastReadTime: (time: string | null) => void;
}

export const useLastReadItem = ({
  scrollAreaRef,
  isFetching,
  setLastReadItemId,
  setLastReadTime,
}: UseLastReadItemProps) => {
  const lastItemRef = useRef<IntersectionObserverEntry | null>(null);

  useEffect(() => {
    if (isFetching || !scrollAreaRef.current) return;

    const handleIntersection = (
      entries: IntersectionObserverEntry[],
      observer: IntersectionObserver
    ) => {
      entries.forEach((entry) => {
        if (!lastItemRef.current) {
          lastItemRef.current = entry;
        }

        const entryTimestamp = entry.target.getAttribute(
          "data-timeline-timestamp"
        );
        const lastItemTimestamp = lastItemRef.current.target.getAttribute(
          "data-timeline-timestamp"
        );

        if (
          entry.isIntersecting &&
          entryTimestamp &&
          lastItemTimestamp &&
          entryTimestamp < lastItemTimestamp
        ) {
          const id = entry.target.getAttribute("data-timeline-item-id");
          if (id) {
            setLastReadItemId(id);
            setLastReadTime(getISODateString());
            observer.unobserve(entry.target);
          }
          lastItemRef.current = entry;
        }
      });
    };

    const interObs = new IntersectionObserver(handleIntersection, {
      root: scrollAreaRef.current,
      threshold: 1.0,
    });

    const items = scrollAreaRef.current.querySelectorAll(
      "[data-timeline-item-id]"
    );
    items.forEach((item) => interObs.observe(item));

    return () => {
      interObs.disconnect();
    };
  }, [scrollAreaRef, isFetching, setLastReadItemId, setLastReadTime]);
};
