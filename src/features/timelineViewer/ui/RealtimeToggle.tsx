import { Power, PowerOff } from "lucide-react";

import { useRealtimeConnection } from "@/features/timelineViewer/hooks/useRealtimeConnection";
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
  const { isConnected } = useRealtimeConnection({
    isEnabled: isRealtimeOn,
  });

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
        {isRealtimeOn && isConnected ? (
          <Power className="w-4 h-4 text-green-500" />
        ) : (
          <PowerOff className="w-4 h-4 text-red-500" />
        )}
      </Button>
    </div>
  );
}
