import * as React from "react";
import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Send,
  MessageCircle,
  X,
  User,
  Bot,
  Clock,
  CheckCheck,
  Move,
  GripVertical,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "agent";
  timestamp: Date;
  status?: "sending" | "sent" | "delivered" | "read";
}

interface DraggableChatSupportProps {
  isOpen: boolean;
  onClose: () => void;
  isMinimized?: boolean;
  onMinimize?: () => void;
  initialPosition?: { x: number; y: number };
  enableDrag?: boolean;
}

interface Position {
  x: number;
  y: number;
}

const supportResponses = [
  "Hi! I'm here to help you with Valasys. What can I assist you with today?",
  "I understand your question. Let me provide you with the information you need.",
  "That's a great point! Here's what I recommend...",
  "I can definitely assist you with this. Let me walk you through the process step by step.",
  "Thanks for reaching out! I'm happy to assist you with your inquiry.",
  "Let me help you resolve this issue. Here's what we can do...",
  "I see what you're looking for. Here's the solution to your question.",
  "Perfect! I can guide you through this process. Here's how to get started...",
];

export function DraggableChatSupport({
  isOpen,
  onClose,
  isMinimized = false,
  onMinimize,
  initialPosition = { x: window.innerWidth - 100, y: window.innerHeight - 100 },
  enableDrag = true,
}: DraggableChatSupportProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [position, setPosition] = useState<Position>(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  const [lastTap, setLastTap] = useState(0);

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const dragHandleRef = useRef<HTMLDivElement>(null);

  // Load saved position from localStorage
  useEffect(() => {
    const savedPosition = localStorage.getItem("chatbot-position");
    if (savedPosition) {
      try {
        const parsed = JSON.parse(savedPosition);
        setPosition(parsed);
      } catch (error) {
        console.warn("Failed to parse saved chat position:", error);
      }
    }
  }, []);

  // Save position to localStorage
  const savePosition = useCallback((newPosition: Position) => {
    localStorage.setItem("chatbot-position", JSON.stringify(newPosition));
  }, []);

  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: "welcome",
        content:
          "Hi! I'm here to help you with Valasys. What can I assist you with today? 🚀\n\nPro tip: You can drag me around the screen by clicking and holding the drag handle at the top!",
        sender: "agent",
        timestamp: new Date(),
        status: "read",
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isMinimized]);

  // Constraint position within viewport bounds
  const constrainPosition = useCallback(
    (pos: Position): Position => {
      const margin = 20;
      const chatWidth = isOpen && !isMinimized ? 384 : 64; // w-96 = 384px, button = 64px
      const chatHeight = isOpen && !isMinimized ? 600 : 64;

      return {
        x: Math.max(
          margin,
          Math.min(pos.x, window.innerWidth - chatWidth - margin),
        ),
        y: Math.max(
          margin,
          Math.min(pos.y, window.innerHeight - chatHeight - margin),
        ),
      };
    },
    [isOpen, isMinimized],
  );

  // Mouse drag handlers
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!enableDrag) return;

      e.preventDefault();
      e.stopPropagation();

      setIsDragging(true);
      const rect = chatContainerRef.current?.getBoundingClientRect();
      if (rect) {
        setDragOffset({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    },
    [enableDrag],
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !enableDrag) return;

      const newPosition = constrainPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      });

      setPosition(newPosition);
    },
    [isDragging, dragOffset, constrainPosition, enableDrag],
  );

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      savePosition(position);
    }
  }, [isDragging, position, savePosition]);

  // Touch drag handlers for mobile
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!enableDrag) return;

      const now = Date.now();
      const timeDiff = now - lastTap;

      // Handle double tap to prevent accidental drags
      if (timeDiff < 300) {
        setLastTap(0);
        return;
      }

      setLastTap(now);

      const touch = e.touches[0];
      setIsDragging(true);
      const rect = chatContainerRef.current?.getBoundingClientRect();
      if (rect) {
        setDragOffset({
          x: touch.clientX - rect.left,
          y: touch.clientY - rect.top,
        });
      }
    },
    [enableDrag, lastTap],
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging || !enableDrag) return;

      e.preventDefault(); // Prevent scrolling while dragging
      const touch = e.touches[0];
      const newPosition = constrainPosition({
        x: touch.clientX - dragOffset.x,
        y: touch.clientY - dragOffset.y,
      });

      setPosition(newPosition);
    },
    [isDragging, dragOffset, constrainPosition, enableDrag],
  );

  const handleTouchEnd = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      savePosition(position);
    }
  }, [isDragging, position, savePosition]);

  // Event listeners for mouse and touch
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      document.addEventListener("touchend", handleTouchEnd);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
      };
    }
  }, [
    isDragging,
    handleMouseMove,
    handleMouseUp,
    handleTouchMove,
    handleTouchEnd,
  ]);

  // Handle window resize to keep chat in bounds
  useEffect(() => {
    const handleResize = () => {
      setPosition((prev) => constrainPosition(prev));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [constrainPosition]);

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

  return (
    <div
      ref={chatContainerRef}
      className={cn(
        "fixed z-50 transition-all duration-200",
        isDragging ? "cursor-grabbing" : "cursor-default",
        isDragging && "select-none",
      )}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: isDragging ? "scale(1.05)" : "scale(1)",
      }}
    >
      {/* Chat popup positioned above the button */}
      {isOpen && !isMinimized && (
        <div className="absolute bottom-20 right-0 w-96 h-[600px] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col mb-4">
          {/* Draggable Header */}
          <div
            ref={dragHandleRef}
            className={cn(
              "p-4 border-b bg-gradient-to-r from-valasys-orange to-valasys-orange-light text-white rounded-t-lg relative overflow-hidden",
              enableDrag && "cursor-grab active:cursor-grabbing",
            )}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          >
            {/* Drag Handle Indicator */}
            {enableDrag && (
              <div className="absolute left-1/2 top-2 transform -translate-x-1/2">
                <GripVertical className="w-4 h-4 text-white/60" />
              </div>
            )}

            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center space-x-3">
                <MessageCircle className="w-6 h-6" />
                <div>
                  <h3 className="text-white text-lg font-medium flex items-center">
                    Chat Support
                    {enableDrag && (
                      <Badge className="ml-2 bg-white/20 text-white border-white/30 text-xs">
                        <Move className="w-3 h-3 mr-1" />
                        Draggable
                      </Badge>
                    )}
                  </h3>
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

            {/* Drag Hint */}
            {enableDrag && !isDragging && (
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-white/80">
                Click and drag to move
              </div>
            )}
          </div>

          {/* Assistant Info */}
          <div className="px-4 py-2 bg-valasys-gray-50 border-b">
            <div className="text-sm text-valasys-gray-600">
              Valasys Support Assistant • Draggable Mode
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
                <div
                  key={message.id}
                  className={cn(
                    "flex items-start space-x-2",
                    message.sender === "user" ? "justify-end" : "justify-start",
                  )}
                >
                  {message.sender === "agent" && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src="https://cdn.builder.io/api/v1/image/assets%2F14eeebbe3bc747628c4df487fdaa44b5%2F40919efce0c543049842afc9206631ac?format=webp&width=800"
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
                        "rounded-lg px-3 py-2 text-sm whitespace-pre-wrap",
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

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex items-start space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src="https://cdn.builder.io/api/v1/image/assets%2F14eeebbe3bc747628c4df487fdaa44b5%2F40919efce0c543049842afc9206631ac?format=webp&width=800"
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
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="p-4 border-t bg-white rounded-b-lg">
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
        </div>
      )}

      {/* Floating chat button with enhanced draggable features */}
      <div className="relative group">
        <Button
          onClick={onMinimize}
          className={cn(
            "h-16 w-16 rounded-full p-0 bg-white hover:bg-gray-50 shadow-2xl border-2 border-valasys-orange/20 hover:border-valasys-orange/40 transition-all duration-300 hover:scale-110 group-hover:shadow-valasys-orange/20",
            enableDrag && "cursor-grab active:cursor-grabbing",
            isDragging && "scale-110 shadow-2xl",
          )}
          onMouseDown={enableDrag ? handleMouseDown : undefined}
          onTouchStart={enableDrag ? handleTouchStart : undefined}
        >
          <div className="relative">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F14eeebbe3bc747628c4df487fdaa44b5%2F40919efce0c543049842afc9206631ac?format=webp&width=800"
              alt="VAIS Chatbot"
              className={cn(
                "w-12 h-12 rounded-full object-cover transition-transform",
                isDragging ? "scale-110" : "float-animation",
              )}
            />
            {/* Pulsing animation for new messages */}
            {messages.filter(
              (m) => m.sender === "agent" && !m.id.includes("welcome"),
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
                (m) => m.sender === "agent" && !m.id.includes("welcome"),
              ).length,
              9,
            )}
          </Badge>
        )}

        {/* Drag indicator */}
        {enableDrag && (
          <div className="absolute -bottom-2 -right-2 bg-valasys-orange text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
            <Move className="w-3 h-3" />
          </div>
        )}

        {/* Online status indicator */}
        <div className="absolute bottom-1 right-1 w-4 h-4 bg-valasys-green rounded-full border-2 border-white shadow-sm"></div>

        {/* Floating tooltip with drag info */}
        {isMinimized && (
          <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
              {enableDrag
                ? "Drag to move • Click to chat"
                : "Chat with VAIS Assistant"}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        )}

        {/* Visual feedback when dragging */}
        {isDragging && (
          <div className="absolute inset-0 rounded-full bg-valasys-orange/30 animate-pulse pointer-events-none"></div>
        )}
      </div>
    </div>
  );
}
