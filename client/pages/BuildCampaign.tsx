import React, { useState, useRef, useCallback, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
  Upload,
  Download,
  FileText,
  Search,
  Users,
  Target,
  Save,
  Clock,
  AlertCircle,
  CheckCircle,
  X,
  ChevronDown,
  ChevronLeft,
  Check,
  Loader2,
  Eye,
  Calculator,
  Trash2,
  Plus,
  Mail,
  Phone,
  MessageSquare,
  Linkedin,
  StopCircle,
  Play,
  Pause,
  Edit,
  Copy,
  Settings,
  Calendar,
  Send,
  Lock,
  GripVertical,
  Sparkles,
  BarChart3,
  Zap,
  TrendingUp,
  Filter,
  GitBranch,
  Webhook,
  ArrowRight,
  ArrowDown,
  Bot,
  Lightbulb,
  AlertTriangle,
  Activity,
  MonitorSpeaker,
  ChevronRight,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CampaignNode {
  id: string;
  type:
    | "email"
    | "linkedin"
    | "sms"
    | "call"
    | "wait"
    | "branch"
    | "task"
    | "webhook";
  title: string;
  position: { x: number; y: number };
  data: {
    subject?: string;
    content?: string;
    delay?: number;
    delayUnit?: "hours" | "days";
    condition?: string;
    script?: string;
    url?: string;
  };
  connections: string[];
  status?: "draft" | "active" | "paused" | "completed";
}

interface CampaignStats {
  totalSent: number;
  replies: number;
  meetings: number;
  vaisLift: number;
  openRate: number;
  replyRate: number;
}

interface AIInsight {
  id: string;
  type: "suggestion" | "alert" | "optimization";
  title: string;
  description: string;
  action?: string;
  priority: "low" | "medium" | "high";
}

const nodeTypes = {
  email: {
    icon: Mail,
    color: "bg-blue-100 text-blue-700 border-blue-300",
    name: "Email",
  },
  linkedin: {
    icon: Linkedin,
    color: "bg-indigo-100 text-indigo-700 border-indigo-300",
    name: "LinkedIn",
  },
  sms: {
    icon: MessageSquare,
    color: "bg-green-100 text-green-700 border-green-300",
    name: "SMS",
  },
  call: {
    icon: Phone,
    color: "bg-orange-100 text-orange-700 border-orange-300",
    name: "Call",
  },
  wait: {
    icon: Clock,
    color: "bg-yellow-100 text-yellow-700 border-yellow-300",
    name: "Wait",
  },
  branch: {
    icon: GitBranch,
    color: "bg-purple-100 text-purple-700 border-purple-300",
    name: "Branch",
  },
  task: {
    icon: CheckCircle,
    color: "bg-teal-100 text-teal-700 border-teal-300",
    name: "Task",
  },
  webhook: {
    icon: Webhook,
    color: "bg-gray-100 text-gray-700 border-gray-300",
    name: "Webhook",
  },
};

export default function BuildCampaign() {
  // Campaign state
  const [campaignName, setCampaignName] = useState(
    "Q4 Product Launch Campaign",
  );
  const [campaignStatus, setCampaignStatus] = useState<
    "draft" | "running" | "paused" | "completed"
  >("draft");
  const [stats, setStats] = useState<CampaignStats>({
    totalSent: 1247,
    replies: 89,
    meetings: 23,
    vaisLift: 34,
    openRate: 67.5,
    replyRate: 7.1,
  });

  // Canvas state
  const [nodes, setNodes] = useState<CampaignNode[]>([
    {
      id: "1",
      type: "email",
      title: "Welcome Email",
      position: { x: 100, y: 100 },
      data: {
        subject: "Welcome to our product demo",
        content: "Hi {{name}}, thanks for your interest...",
      },
      connections: ["2"],
      status: "active",
    },
    {
      id: "2",
      type: "wait",
      title: "Wait 3 days",
      position: { x: 100, y: 250 },
      data: { delay: 3, delayUnit: "days" },
      connections: ["3"],
      status: "active",
    },
    {
      id: "3",
      type: "branch",
      title: "Email Opened?",
      position: { x: 100, y: 400 },
      data: { condition: "email_opened" },
      connections: ["4", "5"],
      status: "draft",
    },
    {
      id: "4",
      type: "linkedin",
      title: "LinkedIn Connect",
      position: { x: 300, y: 500 },
      data: { content: "Hi {{name}}, I noticed you opened our email..." },
      connections: [],
      status: "draft",
    },
    {
      id: "5",
      type: "email",
      title: "Follow-up Email",
      position: { x: 100, y: 550 },
      data: {
        subject: "Did you get a chance to review?",
        content: "Hi {{name}}, following up...",
      },
      connections: [],
      status: "draft",
    },
  ]);

  // UI state
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [showNodeEditor, setShowNodeEditor] = useState(false);
  const [showPersonalizationPreview, setShowPersonalizationPreview] =
    useState(false);
  const [canvasScale, setCanvasScale] = useState(1);
  const [audiencePanelCollapsed, setAudiencePanelCollapsed] = useState(false);
  const [aiPanelCollapsed, setAiPanelCollapsed] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  // AI Insights
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([
    {
      id: "1",
      type: "suggestion",
      title: "Optimize Subject Line",
      description:
        'Try A/B testing "Quick question about {{company}}" vs current subject',
      action: "Apply suggestion",
      priority: "medium",
    },
    {
      id: "2",
      type: "alert",
      title: "Low Reply Rate Detected",
      description:
        "Current reply rate (7.1%) is below industry average. Consider shorter emails.",
      priority: "high",
    },
    {
      id: "3",
      type: "optimization",
      title: "Add SMS Follow-up",
      description: "Adding SMS after 5 days could increase response by 23%",
      action: "Add SMS node",
      priority: "low",
    },
  ]);

  const [audienceFilters, setAudienceFilters] = useState({
    jobTitles: ["CTO", "VP Engineering"],
    companies: ["Enterprise (1000+)"],
    locations: ["United States", "Canada"],
    industries: ["Technology", "Healthcare"],
  });

  const canvasRef = useRef<HTMLDivElement>(null);

  // Get node by ID
  const getNode = (id: string) => nodes.find((node) => node.id === id);

  // Add new node
  const addNode = (
    type: CampaignNode["type"],
    position: { x: number; y: number },
  ) => {
    const newNode: CampaignNode = {
      id: Date.now().toString(),
      type,
      title: `New ${nodeTypes[type].name}`,
      position,
      data: {},
      connections: [],
      status: "draft",
    };
    setNodes([...nodes, newNode]);
  };

  // Update node
  const updateNode = (id: string, updates: Partial<CampaignNode>) => {
    setNodes(
      nodes.map((node) => (node.id === id ? { ...node, ...updates } : node)),
    );
  };

  // Delete node
  const deleteNode = (id: string) => {
    setNodes(nodes.filter((node) => node.id !== id));
    // Remove connections to this node
    setNodes((prev) =>
      prev.map((node) => ({
        ...node,
        connections: node.connections.filter((connId) => connId !== id),
      })),
    );
  };

  // Connect nodes
  const connectNodes = (fromId: string, toId: string) => {
    updateNode(fromId, {
      connections: [...(getNode(fromId)?.connections || []), toId],
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return "bg-green-100 text-green-700 border-green-300";
      case "paused":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "completed":
        return "bg-blue-100 text-blue-700 border-blue-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-red-500 bg-red-50";
      case "medium":
        return "border-yellow-500 bg-yellow-50";
      default:
        return "border-blue-500 bg-blue-50";
    }
  };

  const renderConnectionLines = () => {
    return nodes.map((node) =>
      node.connections.map((targetId) => {
        const targetNode = getNode(targetId);
        if (!targetNode) return null;

        const startX = node.position.x + 150; // Half node width
        const startY = node.position.y + 75; // Half node height
        const endX = targetNode.position.x + 150;
        const endY = targetNode.position.y + 75;

        return (
          <svg
            key={`${node.id}-${targetId}`}
            className="absolute inset-0 pointer-events-none"
            style={{ zIndex: 1 }}
          >
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon points="0 0, 10 3.5, 0 7" fill="#6B7280" />
              </marker>
            </defs>
            <path
              d={`M ${startX} ${startY} Q ${startX} ${(startY + endY) / 2} ${endX} ${endY}`}
              stroke="#6B7280"
              strokeWidth="2"
              fill="none"
              markerEnd="url(#arrowhead)"
              className="drop-shadow-sm"
            />
          </svg>
        );
      }),
    );
  };

  return (
    <TooltipProvider>
      <DashboardLayout>
        <div className="flex flex-col h-screen overflow-hidden">
          {/* Enhanced Top Header with KPIs */}
          <div className="bg-white border-b border-gray-200 shadow-sm">
            <div className="w-full px-6 py-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <Input
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    className="text-2xl font-bold border-none p-0 h-auto focus-visible:ring-0 bg-transparent"
                  />
                  <Badge
                    className={cn("px-3 py-1", getStatusColor(campaignStatus))}
                  >
                    {campaignStatus}
                  </Badge>
                </div>
                <div className="flex items-center space-x-4">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                  <Button variant="outline" size="sm">
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                </div>
              </div>

              {/* KPI Summary */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-blue-900">
                        {stats.meetings}
                      </div>
                      <div className="text-sm text-blue-700">Meetings</div>
                    </div>
                    <Calendar className="w-8 h-8 text-blue-600" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-3 border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-green-900">
                        {stats.replies}
                      </div>
                      <div className="text-sm text-green-700">Replies</div>
                    </div>
                    <Mail className="w-8 h-8 text-green-600" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-3 border border-purple-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-purple-900">
                        +{stats.vaisLift}%
                      </div>
                      <div className="text-sm text-purple-700">VAIS Lift</div>
                    </div>
                    <TrendingUp className="w-8 h-8 text-purple-600" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-3 border border-orange-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-orange-900">
                        {stats.openRate}%
                      </div>
                      <div className="text-sm text-orange-700">Open Rate</div>
                    </div>
                    <Eye className="w-8 h-8 text-orange-600" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-teal-50 to-teal-100 rounded-lg p-3 border border-teal-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-teal-900">
                        {stats.replyRate}%
                      </div>
                      <div className="text-sm text-teal-700">Reply Rate</div>
                    </div>
                    <BarChart3 className="w-8 h-8 text-teal-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left Panel: Audience Builder */}
            <div
              className={cn(
                "transition-all duration-300 border-r border-gray-200 bg-white",
                audiencePanelCollapsed ? "w-12" : "w-80",
              )}
            >
              <div className="h-full flex flex-col">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <h3
                    className={cn(
                      "font-semibold",
                      audiencePanelCollapsed && "hidden",
                    )}
                  >
                    Audience Builder
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setAudiencePanelCollapsed(!audiencePanelCollapsed)
                    }
                  >
                    {audiencePanelCollapsed ? (
                      <ChevronRight className="w-4 h-4" />
                    ) : (
                      <X className="w-4 h-4" />
                    )}
                  </Button>
                </div>

                {!audiencePanelCollapsed && (
                  <div className="flex-1 p-4 space-y-6 overflow-auto">
                    {/* Audience Stats */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-blue-900">
                          Total Audience
                        </h4>
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="text-3xl font-bold text-blue-900 mb-2">
                        1,247
                      </div>
                      <div className="text-sm text-blue-700">
                        Ready to engage
                      </div>
                    </div>

                    {/* Filters */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900 flex items-center">
                        <Filter className="w-4 h-4 mr-2" />
                        Active Filters
                      </h4>

                      <div className="space-y-3">
                        <div>
                          <Label className="text-sm text-gray-600">
                            Job Titles
                          </Label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {audienceFilters.jobTitles.map((title) => (
                              <Badge
                                key={title}
                                variant="secondary"
                                className="text-xs"
                              >
                                {title}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm text-gray-600">
                            Company Size
                          </Label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {audienceFilters.companies.map((company) => (
                              <Badge
                                key={company}
                                variant="secondary"
                                className="text-xs"
                              >
                                {company}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm text-gray-600">
                            Locations
                          </Label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {audienceFilters.locations.map((location) => (
                              <Badge
                                key={location}
                                variant="secondary"
                                className="text-xs"
                              >
                                {location}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Enrichment Health */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900 flex items-center">
                        <Activity className="w-4 h-4 mr-2" />
                        Enrichment Health
                      </h4>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            Email Coverage
                          </span>
                          <span className="text-sm font-medium text-green-600">
                            94%
                          </span>
                        </div>
                        <Progress value={94} className="h-2" />

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            Phone Coverage
                          </span>
                          <span className="text-sm font-medium text-yellow-600">
                            67%
                          </span>
                        </div>
                        <Progress value={67} className="h-2" />

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            LinkedIn Profiles
                          </span>
                          <span className="text-sm font-medium text-blue-600">
                            89%
                          </span>
                        </div>
                        <Progress value={89} className="h-2" />
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Import Audience
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                      >
                        <Filter className="w-4 h-4 mr-2" />
                        Edit Filters
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Export List
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Center Panel: Visual Canvas */}
            <div className="flex-1 flex flex-col bg-gray-50">
              {/* Canvas Toolbar */}
              <div className="bg-white border-b border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <h3 className="font-semibold">Sequence Canvas</h3>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCanvasScale(Math.max(0.5, canvasScale - 0.1))
                        }
                      >
                        <Minimize2 className="w-4 h-4" />
                      </Button>
                      <span className="text-sm text-gray-600">
                        {Math.round(canvasScale * 100)}%
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCanvasScale(Math.min(2, canvasScale + 0.1))
                        }
                      >
                        <Maximize2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {Object.entries(nodeTypes).map(([type, config]) => (
                      <Tooltip key={type}>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              addNode(type as any, { x: 200, y: 200 })
                            }
                            className="flex items-center space-x-1"
                          >
                            <config.icon className="w-4 h-4" />
                            <span className="hidden md:inline">
                              {config.name}
                            </span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Add {config.name} node</TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </div>
              </div>

              {/* Canvas Area */}
              <div className="flex-1 relative overflow-auto" ref={canvasRef}>
                <div
                  className="relative w-full h-full min-h-[600px]"
                  style={{
                    transform: `scale(${canvasScale})`,
                    transformOrigin: "top left",
                  }}
                >
                  {/* Grid Background */}
                  <div className="absolute inset-0 opacity-20">
                    <svg width="100%" height="100%">
                      <defs>
                        <pattern
                          id="grid"
                          width="20"
                          height="20"
                          patternUnits="userSpaceOnUse"
                        >
                          <path
                            d="M 20 0 L 0 0 0 20"
                            fill="none"
                            stroke="#e5e7eb"
                            strokeWidth="1"
                          />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                  </div>

                  {/* Connection Lines */}
                  {renderConnectionLines()}

                  {/* Nodes */}
                  {nodes.map((node) => {
                    const nodeConfig = nodeTypes[node.type];
                    const IconComponent = nodeConfig.icon;

                    return (
                      <div
                        key={node.id}
                        className={cn(
                          "absolute w-72 bg-white rounded-lg border-2 shadow-lg transition-all duration-200 cursor-pointer",
                          selectedNode === node.id
                            ? "ring-2 ring-blue-500 border-blue-300"
                            : "border-gray-200 hover:border-gray-300",
                          "hover:shadow-xl",
                        )}
                        style={{
                          left: node.position.x,
                          top: node.position.y,
                          zIndex: selectedNode === node.id ? 10 : 5,
                        }}
                        onClick={() => setSelectedNode(node.id)}
                        onDoubleClick={() => setShowNodeEditor(true)}
                      >
                        {/* Node Header */}
                        <div
                          className={cn(
                            "flex items-center justify-between p-3 rounded-t-lg border-b",
                            nodeConfig.color,
                          )}
                        >
                          <div className="flex items-center space-x-3">
                            <IconComponent className="w-5 h-5" />
                            <span className="font-medium">{node.title}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Badge variant="outline" className="text-xs">
                              {node.status}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNode(node.id);
                              }}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>

                        {/* Node Content */}
                        <div className="p-3">
                          {node.type === "email" && (
                            <div className="space-y-2">
                              <div className="text-sm font-medium text-gray-700">
                                Subject: {node.data.subject || "No subject"}
                              </div>
                              <div className="text-xs text-gray-500 line-clamp-2">
                                {node.data.content || "No content"}
                              </div>
                            </div>
                          )}

                          {node.type === "wait" && (
                            <div className="text-sm text-gray-700">
                              Wait {node.data.delay} {node.data.delayUnit}
                            </div>
                          )}

                          {node.type === "branch" && (
                            <div className="text-sm text-gray-700">
                              Condition: {node.data.condition || "Not set"}
                            </div>
                          )}

                          {(node.type === "linkedin" ||
                            node.type === "sms") && (
                            <div className="text-xs text-gray-500 line-clamp-2">
                              {node.data.content || "No content"}
                            </div>
                          )}

                          {node.type === "call" && (
                            <div className="text-xs text-gray-500 line-clamp-2">
                              Script: {node.data.script || "No script"}
                            </div>
                          )}

                          {node.type === "webhook" && (
                            <div className="text-xs text-gray-500">
                              URL: {node.data.url || "Not configured"}
                            </div>
                          )}
                        </div>

                        {/* Connection Points */}
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-2 border-gray-300 rounded-full cursor-pointer hover:border-blue-500" />
                        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-2 border-gray-300 rounded-full cursor-pointer hover:border-blue-500" />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Inspector Panel (when node selected) */}
              {selectedNode && (
                <div className="bg-white border-t border-gray-200 p-4 max-h-64 overflow-auto">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">Node Inspector</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedNode(null)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  {(() => {
                    const node = getNode(selectedNode);
                    if (!node) return null;

                    return (
                      <div className="space-y-3">
                        <div>
                          <Label className="text-sm">Title</Label>
                          <Input
                            value={node.title}
                            onChange={(e) =>
                              updateNode(node.id, { title: e.target.value })
                            }
                            className="mt-1"
                          />
                        </div>

                        {node.type === "email" && (
                          <>
                            <div>
                              <Label className="text-sm">Subject</Label>
                              <Input
                                value={node.data.subject || ""}
                                onChange={(e) =>
                                  updateNode(node.id, {
                                    data: {
                                      ...node.data,
                                      subject: e.target.value,
                                    },
                                  })
                                }
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label className="text-sm">Content</Label>
                              <Textarea
                                value={node.data.content || ""}
                                onChange={(e) =>
                                  updateNode(node.id, {
                                    data: {
                                      ...node.data,
                                      content: e.target.value,
                                    },
                                  })
                                }
                                className="mt-1"
                                rows={3}
                              />
                            </div>
                          </>
                        )}

                        {node.type === "wait" && (
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label className="text-sm">Delay</Label>
                              <Input
                                type="number"
                                value={node.data.delay || 1}
                                onChange={(e) =>
                                  updateNode(node.id, {
                                    data: {
                                      ...node.data,
                                      delay: parseInt(e.target.value),
                                    },
                                  })
                                }
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label className="text-sm">Unit</Label>
                              <Select
                                value={node.data.delayUnit || "days"}
                                onValueChange={(value) =>
                                  updateNode(node.id, {
                                    data: {
                                      ...node.data,
                                      delayUnit: value as "hours" | "days",
                                    },
                                  })
                                }
                              >
                                <SelectTrigger className="mt-1">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="hours">Hours</SelectItem>
                                  <SelectItem value="days">Days</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center space-x-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowNodeEditor(true)}
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowPersonalizationPreview(true)}
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            Preview
                          </Button>
                          <Button variant="outline" size="sm">
                            <Copy className="w-3 h-3 mr-1" />
                            Duplicate
                          </Button>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>

            {/* Right Panel: AI Assistant */}
            <div
              className={cn(
                "transition-all duration-300 border-l border-gray-200 bg-white",
                aiPanelCollapsed ? "w-12" : "w-80",
              )}
            >
              <div className="h-full flex flex-col">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <h3
                    className={cn(
                      "font-semibold flex items-center",
                      aiPanelCollapsed && "hidden",
                    )}
                  >
                    <Bot className="w-5 h-5 mr-2 text-blue-600" />
                    AI Assistant
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setAiPanelCollapsed(!aiPanelCollapsed)}
                  >
                    {aiPanelCollapsed ? (
                      <ChevronLeft className="w-4 h-4" />
                    ) : (
                      <X className="w-4 h-4" />
                    )}
                  </Button>
                </div>

                {!aiPanelCollapsed && (
                  <div className="flex-1 overflow-auto">
                    {/* Real-time Insights */}
                    <div className="p-4 space-y-4">
                      <div className="flex items-center space-x-2">
                        <Zap className="w-4 h-4 text-yellow-500" />
                        <h4 className="font-medium">Real-time Insights</h4>
                      </div>

                      {aiInsights.map((insight) => (
                        <div
                          key={insight.id}
                          className={cn(
                            "border rounded-lg p-3",
                            getPriorityColor(insight.priority),
                          )}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              {insight.type === "suggestion" && (
                                <Lightbulb className="w-4 h-4 text-yellow-600" />
                              )}
                              {insight.type === "alert" && (
                                <AlertTriangle className="w-4 h-4 text-red-600" />
                              )}
                              {insight.type === "optimization" && (
                                <TrendingUp className="w-4 h-4 text-green-600" />
                              )}
                              <span className="font-medium text-sm">
                                {insight.title}
                              </span>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {insight.priority}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600 mb-3">
                            {insight.description}
                          </p>
                          {insight.action && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full text-xs"
                            >
                              {insight.action}
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Subject Line Suggestions */}
                    <div className="border-t border-gray-200 p-4 space-y-4">
                      <div className="flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 text-purple-500" />
                        <h4 className="font-medium">Subject Suggestions</h4>
                      </div>

                      <div className="space-y-2">
                        {[
                          "Quick question about {{company}}",
                          "{{name}}, 5 minutes to discuss {{industry}} trends?",
                          "How {{company}} can increase efficiency by 30%",
                        ].map((suggestion, index) => (
                          <div
                            key={index}
                            className="border border-gray-200 rounded-lg p-2 hover:bg-gray-50 cursor-pointer"
                          >
                            <div className="text-sm font-medium">
                              {suggestion}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              Predicted open rate: {85 + index * 3}%
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Next Best Actions */}
                    <div className="border-t border-gray-200 p-4 space-y-4">
                      <div className="flex items-center space-x-2">
                        <Target className="w-4 h-4 text-green-500" />
                        <h4 className="font-medium">Next Best Actions</h4>
                      </div>

                      <div className="space-y-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start"
                        >
                          <Plus className="w-3 h-3 mr-2" />
                          Add A/B test variant
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start"
                        >
                          <MessageSquare className="w-3 h-3 mr-2" />
                          Add SMS follow-up
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start"
                        >
                          <BarChart3 className="w-3 h-3 mr-2" />
                          Analyze performance
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Control Bar */}
          <div className="bg-white border-t border-gray-200 shadow-lg">
            <div className="w-full px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {isRunning ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsRunning(false)}
                        className="bg-yellow-50 border-yellow-300 text-yellow-700"
                      >
                        <Pause className="w-4 h-4 mr-2" />
                        Pause Campaign
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => setIsRunning(true)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Start Campaign
                      </Button>
                    )}

                    <Button variant="outline" size="sm">
                      <Copy className="w-4 h-4 mr-2" />
                      Clone
                    </Button>

                    <Button variant="outline" size="sm">
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule
                    </Button>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-600">
                    Ready to send to{" "}
                    <span className="font-medium text-gray-900">
                      1,247 prospects
                    </span>
                  </div>
                  <Badge className="bg-green-100 text-green-700 border-green-300">
                    All systems ready
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Node Editor Modal */}
          <Dialog open={showNodeEditor} onOpenChange={setShowNodeEditor}>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto">
              <DialogHeader>
                <DialogTitle>Edit Node</DialogTitle>
                <DialogDescription>
                  Configure your campaign step settings.
                </DialogDescription>
              </DialogHeader>

              {selectedNode &&
                (() => {
                  const node = getNode(selectedNode);
                  if (!node) return null;

                  return (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Node Title</Label>
                          <Input
                            value={node.title}
                            onChange={(e) =>
                              updateNode(node.id, { title: e.target.value })
                            }
                          />
                        </div>
                        <div>
                          <Label>Status</Label>
                          <Select
                            value={node.status}
                            onValueChange={(value) =>
                              updateNode(node.id, { status: value as any })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="draft">Draft</SelectItem>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="paused">Paused</SelectItem>
                              <SelectItem value="completed">
                                Completed
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {node.type === "email" && (
                        <div className="space-y-4">
                          <div>
                            <Label>Subject Line</Label>
                            <Input
                              value={node.data.subject || ""}
                              onChange={(e) =>
                                updateNode(node.id, {
                                  data: {
                                    ...node.data,
                                    subject: e.target.value,
                                  },
                                })
                              }
                              placeholder="Enter email subject..."
                            />
                          </div>
                          <div>
                            <Label>Email Content</Label>
                            <Textarea
                              value={node.data.content || ""}
                              onChange={(e) =>
                                updateNode(node.id, {
                                  data: {
                                    ...node.data,
                                    content: e.target.value,
                                  },
                                })
                              }
                              placeholder="Enter email content..."
                              rows={8}
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm">
                              <Sparkles className="w-4 h-4 mr-2" />
                              AI Generate
                            </Button>
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-2" />
                              Preview
                            </Button>
                            <Button variant="outline" size="sm">
                              <Plus className="w-4 h-4 mr-2" />
                              Add Personalization
                            </Button>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => setShowNodeEditor(false)}
                        >
                          Cancel
                        </Button>
                        <Button onClick={() => setShowNodeEditor(false)}>
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  );
                })()}
            </DialogContent>
          </Dialog>

          {/* Personalization Preview Modal */}
          <Dialog
            open={showPersonalizationPreview}
            onOpenChange={setShowPersonalizationPreview}
          >
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Personalization Preview</DialogTitle>
                <DialogDescription>
                  See how your message will look with real prospect data.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h4 className="font-medium mb-2">Sample Preview</h4>
                  <div className="space-y-2">
                    <div>
                      <strong>To:</strong> john.doe@acmecorp.com
                    </div>
                    <div>
                      <strong>Subject:</strong> Quick question about Acme Corp's
                      data strategy
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <p>Hi John,</p>
                      <p>
                        I noticed Acme Corp is doing some interesting work in
                        the technology space.
                      </p>
                      <p>
                        I'd love to share how other CTOs are approaching data
                        challenges...
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowPersonalizationPreview(false)}
                  >
                    Close
                  </Button>
                  <Button>Use This Template</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </DashboardLayout>
    </TooltipProvider>
  );
}
