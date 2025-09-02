import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  LayoutDashboard,
  Bot,
  Target,
  Search,
  Megaphone,
  PlusCircle,
  BarChart3,
  Users,
  Ticket,
  HelpCircle,
  Settings,
  Bell,
  User,
  MessageCircle,
  Crown,
  Activity,
  TrendingUp,
  Zap,
  Sparkles,
  Shield,
  CheckCircle,
  Calendar,
  PieChart,
  Monitor,
  Award,
  Clock,
  Upload,
  Save,
  Building,
  CreditCard,
  Calculator,
  Filter,
} from "lucide-react";

export interface TourStep {
  id: string;
  target: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  position: "top" | "bottom" | "left" | "right" | "center";
  category: "navigation" | "dashboard" | "utilities" | "features";
  tips?: string[];
  nextAction?: string;
}

// Dashboard-specific tour steps (main content only)
const dashboardTourSteps: TourStep[] = [
  {
    id: "welcome-dashboard",
    target: "body",
    title: "Welcome to Your Dashboard! 📊",
    description:
      "This is your central command center where you can monitor all your AI scoring activities, track performance metrics, and analyze data trends in real-time.",
    icon: LayoutDashboard,
    position: "center",
    category: "dashboard",
    tips: [
      "All dashboard data updates automatically",
      "Use date filters to analyze specific time periods",
      "Charts are interactive - hover and click for details",
    ],
  },
  {
    id: "dashboard-controls",
    target: "[data-tour='dashboard-controls']",
    title: "Dashboard Controls & Settings",
    description:
      "Control your dashboard experience with real-time data toggle and date range selection. Monitor when your data was last updated and customize your view.",
    icon: Settings,
    position: "bottom",
    category: "dashboard",
    tips: [
      "Toggle live updates on/off as needed",
      "Select custom date ranges for analysis",
      "Live indicator shows real-time data status",
    ],
    nextAction: "Configure your dashboard settings",
  },
  {
    id: "stats-cards",
    target: "[data-tour='stats-cards']",
    title: "Real-time Statistics Overview",
    description:
      "Monitor key performance indicators with live updating statistics. Track accounts verified, available credits, success rates, and trending metrics at a glance.",
    icon: Activity,
    position: "bottom",
    category: "dashboard",
    tips: [
      "Cards show current values and trend indicators",
      "Color coding indicates performance status",
      "Percentage changes show period-over-period growth",
    ],
    nextAction: "Monitor your key metrics",
  },
  {
    id: "analytics-charts",
    target: "[data-tour='analytics-charts']",
    title: "Interactive Analytics Charts",
    description:
      "Dive deep into your data with interactive SaaS analytics charts. Visualize trends, compare periods, and identify patterns in your scoring activities.",
    icon: BarChart3,
    position: "bottom",
    category: "dashboard",
    tips: [
      "Hover over chart points for detailed tooltips",
      "Switch between different chart types",
      "Export chart data for external analysis",
    ],
    nextAction: "Explore your analytics data",
  },
  {
    id: "performance-analytics",
    target: "[data-tour='performance-analytics']",
    title: "Monthly Performance Analytics",
    description:
      "Track your monthly performance with detailed analytics showing accounts processed, credits utilized, conversion rates, and goal achievement over time.",
    icon: TrendingUp,
    position: "top",
    category: "dashboard",
    tips: [
      "View performance trends across multiple months",
      "Compare actual vs. target achievements",
      "Identify peak performance periods",
    ],
    nextAction: "Analyze your monthly trends",
  },
  {
    id: "distribution-analysis",
    target: "[data-tour='distribution-analysis']",
    title: "Distribution Analysis Charts",
    description:
      "Understand your data distribution with dynamic charts showing breakdowns by employee size, industry, revenue, and other key demographics.",
    icon: PieChart,
    position: "top",
    category: "dashboard",
    tips: [
      "Switch between different distribution views",
      "Interactive pie and bar charts",
      "Identify your most valuable segments",
    ],
    nextAction: "Explore data distributions",
  },
  {
    id: "detailed-overview",
    target: "[data-tour='detailed-overview']",
    title: "Detailed Overview Charts",
    description:
      "Get comprehensive insights with detailed overview charts that provide deep-dive analysis of your data patterns and performance metrics over time.",
    icon: Monitor,
    position: "top",
    category: "dashboard",
    tips: [
      "Detailed breakdowns by multiple dimensions",
      "Compare different time periods",
      "Identify optimization opportunities",
    ],
    nextAction: "Dive into detailed analytics",
  },
  {
    id: "additional-insights",
    target: "[data-tour='additional-insights']",
    title: "Additional Performance Insights",
    description:
      "Monitor additional key metrics including monthly target achievement, credit utilization rate, and overall performance status indicators.",
    icon: Award,
    position: "top",
    category: "dashboard",
    tips: [
      "Track progress toward monthly goals",
      "Monitor credit usage efficiency",
      "Performance status shows overall health",
    ],
    nextAction: "Review your performance metrics",
  },
  {
    id: "dashboard-complete",
    target: "body",
    title: "🎉 Dashboard Tour Complete!",
    description:
      "You've explored all the key features of your dashboard! You're now ready to monitor your AI scoring performance, analyze data trends, and make data-driven decisions.",
    icon: CheckCircle,
    position: "center",
    category: "dashboard",
    tips: [
      "Bookmark important views for quick access",
      "Set up alerts for key performance changes",
      "Regular monitoring helps optimize performance",
      "Use the date filters to analyze specific periods",
    ],
    nextAction: "Start monitoring your performance!",
  },
];

// BuildVAIS page tour steps (main content only)
const buildVAISTourSteps: TourStep[] = [
  {
    id: "welcome-build-vais",
    target: "body",
    title: "Welcome to VAIS Builder! 🤖",
    description:
      "Create powerful AI-driven prospect scores with our VAIS (Valasys AI Score) builder. This tool helps you identify and prioritize your best prospects using advanced AI algorithms.",
    icon: Bot,
    position: "center",
    category: "features",
    tips: [
      "Use saved searches for quick access to common configurations",
      "Configure your scoring criteria to match your ideal customer profile",
      "Intent topics help the AI understand what signals to look for",
    ],
  },
  {
    id: "vais-saved-searches",
    target: "[data-tour='vais-saved-searches']",
    title: "Quick Access - Saved Searches",
    description:
      "Access your previously saved VAIS configurations for quick reuse. Save time by reusing successful scoring criteria and intent topic combinations.",
    icon: Clock,
    position: "bottom",
    category: "features",
    tips: [
      "Click on any saved search to load its configuration",
      "Saved searches include all your previous settings",
      "Modify and re-save searches as your needs evolve",
    ],
    nextAction: "Load a saved search or create a new one",
  },
  {
    id: "vais-product-config",
    target: "[data-tour='vais-product-config']",
    title: "Product Configuration",
    description:
      "Configure your VAIS scoring parameters including industry filters, company size, revenue ranges, and geographic targeting. These settings help the AI focus on your ideal customer profile.",
    icon: Settings,
    position: "bottom",
    category: "features",
    tips: [
      "Be specific with your criteria for better AI accuracy",
      "Use industry filters to target relevant sectors",
      "Geographic targeting helps with regional campaigns",
    ],
    nextAction: "Set your targeting criteria",
  },
  {
    id: "vais-intent-topics",
    target: "[data-tour='vais-intent-topics']",
    title: "Intent Topics Selection",
    description:
      "Select intent topics that indicate buying signals from your prospects. The AI uses these topics to analyze online behavior and identify prospects showing purchase intent.",
    icon: Target,
    position: "top",
    category: "features",
    tips: [
      "Choose topics that align with your product or service",
      "More relevant topics lead to higher quality scores",
      "The AI analyzes web activity, social signals, and content engagement",
    ],
    nextAction: "Select relevant intent topics for your business",
  },
  {
    id: "vais-suppression-file",
    target: "[data-tour='vais-suppression-file']",
    title: "Upload Suppression File (Optional)",
    description:
      "Upload a suppression file to exclude specific companies or contacts from your VAIS results. This helps you avoid targeting existing customers or blacklisted accounts.",
    icon: Upload,
    position: "left",
    category: "features",
    tips: [
      "Suppression files help refine your targeting",
      "Supported formats: .xlsx, .csv, .txt files up to 10MB",
      "You can skip this step if no suppression is needed",
    ],
    nextAction: "Upload your suppression file or skip to continue",
  },
  {
    id: "vais-save-search",
    target: "[data-tour='vais-save-search']",
    title: "Save Search Configuration",
    description:
      "Save your current VAIS configuration for future use. This allows you to quickly reuse successful scoring criteria and settings for similar campaigns.",
    icon: Save,
    position: "bottom",
    category: "features",
    tips: [
      "Save configurations with descriptive names",
      "All your settings and criteria are preserved",
      "Saved searches appear in the Quick Access section",
    ],
    nextAction: "Save your configuration for future use",
  },
  {
    id: "vais-ready-to-build",
    target: "[data-tour='vais-ready-to-build']",
    title: "Ready to Build Your VAIS",
    description:
      "Once all required fields are completed, you can build your VAIS score. The AI will analyze your criteria and generate prospect scores based on your configuration.",
    icon: Building,
    position: "left",
    category: "features",
    tips: [
      "Complete all required fields to enable the Build button",
      "The AI processing typically takes 2-5 minutes",
      "You'll receive notifications when results are ready",
    ],
    nextAction: "Click 'Build Your VAIS' to start the AI processing",
  },
  {
    id: "vais-complete",
    target: "body",
    title: "🎉 VAIS Builder Tour Complete!",
    description:
      "You're now ready to build powerful AI-driven prospect scores! Configure your criteria, select intent topics, and let our AI identify your highest-value prospects.",
    icon: CheckCircle,
    position: "center",
    category: "features",
    tips: [
      "Start with broad criteria and refine based on results",
      "Monitor your scores regularly for optimization opportunities",
      "Export results to your CRM for immediate action",
      "Save successful configurations for future use",
    ],
    nextAction: "Start building your VAIS score!",
  },
];

// ABM/LAL page tour steps (main content only)
const abmLALTourSteps: TourStep[] = [
  {
    id: "welcome-abm-lal",
    target: "body",
    title: "Welcome to ABM/LAL Dashboard! 🎯",
    description:
      "Your Account-Based Marketing and Look-Alike List intelligence hub. Verify target accounts, generate similar prospects, and track performance metrics to maximize your ABM strategy.",
    icon: Target,
    position: "center",
    category: "features",
    tips: [
      "Use ABM to verify and enrich your target account data",
      "Generate LAL to find similar high-value prospects",
      "Monitor performance insights to optimize your strategy",
    ],
  },
  {
    id: "abm-credits",
    target: "[data-tour='abm-credits']",
    title: "Credits Management",
    description:
      "Monitor your available credits for ABM verification and LAL generation. Each action consumes credits based on the number of accounts processed.",
    icon: CreditCard,
    position: "bottom",
    category: "features",
    tips: [
      "Track your remaining credits in real-time",
      "ABM verification uses 1 credit per domain",
      "LAL generation uses 1 credit per search",
    ],
    nextAction: "Monitor your credit usage",
  },
  {
    id: "abm-quick-access",
    target: "[data-tour='abm-quick-access']",
    title: "Quick Access Panel",
    description:
      "Fast-track your ABM and LAL workflows with quick action buttons. Access recent uploads, saved categories, and today's activity statistics.",
    icon: Zap,
    position: "top",
    category: "features",
    tips: [
      "Quick buttons jump directly to ABM or LAL workflows",
      "View recent uploads and saved configurations",
      "Track daily activity and credit usage",
    ],
    nextAction: "Use quick actions to start your workflow",
  },
  {
    id: "abm-verify-accounts",
    target: "[data-tour='abm-verify-accounts']",
    title: "Verify Your ABM Accounts",
    description:
      "Upload and verify your target account lists to enrich them with comprehensive company data, contact information, and firmographic details.",
    icon: Users,
    position: "bottom",
    category: "features",
    tips: [
      "Upload .xlsx or .csv files with company domains",
      "Select your product subcategory for better targeting",
      "Verification enriches accounts with detailed data",
    ],
    nextAction: "Upload your ABM file and verify accounts",
  },
  {
    id: "abm-generate-lal",
    target: "[data-tour='abm-generate-lal']",
    title: "Generate Look-Alike Accounts",
    description:
      "Upload your top-performing accounts to find similar high-value prospects using AI-powered similarity matching and industry intelligence.",
    icon: Sparkles,
    position: "bottom",
    category: "features",
    tips: [
      "Upload your best customer accounts as seed data",
      "AI analyzes patterns to find similar prospects",
      "Specify your product category for targeted results",
    ],
    nextAction: "Upload top accounts and generate look-alikes",
  },
  {
    id: "abm-performance-insights",
    target: "[data-tour='abm-performance-insights']",
    title: "Performance Insights",
    description:
      "Track your ABM success rates, LAL expansion metrics, and credit usage with comprehensive performance dashboards and analytics.",
    icon: BarChart3,
    position: "bottom",
    category: "dashboard",
    tips: [
      "Monitor ABM verification success rates",
      "Track LAL expansion and new account discovery",
      "Analyze credit usage and ROI metrics",
    ],
    nextAction: "Review your performance metrics",
  },
  {
    id: "abm-lal-complete",
    target: "body",
    title: "🎉 ABM/LAL Tour Complete!",
    description:
      "You're now ready to maximize your account-based marketing strategy! Verify accounts, generate look-alikes, and track performance to drive better results.",
    icon: CheckCircle,
    position: "center",
    category: "features",
    tips: [
      "Start with high-quality seed accounts for better LAL results",
      "Regular verification keeps your account data fresh",
      "Use performance insights to optimize your strategy",
      "Monitor credit usage to plan your campaigns effectively",
    ],
    nextAction: "Start building your ABM/LAL strategy!",
  },
];

// Analytics page tour steps (main content only)
const analyticsTourSteps: TourStep[] = [
  {
    id: "welcome-analytics",
    target: "body",
    title: "Welcome to Advanced Analytics! 📊",
    description:
      "Dive deep into your performance data with comprehensive analytics, campaign insights, AI model performance, and customer intelligence. Make data-driven decisions with powerful visualizations.",
    icon: BarChart3,
    position: "center",
    category: "dashboard",
    tips: [
      "Use filters to analyze specific time periods and segments",
      "Export reports for presentations and external analysis",
      "Set up automated reporting for regular insights",
    ],
  },
  {
    id: "analytics-tabs",
    target: "[role='tablist']",
    title: "Analytics Categories",
    description:
      "Navigate between different analytics views: Executive overview for high-level metrics, Campaign performance for marketing insights, VAIS AI for model performance, and Customer intelligence for behavioral analysis.",
    icon: LayoutDashboard,
    position: "bottom",
    category: "dashboard",
    tips: [
      "Each tab provides specialized insights for different stakeholders",
      "Executive view is perfect for leadership presentations",
      "Use VAIS AI tab to monitor and optimize model performance",
    ],
    nextAction: "Explore different analytics categories",
  },
  {
    id: "analytics-complete",
    target: "body",
    title: "🎉 Analytics Tour Complete!",
    description:
      "You now have access to comprehensive analytics across all aspects of your AI-powered sales intelligence platform. Use these insights to optimize performance and drive better results.",
    icon: CheckCircle,
    position: "center",
    category: "dashboard",
    tips: [
      "Regular monitoring helps identify trends and opportunities",
      "Use filters and date ranges for detailed analysis",
      "Export important reports for stakeholder meetings",
      "Set performance benchmarks and track progress over time",
    ],
    nextAction: "Start analyzing your performance data!",
  },
];

// FindProspect page tour steps (main content only)
const findProspectTourSteps: TourStep[] = [
  {
    id: "welcome-find-prospect",
    target: "body",
    title: "Welcome to Prospect Discovery! 🔍",
    description:
      "Discover high-quality prospects using AI-powered search and filtering. Find decision-makers and key contacts based on your ideal customer profile with advanced targeting options.",
    icon: Search,
    position: "center",
    category: "features",
    tips: [
      "Start with broad search criteria and refine as needed",
      "Use advanced filters for precise targeting",
      "AI suggestions help discover similar prospect profiles",
    ],
  },
  {
    id: "compact-mode-button",
    target: "[data-tour='compact-mode-button']",
    title: "Compact Mode Toggle",
    description:
      "Switch between full view and compact mode to optimize your workspace. Compact mode condenses the interface while keeping all essential features accessible for faster prospect discovery.",
    icon: Settings,
    position: "bottom",
    category: "features",
    tips: [
      "Compact mode hides the upload section for more filter space",
      "Perfect for focusing on targeting and filtering",
      "Switch back to full view when you need to upload files",
      "Your mode preference is remembered during your session",
    ],
    nextAction: "Try switching between modes to find your preference",
  },
  {
    id: "live-estimate",
    target: "[data-tour='live-estimate']",
    title: "Live Estimate Preview",
    description:
      "Get real-time estimates of prospect matches and credit costs as you adjust your filters. This dynamic preview helps you optimize your search before running it, ensuring you get the best value for your credits.",
    icon: Calculator,
    position: "bottom",
    category: "features",
    tips: [
      "Estimates update automatically as you change filters",
      "Higher confidence scores indicate better targeting",
      "Credit cost is calculated based on expected matches",
      "Use this to fine-tune your search before execution",
    ],
    nextAction: "Watch how estimates change as you modify filters",
  },
  {
    id: "upload-company-lists",
    target: "[data-tour='upload-company-lists']",
    title: "Upload Company Lists",
    description:
      "Upload your existing company or contact lists to enrich them with additional prospect data. Supports CSV and Excel files with automatic column mapping and data validation.",
    icon: Upload,
    position: "right",
    category: "features",
    tips: [
      "Drag and drop files or click to browse",
      "Supports .csv and .xlsx files up to 10MB",
      "Auto-mapping detects common column headers",
      "Preview sample matches before processing",
    ],
    nextAction: "Upload a company list to see enrichment in action",
  },
  {
    id: "targeting-filters",
    target: "[data-tour='targeting-filters']",
    title: "Advanced Targeting Filters",
    description:
      "Define your ideal customer profile with comprehensive targeting filters. Use geography, job functions, seniority levels, and more to find prospects that match your exact requirements.",
    icon: Filter,
    position: "left",
    category: "features",
    tips: [
      "Required fields are marked with red asterisks (*)",
      "Start with geography for fastest filtering",
      "Job function and level are required for accuracy",
      "Optional filters help narrow results further",
    ],
    nextAction: "Set up your ideal customer profile criteria",
  },
  {
    id: "save-as-preset",
    target: "[data-tour='save-as-preset']",
    title: "Save Search as Preset",
    description:
      "Save your successful search configurations as presets for quick reuse. This saves time when running similar searches and ensures consistency across your prospecting efforts.",
    icon: Save,
    position: "bottom",
    category: "features",
    tips: [
      "Only enabled when all required filters are set",
      "Give presets descriptive names for easy identification",
      "Saved presets appear in the Quick Access section",
      "Perfect for recurring search patterns",
    ],
    nextAction: "Complete your filters and save as a preset",
  },
  {
    id: "prospect-search-complete",
    target: "body",
    title: "🎉 Find Prospect Tour Complete!",
    description:
      "You've mastered the Find Prospect page! You can now efficiently discover high-quality prospects using advanced filters, live estimates, company uploads, and saved presets.",
    icon: CheckCircle,
    position: "center",
    category: "features",
    tips: [
      "Use compact mode for faster filtering workflows",
      "Monitor live estimates to optimize credit usage",
      "Upload company lists for data enrichment",
      "Save successful searches as presets for reuse",
      "Required geography, job function, and level ensure quality results",
    ],
    nextAction: "Start building your first prospect search!",
  },
];

// BuildCampaign page tour steps (main content only)
const buildCampaignTourSteps: TourStep[] = [
  {
    id: "welcome-build-campaign",
    target: "body",
    title: "Welcome to Campaign Builder! 📧",
    description:
      "Create and manage multi-channel marketing campaigns with our intuitive campaign builder. Design automated email sequences, set up triggers, and track performance across all touchpoints.",
    icon: Megaphone,
    position: "center",
    category: "features",
    tips: [
      "Use drag-and-drop interface for easy campaign creation",
      "Test different message variations with A/B testing",
      "Set up automated triggers based on prospect behavior",
    ],
  },
  {
    id: "campaign-builder-complete",
    target: "body",
    title: "🎉 Campaign Builder Tour Complete!",
    description:
      "You're ready to create powerful multi-channel campaigns that engage prospects and drive conversions! Use our automation tools to scale your outreach effectively.",
    icon: CheckCircle,
    position: "center",
    category: "features",
    tips: [
      "Start with proven templates and customize them",
      "Monitor campaign performance and optimize regularly",
      "Use personalization to increase engagement rates",
      "Save successful campaigns as templates for future use",
    ],
    nextAction: "Start building your first campaign!",
  },
];

// Settings page tour steps (main content only)
const settingsTourSteps: TourStep[] = [
  {
    id: "welcome-settings",
    target: "body",
    title: "Welcome to Platform Settings! ⚙️",
    description:
      "Configure your platform preferences, manage integrations, set up API connections, and customize notification settings. Make the platform work exactly how you need it to.",
    icon: Settings,
    position: "center",
    category: "utilities",
    tips: [
      "Connect your CRM for seamless data flow",
      "Set up API integrations for automation",
      "Configure notifications to stay informed without overwhelming your inbox",
    ],
  },
  {
    id: "settings-complete",
    target: "body",
    title: "🎉 Settings Tour Complete!",
    description:
      "Your platform is now configured to match your workflow! Integrations and settings help you work more efficiently and get better results from your AI-powered sales intelligence.",
    icon: CheckCircle,
    position: "center",
    category: "utilities",
    tips: [
      "Regularly review and update your integrations",
      "Test API connections to ensure data flows correctly",
      "Adjust notification preferences as your team grows",
      "Keep your profile information current for better collaboration",
    ],
    nextAction: "Explore platform integrations and customizations!",
  },
];

// Support page tour steps (main content only)
const supportTourSteps: TourStep[] = [
  {
    id: "welcome-support",
    target: "body",
    title: "Welcome to Support Center! 🎧",
    description:
      "Get help when you need it with our comprehensive support system. Submit tickets, track issue resolution, access our knowledge base, and connect with our expert team.",
    icon: HelpCircle,
    position: "center",
    category: "utilities",
    tips: [
      "Search the knowledge base first for quick answers",
      "Provide detailed information when submitting tickets",
      "Check ticket status for updates on your requests",
    ],
  },
  {
    id: "support-complete",
    target: "body",
    title: "🎉 Support Center Tour Complete!",
    description:
      "You now know how to get help whenever you need it! Our support team is here to ensure you succeed with the platform and achieve your sales intelligence goals.",
    icon: CheckCircle,
    position: "center",
    category: "utilities",
    tips: [
      "Use live chat for quick questions",
      "Submit detailed tickets for complex issues",
      "Check out video tutorials and guides",
      "Join our community for peer support and tips",
    ],
    nextAction: "Explore our knowledge base and resources!",
  },
];

// Default page tour (for pages without specific content)
const defaultPageTourSteps: TourStep[] = [
  {
    id: "welcome-page",
    target: "body",
    title: "Welcome to this Page! 👋",
    description:
      "This page provides specialized functionality within the Valasys AI Score platform. Explore the available features and tools to enhance your sales intelligence workflow.",
    icon: Sparkles,
    position: "center",
    category: "features",
    tips: [
      "Look for main content areas and interactive elements",
      "Use the navigation to explore other platform features",
      "Check out the help documentation for detailed guidance",
    ],
  },
  {
    id: "page-complete",
    target: "body",
    title: "🎉 Page Tour Complete!",
    description:
      "You've completed the tour for this page! Continue exploring the platform to discover more powerful features for your sales intelligence needs.",
    icon: CheckCircle,
    position: "center",
    category: "features",
    tips: [
      "Use the sidebar navigation to explore other features",
      "Return to the dashboard for an overview of your data",
      "Contact support if you need help with any features",
      "Check out the analytics page for performance insights",
    ],
    nextAction: "Continue exploring the platform!",
  },
];

interface PlatformTourProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export default function PlatformTour({
  isOpen,
  onClose,
  onComplete,
}: PlatformTourProps) {
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightedElement, setHighlightedElement] = useState<Element | null>(
    null,
  );
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [highlightPosition, setHighlightPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Determine which tour steps to use based on current page
  const getCurrentTourSteps = () => {
    switch (location.pathname) {
      case "/":
        return dashboardTourSteps;
      case "/build-vais":
        return buildVAISTourSteps;
      case "/analytics":
        return analyticsTourSteps;
      case "/find-prospect":
        return findProspectTourSteps;
      case "/abm-lal":
        return abmLALTourSteps;
      case "/build-campaign":
        return buildCampaignTourSteps;
      case "/build-my-campaign":
        return buildCampaignTourSteps; // Same tour as build-campaign
      case "/settings":
        return settingsTourSteps;
      case "/support":
        return supportTourSteps;
      case "/faqs":
        return supportTourSteps; // Same tour as support
      default:
        return defaultPageTourSteps;
    }
  };

  const tourSteps = getCurrentTourSteps();
  const currentTourStep = tourSteps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === tourSteps.length - 1;

  // Reset tour step when location changes
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
    }
  }, [location.pathname, isOpen]);

  // Update highlight position during scroll (stable approach)
  useEffect(() => {
    if (!isOpen || !highlightedElement) return;

    let animationFrameId: number;

    const updateHighlightPosition = () => {
      const rect = highlightedElement.getBoundingClientRect();
      setHighlightPosition({
        top: rect.top - 4,
        left: rect.left - 4,
        width: rect.width + 8,
        height: rect.height + 8,
      });

      animationFrameId = requestAnimationFrame(updateHighlightPosition);
    };

    animationFrameId = requestAnimationFrame(updateHighlightPosition);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isOpen, highlightedElement]);

  useEffect(() => {
    if (!isOpen) return;

    const updateHighlight = () => {
      const step = tourSteps[currentStep];

      // Handle ABM/LAL tab switching
      if (location.pathname === "/abm-lal") {
        const tryTabSwitch = (targetTab: string, retries = 3) => {
          const allTabs = Array.from(
            document.querySelectorAll('button[role="tab"]'),
          );
          const tab = allTabs.find((t) => {
            const text = t.textContent?.trim() || "";
            return (
              text.includes(targetTab) &&
              t.getAttribute("data-state") !== "active"
            );
          });

          if (tab) {
            console.log(`Found ${targetTab} tab, clicking`);
            (tab as HTMLElement).click();

            // Verify tab switch worked
            setTimeout(() => {
              const isActive = tab.getAttribute("data-state") === "active";
              if (!isActive && retries > 0) {
                console.log(
                  `${targetTab} tab switch failed, retrying... (${retries} attempts left)`,
                );
                tryTabSwitch(targetTab, retries - 1);
              } else if (isActive) {
                console.log(`${targetTab} tab successfully activated`);
              }
            }, 100);
          } else if (retries > 0) {
            console.log(
              `${targetTab} tab not found, retrying... (${retries} attempts left)`,
            );
            setTimeout(() => tryTabSwitch(targetTab, retries - 1), 200);
          } else {
            console.log(`${targetTab} tab not found after all retries`);
            console.log(
              "Available tabs:",
              allTabs.map((t) => ({
                text: t.textContent,
                state: t.getAttribute("data-state"),
              })),
            );
          }
        };

        if (step.id === "abm-generate-lal") {
          // Switch to LAL tab
          setTimeout(() => {
            console.log("Attempting to switch to LAL tab");
            tryTabSwitch("LAL");
          }, 200);
        } else if (step.id === "abm-performance-insights") {
          // Switch to Insights tab
          setTimeout(() => {
            console.log("Attempting to switch to Insights tab");
            tryTabSwitch("Insights");
          }, 200);
        }
      }

      if (step.target === "body") {
        setHighlightedElement(null);
        return;
      }

      const element = document.querySelector(step.target);
      if (element) {
        setHighlightedElement(element);

        // Set initial highlight position
        const rect = element.getBoundingClientRect();
        const scrollTop =
          window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft =
          window.pageXOffset || document.documentElement.scrollLeft;

        // Use viewport-relative positioning for stable highlighting
        setHighlightPosition({
          top: rect.top - 4,
          left: rect.left - 4,
          width: rect.width + 8,
          height: rect.height + 8,
        });

        // Calculate tooltip position with viewport constraints
        // Using the same rect, scrollTop, and scrollLeft variables from above

        // Tooltip dimensions (estimated)
        const tooltipWidth = 384; // w-96 = 384px
        const tooltipHeight = 400; // estimated height
        const margin = 20;

        let top = 0;
        let left = 0;
        let actualPosition = step.position;

        // Calculate initial position
        switch (step.position) {
          case "top":
            top = rect.top + scrollTop - tooltipHeight - margin;
            left = rect.left + scrollLeft + rect.width / 2 - tooltipWidth / 2;
            break;
          case "bottom":
            top = rect.bottom + scrollTop + margin;
            left = rect.left + scrollLeft + rect.width / 2 - tooltipWidth / 2;
            break;
          case "left":
            top = rect.top + scrollTop + rect.height / 2 - tooltipHeight / 2;
            left = rect.left + scrollLeft - tooltipWidth - margin;
            break;
          case "right":
            top = rect.top + scrollTop + rect.height / 2 - tooltipHeight / 2;
            left = rect.right + scrollLeft + margin;
            break;
          case "center":
            top = window.innerHeight / 2 + scrollTop - tooltipHeight / 2;
            left = window.innerWidth / 2 + scrollLeft - tooltipWidth / 2;
            break;
        }

        // Viewport constraints
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const maxWidth = Math.min(tooltipWidth, viewportWidth * 0.9);

        // Adjust horizontal position to stay within viewport
        if (left < margin) {
          left = margin;
        } else if (left + maxWidth > viewportWidth - margin) {
          left = viewportWidth - maxWidth - margin;
        }

        // Adjust vertical position to stay within viewport
        if (top < scrollTop + margin) {
          // If tooltip would go above viewport, position it below the element
          if (step.position === "top") {
            top = rect.bottom + scrollTop + margin;
            actualPosition = "bottom";
          } else {
            top = scrollTop + margin;
          }
        } else if (top + tooltipHeight > scrollTop + viewportHeight - margin) {
          // If tooltip would go below viewport, position it above the element
          if (step.position === "bottom") {
            top = rect.top + scrollTop - tooltipHeight - margin;
            actualPosition = "top";
          } else {
            top = scrollTop + viewportHeight - tooltipHeight - margin;
          }
        }

        // For sidebar elements, prefer right positioning to avoid overflow
        if (step.category === "navigation" || step.category === "utilities") {
          const sidebarWidth = 256; // w-64 = 256px
          if (rect.left < sidebarWidth + 50) {
            // Element is in sidebar area
            left = Math.max(
              sidebarWidth + margin,
              rect.right + scrollLeft + margin,
            );
            actualPosition = "right";

            // Ensure it doesn't overflow right edge
            if (left + maxWidth > viewportWidth - margin) {
              left = viewportWidth - maxWidth - margin;
            }
          }
        }

        // Special positioning for ABM/LAL page elements
        if (location.pathname === "/abm-lal") {
          // For Quick Access section, ensure it stays centered and visible
          if (step.id === "abm-quick-access") {
            // Position above the element with safe margins
            top = rect.top + scrollTop - tooltipHeight - margin;
            left = rect.left + scrollLeft + rect.width / 2 - tooltipWidth / 2;

            // Ensure horizontal centering within viewport
            if (left < margin) {
              left = margin;
            } else if (left + tooltipWidth > viewportWidth - margin) {
              left = viewportWidth - tooltipWidth - margin;
            }

            // If not enough space above, position below
            if (top < scrollTop + margin) {
              top = rect.bottom + scrollTop + margin;
            }
          }

          // For tab content sections, ensure proper positioning
          if (
            step.id === "abm-verify-accounts" ||
            step.id === "abm-generate-lal" ||
            step.id === "abm-performance-insights"
          ) {
            // Position the tooltip to the right of the main content area
            left = rect.left + scrollLeft + rect.width / 2 - tooltipWidth / 2;
            top = rect.top + scrollTop + margin;

            // Ensure it stays within viewport bounds
            if (left + tooltipWidth > viewportWidth - margin) {
              left = viewportWidth - tooltipWidth - margin;
            }
            if (left < margin) {
              left = margin;
            }
          }
        }

        setTooltipPosition({ top, left });

        // Scroll element into view with a small delay to prevent positioning conflicts
        setTimeout(() => {
          element.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "nearest",
          });
        }, 100);
      }
    };

    // Add a small delay to ensure DOM is ready and tabs are switched
    const timeoutId = setTimeout(updateHighlight, 500);

    const handleResize = () => {
      setTimeout(updateHighlight, 50);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", handleResize);
    };
  }, [currentStep, isOpen]);

  const nextStep = () => {
    console.log(
      "nextStep called, isLastStep:",
      isLastStep,
      "currentStep:",
      currentStep,
    );
    if (isLastStep) {
      console.log("Completing tour");
      onComplete();
    } else {
      console.log("Moving to next step:", currentStep + 1);
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (!isFirstStep) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const skipTour = () => {
    onClose();
  };

  if (!isOpen) return null;

  const getTooltipClasses = () => {
    if (!currentTourStep || currentTourStep.position === "center") {
      return "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2";
    }

    // Use absolute positioning with viewport-aware positioning
    return "absolute";
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-[60]"
        onClick={(e) => {
          // Only skip tour if clicking on the overlay itself, not on child elements
          if (e.target === e.currentTarget) {
            skipTour();
          }
        }}
      >
        {/* Highlight cutout */}
        {highlightedElement && (
          <div
            className="fixed border-4 border-valasys-orange rounded-lg shadow-lg animate-pulse"
            style={{
              top: highlightPosition.top,
              left: highlightPosition.left,
              width: highlightPosition.width,
              height: highlightPosition.height,
              backgroundColor: "rgba(255, 106, 0, 0.1)",
              pointerEvents: "none",
              zIndex: 61,
            }}
          />
        )}
      </div>

      {/* Tour Tooltip */}
      <div
        ref={tooltipRef}
        className={`${getTooltipClasses()} z-[70]`}
        style={
          currentTourStep.position !== "center"
            ? {
                top: tooltipPosition.top,
                left: tooltipPosition.left,
              }
            : {}
        }
      >
        <Card className="w-96 max-w-[90vw] sm:max-w-[85vw] md:max-w-[400px] max-h-[75vh] shadow-2xl border-valasys-orange/20 bg-white/95 backdrop-blur-sm relative z-[71] pointer-events-auto overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-valasys-orange/10 rounded-lg">
                  <currentTourStep.icon className="h-5 w-5 text-valasys-orange" />
                </div>
                <div>
                  <CardTitle className="text-lg text-valasys-gray-900">
                    {currentTourStep.title}
                  </CardTitle>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {currentStep + 1} of {tourSteps.length}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="text-xs bg-valasys-orange/10 text-valasys-orange border-valasys-orange/20"
                    >
                      {(() => {
                        switch (location.pathname) {
                          case "/":
                            return "Dashboard";
                          case "/build-vais":
                            return "VAIS Builder";
                          case "/analytics":
                            return "Analytics";
                          case "/find-prospect":
                            return "Find Prospect";
                          case "/abm-lal":
                            return "ABM/LAL";
                          case "/build-campaign":
                          case "/build-my-campaign":
                            return "Campaign Builder";
                          case "/settings":
                            return "Settings";
                          case "/support":
                          case "/faqs":
                            return "Support";
                          default:
                            return "Page Guide";
                        }
                      })()}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className={`text-xs ${
                        currentTourStep.category === "navigation"
                          ? "bg-blue-100 text-blue-700"
                          : currentTourStep.category === "dashboard"
                            ? "bg-green-100 text-green-700"
                            : currentTourStep.category === "utilities"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {currentTourStep.category}
                    </Badge>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={skipTour}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 max-h-[45vh] overflow-y-auto">
            <p className="text-valasys-gray-600 leading-relaxed">
              {currentTourStep.description}
            </p>

            {currentTourStep.tips && (
              <div className="bg-valasys-gray-50 rounded-lg p-3">
                <h4 className="text-sm font-semibold text-valasys-gray-900 mb-2 flex items-center">
                  <Zap className="h-4 w-4 text-valasys-orange mr-1" />
                  Pro Tips:
                </h4>
                <ul className="space-y-1">
                  {currentTourStep.tips.map((tip, index) => (
                    <li
                      key={index}
                      className="text-sm text-valasys-gray-600 flex items-start"
                    >
                      <span className="text-valasys-orange mr-2">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {currentTourStep.nextAction && (
              <div className="bg-valasys-orange/10 rounded-lg p-3 border border-valasys-orange/20">
                <p className="text-sm text-valasys-orange font-medium flex items-center">
                  <Play className="h-4 w-4 mr-2" />
                  Next: {currentTourStep.nextAction}
                </p>
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-valasys-gray-100">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    prevStep();
                  }}
                  disabled={isFirstStep}
                  className="text-valasys-gray-600"
                  type="button"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    skipTour();
                  }}
                  className="text-valasys-gray-500"
                  type="button"
                >
                  Skip Tour
                </Button>
              </div>

              <Button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log(
                    "Next button clicked, current step:",
                    currentStep,
                  );
                  nextStep();
                }}
                size="sm"
                className="bg-valasys-orange hover:bg-valasys-orange-light text-white cursor-pointer"
                type="button"
              >
                {isLastStep ? (
                  <>
                    Complete
                    <CheckCircle className="h-4 w-4 ml-1" />
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[72]">
        <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-valasys-gray-700">
              Platform Tour
            </span>
            <div className="w-32 h-2 bg-valasys-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-valasys-orange transition-all duration-300"
                style={{
                  width: `${((currentStep + 1) / tourSteps.length) * 100}%`,
                }}
              />
            </div>
            <span className="text-xs text-valasys-gray-500">
              {currentStep + 1}/{tourSteps.length}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
