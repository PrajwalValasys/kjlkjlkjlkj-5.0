import React, { useState, useMemo } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Target,
  CreditCard,
  Upload,
  CheckCircle,
  Info,
  Zap,
  Check,
  Users,
  FileText,
  Sparkles,
  Bot,
  TrendingUp,
  BarChart3,
  Clock,
  Star,
  Shield,
  ChevronRight,
  X,
  Lightbulb,
  Download,
  RefreshCw,
  ArrowLeft,
  Filter,
  Search,
  Eye,
  ChevronLeft,
  Settings2,
  DollarSign,
  Globe,
  Building,
  Maximize,
  Lock,
  ArrowUp,
  Brain,
} from "lucide-react";
import { cn } from "@/lib/utils";
import IntentSignalChart from "@/components/dashboard/IntentSignalChart";

interface FileUploadState {
  file: File | null;
  uploaded: boolean;
  uploading: boolean;
}

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

const productSubcategories = [
  "SaaS",
  "FinTech",
  "Healthcare",
  "Software & Technology",
  "Financial Services",
  "Healthcare & Life Sciences",
  "Manufacturing & Industrial",
  "Retail & E-commerce",
  "Professional Services",
  "Education & Training",
];

const recentUploads = [
  { name: "ABM_accounts_Q4.xlsx", date: "2 hours ago", type: "ABM" },
  { name: "LAL_top_performers.csv", date: "1 day ago", type: "LAL" },
  { name: "healthcare_accounts.xlsx", date: "3 days ago", type: "ABM" },
];

const savedSubcategories = ["SaaS", "FinTech", "Healthcare"];

const aiSuggestions = [
  {
    id: 1,
    text: "Your ABM file shows strong SaaS accounts — try generating LAL in SaaS Healthcare.",
    type: "opportunity",
    action: "Apply Suggestion",
  },
  {
    id: 2,
    text: "Success rate lower than average. Optimize file format?",
    type: "improvement",
    action: "View Guide",
  },
  {
    id: 3,
    text: "Consider expanding to Enterprise segment based on your current matches.",
    type: "insight",
    action: "Explore",
  },
];

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

export default function ABMLAL() {
  const [activeTab, setActiveTab] = useState("abm");
  const [productSubcategory, setProductSubcategory] = useState("");
  const [abmFile, setAbmFile] = useState<FileUploadState>({
    file: null,
    uploaded: false,
    uploading: false,
  });
  const [lalFile, setLalFile] = useState<FileUploadState>({
    file: null,
    uploaded: false,
    uploading: false,
  });
  const [dragOver, setDragOver] = useState<string | null>(null);
  const [aiPanelCollapsed, setAiPanelCollapsed] = useState(false);

  // New state for showing VAIS Results
  const [showResults, setShowResults] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isGeneratingLAL, setIsGeneratingLAL] = useState(false);
  const [currentAction, setCurrentAction] = useState<"abm" | "lal" | null>(
    null,
  );

  // VAIS Results states (copied from VAISResults.tsx)
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

  // Mock credit data
  const creditsData = {
    searchLeft: 8847,
    totalAvailable: 15000,
    progressPercentage: (8847 / 15000) * 100,
  };

  const insightsData = {
    abmSuccessRate: 78,
    lalExpansionRate: 45,
    creditUsage: { used: 850, total: 1200 },
    topIndustries: ["SaaS", "FinTech", "Healthcare"],
  };

  // Handle ABM verification
  const handleVerifyABM = async () => {
    setIsVerifying(true);
    setCurrentAction("abm");

    // Simulate verification process
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsVerifying(false);
    setShowResults(true);
  };

  // Handle LAL generation
  const handleGenerateLAL = async () => {
    setIsGeneratingLAL(true);
    setCurrentAction("lal");

    // Simulate LAL generation process
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsGeneratingLAL(false);
    setShowResults(true);
  };

  // Handle back to form
  const handleBackToForm = () => {
    setShowResults(false);
    setCurrentPage(1);
    setSearchTerm("");
    setSelectedItems([]);
    setCurrentAction(null);
  };

  // VAIS Results functions (copied from VAISResults.tsx)
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

  const actualTotalPages = Math.ceil(sortedData.length / itemsPerPage);
  const totalPages = actualTotalPages + 1; // +1 for premium page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);
  const isPremiumPage = currentPage > actualTotalPages;
  const showPremiumOverlay = currentPage >= 3; // Show overlay from page 3 onwards

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

  const handleFileUpload = (files: FileList | null, type: "abm" | "lal") => {
    if (!files || files.length === 0) return;

    const file = files[0];
    const fileState = type === "abm" ? abmFile : lalFile;
    const setFileState = type === "abm" ? setAbmFile : setLalFile;

    if (
      file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.type === "text/csv" ||
      file.name.endsWith(".xlsx") ||
      file.name.endsWith(".csv")
    ) {
      setFileState({ ...fileState, uploading: true });

      setTimeout(() => {
        setFileState({ file, uploaded: true, uploading: false });
      }, 1500);
    }
  };

  const handleDragOver = (e: React.DragEvent, type: "abm" | "lal") => {
    e.preventDefault();
    setDragOver(type);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(null);
  };

  const handleDrop = (e: React.DragEvent, type: "abm" | "lal") => {
    e.preventDefault();
    setDragOver(null);
    handleFileUpload(e.dataTransfer.files, type);
  };

  const FileUploadCard = ({
    type,
    placeholder,
    tooltipText,
    fileState,
    onFileChange,
  }: {
    type: "abm" | "lal";
    placeholder: string;
    tooltipText: string;
    fileState: FileUploadState;
    onFileChange: (files: FileList | null) => void;
  }) => (
    <Card className="relative group">
      <CardContent className="p-6">
        <div
          className={cn(
            "border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer",
            dragOver === type
              ? "border-valasys-orange bg-orange-50 shadow-lg animate-pulse scale-105"
              : fileState.uploaded
                ? "border-green-500 bg-green-50"
                : "border-gray-300 hover:border-valasys-orange hover:bg-orange-50 hover:shadow-lg hover:scale-105",
          )}
          onDragOver={(e) => handleDragOver(e, type)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, type)}
          onClick={() => document.getElementById(`file-input-${type}`)?.click()}
        >
          <input
            id={`file-input-${type}`}
            type="file"
            accept=".xlsx,.csv"
            className="hidden"
            onChange={(e) => onFileChange(e.target.files)}
          />

          {fileState.uploading ? (
            <div className="space-y-3">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-valasys-orange to-orange-400 rounded-full flex items-center justify-center animate-spin">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <p className="text-valasys-orange font-semibold text-lg">
                Uploading...
              </p>
            </div>
          ) : fileState.uploaded ? (
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-white animate-bounce" />
              </div>
              <p className="text-green-600 font-semibold text-lg">
                {fileState.file?.name}
              </p>
              <p className="text-sm text-green-500">
                File uploaded successfully!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div
                className={cn(
                  "w-16 h-16 mx-auto rounded-full flex items-center justify-center transition-all duration-300",
                  dragOver === type
                    ? "bg-valasys-orange text-white scale-110"
                    : "bg-gray-100 text-gray-400 group-hover:bg-valasys-orange group-hover:text-white",
                )}
              >
                <Upload className="w-8 h-8" />
              </div>
              <p
                className={cn(
                  "text-gray-600 transition-colors duration-300 font-medium text-lg",
                  dragOver === type && "text-valasys-orange",
                )}
              >
                {placeholder}
              </p>
              <p className="text-sm text-gray-400">
                Drag and drop or click to browse
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center mt-4 space-x-2">
          <Info className="w-4 h-4 text-gray-400" />
          <span className="text-xs text-gray-500">{tooltipText}</span>
        </div>
      </CardContent>
    </Card>
  );

  const PremiumOverlay = () => (
    <div className="relative">
      {/* AI Teaser */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border border-blue-200">
          <Brain className="w-4 h-4 text-blue-600" />
          <span className="text-sm text-blue-700 font-medium">
            AI spotted a 15% growth in IT accounts — upgrade for full breakdown.
          </span>
        </div>
      </div>

      {/* Main Overlay Card */}
      <Card className="max-w-lg mx-auto bg-white/85 backdrop-blur-sm border-t-4 border-t-valasys-orange shadow-2xl">
        <CardContent className="p-8 text-center space-y-6">
          {/* Lock Icon */}
          <div className="flex justify-center">
            <div className="p-4 bg-gradient-to-r from-valasys-orange to-orange-400 rounded-full">
              <Lock className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Headline and Subtext */}
          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-gray-900">
              Want more premium insights?
            </h3>
            <p className="text-gray-600 text-lg">
              Unlock this feature with a quick upgrade.
            </p>
          </div>

          {/* Gamification Progress Bar */}
          <div className="space-y-2">
            <div className="text-sm text-gray-700 font-medium">
              You've seen 20% of insights. Upgrade to unlock the rest.
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-valasys-orange to-orange-400 h-3 rounded-full transition-all duration-300"
                style={{ width: "20%" }}
              />
            </div>
          </div>

          {/* Primary CTA Button */}
          <Button className="w-full h-14 bg-gradient-to-r from-valasys-orange to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white font-semibold text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <ArrowUp className="w-5 h-5 mr-3" />
            Upgrade Plans
          </Button>

          {/* Secondary Link */}
          <div className="pt-2">
            <button className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200">
              See what's included in Premium →
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg z-40">
        <div className="w-full px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Lock className="w-4 h-4 text-valasys-orange" />
              <span className="text-sm font-medium text-gray-700">
                🔒 Unlock deeper insights with Premium
              </span>
            </div>
            <Button
              size="sm"
              className="bg-gradient-to-r from-valasys-orange to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white font-medium rounded-full px-4"
            >
              <ArrowUp className="w-4 h-4 mr-1" />
              Upgrade
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const CircularProgressComponent = ({
    value,
    title,
    subtitle,
  }: {
    value: number;
    title: string;
    subtitle: string;
  }) => (
    <div className="relative">
      <svg className="w-20 h-20 transform -rotate-90">
        <circle
          cx="40"
          cy="40"
          r="36"
          stroke="#e2e8f0"
          strokeWidth="8"
          fill="none"
        />
        <circle
          cx="40"
          cy="40"
          r="36"
          stroke="#FF6A00"
          strokeWidth="8"
          fill="none"
          strokeDasharray={`${(value / 100) * 226.2} 226.2`}
          className="transition-all duration-300"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xl font-bold text-gray-900">{value}%</span>
      </div>
      <div className="text-center mt-2">
        <p className="font-semibold text-gray-900 text-sm">{title}</p>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>
    </div>
  );

  // Show VAIS Results view
  if (showResults) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                className="text-valasys-orange hover:bg-valasys-orange hover:text-white"
                onClick={handleBackToForm}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {currentAction === "abm" ? "ABM Results" : "LAL Results"}
              </Button>
              <div className="text-sm text-valasys-gray-600">
                {currentAction === "abm" ? "ABM" : "LAL"} subcategory:{" "}
                <span className="font-medium text-valasys-orange">
                  {productSubcategory}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                <BarChart3 className="w-3 h-3 mr-1" />
                Total Records:{" "}
                <span className="font-bold ml-1">
                  {filteredData.length}/827
                </span>
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
                    Filters
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
                <div className="flex items-center space-x-3 text-sm text-gray-500">
                  <Badge
                    variant="secondary"
                    className="bg-blue-50 text-blue-700"
                  >
                    <BarChart3 className="w-3 h-3 mr-1" />
                    Total Records:{" "}
                    <span className="font-bold ml-1">
                      {filteredData.length}/827
                    </span>
                  </Badge>
                  <span>
                    Page: <span className="font-medium">{currentPage}</span> of{" "}
                    <span className="font-medium">{totalPages}</span>
                  </span>
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
          <Card className="shadow-sm relative">
            {/* Premium Overlay */}
            {isPremiumPage && (
              <div className="absolute inset-0 z-30 bg-white/10 backdrop-blur-sm rounded-lg">
                <div className="h-full flex items-center justify-center p-8">
                  <PremiumOverlay />
                </div>
              </div>
            )}

            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <CardTitle className="text-lg">
                    {currentAction === "abm"
                      ? "ABM Verification Results"
                      : "LAL Generation Results"}
                  </CardTitle>
                  <Badge variant="secondary" className="bg-gray-100">
                    {selectedItems.length} Items Selected
                  </Badge>
                </div>
                <Button
                  className="bg-valasys-orange hover:bg-valasys-orange/90"
                  disabled={selectedItems.length === 0 || isPremiumPage}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </CardHeader>
            <CardContent className={cn("p-0", isPremiumPage && "blur-sm")}>
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
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isPremiumPage
                      ? // Show blurred placeholder rows for premium page
                        Array.from({ length: 5 }, (_, index) => (
                          <TableRow key={`premium-${index}`}>
                            <TableCell className="pl-6">
                              <Checkbox disabled />
                            </TableCell>
                            <TableCell className="font-medium text-gray-400">
                              Premium Company {index + 1}
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex justify-center">
                                <CircularProgress
                                  value={85 + index * 2}
                                  size={56}
                                  strokeWidth={4}
                                />
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className="bg-gray-200 text-gray-400">
                                Premium Signal
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-gray-400">
                              Premium Industry
                            </TableCell>
                            <TableCell className="text-sm text-gray-400">
                              Premium Sub-Industry
                            </TableCell>
                            <TableCell className="text-sm text-gray-400">
                              Premium Size
                            </TableCell>
                            <TableCell className="text-sm text-gray-400">
                              Premium Revenue
                            </TableCell>
                            <TableCell className="text-sm text-gray-400">
                              Premium Country
                            </TableCell>
                          </TableRow>
                        ))
                      : paginatedData.map((item) => (
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
                            <TableCell className="font-medium text-valasys-gray-900">
                              {item.companyName}
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex justify-center">
                                <CircularProgress
                                  value={item.vais}
                                  size={56}
                                  strokeWidth={4}
                                />
                              </div>
                            </TableCell>
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
                            <TableCell className="text-sm text-gray-700">
                              {item.mainIndustry}
                            </TableCell>
                            <TableCell className="text-sm text-gray-700">
                              {item.subIndustry}
                            </TableCell>
                            <TableCell className="text-sm text-gray-700">
                              {item.companySize}
                            </TableCell>
                            <TableCell className="text-sm text-gray-700">
                              {item.revenue}
                            </TableCell>
                            <TableCell className="text-sm text-gray-700">
                              {item.country}
                            </TableCell>
                          </TableRow>
                        ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between p-4 border-t bg-gray-50">
                <div className="text-sm text-gray-600">
                  {isPremiumPage ? (
                    <span className="flex items-center space-x-2">
                      <Lock className="w-4 h-4 text-valasys-orange" />
                      <span>Premium insights available with upgrade</span>
                    </span>
                  ) : (
                    <>
                      Showing {startIndex + 1} to{" "}
                      {Math.min(startIndex + itemsPerPage, sortedData.length)}{" "}
                      of {sortedData.length} results
                    </>
                  )}
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
                      const isLastPage = pageNum === totalPages;
                      const isPremiumPageNum =
                        pageNum > Math.ceil(sortedData.length / itemsPerPage);
                      return (
                        <Button
                          key={pageNum}
                          variant={
                            pageNum === currentPage ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                          className={cn(
                            isPremiumPageNum ? "px-3 h-8" : "w-8 h-8 p-0",
                            pageNum === currentPage &&
                              "bg-valasys-orange hover:bg-valasys-orange/90",
                          )}
                        >
                          {isPremiumPageNum ? (
                            <div className="flex items-center space-x-1">
                              <Lock className="w-3 h-3" />
                              <span className="text-xs">Premium</span>
                            </div>
                          ) : (
                            pageNum
                          )}
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
                          totalPages >
                            Math.ceil(sortedData.length / itemsPerPage)
                            ? "px-3 h-8"
                            : "w-8 h-8 p-0",
                          totalPages === currentPage &&
                            "bg-valasys-orange hover:bg-valasys-orange/90",
                        )}
                      >
                        {totalPages >
                        Math.ceil(sortedData.length / itemsPerPage) ? (
                          <div className="flex items-center space-x-1">
                            <Lock className="w-3 h-3" />
                            <span className="text-xs">Premium</span>
                          </div>
                        ) : (
                          totalPages
                        )}
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
    );
  }

  // Show original ABM/LAL form
  return (
    <DashboardLayout>
      <div className="grid grid-cols-12 gap-6 h-full">
        {/* Main Content Area */}
        <div
          className={cn(
            "transition-all duration-300",
            "col-span-12 lg:col-span-9",
            aiPanelCollapsed && "lg:col-span-12",
          )}
        >
          <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-valasys-orange to-valasys-orange-light rounded-lg flex items-center justify-center">
                    <Target className="w-4 h-4 text-white" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    ABM / LAL Dashboard
                  </h1>
                </div>
                <p className="text-gray-600 text-lg mt-1">
                  Account-Based Marketing & Look-Alike Intelligence
                </p>
              </div>

              {/* Credits Widget */}
              <Card data-tour="abm-credits" className="lg:w-80 shadow-lg">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <CreditCard className="w-5 h-5 text-valasys-orange" />
                      <span className="text-sm font-semibold text-gray-700">
                        Credits
                      </span>
                    </div>
                    <Badge className="bg-gradient-to-r from-valasys-orange to-orange-400 text-white text-sm px-3 py-1">
                      {creditsData.searchLeft.toLocaleString()} Left
                    </Badge>
                  </div>
                  <Progress
                    value={creditsData.progressPercentage}
                    className="h-3 mb-2"
                  />
                  <p className="text-xs text-gray-500">
                    {creditsData.totalAvailable.toLocaleString()} Total Credits
                    Available
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Access Panel */}
            <Card data-tour="abm-quick-access" className="shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Quick Access
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Quick Action Buttons */}
                  <div className="space-y-3">
                    <Button
                      className="w-full h-12 bg-gradient-to-r from-valasys-orange to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                      onClick={() => setActiveTab("abm")}
                    >
                      <Check className="w-5 h-5 mr-2" />
                      Verify ABM Now
                    </Button>
                    <Button
                      className="w-full h-12 bg-gradient-to-r from-valasys-orange to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                      onClick={() => setActiveTab("lal")}
                    >
                      <Zap className="w-5 h-5 mr-2" />
                      Generate LAL Now
                    </Button>
                  </div>

                  {/* Recent Uploads */}
                  <div className="space-y-2">
                    <h3 className="font-medium text-gray-700 text-sm">
                      Recent Uploads
                    </h3>
                    <div className="space-y-2">
                      {recentUploads.map((upload, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center space-x-2">
                            <FileText className="w-4 h-4 text-gray-400" />
                            <div>
                              <p className="text-xs font-medium text-gray-700 truncate max-w-24">
                                {upload.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {upload.date}
                              </p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0"
                          >
                            <RefreshCw className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Saved Subcategories */}
                  <div className="space-y-2">
                    <h3 className="font-medium text-gray-700 text-sm">
                      Saved Categories
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {savedSubcategories.map((category, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="cursor-pointer hover:bg-valasys-orange hover:text-white transition-colors"
                          onClick={() => setProductSubcategory(category)}
                        >
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="space-y-2">
                    <h3 className="font-medium text-gray-700 text-sm">
                      Today's Activity
                    </h3>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">ABM Verified</span>
                        <span className="font-medium">24</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">LAL Generated</span>
                        <span className="font-medium">12</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">Credits Used</span>
                        <span className="font-medium">156</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Main Tabbed Section */}
            <Card className="shadow-lg">
              <CardContent className="p-0">
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <div className="border-b border-gray-200 px-3 sm:px-6 pt-6">
                    <TabsList className="h-auto p-0 bg-transparent w-full justify-start">
                      <TabsTrigger
                        value="abm"
                        className={cn(
                          "px-3 sm:px-6 py-3 text-sm sm:text-base font-semibold border-b-2 rounded-none bg-transparent flex-1 sm:flex-none",
                          "data-[state=active]:border-valasys-orange data-[state=active]:text-valasys-orange data-[state=active]:bg-transparent",
                          "data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-500 hover:text-gray-700",
                          "transition-all duration-300",
                        )}
                      >
                        <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                        ABM
                      </TabsTrigger>
                      <TabsTrigger
                        value="lal"
                        className={cn(
                          "px-3 sm:px-6 py-3 text-sm sm:text-base font-semibold border-b-2 rounded-none bg-transparent flex-1 sm:flex-none",
                          "data-[state=active]:border-valasys-orange data-[state=active]:text-valasys-orange data-[state=active]:bg-transparent",
                          "data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-500 hover:text-gray-700",
                          "transition-all duration-300",
                        )}
                      >
                        <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                        LAL
                      </TabsTrigger>
                      <TabsTrigger
                        value="insights"
                        className={cn(
                          "px-3 sm:px-6 py-3 text-sm sm:text-base font-semibold border-b-2 rounded-none bg-transparent flex-1 sm:flex-none",
                          "data-[state=active]:border-valasys-orange data-[state=active]:text-valasys-orange data-[state=active]:bg-transparent",
                          "data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-500 hover:text-gray-700",
                          "transition-all duration-300",
                        )}
                      >
                        <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                        Insights
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  {/* ABM Tab Content */}
                  <TabsContent
                    data-tour="abm-verify-accounts"
                    value="abm"
                    className="p-8 space-y-8"
                  >
                    <div className="space-y-3">
                      <h2 className="text-2xl font-bold text-gray-900">
                        Verify Your ABM Accounts
                      </h2>
                      <p className="text-gray-600 text-lg">
                        Check and enrich your target accounts in seconds.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div className="space-y-3">
                          <label className="text-sm font-semibold text-gray-700">
                            My Product Subcategory
                          </label>
                          <Select
                            value={productSubcategory}
                            onValueChange={setProductSubcategory}
                          >
                            <SelectTrigger className="w-full h-12 text-base">
                              <SelectValue placeholder="e.g., SaaS, FinTech, Healthcare" />
                            </SelectTrigger>
                            <SelectContent>
                              {productSubcategories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex flex-col space-y-4">
                          <Button
                            className={cn(
                              "w-full h-14 bg-gradient-to-r from-valasys-orange to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white font-semibold text-lg",
                              "transition-all duration-300 hover:shadow-xl hover:shadow-orange-200 hover:scale-105",
                              "disabled:opacity-50 disabled:cursor-not-allowed",
                            )}
                            disabled={
                              !abmFile.uploaded ||
                              !productSubcategory ||
                              isVerifying
                            }
                            onClick={handleVerifyABM}
                          >
                            {isVerifying ? (
                              <>
                                <RefreshCw className="w-6 h-6 mr-3 animate-spin" />
                                Verifying...
                              </>
                            ) : (
                              <>
                                <Check className="w-6 h-6 mr-3" />
                                Verify My ABM
                              </>
                            )}
                          </Button>
                          <p className="text-sm text-gray-500 text-center">
                            Each Verify My ABM action deducts one credit per
                            domain uploaded.
                          </p>
                        </div>
                      </div>

                      <FileUploadCard
                        type="abm"
                        placeholder="Upload ABM file (.xlsx / .csv)"
                        tooltipText="Use the ABM template for proper formatting."
                        fileState={abmFile}
                        onFileChange={(files) => handleFileUpload(files, "abm")}
                      />
                    </div>
                  </TabsContent>

                  {/* LAL Tab Content */}
                  <TabsContent
                    data-tour="abm-generate-lal"
                    value="lal"
                    className="p-8 space-y-8"
                  >
                    <div className="space-y-3">
                      <h2 className="text-2xl font-bold text-gray-900">
                        Generate Look-Alike Accounts
                      </h2>
                      <p className="text-gray-600 text-lg">
                        Expand into new opportunities with AI-powered look-alike
                        insights.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div className="space-y-3">
                          <label className="text-sm font-semibold text-gray-700">
                            My Product Subcategory
                          </label>
                          <Select
                            value={productSubcategory}
                            onValueChange={setProductSubcategory}
                          >
                            <SelectTrigger className="w-full h-12 text-base">
                              <SelectValue placeholder="e.g., SaaS, FinTech, Healthcare" />
                            </SelectTrigger>
                            <SelectContent>
                              {productSubcategories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex flex-col space-y-4">
                          <Button
                            className={cn(
                              "w-full h-14 bg-gradient-to-r from-valasys-orange to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white font-semibold text-lg",
                              "transition-all duration-300 hover:shadow-xl hover:shadow-orange-200 hover:scale-105",
                              "disabled:opacity-50 disabled:cursor-not-allowed",
                            )}
                            disabled={
                              !lalFile.uploaded ||
                              !productSubcategory ||
                              isGeneratingLAL
                            }
                            onClick={handleGenerateLAL}
                          >
                            {isGeneratingLAL ? (
                              <>
                                <RefreshCw className="w-6 h-6 mr-3 animate-spin" />
                                Generating...
                              </>
                            ) : (
                              <>
                                <Zap className="w-6 h-6 mr-3" />
                                Generate LAL
                              </>
                            )}
                          </Button>
                          <p className="text-sm text-gray-500 text-center">
                            Each Generate LAL action deducts one search from
                            your available credits.
                          </p>
                        </div>
                      </div>

                      <FileUploadCard
                        type="lal"
                        placeholder="Upload Top Performing Accounts (.xlsx / .csv)"
                        tooltipText="Use the LAL template to format your accounts."
                        fileState={lalFile}
                        onFileChange={(files) => handleFileUpload(files, "lal")}
                      />
                    </div>
                  </TabsContent>

                  {/* Insights Tab Content */}
                  <TabsContent
                    data-tour="abm-performance-insights"
                    value="insights"
                    className="p-8 space-y-8"
                  >
                    <div className="space-y-3">
                      <h2 className="text-2xl font-bold text-gray-900">
                        Performance Insights
                      </h2>
                      <p className="text-gray-600 text-lg">
                        Track your ABM and LAL performance metrics.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Mini Dashboards */}
                      <Card className="p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
                        <CircularProgressComponent
                          value={insightsData.abmSuccessRate}
                          title="ABM Success Rate"
                          subtitle="Verified Success"
                        />
                      </Card>

                      <Card className="p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
                        <CircularProgressComponent
                          value={insightsData.lalExpansionRate}
                          title="LAL Expansion Rate"
                          subtitle="New accounts found"
                        />
                      </Card>

                      <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow">
                        <div className="space-y-4">
                          <h3 className="font-bold text-gray-900">
                            Credit Usage
                          </h3>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Used</span>
                              <span className="font-semibold">
                                {insightsData.creditUsage.used}/
                                {insightsData.creditUsage.total}
                              </span>
                            </div>
                            <Progress
                              value={
                                (insightsData.creditUsage.used /
                                  insightsData.creditUsage.total) *
                                100
                              }
                              className="h-3"
                            />
                          </div>
                          <div className="text-center">
                            <span className="text-2xl font-bold text-valasys-orange">
                              {(
                                (insightsData.creditUsage.used /
                                  insightsData.creditUsage.total) *
                                100
                              ).toFixed(0)}
                              %
                            </span>
                            <p className="text-xs text-gray-500">Utilization</p>
                          </div>
                        </div>
                      </Card>
                    </div>

                    {/* Industry Matches */}
                    <Card className="shadow-lg">
                      <CardHeader>
                        <CardTitle className="text-lg font-semibold">
                          Top Industry Matches
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {insightsData.topIndustries.map((industry, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                              <span className="font-medium text-gray-700">
                                {industry}
                              </span>
                              <Badge
                                variant="secondary"
                                className="bg-valasys-orange text-white"
                              >
                                #{index + 1}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Trust Badges */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="p-4 text-center shadow-lg">
                        <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                        <p className="font-semibold text-gray-900">
                          1000+ accounts
                        </p>
                        <p className="text-sm text-gray-500">
                          verified this month
                        </p>
                      </Card>

                      <Card className="p-4 text-center shadow-lg">
                        <Shield className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                        <p className="font-semibold text-gray-900">
                          ISO Certified
                        </p>
                        <p className="text-sm text-gray-500">Data Security</p>
                      </Card>

                      <Card className="p-4 text-center shadow-lg">
                        <div className="flex justify-center mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-4 h-4 text-yellow-400 fill-current"
                            />
                          ))}
                        </div>
                        <p className="font-semibold text-gray-900">
                          4.9/5 Rating
                        </p>
                        <p className="text-sm text-gray-500">User Reviews</p>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* AI Suggestions Panel */}
        <div
          className={cn(
            "transition-all duration-300 hidden lg:block",
            aiPanelCollapsed ? "col-span-0 overflow-hidden" : "col-span-3",
          )}
        >
          <Card className="h-full shadow-lg sticky top-6">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bot className="w-5 h-5 text-valasys-orange" />
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    AI Suggestions
                  </CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAiPanelCollapsed(!aiPanelCollapsed)}
                  className="h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {aiSuggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl border border-orange-200"
                >
                  <div className="flex items-start space-x-3">
                    <Lightbulb className="w-5 h-5 text-valasys-orange flex-shrink-0 mt-0.5" />
                    <div className="flex-1 space-y-3">
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {suggestion.text}
                      </p>
                      <Button
                        size="sm"
                        className="bg-valasys-orange hover:bg-orange-600 text-white text-xs h-8 px-3"
                      >
                        {suggestion.action}
                        <ChevronRight className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Collapsed AI Panel Toggle */}
        {aiPanelCollapsed && (
          <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-50 hidden lg:block">
            <Button
              onClick={() => setAiPanelCollapsed(false)}
              className="bg-valasys-orange hover:bg-orange-600 text-white p-3 rounded-full shadow-lg"
            >
              <Bot className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
