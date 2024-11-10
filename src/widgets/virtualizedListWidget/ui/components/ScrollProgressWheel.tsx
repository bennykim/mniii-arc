import { scroll } from 'framer-motion/dom';
import { memo, useCallback, useEffect } from 'react';

import { getScrollElement } from '@/features/virtualizedListView/lib/helpers';

const SVG_CONFIG = {
  SIZE: 50,
  VIEWBOX_SIZE: 100,
  CENTER: 50,
  RADIUS: 30,
  STROKE_WIDTH: '30%',
} as const;

interface ScrollProgressWheelProps {
  scrollContainerRef: React.RefObject<HTMLDivElement>;
  backgroundColor?: string;
  progressColor?: string;
}

export const ScrollProgressWheel = memo(function ScrollProgressWheel({
  scrollContainerRef,
  backgroundColor = 'stroke-gray-200',
  progressColor = 'stroke-pink-500',
}: ScrollProgressWheelProps) {
  const updateProgressWheel = useCallback((progress: number) => {
    const progressWheel = document.querySelector(
      '[data-scroll-progress]',
    ) as SVGCircleElement | null;

    if (progressWheel) {
      progressWheel.style.strokeDasharray = `${progress}, 1`;
    }
  }, []);

  useEffect(() => {
    if (!scrollContainerRef.current) return;

    const scrollContainer = getScrollElement(scrollContainerRef);
    if (!scrollContainer) return;

    const cleanup = scroll(updateProgressWheel, {
      source: scrollContainer,
    });

    return () => cleanup();
  }, [scrollContainerRef, updateProgressWheel]);

  const circleProps = {
    cx: SVG_CONFIG.CENTER,
    cy: SVG_CONFIG.CENTER,
    r: SVG_CONFIG.RADIUS,
    pathLength: '1',
    strokeWidth: SVG_CONFIG.STROKE_WIDTH,
    style: { strokeDashoffset: 0 },
  };

  return (
    <svg
      width={SVG_CONFIG.SIZE}
      height={SVG_CONFIG.SIZE}
      viewBox={`0 0 ${SVG_CONFIG.VIEWBOX_SIZE} ${SVG_CONFIG.VIEWBOX_SIZE}`}
      className="absolute top-0 -rotate-90 right-6"
      aria-label="스크롤 진행률"
      role="progressbar"
    >
      <circle {...circleProps} className={`${backgroundColor} fill-none`} />
      <circle
        {...circleProps}
        className={`${progressColor} fill-none`}
        data-scroll-progress
        style={{
          ...circleProps.style,
          strokeDasharray: '0, 1',
        }}
      />
    </svg>
  );
});
