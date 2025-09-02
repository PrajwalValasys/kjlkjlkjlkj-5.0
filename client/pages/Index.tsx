import DashboardLayout from "@/components/layout/DashboardLayout";
import EnhancedStatsCards from "@/components/dashboard/EnhancedStatsCards";
import ImprovedAnalyticsCharts from "@/components/dashboard/ImprovedAnalyticsCharts";
import InteractiveAnalyticsChart from "@/components/dashboard/InteractiveAnalyticsChart";
import DynamicAnalyticsChart from "@/components/dashboard/DynamicAnalyticsChart";
import DetailedOverview from "@/components/dashboard/DetailedOverview";
import PerformanceAnalytics from "@/components/dashboard/PerformanceAnalytics";
import DateRangePicker from "@/components/dashboard/DateRangePicker";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function Index() {
  const [dateRange, setDateRange] = useState({
    label: "Last 30 days",
    value: "30d",
    days: 30,
  });

  // Static data for dashboard metrics
  const data = {
    accountsVerified: 1234,
    availableCredits: 15048,
    creditsSpent: 8129,
    lalsGenerated: 847,
  };

  const trends = {
    accountsVerified: [{ value: 1200, changePercent: 2.8 }],
    availableCredits: [{ value: 15000, changePercent: 0.3 }],
    creditsSpent: [{ value: 7800, changePercent: 4.2 }],
    lalsGenerated: [{ value: 820, changePercent: 3.3 }],
  };

  const handleDateRangeChange = (range: any) => {
    setDateRange(range);
    // Here you would typically refetch data for the new date range
    console.log("Date range changed to:", range);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="page-header">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0 mb-6">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-valasys-gray-900">
                Welcome John Smith!
              </h1>
              <p className="text-valasys-gray-600">
                Monitor your campaigns, track performance metrics, and discover
                new opportunities with real-time insights.
              </p>
            </div>
            <div className="flex items-center">
              <DateRangePicker
                onRangeChange={handleDateRangeChange}
                defaultRange={dateRange.value}
              />
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards with Real-time Data */}
        <div data-tour="stats-cards">
          <EnhancedStatsCards data={data} trends={trends} />
        </div>

        {/* Interactive SaaS Analytics Chart */}
        <div data-tour="analytics-charts">
          <InteractiveAnalyticsChart />
        </div>

        {/* Performance Analytics */}
        <div data-tour="performance-analytics">
          <PerformanceAnalytics />
        </div>

        {/* Dynamic Distribution Analytics Charts */}
        <div data-tour="distribution-analysis">
          <DynamicAnalyticsChart />
        </div>

        {/* Detailed Overview */}
        <div data-tour="detailed-overview">
          <DetailedOverview />
        </div>

        {/* Additional Insights */}
        <div data-tour="additional-insights">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {((data.accountsVerified / 1500) * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-valasys-gray-600">
                    Monthly Target Achievement
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {(
                      (data.creditsSpent / data.availableCredits) *
                      100
                    ).toFixed(1)}
                    %
                  </div>
                  <div className="text-sm text-valasys-gray-600">
                    Credit Utilization Rate
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {data.lalsGenerated >= 950
                      ? "🎯"
                      : data.lalsGenerated >= 800
                        ? "📈"
                        : "⚠️"}
                  </div>
                  <div className="text-sm text-valasys-gray-600">
                    LALs Generation Status
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
