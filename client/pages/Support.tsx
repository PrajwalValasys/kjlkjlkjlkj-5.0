import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { NextGenChatbot } from "@/components/ui/next-gen-chatbot";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Ticket,
  Plus,
  Search,
  Filter,
  MessageCircle,
  Clock,
  CheckCircle,
  AlertCircle,
  Mail,
  Phone,
  FileText,
  Send,
  RefreshCw,
  ExternalLink,
  User,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SupportTicket {
  id: string;
  title: string;
  description: string;
  status: "open" | "in-progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  category: string;
  createdAt: Date;
  updatedAt: Date;
  assignedTo?: string;
}

// Sample support tickets
const sampleTickets: SupportTicket[] = [
  {
    id: "TICK-001",
    title: "Unable to export prospect results",
    description:
      "When I try to export my prospect search results, the download fails after a few seconds.",
    status: "open",
    priority: "high",
    category: "Export Issues",
    createdAt: new Date("2024-01-15T10:30:00Z"),
    updatedAt: new Date("2024-01-15T10:30:00Z"),
  },
  {
    id: "TICK-002",
    title: "Credit usage not updating correctly",
    description:
      "My credit balance shows incorrect numbers after running multiple searches.",
    status: "in-progress",
    priority: "medium",
    category: "Billing",
    createdAt: new Date("2024-01-12T14:20:00Z"),
    updatedAt: new Date("2024-01-14T09:15:00Z"),
    assignedTo: "Sarah Mitchell",
  },
  {
    id: "TICK-003",
    title: "API integration documentation request",
    description:
      "Need detailed documentation for integrating with our CRM system.",
    status: "resolved",
    priority: "low",
    category: "Documentation",
    createdAt: new Date("2024-01-10T16:45:00Z"),
    updatedAt: new Date("2024-01-13T11:30:00Z"),
    assignedTo: "Technical Team",
  },
];

export default function Support() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<SupportTicket[]>(sampleTickets);
  const [showNewTicketDialog, setShowNewTicketDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [liveChatOpen, setLiveChatOpen] = useState(false);
  const [liveChatMinimized, setLiveChatMinimized] = useState(false);

  const [newTicket, setNewTicket] = useState({
    title: "",
    description: "",
    category: "",
    priority: "medium" as "low" | "medium" | "high" | "urgent",
  });

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = !filterStatus || ticket.status === filterStatus;
    const matchesPriority =
      !filterPriority || ticket.priority === filterPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleCreateTicket = () => {
    const ticket: SupportTicket = {
      id: `TICK-${String(tickets.length + 1).padStart(3, "0")}`,
      ...newTicket,
      status: "open",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setTickets([ticket, ...tickets]);
    setNewTicket({
      title: "",
      description: "",
      category: "",
      priority: "medium",
    });
    setShowNewTicketDialog(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200";
      case "closed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "low":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertCircle className="w-4 h-4" />;
      case "in-progress":
        return <Clock className="w-4 h-4" />;
      case "resolved":
        return <CheckCircle className="w-4 h-4" />;
      case "closed":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
      Math.floor((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      "day",
    );
  };

  return (
    <TooltipProvider>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-gradient-to-r from-valasys-orange to-valasys-orange-light rounded-lg flex items-center justify-center">
                  <Ticket className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Support Center
                </h1>
              </div>
              <p className="text-gray-600 mt-1">
                Get help and manage your support tickets
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                <Ticket className="w-3 h-3 mr-1" />
                Open Tickets:{" "}
                <span className="font-bold ml-1">
                  {tickets.filter((t) => t.status === "open").length}
                </span>
              </Badge>
              <Dialog
                open={showNewTicketDialog}
                onOpenChange={setShowNewTicketDialog}
              >
                <DialogTrigger asChild>
                  <Button className="bg-valasys-orange hover:bg-valasys-orange/90">
                    <Plus className="w-4 h-4 mr-2" />
                    New Ticket
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create Support Ticket</DialogTitle>
                    <DialogDescription>
                      Describe your issue and we'll help you resolve it quickly.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        placeholder="Brief description of your issue"
                        value={newTicket.title}
                        onChange={(e) =>
                          setNewTicket({ ...newTicket, title: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={newTicket.category}
                        onValueChange={(value) =>
                          setNewTicket({ ...newTicket, category: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Technical Issue">
                            Technical Issue
                          </SelectItem>
                          <SelectItem value="Billing">Billing</SelectItem>
                          <SelectItem value="Feature Request">
                            Feature Request
                          </SelectItem>
                          <SelectItem value="Export Issues">
                            Export Issues
                          </SelectItem>
                          <SelectItem value="API Support">
                            API Support
                          </SelectItem>
                          <SelectItem value="Documentation">
                            Documentation
                          </SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select
                        value={newTicket.priority}
                        onValueChange={(
                          value: "low" | "medium" | "high" | "urgent",
                        ) => setNewTicket({ ...newTicket, priority: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Provide detailed information about your issue..."
                        rows={4}
                        value={newTicket.description}
                        onChange={(e) =>
                          setNewTicket({
                            ...newTicket,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setShowNewTicketDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateTicket}
                      disabled={
                        !newTicket.title ||
                        !newTicket.description ||
                        !newTicket.category
                      }
                      className="bg-valasys-orange hover:bg-valasys-orange/90"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Create Ticket
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Filters */}
          <Card className="shadow-sm">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search tickets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filterPriority}
                  onValueChange={setFilterPriority}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setFilterStatus("");
                    setFilterPriority("");
                  }}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tickets Table */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Your Support Tickets</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 hover:bg-gray-50">
                      <TableHead>Ticket ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTickets.map((ticket) => (
                      <TableRow
                        key={ticket.id}
                        className="hover:bg-blue-50/50 transition-colors"
                      >
                        <TableCell className="font-mono text-sm">
                          {ticket.id}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium text-gray-900">
                              {ticket.title}
                            </div>
                            <div className="text-sm text-gray-600 truncate max-w-xs">
                              {ticket.description}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={cn(
                              "text-xs border",
                              getStatusColor(ticket.status),
                            )}
                          >
                            <div className="flex items-center">
                              {getStatusIcon(ticket.status)}
                              <span className="ml-1 capitalize">
                                {ticket.status.replace("-", " ")}
                              </span>
                            </div>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={cn(
                              "text-xs border",
                              getPriorityColor(ticket.priority),
                            )}
                          >
                            {ticket.priority.charAt(0).toUpperCase() +
                              ticket.priority.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-700">
                          {ticket.category}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {formatDate(ticket.createdAt)}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {formatDate(ticket.updatedAt)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              navigate(`/chat-support/${ticket.id}`)
                            }
                            className="border-valasys-orange text-valasys-orange hover:bg-valasys-orange hover:text-white"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {filteredTickets.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Ticket className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No tickets found matching your criteria</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Next-Generation AI Chatbot */}
        <NextGenChatbot
          isOpen={liveChatOpen}
          onClose={() => {
            setLiveChatOpen(false);
            setLiveChatMinimized(false);
          }}
          isMinimized={liveChatMinimized}
          onMinimize={() => {
            if (liveChatMinimized) {
              setLiveChatMinimized(false);
              setLiveChatOpen(true);
            } else {
              setLiveChatMinimized(true);
              setLiveChatOpen(false);
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
              "https://cdn.builder.io/api/v1/image/assets%2F0538ba3bdc324f4899388f668257c600%2F37bed042ad244f859c2992a4365a87f1?format=webp&width=800",
            welcomeMessage:
              "Hi Daniel, please select the topic for which you seek support.",
            sounds: true,
            animations: true,
            position: "bottom-right",
          }}
          enableAnalytics={true}
          enableFileSharing={true}
          enableVoiceChat={true}
          enableScreenShare={false}
          maxFileSize={10}
        />
      </DashboardLayout>
    </TooltipProvider>
  );
}
