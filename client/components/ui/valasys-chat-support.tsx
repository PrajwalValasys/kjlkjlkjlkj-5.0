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
  Send,
  MessageCircle,
  X,
  User,
  Bot,
  Clock,
  CheckCheck,
  Target,
  Users,
  Star,
  FileText,
  CreditCard,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "agent";
  timestamp: Date;
  status?: "sending" | "sent" | "delivered" | "read";
  messageType?: "text" | "topic_selection";
}

interface ValasysChatSupportProps {
  isOpen: boolean;
  onClose: () => void;
  isMinimized?: boolean;
  onMinimize?: () => void;
}

interface SupportTopic {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const supportTopics: SupportTopic[] = [
  {
    id: "icp",
    title: "Ideal Customer Profile (ICP)",
    icon: Target,
    color: "bg-blue-500 hover:bg-blue-600",
  },
  {
    id: "abm",
    title: "Account Based Marketing (ABM)",
    icon: Users,
    color: "bg-purple-500 hover:bg-purple-600",
  },
  {
    id: "lal",
    title: "Look-a-Likes (LAL)",
    icon: Star,
    color: "bg-yellow-500 hover:bg-yellow-600",
  },
  {
    id: "prospects",
    title: "Prospects",
    icon: FileText,
    color: "bg-green-500 hover:bg-green-600",
  },
];

const topicResponses: Record<string, string[]> = {
  icp: [
    "Great! I can help you with Ideal Customer Profile (ICP) setup. Our ICP tool helps you identify and define your perfect customers based on firmographic, technographic, and behavioral data.",
    "To get started with ICP, you can upload your existing customer data or use our guided setup wizard. Would you like me to walk you through the process?",
  ],
  abm: [
    "Perfect! Account-Based Marketing is one of our core strengths. I can help you create targeted campaigns for your high-value accounts.",
    "Our ABM platform allows you to identify target accounts, create personalized campaigns, and track engagement. What specific aspect would you like help with?",
  ],
  lal: [
    "Excellent! Look-a-Like audiences help you find companies similar to your best customers. Our AI analyzes thousands of data points to find perfect matches.",
    "To create effective lookalikes, I'll need to understand your current customer base. Do you have existing customer data to work with?",
  ],
  prospects: [
    "I'm here to help with prospect management! Our prospect database contains millions of verified contacts across various industries.",
    "You can search for prospects using our advanced filters including company size, industry, technology stack, and more. What type of prospects are you looking for?",
  ],
};

export function ValasysChatSupport({
  isOpen,
  onClose,
  isMinimized = false,
  onMinimize,
}: ValasysChatSupportProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentStep, setCurrentStep] = useState<
    "greeting" | "topic_selection" | "conversation"
  >("greeting");
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize with greeting message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greetingMessage: ChatMessage = {
        id: "greeting",
        content: "Hi, please select the topic for which you seek support.",
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
          msg.id === userMessage.id
            ? { ...msg, status: "delivered" as const }
            : msg,
        ),
      );
    }, 500);

    // Simulate agent response
    simulateAgentResponse();
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
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

  // Minimized state - Floating chat button with avatar
  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative group">
          <Button
            onClick={onMinimize}
            className="h-16 w-16 rounded-full p-0 bg-white hover:bg-gray-50 shadow-2xl border-2 border-valasys-orange/20 hover:border-valasys-orange/40 transition-all duration-300 hover:scale-110 group-hover:shadow-valasys-orange/20"
          >
            <div className="relative">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F14eeebbe3bc747628c4df487fdaa44b5%2F40919efce0c543049842afc9206631ac?format=webp&width=800"
                alt="VAIS Chatbot"
                className="w-12 h-12 rounded-full object-cover"
              />
              {/* Pulsing animation for new messages */}
              {messages.filter(
                (m) => m.sender === "agent" && !m.id.includes("greeting"),
              ).length > 0 && (
                <div className="absolute inset-0 w-12 h-12 rounded-full bg-valasys-orange/20 animate-ping"></div>
              )}
            </div>
          </Button>

          {/* Notification badge */}
          {messages.filter((m) => m.sender === "agent").length > 1 && (
            <Badge className="absolute -top-1 -right-1 bg-red-500 text-white animate-pulse h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
              {Math.min(
                messages.filter(
                  (m) => m.sender === "agent" && !m.id.includes("greeting"),
                ).length,
                9,
              )}
            </Badge>
          )}

          {/* Pulsing ring animation */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-valasys-orange to-valasys-orange-light opacity-75 animate-ping"></div>
        </div>
      </div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md h-[600px] p-0 gap-0 flex flex-col">
        {/* Header */}
        <DialogHeader className="p-4 border-b bg-gradient-to-r from-valasys-orange to-valasys-orange-light text-white relative overflow-hidden">
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <DialogTitle className="text-white text-lg font-medium">
                  Chat Support
                </DialogTitle>
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
                  <MessageCircle className="w-4 h-4" />
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

        {/* Assistant Info */}
        <div className="px-4 py-2 bg-valasys-gray-50 border-b">
          <div className="text-sm text-valasys-gray-600">
            Valasys Support Assistant
          </div>
        </div>

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
                    <div className="space-y-3 ml-10">
                      {supportTopics.map((topic) => {
                        const Icon = topic.icon;
                        return (
                          <Button
                            key={topic.id}
                            onClick={() => handleTopicSelection(topic.id)}
                            className="w-full justify-center h-12 text-center bg-valasys-orange hover:bg-valasys-orange/90 text-white border-0 transition-all duration-200 hover:scale-105 rounded-lg shadow-sm font-medium"
                          >
                            {topic.title}
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
          </div>
        </ScrollArea>

        {/* Message Input */}
        {currentStep === "conversation" && (
          <div className="p-4 border-t bg-white">
            <div className="flex items-center space-x-2">
              <Input
                ref={inputRef}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                className="flex-1 border-valasys-gray-300 focus:border-valasys-orange focus:ring-valasys-orange/20 rounded-lg"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || isTyping}
                className="bg-valasys-gray-400 hover:bg-valasys-gray-500 h-10 w-10 p-0 rounded-lg"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
