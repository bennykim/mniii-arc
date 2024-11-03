import { memo, useCallback, useEffect, useRef } from "react";

import { type FakerTextDataItem } from "@/entities/faker/api/base";
import { cn } from "@/shared/lib/utils";
import { Card, CardContent, CardHeader } from "@/shared/ui/shadcn/card";

const ANIMATION_DURATION = 300;
const MAX_EXPANDED_HEIGHT = 1000;

type OptimizedListItemProps = {
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

const getContentClassNames = (enableAnimation: boolean, isExpanded: boolean) =>
  cn(
    "mt-2 overflow-hidden",
    enableAnimation &&
      `transition-all duration-${ANIMATION_DURATION} ease-in-out`,
    {
      "max-h-0 opacity-0": !isExpanded,
      [`max-h-[${MAX_EXPANDED_HEIGHT}px] opacity-100`]: isExpanded,
    }
  );

export const OptimizedListItem = memo(function OptimizedListItem({
  order,
  className,
  style,
  data,
  updateItemHeight,
  toggleItemExpanded,
  isExpanded,
  enableAnimation = false,
}: OptimizedListItemProps) {
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

const ItemHeader = memo(function ItemHeader({
  title,
  author,
  genre,
}: {
  title: string;
  author: string;
  genre: string;
}) {
  return (
    <header className="space-y-2">
      <h3 className="text-xl font-semibold">{title}</h3>
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <address className="not-italic">
          <span className="font-medium">By: </span>
          {author}
        </address>
        <span aria-hidden="true">•</span>
        <span>
          <span className="font-medium">Genre: </span>
          {genre}
        </span>
      </div>
    </header>
  );
});

const ItemContent = memo(function ItemContent({
  content,
  isExpanded,
  enableAnimation,
}: {
  content: string;
  isExpanded: boolean;
  enableAnimation: boolean;
}) {
  return (
    <div className={getContentClassNames(enableAnimation, isExpanded)}>
      <p className="leading-relaxed prose text-gray-700">{content}</p>
    </div>
  );
});

export default OptimizedListItem;
