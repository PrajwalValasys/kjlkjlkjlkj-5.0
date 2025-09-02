import React, { useState, useMemo, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { FloatingStatsWidget } from "@/components/ui/floating-stats-widget";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { CircularProgress } from "@/components/ui/circular-progress";
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
  TrendingUp,
  Building,
  Globe,
  Users,
  DollarSign,
  Target,
  Maximize,
  BarChart3,
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import IntentSignalChart from "@/components/dashboard/IntentSignalChart";

interface CompanyData {
  id: string;
  companyName: string;
  vais: number;
  intentSignal: string;
  mainIndustry: string;
  subIndustry: string;
  companySize: string;
  revenue: string;
  country: string;
  city: string;
  selected: boolean;
  // Intent signal breakdown data
  compositeScore: number;
  deltaScore: number;
  matchedTopics: number;
  relatedTopics: string[];
}

// Enhanced sample data matching the screenshot
const sampleData: CompanyData[] = [
  {
    id: "1",
    companyName: "Autodesk",
    vais: 95.5,
    intentSignal: "Super Strong",
    mainIndustry: "Software and IT Services",
    subIndustry: "Computer Software",
    companySize: "5001-10000",
    revenue: "$1B - $10B",
    country: "USA",
    city: "San Rafael, CA",
    selected: false,
    compositeScore: 87,
    deltaScore: 12.4,
    matchedTopics: 23,
    relatedTopics: [
      "3D Modeling",
      "BIM Software",
      "Engineering Simulation",
      "Digital Twin Technology",
    ],
  },
  {
    id: "2",
    companyName: "Bentley Systems",
    vais: 94.2,
    intentSignal: "Very Strong",
    mainIndustry: "Software and IT Services",
    subIndustry: "Computer Software",
    companySize: "1001-5000",
    revenue: "$500M - $1B",
    country: "USA",
    city: "Exton, PA",
    selected: false,
    compositeScore: 85,
    deltaScore: 11.8,
    matchedTopics: 21,
    relatedTopics: [
      "Infrastructure Design",
      "Asset Management",
      "Reality Modeling",
      "Construction Software",
    ],
  },
  {
    id: "3",
    companyName: "Dassault Systems",
    vais: 93.8,
    intentSignal: "Very Strong",
    mainIndustry: "Software and IT Services",
    subIndustry: "Computer Software",
    companySize: "10001-50000",
    revenue: "$1B - $10B",
    country: "France",
    city: "Vélizy-Villacoublay",
    selected: false,
    compositeScore: 84,
    deltaScore: 10.9,
    matchedTopics: 20,
    relatedTopics: [
      "PLM Software",
      "CATIA",
      "Industrial Design",
      "Virtual Prototyping",
    ],
  },
  {
    id: "4",
    companyName: "Siemens PLM Software",
    vais: 92.1,
    intentSignal: "Strong",
    mainIndustry: "Software and IT Services",
    subIndustry: "Computer Software",
    companySize: "50001+",
    revenue: "$10B+",
    country: "Germany",
    city: "Munich",
    selected: false,
    compositeScore: 78,
    deltaScore: 9.2,
    matchedTopics: 18,
    relatedTopics: [
      "NX Software",
      "Teamcenter",
      "Manufacturing Execution",
      "Digitalization",
    ],
  },
  {
    id: "5",
    companyName: "ANSYS",
    vais: 91.7,
    intentSignal: "Strong",
    mainIndustry: "Software and IT Services",
    subIndustry: "Computer Software",
    companySize: "1001-5000",
    revenue: "$1B - $10B",
    country: "USA",
    city: "Canonsburg, PA",
    selected: false,
    compositeScore: 76,
    deltaScore: 8.9,
    matchedTopics: 17,
    relatedTopics: [
      "Finite Element Analysis",
      "CFD Simulation",
      "Electromagnetic Analysis",
      "Multiphysics",
    ],
  },
  {
    id: "6",
    companyName: "PTC",
    vais: 90.3,
    intentSignal: "Strong",
    mainIndustry: "Software and IT Services",
    subIndustry: "Computer Software",
    companySize: "5001-10000",
    revenue: "$1B - $10B",
    country: "USA",
    city: "Boston, MA",
    selected: false,
    compositeScore: 75,
    deltaScore: 8.1,
    matchedTopics: 16,
    relatedTopics: [
      "Creo Parametric",
      "Windchill PDM",
      "ThingWorx IoT",
      "Augmented Reality",
    ],
  },
  {
    id: "7",
    companyName: "Hexagon Manufacturing Intelligence",
    vais: 89.6,
    intentSignal: "Strong",
    mainIndustry: "Software and IT Services",
    subIndustry: "Computer Software",
    companySize: "10001-50000",
    revenue: "$1B - $10B",
    country: "Sweden",
    city: "Stockholm",
    selected: false,
    compositeScore: 73,
    deltaScore: 7.6,
    matchedTopics: 15,
    relatedTopics: [
      "Metrology Software",
      "Quality Management",
      "CMM Programming",
      "Smart Manufacturing",
    ],
  },
  {
    id: "8",
    companyName: "Altium",
    vais: 88.4,
    intentSignal: "Medium",
    mainIndustry: "Software and IT Services",
    subIndustry: "Computer Software",
    companySize: "501-1000",
    revenue: "$100M - $500M",
    country: "Australia",
    city: "Sydney",
    selected: false,
    compositeScore: 68,
    deltaScore: 6.3,
    matchedTopics: 12,
    relatedTopics: [
      "PCB Design",
      "Electronics Design",
      "Schematic Capture",
      "FPGA Design",
    ],
  },
  {
    id: "9",
    companyName: "SolidWorks",
    vais: 87.9,
    intentSignal: "Medium",
    mainIndustry: "Software and IT Services",
    subIndustry: "Computer Software",
    companySize: "1001-5000",
    revenue: "$500M - $1B",
    country: "USA",
    city: "Waltham, MA",
    selected: false,
    compositeScore: 67,
    deltaScore: 5.9,
    matchedTopics: 11,
    relatedTopics: ["3D CAD", "PDM", "Simulation", "Technical Communication"],
  },
  {
    id: "10",
    companyName: "Trimble",
    vais: 86.2,
    intentSignal: "Medium",
    mainIndustry: "Software and IT Services",
    subIndustry: "Computer Software",
    companySize: "10001-50000",
    revenue: "$1B - $10B",
    country: "USA",
    city: "Sunnyvale, CA",
    selected: false,
    compositeScore: 65,
    deltaScore: 5.4,
    matchedTopics: 10,
    relatedTopics: [
      "GPS Technology",
      "Geospatial Solutions",
      "Surveying Software",
      "Construction Management",
    ],
  },
  {
    id: "11",
    companyName: "Chief Architect",
    vais: 85.7,
    intentSignal: "Medium",
    mainIndustry: "Software and IT Services",
    subIndustry: "Computer Software",
    companySize: "51-200",
    revenue: "$10M - $50M",
    country: "USA",
    city: "Coeur d'Alene, ID",
    selected: false,
    compositeScore: 63,
    deltaScore: 4.8,
    matchedTopics: 9,
    relatedTopics: [
      "Home Design",
      "Architectural Drafting",
      "3D Rendering",
      "Interior Design",
    ],
  },
  {
    id: "12",
    companyName: "Vectorworks",
    vais: 84.8,
    intentSignal: "Medium",
    mainIndustry: "Software and IT Services",
    subIndustry: "Computer Software",
    companySize: "201-500",
    revenue: "$50M - $100M",
    country: "USA",
    city: "Columbia, MD",
    selected: false,
    compositeScore: 61,
    deltaScore: 4.2,
    matchedTopics: 8,
    relatedTopics: [
      "Landscape Design",
      "Architecture",
      "Entertainment Design",
      "BIM Workflows",
    ],
  },
];

export default function VAISResults() {
  const [data, setData] = useState<CompanyData[]>(sampleData);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<keyof CompanyData>("vais");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    industry: "",
    companySize: "",
    country: "",
    intentSignal: "",
    vaisRange: { min: 0, max: 100 },
  });
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Column visibility state
  const [columnVisibility, setColumnVisibility] = useState({
    companyName: true,
    vais: true,
    intentSignal: true,
    mainIndustry: true,
    subIndustry: true,
    companySize: true,
    revenue: true,
    country: true,
  });

  const columns = [
    { key: "companyName", label: "Company Name" },
    { key: "vais", label: "VAIS Score" },
    { key: "intentSignal", label: "Intent Signal" },
    { key: "mainIndustry", label: "Main Industry" },
    { key: "subIndustry", label: "Sub Industry" },
    { key: "companySize", label: "Company Size" },
    { key: "revenue", label: "Revenue" },
    { key: "country", label: "Country" },
  ];

  const toggleColumn = (columnKey: keyof typeof columnVisibility) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [columnKey]: !prev[columnKey],
    }));
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Filter and search data
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch =
        item.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.mainIndustry.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesIndustry =
        !filters.industry || item.mainIndustry === filters.industry;
      const matchesSize =
        !filters.companySize || item.companySize === filters.companySize;
      const matchesCountry =
        !filters.country || item.country === filters.country;
      const matchesIntentSignal =
        !filters.intentSignal || item.intentSignal === filters.intentSignal;
      const matchesVais =
        item.vais >= filters.vaisRange.min &&
        item.vais <= filters.vaisRange.max;

      return (
        matchesSearch &&
        matchesIndustry &&
        matchesSize &&
        matchesCountry &&
        matchesIntentSignal &&
        matchesVais
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

  const handleSort = (field: keyof CompanyData) => {
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

  const getVAISColor = (vais: number) => {
    if (vais >= 90) return "bg-green-500";
    if (vais >= 80) return "bg-green-400";
    if (vais >= 70) return "bg-yellow-500";
    if (vais >= 60) return "bg-orange-500";
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

  return (
    <DashboardLayout>
      <div className="-mx-6 px-0">
        <div className="space-y-6 px-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/build-vais">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-valasys-orange hover:bg-valasys-orange hover:text-white"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  VAIS Results
                </Button>
              </Link>
              <div className="text-sm text-valasys-gray-600">
                Selected subcategory:{" "}
                <span className="font-medium text-valasys-orange">
                  Computer-Aided Design (CAD) Software
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <FloatingStatsWidget />
            </div>
          </div>

          {/* Controls */}
          <Card className="shadow-sm">
            <CardContent className="p-4">
              {/* Search and Quick Filters */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Settings2 className="w-4 h-4 mr-2" />
                        Columns
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56">
                      <div className="p-2">
                        <h4 className="text-sm font-medium mb-3">Columns</h4>
                        <div className="space-y-2">
                          {columns.map((column) => (
                            <div
                              key={column.key}
                              className="flex items-center justify-between py-2"
                            >
                              <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 flex items-center justify-center">
                                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                </div>
                                <label
                                  htmlFor={`column-${column.key}`}
                                  className="text-sm font-medium cursor-pointer"
                                >
                                  {column.label}
                                </label>
                              </div>
                              <Switch
                                id={`column-${column.key}`}
                                checked={
                                  columnVisibility[
                                    column.key as keyof typeof columnVisibility
                                  ]
                                }
                                onCheckedChange={() =>
                                  toggleColumn(
                                    column.key as keyof typeof columnVisibility,
                                  )
                                }
                                className="data-[state=checked]:bg-valasys-orange"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (!document.fullscreenElement) {
                        document.documentElement.requestFullscreen();
                        setIsFullScreen(true);
                      } else {
                        document.exitFullscreen();
                        setIsFullScreen(false);
                      }
                    }}
                  >
                    <Maximize className="w-4 h-4 mr-2" />
                    {isFullScreen ? "Exit Full Screen" : "Full Screen"}
                  </Button>
                </div>
                <div className="text-sm text-gray-500">
                  Total Records:{" "}
                  <span className="font-medium">{filteredData.length}/827</span>{" "}
                  Page: <span className="font-medium">{currentPage}</span> of{" "}
                  <span className="font-medium">{totalPages}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search companies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select
                  value={filters.industry || "all"}
                  onValueChange={(value) =>
                    setFilters({
                      ...filters,
                      industry: value === "all" ? "" : value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Industries</SelectItem>
                    <SelectItem value="Software and IT Services">
                      Software and IT Services
                    </SelectItem>
                    <SelectItem value="Real Estate & Construction">
                      Real Estate & Construction
                    </SelectItem>
                    <SelectItem value="Manufacturing">Manufacturing</SelectItem>
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
                    <SelectItem value="Super Strong">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>
                        Super Strong
                      </div>
                    </SelectItem>
                    <SelectItem value="Very Strong">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                        Very Strong
                      </div>
                    </SelectItem>
                    <SelectItem value="Strong">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                        Strong
                      </div>
                    </SelectItem>
                    <SelectItem value="Medium">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                        Medium
                      </div>
                    </SelectItem>
                    <SelectItem value="Weak">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                        Weak
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filters.companySize || "all"}
                  onValueChange={(value) =>
                    setFilters({
                      ...filters,
                      companySize: value === "all" ? "" : value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Company Size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sizes</SelectItem>
                    <SelectItem value="1-50">1-50</SelectItem>
                    <SelectItem value="51-200">51-200</SelectItem>
                    <SelectItem value="201-500">201-500</SelectItem>
                    <SelectItem value="501-1000">501-1000</SelectItem>
                    <SelectItem value="1001-5000">1001-5000</SelectItem>
                    <SelectItem value="5001-10000">5001-10000</SelectItem>
                    <SelectItem value="10001-50000">10001-50000</SelectItem>
                    <SelectItem value="50001+">50001+</SelectItem>
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
                    <SelectItem value="Sweden">Sweden</SelectItem>
                    <SelectItem value="Australia">Australia</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  onClick={() =>
                    setFilters({
                      industry: "",
                      companySize: "",
                      country: "",
                      intentSignal: "",
                      vaisRange: { min: 0, max: 100 },
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
                  <CardTitle className="text-lg">Company Results</CardTitle>
                  <Badge variant="secondary" className="bg-gray-100">
                    {selectedItems.length} Items Selected
                  </Badge>
                </div>
                <Button
                  className="bg-valasys-orange hover:bg-valasys-orange/90"
                  disabled={selectedItems.length === 0}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
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
                      {columnVisibility.companyName && (
                        <TableHead
                          className="cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => handleSort("companyName")}
                        >
                          <div className="flex items-center justify-between">
                            Company Name
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
                      )}
                      {columnVisibility.vais && (
                        <TableHead
                          className="cursor-pointer hover:bg-gray-100 transition-colors w-48"
                          onClick={() => handleSort("vais")}
                        >
                          <div className="flex items-center justify-between">
                            VAIS
                            <div className="ml-2">
                              {sortField === "vais" ? (
                                <span className="text-valasys-orange">
                                  {sortDirection === "asc" ? "↑" : "↓"}
                                </span>
                              ) : (
                                <span className="text-gray-400">↕</span>
                              )}
                            </div>
                          </div>
                        </TableHead>
                      )}
                      {columnVisibility.intentSignal && (
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
                      )}
                      {columnVisibility.mainIndustry && (
                        <TableHead
                          className="cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => handleSort("mainIndustry")}
                        >
                          <div className="flex items-center justify-between">
                            Main Industry
                            <div className="ml-2">
                              {sortField === "mainIndustry" ? (
                                <span className="text-valasys-orange">
                                  {sortDirection === "asc" ? "↑" : "↓"}
                                </span>
                              ) : (
                                <span className="text-gray-400">↕</span>
                              )}
                            </div>
                          </div>
                        </TableHead>
                      )}
                      {columnVisibility.subIndustry && (
                        <TableHead
                          className="cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => handleSort("subIndustry")}
                        >
                          <div className="flex items-center justify-between">
                            Sub Industry
                            <div className="ml-2">
                              {sortField === "subIndustry" ? (
                                <span className="text-valasys-orange">
                                  {sortDirection === "asc" ? "↑" : "↓"}
                                </span>
                              ) : (
                                <span className="text-gray-400">↕</span>
                              )}
                            </div>
                          </div>
                        </TableHead>
                      )}
                      {columnVisibility.companySize && (
                        <TableHead
                          className="cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => handleSort("companySize")}
                        >
                          <div className="flex items-center justify-between">
                            Company Size
                            <div className="ml-2">
                              {sortField === "companySize" ? (
                                <span className="text-valasys-orange">
                                  {sortDirection === "asc" ? "↑" : "↓"}
                                </span>
                              ) : (
                                <span className="text-gray-400">↕</span>
                              )}
                            </div>
                          </div>
                        </TableHead>
                      )}
                      {columnVisibility.revenue && (
                        <TableHead
                          className="cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => handleSort("revenue")}
                        >
                          <div className="flex items-center justify-between">
                            Revenue
                            <div className="ml-2">
                              {sortField === "revenue" ? (
                                <span className="text-valasys-orange">
                                  {sortDirection === "asc" ? "↑" : "↓"}
                                </span>
                              ) : (
                                <span className="text-gray-400">↕</span>
                              )}
                            </div>
                          </div>
                        </TableHead>
                      )}
                      {columnVisibility.country && (
                        <TableHead
                          className="cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => handleSort("country")}
                        >
                          <div className="flex items-center justify-between">
                            Country
                            <div className="ml-2">
                              {sortField === "country" ? (
                                <span className="text-valasys-orange">
                                  {sortDirection === "asc" ? "↑" : "↓"}
                                </span>
                              ) : (
                                <span className="text-gray-400">↕</span>
                              )}
                            </div>
                          </div>
                        </TableHead>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedData.map((item) => (
                      <TableRow
                        key={item.id}
                        className={cn(
                          "hover:bg-blue-50/50 transition-colors",
                          selectedItems.includes(item.id) && "bg-blue-50",
                        )}
                      >
                        <TableCell className="pl-6">
                          <Checkbox
                            checked={selectedItems.includes(item.id)}
                            onCheckedChange={(checked) =>
                              handleSelectItem(item.id, checked as boolean)
                            }
                          />
                        </TableCell>
                        {columnVisibility.companyName && (
                          <TableCell className="font-medium text-valasys-gray-900">
                            {item.companyName}
                          </TableCell>
                        )}
                        {columnVisibility.vais && (
                          <TableCell className="text-center">
                            <div className="flex justify-center">
                              <CircularProgress
                                value={item.vais}
                                size={56}
                                strokeWidth={4}
                              />
                            </div>
                          </TableCell>
                        )}
                        {columnVisibility.intentSignal && (
                          <TableCell>
                            <IntentSignalChart
                              data={{
                                compositeScore: item.compositeScore,
                                deltaScore: item.deltaScore,
                                matchedTopics: item.matchedTopics,
                                intentSignal: item.intentSignal,
                                companyName: item.companyName,
                                vais: item.vais,
                                revenue: item.revenue,
                                city: item.city,
                                relatedTopics: item.relatedTopics,
                              }}
                            />
                          </TableCell>
                        )}
                        {columnVisibility.mainIndustry && (
                          <TableCell className="text-sm text-gray-700">
                            {item.mainIndustry}
                          </TableCell>
                        )}
                        {columnVisibility.subIndustry && (
                          <TableCell className="text-sm text-gray-700">
                            {item.subIndustry}
                          </TableCell>
                        )}
                        {columnVisibility.companySize && (
                          <TableCell className="text-sm text-gray-700">
                            {item.companySize}
                          </TableCell>
                        )}
                        {columnVisibility.revenue && (
                          <TableCell className="text-sm text-gray-700">
                            {item.revenue}
                          </TableCell>
                        )}
                        {columnVisibility.country && (
                          <TableCell className="text-sm text-gray-700">
                            {item.country}
                          </TableCell>
                        )}
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
                  {sortedData.length} results
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
      </div>
    </DashboardLayout>
  );
}
