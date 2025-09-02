import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from "recharts";
import { TrendingUp, Users, Building, DollarSign } from "lucide-react";

// Enhanced data with trend information
const empSizeData = [
  {
    name: "1-49",
    value: 25,
    color: "#4A90E2",
    trend: "+2.3%",
    employees: "Small Business",
  },
  {
    name: "50-249",
    value: 35,
    color: "#F0675C",
    trend: "+5.1%",
    employees: "Medium Business",
  },
  {
    name: "250-999",
    value: 20,
    color: "#F5A243",
    trend: "-1.2%",
    employees: "Large Business",
  },
  {
    name: "1000+",
    value: 20,
    color: "#7B68EE",
    trend: "+3.8%",
    employees: "Enterprise",
  },
];

const industryData = [
  {
    name: "Technology",
    value: 30,
    color: "#4A90E2",
    trend: "+4.2%",
    fullName: "Technology and Telecom",
  },
  {
    name: "Financial",
    value: 25,
    color: "#F0675C",
    trend: "+2.8%",
    fullName: "Financial Services",
  },
  {
    name: "Healthcare",
    value: 20,
    color: "#F5A243",
    trend: "+6.1%",
    fullName: "Healthcare and Pharma",
  },
  {
    name: "Manufacturing",
    value: 15,
    color: "#7B68EE",
    trend: "-0.5%",
    fullName: "Manufacturing",
  },
  {
    name: "Retail",
    value: 10,
    color: "#20B2AA",
    trend: "+1.9%",
    fullName: "Retail and E-commerce",
  },
];

const revenueData = [
  {
    name: "$1M - $10M",
    value: 22,
    color: "#4A90E2",
    trend: "+1.8%",
    category: "Small Revenue",
  },
  {
    name: "$10M - $50M",
    value: 28,
    color: "#F0675C",
    trend: "+3.5%",
    category: "Medium Revenue",
  },
  {
    name: "$50M - $100M",
    value: 25,
    color: "#F5A243",
    trend: "+2.1%",
    category: "Large Revenue",
  },
  {
    name: "$100M+",
    value: 25,
    color: "#7B68EE",
    trend: "+4.7%",
    category: "Enterprise Revenue",
  },
];

interface HorizontalBarChartProps {
  title: string;
  data: any[];
  icon: React.ComponentType<{ className?: string }>;
  subtitle: string;
}

function HorizontalBarChart({
  title,
  data,
  icon: Icon,
  subtitle,
}: HorizontalBarChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">
            {data.fullName || data.employees || data.category || label}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-valasys-orange">
              {payload[0].value}%
            </span>{" "}
            of total
          </p>
          <p className="text-xs text-gray-500 flex items-center mt-1">
            <TrendingUp className="w-3 h-3 mr-1" />
            Trend: {data.trend}
          </p>
        </div>
      );
    }
    return null;
  };

  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <Card className="h-96 hover:shadow-lg transition-all duration-200 border-l-4 border-l-valasys-orange">
      <CardHeader className="pb-2">
        <div className="flex items-center space-x-2">
          <Icon className="w-5 h-5 text-valasys-orange" />
          <div>
            <CardTitle className="text-lg font-semibold text-valasys-gray-800">
              {title}
            </CardTitle>
            <p className="text-xs text-valasys-gray-500 mt-1">{subtitle}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={data}
            layout="horizontal"
            margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
          >
            <XAxis
              type="number"
              domain={[0, maxValue + 5]}
              tickFormatter={(value) => `${value}%`}
              fontSize={12}
            />
            <YAxis type="category" dataKey="name" width={80} fontSize={11} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} fill="#8884d8">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Additional Stats */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="flex justify-between text-xs text-gray-600">
            <span>Total Segments: {data.length}</span>
            <span>Highest: {Math.max(...data.map((d) => d.value))}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Alternative: Donut Chart with improved design
function DonutChart({
  title,
  data,
  icon: Icon,
  subtitle,
}: HorizontalBarChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className="h-96 hover:shadow-lg transition-all duration-200">
      <CardHeader className="pb-2">
        <div className="flex items-center space-x-2">
          <Icon className="w-5 h-5 text-valasys-orange" />
          <div>
            <CardTitle className="text-lg font-semibold text-valasys-gray-800">
              {title}
            </CardTitle>
            <p className="text-xs text-valasys-gray-500 mt-1">{subtitle}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <div>
                  <span className="text-sm font-medium text-gray-900">
                    {item.name}
                  </span>
                  <p className="text-xs text-gray-500">
                    {item.fullName || item.employees || item.category}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-valasys-orange">
                  {item.value}%
                </span>
                <p className="text-xs text-green-600">{item.trend}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Progress bars */}
        <div className="mt-4 space-y-2">
          {data.map((item, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">{item.name}</span>
                <span className="font-medium">{item.value}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${item.value}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function ImprovedAnalyticsCharts() {
  return <div className="space-y-8"></div>;
}
