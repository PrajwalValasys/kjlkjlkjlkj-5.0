import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Search,
  Filter,
  Download,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SpendingRecord {
  id: string;
  date: string;
  time: string;
  task: string;
  creditsSpent: number;
  creditsAdded: number;
  creditsBalance: number;
  type: "spent" | "added" | "refund";
  description?: string;
}

const mockData: SpendingRecord[] = [
  {
    id: "1",
    date: "26 Aug 2025",
    time: "9:43 pm",
    task: "Prospect",
    creditsSpent: 1,
    creditsAdded: 0,
    creditsBalance: 999,
    type: "spent",
  },
  {
    id: "2",
    date: "26 Aug 2025",
    time: "9:43 pm",
    task: "Search",
    creditsSpent: 1,
    creditsAdded: 0,
    creditsBalance: 998,
    type: "spent",
  },
  {
    id: "3",
    date: "26 Aug 2025",
    time: "8:08 pm",
    task: "Search",
    creditsSpent: 1,
    creditsAdded: 0,
    creditsBalance: 997,
    type: "spent",
  },
  {
    id: "4",
    date: "26 Aug 2025",
    time: "9:49 pm",
    task: "Search",
    creditsSpent: 1,
    creditsAdded: 0,
    creditsBalance: 996,
    type: "spent",
  },
  {
    id: "5",
    date: "26 Aug 2025",
    time: "9:43 pm",
    task: "Search",
    creditsSpent: 1,
    creditsAdded: 0,
    creditsBalance: 995,
    type: "spent",
  },
  {
    id: "6",
    date: "25 Aug 2025",
    time: "10:30 am",
    task: "Credit Purchase",
    creditsSpent: 0,
    creditsAdded: 500,
    creditsBalance: 1500,
    type: "added",
    description: "Monthly credit package",
  },
  {
    id: "7",
    date: "24 Aug 2025",
    time: "2:15 pm",
    task: "Refund",
    creditsSpent: 0,
    creditsAdded: 50,
    creditsBalance: 1000,
    type: "refund",
    description: "Failed search refund",
  },
];

export default function SpendingHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter data based on search and filter type
  const filteredData = mockData.filter((record) => {
    const matchesSearch =
      record.task.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || record.type === filterType;
    return matchesSearch && matchesFilter;
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Calculate summary stats
  const totalSpent = filteredData.reduce(
    (sum, record) => sum + record.creditsSpent,
    0,
  );
  const totalAdded = filteredData.reduce(
    (sum, record) => sum + record.creditsAdded,
    0,
  );
  const currentBalance = filteredData[0]?.creditsBalance || 0;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "spent":
        return <TrendingDown className="h-4 w-4" />;
      case "added":
        return <TrendingUp className="h-4 w-4" />;
      case "refund":
        return <Minus className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "spent":
        return "destructive";
      case "added":
        return "default";
      case "refund":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-valasys-gray-900">
              Spending History
            </h1>
            <p className="text-valasys-gray-600 mt-1">
              Track your credit usage and spending patterns
            </p>
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export History
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-valasys-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-valasys-gray-600">
                Total Credits Spent
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {totalSpent}
              </div>
              <p className="text-xs text-valasys-gray-500 mt-1">This period</p>
            </CardContent>
          </Card>

          <Card className="border-valasys-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-valasys-gray-600">
                Credits Added
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {totalAdded}
              </div>
              <p className="text-xs text-valasys-gray-500 mt-1">This period</p>
            </CardContent>
          </Card>

          <Card className="border-valasys-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-valasys-gray-600">
                Current Balance
              </CardTitle>
              <div className="h-4 w-4 bg-valasys-orange rounded-full" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-valasys-orange">
                {currentBalance}
              </div>
              <p className="text-xs text-valasys-gray-500 mt-1">
                Available credits
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Spending Records</CardTitle>
            <CardDescription>
              Detailed breakdown of your credit transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-valasys-gray-400" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Transactions</SelectItem>
                  <SelectItem value="spent">Credits Spent</SelectItem>
                  <SelectItem value="added">Credits Added</SelectItem>
                  <SelectItem value="refund">Refunds</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            <div className="rounded-lg border border-valasys-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-valasys-gray-50 border-b border-valasys-gray-200">
                    <tr>
                      <th className="text-left p-4 font-medium text-valasys-gray-900">
                        Date
                      </th>
                      <th className="text-left p-4 font-medium text-valasys-gray-900">
                        Time
                      </th>
                      <th className="text-left p-4 font-medium text-valasys-gray-900">
                        Task
                      </th>
                      <th className="text-right p-4 font-medium text-valasys-gray-900">
                        Credits Spent
                      </th>
                      <th className="text-right p-4 font-medium text-valasys-gray-900">
                        Credits Added
                      </th>
                      <th className="text-right p-4 font-medium text-valasys-gray-900">
                        Balance
                      </th>
                      <th className="text-left p-4 font-medium text-valasys-gray-900">
                        Type
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.map((record, index) => (
                      <tr
                        key={record.id}
                        className={cn(
                          "border-b border-valasys-gray-100 hover:bg-valasys-gray-25 transition-colors",
                          index % 2 === 0 ? "bg-white" : "bg-valasys-gray-25",
                        )}
                      >
                        <td className="p-4 text-valasys-gray-900 font-medium">
                          {record.date}
                        </td>
                        <td className="p-4 text-valasys-gray-600">
                          {record.time}
                        </td>
                        <td className="p-4">
                          <div>
                            <div className="text-valasys-gray-900 font-medium">
                              {record.task}
                            </div>
                            {record.description && (
                              <div className="text-sm text-valasys-gray-500">
                                {record.description}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          {record.creditsSpent > 0 ? (
                            <span className="text-red-600 font-medium">
                              -{record.creditsSpent}
                            </span>
                          ) : (
                            <span className="text-valasys-gray-400">-</span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          {record.creditsAdded > 0 ? (
                            <span className="text-green-600 font-medium">
                              +{record.creditsAdded}
                            </span>
                          ) : (
                            <span className="text-valasys-gray-400">-</span>
                          )}
                        </td>
                        <td className="p-4 text-right font-medium text-valasys-gray-900">
                          {record.creditsBalance}
                        </td>
                        <td className="p-4">
                          <Badge
                            variant={getTypeColor(record.type) as any}
                            className="flex items-center gap-1 w-fit"
                          >
                            {getTypeIcon(record.type)}
                            {record.type.charAt(0).toUpperCase() +
                              record.type.slice(1)}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-valasys-gray-600">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(currentPage * itemsPerPage, filteredData.length)} of{" "}
                  {filteredData.length} results
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <Button
                          key={page}
                          variant={page === currentPage ? "default" : "outline"}
                          size="sm"
                          className="w-8 h-8 p-0"
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </Button>
                      ),
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
