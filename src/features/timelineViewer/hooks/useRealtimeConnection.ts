import { useCallback, useEffect, useRef, useState } from "react";

import { apiService } from "@/entities/history/api/base";

type UseRealtimeConnectionProps = {
  isEnabled: boolean;
  onMessage?: (event: MessageEvent) => void;
  onError?: (event: Event) => void;
};

export const useRealtimeConnection = ({
  isEnabled,
  onMessage,
  onError,
}: UseRealtimeConnectionProps) => {
  const realtimeConnectionRef = useRef<{ close: () => void } | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const connectRealtime = useCallback(() => {
    if (realtimeConnectionRef.current) {
      realtimeConnectionRef.current.close();
    }

    const { eventSource, close } = apiService.createRealtimeConnection({
      onMessage: (event) => {
        onMessage?.(event);
      },
      onError: (error) => {
        onError?.(error);
        if (realtimeConnectionRef.current) {
          realtimeConnectionRef.current.close();
          realtimeConnectionRef.current = null;
        }
      },
    });

    eventSource.onopen = () => {
      setIsConnected(true);
    };

    realtimeConnectionRef.current = { close };
  }, [onMessage, onError]);

  useEffect(() => {
    if (isEnabled) {
      connectRealtime();
      setIsConnected(true);
    } else {
      if (realtimeConnectionRef.current) {
        realtimeConnectionRef.current.close();
        realtimeConnectionRef.current = null;
      }
      setIsConnected(false);
    }

    return () => {
      if (realtimeConnectionRef.current) {
        realtimeConnectionRef.current.close();
      }
      setIsConnected(false);
    };
  }, [isEnabled, connectRealtime]);

  return { isConnected };
};
