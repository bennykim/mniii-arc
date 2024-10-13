import { TimelineItem } from "./TimelineItem";
import { TimelineItemSkeleton } from "./TimelineItemSkeleton";
import { TimelineListContainer } from "./TimelineListContainer";
import { TimelineLoadMoreTrigger } from "./TimelineLoadMoreTrigger";
import { TimelineRealtimeToggle } from "./TimelineRealtimeToggle";
import { TimelineScrollToTop } from "./TimelineScrollToTop";

export const Timeline = {
  List: {
    Container: TimelineListContainer,
  },
  Item: {
    Content: TimelineItem,
    Skeleton: TimelineItemSkeleton,
  },
  Controls: {
    LoadMoreTrigger: TimelineLoadMoreTrigger,
    RealtimeToggle: TimelineRealtimeToggle,
    ScrollToTop: TimelineScrollToTop,
  },
};
