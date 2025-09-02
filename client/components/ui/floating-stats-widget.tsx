import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatItem {
  label: string;
  value: number | string;
  color: "red" | "orange" | "green";
}

interface FloatingStatsWidgetProps {
  className?: string;
  stats?: StatItem[];
}

const defaultStats: StatItem[] = [
  {
    label: "Search Left",
    value: 10,
    color: "red",
  },
  {
    label: "Credits Left",
    value: "48,256",
    color: "green",
  },
];

const getColorClasses = (color: "red" | "orange" | "green") => {
  switch (color) {
    case "red":
      return "bg-red-500";
    case "orange":
      return "bg-orange-500";
    case "green":
      return "bg-green-500";
    default:
      return "bg-gray-500";
  }
};

export function FloatingStatsWidget({
  className,
  stats = defaultStats,
}: FloatingStatsWidgetProps) {
  return (
    <div className={cn("flex flex-col sm:flex-row gap-2 w-full", className)}>
      {stats.map((stat, index) => (
        <Card
          key={index}
          className="bg-white border border-valasys-gray-200 flex-1 sm:min-w-[180px] max-w-full"
        >
          <CardContent className="px-3 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 flex-shrink-0">
                <div
                  className={cn(
                    "w-3 h-3 rounded-full flex-shrink-0",
                    getColorClasses(stat.color),
                  )}
                />
                <span
                  className="text-sm font-medium text-valasys-gray-700 truncate"
                  style={{ fontSize: "14px" }}
                >
                  {stat.label}
                </span>
              </div>
              <span
                className="font-bold text-valasys-gray-900 ml-2 flex-shrink-0"
                style={{ fontSize: "14px" }}
              >
                {stat.value}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
