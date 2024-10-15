import { useCallback, useEffect, useRef, useState } from "react";

import { DEFAULT_IDLE_TIME } from "@/shared/config/constants";

export const useIdleTimer = (idleTime = DEFAULT_IDLE_TIME) => {
  const [isIdle, setIsIdle] = useState(false);
  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = useCallback(() => {
    setIsIdle(false);

    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }

    timeoutId.current = setTimeout(() => {
      setIsIdle(true);
    }, idleTime);
  }, [idleTime]);

  useEffect(() => {
    const onActivity = () => {
      resetTimer();
    };

    window.addEventListener("mousemove", onActivity);
    window.addEventListener("keydown", onActivity);
    window.addEventListener("scroll", onActivity);
    window.addEventListener("touchstart", onActivity);

    resetTimer();

    return () => {
      window.removeEventListener("mousemove", onActivity);
      window.removeEventListener("keydown", onActivity);
      window.removeEventListener("scroll", onActivity);
      window.removeEventListener("touchstart", onActivity);

      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
  }, [idleTime, resetTimer, timeoutId]);

  return isIdle;
};
