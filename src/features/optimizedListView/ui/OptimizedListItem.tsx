import { useEffect, useRef } from "react";

import { type FakerTextDataItem } from "@/entities/faker/api/base";
import { cn } from "@/shared/lib/utils";
import { Card, CardContent, CardHeader } from "@/shared/ui/shadcn/card";

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

export function OptimizedListItem({
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

  useEffect(() => {
    const updateHeight = () => {
      if (contentRef.current) {
        const newHeight = contentRef.current.scrollHeight;
        updateItemHeight(order, newHeight);
      }
    };

    updateHeight();

    const resizeObserver = new ResizeObserver(updateHeight);
    if (contentRef.current) {
      resizeObserver.observe(contentRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [order, updateItemHeight, isExpanded]);

  return (
    <li
      ref={contentRef}
      className={cn(
        `flex flex-col p-1`,
        enableAnimation && "transition-all duration-300 ease-in-out",
        className,
        {
          "z-10": isExpanded,
          "opacity-100": isExpanded,
          "opacity-90": !isExpanded,
          "transform-gpu": enableAnimation,
        }
      )}
      style={style}
      onClick={() => toggleItemExpanded(order)}
    >
      <article className="p-2">
        <Card
          className={cn("cursor-pointer", {
            "bg-chart-2": isExpanded,
          })}
        >
          <CardHeader>
            <header className="space-y-2">
              <h3 className="text-xl font-semibold">
                {order}. {data.title}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <address className="not-italic">
                  <span className="font-medium">By: </span>
                  {data.author}
                </address>
                <span aria-hidden="true">•</span>
                <span>
                  <span className="font-medium">Genre: </span>
                  {data.genre}
                </span>
              </div>
            </header>
          </CardHeader>
          <CardContent>
            <div
              className={cn(
                "mt-2 overflow-hidden",
                enableAnimation && "transition-all duration-300 ease-in-out",
                {
                  "max-h-0 opacity-0": !isExpanded,
                  "max-h-[1000px] opacity-100": isExpanded,
                }
              )}
            >
              <p className="leading-relaxed prose text-gray-700">
                {data.content}
              </p>
            </div>
          </CardContent>
        </Card>
      </article>
    </li>
  );
}
