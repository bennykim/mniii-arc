import { useCallback, useEffect, useRef } from "react";

type IntersectionCallback = () => void;

export const useIntersectionTrigger = (
  callback: IntersectionCallback,
  options?: IntersectionObserverInit
) => {
  const triggerRef = useRef<HTMLDivElement>(null);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        callback();
      }
    },
    [callback]
  );

  useEffect(() => {
    const currentTriggerElement = triggerRef.current;
    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
      ...options,
    });

    if (currentTriggerElement) {
      observer.observe(currentTriggerElement);
    }

    return () => {
      if (currentTriggerElement) {
        observer.unobserve(currentTriggerElement);
      }
    };
  }, [handleIntersection, options]);

  return triggerRef;
};
