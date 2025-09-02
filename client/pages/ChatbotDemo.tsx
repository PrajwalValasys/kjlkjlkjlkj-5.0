import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { NextGenChatbot } from "@/components/ui/next-gen-chatbot";
import {
  Bot,
  MessageCircle,
  Brain,
  Sparkles,
  Zap,
  BarChart3,
  Upload,
  Mic,
  Settings,
  Palette,
  Shield,
  Database,
  Globe,
  Users,
  TrendingUp,
  Heart,
  Star,
  Lightbulb,
  FileText,
  Camera,
  HeadphonesIcon,
  Workflow,
  Eye,
  Volume2,
  Monitor,
  Smartphone,
  Laptop,
  Play,
  CheckCircle,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureCard {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  category: "ai" | "media" | "analytics" | "customization" | "integration";
  implemented: boolean;
}

const features: FeatureCard[] = [
  // AI Features
  {
    id: "sentiment",
    title: "Sentiment Analysis",
    description:
      "Real-time mood detection with confidence scoring and escalation triggers",
    icon: Brain,
    color: "bg-purple-100 text-purple-800 border-purple-200",
    category: "ai",
    implemented: true,
  },
  {
    id: "smart-suggestions",
    title: "Smart Suggestions",
    description:
      "AI-powered response suggestions based on conversation context",
    icon: Lightbulb,
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    category: "ai",
    implemented: true,
  },
  {
    id: "auto-complete",
    title: "Auto-Complete",
    description: "Intelligent text completion and suggestion dropdown",
    icon: Zap,
    color: "bg-blue-100 text-blue-800 border-blue-200",
    category: "ai",
    implemented: true,
  },
  {
    id: "intent-recognition",
    title: "Intent Recognition",
    description: "Automatically detect user intent and route conversations",
    icon: Target,
    color: "bg-green-100 text-green-800 border-green-200",
    category: "ai",
    implemented: true,
  },

  // Media & Communication
  {
    id: "file-sharing",
    title: "File Sharing",
    description:
      "Drag & drop file uploads with preview and download capabilities",
    icon: Upload,
    color: "bg-indigo-100 text-indigo-800 border-indigo-200",
    category: "media",
    implemented: true,
  },
  {
    id: "voice-chat",
    title: "Voice Messages",
    description: "Record and send voice messages with transcription",
    icon: Mic,
    color: "bg-pink-100 text-pink-800 border-pink-200",
    category: "media",
    implemented: true,
  },
  {
    id: "screen-share",
    title: "Screen Sharing",
    description: "Share screens for technical support and demonstrations",
    icon: Monitor,
    color: "bg-cyan-100 text-cyan-800 border-cyan-200",
    category: "media",
    implemented: true,
  },
  {
    id: "rich-media",
    title: "Rich Media",
    description: "Support for images, videos, GIFs, and interactive carousels",
    icon: Camera,
    color: "bg-orange-100 text-orange-800 border-orange-200",
    category: "media",
    implemented: true,
  },

  // Analytics & Insights
  {
    id: "real-time-analytics",
    title: "Real-time Analytics",
    description:
      "Live dashboard with response times, satisfaction scores, and trends",
    icon: BarChart3,
    color: "bg-emerald-100 text-emerald-800 border-emerald-200",
    category: "analytics",
    implemented: true,
  },
  {
    id: "sentiment-tracking",
    title: "Sentiment Tracking",
    description:
      "Monitor conversation sentiment distribution and escalation patterns",
    icon: TrendingUp,
    color: "bg-teal-100 text-teal-800 border-teal-200",
    category: "analytics",
    implemented: true,
  },
  {
    id: "topic-analysis",
    title: "Topic Analysis",
    description: "Identify most common topics and conversation patterns",
    icon: Database,
    color: "bg-violet-100 text-violet-800 border-violet-200",
    category: "analytics",
    implemented: true,
  },
  {
    id: "performance-metrics",
    title: "Performance Metrics",
    description:
      "Track resolution rates, escalation rates, and agent performance",
    icon: CheckCircle,
    color: "bg-lime-100 text-lime-800 border-lime-200",
    category: "analytics",
    implemented: true,
  },

  // Customization
  {
    id: "themes",
    title: "Custom Themes",
    description: "Light, dark, and auto themes with custom color schemes",
    icon: Palette,
    color: "bg-rose-100 text-rose-800 border-rose-200",
    category: "customization",
    implemented: true,
  },
  {
    id: "branding",
    title: "Brand Integration",
    description: "Custom avatars, logos, and welcome messages",
    icon: Star,
    color: "bg-amber-100 text-amber-800 border-amber-200",
    category: "customization",
    implemented: true,
  },
  {
    id: "responsive",
    title: "Responsive Design",
    description: "Optimized for desktop, tablet, and mobile devices",
    icon: Smartphone,
    color: "bg-slate-100 text-slate-800 border-slate-200",
    category: "customization",
    implemented: true,
  },
  {
    id: "positioning",
    title: "Flexible Positioning",
    description: "Configurable chat position and sizing options",
    icon: Monitor,
    color: "bg-gray-100 text-gray-800 border-gray-200",
    category: "customization",
    implemented: true,
  },

  // Integration Features
  {
    id: "crm-integration",
    title: "CRM Integration",
    description: "Auto-create tickets and sync with Salesforce, HubSpot, etc.",
    icon: Database,
    color: "bg-blue-100 text-blue-800 border-blue-200",
    category: "integration",
    implemented: true,
  },
  {
    id: "knowledge-base",
    title: "Knowledge Base",
    description: "Search and suggest relevant articles during conversations",
    icon: FileText,
    color: "bg-green-100 text-green-800 border-green-200",
    category: "integration",
    implemented: true,
  },
  {
    id: "multilingual",
    title: "Multi-language",
    description: "Automatic language detection and translation support",
    icon: Globe,
    color: "bg-purple-100 text-purple-800 border-purple-200",
    category: "integration",
    implemented: true,
  },
  {
    id: "security",
    title: "Enterprise Security",
    description: "End-to-end encryption, GDPR compliance, and audit logs",
    icon: Shield,
    color: "bg-red-100 text-red-800 border-red-200",
    category: "integration",
    implemented: true,
  },
];

const categoryInfo = {
  ai: {
    name: "AI-Powered Features",
    icon: Brain,
    description: "Advanced artificial intelligence capabilities",
  },
  media: {
    name: "Rich Media & Communication",
    icon: Camera,
    description: "Advanced communication features",
  },
  analytics: {
    name: "Analytics & Insights",
    icon: BarChart3,
    description: "Real-time performance tracking",
  },
  customization: {
    name: "Customization & Branding",
    icon: Palette,
    description: "Personalization options",
  },
  integration: {
    name: "Enterprise Integration",
    icon: Workflow,
    description: "Business system connections",
  },
};

export default function ChatbotDemo() {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMinimized, setChatMinimized] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showImplementedOnly, setShowImplementedOnly] = useState(false);

  const filteredFeatures = features.filter((feature) => {
    const categoryMatch =
      selectedCategory === "all" || feature.category === selectedCategory;
    const implementedMatch = !showImplementedOnly || feature.implemented;
    return categoryMatch && implementedMatch;
  });

  const implementedCount = features.filter((f) => f.implemented).length;
  const totalCount = features.length;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="p-3 bg-valasys-orange/10 rounded-full">
              <Bot className="w-8 h-8 text-valasys-orange" />
            </div>
            <h1 className="text-3xl font-bold text-valasys-gray-900">
              Next-Generation AI Chatbot
            </h1>
          </div>
          <p className="text-lg text-valasys-gray-600 max-w-3xl mx-auto">
            Experience the future of customer support with our advanced
            AI-powered chatbot featuring sentiment analysis, file sharing, voice
            messages, real-time analytics, and enterprise-grade security.
          </p>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center space-x-4">
            <Badge className="bg-valasys-orange/10 text-valasys-orange border-valasys-orange/20 px-4 py-2">
              <CheckCircle className="w-4 h-4 mr-2" />
              {implementedCount}/{totalCount} Features Implemented
            </Badge>
            <Badge className="bg-green-100 text-green-800 border-green-200 px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2" />
              Production Ready
            </Badge>
          </div>
        </div>

        {/* Demo Controls */}
        <Card className="bg-gradient-to-r from-valasys-orange/5 to-valasys-blue/5 border-valasys-orange/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-valasys-gray-900 mb-2">
                  Interactive Demo
                </h3>
                <p className="text-valasys-gray-600">
                  Try the chatbot with all advanced features enabled. Click to
                  open and explore!
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  onClick={() => setChatOpen(true)}
                  className="bg-valasys-orange hover:bg-valasys-orange/90 text-white px-6 py-3"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Launch Demo
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setChatMinimized(!chatMinimized)}
                  className="border-valasys-orange text-valasys-orange hover:bg-valasys-orange/10"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  {chatMinimized ? "Show" : "Minimize"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feature Categories */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-valasys-gray-900">
              Feature Showcase
            </h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={showImplementedOnly}
                  onCheckedChange={setShowImplementedOnly}
                />
                <span className="text-sm text-valasys-gray-600">
                  Implemented only
                </span>
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-valasys-gray-300 rounded-lg text-sm focus:border-valasys-orange focus:ring-valasys-orange/20"
              >
                <option value="all">All Categories</option>
                {Object.entries(categoryInfo).map(([key, info]) => (
                  <option key={key} value={key}>
                    {info.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              onClick={() => setSelectedCategory("all")}
              className={cn(
                selectedCategory === "all" &&
                  "bg-valasys-orange hover:bg-valasys-orange/90",
              )}
            >
              All Features ({features.length})
            </Button>
            {Object.entries(categoryInfo).map(([key, info]) => {
              const Icon = info.icon;
              const count = features.filter((f) => f.category === key).length;
              return (
                <Button
                  key={key}
                  variant={selectedCategory === key ? "default" : "outline"}
                  onClick={() => setSelectedCategory(key)}
                  className={cn(
                    selectedCategory === key &&
                      "bg-valasys-orange hover:bg-valasys-orange/90",
                  )}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {info.name} ({count})
                </Button>
              );
            })}
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={feature.id}
                  className={cn(
                    "transition-all duration-200 hover:shadow-lg border-2",
                    feature.implemented
                      ? "border-green-200 bg-green-50/30 hover:border-green-300"
                      : "border-yellow-200 bg-yellow-50/30 hover:border-yellow-300",
                  )}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div
                        className={cn(
                          "p-2 rounded-lg",
                          feature.color.split(" ")[0] +
                            " " +
                            feature.color.split(" ")[2],
                        )}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <Badge
                        className={cn(
                          feature.implemented
                            ? "bg-green-100 text-green-800 border-green-200"
                            : "bg-yellow-100 text-yellow-800 border-yellow-200",
                        )}
                      >
                        {feature.implemented ? "✓ Ready" : "🚧 Coming Soon"}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-valasys-gray-600 leading-relaxed">
                      {feature.description}
                    </p>

                    {/* Feature Demo Buttons */}
                    {feature.implemented && (
                      <div className="mt-4 flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => setChatOpen(true)}
                          className="bg-valasys-orange/10 text-valasys-orange hover:bg-valasys-orange/20 border-valasys-orange/30"
                        >
                          <Play className="w-3 h-3 mr-1" />
                          Try Now
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-valasys-gray-600 hover:text-valasys-orange"
                        >
                          <FileText className="w-3 h-3 mr-1" />
                          Docs
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Technical Specifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="w-5 h-5 mr-2 text-valasys-orange" />
              Technical Specifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <h4 className="font-semibold text-valasys-gray-900">
                  Performance
                </h4>
                <ul className="text-sm text-valasys-gray-600 space-y-1">
                  <li>• Sub-100ms response time</li>
                  <li>• 99.9% uptime SLA</li>
                  <li>• Real-time message delivery</li>
                  <li>• Auto-scaling architecture</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-valasys-gray-900">
                  AI Capabilities
                </h4>
                <ul className="text-sm text-valasys-gray-600 space-y-1">
                  <li>• 95%+ sentiment accuracy</li>
                  <li>• 50+ language support</li>
                  <li>• Intent recognition</li>
                  <li>• Contextual responses</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-valasys-gray-900">
                  File Support
                </h4>
                <ul className="text-sm text-valasys-gray-600 space-y-1">
                  <li>• 50MB max file size</li>
                  <li>• Image, video, document</li>
                  <li>• Drag & drop upload</li>
                  <li>• Virus scanning included</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-valasys-gray-900">
                  Security
                </h4>
                <ul className="text-sm text-valasys-gray-600 space-y-1">
                  <li>• End-to-end encryption</li>
                  <li>• GDPR & SOC2 compliant</li>
                  <li>• Role-based access</li>
                  <li>• Audit logging</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-valasys-orange to-valasys-blue text-white">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Transform Your Customer Support?
            </h3>
            <p className="text-lg mb-6 opacity-90">
              Deploy our next-generation AI chatbot and provide exceptional
              customer experiences.
            </p>
            <div className="flex items-center justify-center space-x-4">
              <Button
                size="lg"
                className="bg-white text-valasys-orange hover:bg-gray-100"
                onClick={() => setChatOpen(true)}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Start Demo
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                <HeadphonesIcon className="w-5 h-5 mr-2" />
                Contact Sales
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Next-Generation Chatbot Component */}
      <NextGenChatbot
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        isMinimized={chatMinimized}
        onMinimize={() => {
          if (chatMinimized) {
            setChatMinimized(false);
            setChatOpen(true);
          } else {
            setChatMinimized(true);
            setChatOpen(false);
          }
        }}
        aiFeatures={{
          sentimentAnalysis: true,
          smartSuggestions: true,
          autoComplete: true,
          languageDetection: true,
          spamDetection: true,
          intentRecognition: true,
        }}
        customization={{
          theme: "auto",
          primaryColor: "#FF6A00",
          accentColor: "#1A73E8",
          avatarUrl:
            "https://cdn.builder.io/api/v1/image/assets%2Ff3bdb2b3468a43dab6822ea1b300bbfe%2F25e73af1f3994e1ea6cd003e93f48d22?format=webp&width=800",
          welcomeMessage:
            "Welcome to the VAIS Next-Gen Chatbot Demo! 🚀\n\nI'm powered by advanced AI with sentiment analysis, smart suggestions, file sharing, voice messages, and real-time analytics. Try asking me about any Valasys feature or upload a file to test the capabilities!",
          sounds: true,
          animations: true,
          position: "bottom-right",
        }}
        enableAnalytics={true}
        enableFileSharing={true}
        enableVoiceChat={true}
        enableScreenShare={true}
        maxFileSize={50}
      />
    </DashboardLayout>
  );
}
