import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bell,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  Info,
  Clock,
  MoreHorizontal,
  Archive,
  Trash2,
  RefreshCw,
  Download,
  Settings,
  Eye,
  EyeOff,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Extended notification data with more variety
const allNotifications = [
  {
    id: 1,
    title: "VAIS Campaign Completed",
    message:
      "Your 'Enterprise Software Q3' campaign has been successfully processed with 1,247 prospects identified. The results are now available for download.",
    time: "2 minutes ago",
    date: "2024-01-15",
    type: "success",
    category: "campaigns",
    unread: true,
    priority: "high",
  },
  {
    id: 2,
    title: "Credit Usage Alert",
    message:
      "You have used 85% of your monthly credits. Consider upgrading your plan to continue using all features without interruption.",
    time: "1 hour ago",
    date: "2024-01-15",
    type: "warning",
    category: "billing",
    unread: true,
    priority: "medium",
  },
  {
    id: 3,
    title: "New Feature Available",
    message:
      "Check out our new Intent Signal Analytics dashboard for deeper insights into prospect behavior and engagement patterns.",
    time: "3 hours ago",
    date: "2024-01-15",
    type: "info",
    category: "features",
    unread: true,
    priority: "low",
  },
  {
    id: 4,
    title: "Weekly Report Ready",
    message:
      "Your weekly performance report is ready for download. It includes campaign metrics, prospect engagement, and ROI analysis.",
    time: "1 day ago",
    date: "2024-01-14",
    type: "info",
    category: "reports",
    unread: false,
    priority: "low",
  },
  {
    id: 5,
    title: "Support Ticket Update",
    message:
      "Your support ticket #12345 regarding data export issues has been resolved. The fix has been implemented successfully.",
    time: "2 days ago",
    date: "2024-01-13",
    type: "success",
    category: "support",
    unread: false,
    priority: "medium",
  },
  {
    id: 6,
    title: "System Maintenance Scheduled",
    message:
      "Scheduled maintenance will occur on January 20th from 2:00 AM to 4:00 AM EST. Services may be temporarily unavailable.",
    time: "3 days ago",
    date: "2024-01-12",
    type: "warning",
    category: "system",
    unread: false,
    priority: "high",
  },
  {
    id: 7,
    title: "ABM Campaign Launch",
    message:
      "Your Account-Based Marketing campaign 'Tech Leaders 2024' has been successfully launched and is now actively targeting prospects.",
    time: "5 days ago",
    date: "2024-01-10",
    type: "success",
    category: "campaigns",
    unread: false,
    priority: "medium",
  },
  {
    id: 8,
    title: "Data Quality Alert",
    message:
      "We've detected some data quality issues in your recent upload. Please review the flagged records in your dashboard.",
    time: "1 week ago",
    date: "2024-01-08",
    type: "warning",
    category: "data",
    unread: false,
    priority: "medium",
  },
  {
    id: 9,
    title: "Integration Success",
    message:
      "Your CRM integration with Salesforce has been completed successfully. Data sync is now active and running smoothly.",
    time: "1 week ago",
    date: "2024-01-07",
    type: "success",
    category: "integrations",
    unread: false,
    priority: "low",
  },
  {
    id: 10,
    title: "Monthly Analytics Summary",
    message:
      "Your January analytics summary is available. View insights on campaign performance, prospect engagement, and conversion rates.",
    time: "2 weeks ago",
    date: "2024-01-01",
    type: "info",
    category: "reports",
    unread: false,
    priority: "low",
  },
];

export default function AllNotifications() {
  const [notifications, setNotifications] = useState(allNotifications);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedNotifications, setSelectedNotifications] = useState<number[]>(
    [],
  );

  // Filter notifications based on search and filters
  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || notification.category === selectedCategory;
    const matchesType =
      selectedType === "all" || notification.type === selectedType;
    const matchesStatus =
      selectedStatus === "all" ||
      (selectedStatus === "unread" && notification.unread) ||
      (selectedStatus === "read" && !notification.unread);

    return matchesSearch && matchesCategory && matchesType && matchesStatus;
  });

  // Statistics
  const unreadCount = notifications.filter((n) => n.unread).length;
  const todayCount = notifications.filter(
    (n) => n.date === "2024-01-15",
  ).length;

  // Actions
  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n)),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const deleteNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const toggleSelection = (id: number) => {
    setSelectedNotifications((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-4 h-4" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4" />;
      case "info":
        return <Info className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-100 text-green-600";
      case "warning":
        return "bg-yellow-100 text-yellow-600";
      case "info":
        return "bg-blue-100 text-blue-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-100 text-red-800 text-xs">High</Badge>;
      case "medium":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 text-xs">
            Medium
          </Badge>
        );
      case "low":
        return (
          <Badge className="bg-green-100 text-green-800 text-xs">Low</Badge>
        );
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="page-header">
          <div className="space-y-2 mb-6">
            <h1 className="text-2xl font-bold text-valasys-gray-900 flex items-center">
              <div className="w-8 h-8 rounded-full bg-valasys-orange flex items-center justify-center mr-3">
                <Bell className="w-5 h-5 text-white" />
              </div>
              All Notifications
            </h1>
            <p className="text-valasys-gray-600">
              Manage and view all your notifications from campaigns, system
              updates, and account activities.
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-valasys-orange/10 rounded-lg flex items-center justify-center">
                  <Bell className="w-5 h-5 text-valasys-orange" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {notifications.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <EyeOff className="w-5 h-5 text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Unread</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {unreadCount}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-green-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Today</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {todayCount}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Archive className="w-5 h-5 text-purple-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Archived</p>
                  <p className="text-2xl font-bold text-gray-900">0</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Actions */}
        <Card>
          <CardHeader>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <CardTitle className="flex items-center">
                <Filter className="w-5 h-5 mr-2 text-valasys-orange" />
                Filters & Search
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={markAllAsRead}
                  disabled={unreadCount === 0}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark All Read
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Category Filter */}
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="campaigns">Campaigns</SelectItem>
                  <SelectItem value="billing">Billing</SelectItem>
                  <SelectItem value="features">Features</SelectItem>
                  <SelectItem value="reports">Reports</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                  <SelectItem value="data">Data</SelectItem>
                  <SelectItem value="integrations">Integrations</SelectItem>
                </SelectContent>
              </Select>

              {/* Type Filter */}
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="unread">Unread</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                </SelectContent>
              </Select>

              {/* Refresh Button */}
              <Button variant="outline" className="w-full">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications List */}
        <Card>
          <CardHeader>
            <CardTitle>
              Notifications ({filteredNotifications.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {filteredNotifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No notifications found
                  </h3>
                  <p className="text-gray-600">
                    Try adjusting your search or filter criteria.
                  </p>
                </div>
              ) : (
                filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "p-6 hover:bg-gray-50 transition-colors",
                      notification.unread &&
                        "bg-blue-50/30 border-l-4 border-l-valasys-orange",
                    )}
                  >
                    <div className="flex items-start space-x-4">
                      {/* Selection Checkbox */}
                      <input
                        type="checkbox"
                        className="mt-1"
                        checked={selectedNotifications.includes(
                          notification.id,
                        )}
                        onChange={() => toggleSelection(notification.id)}
                      />

                      {/* Icon */}
                      <div className="flex-shrink-0 mt-1">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center",
                            getTypeColor(notification.type),
                          )}
                        >
                          {getTypeIcon(notification.type)}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4
                                className={cn(
                                  "text-base font-medium text-gray-900",
                                  notification.unread && "font-semibold",
                                )}
                              >
                                {notification.title}
                              </h4>
                              {getPriorityBadge(notification.priority)}
                              {notification.unread && (
                                <div className="w-2 h-2 bg-valasys-orange rounded-full"></div>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-2 leading-relaxed">
                              {notification.message}
                            </p>
                            <div className="flex items-center space-x-4 text-xs text-gray-400">
                              <span className="flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {notification.time}
                              </span>
                              <Badge
                                variant="outline"
                                className="text-xs capitalize"
                              >
                                {notification.category}
                              </Badge>
                              <Badge
                                variant="outline"
                                className="text-xs capitalize"
                              >
                                {notification.type}
                              </Badge>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center space-x-2 ml-4">
                            {notification.unread && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                deleteNotification(notification.id)
                              }
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Bulk Actions */}
        {selectedNotifications.length > 0 && (
          <Card className="border-valasys-orange">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {selectedNotifications.length} notification(s) selected
                </span>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark as Read
                  </Button>
                  <Button variant="outline" size="sm">
                    <Archive className="w-4 h-4 mr-2" />
                    Archive
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
