import React, { useState, useMemo } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ArrowLeft,
  Download,
  Filter,
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
  Settings2,
  RefreshCw,
  Users,
  Target,
  Maximize,
  BarChart3,
  Building,
  Mail,
  Phone,
  Linkedin,
  MapPin,
  Calendar,
  Star,
  ExternalLink,
  Send,
  UserPlus,
  Share2,
  Zap,
  TrendingUp,
  Globe,
  MessageCircle,
  CheckCircle,
  Clock,
  Activity,
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface ProspectData {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone?: string;
  linkedinUrl?: string;
  jobTitle: string;
  jobLevel: string;
  jobFunction: string;
  department?: string;
  companyName: string;
  companyDomain: string;
  companySize: string;
  industry: string;
  revenue: string;
  country: string;
  city: string;
  state?: string;
  profileImageUrl?: string;

  // Engagement & Intent Data
  engagementScore: number;
  intentScore: number;
  intentSignal: string;
  lastActivity: Date;
  recentActivities: string[];
  matchedTopics: string[];
  confidenceScore: number;

  // Additional Information
  yearsAtCompany?: number;
  totalExperience?: number;
  previousCompanies?: string[];
  education?: string;
  skills?: string[];
  socialMedia?: {
    twitter?: string;
    github?: string;
  };

  selected: boolean;
}

// Enhanced sample data for prospects
const sampleProspectData: ProspectData[] = [
  {
    id: "1",
    firstName: "Sarah",
    lastName: "Johnson",
    fullName: "Sarah Johnson",
    email: "sarah.johnson@autodesk.com",
    phone: "+1-415-555-0123",
    linkedinUrl: "https://linkedin.com/in/sarahjohnson",
    jobTitle: "Senior Product Manager",
    jobLevel: "Senior",
    jobFunction: "Product",
    department: "AutoCAD Division",
    companyName: "Autodesk",
    companyDomain: "autodesk.com",
    companySize: "5001-10000",
    industry: "Software and IT Services",
    revenue: "$1B - $10B",
    country: "USA",
    city: "San Francisco",
    state: "CA",
    profileImageUrl: "/api/placeholder/40/40",
    engagementScore: 92,
    intentScore: 87,
    intentSignal: "Very Strong",
    lastActivity: new Date("2024-01-15"),
    recentActivities: [
      "Downloaded whitepaper",
      "Attended webinar",
      "Visited pricing page",
    ],
    matchedTopics: ["3D Modeling", "CAD Software", "Product Development"],
    confidenceScore: 95,
    yearsAtCompany: 3,
    totalExperience: 8,
    previousCompanies: ["Adobe", "Salesforce"],
    education: "Stanford University - MBA",
    skills: ["Product Strategy", "3D Design", "Team Leadership"],
    socialMedia: {
      twitter: "@sarahj_pm",
    },
    selected: false,
  },
  {
    id: "2",
    firstName: "Michael",
    lastName: "Chen",
    fullName: "Michael Chen",
    email: "m.chen@bentley.com",
    phone: "+1-610-555-0187",
    linkedinUrl: "https://linkedin.com/in/michaelchen-eng",
    jobTitle: "Director of Engineering",
    jobLevel: "Director",
    jobFunction: "Engineering",
    department: "Infrastructure Solutions",
    companyName: "Bentley Systems",
    companyDomain: "bentley.com",
    companySize: "1001-5000",
    industry: "Software and IT Services",
    revenue: "$500M - $1B",
    country: "USA",
    city: "Exton",
    state: "PA",
    profileImageUrl: "/api/placeholder/40/40",
    engagementScore: 88,
    intentScore: 91,
    intentSignal: "Super Strong",
    lastActivity: new Date("2024-01-12"),
    recentActivities: ["Requested demo", "Downloaded trial", "Contacted sales"],
    matchedTopics: ["Infrastructure Design", "BIM", "Engineering Software"],
    confidenceScore: 93,
    yearsAtCompany: 5,
    totalExperience: 12,
    previousCompanies: ["Siemens", "ANSYS"],
    education: "MIT - MS Engineering",
    skills: ["Software Architecture", "Team Management", "Infrastructure"],
    socialMedia: {
      github: "mchen-dev",
    },
    selected: false,
  },
  {
    id: "3",
    firstName: "Emma",
    lastName: "Rodriguez",
    fullName: "Emma Rodriguez",
    email: "emma.rodriguez@dassault.fr",
    phone: "+33-1-55-55-0123",
    linkedinUrl: "https://linkedin.com/in/emmarodriguez",
    jobTitle: "VP of Sales",
    jobLevel: "VP",
    jobFunction: "Sales",
    department: "Global Sales",
    companyName: "Dassault Systèmes",
    companyDomain: "3ds.com",
    companySize: "10001-50000",
    industry: "Software and IT Services",
    revenue: "$1B - $10B",
    country: "France",
    city: "Vélizy-Villacoublay",
    profileImageUrl: "/api/placeholder/40/40",
    engagementScore: 85,
    intentScore: 89,
    intentSignal: "Strong",
    lastActivity: new Date("2024-01-10"),
    recentActivities: [
      "Viewed competitor analysis",
      "Shared content",
      "Attended conference",
    ],
    matchedTopics: ["PLM Software", "CATIA", "Digital Manufacturing"],
    confidenceScore: 90,
    yearsAtCompany: 7,
    totalExperience: 15,
    previousCompanies: ["SAP", "Oracle"],
    education: "HEC Paris - MBA",
    skills: ["Enterprise Sales", "PLM", "Strategic Partnerships"],
    selected: false,
  },
  {
    id: "4",
    firstName: "David",
    lastName: "Kim",
    fullName: "David Kim",
    email: "david.kim@siemens.com",
    phone: "+49-89-555-0199",
    linkedinUrl: "https://linkedin.com/in/davidkim-plm",
    jobTitle: "Chief Technology Officer",
    jobLevel: "C-Level",
    jobFunction: "Engineering",
    department: "PLM Software Division",
    companyName: "Siemens PLM Software",
    companyDomain: "siemens.com",
    companySize: "50001+",
    industry: "Software and IT Services",
    revenue: "$10B+",
    country: "Germany",
    city: "Munich",
    profileImageUrl: "/api/placeholder/40/40",
    engagementScore: 94,
    intentScore: 86,
    intentSignal: "Very Strong",
    lastActivity: new Date("2024-01-14"),
    recentActivities: [
      "Strategic planning session",
      "Industry report download",
      "Partnership inquiry",
    ],
    matchedTopics: ["Digital Transformation", "Industry 4.0", "Manufacturing"],
    confidenceScore: 92,
    yearsAtCompany: 6,
    totalExperience: 18,
    previousCompanies: ["PTC", "Autodesk"],
    education: "Carnegie Mellon - PhD Computer Science",
    skills: ["Digital Manufacturing", "IoT", "Strategic Vision"],
    selected: false,
  },
  {
    id: "5",
    firstName: "Jennifer",
    lastName: "Taylor",
    fullName: "Jennifer Taylor",
    email: "j.taylor@ansys.com",
    phone: "+1-724-555-0156",
    linkedinUrl: "https://linkedin.com/in/jennifertaylor",
    jobTitle: "Senior Marketing Manager",
    jobLevel: "Senior",
    jobFunction: "Marketing",
    department: "Product Marketing",
    companyName: "ANSYS",
    companyDomain: "ansys.com",
    companySize: "1001-5000",
    industry: "Software and IT Services",
    revenue: "$1B - $10B",
    country: "USA",
    city: "Canonsburg",
    state: "PA",
    profileImageUrl: "/api/placeholder/40/40",
    engagementScore: 79,
    intentScore: 82,
    intentSignal: "Medium",
    lastActivity: new Date("2024-01-08"),
    recentActivities: [
      "Content engagement",
      "Email opens",
      "Social media activity",
    ],
    matchedTopics: ["Simulation Software", "FEA", "CFD"],
    confidenceScore: 85,
    yearsAtCompany: 4,
    totalExperience: 9,
    previousCompanies: ["Altair", "MSC Software"],
    education: "University of Michigan - MBA Marketing",
    skills: ["Product Marketing", "Demand Generation", "Technical Marketing"],
    selected: false,
  },
  {
    id: "6",
    firstName: "Robert",
    lastName: "Williams",
    fullName: "Robert Williams",
    email: "robert.williams@ptc.com",
    phone: "+1-781-555-0134",
    linkedinUrl: "https://linkedin.com/in/robertwilliams",
    jobTitle: "Engineering Manager",
    jobLevel: "Manager",
    jobFunction: "Engineering",
    department: "Creo Development",
    companyName: "PTC",
    companyDomain: "ptc.com",
    companySize: "5001-10000",
    industry: "Software and IT Services",
    revenue: "$1B - $10B",
    country: "USA",
    city: "Boston",
    state: "MA",
    profileImageUrl: "/api/placeholder/40/40",
    engagementScore: 83,
    intentScore: 78,
    intentSignal: "Medium",
    lastActivity: new Date("2024-01-11"),
    recentActivities: [
      "Technical documentation",
      "Beta testing",
      "User feedback",
    ],
    matchedTopics: ["CAD Development", "Parametric Design", "PLM Integration"],
    confidenceScore: 87,
    yearsAtCompany: 8,
    totalExperience: 14,
    previousCompanies: ["SolidWorks", "Autodesk"],
    education: "Boston University - MS Mechanical Engineering",
    skills: ["Software Development", "CAD Systems", "Team Leadership"],
    selected: false,
  },
];

export default function ProspectResults() {
  const [data, setData] = useState<ProspectData[]>(sampleProspectData);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortField, setSortField] =
    useState<keyof ProspectData>("engagementScore");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedProspect, setSelectedProspect] = useState<ProspectData | null>(
    null,
  );
  const [filters, setFilters] = useState({
    jobFunction: "",
    jobLevel: "",
    company: "",
    country: "",
    intentSignal: "",
    engagementRange: { min: 0, max: 100 },
  });

  // Filter and search data
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch =
        item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesJobFunction =
        !filters.jobFunction || item.jobFunction === filters.jobFunction;
      const matchesJobLevel =
        !filters.jobLevel || item.jobLevel === filters.jobLevel;
      const matchesCompany =
        !filters.company || item.companyName === filters.company;
      const matchesCountry =
        !filters.country || item.country === filters.country;
      const matchesIntentSignal =
        !filters.intentSignal || item.intentSignal === filters.intentSignal;
      const matchesEngagement =
        item.engagementScore >= filters.engagementRange.min &&
        item.engagementScore <= filters.engagementRange.max;

      return (
        matchesSearch &&
        matchesJobFunction &&
        matchesJobLevel &&
        matchesCompany &&
        matchesCountry &&
        matchesIntentSignal &&
        matchesEngagement
      );
    });
  }, [data, searchTerm, filters]);

  // Sort data
  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
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
  }, [filteredData, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (field: keyof ProspectData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(paginatedData.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, id]);
    } else {
      setSelectedItems(selectedItems.filter((item) => item !== id));
    }
  };

  const getEngagementColor = (score: number) => {
    if (score >= 90) return "bg-green-500";
    if (score >= 80) return "bg-green-400";
    if (score >= 70) return "bg-yellow-500";
    if (score >= 60) return "bg-orange-500";
    return "bg-red-500";
  };

  const getIntentSignalColor = (signal: string) => {
    switch (signal) {
      case "Super Strong":
        return "bg-emerald-100 text-emerald-800 border border-emerald-200";
      case "Very Strong":
        return "bg-green-100 text-green-800 border border-green-200";
      case "Strong":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case "Medium":
        return "bg-orange-100 text-orange-800 border border-orange-200";
      case "Weak":
        return "bg-red-100 text-red-800 border border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
      Math.floor((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      "day",
    );
  };

  return (
    <TooltipProvider>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/find-prospect">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-valasys-orange hover:bg-valasys-orange hover:text-white"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Search
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Users className="w-6 h-6 mr-3 text-valasys-orange" />
                  Prospect Results
                </h1>
                <div className="text-sm text-gray-600 mt-1">
                  Showing prospects matching your search criteria
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                <BarChart3 className="w-3 h-3 mr-1" />
                Total Prospects:{" "}
                <span className="font-bold ml-1">
                  {filteredData.length}/2,847
                </span>
              </Badge>
              <Badge variant="secondary" className="bg-green-50 text-green-700">
                <Target className="w-3 h-3 mr-1" />
                Credits Available: <span className="font-bold ml-1">8,450</span>
              </Badge>
            </div>
          </div>

          {/* Controls */}
          <Card className="shadow-sm">
            <CardContent className="p-4">
              {/* Search and Quick Filters */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Advanced Filters
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings2 className="w-4 h-4 mr-2" />
                    Columns
                  </Button>
                  <Button variant="outline" size="sm">
                    <Maximize className="w-4 h-4 mr-2" />
                    Full Screen
                  </Button>
                </div>
                <div className="text-sm text-gray-500">
                  Page: <span className="font-medium">{currentPage}</span> of{" "}
                  <span className="font-medium">{totalPages}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search prospects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select
                  value={filters.jobFunction || "all"}
                  onValueChange={(value) =>
                    setFilters({
                      ...filters,
                      jobFunction: value === "all" ? "" : value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Job Function" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Functions</SelectItem>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Product">Product</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filters.jobLevel || "all"}
                  onValueChange={(value) =>
                    setFilters({
                      ...filters,
                      jobLevel: value === "all" ? "" : value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Job Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="C-Level">C-Level</SelectItem>
                    <SelectItem value="VP">VP</SelectItem>
                    <SelectItem value="Director">Director</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Senior">Senior</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filters.intentSignal || "all"}
                  onValueChange={(value) =>
                    setFilters({
                      ...filters,
                      intentSignal: value === "all" ? "" : value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Intent Signal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Signals</SelectItem>
                    <SelectItem value="Super Strong">Super Strong</SelectItem>
                    <SelectItem value="Very Strong">Very Strong</SelectItem>
                    <SelectItem value="Strong">Strong</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Weak">Weak</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filters.country || "all"}
                  onValueChange={(value) =>
                    setFilters({
                      ...filters,
                      country: value === "all" ? "" : value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Countries</SelectItem>
                    <SelectItem value="USA">USA</SelectItem>
                    <SelectItem value="Germany">Germany</SelectItem>
                    <SelectItem value="France">France</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  onClick={() =>
                    setFilters({
                      jobFunction: "",
                      jobLevel: "",
                      company: "",
                      country: "",
                      intentSignal: "",
                      engagementRange: { min: 0, max: 100 },
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

          {/* Data Table */}
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <CardTitle className="text-lg">Prospect Results</CardTitle>
                  <Badge variant="secondary" className="bg-gray-100">
                    {selectedItems.length} Selected
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Send className="w-4 h-4 mr-2" />
                    Add to Campaign
                  </Button>
                  <Button variant="outline" size="sm">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add to CRM
                  </Button>
                  <Button
                    className="bg-valasys-orange hover:bg-valasys-orange/90"
                    disabled={selectedItems.length === 0}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export ({selectedItems.length})
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 hover:bg-gray-50">
                      <TableHead className="w-12 pl-6">
                        <Checkbox
                          checked={
                            selectedItems.length === paginatedData.length &&
                            paginatedData.length > 0
                          }
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleSort("fullName")}
                      >
                        <div className="flex items-center justify-between">
                          Prospect
                          <div className="ml-2">
                            {sortField === "fullName" ? (
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
                        onClick={() => handleSort("companyName")}
                      >
                        <div className="flex items-center justify-between">
                          Company
                          <div className="ml-2">
                            {sortField === "companyName" ? (
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
                        onClick={() => handleSort("engagementScore")}
                      >
                        <div className="flex items-center justify-between">
                          Engagement
                          <div className="ml-2">
                            {sortField === "engagementScore" ? (
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
                        onClick={() => handleSort("intentSignal")}
                      >
                        <div className="flex items-center justify-between">
                          Intent Signal
                          <div className="ml-2">
                            {sortField === "intentSignal" ? (
                              <span className="text-valasys-orange">
                                {sortDirection === "asc" ? "↑" : "↓"}
                              </span>
                            ) : (
                              <span className="text-gray-400">↕</span>
                            )}
                          </div>
                        </div>
                      </TableHead>
                      <TableHead>Contact Info</TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleSort("lastActivity")}
                      >
                        <div className="flex items-center justify-between">
                          Last Activity
                          <div className="ml-2">
                            {sortField === "lastActivity" ? (
                              <span className="text-valasys-orange">
                                {sortDirection === "asc" ? "↑" : "↓"}
                              </span>
                            ) : (
                              <span className="text-gray-400">↕</span>
                            )}
                          </div>
                        </div>
                      </TableHead>
                      <TableHead className="w-16">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedData.map((prospect) => (
                      <TableRow
                        key={prospect.id}
                        className={cn(
                          "hover:bg-blue-50/50 transition-colors",
                          selectedItems.includes(prospect.id) && "bg-blue-50",
                        )}
                      >
                        <TableCell className="pl-6">
                          <Checkbox
                            checked={selectedItems.includes(prospect.id)}
                            onCheckedChange={(checked) =>
                              handleSelectItem(prospect.id, checked as boolean)
                            }
                          />
                        </TableCell>

                        {/* Prospect Info */}
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage
                                src={prospect.profileImageUrl}
                                alt={prospect.fullName}
                              />
                              <AvatarFallback className="bg-valasys-orange text-white">
                                {prospect.firstName[0]}
                                {prospect.lastName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-gray-900">
                                {prospect.fullName}
                              </div>
                              <div className="text-sm text-gray-600">
                                {prospect.jobTitle}
                              </div>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge
                                  variant="outline"
                                  className="text-xs px-1 py-0"
                                >
                                  {prospect.jobLevel}
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className="text-xs px-1 py-0"
                                >
                                  {prospect.jobFunction}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </TableCell>

                        {/* Company Info */}
                        <TableCell>
                          <div>
                            <div className="font-medium text-gray-900 flex items-center">
                              <Building className="w-4 h-4 mr-1 text-gray-400" />
                              {prospect.companyName}
                            </div>
                            <div className="text-sm text-gray-600">
                              {prospect.industry}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {prospect.companySize} • {prospect.revenue}
                            </div>
                          </div>
                        </TableCell>

                        {/* Engagement Score */}
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center">
                              <div
                                className={cn(
                                  "h-2 w-16 rounded-full bg-gray-200 overflow-hidden",
                                )}
                              >
                                <div
                                  className={cn(
                                    "h-full transition-all duration-300",
                                    getEngagementColor(
                                      prospect.engagementScore,
                                    ),
                                  )}
                                  style={{
                                    width: `${prospect.engagementScore}%`,
                                  }}
                                />
                              </div>
                              <span className="ml-2 text-sm font-medium">
                                {prospect.engagementScore}
                              </span>
                            </div>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            <div className="flex items-center">
                              <Star className="w-3 h-3 mr-1" />
                              Confidence: {prospect.confidenceScore}%
                            </div>
                          </div>
                        </TableCell>

                        {/* Intent Signal */}
                        <TableCell>
                          <Badge
                            className={cn(
                              "text-xs font-medium mb-2",
                              getIntentSignalColor(prospect.intentSignal),
                            )}
                          >
                            <Zap className="w-3 h-3 mr-1" />
                            {prospect.intentSignal}
                          </Badge>
                          <div className="text-xs text-gray-600">
                            {prospect.matchedTopics
                              .slice(0, 2)
                              .map((topic, i) => (
                                <div key={i} className="text-xs">
                                  • {topic}
                                </div>
                              ))}
                            {prospect.matchedTopics.length > 2 && (
                              <div className="text-xs text-gray-400">
                                +{prospect.matchedTopics.length - 2} more
                              </div>
                            )}
                          </div>
                        </TableCell>

                        {/* Contact Info */}
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center text-sm">
                              <Mail className="w-3 h-3 mr-1 text-gray-400" />
                              <a
                                href={`mailto:${prospect.email}`}
                                className="text-blue-600 hover:underline truncate max-w-[150px]"
                              >
                                {prospect.email}
                              </a>
                            </div>
                            {prospect.phone && (
                              <div className="flex items-center text-sm text-gray-600">
                                <Phone className="w-3 h-3 mr-1 text-gray-400" />
                                {prospect.phone}
                              </div>
                            )}
                            {prospect.linkedinUrl && (
                              <div className="flex items-center text-sm">
                                <Linkedin className="w-3 h-3 mr-1 text-blue-600" />
                                <a
                                  href={prospect.linkedinUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline"
                                >
                                  LinkedIn
                                </a>
                              </div>
                            )}
                            <div className="flex items-center text-xs text-gray-500">
                              <MapPin className="w-3 h-3 mr-1" />
                              {prospect.city}, {prospect.country}
                            </div>
                          </div>
                        </TableCell>

                        {/* Last Activity */}
                        <TableCell>
                          <div className="text-sm">
                            <div className="flex items-center text-gray-900">
                              <Clock className="w-3 h-3 mr-1 text-gray-400" />
                              {formatDate(prospect.lastActivity)}
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                              {prospect.recentActivities
                                .slice(0, 2)
                                .map((activity, i) => (
                                  <div key={i} className="flex items-center">
                                    <Activity className="w-2 h-2 mr-1" />
                                    {activity}
                                  </div>
                                ))}
                            </div>
                          </div>
                        </TableCell>

                        {/* Actions */}
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedProspect(prospect)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto">
                              <DialogHeader>
                                <DialogTitle className="flex items-center space-x-3">
                                  <Avatar className="h-12 w-12">
                                    <AvatarImage
                                      src={prospect.profileImageUrl}
                                      alt={prospect.fullName}
                                    />
                                    <AvatarFallback className="bg-valasys-orange text-white">
                                      {prospect.firstName[0]}
                                      {prospect.lastName[0]}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="text-xl font-bold">
                                      {prospect.fullName}
                                    </div>
                                    <div className="text-sm text-gray-600 font-normal">
                                      {prospect.jobTitle} at{" "}
                                      {prospect.companyName}
                                    </div>
                                  </div>
                                </DialogTitle>
                                <DialogDescription>
                                  Detailed prospect information and engagement
                                  data
                                </DialogDescription>
                              </DialogHeader>

                              {selectedProspect && (
                                <div className="space-y-6">
                                  {/* Contact & Professional Info */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Card>
                                      <CardHeader className="pb-3">
                                        <CardTitle className="text-sm">
                                          Contact Information
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-3">
                                        <div className="flex items-center">
                                          <Mail className="w-4 h-4 mr-2 text-gray-400" />
                                          <a
                                            href={`mailto:${selectedProspect.email}`}
                                            className="text-blue-600 hover:underline"
                                          >
                                            {selectedProspect.email}
                                          </a>
                                        </div>
                                        {selectedProspect.phone && (
                                          <div className="flex items-center">
                                            <Phone className="w-4 h-4 mr-2 text-gray-400" />
                                            <span>
                                              {selectedProspect.phone}
                                            </span>
                                          </div>
                                        )}
                                        {selectedProspect.linkedinUrl && (
                                          <div className="flex items-center">
                                            <Linkedin className="w-4 h-4 mr-2 text-blue-600" />
                                            <a
                                              href={
                                                selectedProspect.linkedinUrl
                                              }
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="text-blue-600 hover:underline flex items-center"
                                            >
                                              LinkedIn Profile
                                              <ExternalLink className="w-3 h-3 ml-1" />
                                            </a>
                                          </div>
                                        )}
                                        <div className="flex items-center">
                                          <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                                          <span>
                                            {selectedProspect.city},{" "}
                                            {selectedProspect.country}
                                          </span>
                                        </div>
                                      </CardContent>
                                    </Card>

                                    <Card>
                                      <CardHeader className="pb-3">
                                        <CardTitle className="text-sm">
                                          Professional Details
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-3">
                                        <div>
                                          <div className="text-sm text-gray-600">
                                            Current Role
                                          </div>
                                          <div className="font-medium">
                                            {selectedProspect.jobTitle}
                                          </div>
                                        </div>
                                        <div>
                                          <div className="text-sm text-gray-600">
                                            Department
                                          </div>
                                          <div>
                                            {selectedProspect.department ||
                                              "N/A"}
                                          </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                          <div>
                                            <div className="text-sm text-gray-600">
                                              Level
                                            </div>
                                            <Badge variant="outline">
                                              {selectedProspect.jobLevel}
                                            </Badge>
                                          </div>
                                          <div>
                                            <div className="text-sm text-gray-600">
                                              Function
                                            </div>
                                            <Badge variant="outline">
                                              {selectedProspect.jobFunction}
                                            </Badge>
                                          </div>
                                        </div>
                                        {selectedProspect.yearsAtCompany && (
                                          <div>
                                            <div className="text-sm text-gray-600">
                                              Tenure
                                            </div>
                                            <div>
                                              {selectedProspect.yearsAtCompany}{" "}
                                              years at company
                                            </div>
                                          </div>
                                        )}
                                      </CardContent>
                                    </Card>
                                  </div>

                                  {/* Engagement & Intent Scores */}
                                  <Card>
                                    <CardHeader className="pb-3">
                                      <CardTitle className="text-sm">
                                        Engagement & Intent Analysis
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="grid grid-cols-3 gap-6">
                                        <div className="text-center">
                                          <div className="text-2xl font-bold text-green-600">
                                            {selectedProspect.engagementScore}
                                          </div>
                                          <div className="text-sm text-gray-600">
                                            Engagement Score
                                          </div>
                                        </div>
                                        <div className="text-center">
                                          <div className="text-2xl font-bold text-blue-600">
                                            {selectedProspect.intentScore}
                                          </div>
                                          <div className="text-sm text-gray-600">
                                            Intent Score
                                          </div>
                                        </div>
                                        <div className="text-center">
                                          <div className="text-2xl font-bold text-orange-600">
                                            {selectedProspect.confidenceScore}%
                                          </div>
                                          <div className="text-sm text-gray-600">
                                            Confidence
                                          </div>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>

                                  {/* Recent Activities */}
                                  <Card>
                                    <CardHeader className="pb-3">
                                      <CardTitle className="text-sm">
                                        Recent Activities
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="space-y-2">
                                        {selectedProspect.recentActivities.map(
                                          (activity, i) => (
                                            <div
                                              key={i}
                                              className="flex items-center text-sm"
                                            >
                                              <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                                              {activity}
                                            </div>
                                          ),
                                        )}
                                      </div>
                                    </CardContent>
                                  </Card>

                                  {/* Matched Topics */}
                                  <Card>
                                    <CardHeader className="pb-3">
                                      <CardTitle className="text-sm">
                                        Matched Intent Topics
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="flex flex-wrap gap-2">
                                        {selectedProspect.matchedTopics.map(
                                          (topic, i) => (
                                            <Badge
                                              key={i}
                                              variant="secondary"
                                              className="text-xs"
                                            >
                                              {topic}
                                            </Badge>
                                          ),
                                        )}
                                      </div>
                                    </CardContent>
                                  </Card>

                                  {/* Action Buttons */}
                                  <div className="flex justify-end space-x-2 pt-4 border-t">
                                    <Button variant="outline" size="sm">
                                      <Share2 className="w-4 h-4 mr-2" />
                                      Share
                                    </Button>
                                    <Button variant="outline" size="sm">
                                      <UserPlus className="w-4 h-4 mr-2" />
                                      Add to CRM
                                    </Button>
                                    <Button
                                      size="sm"
                                      className="bg-valasys-orange hover:bg-valasys-orange/90"
                                    >
                                      <Send className="w-4 h-4 mr-2" />
                                      Add to Campaign
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
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
                  {Math.min(startIndex + itemsPerPage, sortedData.length)} of{" "}
                  {sortedData.length} prospects
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
        </div>
      </DashboardLayout>
    </TooltipProvider>
  );
}
