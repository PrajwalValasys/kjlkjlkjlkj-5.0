import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlusCircle, List, Megaphone } from "lucide-react";
import { cn } from "@/lib/utils";
import CampaignRequestForm from "@/components/forms/CampaignRequestForm";
import CampaignRequestsList from "@/components/campaigns/CampaignRequestsList";

export default function BuildMyCampaign() {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("form");

  // Check for tab parameter in URL and switch to appropriate tab
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "requests") {
      setActiveTab("list"); // 'list' corresponds to Campaign Requests tab
    }
  }, [searchParams]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-gradient-to-r from-valasys-orange to-valasys-orange-light rounded-lg flex items-center justify-center">
                <Megaphone className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-valasys-gray-900">
                Build My Campaign
              </h1>
            </div>
            <p className="text-valasys-gray-600">
              Create new campaign requests and manage existing ones
            </p>
          </div>
        </div>

        {/* Main Content */}
        <Card className="shadow-sm">
          <CardContent className="p-0">
            <div className="w-full">
              <div className="px-6 pt-6">
                <div className="flex gap-1 max-w-md border-b border-valasys-gray-200">
                  <button
                    onClick={() => setActiveTab("form")}
                    className={cn(
                      "flex items-center px-4 py-3 text-sm font-medium transition-all duration-200 group relative",
                      activeTab === "form"
                        ? "text-[#FF6A00] border-b-2 border-[#FF6A00]"
                        : "text-valasys-gray-600 hover:text-valasys-gray-900 border-b-2 border-transparent hover:border-valasys-gray-300",
                    )}
                  >
                    <PlusCircle
                      className={cn(
                        "w-4 h-4 flex-shrink-0 mr-3",
                        activeTab === "form"
                          ? "text-[#FF6A00]"
                          : "text-valasys-gray-500",
                      )}
                    />
                    <span className="truncate">New Campaign</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("list")}
                    className={cn(
                      "flex items-center px-4 py-3 text-sm font-medium transition-all duration-200 group relative",
                      activeTab === "list"
                        ? "text-[#FF6A00] border-b-2 border-[#FF6A00]"
                        : "text-valasys-gray-600 hover:text-valasys-gray-900 border-b-2 border-transparent hover:border-valasys-gray-300",
                    )}
                  >
                    <List
                      className={cn(
                        "w-4 h-4 flex-shrink-0 mr-3",
                        activeTab === "list"
                          ? "text-[#FF6A00]"
                          : "text-valasys-gray-500",
                      )}
                    />
                    <span className="truncate">Campaign Requests</span>
                  </button>
                </div>
              </div>

              {activeTab === "form" && (
                <div className="p-6 mt-0">
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-xl font-semibold text-valasys-gray-900">
                        Campaign Request Form
                      </h2>
                      <p className="text-sm text-valasys-gray-600">
                        Fill out the details below to create a new campaign
                        request
                      </p>
                    </div>
                    <CampaignRequestForm />
                  </div>
                </div>
              )}

              {activeTab === "list" && (
                <div className="p-6 mt-0">
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-xl font-semibold text-valasys-gray-900">
                        Campaign Requests
                      </h2>
                      <p className="text-sm text-valasys-gray-600">
                        View and manage all your campaign requests
                      </p>
                    </div>
                    <CampaignRequestsList />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
