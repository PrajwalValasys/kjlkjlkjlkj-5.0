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
  Minimize2,
  Maximize2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "agent";
  timestamp: Date;
  status?: "sending" | "sent" | "delivered" | "read";
}

interface LiveChatProps {
  isOpen: boolean;
  onClose: () => void;
  isMinimized?: boolean;
  onMinimize?: () => void;
}

const supportResponses = [
  "Hi! I'm Sarah from Valasys support. How can I help you today?",
  "I understand your concern. Let me look into that for you.",
  "That's a great question! Let me provide you with the details.",
  "I can definitely help you with that. Give me just a moment.",
  "Thanks for that information. I'm checking our system now.",
  "I've found the solution to your issue. Here's what you need to do:",
  "Is there anything else I can help you with today?",
  "Perfect! I'm glad we could resolve that for you.",
];

const quickActions = [
  "Export Issues",
  "Account Settings",
  "Billing Questions",
  "API Documentation",
  "Feature Request",
];

export function LiveChat({
  isOpen,
  onClose,
  isMinimized = false,
  onMinimize,
}: LiveChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      content: "Welcome to Valasys Support! How can we help you today?",
      sender: "agent",
      timestamp: new Date(),
      status: "read",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [agentStatus, setAgentStatus] = useState<"online" | "away" | "busy">(
    "online",
  );
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  const simulateAgentResponse = () => {
    setIsTyping(true);

    setTimeout(
      () => {
        const response =
          supportResponses[Math.floor(Math.random() * supportResponses.length)];
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
          msg.id === userMessage.id ? { ...msg, status: "delivered" as const } : msg,
        ),
      );
    }, 500);

    // Simulate agent response
    simulateAgentResponse();
  };

  const handleQuickAction = (action: string) => {
    setNewMessage(`I need help with: ${action}`);
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

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={onMinimize}
          className="h-12 w-12 rounded-full bg-valasys-orange hover:bg-valasys-orange/90 shadow-lg"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
        {messages.filter((m) => m.sender === "agent").length > 1 && (
          <Badge className="absolute -top-2 -right-2 bg-red-500 text-white animate-pulse">
            1
          </Badge>
        )}
      </div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md h-[600px] p-0 gap-0 flex flex-col">
        <DialogHeader className="p-4 border-b bg-gradient-to-r from-valasys-orange to-valasys-orange-light text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10 border-2 border-white/20">
                <AvatarImage src="/placeholder.svg" alt="Support Agent" />
                <AvatarFallback className="bg-white/20 text-white">
                  SA
                </AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="text-white text-lg">
                  Sarah Mitchell
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

        {/* Quick Actions */}
        <div className="p-3 border-b bg-valasys-gray-50">
          <div className="text-xs text-valasys-gray-600 mb-2">
            Quick help with:
          </div>
          <div className="flex flex-wrap gap-1">
            {quickActions.map((action) => (
              <Button
                key={action}
                variant="outline"
                size="sm"
                onClick={() => handleQuickAction(action)}
                className="text-xs h-7 border-valasys-gray-300 hover:bg-valasys-orange/10 hover:border-valasys-orange"
              >
                {action}
              </Button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex items-start space-x-2",
                  message.sender === "user" ? "justify-end" : "justify-start",
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
            ))}

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
          <div className="text-xs text-valasys-gray-500 mt-2">
            Press Enter to send • Shift+Enter for new line
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
