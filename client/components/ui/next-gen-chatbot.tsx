import * as React from "react";
import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Send,
  MessageCircle,
  X,
  User,
  Bot,
  Clock,
  CheckCheck,
  Minimize2,
  Maximize2,
  Star,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Paperclip,
  Image,
  Video,
  FileText,
  Download,
  Search,
  Zap,
  Brain,
  Sparkles,
  TrendingUp,
  BarChart3,
  Settings,
  Mic,
  MicOff,
  Camera,
  Link,
  Copy,
  Share,
  MoreVertical,
  AlertTriangle,
  SmileIcon,
  Frown,
  Upload,
  ExternalLink,
  Meh,
  Lightbulb,
  Mail,
  BookOpen,
  HeadphonesIcon,
  Users,
  Globe,
  Shield,
  Workflow,
  Database,
  ChevronDown,
  ChevronUp,
  Filter,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  Palette,
  Moon,
  Sun,
  Monitor,
  Smartphone,
  Laptop,
  Tablet,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Enhanced interfaces
export interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "agent" | "system";
  timestamp: Date;
  status?: "sending" | "sent" | "delivered" | "read";
  messageType?:
    | "text"
    | "file"
    | "image"
    | "video"
    | "quick_reply"
    | "carousel"
    | "system"
    | "suggestion";
  sentiment?: "positive" | "neutral" | "negative";
  confidence?: number;
  metadata?: {
    fileUrl?: string;
    fileName?: string;
    fileSize?: number;
    fileType?: string;
    thumbnailUrl?: string;
    suggestions?: string[];
    relatedArticles?: Array<{ title: string; url: string }>;
    escalationRequired?: boolean;
    priority?: "low" | "medium" | "high" | "urgent";
  };
}

interface ChatAnalytics {
  messagesCount: number;
  averageResponseTime: number;
  satisfactionScore: number;
  topTopics: string[];
  sentimentDistribution: {
    positive: number;
    neutral: number;
    negative: number;
  };
  escalationRate: number;
  resolutionRate: number;
}

interface AIFeatures {
  sentimentAnalysis: boolean;
  smartSuggestions: boolean;
  autoComplete: boolean;
  languageDetection: boolean;
  spamDetection: boolean;
  intentRecognition: boolean;
}

interface Customization {
  theme: "light" | "dark" | "auto";
  primaryColor: string;
  accentColor: string;
  avatarUrl: string;
  companyLogo: string;
  welcomeMessage: string;
  sounds: boolean;
  animations: boolean;
  position: "bottom-right" | "bottom-left" | "center";
}

interface NextGenChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  isMinimized?: boolean;
  onMinimize?: () => void;
  aiFeatures?: Partial<AIFeatures>;
  customization?: Partial<Customization>;
  enableAnalytics?: boolean;
  enableFileSharing?: boolean;
  enableVoiceChat?: boolean;
  enableScreenShare?: boolean;
  maxFileSize?: number; // in MB
}

// Mock AI sentiment analysis
const analyzeSentiment = (
  text: string,
): { sentiment: "positive" | "neutral" | "negative"; confidence: number } => {
  const positiveWords = [
    "great",
    "excellent",
    "amazing",
    "wonderful",
    "fantastic",
    "love",
    "perfect",
    "awesome",
    "brilliant",
  ];
  const negativeWords = [
    "terrible",
    "awful",
    "hate",
    "horrible",
    "worst",
    "disgusting",
    "useless",
    "broken",
    "frustrated",
  ];

  const words = text.toLowerCase().split(/\s+/);
  let positiveScore = 0;
  let negativeScore = 0;

  words.forEach((word) => {
    if (positiveWords.some((pw) => word.includes(pw))) positiveScore++;
    if (negativeWords.some((nw) => word.includes(nw))) negativeScore++;
  });

  if (positiveScore > negativeScore) {
    return {
      sentiment: "positive",
      confidence: Math.min(0.95, 0.6 + positiveScore * 0.1),
    };
  } else if (negativeScore > positiveScore) {
    return {
      sentiment: "negative",
      confidence: Math.min(0.95, 0.6 + negativeScore * 0.1),
    };
  }

  return { sentiment: "neutral", confidence: 0.7 };
};

// Smart suggestions based on context
const generateSuggestions = (
  currentText: string,
  conversationHistory: ChatMessage[],
): string[] => {
  const suggestions = [
    "How do I export prospects?",
    "What is VAIS scoring?",
    "Help with billing",
    "Integration setup",
    "Talk to human agent",
    "Schedule a demo",
    "Download documentation",
    "Check my account status",
  ];

  // Filter suggestions based on current input
  if (currentText.length > 2) {
    return suggestions
      .filter((s) => s.toLowerCase().includes(currentText.toLowerCase()))
      .slice(0, 4);
  }

  return suggestions.slice(0, 4);
};

// Knowledge base articles
const knowledgeBase = [
  {
    title: "Getting Started with VAIS",
    url: "/help/vais-intro",
    category: "basics",
  },
  {
    title: "Export Prospects Guide",
    url: "/help/export-prospects",
    category: "features",
  },
  { title: "Billing & Credits FAQ", url: "/help/billing", category: "billing" },
  { title: "API Integration", url: "/help/api", category: "integration" },
  {
    title: "Data Quality Standards",
    url: "/help/data-quality",
    category: "data",
  },
];

export function NextGenChatbot({
  isOpen,
  onClose,
  isMinimized = false,
  onMinimize,
  aiFeatures = {},
  customization = {},
  enableAnalytics = true,
  enableFileSharing = true,
  enableVoiceChat = true,
  enableScreenShare = false,
  maxFileSize = 10,
}: NextGenChatbotProps) {
  // Core state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [currentStep, setCurrentStep] = useState<"greeting" | "conversation">(
    "greeting",
  );

  // AI features state
  const [sentiment, setSentiment] = useState<
    "positive" | "neutral" | "negative"
  >("neutral");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [autoSuggestions, setAutoSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // UI state
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Agent state
  const [agentStatus, setAgentStatus] = useState<"online" | "away" | "busy">(
    "online",
  );
  const [agentTyping, setAgentTyping] = useState(false);
  const [lastSeen, setLastSeen] = useState<Date>(new Date());

  // Analytics state
  const [analytics, setAnalytics] = useState<ChatAnalytics>({
    messagesCount: 0,
    averageResponseTime: 2.3,
    satisfactionScore: 4.7,
    topTopics: ["Export", "VAIS", "Billing", "Integration"],
    sentimentDistribution: { positive: 68, neutral: 25, negative: 7 },
    escalationRate: 3.2,
    resolutionRate: 94.5,
  });

  // Refs
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Default configuration
  const defaultAIFeatures: AIFeatures = {
    sentimentAnalysis: true,
    smartSuggestions: true,
    autoComplete: true,
    languageDetection: true,
    spamDetection: true,
    intentRecognition: true,
    ...aiFeatures,
  };

  const defaultCustomization: Customization = {
    theme: "auto",
    primaryColor: "#FF6A00",
    accentColor: "#1A73E8",
    avatarUrl:
      "https://cdn.builder.io/api/v1/image/assets%2Ff3bdb2b3468a43dab6822ea1b300bbfe%2F25e73af1f3994e1ea6cd003e93f48d22?format=webp&width=800",
    companyLogo: "",
    welcomeMessage:
      "Hi! I'm VAIS, your AI assistant. How can I help you today?",
    sounds: true,
    animations: true,
    position: "bottom-right",
    ...customization,
  };

  // Initialize chat
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: "welcome",
        content: defaultCustomization.welcomeMessage,
        sender: "agent",
        timestamp: new Date(),
        status: "read",
        messageType: "suggestion",
        metadata: {
          suggestions: [
            "Ideal Customer Profile (ICP)",
            "Account Based Marketing (ABM)",
            "Look-a-Likes (LAL)",
            "Prospects",
            "Data Downloads",
            "Payments and Credits",
            "Raise a ticket",
          ],
        },
      };
      setMessages([welcomeMessage]);
      setCurrentStep("conversation");
    }
  }, [isOpen, messages.length, defaultCustomization.welcomeMessage]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isMinimized]);

  // Generate auto-suggestions
  useEffect(() => {
    if (defaultAIFeatures.autoComplete && newMessage.length > 1) {
      const newSuggestions = generateSuggestions(newMessage, messages);
      setAutoSuggestions(newSuggestions);
      setShowSuggestions(newSuggestions.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [newMessage, messages, defaultAIFeatures.autoComplete]);

  // Simulate agent response with AI features
  const simulateAgentResponse = useCallback(
    (userMessage?: string) => {
      setAgentTyping(true);
      setIsTyping(true);

      // Analyze user sentiment if available
      if (userMessage && defaultAIFeatures.sentimentAnalysis) {
        const analysis = analyzeSentiment(userMessage);
        setSentiment(analysis.sentiment);
      }

      setTimeout(
        () => {
          const responses = [
            "I understand your question. Let me help you with that.",
            "That's a great point! Here's what I recommend...",
            "I can definitely assist you with this. Let me walk you through the process.",
            "Thanks for asking! This is a common question, and I'm happy to explain.",
            "I've analyzed your request and here's the best solution...",
          ];

          // Add related articles suggestion
          const relatedArticles = knowledgeBase
            .filter((article) =>
              userMessage?.toLowerCase().includes(article.category),
            )
            .slice(0, 2);

          const agentMessage: ChatMessage = {
            id: Date.now().toString(),
            content: responses[Math.floor(Math.random() * responses.length)],
            sender: "agent",
            timestamp: new Date(),
            status: "read",
            messageType: relatedArticles.length > 0 ? "suggestion" : "text",
            metadata: {
              relatedArticles:
                relatedArticles.length > 0 ? relatedArticles : undefined,
              suggestions: [
                "Tell me more",
                "Show examples",
                "Schedule demo",
                "Contact human agent",
              ],
            },
          };

          setMessages((prev) =>
            prev
              .map((msg) =>
                msg.sender === "user" && msg.status === "sending"
                  ? { ...msg, status: "read" as const }
                  : msg,
              )
              .concat(agentMessage),
          );

          setIsTyping(false);
          setAgentTyping(false);

          // Update analytics
          if (enableAnalytics) {
            setAnalytics((prev) => ({
              ...prev,
              messagesCount: prev.messagesCount + 1,
            }));
          }
        },
        1500 + Math.random() * 2000,
      );
    },
    [defaultAIFeatures.sentimentAnalysis, enableAnalytics],
  );

  // Handle message sending
  const handleSendMessage = useCallback(
    (messageText?: string) => {
      const text = messageText || newMessage.trim();
      if (!text) return;

      // Sentiment analysis
      const analysis = defaultAIFeatures.sentimentAnalysis
        ? analyzeSentiment(text)
        : null;

      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        content: text,
        sender: "user",
        timestamp: new Date(),
        status: "sending",
        sentiment: analysis?.sentiment,
        confidence: analysis?.confidence,
        metadata: {
          escalationRequired:
            analysis?.sentiment === "negative" && analysis?.confidence > 0.8,
        },
      };

      setMessages((prev) => [...prev, userMessage]);
      setNewMessage("");
      setShowSuggestions(false);

      // Simulate message delivery
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === userMessage.id ? { ...msg, status: "delivered" as const } : msg,
          ),
        );
      }, 500);

      // Trigger agent response
      simulateAgentResponse(text);
    },
    [newMessage, defaultAIFeatures.sentimentAnalysis, simulateAgentResponse],
  );

  // File upload handler
  const handleFileUpload = useCallback(
    async (files: FileList | null) => {
      if (!files || !enableFileSharing) return;

      const file = files[0];
      if (file.size > maxFileSize * 1024 * 1024) {
        // Show error message
        const errorMessage: ChatMessage = {
          id: Date.now().toString(),
          content: `File size exceeds ${maxFileSize}MB limit. Please choose a smaller file.`,
          sender: "system",
          timestamp: new Date(),
          status: "read",
          messageType: "system",
        };
        setMessages((prev) => [...prev, errorMessage]);
        return;
      }

      setIsUploading(true);
      setUploadProgress(0);

      // Simulate upload progress
      const uploadInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(uploadInterval);
            setIsUploading(false);

            // Add file message
            const fileMessage: ChatMessage = {
              id: Date.now().toString(),
              content: `Uploaded: ${file.name}`,
              sender: "user",
              timestamp: new Date(),
              status: "read",
              messageType: "file",
              metadata: {
                fileName: file.name,
                fileSize: file.size,
                fileType: file.type,
                fileUrl: URL.createObjectURL(file),
              },
            };

            setMessages((prev) => [...prev, fileMessage]);
            simulateAgentResponse(`User uploaded file: ${file.name}`);

            return 0;
          }
          return prev + 10;
        });
      }, 100);
    },
    [enableFileSharing, maxFileSize, simulateAgentResponse],
  );

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      handleFileUpload(e.dataTransfer.files);
    },
    [handleFileUpload],
  );

  // Voice recording (simulated)
  const toggleRecording = useCallback(() => {
    setIsRecording(!isRecording);

    if (!isRecording) {
      // Start recording simulation
      setTimeout(() => {
        setIsRecording(false);
        handleSendMessage("Voice message: Can you help me with VAIS setup?");
      }, 3000);
    }
  }, [isRecording, handleSendMessage]);

  // Utility functions
  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return <SmileIcon className="w-4 h-4 text-green-500" />;
      case "negative":
        return <Frown className="w-4 h-4 text-red-500" />;
      default:
        return <Meh className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: typeof agentStatus) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "away":
        return "bg-yellow-500";
      case "busy":
        return "bg-red-500";
      default:
        return "bg-gray-400";
    }
  };

  const getMessageStatus = (status?: ChatMessage["status"]) => {
    switch (status) {
      case "sending":
        return <Clock className="w-3 h-3 text-gray-400" />;
      case "sent":
        return <CheckCheck className="w-3 h-3 text-gray-400" />;
      case "delivered":
        return <CheckCheck className="w-3 h-3 text-blue-500" />;
      case "read":
        return <CheckCheck className="w-3 h-3 text-green-500" />;
      default:
        return null;
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("en", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Minimized state with enhanced design
  if (isMinimized) {
    return (
      <div
        className={cn(
          "fixed z-50 transition-all duration-300",
          defaultCustomization.position === "bottom-right" &&
            "bottom-6 right-6",
          defaultCustomization.position === "bottom-left" && "bottom-6 left-6",
          defaultCustomization.position === "center" &&
            "bottom-1/2 right-1/2 transform translate-x-1/2 translate-y-1/2",
        )}
      >
        <div className="relative group">
          {/* Main Avatar Button */}
          <Button
            onClick={onMinimize}
            className="h-16 w-16 rounded-full p-0 bg-white hover:bg-gray-50 shadow-2xl border-2 border-valasys-orange/20 hover:border-valasys-orange/40 transition-all duration-300 hover:scale-110 group-hover:shadow-valasys-orange/20"
          >
            <div className="relative">
              <img
                src={defaultCustomization.avatarUrl}
                alt="VAIS Assistant"
                className="w-12 h-12 rounded-full object-cover"
              />
              {/* Pulsing animation for new messages */}
              {messages.filter(
                (m) => m.sender === "agent" && !m.id.includes("welcome"),
              ).length > 0 && (
                <div className="absolute inset-0 w-12 h-12 rounded-full bg-valasys-orange/20 animate-ping"></div>
              )}
            </div>
          </Button>

          {/* Notification Badge with Count */}
          {messages.filter(
            (m) => m.sender === "agent" && !m.id.includes("welcome"),
          ).length > 0 && (
            <Badge className="absolute -top-1 -right-1 bg-red-500 text-white animate-bounce h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs font-bold border-2 border-white shadow-lg">
              {Math.min(
                messages.filter(
                  (m) => m.sender === "agent" && !m.id.includes("welcome"),
                ).length,
                9,
              )}
            </Badge>
          )}

          {/* Status Indicators */}
          <div
            className={cn(
              "absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white shadow-sm transition-colors",
              getStatusColor(agentStatus),
            )}
          ></div>

          {/* Agent Typing Indicator */}
          {agentTyping && (
            <div className="absolute -top-2 -left-2 bg-valasys-orange text-white text-xs px-2 py-1 rounded-full animate-pulse">
              <div className="flex items-center space-x-1">
                <div
                  className="w-1 h-1 bg-white rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-1 h-1 bg-white rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-1 h-1 bg-white rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
            </div>
          )}

          {/* Floating Tooltip */}
          <div className="absolute -top-14 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
              Chat with VAIS Assistant
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>

          {/* Quick Actions Ring (on hover) */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="relative w-16 h-16">
              <Button
                size="sm"
                className="absolute -top-8 left-1/2 transform -translate-x-1/2 h-8 w-8 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg pointer-events-auto"
                onClick={(e) => {
                  e.stopPropagation();
                  // Quick call action
                }}
              >
                <HeadphonesIcon className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                className="absolute -right-8 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg pointer-events-auto"
                onClick={(e) => {
                  e.stopPropagation();
                  // Quick help action
                }}
              >
                <Lightbulb className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main chat interface
  return (
    <TooltipProvider>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent
          className={cn(
            "p-0 gap-0 flex flex-col transition-all duration-300",
            isExpanded ? "max-w-4xl h-[80vh]" : "max-w-lg h-[700px]",
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {/* Drag Overlay */}
          {isDragOver && (
            <div className="absolute inset-0 bg-valasys-orange/10 border-2 border-dashed border-valasys-orange rounded-lg flex items-center justify-center z-50">
              <div className="text-center">
                <Upload className="w-12 h-12 mx-auto mb-2 text-valasys-orange" />
                <p className="text-valasys-orange font-medium">
                  Drop files here to upload
                </p>
              </div>
            </div>
          )}

          {/* Enhanced Header */}
          <DialogHeader className="p-4 border-b bg-gradient-to-r from-valasys-orange via-valasys-orange-light to-valasys-blue text-white relative overflow-hidden">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent transform -skew-x-12 animate-pulse"></div>
            </div>

            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12 border-2 border-white/20 shadow-lg">
                  <AvatarImage
                    src={defaultCustomization.avatarUrl}
                    alt="VAIS Assistant"
                  />
                  <AvatarFallback className="bg-white/20 text-white font-bold">
                    VA
                  </AvatarFallback>
                </Avatar>
                <div>
                  <DialogTitle className="text-white text-lg font-bold flex items-center">
                    🧠 Chat Support
                    {defaultAIFeatures.sentimentAnalysis && (
                      <Badge className="ml-2 bg-white/20 text-white border-white/30">
                        <Brain className="w-3 h-3 mr-1" />
                        AI
                      </Badge>
                    )}
                  </DialogTitle>
                  <div className="flex items-center space-x-3 text-sm">
                    <span className="text-white/90">
                      Valasys Support Assistant
                    </span>
                    <div className="flex items-center space-x-1">
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full",
                          getStatusColor(agentStatus),
                        )}
                      />
                      <span className="text-white/90 capitalize">
                        {agentStatus}
                      </span>
                    </div>
                    {agentTyping && (
                      <div className="flex items-center space-x-1 text-white/80">
                        <div className="flex space-x-1">
                          <div
                            className="w-1 h-1 bg-white rounded-full animate-bounce"
                            style={{ animationDelay: "0ms" }}
                          ></div>
                          <div
                            className="w-1 h-1 bg-white rounded-full animate-bounce"
                            style={{ animationDelay: "150ms" }}
                          ></div>
                          <div
                            className="w-1 h-1 bg-white rounded-full animate-bounce"
                            style={{ animationDelay: "300ms" }}
                          ></div>
                        </div>
                        <span className="text-xs">typing...</span>
                      </div>
                    )}
                    <span className="text-white/70 text-xs">
                      Last seen {formatTime(lastSeen)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {/* Analytics Toggle */}
                {enableAnalytics && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAnalytics(!showAnalytics)}
                        className="text-white hover:bg-white/20 h-8 w-8 p-0"
                      >
                        <BarChart3 className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>View Analytics</p>
                    </TooltipContent>
                  </Tooltip>
                )}

                {/* Expand/Collapse */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="text-white hover:bg-white/20 h-8 w-8 p-0"
                    >
                      {isExpanded ? (
                        <Minimize2 className="w-4 h-4" />
                      ) : (
                        <Maximize2 className="w-4 h-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isExpanded ? "Minimize" : "Expand"}</p>
                  </TooltipContent>
                </Tooltip>

                {/* Settings */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowSettings(!showSettings)}
                      className="text-white hover:bg-white/20 h-8 w-8 p-0"
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Settings</p>
                  </TooltipContent>
                </Tooltip>

                {/* Minimize */}
                {onMinimize && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={onMinimize}
                        className="text-white hover:bg-white/20 h-8 w-8 p-0"
                      >
                        <Minimize2 className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Minimize</p>
                    </TooltipContent>
                  </Tooltip>
                )}

                {/* Close */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onClose}
                      className="text-white hover:bg-white/20 h-8 w-8 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Close</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>

            {/* AI Features Indicator */}
            {(defaultAIFeatures.sentimentAnalysis ||
              defaultAIFeatures.smartSuggestions) && (
              <div className="mt-2 flex items-center space-x-4 text-xs text-white/80">
                {defaultAIFeatures.sentimentAnalysis && (
                  <div className="flex items-center space-x-1">
                    {getSentimentIcon(sentiment)}
                    <span>Sentiment: {sentiment}</span>
                  </div>
                )}
                {defaultAIFeatures.smartSuggestions && (
                  <div className="flex items-center space-x-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Smart suggestions enabled</span>
                  </div>
                )}
              </div>
            )}
          </DialogHeader>

          <div className="flex flex-1 min-h-0">
            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col min-w-0">
              {/* Messages */}
              <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex items-start space-x-2 group",
                        message.sender === "user"
                          ? "justify-end"
                          : "justify-start",
                      )}
                    >
                      {message.sender !== "user" && (
                        <Avatar className="h-8 w-8 flex-shrink-0">
                          <AvatarImage
                            src={defaultCustomization.avatarUrl}
                            alt="VAIS Assistant"
                          />
                          <AvatarFallback className="bg-valasys-orange text-white text-xs">
                            {message.sender === "system" ? (
                              <AlertTriangle className="w-4 h-4" />
                            ) : (
                              <Bot className="w-4 h-4" />
                            )}
                          </AvatarFallback>
                        </Avatar>
                      )}

                      <div
                        className={cn(
                          "max-w-[75%] space-y-1 flex-1",
                          message.sender === "user"
                            ? "items-end"
                            : "items-start",
                        )}
                      >
                        {/* Message Bubble */}
                        <div
                          className={cn(
                            "rounded-lg px-4 py-2 text-sm relative",
                            message.sender === "user"
                              ? "bg-valasys-orange text-white"
                              : message.sender === "system"
                                ? "bg-yellow-50 text-yellow-800 border border-yellow-200"
                                : "bg-gray-100 text-gray-900",
                          )}
                        >
                          {/* File Message */}
                          {message.messageType === "file" &&
                            message.metadata?.fileUrl && (
                              <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                  <FileText className="w-4 h-4" />
                                  <span className="font-medium">
                                    {message.metadata.fileName}
                                  </span>
                                </div>
                                <div className="text-xs opacity-75">
                                  {formatFileSize(
                                    message.metadata.fileSize || 0,
                                  )}
                                </div>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 text-xs"
                                  onClick={() =>
                                    window.open(message.metadata?.fileUrl)
                                  }
                                >
                                  <Download className="w-3 h-3 mr-1" />
                                  Download
                                </Button>
                              </div>
                            )}

                          {/* Regular Text Message */}
                          {message.messageType === "text" && (
                            <div className="whitespace-pre-wrap">
                              {message.content}
                            </div>
                          )}

                          {/* Suggestion Message */}
                          {message.messageType === "suggestion" && (
                            <div className="space-y-3">
                              <div className="whitespace-pre-wrap">
                                {message.content}
                              </div>

                              {/* Quick Suggestions */}
                              {message.metadata?.suggestions && (
                                <div className="flex flex-wrap gap-1">
                                  {message.metadata.suggestions.map(
                                    (suggestion, index) => (
                                      <Button
                                        key={index}
                                        size="sm"
                                        variant="outline"
                                        className="h-6 text-xs bg-white/10 border-white/20 text-current hover:bg-white/20"
                                        onClick={() =>
                                          handleSendMessage(suggestion)
                                        }
                                      >
                                        {suggestion}
                                      </Button>
                                    ),
                                  )}
                                </div>
                              )}

                              {/* Related Articles */}
                              {message.metadata?.relatedArticles && (
                                <div className="space-y-2 pt-2 border-t border-white/20">
                                  <div className="text-xs opacity-75 flex items-center">
                                    <BookOpen className="w-3 h-3 mr-1" />
                                    Related articles:
                                  </div>
                                  {message.metadata.relatedArticles.map(
                                    (article, index) => (
                                      <Button
                                        key={index}
                                        size="sm"
                                        variant="ghost"
                                        className="h-auto p-2 text-left justify-start bg-white/10 hover:bg-white/20 w-full"
                                        onClick={() => window.open(article.url)}
                                      >
                                        <div>
                                          <div className="text-xs font-medium">
                                            {article.title}
                                          </div>
                                        </div>
                                        <ExternalLink className="w-3 h-3 ml-auto" />
                                      </Button>
                                    ),
                                  )}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Sentiment indicator */}
                          {message.sentiment &&
                            defaultAIFeatures.sentimentAnalysis && (
                              <div className="absolute -top-1 -right-1">
                                {getSentimentIcon(message.sentiment)}
                              </div>
                            )}
                        </div>

                        {/* Message Footer */}
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{formatTime(message.timestamp)}</span>
                          <div className="flex items-center space-x-2">
                            {message.sender === "user" &&
                              getMessageStatus(message.status)}
                            {message.metadata?.escalationRequired && (
                              <Tooltip>
                                <TooltipTrigger>
                                  <AlertTriangle className="w-3 h-3 text-red-500" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Escalation suggested</p>
                                </TooltipContent>
                              </Tooltip>
                            )}

                            {/* Message Actions */}
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-4 w-4 p-0 hover:bg-gray-200"
                                onClick={() =>
                                  navigator.clipboard.writeText(message.content)
                                }
                              >
                                <Copy className="w-2 h-2" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-4 w-4 p-0 hover:bg-gray-200"
                              >
                                <MoreVertical className="w-2 h-2" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {message.sender === "user" && (
                        <Avatar className="h-8 w-8 flex-shrink-0">
                          <AvatarFallback className="bg-valasys-blue text-white text-xs">
                            <User className="w-4 h-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex items-start space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={defaultCustomization.avatarUrl}
                          alt="VAIS Assistant"
                        />
                        <AvatarFallback className="bg-valasys-orange text-white text-xs">
                          <Bot className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-gray-100 rounded-lg px-4 py-2 shadow-sm">
                        <div className="flex space-x-1">
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0ms" }}
                          />
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "150ms" }}
                          />
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "300ms" }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Auto-suggestions Dropdown */}
              {showSuggestions && autoSuggestions.length > 0 && (
                <div className="mx-4 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-32 overflow-y-auto">
                  {autoSuggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="w-full justify-start text-left h-auto py-2 px-3 hover:bg-gray-50"
                      onClick={() => {
                        setNewMessage(suggestion);
                        setShowSuggestions(false);
                        setTimeout(() => handleSendMessage(suggestion), 100);
                      }}
                    >
                      <Lightbulb className="w-3 h-3 mr-2 text-valasys-orange" />
                      {suggestion}
                    </Button>
                  ))}
                </div>
              )}

              {/* Upload Progress */}
              {isUploading && (
                <div className="mx-4 mb-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Upload className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-blue-700">
                      Uploading file...
                    </span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}

              {/* Enhanced Input Area */}
              <div className="p-4 border-t bg-white space-y-3">
                {/* File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                  multiple={false}
                  accept="image/*,video/*,.pdf,.doc,.docx,.txt"
                />

                {/* Quick Actions Bar */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {enableFileSharing && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => fileInputRef.current?.click()}
                            className="h-8 w-8 p-0 hover:bg-gray-100"
                          >
                            <Paperclip className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Attach file (max {maxFileSize}MB)</p>
                        </TooltipContent>
                      </Tooltip>
                    )}

                    {enableVoiceChat && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={toggleRecording}
                            className={cn(
                              "h-8 w-8 p-0 hover:bg-gray-100",
                              isRecording && "bg-red-100 text-red-600",
                            )}
                          >
                            {isRecording ? (
                              <MicOff className="w-4 h-4" />
                            ) : (
                              <Mic className="w-4 h-4" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            {isRecording ? "Stop recording" : "Voice message"}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    )}

                    {enableScreenShare && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 hover:bg-gray-100"
                          >
                            <Monitor className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Screen share</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>

                  {/* AI Features Indicators */}
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    {defaultAIFeatures.sentimentAnalysis && (
                      <div className="flex items-center space-x-1">
                        <Brain className="w-3 h-3" />
                        <span>AI</span>
                      </div>
                    )}
                    {isRecording && (
                      <div className="flex items-center space-x-1 text-red-500">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        <span>Recording...</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Message Input */}
                <div className="flex items-end space-x-2">
                  <div className="flex-1 relative">
                    <Textarea
                      ref={textareaRef}
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message... (Shift+Enter for new line)"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      className="min-h-[40px] max-h-32 resize-none border-gray-300 focus:border-valasys-orange focus:ring-valasys-orange/20 pr-10"
                      rows={1}
                    />

                    {/* Character count */}
                    {newMessage.length > 100 && (
                      <div className="absolute bottom-1 right-1 text-xs text-gray-400">
                        {newMessage.length}/500
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={() => handleSendMessage()}
                    disabled={!newMessage.trim() || isTyping || isRecording}
                    className="bg-valasys-orange hover:bg-valasys-orange/90 h-10 w-10 p-0 flex-shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>

                {/* Footer Info */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <Shield className="w-3 h-3 mr-1" />
                      End-to-end encrypted
                    </span>
                    {enableAnalytics && (
                      <span className="flex items-center">
                        <Eye className="w-3 h-3 mr-1" />
                        Analytics enabled
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="flex items-center">
                      <HeadphonesIcon className="w-3 h-3 mr-1" />
                      +1 (555) 123-4567
                    </span>
                    <span className="flex items-center">
                      <Mail className="w-3 h-3 mr-1" />
                      support@valasys.com
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar - Analytics/Settings */}
            {(showAnalytics || showSettings) && isExpanded && (
              <div className="w-80 border-l bg-gray-50 flex flex-col">
                {showAnalytics && (
                  <div className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">Analytics</h3>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setShowAnalytics(false)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Analytics Dashboard */}
                    <div className="space-y-3">
                      <div className="bg-white p-3 rounded-lg border">
                        <div className="text-sm text-gray-600">Messages</div>
                        <div className="text-2xl font-bold text-gray-900">
                          {analytics.messagesCount}
                        </div>
                      </div>

                      <div className="bg-white p-3 rounded-lg border">
                        <div className="text-sm text-gray-600">
                          Avg Response Time
                        </div>
                        <div className="text-2xl font-bold text-gray-900">
                          {analytics.averageResponseTime}s
                        </div>
                      </div>

                      <div className="bg-white p-3 rounded-lg border">
                        <div className="text-sm text-gray-600 mb-2">
                          Satisfaction Score
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="text-2xl font-bold text-gray-900">
                            {analytics.satisfactionScore}
                          </div>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={cn(
                                  "w-4 h-4",
                                  star <=
                                    Math.floor(analytics.satisfactionScore)
                                    ? "text-yellow-500 fill-yellow-500"
                                    : "text-gray-300",
                                )}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-3 rounded-lg border">
                        <div className="text-sm text-gray-600 mb-2">
                          Sentiment Distribution
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs flex items-center">
                              <SmileIcon className="w-3 h-3 mr-1 text-green-500" />
                              Positive
                            </span>
                            <span className="text-xs font-medium">
                              {analytics.sentimentDistribution.positive}%
                            </span>
                          </div>
                          <Progress
                            value={analytics.sentimentDistribution.positive}
                            className="h-1"
                          />

                          <div className="flex items-center justify-between">
                            <span className="text-xs flex items-center">
                              <Meh className="w-3 h-3 mr-1 text-gray-500" />
                              Neutral
                            </span>
                            <span className="text-xs font-medium">
                              {analytics.sentimentDistribution.neutral}%
                            </span>
                          </div>
                          <Progress
                            value={analytics.sentimentDistribution.neutral}
                            className="h-1"
                          />

                          <div className="flex items-center justify-between">
                            <span className="text-xs flex items-center">
                              <Frown className="w-3 h-3 mr-1 text-red-500" />
                              Negative
                            </span>
                            <span className="text-xs font-medium">
                              {analytics.sentimentDistribution.negative}%
                            </span>
                          </div>
                          <Progress
                            value={analytics.sentimentDistribution.negative}
                            className="h-1"
                          />
                        </div>
                      </div>

                      <div className="bg-white p-3 rounded-lg border">
                        <div className="text-sm text-gray-600 mb-2">
                          Top Topics
                        </div>
                        <div className="space-y-1">
                          {analytics.topTopics.map((topic, index) => (
                            <div
                              key={index}
                              className="text-xs flex items-center justify-between"
                            >
                              <span>{topic}</span>
                              <Badge variant="secondary" className="text-xs">
                                {Math.floor(Math.random() * 20) + 5}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {showSettings && (
                  <div className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">Settings</h3>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setShowSettings(false)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Settings Panel */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Theme
                        </label>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                          >
                            <Sun className="w-4 h-4 mr-1" />
                            Light
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                          >
                            <Moon className="w-4 h-4 mr-1" />
                            Dark
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                          >
                            <Monitor className="w-4 h-4 mr-1" />
                            Auto
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          AI Features
                        </label>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Sentiment Analysis</span>
                            <Button
                              size="sm"
                              variant={
                                defaultAIFeatures.sentimentAnalysis
                                  ? "default"
                                  : "outline"
                              }
                            >
                              {defaultAIFeatures.sentimentAnalysis ? (
                                <Eye className="w-3 h-3" />
                              ) : (
                                <EyeOff className="w-3 h-3" />
                              )}
                            </Button>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Smart Suggestions</span>
                            <Button
                              size="sm"
                              variant={
                                defaultAIFeatures.smartSuggestions
                                  ? "default"
                                  : "outline"
                              }
                            >
                              {defaultAIFeatures.smartSuggestions ? (
                                <Eye className="w-3 h-3" />
                              ) : (
                                <EyeOff className="w-3 h-3" />
                              )}
                            </Button>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Auto Complete</span>
                            <Button
                              size="sm"
                              variant={
                                defaultAIFeatures.autoComplete
                                  ? "default"
                                  : "outline"
                              }
                            >
                              {defaultAIFeatures.autoComplete ? (
                                <Eye className="w-3 h-3" />
                              ) : (
                                <EyeOff className="w-3 h-3" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Notifications
                        </label>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Sound Effects</span>
                            <Button
                              size="sm"
                              variant={
                                defaultCustomization.sounds
                                  ? "default"
                                  : "outline"
                              }
                            >
                              {defaultCustomization.sounds ? (
                                <Volume2 className="w-3 h-3" />
                              ) : (
                                <VolumeX className="w-3 h-3" />
                              )}
                            </Button>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Animations</span>
                            <Button
                              size="sm"
                              variant={
                                defaultCustomization.animations
                                  ? "default"
                                  : "outline"
                              }
                            >
                              {defaultCustomization.animations ? (
                                <Zap className="w-3 h-3" />
                              ) : (
                                <EyeOff className="w-3 h-3" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Privacy
                        </label>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Analytics</span>
                            <Button
                              size="sm"
                              variant={enableAnalytics ? "default" : "outline"}
                            >
                              {enableAnalytics ? (
                                <Eye className="w-3 h-3" />
                              ) : (
                                <EyeOff className="w-3 h-3" />
                              )}
                            </Button>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">File Sharing</span>
                            <Button
                              size="sm"
                              variant={
                                enableFileSharing ? "default" : "outline"
                              }
                            >
                              {enableFileSharing ? (
                                <Eye className="w-3 h-3" />
                              ) : (
                                <EyeOff className="w-3 h-3" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
