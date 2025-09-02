import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Filter,
  Calendar as CalendarIcon,
  Download,
  X,
  Search,
  RefreshCw,
  FileText,
  FileSpreadsheet,
  PieChart,
  BarChart3,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// Helper function to format filter values for display
const formatFilterValue = (value: string | string[] | DateRange): string => {
  if (typeof value === "string") {
    return value;
  }
  if (Array.isArray(value)) {
    return value.join(", ");
  }
  if (value && typeof value === "object" && "from" in value) {
    const from = format(value.from, "MMM dd, yyyy");
    const to = value.to ? format(value.to, "MMM dd, yyyy") : "";
    return to ? `${from} - ${to}` : from;
  }
  return String(value);
};

interface FilterOption {
  id: string;
  label: string;
  value: string;
  type: "select" | "multiselect" | "daterange" | "number" | "search";
  options?: Array<{ value: string; label: string }>;
}

interface AppliedFilter {
  id: string;
  label: string;
  value: string | string[] | DateRange;
}

interface DateRange {
  from: Date;
  to: Date;
}

interface AdvancedFiltersProps {
  onFiltersChange?: (filters: AppliedFilter[]) => void;
  onExport?: (format: "csv" | "excel" | "pdf") => void;
  className?: string;
}

const defaultFilters: FilterOption[] = [
  {
    id: "dateRange",
    label: "Date Range",
    value: "dateRange",
    type: "daterange",
  },
  {
    id: "campaign",
    label: "Campaign",
    value: "campaign",
    type: "multiselect",
    options: [
      { value: "email_summer", label: "Summer Email Campaign" },
      { value: "social_q4", label: "Q4 Social Campaign" },
      { value: "search_brand", label: "Brand Search Campaign" },
      { value: "display_retarget", label: "Display Retargeting" },
    ],
  },
  {
    id: "channel",
    label: "Channel",
    value: "channel",
    type: "multiselect",
    options: [
      { value: "email", label: "Email" },
      { value: "social", label: "Social Media" },
      { value: "search", label: "Search" },
      { value: "display", label: "Display" },
      { value: "direct", label: "Direct" },
    ],
  },
  {
    id: "segment",
    label: "Customer Segment",
    value: "segment",
    type: "select",
    options: [
      { value: "enterprise", label: "Enterprise" },
      { value: "midmarket", label: "Mid-Market" },
      { value: "smb", label: "SMB" },
    ],
  },
  {
    id: "region",
    label: "Region",
    value: "region",
    type: "multiselect",
    options: [
      { value: "na", label: "North America" },
      { value: "eu", label: "Europe" },
      { value: "apac", label: "Asia Pacific" },
      { value: "latam", label: "Latin America" },
    ],
  },
  {
    id: "minRevenue",
    label: "Min Revenue",
    value: "minRevenue",
    type: "number",
  },
];

export default function AdvancedFilters({
  onFiltersChange,
  onExport,
  className,
}: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);
  const [tempFilters, setTempFilters] = useState<Record<string, any>>({});
  const [searchTerm, setSearchTerm] = useState("");

  const handleFilterChange = (filterId: string, value: any) => {
    setTempFilters((prev) => ({
      ...prev,
      [filterId]: value,
    }));
  };

  const applyFilters = () => {
    const newFilters: AppliedFilter[] = [];

    Object.entries(tempFilters).forEach(([filterId, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        const filterConfig = defaultFilters.find((f) => f.id === filterId);
        if (filterConfig) {
          let displayValue = value;

          if (filterConfig.type === "daterange" && value.from && value.to) {
            displayValue = `${format(value.from, "MMM d")} - ${format(value.to, "MMM d")}`;
          } else if (Array.isArray(value)) {
            displayValue = value.join(", ");
          } else if (filterConfig.options) {
            const option = filterConfig.options.find(
              (opt) => opt.value === value,
            );
            displayValue = option?.label || value;
          }

          newFilters.push({
            id: filterId,
            label: filterConfig.label,
            value: displayValue,
          });
        }
      }
    });

    setAppliedFilters(newFilters);
    onFiltersChange?.(newFilters);
    setIsOpen(false);
  };

  const clearFilters = () => {
    setTempFilters({});
    setAppliedFilters([]);
    onFiltersChange?.([]);
  };

  const removeFilter = (filterId: string) => {
    const newAppliedFilters = appliedFilters.filter((f) => f.id !== filterId);
    setAppliedFilters(newAppliedFilters);

    const newTempFilters = { ...tempFilters };
    delete newTempFilters[filterId];
    setTempFilters(newTempFilters);

    onFiltersChange?.(newAppliedFilters);
  };

  const FilterComponent = ({ filter }: { filter: FilterOption }) => {
    const value = tempFilters[filter.id];

    switch (filter.type) {
      case "select":
        return (
          <Select
            value={value || ""}
            onValueChange={(val) => handleFilterChange(filter.id, val)}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={`Select ${filter.label.toLowerCase()}`}
              />
            </SelectTrigger>
            <SelectContent>
              {filter.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "multiselect":
        return (
          <div className="space-y-2">
            {filter.options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={option.value}
                  checked={value?.includes(option.value) || false}
                  onCheckedChange={(checked) => {
                    const currentValues = value || [];
                    const newValues = checked
                      ? [...currentValues, option.value]
                      : currentValues.filter((v: string) => v !== option.value);
                    handleFilterChange(
                      filter.id,
                      newValues.length > 0 ? newValues : undefined,
                    );
                  }}
                />
                <Label htmlFor={option.value} className="text-sm">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        );

      case "daterange":
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {value?.from ? (
                  value.to ? (
                    <>
                      {format(value.from, "LLL dd, y")} -{" "}
                      {format(value.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(value.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={value?.from}
                selected={value}
                onSelect={(range) => handleFilterChange(filter.id, range)}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        );

      case "number":
        return (
          <Input
            type="number"
            placeholder={`Enter ${filter.label.toLowerCase()}`}
            value={value || ""}
            onChange={(e) => handleFilterChange(filter.id, e.target.value)}
          />
        );

      default:
        return (
          <Input
            placeholder={`Search ${filter.label.toLowerCase()}`}
            value={value || ""}
            onChange={(e) => handleFilterChange(filter.id, e.target.value)}
          />
        );
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Filter Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Advanced Filters
                {appliedFilters.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {appliedFilters.length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96 p-0" align="start">
              <Card className="border-0 shadow-none">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">
                    Filter Options
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search filters..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>

                  <div className="space-y-4 max-h-80 overflow-y-auto">
                    {defaultFilters
                      .filter((filter) =>
                        filter.label
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase()),
                      )
                      .map((filter) => (
                        <div key={filter.id} className="space-y-2">
                          <Label className="text-sm font-medium">
                            {filter.label}
                          </Label>
                          <FilterComponent filter={filter} />
                        </div>
                      ))}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t">
                    <Button variant="outline" size="sm" onClick={clearFilters}>
                      Clear All
                    </Button>
                    <div className="space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button size="sm" onClick={applyFilters}>
                        Apply Filters
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </PopoverContent>
          </Popover>

          {appliedFilters.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          )}
        </div>

        {/* Export Controls */}
        <div className="flex items-center space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48" align="end">
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => onExport?.("csv")}
                >
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Export as CSV
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => onExport?.("excel")}
                >
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Export as Excel
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => onExport?.("pdf")}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Export as PDF
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Applied Filters */}
      {appliedFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-valasys-gray-600">Filters:</span>
          {appliedFilters.map((filter) => (
            <Badge
              key={filter.id}
              variant="secondary"
              className="flex items-center space-x-2"
            >
              <span>
                {filter.label}: {formatFilterValue(filter.value)}
              </span>
              <button
                onClick={() => removeFilter(filter.id)}
                className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
