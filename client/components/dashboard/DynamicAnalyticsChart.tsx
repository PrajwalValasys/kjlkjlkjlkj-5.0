import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

// Chart data using Valasys theme colors
const empSizeData = [
  { name: "1-49", value: 25, color: "#FF6A00", hoverColor: "#E55A00" },
  { name: "50-249", value: 35, color: "#F5A243", hoverColor: "#E5923A" },
  { name: "250-999", value: 20, color: "#1A73E8", hoverColor: "#1557B8" },
  { name: "1000+", value: 20, color: "#00C48C", hoverColor: "#00A876" },
];

const industryData = [
  {
    name: "Technology & Telecom",
    value: 30,
    color: "#FF6A00",
    hoverColor: "#E55A00",
  },
  {
    name: "Financial Services",
    value: 25,
    color: "#F5A243",
    hoverColor: "#E5923A",
  },
  {
    name: "Healthcare & Pharma",
    value: 20,
    color: "#1A73E8",
    hoverColor: "#1557B8",
  },
  { name: "Manufacturing", value: 15, color: "#00C48C", hoverColor: "#00A876" },
  {
    name: "Retail & E-commerce",
    value: 10,
    color: "#64748B",
    hoverColor: "#475569",
  },
];

const revenueData = [
  { name: "$1M - $10M", value: 22, color: "#FF6A00", hoverColor: "#E55A00" },
  { name: "$10M - $50M", value: 28, color: "#F5A243", hoverColor: "#E5923A" },
  { name: "$50M - $100M", value: 25, color: "#1A73E8", hoverColor: "#1557B8" },
  { name: "$100M+", value: 25, color: "#00C48C", hoverColor: "#00A876" },
];

interface DynamicChartProps {
  title: string;
  data: any[];
  chartType: string;
}

function DynamicChart({ title, data, chartType }: DynamicChartProps) {
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);
  const [isCardHovered, setIsCardHovered] = useState(false);

  const onSegmentEnter = (_: any, index: number) => {
    setHoveredSegment(index);
  };

  const onSegmentLeave = () => {
    setHoveredSegment(null);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-valasys-orange/30">
          <p className="font-semibold text-valasys-gray-900 mb-1">
            {data.payload?.name || label}
          </p>
          <p className="text-sm text-valasys-gray-700">
            <span className="font-medium">Value:</span> {data.value}%
          </p>
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    return (
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={85}
          paddingAngle={3}
          dataKey="value"
          onMouseEnter={onSegmentEnter}
          onMouseLeave={onSegmentLeave}
          animationBegin={0}
          animationDuration={1000}
          animationEasing="ease-out"
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={hoveredSegment === index ? entry.hoverColor : entry.color}
              stroke="white"
              strokeWidth={3}
              style={{
                filter:
                  hoveredSegment === index
                    ? "drop-shadow(0 8px 16px rgba(255, 106, 0, 0.25))"
                    : "drop-shadow(0 3px 6px rgba(0, 0, 0, 0.1))",
                transform:
                  hoveredSegment === index ? "scale(1.08)" : "scale(1)",
                transformOrigin: "center",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    );
  };

  // Height for pie charts
  const getCardHeight = () => {
    return "h-[420px]"; // Compact height for legends
  };

  const getChartHeight = () => {
    return "h-[240px]"; // Optimized chart area
  };

  return (
    <Card
      className={`${getCardHeight()} transition-all duration-500 ease-out border border-valasys-gray-200 hover:border-valasys-orange/30 hover:shadow-xl bg-gradient-to-br from-white via-white to-valasys-gray-50/30 ${
        isCardHovered ? "transform scale-[1.02] shadow-2xl" : "shadow-lg"
      }`}
      onMouseEnter={() => setIsCardHovered(true)}
      onMouseLeave={() => setIsCardHovered(false)}
    >
      <CardHeader className="pb-1">
        <CardTitle className="text-base font-bold text-valasys-gray-800 text-center flex items-center justify-center space-x-2">
          <div className="w-1.5 h-5 bg-gradient-to-b from-valasys-orange to-valasys-orange-light rounded-full"></div>
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 pb-1 overflow-hidden">
        <div className={`${getChartHeight()} mb-1`}>
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
        <div className="h-[100px] overflow-y-auto">
          <div className="grid grid-cols-2 gap-2 px-2">
            {data.map((entry, index) => (
              <div
                key={`legend-${index}`}
                className={`flex items-center space-x-2 p-2 rounded-md cursor-pointer transition-all duration-200 ${
                  hoveredSegment === index
                    ? "bg-valasys-orange/10 shadow-sm transform scale-[1.02]"
                    : "hover:bg-gray-50"
                }`}
                onMouseEnter={() => setHoveredSegment(index)}
                onMouseLeave={() => setHoveredSegment(null)}
              >
                <div
                  className="w-3 h-3 rounded-full shadow-sm flex-shrink-0"
                  style={{
                    backgroundColor:
                      hoveredSegment === index ? entry.hoverColor : entry.color,
                  }}
                />
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-medium text-valasys-gray-700 truncate block">
                    {entry.name}
                  </span>
                  <span className="text-xs font-bold text-valasys-gray-800">
                    {entry.value}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DynamicAnalyticsChart() {
  const datasets = [
    { title: "By Employee Size", data: empSizeData },
    { title: "By Industry", data: industryData },
    { title: "By Company Revenue", data: revenueData },
  ];

  return (
    <div className="space-y-6">
      {/* Header with Title */}
      <div className="flex items-center space-x-3">
        <div className="w-1 h-8 bg-gradient-to-b from-valasys-orange to-valasys-orange-light rounded-full"></div>
        <h2 className="text-2xl font-bold text-valasys-gray-900">
          Distribution Analysis
        </h2>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {datasets.map((dataset, index) => (
          <DynamicChart
            key={dataset.title}
            title={dataset.title}
            data={dataset.data}
            chartType="pie"
          />
        ))}
      </div>
    </div>
  );
}
