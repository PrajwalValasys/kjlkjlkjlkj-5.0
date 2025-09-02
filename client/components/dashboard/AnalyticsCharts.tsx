import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { useState } from "react";

// Theme-based data using Valasys brand colors
const empSizeData = [
  {
    name: "1-49",
    shortName: "1-49",
    value: 25,
    color: "#FF6A00",
    hoverColor: "#E55A00",
  },
  {
    name: "50-249",
    shortName: "50-249",
    value: 35,
    color: "#F5A243",
    hoverColor: "#E5923A",
  },
  {
    name: "250-999",
    shortName: "250-999",
    value: 20,
    color: "#1A73E8",
    hoverColor: "#1557B8",
  },
  {
    name: "1000+",
    shortName: "1K+",
    value: 20,
    color: "#00C48C",
    hoverColor: "#00A876",
  },
];

const industryData = [
  {
    name: "Technology & Telecom",
    shortName: "Tech",
    value: 30,
    color: "#FF6A00",
    hoverColor: "#E55A00",
  },
  {
    name: "Financial Services",
    shortName: "Finance",
    value: 25,
    color: "#F5A243",
    hoverColor: "#E5923A",
  },
  {
    name: "Healthcare & Pharma",
    shortName: "Health",
    value: 20,
    color: "#1A73E8",
    hoverColor: "#1557B8",
  },
  {
    name: "Manufacturing",
    shortName: "Mfg",
    value: 15,
    color: "#00C48C",
    hoverColor: "#00A876",
  },
  {
    name: "Retail & E-commerce",
    shortName: "Retail",
    value: 10,
    color: "#64748B",
    hoverColor: "#475569",
  },
];

const revenueData = [
  {
    name: "$1M - $10M",
    shortName: "$1-10M",
    value: 22,
    color: "#FF6A00",
    hoverColor: "#E55A00",
  },
  {
    name: "$10M - $50M",
    shortName: "$10-50M",
    value: 28,
    color: "#F5A243",
    hoverColor: "#E5923A",
  },
  {
    name: "$50M - $100M",
    shortName: "$50-100M",
    value: 25,
    color: "#1A73E8",
    hoverColor: "#1557B8",
  },
  {
    name: "$100M+",
    shortName: "$100M+",
    value: 25,
    color: "#00C48C",
    hoverColor: "#00A876",
  },
];

interface ChartCardProps {
  title: string;
  data: any[];
  chartType?: "donut" | "bar";
}

function ChartCard({ title, data, chartType = "donut" }: ChartCardProps) {
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);
  const [isCardHovered, setIsCardHovered] = useState(false);

  const onSegmentEnter = (_: any, index: number) => {
    setHoveredSegment(index);
  };

  const onSegmentLeave = () => {
    setHoveredSegment(null);
  };

  const renderCustomLegend = () => (
    <div className="grid grid-cols-2 gap-1 mt-3 px-2">
      {data.map((entry, index) => (
        <div
          key={`legend-${index}`}
          className={`flex items-center space-x-2 p-1.5 rounded-md cursor-pointer transition-all duration-200 ${
            hoveredSegment === index
              ? "bg-valasys-orange/10 shadow-sm transform scale-[1.02]"
              : "hover:bg-gray-50"
          }`}
          onMouseEnter={() => setHoveredSegment(index)}
          onMouseLeave={() => setHoveredSegment(null)}
        >
          <div
            className="w-2.5 h-2.5 rounded-full shadow-sm flex-shrink-0"
            style={{
              backgroundColor:
                hoveredSegment === index ? entry.hoverColor : entry.color,
            }}
          />
          <span className="text-xs font-medium text-valasys-gray-700 truncate">
            {entry.shortName}
          </span>
          <span className="text-xs font-bold text-valasys-gray-800 ml-auto">
            {entry.value}%
          </span>
        </div>
      ))}
    </div>
  );

  const totalValue = data.reduce((sum, item) => sum + item.value, 0);

  if (chartType === "bar") {
    return (
      <Card
        className={`h-[400px] transition-all duration-500 ease-out border border-valasys-gray-200 hover:border-valasys-orange/30 hover:shadow-xl bg-gradient-to-br from-white via-white to-valasys-gray-50/30 ${
          isCardHovered ? "transform scale-[1.02] shadow-2xl" : "shadow-lg"
        }`}
        onMouseEnter={() => setIsCardHovered(true)}
        onMouseLeave={() => setIsCardHovered(false)}
      >
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold text-valasys-gray-800 text-center flex items-center justify-center space-x-2">
            <div className="w-2 h-6 bg-gradient-to-b from-valasys-orange to-valasys-orange-light rounded-full"></div>
            <span>{title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={data}
              margin={{ top: 20, right: 10, left: 10, bottom: 5 }}
            >
              <XAxis
                dataKey="shortName"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#64748B" }}
              />
              <YAxis hide />
              <Tooltip
                formatter={(value: any, name: string, props: any) => [
                  <span className="font-semibold text-valasys-gray-800">{`${value}%`}</span>,
                  <span className="text-valasys-gray-600">
                    {props.payload.name}
                  </span>,
                ]}
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.98)",
                  border: "1px solid #FF6A00",
                  borderRadius: "12px",
                  boxShadow: "0 10px 30px rgba(255, 106, 0, 0.15)",
                  padding: "12px 16px",
                }}
                cursor={{ fill: "rgba(255, 106, 0, 0.1)" }}
              />
              <Bar
                dataKey="value"
                radius={[6, 6, 0, 0]}
                onMouseEnter={onSegmentEnter}
                onMouseLeave={onSegmentLeave}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      hoveredSegment === index ? entry.hoverColor : entry.color
                    }
                    style={{
                      filter:
                        hoveredSegment === index
                          ? "drop-shadow(0 4px 8px rgba(255, 106, 0, 0.3))"
                          : "none",
                      transition: "all 0.3s ease-in-out",
                    }}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          {renderCustomLegend()}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={`h-[400px] transition-all duration-500 ease-out border border-valasys-gray-200 hover:border-valasys-orange/30 hover:shadow-xl bg-gradient-to-br from-white via-white to-valasys-gray-50/30 ${
        isCardHovered ? "transform scale-[1.02] shadow-2xl" : "shadow-lg"
      }`}
      onMouseEnter={() => setIsCardHovered(true)}
      onMouseLeave={() => setIsCardHovered(false)}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold text-valasys-gray-800 text-center flex items-center justify-center space-x-2">
          <div className="w-2 h-6 bg-gradient-to-b from-valasys-orange to-valasys-orange-light rounded-full"></div>
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={70}
              innerRadius={35}
              fill="#8884d8"
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
                  fill={
                    hoveredSegment === index ? entry.hoverColor : entry.color
                  }
                  stroke={hoveredSegment === index ? entry.hoverColor : "white"}
                  strokeWidth={hoveredSegment === index ? 3 : 2}
                  style={{
                    filter:
                      hoveredSegment === index
                        ? "drop-shadow(0 6px 12px rgba(255, 106, 0, 0.4))"
                        : "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))",
                    transform:
                      hoveredSegment === index ? "scale(1.08)" : "scale(1)",
                    transformOrigin: "center",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                />
              ))}
            </Pie>

            {/* Center content */}
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
              <tspan
                x="50%"
                dy="-0.3em"
                fontSize="11"
                fontWeight="600"
                className="fill-valasys-gray-600"
              >
                Total
              </tspan>
              <tspan
                x="50%"
                dy="1.4em"
                fontSize="18"
                fontWeight="800"
                className="fill-valasys-orange"
              >
                {totalValue}%
              </tspan>
            </text>

            <Tooltip
              formatter={(value: any, name: string) => [
                <span className="font-semibold text-valasys-gray-800">{`${value}%`}</span>,
                <span className="text-valasys-gray-600">{name}</span>,
              ]}
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.98)",
                border: "1px solid #FF6A00",
                borderRadius: "12px",
                boxShadow: "0 10px 30px rgba(255, 106, 0, 0.15)",
                backdropFilter: "blur(10px)",
                padding: "12px 16px",
              }}
              labelStyle={{
                fontWeight: "bold",
                color: "#1E293B",
                marginBottom: "4px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {renderCustomLegend()}
      </CardContent>
    </Card>
  );
}

export default function AnalyticsCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <ChartCard title="By Emp Size" data={empSizeData} chartType="donut" />
      <ChartCard title="By Industry" data={industryData} chartType="bar" />
      <ChartCard
        title="By Company Revenue"
        data={revenueData}
        chartType="donut"
      />
    </div>
  );
}
