import { Power, PowerOff } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";

import { Button } from "@/shared/ui/shadcn/button";
import { Label } from "@/shared/ui/shadcn/label";

type RealtimeToggleProps = {
  isRealtimeOn: boolean;
  toggleRealtime: (checked: boolean) => void;
  isLoading: boolean;
};

export function RealtimeToggle({
  isRealtimeOn,
  toggleRealtime,
  isLoading,
}: RealtimeToggleProps) {
  const eventSourceRef = useRef<EventSource | null>(null);

  const connectSSE = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const eventSource = new EventSource("/api/sse");
    eventSourceRef.current = eventSource;

    eventSource.onmessage = (event) => {
      console.log("SSE message:", event.data);
    };
    eventSource.onerror = (error) => {
      console.error("SSE error:", error);
      eventSource.close();
    };
  }, []);

  useEffect(() => {
    if (isRealtimeOn) {
      connectSSE();
    } else if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [isRealtimeOn, connectSSE]);

  return (
    <div className="flex items-center mb-4 space-x-2">
      <Label htmlFor="realtime" className="text-foreground">
        Realtime Updates
      </Label>
      <Button
        variant="outline"
        size="icon"
        onClick={() => toggleRealtime(!isRealtimeOn)}
        disabled={isLoading}
      >
        {isRealtimeOn ? (
          <Power className="w-4 h-4 text-green-500" />
        ) : (
          <PowerOff className="w-4 h-4 text-red-500" />
        )}
      </Button>
    </div>
  );
}
