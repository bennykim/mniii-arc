import { useEffect, useRef } from "react";

import { cn } from "@/shared/lib/utils";

type OptimizedListItemProps = {
  index: number;
  className?: string;
  style: React.CSSProperties;
  toggleItemExpanded: (index: number) => void;
  updateItemHeight: (index: number, height: number) => void;
  isExpanded: boolean;
};

export function OptimizedListItem({
  index,
  className,
  style,
  updateItemHeight,
  toggleItemExpanded,
  isExpanded,
}: OptimizedListItemProps) {
  const contentRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const updateHeight = () => {
      if (contentRef.current) {
        const newHeight = contentRef.current.scrollHeight;
        updateItemHeight(index, newHeight);
      }
    };

    updateHeight();

    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, [index, updateItemHeight, isExpanded]);

  return (
    <li
      ref={contentRef}
      className={cn(
        "flex items-center justify-center cursor-pointer h-[200px] bg-gray-100",
        className,
        {
          "h-[300px] bg-lime-100": isExpanded,
        }
      )}
      style={style}
      onClick={() => toggleItemExpanded(index)}
    >
      Index: {index}
    </li>
  );
}
