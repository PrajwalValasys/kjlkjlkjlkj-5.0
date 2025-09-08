import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { decrypt } from '@/store/encryption';
import type { RootState } from '@/store';
import { setICPScore, setICPData, setPagination } from '@/store/reducers/icpScoreSlice';
import { setLoading } from '@/store/reducers/loadingSlice';
import authService from '@/api/services/authService';
import { icpService } from '@/api/services';
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Upload,
  X,
  Search,
  Download,
  Info,
  FileText,
  MapPin,
  Tag,
  Building,
  CheckCircle,
  AlertCircle,
  Plus,
  Save,
  Clock,
  TrendingUp,
  Users,
  Target,
  Check,
  FileCheck,
  FileX,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { FloatingStatsWidget } from "@/components/ui/floating-stats-widget";

interface FormData {
  productSubcategory: string; // stores id or name depending on source
  productCategory: string;
  geolocation: string[];
  intentTopics: string[];
  uploadedFile?: File;
}

interface SavedSearch {
  id: string;
  name: string;
  formData: FormData;
  createdAt: Date;
}

// Default fallbacks used until API values are loaded
const DEFAULT_PRODUCT_SUBCATEGORIES = [
  "Software Solutions",
  "Hardware Components",
  "Cloud Services",
  "Analytics Tools",
  "Security Solutions",
  "AI/ML Platforms",
  "Data Management",
  "Infrastructure Services",
];

const DEFAULT_PRODUCT_CATEGORIES = [
  "Enterprise Software",
  "Consumer Technology",
  "B2B Services",
  "SaaS Platform",
  "Mobile Applications",
  "IoT Solutions",
  "Cybersecurity",
  "Digital Marketing",
];

const DEFAULT_GEOLOCATIONS = [
  "North America",
  "Europe",
  "Asia Pacific",
  "Latin America",
  "Middle East & Africa",
  "Global",
];

const filterTopics = [
  "Supply Chain",
  "Financial",
  "Technology",
  "Telecommunications",
  "Health Tech",
  "Sales",
  "Emerging Tech",
  "Mobile",
  "Other",
  "Security",
  "Tools & Electronics",
  "Business Services",
  "Corporate Finance",
  "Controls & Standards",
  "Finance IT",
  "Personal Finance",
  "Operations",
  "Business Solutions",
  "Enterprise",
  "Standards & Regulatory",
  "Disease Control",
  "HR",
  "AgriTech",
  "Water Quality",
  "Media & Advertising",
  "Compliance & Governance",
  "Legal & Regulatory",
  "Policy & Culture",
  "Staff Departure",
  "Branding",
  "Content",
  "Creativity Software",
  "Search Marketing",
  "Certifications",
  "Desktop",
  "Email",
  "Messaging",
  "Transportation",
  "Personal Computer",
  "Trends",
  "Aerospace",
  "Gaming",
  "Medical Education",
  "Landmark Cases",
  "Marketing",
  "Medical Testing",
  "Chromatography",
  "Lab Automation",
  "Lab Data Management & Analysis",
  "Jail & Prison",
  "Energy & Construction",
  "Copyright",
  "Design Engineering",
  "Health Conditions",
];

const filterThemes = [
  "Business",
  "Energy/Construction/Manufacturing",
  "Company",
  "Technology",
  "Healthcare",
  "Finance",
  "BioTech",
  "Human Resources",
  "Legal",
  "Marketing",
  "Products",
  "Government",
  "Retail",
  "Media",
  "Travel",
  "Consumer Technology",
  "Events & Conferences",
  "Arts & Entertainment",
  "Beauty & Fitness",
  "Food & Drink",
  "Hobbies & Leisure",
  "Home & Garden",
  "Education",
  "People & Society",
  "Pets & Animals",
  "Science",
  "Shopping",
  "Sports",
];

const intentTopics = [
  {
    name: "Request for Information (RFI)",
    description: "Prospects actively seeking product information",
    volume: "High",
    conversion: "85%",
  },
  {
    name: "Pricing Inquiry",
    description: "Ready-to-buy prospects comparing prices",
    volume: "Medium",
    conversion: "92%",
  },
  {
    name: "Product Demo",
    description: "Qualified prospects wanting to see the product",
    volume: "Medium",
    conversion: "88%",
  },
  {
    name: "Technical Support",
    description: "Existing customers needing assistance",
    volume: "High",
    conversion: "65%",
  },
  {
    name: "Partnership Opportunities",
    description: "Businesses seeking strategic partnerships",
    volume: "Low",
    conversion: "78%",
  },
  {
    name: "Implementation Services",
    description: "Prospects needing implementation help",
    volume: "Medium",
    conversion: "90%",
  },
  {
    name: "Training & Certification",
    description: "Organizations wanting team training",
    volume: "Medium",
    conversion: "82%",
  },
  {
    name: "Custom Development",
    description: "Prospects needing customization",
    volume: "Low",
    conversion: "95%",
  },
  {
    name: "Integration Support",
    description: "Technical prospects needing integration help",
    volume: "Medium",
    conversion: "87%",
  },
  {
    name: "Competitive Analysis",
    description: "Prospects comparing solutions",
    volume: "High",
    conversion: "70%",
  },
  {
    name: "Case Studies",
    description: "Prospects seeking proof of success",
    volume: "High",
    conversion: "75%",
  },
  {
    name: "Compliance & Security",
    description: "Security-focused prospects",
    volume: "Medium",
    conversion: "89%",
  },
  {
    name: "Migration Services",
    description: "Companies looking to migrate systems",
    volume: "Medium",
    conversion: "86%",
  },
  {
    name: "ROI Assessment",
    description: "Prospects evaluating return on investment",
    volume: "High",
    conversion: "79%",
  },
  {
    name: "Vendor Evaluation",
    description: "Companies comparing multiple vendors",
    volume: "High",
    conversion: "73%",
  },
  {
    name: "Proof of Concept",
    description: "Technical prospects wanting to test solutions",
    volume: "Medium",
    conversion: "91%",
  },
  {
    name: "Scalability Planning",
    description: "Growing companies planning for scale",
    volume: "Low",
    conversion: "84%",
  },
  {
    name: "Budget Planning",
    description: "Finance teams planning technology budgets",
    volume: "Medium",
    conversion: "77%",
  },
  {
    name: "Technology Roadmap",
    description: "Strategic planning for technology adoption",
    volume: "Low",
    conversion: "88%",
  },
  {
    name: "Disaster Recovery",
    description: "Companies planning business continuity",
    volume: "Medium",
    conversion: "83%",
  },
  {
    name: "Performance Optimization",
    description: "Organizations seeking to improve efficiency",
    volume: "High",
    conversion: "81%",
  },
  {
    name: "Cloud Migration",
    description: "Companies moving to cloud infrastructure",
    volume: "High",
    conversion: "85%",
  },
];

const steps = [
  { id: 1, name: "Product Configuration", icon: Tag },
  { id: 2, name: "Intent Topics", icon: Target },
  { id: 3, name: "Suppression File", icon: Upload },
  { id: 4, name: "Build VAIS", icon: Building },
];

export default function BuildVAISForm() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    productSubcategory: "",
    productCategory: "",
    geolocation: [],
    intentTopics: [],
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [geoSearchTerm, setGeoSearchTerm] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [generateTopicsInput, setGenerateTopicsInput] = useState("");
  const [filterTopic, setFilterTopic] = useState("");
  const [filterTheme, setFilterTheme] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileStatus, setFileStatus] = useState<"none" | "valid" | "invalid">(
    "none",
  );
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([
    {
      id: "1",
      name: "Software Campaign Q3",
      formData: {
        productSubcategory: "Software Solutions",
        productCategory: "Enterprise Software",
        geolocation: ["North America"],
        intentTopics: ["Pricing Inquiry", "Product Demo"],
      },
      createdAt: new Date("2024-08-15"),
    },
  ]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [newSearchName, setNewSearchName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  // Prefer user from user slice, fallback to auth slice (where logged-in user is often stored)
  const reduxUser = useSelector((state: RootState) => state.user?.userInfo ?? state.auth?.user);
  // Load saved searches for the current user (if any)
  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // resolve user id similar to other parts of this component
        let userObj: any = reduxUser;
        if (typeof reduxUser === 'string') userObj = decrypt(reduxUser as string) || reduxUser;
        if (userObj?.user) userObj = userObj.user;
        const userId = userObj?.id ?? userObj?.user_id ?? userObj?._id ?? null;

        const res = await icpService.getSavedSearches(userId);
        const list = Array.isArray(res) ? res : res?.data || res?.result || [];
        if (!mounted) return;

        const normalized = (list || []).map((s: any) => ({
          id: String(s.id || s._id || s.vais_filter_id),
          name: s.vais_filter_name || s.name || `Saved ${s.id}`,
          formData: {
            productSubcategory: s.product_sub_category_name || s.product_subcategory || s.product_sub_category || '',
            productCategory: s.product_category_name || s.product_category || '',
            geolocation: s.location || s.geolocation || [],
            intentTopics: s.topics || s.intent_topics || [],
          },
          createdAt: s.created_at ? new Date(s.created_at) : new Date(),
        }));

        if (normalized.length > 0) setSavedSearches(normalized);
      } catch (e) {
        console.warn('Failed to load saved searches', e);
      }
    })();
    return () => { mounted = false; };
  }, [reduxUser]);
  // productSubcategories will hold objects when returned by API: { id, product_sub_category_name }
  const [productCategories, setProductCategories] = useState<string[]>(DEFAULT_PRODUCT_CATEGORIES);
  const [productSubcategories, setProductSubcategories] = useState<any[]>(DEFAULT_PRODUCT_SUBCATEGORIES.map((s) => ({ id: s, product_sub_category_name: s })));
  const [geolocations, setGeolocations] = useState<string[]>(DEFAULT_GEOLOCATIONS);
  const [allTopics, setAllTopics] = useState<any[] | null>(null);
  const [loadingTopics, setLoadingTopics] = useState<boolean>(false);
  const [categoryOptions, setCategoryOptions] = useState<string[]>(filterTopics);
  const [themeOptions, setThemeOptions] = useState<string[]>(filterThemes);
  const [visibleCount, setVisibleCount] = useState<number>(50);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const availableListRef = useRef<HTMLDivElement | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // Only fetch subcategories and countries on mount. Product categories
        // are fetched when a subcategory is selected (to keep category sticky).
        const [subsRes, countriesRes] = await Promise.all([
          icpService.getProductsSubCategory().catch(() => null),
          icpService.getAllCountries().catch(() => null),
        ]);

        if (!mounted) return;

        const normalizeArray = (res: any) => {
          // Try a few common shapes returned by different backends
          if (!res) return null;
          if (Array.isArray(res)) return res;
          // axios-like: response.data could be the array or an object that wraps the array
          if (Array.isArray(res.data)) return res.data;
          if (Array.isArray(res.data?.data)) return res.data.data;
          // specific keys used by our ICP endpoints
          if (Array.isArray(res.data?.product_sub_category_list)) return res.data.product_sub_category_list;
          if (Array.isArray(res.product_sub_category_list)) return res.product_sub_category_list;
          if (Array.isArray(res.data?.product_category_list)) return res.data.product_category_list;
          if (Array.isArray(res.data?.countries)) return res.data.countries;
          if (Array.isArray(res.data?.country_list)) return res.data.country_list;
          // country API: array under result
          if (Array.isArray(res.result)) return res.result;
          return null;
        };

        const subsArr = normalizeArray(subsRes);
        let countriesArr = normalizeArray(countriesRes);

        // Retry countries fetch once if it failed or returned null
        if (!countriesArr) {
          try {
            const retryRes = await icpService.getAllCountries();
            countriesArr = normalizeArray(retryRes);
          } catch (e) {
            // keep fallback
          }
        }

  // if product categories are returned independently, keep them; otherwise
  // categories will be set when a subcategory is selected
  // normalize subcategories
  if (subsArr) setProductSubcategories(subsArr.map((i: any) => {
          // normalize to object { id, product_sub_category_name }
          if (typeof i === 'string') return { id: i, product_sub_category_name: i };
          return { id: i.id ?? i._id ?? i.product_sub_category_id ?? i.product_sub_category_id ?? i.product_sub_category_id, product_sub_category_name: i.product_sub_category_name || i.name || i.product_sub_category || i };
        }));
  if (countriesArr) setGeolocations(countriesArr.map((i: any) => i.country || i.country_name || i.name || i));
      } catch (e) {
        console.warn('Failed to fetch dropdown data', e);
      }
    })();
    // Fetch topics for Available Topics
    (async () => {
      setLoadingTopics(true);
      try {
        const res = await icpService.getAllTopics();
        // normalize different payload shapes
        const topicsArr = Array.isArray(res) ? res : res?.result || res?.data || res?.topics || [];
        if (!mounted) return;
        if (Array.isArray(topicsArr) && topicsArr.length > 0) {
          setAllTopics(topicsArr);
          // derive unique categories and themes from API if present
          const cats = new Set<string>();
          const themes = new Set<string>();
          topicsArr.forEach((t: any) => {
            if (t.category) cats.add(t.category);
            if (t.theme) themes.add(t.theme);
          });
          if (cats.size > 0) setCategoryOptions([...(cats as any)]);
          if (themes.size > 0) setThemeOptions([...(themes as any)]);
        }
      } catch (e) {
        // keep local fallback list (intentTopics) if API call fails
        console.warn('Failed to fetch topics', e);
      } finally {
        setLoadingTopics(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Log decrypted user id when Build VAIS loads
  React.useEffect(() => {
    try {
      let userObj: any = reduxUser;
      // if the selector returned an encrypted string (persisted form), decrypt it
      if (typeof reduxUser === 'string') {
        userObj = decrypt(reduxUser as string) || reduxUser;
      }

      // If redux state contains a wrapper like { user: { ... } } (some slices use nested shapes), unwrap
      if (userObj?.user) userObj = userObj.user;

      // If still a wrapper (e.g., object with id field), try to extract id
      const userId = userObj?.id ?? userObj?.user_id ?? userObj?._id ?? null;
      if (userId == null) {
        console.log('BuildVAIS: userId is null - raw reduxUser:', reduxUser, 'decrypted/resolved userObj:', userObj);
      } else {
        console.log('BuildVAIS: current user id =', userId);
      }
    } catch (e) {
      console.warn('Failed to log decrypted user id', e);
    }
  }, [reduxUser]);

  // compute available topics using API payload when possible, otherwise fallback
  const availableTopicsSource = allTopics && allTopics.length > 0 ? allTopics : intentTopics.map((t) => ({ name: t.name, category: (t as any).category || null, theme: (t as any).theme || null, conversion: t.conversion }));

  const filteredTopics = availableTopicsSource.filter((topic: any) => {
    const name = String(topic.name || '');
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase());
    const notSelected = !selectedTopics.includes(name);
    const matchesCategory = !filterTopic || filterTopic === 'all-topics' ? true : String(topic.category || '').toLowerCase() === filterTopic.toLowerCase();
    const matchesTheme = !filterTheme || filterTheme === 'all-themes' ? true : String(topic.theme || '').toLowerCase() === filterTheme.toLowerCase();
    return matchesSearch && notSelected && matchesCategory && matchesTheme;
  });

  const handleTopicSelect = (topicName: string) => {
    if (!selectedTopics.includes(topicName)) {
      setSelectedTopics([...selectedTopics, topicName]);
      // Add micro-interaction animation class
      setTimeout(() => {
        const element = document.querySelector(`[data-topic="${topicName}"]`);
        if (element) {
          element.classList.add("animate-pulse");
          setTimeout(() => element.classList.remove("animate-pulse"), 500);
        }
      }, 100);
    }
    setSearchTerm("");
  };

  const handleTopicRemove = (topic: string) => {
    setSelectedTopics(selectedTopics.filter((t) => t !== topic));
  };

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);

    // Validate file
    const validExtensions = [".xlsx", ".csv", ".txt"];
    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (validExtensions.includes(fileExtension) && file.size <= maxSize) {
      setFileStatus("valid");
    } else {
      setFileStatus("invalid");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleSaveSearch = () => {
    if (newSearchName.trim()) {
      const newSearch: SavedSearch = {
        id: Date.now().toString(),
        name: newSearchName,
        formData: { ...formData, intentTopics: selectedTopics },
        createdAt: new Date(),
      };
      setSavedSearches([...savedSearches, newSearch]);
      setNewSearchName("");
      setShowSaveDialog(false);
    }
  };

  const loadSavedSearch = (search: SavedSearch) => {
    setFormData(search.formData);
    setSelectedTopics(search.formData.intentTopics);
  };

  const getStepProgress = () => {
    let progress = 0;
    if (formData.productSubcategory && formData.geolocation.length > 0)
      progress = 25;
    if (selectedTopics.length > 0) progress = 50;
    if (uploadedFile) progress = 75;
    if (progress === 75 && isFormValid()) progress = 100;
    return progress;
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.productSubcategory && formData.geolocation.length > 0;
      case 2:
        return selectedTopics.length > 0;
      case 3:
        return uploadedFile && fileStatus === "valid"; // Only green when file is uploaded and valid
      case 4:
        return isFormValid();
      default:
        return false;
    }
  };

  const isFormValid = () => {
    return (
      formData.productSubcategory &&
      formData.geolocation.length > 0 &&
      selectedTopics.length > 0
    );
  };

  const handleBuildVAIS = () => {
    (async () => {
      // authService returns a typed AuthUser; cast to any to safely access dynamic fields
      const currentUser: any = authService.getCurrentUser() as any;
      const userId = currentUser?.id ?? currentUser?.user_id ?? currentUser?._id ?? null;

      const payload = {
        product_category_name_view: formData.productCategory || '',
        product_category_name: formData.productCategory || '',
        product_sub_category_name: formData.productSubcategory || '',
        // prefer location but include geolocation for legacy backends
        location: formData.geolocation || [],
        geolocation: formData.geolocation || [],
        topics: selectedTopics || [],
        intent_topics: selectedTopics || [],
        page: 1,
        user_id: userId,
        vais_filter_name: '',
        is_save_filter: false,
        is_credit: true,
      } as any;

      try {
        setIsSaving(true);
        dispatch(setLoading({ isLoading: true, message: 'Building VAIS...', type: 'ICP_SCORE' }));
        const res = await icpService.getIcpScore(payload);

        // res expected: { status, message, data: [...] }
        if (res && res.status === 200) {
          // store full response and individual data array
          dispatch(setICPScore(res));
          if (Array.isArray(res.data)) {
            dispatch(setICPData(res.data));
            // Basic pagination: set totalCount and currentPage if available in res
            dispatch(setPagination({ currentPage: payload.page, totalPages: 0, totalCount: res.data.length }));
          }
          navigate('/vais-results');
        } else {
          window.alert(res?.message || 'Failed to build VAIS.');
        }
      } catch (err: any) {
        console.error('Error fetching ICP score', err);
        window.alert(err?.response?.data?.message || 'Failed to build VAIS. Please try again.');
      } finally {
        setIsSaving(false);
        dispatch(setLoading({ isLoading: false }));
      }
    })();
  };

  const getTopicInsight = (topic: (typeof intentTopics)[0]) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="font-medium">{topic.name}</span>
        <Badge variant="outline" className="text-xs">
          {topic.conversion} convert
        </Badge>
      </div>
      <p className="text-sm text-gray-600">{topic.description}</p>
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center">
          <TrendingUp className="w-3 h-3 mr-1" />
          Volume: {topic.volume}
        </span>
        <span className="flex items-center">
          <Target className="w-3 h-3 mr-1" />
          Conversion: {topic.conversion}
        </span>
      </div>
    </div>
  );

  return (
    <TooltipProvider>
      <div className="w-full space-y-6">
        {/* Page Header */}
        <div className="page-header">
          <div className="flex flex-col lg:flex-row items-start lg:justify-between mb-6 gap-3">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-valasys-gray-900 flex items-center flex-nowrap whitespace-nowrap truncate max-w-full">
                <div className="w-8 h-8 rounded-full bg-valasys-orange flex items-center justify-center mr-3">
                  <Building className="w-5 h-5 text-white" />
                </div>
                Build Your VAIS
              </h1>
              <p className="text-valasys-gray-600">
                Configure your Valasys AI Score parameters to generate targeted
                prospect lists
              </p>
            </div>
            <div className="flex-shrink-0 w-full lg:w-auto mt-2 lg:mt-0">
              <FloatingStatsWidget className="relative top-0 right-0 w-full lg:w-auto" />
            </div>
          </div>
        </div>

        {/* Enhanced Steps Progress */}
        <Card className="bg-gradient-to-r from-valasys-orange/5 to-valasys-blue/5 border-valasys-orange/20">
          <CardHeader>
            {/* Step Progress Indicator */}
            <div className="space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 md:gap-4">
                {steps.map((step, index) => {
                  const StepIcon = step.icon;
                  const isActive = currentStep === step.id;
                  const isCompleted = isStepValid(step.id);

                  return (
                    <div
                      key={step.id}
                      className="flex items-center w-full lg:w-auto"
                    >
                      <div
                        className={cn(
                          "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all flex-shrink-0",
                          isActive
                            ? "border-valasys-orange bg-valasys-orange text-white"
                            : isCompleted
                              ? "border-green-500 bg-green-500 text-white"
                              : "border-gray-300 bg-white text-gray-400",
                        )}
                      >
                        {isCompleted && !isActive ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <StepIcon className="w-5 h-5" />
                        )}
                      </div>
                      <span
                        className={cn(
                          "ml-2 text-xs sm:text-sm font-medium whitespace-nowrap",
                          isActive
                            ? "text-valasys-orange"
                            : isCompleted
                              ? "text-green-600"
                              : "text-gray-500",
                        )}
                      >
                        {step.name}
                      </span>
                      {index < steps.length - 1 && (
                        <div
                          className={cn(
                            "hidden lg:block w-12 h-0.5 mx-4 flex-shrink-0",
                            isCompleted ? "bg-green-500" : "bg-gray-300",
                          )}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
              <Progress value={getStepProgress()} className="h-2" />
            </div>
          </CardHeader>
        </Card>

        {/* Saved Searches */}
        {savedSearches.length > 0 && (
          <div data-tour="vais-saved-searches">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Clock className="w-5 h-5 mr-2 text-valasys-orange" />
                  Quick Access - Saved Searches
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {savedSearches.map((search) => (
                    <Button
                      key={search.id}
                      variant="outline"
                      size="sm"
                      onClick={() => loadSavedSearch(search)}
                      className="flex items-center space-x-2"
                    >
                      <FileText className="w-4 h-4" />
                      <span>{search.name}</span>
                      <Badge variant="secondary" className="ml-1">
                        {search.formData.intentTopics.length} topics
                      </Badge>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Product Configuration */}
            <div data-tour="vais-product-config">
              <Card
                className={cn(
                  "transition-all duration-200",
                  currentStep === 1
                    ? "ring-2 ring-valasys-orange/50 shadow-lg"
                    : "",
                )}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center mr-3",
                          isStepValid(1)
                            ? "bg-green-500 text-white"
                            : "bg-gray-200 text-gray-600",
                        )}
                      >
                        {isStepValid(1) ? <Check className="w-4 h-4" /> : "1"}
                      </div>
                      Product Configuration
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentStep(1)}
                    >
                      Edit
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="subcategory">
                        My Product Subcategory{" "}
                        <span style={{ color: "#ff2929" }}>*</span>
                      </Label>
                      <Select
                        value={formData.productSubcategory}
                        onValueChange={async (value) => {
                          // value will be the subcategory id (or name for fallback)
                          setFormData({ ...formData, productSubcategory: value });
                          try {
                            // attempt to fetch the sticky product category using subcategory id
                            const categoryRes = await icpService.getProductsCategoryForSubcategory(value);
                            const catArr = Array.isArray(categoryRes) ? categoryRes : categoryRes?.data?.product_category_list || categoryRes?.product_category_list || categoryRes?.data;
                            const catName = (Array.isArray(catArr) && catArr[0]) ? (catArr[0].product_category_name || catArr[0].name) : undefined;
                            if (catName) {
                              setFormData((f) => ({ ...f, productCategory: catName }));
                            }
                          } catch (err) {
                            console.warn('Failed to fetch product category for subcategory', err);
                          }
                        }}
                      >
                        <SelectTrigger
                          className={cn(
                            formData.productSubcategory
                              ? "border-green-300"
                              : "",
                          )}
                        >
                          <SelectValue placeholder="Select subcategory" />
                        </SelectTrigger>
                        <SelectContent>
                          {productSubcategories.map((item: any) => (
                            <SelectItem key={item.id || item.product_sub_category_name} value={String(item.id || item.product_sub_category_name)}>
                              {item.product_sub_category_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">My Product Category</Label>
                      {/* Product Category is sticky - derived from selected subcategory and not editable */}
                      <Select value={formData.productCategory} disabled>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Product Category" />
                        </SelectTrigger>
                        <SelectContent>
                          {formData.productCategory ? (
                            <SelectItem key={formData.productCategory} value={formData.productCategory}>
                              {formData.productCategory}
                            </SelectItem>
                          ) : (
                            productCategories.map((item) => (
                              <SelectItem key={item} value={item}>
                                {item}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="geolocation" className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      Geolocation <span style={{ color: "#ff2929" }}>*</span>
                    </Label>

                    {/* Enhanced Multi-select Geolocation with Search */}
                    <div className="space-y-3">
                      <Select
                        onValueChange={(value) => {
                          if (value === "select-all") {
                            // Select all geolocations
                            setFormData({
                              ...formData,
                              geolocation: [...geolocations],
                            });
                          } else if (!formData.geolocation.includes(value)) {
                            setFormData({
                              ...formData,
                              geolocation: [...formData.geolocation, value],
                            });
                          }
                          setGeoSearchTerm(""); // Clear search after selection
                        }}
                      >
                        <SelectTrigger
                          className={cn(
                            "min-h-[40px]",
                            formData.geolocation.length > 0
                              ? "border-green-300"
                              : "",
                          )}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="text-sm">
                              {formData.geolocation.length > 0
                                ? `${formData.geolocation.length} selected`
                                : "Select target geographies"}
                            </span>
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          {/* Search Input */}
                          <div className="p-2 border-b">
                            <div className="relative">
                              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                              <Input
                                placeholder="Search geographies..."
                                value={geoSearchTerm}
                                onChange={(e) =>
                                  setGeoSearchTerm(e.target.value)
                                }
                                className="pl-8 h-8"
                              />
                            </div>
                          </div>

                          {/* Filtered Options */}
                          <div className="max-h-48 overflow-y-auto">
                            {/* Select All Option */}
                            {formData.geolocation.length <
                              geolocations.length && (
                              <SelectItem
                                value="select-all"
                                className="font-semibold text-valasys-orange"
                              >
                                Select All
                              </SelectItem>
                            )}
                            {geolocations
                              .filter(
                                (item) =>
                                  !formData.geolocation.includes(item) &&
                                  item
                                    .toLowerCase()
                                    .includes(geoSearchTerm.toLowerCase()),
                              )
                              .map((item) => (
                                <SelectItem key={item} value={item}>
                                  {item}
                                </SelectItem>
                              ))}
                            {geolocations.filter(
                              (item) =>
                                !formData.geolocation.includes(item) &&
                                item
                                  .toLowerCase()
                                  .includes(geoSearchTerm.toLowerCase()),
                            ).length === 0 && (
                              <div className="p-2 text-sm text-gray-500 text-center">
                                No geographies found
                              </div>
                            )}
                          </div>
                        </SelectContent>
                      </Select>

                      {/* Selected Geolocations - Enhanced Chips */}
                      {formData.geolocation.length > 0 && (
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-2">
                            {formData.geolocation.map((location) => (
                              <div
                                key={location}
                                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium border border-blue-200 hover:bg-blue-200 transition-colors"
                              >
                                <span>{location}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setFormData({
                                      ...formData,
                                      geolocation: formData.geolocation.filter(
                                        (l) => l !== location,
                                      ),
                                    });
                                  }}
                                  className="ml-1 hover:bg-blue-300 rounded-full p-0.5 transition-colors"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={() => setCurrentStep(2)}
                      disabled={!isStepValid(1)}
                    >
                      Next: Select Topics
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Step 2: Intent Topics Selection */}
            <div data-tour="vais-intent-topics">
              <Card
                className={cn(
                  "transition-all duration-200",
                  currentStep === 2
                    ? "ring-2 ring-valasys-orange/50 shadow-lg"
                    : "",
                )}
              >
                <CardHeader>
                  <CardTitle>
                    {/* Mobile Layout */}
                    <div className="flex flex-col space-y-3 lg:hidden">
                      <div className="flex items-center justify-end space-x-2">
                        <Badge
                          variant={
                            selectedTopics.length > 0 ? "default" : "secondary"
                          }
                          className={
                            selectedTopics.length > 12
                              ? "bg-[#ff2929] text-white"
                              : selectedTopics.length > 0
                                ? "bg-green-500"
                                : ""
                          }
                        >
                          {selectedTopics.length} selected
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setCurrentStep(2)}
                        >
                          Edit
                        </Button>
                      </div>
                      <div className="flex items-center">
                        <div
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center mr-3",
                            isStepValid(2)
                              ? "bg-green-500 text-white"
                              : "bg-gray-200 text-gray-600",
                          )}
                        >
                          {isStepValid(2) ? <Check className="w-4 h-4" /> : "2"}
                        </div>
                        <span className="whitespace-nowrap">
                          Select Intent Topics{" "}
                          <span style={{ color: "#ff2929" }}>*</span>
                        </span>
                      </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden lg:flex items-center justify-between">
                      <div className="flex items-center">
                        <div
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center mr-3",
                            isStepValid(2)
                              ? "bg-green-500 text-white"
                              : "bg-gray-200 text-gray-600",
                          )}
                        >
                          {isStepValid(2) ? <Check className="w-4 h-4" /> : "2"}
                        </div>
                        Select Intent Topics{" "}
                        <span style={{ color: "#ff2929" }}>*</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={
                            selectedTopics.length > 0 ? "default" : "secondary"
                          }
                          className={
                            selectedTopics.length > 12
                              ? "bg-[#ff2929] text-white"
                              : selectedTopics.length > 0
                                ? "bg-green-500"
                                : ""
                          }
                        >
                          {selectedTopics.length} selected
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setCurrentStep(2)}
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardTitle>
                  <p className="text-sm text-valasys-gray-600">
                    Select the intent topics (ITO intent topics are selected)
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Generate Topics Section */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium text-black">
                        Generate Topics{" "}
                        <span
                          className={
                            selectedTopics.length > 12
                              ? "text-[#ff2929]"
                              : "text-green-600"
                          }
                        >
                          ({selectedTopics.length}/12 Intent topics{" "}
                          {selectedTopics.length > 12
                            ? "limit is exceeded."
                            : "are selected"}
                          )
                        </span>
                      </Label>
                    </div>
                    <div className="relative">
                      <Input
                        placeholder="https://www.bombora.com"
                        value={generateTopicsInput}
                        onChange={(e) => setGenerateTopicsInput(e.target.value)}
                        className="pr-10"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
                        onClick={async () => {
                          const url = generateTopicsInput?.trim();
                          if (!url) return;
                          try {
                            const res = await icpService.getTopicsByUrl(url);
                            const topicsArr = res?.result?.topics || res?.topics || res?.result || null;
                            if (Array.isArray(topicsArr)) {
                              const names = topicsArr.map((t: any) => t.name).filter(Boolean);
                              // dedupe and append up to 12 total
                              const existing = new Set(selectedTopics);
                              const toAdd: string[] = [];
                              for (const n of names) {
                                if (existing.has(n)) continue;
                                if (existing.size + toAdd.length >= 12) break;
                                toAdd.push(n);
                                existing.add(n);
                              }
                              if (toAdd.length > 0) {
                                setSelectedTopics((s) => [...s, ...toAdd]);
                              }
                            }
                          } catch (e) {
                            console.warn('Failed to fetch topics for URL', e);
                          } finally {
                            setGenerateTopicsInput('');
                          }
                        }}
                      >
                        <Search className="w-4 h-4 text-gray-400" />
                      </Button>
                    </div>
                  </div>

                  {/* Search Intent Topics */}
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-valasys-gray-400" />
                    <Input
                      placeholder="Search intent topics..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* Filter Dropdowns Side by Side */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="filterTopic">Filter Topic by Category</Label>
                      <Select value={filterTopic} onValueChange={setFilterTopic}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category to filter" />
                        </SelectTrigger>
                        <SelectContent className="max-h-48 overflow-y-auto">
                          <SelectItem value="all-topics">All Categories</SelectItem>
                          {(categoryOptions || filterTopics).map((topic) => (
                            <SelectItem key={topic} value={topic}>
                              {topic}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="filterTheme">Filter Topic by Theme</Label>
                      <Select value={filterTheme} onValueChange={setFilterTheme}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a theme to filter" />
                        </SelectTrigger>
                        <SelectContent className="max-h-48 overflow-y-auto">
                          <SelectItem value="all-themes">All Themes</SelectItem>
                          {(themeOptions || filterThemes).map((theme) => (
                            <SelectItem key={theme} value={theme}>
                              {theme}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Selected Topics - Enhanced Visualization */}
                  {selectedTopics.length > 0 && (
                    <div className="space-y-2">
                      <Label>Selected Topics:</Label>
                      <div className="flex flex-wrap gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                        {selectedTopics.map((topic) => (
                          <Badge
                            key={topic}
                            variant="default"
                            className="bg-valasys-orange hover:bg-valasys-orange/80 cursor-pointer transition-all duration-200 transform hover:scale-105"
                            onClick={() => handleTopicRemove(topic)}
                            data-topic={topic}
                          >
                            {topic}
                            <X className="w-3 h-3 ml-1" />
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Available Topics with Insights */}
                  <div className="border rounded-lg p-4 max-h-48 overflow-y-auto relative">
                    <Label className="text-sm text-valasys-gray-600 mb-2 block">
                      Available Topics:
                    </Label>
                    {loadingTopics ? (
                      <div className="flex items-center justify-center py-6">
                        <div className="text-sm text-valasys-gray-500">Loading topics...</div>
                      </div>
                    ) : filteredTopics.length > 0 ? (
                      <div
                        ref={availableListRef}
                        onScroll={(e) => {
                          const el = e.currentTarget as HTMLDivElement;
                          if (loadingMore) return;
                          if (el.scrollTop + el.clientHeight >= el.scrollHeight - 40) {
                            if (visibleCount < filteredTopics.length) {
                              setLoadingMore(true);
                              // simulate small delay for UX; not required
                              setTimeout(() => {
                                setVisibleCount((v) => Math.min(v + 50, filteredTopics.length));
                                setLoadingMore(false);
                              }, 150);
                            }
                          }
                        }}
                        className="space-y-1"
                        style={{ maxHeight: 200, overflowY: 'auto' }}
                      >
                        {filteredTopics.slice(0, visibleCount).map((topic, idx) => {
                          const key = topic.id ?? `${String(topic.name)}-${idx}`;
                          return (
                            <div
                              key={key}
                              className="flex items-center justify-between p-2 hover:bg-valasys-gray-100 rounded cursor-pointer text-sm transition-all duration-200"
                            >
                              <span
                                className="flex-1"
                                onClick={() => handleTopicSelect(topic.name)}
                              >
                                {topic.name}
                              </span>
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline" className="text-xs">
                                  {topic.conversion}
                                </Badge>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0"
                                    >
                                      <Info className="w-3 h-3" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-md">
                                    <DialogHeader>
                                      <DialogTitle>Topic Insights</DialogTitle>
                                    </DialogHeader>
                                    {getTopicInsight(topic)}
                                  </DialogContent>
                                </Dialog>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 hover:bg-valasys-orange hover:text-white"
                                  onClick={() => handleTopicSelect(topic.name)}
                                >
                                  <Plus className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          );
                        })}

                        {loadingMore && (
                          <div className="py-2 text-center text-sm text-valasys-gray-500">Loading more…</div>
                        )}
                        {!loadingMore && visibleCount < filteredTopics.length && (
                          <div className="py-2 text-center text-sm text-valasys-gray-500">Scroll to load more</div>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-valasys-gray-500 text-center py-4">
                        {searchTerm ? "No topics found" : "All topics selected ✓"}
                      </p>
                    )}
                  </div>

                  {/* Powered by Bombora Image */}
                  <div className="flex justify-end mt-4 mb-4">
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets%2Fa4da45c29adb4ae382aab6f61feb6557%2F1e0d117e08654eaf9b175418513d5534?format=webp&width=800"
                      alt="Powered by Bombora"
                      className="opacity-75 hover:opacity-100 transition-opacity"
                      style={{ width: "20%", height: "18px" }}
                    />
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setCurrentStep(1)}>
                      Previous
                    </Button>
                    <Button
                      onClick={() => setCurrentStep(3)}
                      disabled={!isStepValid(2)}
                    >
                      Next: Upload File
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Enhanced Sidebar */}
          <div className="space-y-6">
            {/* Step 3: File Upload with Enhanced Status */}
            <Card
              data-tour="vais-suppression-file"
              className={cn(
                "transition-all duration-200",
                currentStep === 3
                  ? "ring-2 ring-valasys-orange/50 shadow-lg"
                  : "",
              )}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center mr-3",
                        uploadedFile
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-600",
                      )}
                    >
                      {uploadedFile ? <Check className="w-4 h-4" /> : "3"}
                    </div>
                    <div>
                      <div className="text-base">Upload Suppression File</div>
                      <div className="text-xs text-gray-500 font-normal">
                        (Optional)
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentStep(3)}
                  >
                    Edit
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Enhanced Upload Area */}
                <div
                  className={cn(
                    "border-2 border-dashed rounded-lg p-6 text-center transition-all duration-300 cursor-pointer",
                    dragActive
                      ? "border-valasys-orange bg-valasys-orange/5 scale-105"
                      : "border-valasys-gray-300 hover:border-valasys-orange hover:bg-valasys-orange/5",
                    fileStatus === "valid"
                      ? "border-green-500 bg-green-50"
                      : fileStatus === "invalid"
                        ? "border-red-500 bg-red-50"
                        : "",
                  )}
                  onDrop={handleDrop}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragActive(true);
                  }}
                  onDragLeave={() => setDragActive(false)}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-8 h-8 mx-auto mb-2 text-valasys-gray-400" />
                  <p className="text-sm text-valasys-gray-600 mb-1">
                    Select/Drop file to upload
                  </p>
                  <p className="text-xs text-valasys-gray-500">
                    .xlsx, .csv, .txt files up to 10MB
                  </p>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".xlsx,.csv,.txt"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file);
                  }}
                />

                {/* File Status */}
                {uploadedFile && (
                  <div
                    className={cn(
                      "border rounded-lg p-3",
                      fileStatus === "valid"
                        ? "bg-green-50 border-green-200"
                        : "bg-red-50 border-red-200",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {fileStatus === "valid" ? (
                          <FileCheck className="w-4 h-4 text-green-600 mr-2" />
                        ) : (
                          <FileX className="w-4 h-4 text-red-600 mr-2" />
                        )}
                        <span
                          className={cn(
                            "text-sm font-medium",
                            fileStatus === "valid"
                              ? "text-green-800"
                              : "text-red-800",
                          )}
                        >
                          {uploadedFile.name}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setUploadedFile(null);
                          setFileStatus("none");
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <p
                      className={cn(
                        "text-xs mt-1",
                        fileStatus === "valid"
                          ? "text-green-600"
                          : "text-red-600",
                      )}
                    >
                      {fileStatus === "valid"
                        ? "✓ File uploaded successfully"
                        : "❌ Invalid file format or size too large"}
                    </p>
                  </div>
                )}

                <Button variant="outline" size="sm" className="w-full">
                  <FileText className="w-4 h-4 mr-2" />
                  Download Template
                </Button>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setCurrentStep(2)}>
                    Previous
                  </Button>
                  <Button onClick={() => setCurrentStep(4)}>
                    Next: Build VAIS
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Step 4: Build Action */}
            <Card
              data-tour="vais-ready-to-build"
              className={cn(
                "transition-all duration-200",
                currentStep === 4
                  ? "ring-2 ring-valasys-orange/50 shadow-lg"
                  : "",
              )}
            >
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center mr-3",
                        isFormValid()
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-600",
                      )}
                    >
                      {isFormValid() ? <Check className="w-4 h-4" /> : "4"}
                    </div>
                    <span className="font-medium">Ready to Build</span>
                  </div>
                  <Button
                    data-tour="vais-save-search"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowSaveDialog(true)}
                    disabled={!isFormValid()}
                    className="ml-2"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Search
                  </Button>
                </div>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Button
                        onClick={handleBuildVAIS}
                        className="w-full bg-valasys-orange hover:bg-valasys-orange/90 transition-all duration-200 transform hover:scale-105"
                        disabled={!isFormValid()}
                      >
                        {!isFormValid() && (
                          <AlertCircle className="w-4 h-4 mr-2" />
                        )}
                        Build Your VAIS
                      </Button>
                    </div>
                  </TooltipTrigger>
                  {!isFormValid() && (
                    <TooltipContent>
                      <p>Please complete required fields:</p>
                      <ul className="text-xs list-disc list-inside">
                        {!formData.productSubcategory && (
                          <li>Product Subcategory</li>
                        )}
                        {formData.geolocation.length === 0 && (
                          <li>Geolocation</li>
                        )}
                        {selectedTopics.length === 0 && (
                          <li>At least one Intent Topic</li>
                        )}
                      </ul>
                    </TooltipContent>
                  )}
                </Tooltip>

                <div className="text-center text-xs text-valasys-gray-500">
                  <div className="font-bold mb-1">
                    0/2000 Utilized Per Day Download
                  </div>
                  Note: Each 'Build Your VAIS' action deducts one search from
                  your available search credits.
                </div>
              </CardContent>
            </Card>

            {/* Info Panel */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-start space-x-2">
                  <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Pro Tip:</p>
                    <p>
                      Use specific intent topics to get more targeted results.
                      You can combine multiple topics for better precision.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Save Search Dialog */}
        <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save Search Configuration</DialogTitle>
              <DialogDescription>
                Save this search configuration for future use.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Enter search name..."
                value={newSearchName}
                onChange={(e) => setNewSearchName(e.target.value)}
              />
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowSaveDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveSearch}
                  disabled={!newSearchName.trim()}
                >
                  Save
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}