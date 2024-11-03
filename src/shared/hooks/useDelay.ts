import { useEffect, useState } from "react";

export const useDelay = (delayMs: number) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, delayMs);

    return () => clearTimeout(timer);
  }, [delayMs]);

  return isReady;
};
