import { VIRTUALIZATION } from "@/features/virtualizedListView/lib/constants";
import { SCROLL_AREA_VIEWPORT_ATTR } from "@/shared/config/constants";

export const getScrollElement = (
  containerRef: React.RefObject<HTMLDivElement>
): HTMLElement | null =>
  containerRef.current?.querySelector(
    `[${SCROLL_AREA_VIEWPORT_ATTR}]`
  ) as HTMLElement | null;

export const createArrayWithValue = <T>(length: number, value: T): T[] =>
  new Array(length).fill(value);

export const getItemStyle = (
  offset: number,
  defaultHeight: number = VIRTUALIZATION.DEFAULT_ITEM_HEIGHT
) => ({
  position: "absolute" as const,
  left: 0,
  right: 0,
  top: offset,
  minHeight: `${defaultHeight}px`,
});
