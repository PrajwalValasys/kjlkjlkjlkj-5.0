import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Download,
  Copy,
  Trash2,
  BarChart3,
  Table,
  Calendar,
  Target,
  Users,
  Building2,
  Globe,
  TrendingUp,
  MessageSquare,
  ChevronDown,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data for the campaign
const campaignData = {
  id: "1",
  name: "Q1 Software Engineers Campaign",
  status: "Completed",
  assignedTeamMember: {
    name: "Sarah Johnson",
    avatar: "",
    initials: "SJ",
  },
  completionDate: "2024-01-15",
  adminComment: "This campaign is Accepted",
};

// KPI data
const kpiData = [
  { label: "CS", value: 2499, icon: Target, color: "bg-blue-500" },
  { label: "MQL", value: 1550, icon: Users, color: "bg-green-500" },
  { label: "HQL", value: 820, icon: TrendingUp, color: "bg-purple-500" },
  { label: "BANT + VPI", value: 390, icon: Building2, color: "bg-orange-500" },
  {
    label: "Webinar On Demand",
    value: 560,
    icon: Globe,
    color: "bg-indigo-500",
  },
];

// Monthly deliverables data
const monthlyDeliverablesData = [
  { month: "Jan", CS: 45, MQL: 28, HQL: 15, BANT: 8, Webinar: 12 },
  { month: "Feb", CS: 52, MQL: 31, HQL: 18, BANT: 9, Webinar: 14 },
  { month: "Mar", CS: 48, MQL: 29, HQL: 16, BANT: 7, Webinar: 13 },
  { month: "Apr", CS: 55, MQL: 34, HQL: 19, BANT: 11, Webinar: 15 },
  { month: "May", CS: 49, MQL: 32, HQL: 17, BANT: 8, Webinar: 12 },
  { month: "Q1", CS: 145, MQL: 88, HQL: 49, BANT: 24, Webinar: 39 },
];

// Geographic data for deliverables
const geoDeliverableData = [
  { geo: "United States", CS: 180, MQL: 110, HQL: 65, BANT: 28, Webinar: 45 },
  { geo: "India", CS: 24, MQL: 18, HQL: 12, BANT: 5, Webinar: 8 },
  { geo: "Singapore", CS: 28, MQL: 20, HQL: 15, BANT: 7, Webinar: 11 },
  { geo: "South Africa", CS: 21, MQL: 16, HQL: 11, BANT: 4, Webinar: 7 },
  { geo: "Aland Islands", CS: 12, MQL: 8, HQL: 5, BANT: 2, Webinar: 4 },
];

// Location-specific job level distribution data
const jobLevelDataByLocation = {
  ALL: [
    { name: "Staff", value: 119, color: "#FF6A00" },
    { name: "Manager", value: 100, color: "#1A73E8" },
    { name: "Director", value: 54, color: "#00C48C" },
    { name: "VP/President", value: 51, color: "#9C27B0" },
    { name: "C-Level", value: 75, color: "#FF9800" },
  ],
  INDIA: [
    { name: "Staff", value: 45, color: "#FF6A00" },
    { name: "Manager", value: 38, color: "#1A73E8" },
    { name: "Director", value: 22, color: "#00C48C" },
    { name: "VP/President", value: 18, color: "#9C27B0" },
    { name: "C-Level", value: 25, color: "#FF9800" },
  ],
  SINGAPORE: [
    { name: "Staff", value: 32, color: "#FF6A00" },
    { name: "Manager", value: 28, color: "#1A73E8" },
    { name: "Director", value: 15, color: "#00C48C" },
    { name: "VP/President", value: 12, color: "#9C27B0" },
    { name: "C-Level", value: 18, color: "#FF9800" },
  ],
  SOUTH_AFRICA: [
    { name: "Staff", value: 28, color: "#FF6A00" },
    { name: "Manager", value: 22, color: "#1A73E8" },
    { name: "Director", value: 12, color: "#00C48C" },
    { name: "VP/President", value: 8, color: "#9C27B0" },
    { name: "C-Level", value: 15, color: "#FF9800" },
  ],
  UNITED_STATES: [
    { name: "Staff", value: 85, color: "#FF6A00" },
    { name: "Manager", value: 72, color: "#1A73E8" },
    { name: "Director", value: 42, color: "#00C48C" },
    { name: "VP/President", value: 35, color: "#9C27B0" },
    { name: "C-Level", value: 48, color: "#FF9800" },
  ],
  ALAND_ISLANDS: [
    { name: "Staff", value: 12, color: "#FF6A00" },
    { name: "Manager", value: 8, color: "#1A73E8" },
    { name: "Director", value: 5, color: "#00C48C" },
    { name: "VP/President", value: 3, color: "#9C27B0" },
    { name: "C-Level", value: 7, color: "#FF9800" },
  ],
};

// Location-specific employee size data
const employeeSizeDataByLocation = {
  ALL: [
    { size: "1-10", count: 125 },
    { size: "11-50", count: 98 },
    { size: "51-200", count: 87 },
    { size: "201-500", count: 65 },
    { size: "501-1000", count: 43 },
    { size: "1000+", count: 82 },
  ],
  INDIA: [
    { size: "1-10", count: 42 },
    { size: "11-50", count: 35 },
    { size: "51-200", count: 28 },
    { size: "201-500", count: 22 },
    { size: "501-1000", count: 15 },
    { size: "1000+", count: 18 },
  ],
  SINGAPORE: [
    { size: "1-10", count: 35 },
    { size: "11-50", count: 28 },
    { size: "51-200", count: 25 },
    { size: "201-500", count: 18 },
    { size: "501-1000", count: 12 },
    { size: "1000+", count: 22 },
  ],
  SOUTH_AFRICA: [
    { size: "1-10", count: 28 },
    { size: "11-50", count: 22 },
    { size: "51-200", count: 18 },
    { size: "201-500", count: 15 },
    { size: "501-1000", count: 8 },
    { size: "1000+", count: 12 },
  ],
  UNITED_STATES: [
    { size: "1-10", count: 95 },
    { size: "11-50", count: 75 },
    { size: "51-200", count: 68 },
    { size: "201-500", count: 52 },
    { size: "501-1000", count: 35 },
    { size: "1000+", count: 65 },
  ],
  ALAND_ISLANDS: [
    { size: "1-10", count: 8 },
    { size: "11-50", count: 6 },
    { size: "51-200", count: 5 },
    { size: "201-500", count: 4 },
    { size: "501-1000", count: 2 },
    { size: "1000+", count: 3 },
  ],
};

// Industry data
const industryData = [
  { industry: "Technology", count: 156 },
  { industry: "Healthcare", count: 89 },
  { industry: "Finance", count: 76 },
  { industry: "Manufacturing", count: 65 },
  { industry: "Education", count: 54 },
  { industry: "Retail", count: 43 },
  { industry: "Other", count: 67 },
];

const COLORS = ["#FF6A00", "#1A73E8", "#00C48C", "#9C27B0", "#FF9800"];

export default function CampaignOverview() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("deliverables");
  const [viewMode, setViewMode] = useState<"chart" | "table">("chart");
  const [selectedGeoLocation, setSelectedGeoLocation] = useState("ALL");

  // Filter data based on selected geo location
  const filteredJobLevelData = useMemo(() => {
    return (
      jobLevelDataByLocation[
        selectedGeoLocation as keyof typeof jobLevelDataByLocation
      ] || jobLevelDataByLocation.ALL
    );
  }, [selectedGeoLocation]);

  const filteredEmployeeSizeData = useMemo(() => {
    return (
      employeeSizeDataByLocation[
        selectedGeoLocation as keyof typeof employeeSizeDataByLocation
      ] || employeeSizeDataByLocation.ALL
    );
  }, [selectedGeoLocation]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.dataKey}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const handleBackToCampaigns = () => {
    // Navigate to build-my-campaign page with campaign requests tab open
    navigate("/build-my-campaign?tab=requests");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Back Button */}
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBackToCampaigns}
            className="text-valasys-orange hover:bg-valasys-orange hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Campaign Requests
          </Button>
        </div>

        {/* Header Section */}
        <Card className="border-l-4 border-l-valasys-orange">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-valasys-gray-900">
                    {campaignData.name}
                  </h1>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                    {campaignData.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={campaignData.assignedTeamMember.avatar}
                      />
                      <AvatarFallback className="text-xs">
                        {campaignData.assignedTeamMember.initials}
                      </AvatarFallback>
                    </Avatar>
                    <span>
                      Assigned to {campaignData.assignedTeamMember.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Completed on{" "}
                      {new Date(
                        campaignData.completionDate,
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download CSV
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download Excel
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
                <Button variant="outline" size="sm">
                  <Copy className="w-4 h-4 mr-2" />
                  Clone Campaign
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {kpiData.map((kpi, index) => {
            const IconComponent = kpi.icon;
            return (
              <Card
                key={kpi.label}
                className="hover:shadow-md transition-shadow cursor-pointer"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {kpi.label}
                      </p>
                      <p className="text-2xl font-bold">
                        {kpi.value.toLocaleString()}
                      </p>
                    </div>
                    <div className={cn("p-3 rounded-full", kpi.color)}>
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Chart/Table Toggle */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Campaign Analytics</CardTitle>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="view-mode" className="text-sm">
                    Chart
                  </Label>
                  <Switch
                    id="view-mode"
                    checked={viewMode === "table"}
                    onCheckedChange={(checked) =>
                      setViewMode(checked ? "table" : "chart")
                    }
                  />
                  <Label htmlFor="view-mode" className="text-sm">
                    Table
                  </Label>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger
                    value="deliverables"
                    className="flex items-center gap-2"
                  >
                    Deliverables
                  </TabsTrigger>
                  <TabsTrigger
                    value="database-reach"
                    className="flex items-center gap-2"
                  >
                    Database Reach
                  </TabsTrigger>
                </TabsList>

                {/* Deliverables Tab */}
                <TabsContent value="deliverables" className="space-y-6">
                  {viewMode === "chart" ? (
                    <div className="space-y-6">
                      {/* Monthly/Quarterly Bar Chart */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4">
                          Monthly Deliverables
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={monthlyDeliverablesData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Bar dataKey="CS" fill="#FF6A00" />
                            <Bar dataKey="MQL" fill="#1A73E8" />
                            <Bar dataKey="HQL" fill="#00C48C" />
                            <Bar dataKey="BANT" fill="#9C27B0" />
                            <Bar dataKey="Webinar" fill="#FF9800" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6"></div>
                  )}
                </TabsContent>

                {/* Database Reach Tab */}
                <TabsContent value="database-reach" className="space-y-6">
                  {/* Geo Location Filter */}
                  <div className="flex items-center gap-4 mb-4">
                    <Label className="text-sm font-medium">
                      Geo Locations:
                    </Label>
                    <Select
                      value={selectedGeoLocation}
                      onValueChange={setSelectedGeoLocation}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">ALL</SelectItem>
                        <SelectItem value="INDIA">INDIA</SelectItem>
                        <SelectItem value="SINGAPORE">SINGAPORE</SelectItem>
                        <SelectItem value="SOUTH_AFRICA">
                          SOUTH AFRICA
                        </SelectItem>
                        <SelectItem value="UNITED_STATES">
                          UNITED STATES
                        </SelectItem>
                        <SelectItem value="ALAND_ISLANDS">
                          ALAND ISLANDS
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {viewMode === "chart" ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Job Level Pie Chart */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4">
                          Database Reach by Job Level
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={filteredJobLevelData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={120}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {filteredJobLevelData.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={entry.color}
                                />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Employee Size Bar Chart */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4">
                          Employee Size Distribution
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={filteredEmployeeSizeData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="size" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#FF6A00" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Job Level Distribution Table */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4">
                          Database Reach Summary
                        </h3>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-medium mb-2">
                              Job Level Distribution
                            </h4>
                            <table className="w-full border-collapse border border-gray-300">
                              <thead>
                                <tr className="bg-gray-50">
                                  <th className="border border-gray-300 p-2 text-left">
                                    Job Level
                                  </th>
                                  <th className="border border-gray-300 p-2 text-center">
                                    Count
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {filteredJobLevelData.map((item, idx) => (
                                  <tr
                                    key={item.name}
                                    className={
                                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                                    }
                                  >
                                    <td className="border border-gray-300 p-2">
                                      {item.name}
                                    </td>
                                    <td className="border border-gray-300 p-2 text-center">
                                      {item.value}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          <div>
                            <h4 className="font-medium mb-2">
                              Employee Size Distribution
                            </h4>
                            <table className="w-full border-collapse border border-gray-300">
                              <thead>
                                <tr className="bg-gray-50">
                                  <th className="border border-gray-300 p-2 text-left">
                                    Size
                                  </th>
                                  <th className="border border-gray-300 p-2 text-center">
                                    Count
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {filteredEmployeeSizeData.map((item, idx) => (
                                  <tr
                                    key={item.size}
                                    className={
                                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                                    }
                                  >
                                    <td className="border border-gray-300 p-2">
                                      {item.size}
                                    </td>
                                    <td className="border border-gray-300 p-2 text-center">
                                      {item.count}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Admin Comments Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Admin Comments & Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-green-800">
                    Campaign Status Update
                  </p>
                  <p className="text-green-700 mt-1">
                    {campaignData.adminComment}
                  </p>
                  <p className="text-xs text-green-600 mt-2">
                    Updated by {campaignData.assignedTeamMember.name} on{" "}
                    {new Date(campaignData.completionDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fixed Track My Campaign Button */}
        <div className="fixed bottom-6 right-6">
          <Button className="bg-valasys-orange hover:bg-valasys-orange/90 shadow-lg">
            <Target className="w-4 h-4 mr-2" />
            Track My Campaign
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
