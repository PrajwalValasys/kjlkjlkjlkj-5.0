import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Send,
  MessageCircle,
  X,
  User,
  Bot,
  Clock,
  CheckCheck,
  Minimize2,
  Star,
  FileText,
  CreditCard,
  Users,
  Settings,
  HelpCircle,
  Target,
  Download,
  Phone,
  Mail,
  Zap,
  Heart,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "agent";
  timestamp: Date;
  status?: "sending" | "sent" | "delivered" | "read";
  messageType?: "text" | "quick_reply" | "topic_selection";
}

interface LiveChatProps {
  isOpen: boolean;
  onClose: () => void;
  isMinimized?: boolean;
  onMinimize?: () => void;
}

interface SupportTopic {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const supportTopics: SupportTopic[] = [
  {
    id: "icp",
    title: "Ideal Customer Profile (ICP)",
    description: "Help with building and refining your ICP",
    icon: Target,
    color: "hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700",
  },
  {
    id: "abm",
    title: "Account Based Marketing (ABM)",
    description: "ABM strategies and campaign setup",
    icon: Users,
    color: "hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700",
  },
  {
    id: "lal",
    title: "Look-a-Likes (LAL)",
    description: "Creating lookalike audiences",
    icon: Star,
    color: "hover:bg-yellow-50 hover:border-yellow-300 hover:text-yellow-700",
  },
  {
    id: "prospects",
    title: "Prospects",
    description: "Finding and managing prospects",
    icon: FileText,
    color: "hover:bg-green-50 hover:border-green-300 hover:text-green-700",
  },
  {
    id: "downloads",
    title: "Data Downloads",
    description: "Export and download assistance",
    icon: Download,
    color: "hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700",
  },
  {
    id: "billing",
    title: "Payments and Credits",
    description: "Billing, payments, and credit management",
    icon: CreditCard,
    color: "hover:bg-orange-50 hover:border-orange-300 hover:text-orange-700",
  },
  {
    id: "ticket",
    title: "Raise a ticket",
    description: "Create a support ticket",
    icon: HelpCircle,
    color: "hover:bg-red-50 hover:border-red-300 hover:text-red-700",
  },
];

const topicResponses: Record<string, string[]> = {
  icp: [
    "Great! I can help you with Ideal Customer Profile (ICP) setup. Let me guide you through the process.",
    "To build an effective ICP, we'll need to analyze your best customers. Would you like to start by uploading your existing customer data?",
    "I can also help you define firmographic criteria like company size, industry, and revenue ranges. What's your primary focus?",
  ],
  abm: [
    "Perfect! Account-Based Marketing is one of our strongest features. Let me help you set up your ABM campaign.",
    "For ABM success, we'll focus on high-value target accounts. Do you have a list of accounts you want to target?",
    "I can help you create personalized campaigns for your target accounts. What's your main objective - brand awareness or lead generation?",
  ],
  lal: [
    "Excellent choice! Lookalike audiences can significantly expand your reach. Let's create your LAL model.",
    "To build effective lookalikes, I'll need your best customer data as a seed audience. Do you have this ready?",
    "Our AI can identify companies similar to your best customers. Would you like to start with size, industry, or behavioral similarities?",
  ],
  prospects: [
    "I'm here to help with prospect management! Are you looking to find new prospects or manage existing ones?",
    "Our prospect database has millions of contacts. Let me help you set up search filters that match your ICP.",
    "Would you like assistance with prospect scoring, contact data, or export processes?",
  ],
  downloads: [
    "I can definitely help with data downloads! What type of data are you looking to export?",
    "Our system supports CSV, Excel, and API exports. Are you having trouble with a specific format?",
    "Let me guide you through the download process step by step. What data do you need to export?",
  ],
  billing: [
    "I'm here to help with billing and credits! Are you looking to purchase more credits or having billing issues?",
    "Let me check your current credit balance and usage. Is there a specific billing question I can answer?",
    "Would you like information about our pricing plans or help with payment processing?",
  ],
  ticket: [
    "I'll help you create a support ticket. Can you describe the issue you're experiencing?",
    "To create an effective ticket, I'll need some details about your problem. What area of the platform is affected?",
    "Let me gather some information to route your ticket to the right specialist. What's the priority level of this issue?",
  ],
};

const quickReplies = [
  "How do I export prospects?",
  "What is VAIS scoring?",
  "Credit pricing information",
  "Integration setup help",
  "Talk to human agent",
];

export function EnhancedLiveChat({
  isOpen,
  onClose,
  isMinimized = false,
  onMinimize,
}: LiveChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentStep, setCurrentStep] = useState<
    "greeting" | "topic_selection" | "conversation"
  >("greeting");
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [agentStatus, setAgentStatus] = useState<"online" | "away" | "busy">(
    "online",
  );
  const [satisfaction, setSatisfaction] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize with greeting message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greetingMessage: ChatMessage = {
        id: "greeting",
        content:
          "Hi Daniel, please select the topic for which you seek support.",
        sender: "agent",
        timestamp: new Date(),
        status: "read",
        messageType: "topic_selection",
      };
      setMessages([greetingMessage]);
      setCurrentStep("topic_selection");
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (
      isOpen &&
      !isMinimized &&
      inputRef.current &&
      currentStep === "conversation"
    ) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized, currentStep]);

  const handleTopicSelection = (topicId: string) => {
    const topic = supportTopics.find((t) => t.id === topicId);
    if (!topic) return;

    setSelectedTopic(topicId);

    // Add user's topic selection as message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: topic.title,
      sender: "user",
      timestamp: new Date(),
      status: "read",
    };

    setMessages((prev) => [...prev, userMessage]);
    setCurrentStep("conversation");

    // Simulate agent response based on topic
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        const responses = topicResponses[topicId] || [
          "I can help you with that! Let me know what specific assistance you need.",
        ];
        const randomResponse =
          responses[Math.floor(Math.random() * responses.length)];

        const agentMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: randomResponse,
          sender: "agent",
          timestamp: new Date(),
          status: "read",
        };

        setMessages((prev) => [...prev, agentMessage]);
        setIsTyping(false);
      }, 1500);
    }, 500);
  };

  const simulateAgentResponse = () => {
    setIsTyping(true);

    const responses = selectedTopic
      ? topicResponses[selectedTopic] || [
          "I understand. Let me help you with that.",
        ]
      : [
          "Thank you for your message. I'm analyzing your request...",
          "I can help you with that. Let me provide some guidance.",
          "Based on your question, here's what I recommend...",
          "That's a great question! Let me walk you through the process.",
        ];

    setTimeout(
      () => {
        const response =
          responses[Math.floor(Math.random() * responses.length)];
        const agentMessage: ChatMessage = {
          id: Date.now().toString(),
          content: response,
          sender: "agent",
          timestamp: new Date(),
          status: "read",
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

        // Show feedback after a few exchanges
        if (
          messages.filter((m) => m.sender === "agent").length >= 3 &&
          !showFeedback
        ) {
          setTimeout(() => setShowFeedback(true), 2000);
        }
      },
      1500 + Math.random() * 2000,
    );
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: newMessage.trim(),
      sender: "user",
      timestamp: new Date(),
      status: "sending",
    };

    setMessages((prev) => [...prev, userMessage]);
    setNewMessage("");

    // Simulate message delivery
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === userMessage.id ? { ...msg, status: "delivered" as const } : msg,
        ),
      );
    }, 500);

    // Simulate agent response
    simulateAgentResponse();
  };

  const handleQuickReply = (reply: string) => {
    setNewMessage(reply);
    setTimeout(() => handleSendMessage(), 100);
  };

  const getStatusColor = (status: typeof agentStatus) => {
    switch (status) {
      case "online":
        return "bg-valasys-green";
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
        return <CheckCheck className="w-3 h-3 text-valasys-blue" />;
      case "read":
        return <CheckCheck className="w-3 h-3 text-valasys-green" />;
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

  const renderFeedback = () => {
    if (!showFeedback || satisfaction !== null) return null;

    return (
      <div className="p-4 bg-valasys-gray-50 border-t">
        <div className="text-sm text-valasys-gray-700 mb-3 text-center">
          How would you rate this conversation?
        </div>
        <div className="flex justify-center space-x-2">
          {[1, 2, 3, 4, 5].map((rating) => (
            <Button
              key={rating}
              variant="ghost"
              size="sm"
              onClick={() => {
                setSatisfaction(rating);
                // Send feedback to backend
                console.log(`User rated conversation: ${rating}/5`);
              }}
              className="p-1 hover:bg-yellow-100"
            >
              <Star
                className={cn(
                  "w-5 h-5",
                  rating <= (satisfaction || 0)
                    ? "text-yellow-500 fill-yellow-500"
                    : "text-gray-300",
                )}
              />
            </Button>
          ))}
        </div>
      </div>
    );
  };

  // Minimized state with VAIS avatar
  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <div className="relative">
          <Button
            onClick={onMinimize}
            className="h-16 w-16 rounded-full p-0 bg-white hover:bg-gray-50 shadow-xl border-2 border-valasys-orange/20 hover:border-valasys-orange/40 transition-all duration-300 hover:scale-105"
          >
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2Ff3bdb2b3468a43dab6822ea1b300bbfe%2F25e73af1f3994e1ea6cd003e93f48d22?format=webp&width=800"
              alt="VAIS Assistant"
              className="w-12 h-12 rounded-full object-cover"
            />
          </Button>

          {/* Notification badge */}
          {messages.filter((m) => m.sender === "agent").length > 1 && (
            <Badge className="absolute -top-1 -right-1 bg-red-500 text-white animate-pulse h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
              {
                messages.filter(
                  (m) => m.sender === "agent" && !m.id.includes("greeting"),
                ).length
              }
            </Badge>
          )}

          {/* Online status indicator */}
          <div className="absolute bottom-1 right-1 w-4 h-4 bg-valasys-green rounded-full border-2 border-white shadow-sm"></div>

          {/* Floating action hint */}
          <div className="absolute -top-12 -left-8 bg-valasys-gray-900 text-white text-xs px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Chat with VAIS Assistant
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-valasys-gray-900"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg h-[700px] p-0 gap-0 flex flex-col">
        {/* Header */}
        <DialogHeader className="p-4 border-b bg-gradient-to-r from-valasys-orange to-valasys-orange-light text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10 border-2 border-white/20">
                <AvatarImage
                  src="https://cdn.builder.io/api/v1/image/assets%2Ff3bdb2b3468a43dab6822ea1b300bbfe%2F25e73af1f3994e1ea6cd003e93f48d22?format=webp&width=800"
                  alt="VAIS Assistant"
                />
                <AvatarFallback className="bg-white/20 text-white">
                  VA
                </AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="text-white text-lg">
                  Valasys Support Assistant
                </DialogTitle>
                <div className="flex items-center space-x-2">
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full",
                      getStatusColor(agentStatus),
                    )}
                  />
                  <span className="text-sm text-white/90 capitalize">
                    {agentStatus}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {onMinimize && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onMinimize}
                  className="text-white hover:bg-white/20 h-8 w-8 p-0"
                >
                  <Minimize2 className="w-4 h-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-white/20 h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Today indicator */}
        <div className="text-center py-2 bg-valasys-gray-50 border-b">
          <span className="text-xs text-valasys-gray-500">Today</span>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id}>
                {message.messageType === "topic_selection" ? (
                  // Topic Selection UI
                  <div className="space-y-4">
                    <div className="flex items-start space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src="https://cdn.builder.io/api/v1/image/assets%2Ff3bdb2b3468a43dab6822ea1b300bbfe%2F25e73af1f3994e1ea6cd003e93f48d22?format=webp&width=800"
                          alt="VAIS Assistant"
                        />
                        <AvatarFallback className="bg-valasys-orange text-white text-xs">
                          <Bot className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-valasys-gray-100 rounded-lg px-3 py-2 max-w-[80%]">
                        <p className="text-sm text-valasys-gray-900">
                          {message.content}
                        </p>
                        <div className="text-xs text-valasys-gray-500 mt-1">
                          {formatTime(message.timestamp)}
                        </div>
                      </div>
                    </div>

                    {/* Topic Selection Buttons */}
                    <div className="grid grid-cols-1 gap-2 ml-10">
                      {supportTopics.map((topic) => {
                        const Icon = topic.icon;
                        return (
                          <Button
                            key={topic.id}
                            variant="outline"
                            onClick={() => handleTopicSelection(topic.id)}
                            className={cn(
                              "justify-start p-3 h-auto text-left border-valasys-gray-300 transition-all duration-200",
                              topic.color,
                            )}
                          >
                            <Icon className="w-4 h-4 mr-3 flex-shrink-0" />
                            <div>
                              <div className="font-medium text-sm">
                                {topic.title}
                              </div>
                              <div className="text-xs text-valasys-gray-500 mt-0.5">
                                {topic.description}
                              </div>
                            </div>
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  // Regular message
                  <div
                    className={cn(
                      "flex items-start space-x-2",
                      message.sender === "user"
                        ? "justify-end"
                        : "justify-start",
                    )}
                  >
                    {message.sender === "agent" && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src="https://cdn.builder.io/api/v1/image/assets%2Ff3bdb2b3468a43dab6822ea1b300bbfe%2F25e73af1f3994e1ea6cd003e93f48d22?format=webp&width=800"
                          alt="VAIS Assistant"
                        />
                        <AvatarFallback className="bg-valasys-orange text-white text-xs">
                          <Bot className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}

                    <div
                      className={cn(
                        "max-w-[75%] space-y-1",
                        message.sender === "user" ? "items-end" : "items-start",
                      )}
                    >
                      <div
                        className={cn(
                          "rounded-lg px-3 py-2 text-sm",
                          message.sender === "user"
                            ? "bg-valasys-orange text-white"
                            : "bg-valasys-gray-100 text-valasys-gray-900",
                        )}
                      >
                        {message.content}
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-valasys-gray-500">
                        <span>{formatTime(message.timestamp)}</span>
                        {message.sender === "user" &&
                          getMessageStatus(message.status)}
                      </div>
                    </div>

                    {message.sender === "user" && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-valasys-blue text-white text-xs">
                          <User className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex items-start space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src="https://cdn.builder.io/api/v1/image/assets%2Ff3bdb2b3468a43dab6822ea1b300bbfe%2F25e73af1f3994e1ea6cd003e93f48d22?format=webp&width=800"
                    alt="VAIS Assistant"
                  />
                  <AvatarFallback className="bg-valasys-orange text-white text-xs">
                    <Bot className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-valasys-gray-100 rounded-lg px-3 py-2">
                  <div className="flex space-x-1">
                    <div
                      className="w-2 h-2 bg-valasys-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <div
                      className="w-2 h-2 bg-valasys-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <div
                      className="w-2 h-2 bg-valasys-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Quick replies */}
            {currentStep === "conversation" && !isTyping && (
              <div className="space-y-2">
                <div className="text-xs text-valasys-gray-500 ml-10">
                  Quick replies:
                </div>
                <div className="flex flex-wrap gap-2 ml-10">
                  {quickReplies.map((reply, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickReply(reply)}
                      className="text-xs border-valasys-orange/30 text-valasys-orange hover:bg-valasys-orange/10"
                    >
                      {reply}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Feedback */}
        {renderFeedback()}

        {/* Message Input */}
        {currentStep === "conversation" && (
          <div className="p-4 border-t bg-white">
            <div className="flex items-center space-x-2">
              <Input
                ref={inputRef}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                className="flex-1 border-valasys-gray-300 focus:border-valasys-orange focus:ring-valasys-orange/20"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || isTyping}
                className="bg-valasys-orange hover:bg-valasys-orange/90 h-10 w-10 p-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <div className="text-xs text-valasys-gray-500 mt-2 flex items-center justify-between">
              <span>Press Enter to send • Shift+Enter for new line</span>
              <div className="flex items-center space-x-4 text-xs">
                <span className="flex items-center">
                  <Phone className="w-3 h-3 mr-1" />
                  +1 (555) 123-4567
                </span>
                <span className="flex items-center">
                  <Mail className="w-3 h-3 mr-1" />
                  support@valasys.com
                </span>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
