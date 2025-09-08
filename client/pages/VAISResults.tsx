import React, { useState, useMemo, useEffect } from "react";
import { useSelector } from 'react-redux';
import { RootState } from '@/store/reducers';
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
  X,
  MapPin,
  Phone,
  Calendar,
  Briefcase,
  Brain,
  Activity,
  User,
  Crown,
  PiggyBank,
  Cpu,
  Newspaper,
  Link as LinkIcon,
  Badge as BadgeIcon,
  ExternalLink,
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import IntentSignalChart from "@/components/dashboard/IntentSignalChart";
import intentSignal, { FirstLetterCapital } from "@/lib/intent";

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
  topics?: any[] | null;
}

// Enhanced sample data matching the screenshot
const sampleData: CompanyData[] = [
  {
    id: "0",
    companyName: "BBCL",
    vais: 93,
    intentSignal: "Strong",
    mainIndustry: "Business Services",
    subIndustry: "Consulting and Services",
    companySize: "1001-5000",
    revenue: "$500M",
    country: "New Zealand",
    city: "San Rafael, CA",
    selected: false,
    compositeScore: 89,
    deltaScore: 9.8,
    matchedTopics: 19,
    relatedTopics: ["AutoCAD", "Revit", "Maya", "3ds Max"],
  },
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
  const icpScore = useSelector((state: RootState) => state.icpScore.icpScore);
  const [data, setData] = useState<CompanyData[]>(sampleData);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(1000);
  const [visibleRows, setVisibleRows] = useState<number>(100);
  const [sortField, setSortField] = useState<keyof CompanyData>("vais");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    industry: "",
    subIndustry: "",
    companySize: "",
    country: "",
    vaisRange: { min: 0, max: 100 },
  });
  // options populated from icpScore API response for dynamic dropdowns
  const [industryOptions, setIndustryOptions] = useState<string[]>([]);
  const [subIndustryOptions, setSubIndustryOptions] = useState<string[]>([]);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [activeCompany, setActiveCompany] = useState<CompanyData | null>(null);

  const openDetails = (company: CompanyData) => {
    setActiveCompany(company);
    setDetailsOpen(true);
  };
  const closeDetails = () => setDetailsOpen(false);

  useEffect(() => {
    if (icpScore && Array.isArray(icpScore.data)) {
      // Map backend response fields (snake_case) to the frontend CompanyData shape
      const mapped = (icpScore.data as any[]).map((item) => {
        const id = String(item.id ?? item.company_id ?? item._id ?? "");
        const companyName = item.company_name || item.companyName || item.company || "";
        const vais = Number(item.icp_score ?? item.vais ?? 0);
        // signal is numeric in the response; translate to a human label when possible
  const signalNum = Number(item.signal ?? -1);
  // Map numeric signal to human label; use '-' for unknown (-1) or 0 depending on desired mapping
  const intentSignalLabel = signalNum === 3 ? "Super Strong" : signalNum === 2 ? "Very Strong" : signalNum === 1 ? "Strong" : "-";
        const mainIndustry = item.industry_id || item.industry_id || "";
        const subIndustry = item.sab_industry_name || item.subIndustry || "";
        const companySize = item.comp_size || item.company_size || "";
        const revenue = item.revenue || "";
        const country = item.country || "";
        const city = item.city || "";
        const compositeScore = Number(item.composite_score ?? vais);
        const deltaScore = Number(item.delta_score ?? item.delta ?? 0);
        const matchedTopics = Array.isArray(item.Topics) ? item.Topics.length : (item.matched_topics ?? 0);
        const topicsArr = Array.isArray(item.Topics) ? item.Topics : null;
        const relatedTopics = Array.isArray(item.Topics)
          ? item.Topics.map((t: any) => t.topic || t.name || String(t))
          : (item.related_topics || []);

        return {
          id,
          companyName,
          vais,
          intentSignal: intentSignalLabel,
          topics: topicsArr,
          mainIndustry,
          subIndustry,
          companySize,
          revenue,
          country,
          city,
          selected: false,
          compositeScore,
          deltaScore,
          matchedTopics,
          relatedTopics,
        } as CompanyData;
      });

      setData(mapped);
      // derive industry and sub-industry lists from api payload
      try {
        const raw = icpScore.data as any[];
        const mains = Array.from(
          new Set(
            raw
              .map((it) => it.main_industry || it.industry || it.industry_id || "")
              .filter(Boolean),
          ),
        );
        const subs = Array.from(
          new Set(
            raw
              .map((it) => it.sub_industry || it.subIndustry || it.sab_industry_name || "")
              .filter(Boolean),
          ),
        );

        setIndustryOptions(mains.sort());
        setSubIndustryOptions(subs.sort());
      } catch (e) {
        // ignore
      }
    }
  }, [icpScore]);

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
      const matchesSubIndustry = !filters.subIndustry || item.subIndustry === filters.subIndustry;
      const matchesVais =
        item.vais >= filters.vaisRange.min &&
        item.vais <= filters.vaisRange.max;

      return (
        matchesSearch &&
        matchesIndustry &&
        matchesSize &&
        matchesCountry &&
        matchesSubIndustry &&
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
  // prefer server-provided totals when available
  const serverCount = (() => {
    if (!icpScore) return null;
    return (
      icpScore.pagination?.totalCount ??
      icpScore.pagination?.total_count ??
      icpScore.totalCount ??
      icpScore.totalCounts ??
      icpScore.total_count ??
      null
    );
  })();

  const totalPages = serverCount ? Math.ceil(Number(serverCount) / itemsPerPage) : Math.ceil(sortedData.length / itemsPerPage);

  // For dynamic loading we show cumulative pages: page 1 shows first itemsPerPage, page 2 shows 2*itemsPerPage etc.
  const displayedData = sortedData.slice(0, currentPage * itemsPerPage);

  // visibleRows controls how many rows are actually rendered in the DOM to avoid
  // rendering thousands of rows at once. We gradually increase visibleRows on scroll
  // before asking for the next page.
  const paginatedData = displayedData;
  const renderedRows = paginatedData.slice(0, visibleRows);

  // Counts for footer and header
  const displayedCount = paginatedData.length;
  const totalRecords = serverCount ?? sortedData.length;

  // Infinite / dynamic loading on scroll: attach to the table container and
  // increment currentPage when user scrolls near bottom. Debounced to avoid
  // multiple rapid increments.
  const listRef = React.useRef<HTMLDivElement | null>(null);
  const scrollTimeoutRef = React.useRef<number | null>(null);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;

    const onScroll = () => {
      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
      // debounce 120ms
      scrollTimeoutRef.current = window.setTimeout(() => {
        const { scrollTop, clientHeight, scrollHeight } = el;
        const nearBottom = scrollTop + clientHeight >= scrollHeight - 200;
        if (!nearBottom) return;

        // If there are more rendered rows to show for the currently loaded pages,
        // increase visibleRows to show them first. This gives a smooth incremental
        // reveal without expensive DOM updates for all loaded rows.
        if (visibleRows < paginatedData.length) {
          setVisibleRows((v) => Math.min(paginatedData.length, v + 100));
          return;
        }

        // Otherwise, if we've already revealed all rows for current pages, load next page
        if (currentPage < totalPages) {
          setCurrentPage((p) => Math.min(totalPages, p + 1));
          // after increasing page, proactively increase visibleRows slightly so new rows show progressively
          setVisibleRows((v) => Math.min((currentPage + 1) * itemsPerPage, v + 100));
        }
      }, 120) as unknown as number;
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll as EventListener);
      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [currentPage, totalPages, sortedData]);

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
                  Total Records: <span className="font-medium">{totalRecords}</span>{" "}
                  Page: <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
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
                    {industryOptions.length > 0 ? (
                      industryOptions.map((m) => (
                        <SelectItem key={m} value={m}>
                          {m}
                        </SelectItem>
                      ))
                    ) : (
                      <>
                        <SelectItem value="Software and IT Services">
                          Software and IT Services
                        </SelectItem>
                        <SelectItem value="Real Estate & Construction">
                          Real Estate & Construction
                        </SelectItem>
                        <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>

                <Select
                  value={filters.subIndustry || "all"}
                  onValueChange={(value) =>
                    setFilters({
                      ...filters,
                      subIndustry: value === "all" ? "" : value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sub Industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sub Industries</SelectItem>
                    {subIndustryOptions.length > 0 ? (
                      subIndustryOptions.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))
                    ) : (
                      <>
                        <SelectItem value="Computer Software">
                          Computer Software
                        </SelectItem>
                        <SelectItem value="Construction">Construction</SelectItem>
                        <SelectItem value="Advertising Services">
                          Advertising Services
                        </SelectItem>
                      </>
                    )}
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
                      subIndustry: "",
                      companySize: "",
                      country: "",
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
                <div ref={listRef} style={{ maxHeight: '520px', overflow: 'auto' }}>
                  <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 hover:bg-gray-50">
                      <TableHead className="w-12 pl-6">
                        <Checkbox
                          checked={
                            selectedItems.length === renderedRows.length &&
                            renderedRows.length > 0
                          }
                          onCheckedChange={(checked) => {
                            // adapt select-all to rendered rows
                            if (checked) {
                              setSelectedItems(renderedRows.map((r) => r.id));
                            } else {
                              setSelectedItems([]);
                            }
                          }}
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
                    {renderedRows.map((item) => (
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
                            <button
                              className="flex items-center space-x-2 text-black hover:text-gray-800 hover:underline focus:outline-none group"
                              onClick={() => openDetails(item)}
                            >
                              <span>{item.companyName}</span>
                              <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" />
                            </button>
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
                            <div>
                                  {/* IntentSignalChart will render the label; only render a fallback dash if topics are missing */}
                                  {(!item.topics || item.topics.length === 0) ? (
                                    <span className="intent-signal custom-td">-</span>
                                  ) : null}
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
                                      topics: item.topics,
                                    }}
                                  />
                            </div>
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
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between p-4 border-t bg-gray-50">
                <div className="text-sm text-gray-600">
                  Showing {renderedRows.length > 0 ? 1 : 0} to {renderedRows.length} of {totalRecords} results
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

        {/* Slide-in Details Panel */}
        <div
          className={cn(
            "fixed inset-0 z-50",
            detailsOpen ? "pointer-events-auto" : "pointer-events-none",
          )}
        >
          <div
            className={cn(
              "absolute inset-0 bg-black/30 transition-opacity",
              detailsOpen ? "opacity-100" : "opacity-0",
            )}
            onClick={closeDetails}
          />
          <div
            className={cn(
              "absolute right-0 top-0 h-full w-[60%] bg-white shadow-xl transition-transform duration-300",
              detailsOpen ? "translate-x-0" : "translate-x-full",
            )}
          >
            <div className="h-full overflow-auto flex flex-col">
              <div className="p-4 border-b bg-gradient-to-r from-valasys-orange to-valasys-orange-light text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                      <Building className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <div className="text-lg font-bold">
                          {activeCompany?.companyName}
                        </div>
                        <Badge
                          className={cn(
                            "text-xs px-2 py-1 font-medium",
                            getIntentSignalColor(
                              activeCompany?.intentSignal || "",
                            ),
                          )}
                        >
                          {activeCompany?.intentSignal}
                        </Badge>
                      </div>
                      <div className="text-xs opacity-90">Overview</div>
                    </div>
                  </div>
                  <button
                    onClick={closeDetails}
                    className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <Card>
                    <CardContent className="p-3 text-center">
                      <div className="text-xs text-gray-600">VAIS Score</div>
                      <div className="text-xl font-bold">
                        {activeCompany?.companyName === "BBCL"
                          ? 89
                          : Math.round(activeCompany?.compositeScore ?? 0)}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-3 text-center">
                      <div className="text-xs text-gray-600">Evaluation</div>
                      <div className="text-xl font-bold">
                        {activeCompany?.companyName === "BBCL"
                          ? "93%"
                          : `${Math.round(activeCompany?.vais ?? 0)}%`}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-3 text-center">
                      <div className="text-xs text-gray-600">Company Size</div>
                      <div className="text-sm font-semibold">
                        {activeCompany?.companySize}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-3 text-center">
                      <div className="text-xs text-gray-600">
                        Company Revenue
                      </div>
                      <div className="text-sm font-semibold">
                        {activeCompany?.revenue}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <div className="px-3 py-2 bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-300 text-blue-700 text-sm font-semibold rounded-t-lg">
                      Contact & Business Info
                    </div>
                    <div className="border border-t-0 rounded-b-lg p-3 grid grid-cols-2 gap-3 text-sm bg-white shadow-sm">
                      <div>
                        <div className="flex items-center space-x-2 text-gray-500 mb-1">
                          <MapPin className="w-4 h-4" />
                          <span>HQ</span>
                        </div>
                        <div className="font-medium">
                          {activeCompany?.companyName === "BBCL"
                            ? "San Rafael, California, United States"
                            : activeCompany?.city}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 text-gray-500 mb-1">
                          <Phone className="w-4 h-4" />
                          <span>Phone</span>
                        </div>
                        <div className="font-medium">
                          {activeCompany?.companyName === "BBCL"
                            ? "+1-415-507-5000"
                            : "N/A"}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 text-gray-500 mb-1">
                          <Globe className="w-4 h-4" />
                          <span>Country</span>
                        </div>
                        <div className="font-medium">
                          {activeCompany?.country}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 text-gray-500 mb-1">
                          <Calendar className="w-4 h-4" />
                          <span>Founded</span>
                        </div>
                        <div className="font-medium">
                          {activeCompany?.companyName === "BBCL" ? "1982" : "—"}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 text-gray-500 mb-1">
                          <Briefcase className="w-4 h-4" />
                          <span>Business Model</span>
                        </div>
                        <div className="font-medium">
                          {activeCompany?.companyName === "BBCL" ? "B2B" : "—"}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 text-gray-500 mb-1">
                          <Building className="w-4 h-4" />
                          <span>Business Services</span>
                        </div>
                        <div className="font-medium">
                          {activeCompany?.mainIndustry}
                        </div>
                      </div>
                      <div className="col-span-2">
                        {activeCompany?.companyName === "BBCL" && (
                          <div className="flex items-center space-x-2">
                            <LinkIcon className="w-4 h-4 text-gray-500" />
                            <a
                              className="text-blue-600 hover:underline"
                              href="#"
                              target="_blank"
                              rel="noreferrer"
                            >
                              www.bbcl.com
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="px-3 py-2 bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-300 text-green-700 text-sm font-semibold rounded-t-lg">
                      AI Intent Analysis
                    </div>
                    <div className="border border-t-0 rounded-b-lg p-3 space-y-2 text-sm bg-white shadow-sm">
                      <div>
                        <div className="flex items-center space-x-2 text-gray-500 mb-1">
                          <Brain className="w-4 h-4" />
                          <span>Intent</span>
                        </div>
                        <div className="font-medium">
                          {activeCompany?.companyName === "BBCL"
                            ? "This lead is in the evaluation stage, indicating a high likelihood to buy. Key activities include requesting product demo."
                            : activeCompany?.intentSignal}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 text-gray-500 mb-1">
                          <Activity className="w-4 h-4" />
                          <span>Recent Activities</span>
                        </div>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Requested product demo for AutoCAD — Jun 15</li>
                          <li>Downloaded technical whitepaper — Jun 12</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="px-3 py-2 bg-gradient-to-r from-pink-50 to-pink-100 border-l-4 border-pink-300 text-pink-700 text-sm font-semibold rounded-t-lg">
                      Key People
                    </div>
                    <div className="border border-t-0 rounded-b-lg p-3 space-y-2 text-sm bg-white shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Crown className="w-4 h-4 text-yellow-500" />
                          <span>Sarah Chen</span>
                        </div>
                        <span className="text-gray-500">
                          Chief Executive Officer
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-blue-500" />
                          <span>Michael Rodriguez</span>
                        </div>
                        <span className="text-gray-500">
                          Chief Technology Officer
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <DollarSign className="w-4 h-4 text-green-500" />
                          <span>Emily Johnson</span>
                        </div>
                        <span className="text-gray-500">
                          Chief Financial Officer
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="px-3 py-2 bg-gradient-to-r from-teal-50 to-teal-100 border-l-4 border-teal-300 text-teal-700 text-sm font-semibold rounded-t-lg">
                      Major Investors
                    </div>
                    <div className="border border-t-0 rounded-b-lg p-3 space-y-2 text-sm bg-white shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <PiggyBank className="w-4 h-4 text-green-500" />
                          <span>Vanguard Group</span>
                        </div>
                        <Badge variant="secondary" className="bg-gray-100">
                          8.2%
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <PiggyBank className="w-4 h-4 text-green-500" />
                          <span>BlackRock Inc.</span>
                        </div>
                        <Badge variant="secondary" className="bg-gray-100">
                          6.7%
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <PiggyBank className="w-4 h-4 text-green-500" />
                          <span>Sequoia Capital</span>
                        </div>
                        <Badge variant="secondary" className="bg-gray-100">
                          4.1%
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="px-3 py-2 bg-gradient-to-r from-purple-50 to-purple-100 border-l-4 border-purple-300 text-purple-700 text-sm font-semibold rounded-t-lg">
                      Technology & Competition
                    </div>
                    <div className="border border-t-0 rounded-b-lg p-3 space-y-3 text-sm bg-white shadow-sm">
                      <div>
                        <div className="flex items-center space-x-2 text-gray-500 mb-1">
                          <Cpu className="w-4 h-4" />
                          <span>Technologies</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {(
                            (activeCompany?.companyName === "BBCL"
                              ? ["AutoCAD", "Revit", "Maya", "3ds Max", "+2 more"]
                              : activeCompany?.relatedTopics || [])
                          ).map((rawTopic, idx) => {
                            const t = typeof rawTopic === 'string' ? rawTopic : (rawTopic?.topic || rawTopic?.name || JSON.stringify(rawTopic));
                            return (
                              <Badge key={`${t}-${idx}`} variant="secondary" className="bg-gray-100">
                                {t}
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 text-gray-500 mb-1">
                          <Target className="w-4 h-4" />
                          <span>Key Competitors</span>
                        </div>
                        <div className="text-sm">
                          Dassault Systèmes, PTC, Trimble, Adobe, Siemens, PLM
                          Software
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="px-3 py-2 bg-gradient-to-r from-indigo-50 to-indigo-100 border-l-4 border-indigo-300 text-indigo-700 text-sm font-semibold rounded-t-lg">
                      Stock Info
                    </div>
                    <div className="border border-t-0 rounded-b-lg p-3 grid grid-cols-2 gap-3 text-sm bg-white shadow-sm">
                      <div>
                        <div className="flex items-center space-x-2 text-gray-500 mb-1">
                          <DollarSign className="w-4 h-4" />
                          <span>Price</span>
                        </div>
                        <div className="font-semibold text-green-700">
                          $145.32
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 text-gray-500 mb-1">
                          <BarChart3 className="w-4 h-4" />
                          <span>Cap</span>
                        </div>
                        <div className="font-semibold">$12.5B</div>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 text-gray-500 mb-1">
                          <BadgeIcon className="w-4 h-4" />
                          <span>Symbol</span>
                        </div>
                        <div className="font-semibold">BBCL</div>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 text-gray-500 mb-1">
                          <Building className="w-4 h-4" />
                          <span>Exchange</span>
                        </div>
                        <div className="font-semibold">NASDAQ</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="px-3 py-2 bg-gradient-to-r from-orange-50 to-orange-100 border-l-4 border-orange-300 text-orange-700 text-sm font-semibold rounded-t-lg">
                      Recent News
                    </div>
                    <div className="border border-t-0 rounded-b-lg p-3 space-y-2 text-sm bg-white shadow-sm">
                      <div className="flex items-start space-x-2">
                        <Newspaper className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />
                        <div>
                          <div className="font-medium">
                            BBCL Announces Q3 2024 Financial Results
                          </div>
                          <div className="text-xs text-gray-500">
                            Business Wire • 2024-06-10
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Newspaper className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />
                        <div>
                          <div className="font-medium">
                            New Partnership with Tech Innovators Inc.
                          </div>
                          <div className="text-xs text-gray-500">
                            TechCrunch • 2024-06-05
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="px-3 py-2 bg-gradient-to-r from-cyan-50 to-cyan-100 border-l-4 border-cyan-300 text-cyan-700 text-sm font-semibold rounded-t-lg">
                      Sources & Links
                    </div>
                    <div className="border border-t-0 rounded-b-lg p-3 space-y-2 text-sm bg-white shadow-sm">
                      <div className="flex items-center space-x-2">
                        <LinkIcon className="w-4 h-4 text-gray-500" />
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary" className="bg-gray-100">
                            Newsletter
                          </Badge>
                          <Badge variant="secondary" className="bg-gray-100">
                            Blog
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Globe className="w-4 h-4 text-gray-500" />
                        <div className="text-xs text-gray-600">
                          bbcl.com • en.wikipedia.org/wiki/BBCL • +2 more
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
