import { memo, useCallback, useEffect, useRef } from "react";

import { type FakerTextDataItem } from "@/entities/faker/model/types";
import {
  ItemContent,
  ItemHeader,
} from "@/features/virtualizedListView/ui/components";
import { cn } from "@/shared/lib/utils";
import { Card, CardContent, CardHeader } from "@/shared/ui/shadcn/card";

type VirtualizedListItemProps = {
  order: number;
  className?: string;
  style: React.CSSProperties;
  data: FakerTextDataItem;
  toggleItemExpanded: (index: number) => void;
  updateItemHeight: (index: number, height: number) => void;
  isExpanded: boolean;
  enableAnimation?: boolean;
};

const getContainerClassNames = (
  enableAnimation: boolean,
  isExpanded: boolean,
  className?: string
) =>
  cn(
    "flex flex-col items-center py-1",
    enableAnimation && "transition-all duration-300 ease-in-out",
    className,
    {
      "z-10": isExpanded,
      "opacity-100": isExpanded,
      "opacity-90": !isExpanded,
      "transform-gpu": enableAnimation,
    }
  );

export const VirtualizedListItem = memo(function VirtualizedListItem({
  order,
  className,
  style,
  data,
  updateItemHeight,
  toggleItemExpanded,
  isExpanded,
  enableAnimation = false,
}: VirtualizedListItemProps) {
  const contentRef = useRef<HTMLLIElement>(null);

  const updateHeight = useCallback(() => {
    if (contentRef.current) {
      const newHeight = contentRef.current.scrollHeight;
      updateItemHeight(order, newHeight);
    }
  }, [order, updateItemHeight]);

  const handleClick = useCallback(() => {
    toggleItemExpanded(order);
  }, [order, toggleItemExpanded]);

  useEffect(() => {
    updateHeight();

    const resizeObserver = new ResizeObserver(updateHeight);
    if (contentRef.current) {
      resizeObserver.observe(contentRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [updateHeight, isExpanded]);

  return (
    <li
      ref={contentRef}
      className={getContainerClassNames(enableAnimation, isExpanded, className)}
      style={style}
      onClick={handleClick}
    >
      <article className="my-auto">
        <Card
          className={cn("cursor-pointer", {
            "bg-chart-2": isExpanded,
          })}
        >
          <CardHeader>
            <ItemHeader
              title={data.title}
              author={data.author}
              genre={data.genre}
            />
          </CardHeader>
          <CardContent>
            <ItemContent
              content={data.content}
              isExpanded={isExpanded}
              enableAnimation={enableAnimation}
            />
          </CardContent>
        </Card>
      </article>
    </li>
  );
});
