import React, { useState, useRef, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
  HelpCircle,
  Search,
  MessageCircle,
  FileText,
  CreditCard,
  Download,
  Settings,
  Users,
  Target,
  TrendingUp,
  Shield,
  Mail,
  Phone,
  ThumbsUp,
  ThumbsDown,
  Link2,
  ChevronRight,
  Pin,
  PlayCircle,
  BookOpen,
  Lightbulb,
  Copy,
  Check,
  ExternalLink,
  Filter,
  Star,
  Clock,
  ArrowUpRight,
  FileDown,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  relatedQuestions: string[];
  hasVideo?: boolean;
  videoUrl?: string;
  lastUpdated?: string;
  helpfulVotes?: number;
  notHelpfulVotes?: number;
}

interface Category {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  description: string;
  count: number;
}

interface GlossaryTerm {
  term: string;
  definition: string;
}

const glossaryTerms: GlossaryTerm[] = [
  {
    term: "Intent Data",
    definition:
      "Digital signals that indicate a prospect's interest in purchasing products or services like yours.",
  },
  {
    term: "Predictive Analytics",
    definition:
      "AI-powered technology that analyzes data patterns to predict future customer behavior and purchasing intent.",
  },
  {
    term: "ICP",
    definition:
      "Ideal Customer Profile - a detailed description of the perfect customer for your business based on firmographic and behavioral data.",
  },
  {
    term: "VAIS",
    definition:
      "Valasys AI Score - Our proprietary scoring system that evaluates companies based on their likelihood to purchase.",
  },
  {
    term: "ABM",
    definition:
      "Account-Based Marketing - A strategic approach that concentrates sales and marketing efforts on specific target accounts.",
  },
  {
    term: "Lookalike Audience",
    definition:
      "A group of prospects who share similar characteristics with your best existing customers.",
  },
];

const faqData: FAQ[] = [
  {
    id: "1",
    question: "How do I export my prospect search results?",
    answer:
      "To export your prospect search results, follow these simple steps:\n\n1. **Run your search** using the Find Prospects tool with your desired filters\n2. **Review results** and use the checkboxes to select specific prospects\n3. **Click Export** in the top-right corner of the results table\n4. **Choose format** - Select from CSV, Excel, or PDF formats\n5. **Download starts** automatically to your default downloads folder\n\nYou can also export all results at once by clicking 'Select All' before exporting. Each exported prospect consumes 1 credit from your account balance.",
    category: "Getting Started",
    tags: ["export", "prospects", "download", "results", "csv", "excel"],
    relatedQuestions: ["2", "6", "10"],
    hasVideo: true,
    videoUrl: "/videos/export-prospects.mp4",
    lastUpdated: "2024-01-15",
    helpfulVotes: 45,
    notHelpfulVotes: 3,
  },
  {
    id: "2",
    question: "How are credits calculated and consumed?",
    answer:
      "Credits are the currency used to access prospect data in Valasys. Here's how they work:\n\n**Credit Consumption:**\n• 1 credit = 1 exported prospect contact\n• Searches are completely free - no credits consumed\n• Preview data (company info) is free\n• Only charged when downloading contact details\n\n**Monitoring Usage:**\n• Current balance shown in dashboard header\n• Usage history available in Account Settings\n• Low balance notifications sent automatically\n\n**Purchasing Credits:**\n• Buy through Account Settings > Billing\n• Volume discounts available for bulk purchases\n• Enterprise plans include monthly credit allotments\n\nContact our sales team for custom pricing on large credit packages.",
    category: "Billing & Credits",
    tags: ["credits", "billing", "cost", "pricing", "consumption"],
    relatedQuestions: ["9", "5"],
    lastUpdated: "2024-01-20",
    helpfulVotes: 67,
    notHelpfulVotes: 5,
  },
  {
    id: "3",
    question: "What is VAIS and how does it work?",
    answer:
      "**VAIS (Valasys AI Score)** is our proprietary predictive analytics system that scores companies on their likelihood to purchase your products or services.\n\n**How VAIS Works:**\n• Analyzes 200+ company and behavioral signals\n• Combines firmographic, technographic, and Intent Data\n• Uses machine learning trained on millions of B2B transactions\n• Continuously updates scores based on new data\n\n**Score Interpretation:**\n• 0-30: Low likelihood (early market research stage)\n• 31-60: Medium likelihood (evaluating solutions)\n• 61-80: High likelihood (actively comparing vendors)\n• 81-100: Very high likelihood (ready to purchase)\n\n**Key Factors:**\n• Company growth trajectory\n• Technology stack changes\n• Intent Data signals\n• Budget and buying authority indicators\n• Competitive landscape position\n\nVAIS helps you prioritize outreach efforts on prospects most likely to convert, improving conversion rates by up to 300%.",
    category: "VAIS Scoring",
    tags: ["vais", "scoring", "ai", "prospects", "predictive analytics"],
    relatedQuestions: ["4", "7", "1"],
    hasVideo: true,
    videoUrl: "/videos/vais-explained.mp4",
    lastUpdated: "2024-01-18",
    helpfulVotes: 89,
    notHelpfulVotes: 7,
  },
  {
    id: "4",
    question: "How do I build a targeted prospect campaign?",
    answer:
      "Building effective campaigns in Valasys follows our proven methodology:\n\n**Step 1: Define Your ICP**\n• Use Build VAIS to create your Ideal Customer Profile\n• Set company size, industry, and growth criteria\n• Define key technology requirements\n• Upload existing customer data for Lookalike Audience modeling\n\n**Step 2: Configure Intent Topics**\n• Select intent keywords relevant to your solution\n• Choose from 10,000+ pre-built intent topics\n• Add custom keywords specific to your industry\n• Set intent signal strength thresholds\n\n**Step 3: Geographic Targeting**\n• Select target countries, states, or metro areas\n• Use radius targeting around key locations\n• Exclude specific regions if needed\n\n**Step 4: Suppression & Compliance**\n• Upload suppression lists (customers, competitors, opt-outs)\n• Enable GDPR/CCPA compliance filters\n• Set email deliverability requirements\n\n**Step 5: Launch & Monitor**\n• Review audience size and VAIS distribution\n• Launch campaign with test cohort first\n• Monitor performance metrics and optimize\n\nProspect campaigns typically generate 20-40% higher response rates compared to generic outreach.",
    category: "Campaigns",
    tags: ["campaign", "targeting", "prospects", "vais", "icp", "intent data"],
    relatedQuestions: ["3", "10", "6"],
    lastUpdated: "2024-01-22",
    helpfulVotes: 73,
    notHelpfulVotes: 4,
  },
  {
    id: "5",
    question: "Can I integrate Valasys with my CRM?",
    answer:
      "Yes! Valasys offers comprehensive integration options with all major CRM and marketing automation platforms.\n\n**Native Integrations:**\n• Salesforce (Sales & Marketing Cloud)\n• HubSpot (CRM & Marketing Hub)\n• Pipedrive\n• Microsoft Dynamics 365\n• Marketo\n• Pardot\n• Mailchimp\n• Outreach.io\n\n**Integration Capabilities:**\n• **Real-time sync** - Prospects sync automatically\n• **VAIS score updates** - Scores refresh weekly\n• **Intent Data** - Push intent signals to CRM\n• **Custom fields** - Map Valasys data to your fields\n• **Webhook support** - Trigger workflows based on scores\n\n**API Access:**\n• RESTful API for custom integrations\n• Rate limit: 1000 requests/hour (Pro), 5000/hour (Enterprise)\n• Comprehensive documentation with code examples\n• Sandbox environment for testing\n\n**Setup Process:**\n1. Go to Settings > Integrations\n2. Select your platform and authenticate\n3. Configure field mapping preferences\n4. Test connection and enable sync\n\nEnterprise customers get dedicated integration support and custom development assistance.",
    category: "Integrations",
    tags: ["crm", "integration", "api", "salesforce", "hubspot", "sync"],
    relatedQuestions: ["9", "6", "8"],
    lastUpdated: "2024-01-25",
    helpfulVotes: 56,
    notHelpfulVotes: 2,
  },
  {
    id: "6",
    question: "What file formats can I upload for suppression lists?",
    answer:
      "Valasys supports multiple file formats for suppression list uploads to ensure maximum compatibility.\n\n**Supported Formats:**\n• **CSV** (.csv) - Most common, recommended format\n• **Excel** (.xlsx, .xls) - Both old and new Excel formats\n• **Plain Text** (.txt) - One entry per line\n• **JSON** (.json) - For API integrations\n\n**File Requirements:**\n• Maximum file size: 25MB\n• Maximum rows: 100,000 entries\n• UTF-8 encoding recommended\n• Column headers in first row (for CSV/Excel)\n\n**Supported Data Types:**\n• **Email addresses** - Primary suppression method\n• **Company names** - Exact and fuzzy matching\n• **Domains** - Exclude entire organizations\n• **Phone numbers** - For cold calling suppression\n• **LinkedIn URLs** - Social selling suppression\n\n**Auto-Mapping:**\nOur system automatically detects and maps common column headers:\n• email, email_address, e-mail\n• company, company_name, organization\n• domain, website, company_domain\n• phone, phone_number, tel\n\n**Processing Time:**\n• Small files (<1MB): Instant processing\n• Large files: 5-15 minutes\n• Email validation included automatically\n• Duplicate removal across all lists\n\nSuppress lists are encrypted and stored securely, with automatic GDPR compliance.",
    category: "Data Management",
    tags: ["upload", "suppression", "csv", "excel", "file formats", "data"],
    relatedQuestions: ["1", "8", "2"],
    lastUpdated: "2024-01-20",
    helpfulVotes: 34,
    notHelpfulVotes: 1,
  },
  {
    id: "7",
    question: "How accurate is the prospect contact information?",
    answer:
      "Data accuracy is our top priority at Valasys. We maintain industry-leading accuracy rates through multiple verification processes.\n\n**Accuracy Metrics:**\n• **Email accuracy**: 96.5% deliverable rate\n• **Phone numbers**: 92% accuracy (direct dials)\n• **Job titles**: 94% current and accurate\n• **Company data**: 98% accuracy for firmographics\n• **Overall data quality**: 95% comprehensive accuracy\n\n**Verification Process:**\n• **Real-time validation** during data collection\n• **Email verification** through SMTP validation\n• **Phone verification** via carrier database checks\n• **Social profile cross-referencing** (LinkedIn, Twitter)\n• **Continuous monitoring** of bounce rates and updates\n\n**Data Sources:**\n• Public records and business directories\n• Social media and professional networks\n• Company websites and press releases\n• Partner integrations with data providers\n• User contribution and verification program\n\n**Update Frequency:**\n• Contact information: Updated weekly\n• Job titles and roles: Refreshed monthly\n• Company firmographics: Quarterly updates\n• Intent Data: Real-time (24-48 hour delay)\n\n**Quality Assurance:**\n• Machine learning algorithms detect outdated data\n• Human verification for enterprise contacts\n• Automatic removal of invalid contacts\n• Feedback loop from user reports\n\n**Accuracy Guarantee:**\nWe offer a 95% accuracy guarantee. If data quality falls below this threshold, we provide credit refunds and immediate data corrections.",
    category: "Data Quality",
    tags: ["accuracy", "contact info", "data quality", "verification", "email"],
    relatedQuestions: ["6", "8", "2"],
    lastUpdated: "2024-01-23",
    helpfulVotes: 78,
    notHelpfulVotes: 6,
  },
  {
    id: "8",
    question: "What security measures protect my data?",
    answer:
      "Valasys implements enterprise-grade security measures to protect your data and ensure compliance with international privacy regulations.\n\n**Encryption & Security:**\n• **256-bit SSL/TLS encryption** for all data transmission\n• **AES-256 encryption** for data at rest\n• **End-to-end encryption** for sensitive communications\n• **Multi-factor authentication** (MFA) required\n• **Single Sign-On** (SSO) support via SAML 2.0\n\n**Infrastructure Security:**\n• **AWS-hosted** with SOC 2 Type II compliance\n• **ISO 27001 certified** data centers\n• **24/7 monitoring** and intrusion detection\n• **Automated backups** with 99.9% uptime SLA\n• **Disaster recovery** with <4 hour RTO\n\n**Compliance Certifications:**\n• **GDPR compliant** with data processing agreements\n• **CCPA compliant** for California residents\n• **SOC 2 Type II** security audit certification\n• **HIPAA ready** for healthcare clients\n• **Privacy Shield** framework adherence\n\n**Data Privacy:**\n• **Zero data sharing** with third parties\n• **Customer data isolation** - your data stays yours\n• **Right to deletion** and data portability\n• **Audit logs** for all data access and changes\n• **Regular penetration testing** by third-party security firms\n\n**Access Controls:**\n• Role-based permissions with principle of least privilege\n• API key management with rotation policies\n• Session timeout and automatic logout\n• IP address whitelisting for enterprise accounts\n\n**Incident Response:**\n• Dedicated security team with 24/7 monitoring\n• <1 hour incident response time\n• Transparent communication during security events\n• Regular security training for all employees\n\nAll security practices are regularly audited and updated to meet evolving threats and compliance requirements.",
    category: "Security & Privacy",
    tags: ["security", "privacy", "gdpr", "ssl", "compliance", "encryption"],
    relatedQuestions: ["6", "9", "5"],
    lastUpdated: "2024-01-24",
    helpfulVotes: 92,
    notHelpfulVotes: 3,
  },
  {
    id: "9",
    question: "How do I add or remove team members?",
    answer:
      "Managing team members in Valasys is straightforward and offers flexible permission controls.\n\n**Adding Team Members:**\n1. Navigate to **Settings > Manage Users**\n2. Click **'Add New User'** button\n3. Enter email address and select role\n4. Configure permissions and credit limits\n5. Send invitation email automatically\n6. User receives setup instructions via email\n\n**User Roles & Permissions:**\n• **Admin**: Full system access, billing, user management\n• **Manager**: Team oversight, campaign management, reporting\n• **User**: Standard prospect search and export capabilities\n• **Viewer**: Read-only access to campaigns and reports\n• **API User**: Programmatic access only, no UI login\n\n**Permission Controls:**\n• Set monthly credit allowances per user\n• Restrict access to specific campaigns\n• Control export and download capabilities\n• Manage integration and API access\n• Set data visibility boundaries\n\n**Removing Team Members:**\n1. Go to **Manage Users** section\n2. Find user in the team list\n3. Click **Actions > Deactivate User**\n4. Choose to transfer or archive their data\n5. Confirm deactivation\n\n**Temporary Access:**\n• Suspend users without deletion\n• Maintain data and campaign history\n• Reactivate accounts when needed\n• Transfer ownership of campaigns/lists\n\n**Bulk Management:**\n• Import/export user lists via CSV\n• Bulk permission updates\n• Mass credit allocation\n• Group-based role assignments\n\n**Audit & Monitoring:**\n• Track user activity and login history\n• Monitor credit usage by individual\n• Export user activity reports\n• Set up alerts for unusual activity\n\nEnterprise accounts include advanced user management features like automated provisioning and department-based access controls.",
    category: "User Management",
    tags: ["users", "team", "permissions", "roles", "admin", "access"],
    relatedQuestions: ["8", "2", "5"],
    lastUpdated: "2024-01-21",
    helpfulVotes: 41,
    notHelpfulVotes: 2,
  },
  {
    id: "10",
    question: "Can I save and reuse search criteria?",
    answer:
      "Absolutely! Valasys offers powerful search templating and automation features to streamline your workflow.\n\n**Creating Search Templates:**\n1. Configure your filters in **Find Prospects** or **Build VAIS**\n2. Click **'Save as Template'** after setting all criteria\n3. Give your template a descriptive name\n4. Add optional notes for team reference\n5. Choose sharing permissions (private or team-wide)\n\n**Template Features:**\n• **Smart templates** that adapt to new data\n• **Scheduled runs** for automated prospect discovery\n• **Team sharing** with role-based access\n• **Version control** to track template changes\n• **Performance tracking** for template effectiveness\n\n**Quick Preset Options:**\n• Templates appear as quick-launch buttons\n• One-click application of saved criteria\n• Preview mode to review before running\n• Modification without affecting original template\n• Favorite templates for priority access\n\n**Advanced Template Options:**\n• **Dynamic filters** that update automatically\n• **Date range variables** (e.g., \"last 30 days\")\n• **Conditional logic** for complex scenarios\n• **Multi-step templates** for sequential searches\n• **A/B testing** capabilities for optimization\n\n**Template Categories:**\n• Personal templates (private to you)\n• Team templates (shared with your organization)\n• Industry templates (pre-built by Valasys)\n• Campaign-specific templates\n\n**Management & Organization:**\n• Folder structure for template organization\n• Search and filter templates by name/tags\n• Duplicate templates for variations\n• Archive unused templates\n• Export/import templates between accounts\n\n**Automation Features:**\n• Schedule template runs (daily, weekly, monthly)\n• Email alerts when new prospects match criteria\n• Automatic list updates with fresh prospects\n• Integration triggers for CRM workflows\n\n**Best Practices:**\n• Use descriptive names for easy identification\n• Document template purpose in notes section\n• Regularly review and update criteria\n• Archive outdated templates\n• Test templates before sharing with team\n\nSaved templates can improve your prospecting efficiency by up to 75% and ensure consistent targeting across your team.",
    category: "Search & Filters",
    tags: [
      "save search",
      "presets",
      "filters",
      "reuse",
      "templates",
      "automation",
    ],
    relatedQuestions: ["4", "1", "3"],
    lastUpdated: "2024-01-26",
    helpfulVotes: 65,
    notHelpfulVotes: 4,
  },
];

const categories: Category[] = [
  {
    name: "Getting Started",
    icon: Target,
    color: "bg-blue-100 text-blue-800 border-blue-200",
    description: "Basic setup and initial steps",
    count: faqData.filter((faq) => faq.category === "Getting Started").length,
  },
  {
    name: "Billing & Credits",
    icon: CreditCard,
    color: "bg-green-100 text-green-800 border-green-200",
    description: "Pricing, credits, and payments",
    count: faqData.filter((faq) => faq.category === "Billing & Credits").length,
  },
  {
    name: "VAIS Scoring",
    icon: TrendingUp,
    color: "bg-purple-100 text-purple-800 border-purple-200",
    description: "AI scoring and predictive analytics",
    count: faqData.filter((faq) => faq.category === "VAIS Scoring").length,
  },
  {
    name: "Campaigns",
    icon: MessageCircle,
    color: "bg-valasys-orange/10 text-valasys-orange border-valasys-orange/20",
    description: "Campaign building and management",
    count: faqData.filter((faq) => faq.category === "Campaigns").length,
  },
  {
    name: "Integrations",
    icon: Settings,
    color: "bg-cyan-100 text-cyan-800 border-cyan-200",
    description: "CRM and API integrations",
    count: faqData.filter((faq) => faq.category === "Integrations").length,
  },
  {
    name: "Data Management",
    icon: FileText,
    color: "bg-indigo-100 text-indigo-800 border-indigo-200",
    description: "Data uploads and file formats",
    count: faqData.filter((faq) => faq.category === "Data Management").length,
  },
  {
    name: "Data Quality",
    icon: Shield,
    color: "bg-emerald-100 text-emerald-800 border-emerald-200",
    description: "Accuracy and verification",
    count: faqData.filter((faq) => faq.category === "Data Quality").length,
  },
  {
    name: "Security & Privacy",
    icon: Shield,
    color: "bg-red-100 text-red-800 border-red-200",
    description: "Security measures and compliance",
    count: faqData.filter((faq) => faq.category === "Security & Privacy")
      .length,
  },
  {
    name: "User Management",
    icon: Users,
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    description: "Team members and permissions",
    count: faqData.filter((faq) => faq.category === "User Management").length,
  },
  {
    name: "Search & Filters",
    icon: Search,
    color: "bg-pink-100 text-pink-800 border-pink-200",
    description: "Search tools and saved templates",
    count: faqData.filter((faq) => faq.category === "Search & Filters").length,
  },
];

export default function FAQs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [expandedAnswers, setExpandedAnswers] = useState<Set<string>>(
    new Set(),
  );
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [feedbackGiven, setFeedbackGiven] = useState<Set<string>>(new Set());
  const [suggestedFAQs, setSuggestedFAQs] = useState<FAQ[]>([]);
  const [showPDFDialog, setShowPDFDialog] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const filteredFAQs = faqData.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase()),
      );

    const matchesCategory =
      !selectedCategory || faq.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Generate AI-powered suggestions when no exact matches
  useEffect(() => {
    if (searchTerm && filteredFAQs.length === 0) {
      const suggestions = faqData
        .filter(
          (faq) =>
            faq.tags.some((tag) =>
              tag
                .toLowerCase()
                .includes(searchTerm.toLowerCase().substring(0, 3)),
            ) ||
            faq.question
              .toLowerCase()
              .includes(searchTerm.toLowerCase().substring(0, 3)),
        )
        .slice(0, 3);
      setSuggestedFAQs(suggestions);
    } else {
      setSuggestedFAQs([]);
    }
  }, [searchTerm, filteredFAQs]);

  const getCategoryInfo = (categoryName: string) => {
    return categories.find((cat) => cat.name === categoryName) || categories[0];
  };

  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;

    const regex = new RegExp(`(${highlight})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark
          key={index}
          className="bg-valasys-orange/20 text-valasys-orange font-medium rounded px-1"
        >
          {part}
        </mark>
      ) : (
        part
      ),
    );
  };

  const toggleReadMore = (faqId: string) => {
    const newExpanded = new Set(expandedAnswers);
    if (newExpanded.has(faqId)) {
      newExpanded.delete(faqId);
    } else {
      newExpanded.add(faqId);
    }
    setExpandedAnswers(newExpanded);
  };

  const copyLink = (faqId: string) => {
    const url = `${window.location.origin}${window.location.pathname}#faq-${faqId}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(faqId);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const submitFeedback = (faqId: string, helpful: boolean) => {
    setFeedbackGiven(new Set(feedbackGiven).add(faqId));
    // Here you would typically send feedback to your backend
    console.log(
      `Feedback for FAQ ${faqId}: ${helpful ? "helpful" : "not helpful"}`,
    );
  };

  const getRelatedQuestions = (faqId: string) => {
    const faq = faqData.find((f) => f.id === faqId);
    if (!faq) return [];

    return faq.relatedQuestions
      .map((id) => faqData.find((f) => f.id === id))
      .filter(Boolean) as FAQ[];
  };

  const downloadCategoryPDF = (categoryName: string) => {
    // In a real implementation, this would generate and download a PDF
    console.log(`Downloading PDF for category: ${categoryName}`);
    setShowPDFDialog(false);
  };

  const renderGlossaryTooltip = (text: string) => {
    let processedText = text;

    glossaryTerms.forEach(({ term, definition }) => {
      const regex = new RegExp(`\\b${term}\\b`, "gi");
      processedText = processedText.replace(
        regex,
        (match) =>
          `<span class="glossary-term" data-term="${term}" data-definition="${definition}">${match}</span>`,
      );
    });

    return (
      <div
        dangerouslySetInnerHTML={{ __html: processedText }}
        onClick={(e) => {
          const target = e.target as HTMLElement;
          if (target.classList.contains("glossary-term")) {
            // Handle glossary term click - could show tooltip or modal
            console.log(
              "Glossary term clicked:",
              target.getAttribute("data-term"),
            );
          }
        }}
      />
    );
  };

  return (
    <TooltipProvider>
      <DashboardLayout>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-valasys-orange to-valasys-orange-light rounded-lg flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-valasys-gray-900">
                  Frequently Asked Questions
                </h1>
              </div>
              <p className="text-valasys-gray-600 mt-1">
                Find answers to common questions about using Valasys AI
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Badge
                variant="secondary"
                className="bg-valasys-gray-100 text-valasys-gray-700"
              >
                <Sparkles className="w-3 h-3 mr-1" />
                {filteredFAQs.length} articles found
              </Badge>
              <Dialog open={showPDFDialog} onOpenChange={setShowPDFDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <FileDown className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Download FAQ Category</DialogTitle>
                    <DialogDescription>
                      Select a category to download as PDF
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((category) => (
                      <Button
                        key={category.name}
                        variant="outline"
                        onClick={() => downloadCategoryPDF(category.name)}
                        className="justify-start"
                      >
                        <category.icon className="w-4 h-4 mr-2" />
                        {category.name}
                      </Button>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Search Bar */}
          <Card className="mb-6 shadow-sm border-valasys-gray-200">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-valasys-gray-400" />
                <Input
                  placeholder="Search for answers... Try 'export prospects' or 'VAIS scoring'"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-base h-12 border-valasys-gray-300 focus:border-valasys-orange focus:ring-valasys-orange/20"
                />
              </div>
            </CardContent>
          </Card>

          {/* Main Content - Split Layout */}
          <div className="flex-1 flex gap-6 min-h-0">
            {/* Left Sidebar - Categories */}
            <div className="w-80 flex-shrink-0">
              <Card className="h-full shadow-lg border-valasys-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-valasys-gray-900 flex items-center">
                    <Filter className="w-5 h-5 mr-2 text-valasys-orange" />
                    Browse Topics
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea
                    className="h-[calc(100vh-300px)]"
                    ref={sidebarRef}
                  >
                    <div className="p-4 space-y-2">
                      {/* All Categories Option */}
                      <button
                        onClick={() => setSelectedCategory("")}
                        className={cn(
                          "w-full p-4 rounded-lg border text-left transition-all duration-200 hover:shadow-md group",
                          selectedCategory === ""
                            ? "border-valasys-orange bg-valasys-orange/5 text-valasys-orange shadow-md"
                            : "border-valasys-gray-200 hover:border-valasys-orange/30 hover:bg-valasys-gray-50",
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div
                              className={cn(
                                "p-2 rounded-lg transition-colors",
                                selectedCategory === ""
                                  ? "bg-valasys-orange text-white"
                                  : "bg-valasys-gray-100 group-hover:bg-valasys-orange/10",
                              )}
                            >
                              <FileText className="w-4 h-4" />
                            </div>
                            <div>
                              <div
                                className={cn(
                                  "font-semibold transition-colors",
                                  selectedCategory === ""
                                    ? "text-valasys-orange"
                                    : "text-valasys-gray-900",
                                )}
                              >
                                All Topics
                              </div>
                              <div className="text-sm text-valasys-gray-500">
                                {faqData.length} articles
                              </div>
                            </div>
                          </div>
                          {selectedCategory === "" && (
                            <Pin className="w-4 h-4 text-valasys-orange" />
                          )}
                          {selectedCategory !== "" && (
                            <ChevronRight className="w-4 h-4 text-valasys-gray-400 group-hover:text-valasys-orange transition-colors" />
                          )}
                        </div>
                      </button>

                      {/* Category Options */}
                      {categories.map((category) => {
                        const Icon = category.icon;
                        const isActive = selectedCategory === category.name;

                        return (
                          <button
                            key={category.name}
                            onClick={() => setSelectedCategory(category.name)}
                            className={cn(
                              "w-full p-4 rounded-lg border text-left transition-all duration-200 hover:shadow-md group",
                              isActive
                                ? "border-valasys-orange bg-valasys-orange/5 text-valasys-orange shadow-md"
                                : "border-valasys-gray-200 hover:border-valasys-orange/30 hover:bg-valasys-gray-50",
                            )}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div
                                  className={cn(
                                    "p-2 rounded-lg transition-colors",
                                    isActive
                                      ? "bg-valasys-orange text-white"
                                      : "bg-valasys-gray-100 group-hover:bg-valasys-orange/10",
                                  )}
                                >
                                  <Icon className="w-4 h-4" />
                                </div>
                                <div>
                                  <div
                                    className={cn(
                                      "font-semibold transition-colors",
                                      isActive
                                        ? "text-valasys-orange"
                                        : "text-valasys-gray-900",
                                    )}
                                  >
                                    {category.name}
                                  </div>
                                  <div className="text-sm text-valasys-gray-500">
                                    {category.count} articles
                                  </div>
                                </div>
                              </div>
                              {isActive && (
                                <Pin className="w-4 h-4 text-valasys-orange" />
                              )}
                              {!isActive && (
                                <ChevronRight className="w-4 h-4 text-valasys-gray-400 group-hover:text-valasys-orange transition-colors" />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Right Panel - Questions & Answers */}
            <div className="flex-1 min-w-0">
              <Card className="h-full shadow-lg border-valasys-gray-200">
                {/* Category Indicator */}
                {selectedCategory && (
                  <div className="border-b border-valasys-gray-200 bg-valasys-gray-50/50 px-6 py-3">
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-valasys-gray-600">
                        Currently Viewing:
                      </span>
                      <Badge
                        className={getCategoryInfo(selectedCategory).color}
                      >
                        {selectedCategory}
                      </Badge>
                      <span className="text-valasys-gray-500">
                        • {filteredFAQs.length} articles
                      </span>
                    </div>
                  </div>
                )}

                <CardContent className="p-0">
                  <ScrollArea className="h-[calc(100vh-300px)]">
                    <div className="p-6">
                      {/* No Results - Show AI Suggestions */}
                      {filteredFAQs.length === 0 && searchTerm && (
                        <div className="space-y-6">
                          <div className="text-center py-8">
                            <Search className="w-16 h-16 mx-auto mb-4 text-valasys-gray-300" />
                            <h3 className="text-lg font-medium text-valasys-gray-700 mb-2">
                              No exact matches found
                            </h3>
                            <p className="text-valasys-gray-500 mb-4">
                              Try adjusting your search terms or browse
                              suggested topics below
                            </p>
                          </div>

                          {suggestedFAQs.length > 0 && (
                            <div className="space-y-4">
                              <div className="flex items-center space-x-2 text-sm">
                                <Lightbulb className="w-4 h-4 text-valasys-orange" />
                                <span className="font-medium text-valasys-gray-700">
                                  AI-Powered Suggestions:
                                </span>
                              </div>
                              {suggestedFAQs.map((faq) => (
                                <Card
                                  key={faq.id}
                                  className="border-valasys-orange/20 bg-valasys-orange/5 hover:shadow-md transition-shadow cursor-pointer"
                                  onClick={() => {
                                    setSearchTerm("");
                                    setSelectedCategory(faq.category);
                                  }}
                                >
                                  <CardContent className="p-4">
                                    <div className="flex items-start space-x-3">
                                      <Sparkles className="w-5 h-5 text-valasys-orange flex-shrink-0 mt-0.5" />
                                      <div>
                                        <h4 className="font-medium text-valasys-gray-900 mb-1">
                                          {faq.question}
                                        </h4>
                                        <div className="flex items-center space-x-2">
                                          <Badge
                                            className={
                                              getCategoryInfo(faq.category)
                                                .color
                                            }
                                          >
                                            {faq.category}
                                          </Badge>
                                          <ArrowUpRight className="w-3 h-3 text-valasys-orange" />
                                        </div>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* FAQ Results */}
                      {filteredFAQs.length > 0 && (
                        <Accordion
                          type="single"
                          collapsible
                          className="space-y-4"
                        >
                          {filteredFAQs.map((faq) => {
                            const categoryInfo = getCategoryInfo(faq.category);
                            const Icon = categoryInfo.icon;
                            const isExpanded = expandedAnswers.has(faq.id);
                            const fullAnswer = faq.answer;
                            const shortAnswer =
                              fullAnswer.length > 300
                                ? fullAnswer.substring(0, 300) + "..."
                                : fullAnswer;
                            const displayAnswer = isExpanded
                              ? fullAnswer
                              : shortAnswer;
                            const relatedQuestions = getRelatedQuestions(
                              faq.id,
                            );

                            return (
                              <AccordionItem
                                key={faq.id}
                                value={faq.id}
                                id={`faq-${faq.id}`}
                                className="border border-valasys-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 bg-white"
                              >
                                <AccordionTrigger className="text-left hover:no-underline p-6 group">
                                  <div className="flex items-start space-x-4 w-full">
                                    <div className="p-2 rounded-lg bg-valasys-orange/10 group-hover:bg-valasys-orange/20 transition-colors">
                                      <Icon className="w-5 h-5 text-valasys-orange" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="font-semibold text-valasys-gray-900 pr-4 text-lg leading-6">
                                        {highlightText(
                                          faq.question,
                                          searchTerm,
                                        )}
                                      </div>
                                      <div className="flex items-center space-x-3 mt-3">
                                        <Badge className={categoryInfo.color}>
                                          {faq.category}
                                        </Badge>
                                        {faq.hasVideo && (
                                          <Badge
                                            variant="outline"
                                            className="border-green-300 text-green-700 bg-green-50"
                                          >
                                            <PlayCircle className="w-3 h-3 mr-1" />
                                            Video
                                          </Badge>
                                        )}
                                        <div className="flex items-center space-x-1 text-xs text-valasys-gray-500">
                                          <Clock className="w-3 h-3" />
                                          <span>Updated {faq.lastUpdated}</span>
                                        </div>
                                        <div className="flex items-center space-x-1 text-xs text-valasys-gray-500">
                                          <ThumbsUp className="w-3 h-3" />
                                          <span>{faq.helpfulVotes}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent className="px-6 pb-6">
                                  <div className="pl-12 space-y-6">
                                    {/* Answer Content */}
                                    <div className="prose prose-sm max-w-none text-valasys-gray-700 leading-relaxed">
                                      <div className="whitespace-pre-line">
                                        {highlightText(
                                          displayAnswer,
                                          searchTerm,
                                        )}
                                      </div>

                                      {fullAnswer.length > 300 && (
                                        <Button
                                          variant="link"
                                          onClick={() => toggleReadMore(faq.id)}
                                          className="p-0 h-auto text-valasys-orange hover:text-valasys-orange/80"
                                        >
                                          {isExpanded
                                            ? "Read Less"
                                            : "Read More"}
                                        </Button>
                                      )}
                                    </div>

                                    {/* Video Embed */}
                                    {faq.hasVideo && (
                                      <div className="bg-valasys-gray-50 rounded-lg p-4 border border-valasys-gray-200">
                                        <div className="flex items-center space-x-2 mb-2">
                                          <PlayCircle className="w-4 h-4 text-valasys-orange" />
                                          <span className="text-sm font-medium text-valasys-gray-700">
                                            Watch Video Tutorial
                                          </span>
                                        </div>
                                        <div className="text-sm text-valasys-gray-600">
                                          Step-by-step video guide for this
                                          topic
                                        </div>
                                      </div>
                                    )}

                                    {/* Related Questions */}
                                    {relatedQuestions.length > 0 && (
                                      <div className="bg-valasys-gray-50 rounded-lg p-4 border border-valasys-gray-200">
                                        <h4 className="text-sm font-medium text-valasys-gray-700 mb-3 flex items-center">
                                          <Lightbulb className="w-4 h-4 mr-2 text-valasys-orange" />
                                          Related Questions
                                        </h4>
                                        <div className="space-y-2">
                                          {relatedQuestions.map((related) => (
                                            <button
                                              key={related.id}
                                              onClick={() => {
                                                document
                                                  .getElementById(
                                                    `faq-${related.id}`,
                                                  )
                                                  ?.scrollIntoView({
                                                    behavior: "smooth",
                                                  });
                                              }}
                                              className="block text-left text-sm text-valasys-gray-600 hover:text-valasys-orange transition-colors"
                                            >
                                              • {related.question}
                                            </button>
                                          ))}
                                        </div>
                                      </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex items-center justify-between pt-4 border-t border-valasys-gray-200">
                                      <div className="flex items-center space-x-4">
                                        {/* Copy Link Button */}
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              onClick={() => copyLink(faq.id)}
                                              className="border-valasys-gray-300 hover:border-valasys-orange hover:text-valasys-orange"
                                            >
                                              {copiedLink === faq.id ? (
                                                <Check className="w-4 h-4 mr-2" />
                                              ) : (
                                                <Link2 className="w-4 h-4 mr-2" />
                                              )}
                                              {copiedLink === faq.id
                                                ? "Copied!"
                                                : "Copy Link"}
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p>
                                              Copy direct link to this question
                                            </p>
                                          </TooltipContent>
                                        </Tooltip>

                                        {/* Share Button */}
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="border-valasys-gray-300 hover:border-valasys-orange hover:text-valasys-orange"
                                        >
                                          <ExternalLink className="w-4 h-4 mr-2" />
                                          Share
                                        </Button>
                                      </div>

                                      {/* Feedback Buttons */}
                                      <div className="flex items-center space-x-2">
                                        {!feedbackGiven.has(faq.id) ? (
                                          <>
                                            <span className="text-sm text-valasys-gray-600 mr-2">
                                              Was this helpful?
                                            </span>
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              onClick={() =>
                                                submitFeedback(faq.id, true)
                                              }
                                              className="border-green-300 text-green-700 hover:bg-green-50"
                                            >
                                              <ThumbsUp className="w-4 h-4 mr-1" />
                                              Yes
                                            </Button>
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              onClick={() =>
                                                submitFeedback(faq.id, false)
                                              }
                                              className="border-red-300 text-red-700 hover:bg-red-50"
                                            >
                                              <ThumbsDown className="w-4 h-4 mr-1" />
                                              No
                                            </Button>
                                          </>
                                        ) : (
                                          <div className="flex items-center text-sm text-valasys-gray-600">
                                            <Check className="w-4 h-4 mr-1 text-green-600" />
                                            Thank you for your feedback!
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            );
                          })}
                        </Accordion>
                      )}

                      {/* No Results - No Search Term */}
                      {filteredFAQs.length === 0 && !searchTerm && (
                        <div className="text-center py-12">
                          <HelpCircle className="w-16 h-16 mx-auto mb-4 text-valasys-gray-300" />
                          <h3 className="text-lg font-medium text-valasys-gray-700 mb-2">
                            No articles in this category
                          </h3>
                          <p className="text-valasys-gray-500 mb-4">
                            Try selecting a different category or search for
                            specific topics
                          </p>
                          <Button
                            onClick={() => setSelectedCategory("")}
                            className="bg-valasys-orange hover:bg-valasys-orange/90"
                          >
                            View All Categories
                          </Button>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Contact Support Footer */}
          <Card className="mt-6 bg-gradient-to-r from-valasys-orange/5 to-valasys-blue/5 border-valasys-orange/20 shadow-lg">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-valasys-gray-900 mb-2 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 mr-2 text-valasys-orange" />
                  Still need help?
                </h3>
                <p className="text-valasys-gray-600 mb-4">
                  Can't find what you're looking for? Our support team is here
                  to help.
                </p>
                <div className="flex justify-center space-x-6">
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="w-4 h-4 text-valasys-orange" />
                    <span>support@valasys.com</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="w-4 h-4 text-valasys-orange" />
                    <span>+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <MessageCircle className="w-4 h-4 text-valasys-orange" />
                    <span>Live Chat Available</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </TooltipProvider>
  );
}
