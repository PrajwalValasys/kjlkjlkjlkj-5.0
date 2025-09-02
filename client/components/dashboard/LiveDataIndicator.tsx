import { Play, Pause, Wifi, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface LiveDataIndicatorProps {
  isLive: boolean;
  lastUpdated: Date;
  onToggle: () => void;
}

export default function LiveDataIndicator({ 
  isLive, 
  lastUpdated, 
  onToggle 
}: LiveDataIndicatorProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="flex items-center space-x-3">
      <div className="flex items-center space-x-2">
        <div className={cn(
          "w-2 h-2 rounded-full",
          isLive ? "bg-green-500 animate-pulse" : "bg-gray-400"
        )} />
        <Badge 
          variant={isLive ? "default" : "secondary"}
          className={cn(
            "flex items-center space-x-1",
            isLive ? "bg-green-500 hover:bg-green-600" : "bg-gray-500"
          )}
        >
          {isLive ? (
            <Wifi className="w-3 h-3" />
          ) : (
            <WifiOff className="w-3 h-3" />
          )}
          <span>{isLive ? "LIVE" : "PAUSED"}</span>
        </Badge>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={onToggle}
        className="h-8 px-3"
      >
        {isLive ? (
          <>
            <Pause className="w-3 h-3 mr-1" />
            Pause
          </>
        ) : (
          <>
            <Play className="w-3 h-3 mr-1" />
            Resume
          </>
        )}
      </Button>

      <div className="text-xs text-valasys-gray-500">
        Last update: {formatTime(lastUpdated)}
      </div>
    </div>
  );
}
