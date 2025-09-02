import React, { useState } from "react";
import { Calendar, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface DateRange {
  label: string;
  value: string;
  days: number;
}

const dateRanges: DateRange[] = [
  { label: "Last 7 days", value: "7d", days: 7 },
  { label: "Last 30 days", value: "30d", days: 30 },
  { label: "Last 90 days", value: "90d", days: 90 },
  { label: "Last 6 months", value: "6m", days: 180 },
  { label: "Last year", value: "1y", days: 365 },
];

interface DateRangePickerProps {
  onRangeChange?: (range: DateRange) => void;
  defaultRange?: string;
}

export default function DateRangePicker({ 
  onRangeChange, 
  defaultRange = "30d" 
}: DateRangePickerProps) {
  const [selectedRange, setSelectedRange] = useState<DateRange>(
    dateRanges.find(r => r.value === defaultRange) || dateRanges[1]
  );

  const handleRangeSelect = (range: DateRange) => {
    setSelectedRange(range);
    onRangeChange?.(range);
  };

  return (
    <div className="flex items-center space-x-2">
      <Calendar className="w-4 h-4 text-valasys-gray-500" />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8">
            {selectedRange.label}
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {dateRanges.map((range) => (
            <DropdownMenuItem
              key={range.value}
              onClick={() => handleRangeSelect(range)}
              className={
                selectedRange.value === range.value 
                  ? "bg-valasys-orange/10 text-valasys-orange" 
                  : ""
              }
            >
              <div className="flex items-center justify-between w-full">
                <span>{range.label}</span>
                {selectedRange.value === range.value && (
                  <Badge variant="secondary" className="ml-2 bg-valasys-orange text-white">
                    Active
                  </Badge>
                )}
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
