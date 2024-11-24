import { ChevronUp } from 'lucide-react';
import { useCallback } from 'react';

import { SCROLL_AREA_VIEWPORT_ATTR } from '@/shared/config/constants';
import { Badge } from '@/shared/ui/shadcn/badge';
import { Button } from '@/shared/ui/shadcn/button';

type TimelineScrollToTopProps = {
  scrollAreaRef: React.RefObject<HTMLDivElement>;
  unreadCount: number;
};

export function TimelineScrollToTop({
  scrollAreaRef,
  unreadCount,
}: TimelineScrollToTopProps) {
  const scrollToTop = useCallback(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector(
        `[${SCROLL_AREA_VIEWPORT_ATTR}]`,
      );
      if (viewport) {
        viewport.scrollTo({
          top: 0,
        });
      }
    }
  }, [scrollAreaRef]);

  return (
    <div className="absolute bottom-4 right-4">
      <Button
        className="w-10 h-10 p-2 rounded-full shadow-lg"
        onClick={scrollToTop}
        variant="outline"
        size="icon"
      >
        <ChevronUp className="w-6 h-6" />
      </Button>
      {unreadCount > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-2 -right-2 px-2 min-w-[1rem] h-6 flex items-center justify-center rounded-full"
        >
          {unreadCount > 99 ? '99+' : unreadCount}
        </Badge>
      )}
    </div>
  );
}
