import React, { useState } from "react";

type OptimizedListItemProps = {
  index: number;
  style: React.CSSProperties;
};

export function OptimizedListItem({ index, style }: OptimizedListItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getBackgroundColor = () => {
    if (isExpanded) return "lightgreen";
    return index % 2 === 0 ? "mistyrose" : "lightblue";
  };

  return (
    <div
      className="flex items-center justify-center transition-all duration-300 ease-in-out border-b border-black cursor-pointer"
      style={{
        ...style,
        height: isExpanded ? "300px" : "200px",
        backgroundColor: getBackgroundColor(),
      }}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      Index: {index}
    </div>
  );
}
