import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { getTimestamp } from "@/shared/lib/utcDate";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getElapsedTime(isoString: string): string {
  const elapsedMinutes = Math.floor(
    (getTimestamp() - getTimestamp(isoString)) / 60000
  );

  if (elapsedMinutes < 1) return "Just now";
  if (elapsedMinutes >= 10080) return "Long ago";

  const timeUnits = [
    { unit: "minute", threshold: 60, divisor: 1 },
    { unit: "hour", threshold: 1440, divisor: 60 },
    { unit: "day", threshold: 10080, divisor: 1440 },
  ];

  for (const { unit, threshold, divisor } of timeUnits) {
    if (elapsedMinutes < threshold) {
      const value = Math.floor(elapsedMinutes / divisor);
      return `${value} ${unit}${value !== 1 ? "s" : ""} ago`;
    }
  }

  return "Long ago";
}
