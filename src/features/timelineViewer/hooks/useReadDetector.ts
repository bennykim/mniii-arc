import { useEffect, useRef } from "react";

import { useHistoryStore } from "@/entities/history/store";

export const useReadDetector = (id: string) => {
  const ref = useRef<HTMLDivElement>(null);
  const setHistoryRead = useHistoryStore((state) => state.setHistoryRead);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHistoryRead(id);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.5 }
    );

    const currentRef = ref.current;

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [id, setHistoryRead]);

  return ref;
};
