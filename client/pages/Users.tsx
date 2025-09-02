import React, { useState, useMemo } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Users as UsersIcon,
  UserPlus,
  Search,
  Filter,
  RefreshCw,
  Settings2,
  MoreHorizontal,
  Edit,
  Trash2,
  Mail,
  Key,
  DollarSign,
  Target,
  Activity,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  Upload,
  FileText,
  Shield,
  CheckCircle,
  XCircle,
  AlertCircle,
  Crown,
  UserCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface UserData {
  id: string;
  name: string;
  email: string;
  creditAmount: number;
  searchesLeft: number;
  status: "active" | "inactive";
  role: "admin" | "user" | "manager";
  avatar?: string;
  lastLogin?: Date;
  createdAt: Date;
  department?: string;
  totalSearches: number;
  totalCreditsUsed: number;
}

// Sample user data
const sampleUsers: UserData[] = [
  {
    id: "1",
    name: "John Anderson",
    email: "john.anderson@company.com",
    creditAmount: 5000,
    searchesLeft: 45,
    status: "active",
    role: "admin",
    lastLogin: new Date("2024-01-15T10:30:00Z"),
    createdAt: new Date("2023-06-15T09:00:00Z"),
    department: "Marketing",
    totalSearches: 156,
    totalCreditsUsed: 12500,
  },
  {
    id: "2",
    name: "Sarah Mitchell",
    email: "sarah.mitchell@company.com",
    creditAmount: 3200,
    searchesLeft: 28,
    status: "active",
    role: "manager",
    lastLogin: new Date("2024-01-14T16:45:00Z"),
    createdAt: new Date("2023-08-20T11:00:00Z"),
    department: "Sales",
    totalSearches: 89,
    totalCreditsUsed: 7800,
  },
  {
    id: "3",
    name: "Michael Chen",
    email: "michael.chen@company.com",
    creditAmount: 1500,
    searchesLeft: 15,
    status: "active",
    role: "user",
    lastLogin: new Date("2024-01-12T14:20:00Z"),
    createdAt: new Date("2023-11-05T13:30:00Z"),
    department: "Product",
    totalSearches: 34,
    totalCreditsUsed: 2100,
  },
  {
    id: "4",
    name: "Emily Rodriguez",
    email: "emily.rodriguez@company.com",
    creditAmount: 2800,
    searchesLeft: 32,
    status: "inactive",
    role: "user",
    lastLogin: new Date("2023-12-28T09:15:00Z"),
    createdAt: new Date("2023-09-10T10:45:00Z"),
    department: "Marketing",
    totalSearches: 67,
    totalCreditsUsed: 4500,
  },
  {
    id: "5",
    name: "David Kim",
    email: "david.kim@company.com",
    creditAmount: 4200,
    searchesLeft: 38,
    status: "active",
    role: "manager",
    lastLogin: new Date("2024-01-13T12:10:00Z"),
    createdAt: new Date("2023-07-22T14:20:00Z"),
    department: "Business Development",
    totalSearches: 112,
    totalCreditsUsed: 9300,
  },
  {
    id: "6",
    name: "Lisa Thompson",
    email: "lisa.thompson@company.com",
    creditAmount: 800,
    searchesLeft: 8,
    status: "active",
    role: "user",
    lastLogin: new Date("2024-01-11T08:30:00Z"),
    createdAt: new Date("2023-12-01T16:00:00Z"),
    department: "Operations",
    totalSearches: 19,
    totalCreditsUsed: 950,
  },
  {
    id: "7",
    name: "Robert Johnson",
    email: "robert.johnson@company.com",
    creditAmount: 6500,
    searchesLeft: 55,
    status: "active",
    role: "admin",
    lastLogin: new Date("2024-01-15T11:45:00Z"),
    createdAt: new Date("2023-05-10T08:15:00Z"),
    department: "IT",
    totalSearches: 203,
    totalCreditsUsed: 18700,
  },
  {
    id: "8",
    name: "Jennifer Wilson",
    email: "jennifer.wilson@company.com",
    creditAmount: 0,
    searchesLeft: 0,
    status: "inactive",
    role: "user",
    lastLogin: new Date("2023-11-20T15:30:00Z"),
    createdAt: new Date("2023-10-15T12:00:00Z"),
    department: "HR",
    totalSearches: 25,
    totalCreditsUsed: 1200,
  },
];

export default function Users() {
  const [users, setUsers] = useState<UserData[]>(sampleUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<keyof UserData>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filters, setFilters] = useState({
    status: "",
    role: "",
    department: "",
    creditRange: { min: 0, max: 10000 },
  });

  // Add/Edit User Dialog States
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    creditAmount: 1000,
    searchesLeft: 10,
    role: "user" as "admin" | "user" | "manager",
    department: "",
  });

  // Filter and search data
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.department?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = !filters.status || user.status === filters.status;
      const matchesRole = !filters.role || user.role === filters.role;
      const matchesDepartment =
        !filters.department || user.department === filters.department;
      const matchesCredits =
        user.creditAmount >= filters.creditRange.min &&
        user.creditAmount <= filters.creditRange.max;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesRole &&
        matchesDepartment &&
        matchesCredits
      );
    });
  }, [users, searchTerm, filters]);

  // Sort data
  const sortedUsers = useMemo(() => {
    return [...filteredUsers].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();

      if (sortDirection === "asc") {
        return aStr.localeCompare(bStr);
      } else {
        return bStr.localeCompare(aStr);
      }
    });
  }, [filteredUsers, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = sortedUsers.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handleSort = (field: keyof UserData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleStatusToggle = (userId: string, newStatus: boolean) => {
    setUsers(
      users.map((user) =>
        user.id === userId
          ? { ...user, status: newStatus ? "active" : "inactive" }
          : user,
      ),
    );
  };

  const handleAddUser = () => {
    const user: UserData = {
      id: Date.now().toString(),
      ...newUser,
      status: "active",
      createdAt: new Date(),
      totalSearches: 0,
      totalCreditsUsed: 0,
    };
    setUsers([...users, user]);
    setNewUser({
      name: "",
      email: "",
      creditAmount: 1000,
      searchesLeft: 10,
      role: "user",
      department: "",
    });
    setShowAddUserDialog(false);
  };

  const handleEditUser = (user: UserData) => {
    setEditingUser(user);
    setNewUser({
      name: user.name,
      email: user.email,
      creditAmount: user.creditAmount,
      searchesLeft: user.searchesLeft,
      role: user.role,
      department: user.department || "",
    });
  };

  const handleUpdateUser = () => {
    if (editingUser) {
      setUsers(
        users.map((user) =>
          user.id === editingUser.id ? { ...user, ...newUser } : user,
        ),
      );
      setEditingUser(null);
      setNewUser({
        name: "",
        email: "",
        creditAmount: 1000,
        searchesLeft: 10,
        role: "user",
        department: "",
      });
    }
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter((user) => user.id !== userId));
    setDeleteUserId(null);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Crown className="w-4 h-4 text-yellow-600" />;
      case "manager":
        return <UserCheck className="w-4 h-4 text-blue-600" />;
      default:
        return <UsersIcon className="w-4 h-4 text-gray-600" />;
    }
  };

  const getRoleBadge = (role: string) => {
    const colors = {
      admin: "bg-yellow-100 text-yellow-800 border-yellow-200",
      manager: "bg-blue-100 text-blue-800 border-blue-200",
      user: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return cn(
      "border text-xs font-medium",
      colors[role as keyof typeof colors],
    );
  };

  const getStatusIcon = (status: string) => {
    return status === "active" ? (
      <CheckCircle className="w-4 h-4 text-green-500" />
    ) : (
      <XCircle className="w-4 h-4 text-red-500" />
    );
  };

  const formatDate = (date: Date) => {
    return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
      Math.floor((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      "day",
    );
  };

  const getUserInitials = (name: string) => {
    const names = name.split(" ");
    return names
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const resetForm = () => {
    setNewUser({
      name: "",
      email: "",
      creditAmount: 1000,
      searchesLeft: 10,
      role: "user",
      department: "",
    });
    setEditingUser(null);
  };

  return (
    <TooltipProvider>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-gradient-to-r from-valasys-orange to-valasys-orange-light rounded-lg flex items-center justify-center">
                  <UsersIcon className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Manage Users
                </h1>
              </div>
              <p className="text-gray-600 mt-1">
                Manage user accounts, credits, and permissions
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                <Activity className="w-3 h-3 mr-1" />
                Total Users:{" "}
                <span className="font-bold ml-1">{users.length}</span>
              </Badge>
              <Badge variant="secondary" className="bg-green-50 text-green-700">
                <CheckCircle className="w-3 h-3 mr-1" />
                Active:{" "}
                <span className="font-bold ml-1">
                  {users.filter((u) => u.status === "active").length}
                </span>
              </Badge>
              <Dialog
                open={showAddUserDialog}
                onOpenChange={setShowAddUserDialog}
              >
                <DialogTrigger asChild>
                  <Button className="bg-valasys-orange hover:bg-valasys-orange/90">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add User
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>
                      {editingUser ? "Edit User" : "Add New User"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingUser
                        ? "Update user information and permissions"
                        : "Create a new user account with initial credits and permissions"}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="Enter full name"
                        value={newUser.name}
                        onChange={(e) =>
                          setNewUser({ ...newUser, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter email address"
                        value={newUser.email}
                        onChange={(e) =>
                          setNewUser({ ...newUser, email: e.target.value })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="credits">Credit Amount</Label>
                        <Input
                          id="credits"
                          type="number"
                          placeholder="1000"
                          value={newUser.creditAmount}
                          onChange={(e) =>
                            setNewUser({
                              ...newUser,
                              creditAmount: parseInt(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="searches">Searches Left</Label>
                        <Input
                          id="searches"
                          type="number"
                          placeholder="10"
                          value={newUser.searchesLeft}
                          onChange={(e) =>
                            setNewUser({
                              ...newUser,
                              searchesLeft: parseInt(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select
                        value={newUser.role}
                        onValueChange={(value: "admin" | "user" | "manager") =>
                          setNewUser({ ...newUser, role: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">
                            <div className="flex items-center">
                              <UsersIcon className="w-4 h-4 mr-2 text-gray-600" />
                              User
                            </div>
                          </SelectItem>
                          <SelectItem value="manager">
                            <div className="flex items-center">
                              <UserCheck className="w-4 h-4 mr-2 text-blue-600" />
                              Manager
                            </div>
                          </SelectItem>
                          <SelectItem value="admin">
                            <div className="flex items-center">
                              <Crown className="w-4 h-4 mr-2 text-yellow-600" />
                              Admin
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        placeholder="e.g., Marketing, Sales, IT"
                        value={newUser.department}
                        onChange={(e) =>
                          setNewUser({ ...newUser, department: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => {
                        resetForm();
                        setShowAddUserDialog(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={editingUser ? handleUpdateUser : handleAddUser}
                      disabled={!newUser.name || !newUser.email}
                      className="bg-valasys-orange hover:bg-valasys-orange/90"
                    >
                      {editingUser ? "Update User" : "Add User"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Controls */}
          <Card className="shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Advanced Filters
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export Users
                  </Button>
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Import Users
                  </Button>
                </div>
                <div className="text-sm text-gray-500">
                  Page: <span className="font-medium">{currentPage}</span> of{" "}
                  <span className="font-medium">{totalPages}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select
                  value={filters.status || "all"}
                  onValueChange={(value) =>
                    setFilters({
                      ...filters,
                      status: value === "all" ? "" : value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                        Active
                      </div>
                    </SelectItem>
                    <SelectItem value="inactive">
                      <div className="flex items-center">
                        <XCircle className="w-4 h-4 mr-2 text-red-500" />
                        Inactive
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filters.role || "all"}
                  onValueChange={(value) =>
                    setFilters({
                      ...filters,
                      role: value === "all" ? "" : value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filters.department || "all"}
                  onValueChange={(value) =>
                    setFilters({
                      ...filters,
                      department: value === "all" ? "" : value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="IT">IT</SelectItem>
                    <SelectItem value="Product">Product</SelectItem>
                    <SelectItem value="Operations">Operations</SelectItem>
                    <SelectItem value="HR">HR</SelectItem>
                    <SelectItem value="Business Development">
                      Business Development
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  onClick={() =>
                    setFilters({
                      status: "",
                      role: "",
                      department: "",
                      creditRange: { min: 0, max: 10000 },
                    })
                  }
                  variant="outline"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* User Table */}
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">User Management</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 hover:bg-gray-50">
                      <TableHead
                        className="cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleSort("name")}
                      >
                        <div className="flex items-center justify-between">
                          Name
                          <div className="ml-2">
                            {sortField === "name" ? (
                              <span className="text-valasys-orange">
                                {sortDirection === "asc" ? "↑" : "↓"}
                              </span>
                            ) : (
                              <span className="text-gray-400">↕</span>
                            )}
                          </div>
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleSort("email")}
                      >
                        <div className="flex items-center justify-between">
                          Email
                          <div className="ml-2">
                            {sortField === "email" ? (
                              <span className="text-valasys-orange">
                                {sortDirection === "asc" ? "↑" : "↓"}
                              </span>
                            ) : (
                              <span className="text-gray-400">↕</span>
                            )}
                          </div>
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleSort("creditAmount")}
                      >
                        <div className="flex items-center justify-between">
                          Credit Amount
                          <div className="ml-2">
                            {sortField === "creditAmount" ? (
                              <span className="text-valasys-orange">
                                {sortDirection === "asc" ? "↑" : "↓"}
                              </span>
                            ) : (
                              <span className="text-gray-400">↕</span>
                            )}
                          </div>
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleSort("searchesLeft")}
                      >
                        <div className="flex items-center justify-between">
                          Searches Left
                          <div className="ml-2">
                            {sortField === "searchesLeft" ? (
                              <span className="text-valasys-orange">
                                {sortDirection === "asc" ? "↑" : "��"}
                              </span>
                            ) : (
                              <span className="text-gray-400">↕</span>
                            )}
                          </div>
                        </div>
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-20">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedUsers.map((user) => (
                      <TableRow
                        key={user.id}
                        className="hover:bg-blue-50/50 transition-colors"
                      >
                        {/* Name */}
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={user.avatar} alt={user.name} />
                              <AvatarFallback className="bg-valasys-orange text-white text-sm">
                                {getUserInitials(user.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-gray-900 flex items-center">
                                {user.name}
                                <div className="ml-2">
                                  {getRoleIcon(user.role)}
                                </div>
                              </div>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge className={getRoleBadge(user.role)}>
                                  {user.role}
                                </Badge>
                                {user.department && (
                                  <Badge variant="outline" className="text-xs">
                                    {user.department}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </TableCell>

                        {/* Email */}
                        <TableCell>
                          <div>
                            <div className="font-medium text-gray-900 flex items-center">
                              <Mail className="w-4 h-4 mr-2 text-gray-400" />
                              {user.email}
                            </div>
                            {user.lastLogin && (
                              <div className="text-sm text-gray-500 mt-1">
                                Last login: {formatDate(user.lastLogin)}
                              </div>
                            )}
                          </div>
                        </TableCell>

                        {/* Credit Amount */}
                        <TableCell>
                          <div className="flex items-center">
                            <DollarSign className="w-4 h-4 mr-1 text-green-600" />
                            <span className="font-medium text-gray-900">
                              {user.creditAmount.toLocaleString()}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Used: {user.totalCreditsUsed.toLocaleString()}
                          </div>
                        </TableCell>

                        {/* Searches Left */}
                        <TableCell>
                          <div className="flex items-center">
                            <Target className="w-4 h-4 mr-1 text-blue-600" />
                            <span className="font-medium text-gray-900">
                              {user.searchesLeft}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Total: {user.totalSearches}
                          </div>
                        </TableCell>

                        {/* Status Toggle */}
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Switch
                              checked={user.status === "active"}
                              onCheckedChange={(checked) =>
                                handleStatusToggle(user.id, checked)
                              }
                            />
                            <div className="flex items-center">
                              {getStatusIcon(user.status)}
                              <span
                                className={cn(
                                  "ml-1 text-sm font-medium",
                                  user.status === "active"
                                    ? "text-green-700"
                                    : "text-red-700",
                                )}
                              >
                                {user.status === "active"
                                  ? "Active"
                                  : "Inactive"}
                              </span>
                            </div>
                          </div>
                        </TableCell>

                        {/* Actions */}
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem
                                onClick={() => {
                                  handleEditUser(user);
                                  setShowAddUserDialog(true);
                                }}
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit User
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Key className="w-4 h-4 mr-2" />
                                Reset Password
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Mail className="w-4 h-4 mr-2" />
                                Send Invite
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => setDeleteUserId(user.id)}
                                className="text-red-600 focus:text-red-600"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between p-4 border-t bg-gray-50">
                <div className="text-sm text-gray-600">
                  Showing {startIndex + 1} to{" "}
                  {Math.min(startIndex + itemsPerPage, sortedUsers.length)} of{" "}
                  {sortedUsers.length} users
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>

                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <Button
                          key={pageNum}
                          variant={
                            pageNum === currentPage ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                          className={cn(
                            "w-8 h-8 p-0",
                            pageNum === currentPage &&
                              "bg-valasys-orange hover:bg-valasys-orange/90",
                          )}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                    {totalPages > 5 && (
                      <span className="text-gray-500">...</span>
                    )}
                    {totalPages > 5 && (
                      <Button
                        variant={
                          totalPages === currentPage ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setCurrentPage(totalPages)}
                        className={cn(
                          "w-8 h-8 p-0",
                          totalPages === currentPage &&
                            "bg-valasys-orange hover:bg-valasys-orange/90",
                        )}
                      >
                        {totalPages}
                      </Button>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delete Confirmation Dialog */}
          <AlertDialog
            open={deleteUserId !== null}
            onOpenChange={() => setDeleteUserId(null)}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete User</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this user? This action cannot
                  be undone and will permanently remove their account and data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => deleteUserId && handleDeleteUser(deleteUserId)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete User
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </DashboardLayout>
    </TooltipProvider>
  );
}
