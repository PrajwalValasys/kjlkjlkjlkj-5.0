import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  CreditCard,
  Key,
  Globe,
  Mail,
  Phone,
  Save,
  Eye,
  EyeOff,
  Trash2,
  Download,
  Upload,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Settings() {
  const [showPassword, setShowPassword] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    browser: true,
    sms: false,
    weekly: true,
    monthly: false,
  });

  const [profile, setProfile] = useState({
    firstName: "John",
    lastName: "Anderson",
    email: "john.anderson@company.com",
    phone: "+1 (555) 123-4567",
    company: "Acme Corporation",
    role: "Marketing Director",
    timezone: "America/New_York",
    language: "en",
  });

  const [apiSettings, setApiSettings] = useState({
    apiKey: "vls_1234567890abcdef1234567890abcdef",
    webhookUrl: "https://api.company.com/webhook",
    rateLimitPerHour: 1000,
  });

  const [billing] = useState({
    plan: "Professional",
    credits: 8450,
    nextBilling: new Date("2024-02-15"),
    usageThisMonth: 2150,
  });

  const handleSaveProfile = () => {
    // Save profile logic here
    console.log("Saving profile:", profile);
  };

  const handleGenerateApiKey = () => {
    const newKey = "vls_" + Math.random().toString(36).substring(2, 32);
    setApiSettings({ ...apiSettings, apiKey: newKey });
  };

  const handleExportData = () => {
    // Export user data logic
    console.log("Exporting user data...");
  };

  const handleDeleteAccount = () => {
    // Account deletion logic
    console.log("Account deletion requested");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-gradient-to-r from-valasys-orange to-valasys-orange-light rounded-lg flex items-center justify-center">
                <SettingsIcon className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                Account Settings
              </h1>
            </div>
            <p className="text-gray-600 mt-1">
              Manage your account preferences and security settings
            </p>
          </div>
          <Badge variant="secondary" className="bg-green-50 text-green-700">
            <CheckCircle className="w-3 h-3 mr-1" />
            Account Verified
          </Badge>
        </div>

        {/* Settings Tabs */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger
              value="profile"
              className="flex items-center space-x-2"
            >
              <User className="w-4 h-4" />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="flex items-center space-x-2"
            >
              <Bell className="w-4 h-4" />
              <span>Notifications</span>
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="flex items-center space-x-2"
            >
              <Shield className="w-4 h-4" />
              <span>Security</span>
            </TabsTrigger>
            <TabsTrigger
              value="billing"
              className="flex items-center space-x-2"
            >
              <CreditCard className="w-4 h-4" />
              <span>Billing</span>
            </TabsTrigger>
            <TabsTrigger value="api" className="flex items-center space-x-2">
              <Key className="w-4 h-4" />
              <span>API</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Settings */}
          <TabsContent value="profile">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={profile.firstName}
                          onChange={(e) =>
                            setProfile({
                              ...profile,
                              firstName: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={profile.lastName}
                          onChange={(e) =>
                            setProfile({ ...profile, lastName: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) =>
                          setProfile({ ...profile, email: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={profile.phone}
                        onChange={(e) =>
                          setProfile({ ...profile, phone: e.target.value })
                        }
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="company">Company</Label>
                        <Input
                          id="company"
                          value={profile.company}
                          onChange={(e) =>
                            setProfile({ ...profile, company: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">Job Title</Label>
                        <Input
                          id="role"
                          value={profile.role}
                          onChange={(e) =>
                            setProfile({ ...profile, role: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="timezone">Timezone</Label>
                        <Select
                          value={profile.timezone}
                          onValueChange={(value) =>
                            setProfile({ ...profile, timezone: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="America/New_York">
                              Eastern Time
                            </SelectItem>
                            <SelectItem value="America/Chicago">
                              Central Time
                            </SelectItem>
                            <SelectItem value="America/Denver">
                              Mountain Time
                            </SelectItem>
                            <SelectItem value="America/Los_Angeles">
                              Pacific Time
                            </SelectItem>
                            <SelectItem value="Europe/London">
                              London
                            </SelectItem>
                            <SelectItem value="Europe/Paris">Paris</SelectItem>
                            <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="language">Language</Label>
                        <Select
                          value={profile.language}
                          onValueChange={(value) =>
                            setProfile({ ...profile, language: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                            <SelectItem value="de">German</SelectItem>
                            <SelectItem value="it">Italian</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button
                        onClick={handleSaveProfile}
                        className="bg-valasys-orange hover:bg-valasys-orange/90"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Account Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm text-gray-600">
                        Account Type
                      </Label>
                      <div className="font-medium">{billing.plan}</div>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">
                        Credits Remaining
                      </Label>
                      <div className="font-medium text-green-600">
                        {billing.credits.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">
                        Member Since
                      </Label>
                      <div className="font-medium">June 2023</div>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">
                        Last Login
                      </Label>
                      <div className="font-medium">Today at 2:30 PM</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">
                        Email Notifications
                      </Label>
                      <p className="text-sm text-gray-600">
                        Receive updates via email
                      </p>
                    </div>
                    <Switch
                      checked={notifications.email}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, email: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">
                        Browser Notifications
                      </Label>
                      <p className="text-sm text-gray-600">
                        Show desktop notifications
                      </p>
                    </div>
                    <Switch
                      checked={notifications.browser}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, browser: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">
                        SMS Notifications
                      </Label>
                      <p className="text-sm text-gray-600">
                        Receive urgent alerts via SMS
                      </p>
                    </div>
                    <Switch
                      checked={notifications.sms}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, sms: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">
                        Weekly Reports
                      </Label>
                      <p className="text-sm text-gray-600">
                        Weekly usage and insights summary
                      </p>
                    </div>
                    <Switch
                      checked={notifications.weekly}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, weekly: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">
                        Monthly Billing
                      </Label>
                      <p className="text-sm text-gray-600">
                        Billing and credit usage notifications
                      </p>
                    </div>
                    <Switch
                      checked={notifications.monthly}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, monthly: checked })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security */}
          <TabsContent value="security">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Password & Security</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter current password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="Enter new password"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm new password"
                    />
                  </div>

                  <Button className="bg-valasys-orange hover:bg-valasys-orange/90">
                    Update Password
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Two-Factor Authentication</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">
                        Enable 2FA
                      </Label>
                      <p className="text-sm text-gray-600">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Button variant="outline">Setup 2FA</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Login Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">
                          Current Session - Chrome on MacOS
                        </div>
                        <div className="text-sm text-gray-600">
                          San Francisco, CA • Active now
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700"
                      >
                        Current
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Safari on iPhone</div>
                        <div className="text-sm text-gray-600">
                          San Francisco, CA • 2 hours ago
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Revoke
                      </Button>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Revoke All Other Sessions
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Billing */}
          <TabsContent value="billing">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Current Plan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold">{billing.plan}</div>
                      <div className="text-gray-600">
                        $99/month • Renews on{" "}
                        {billing.nextBilling.toLocaleDateString()}
                      </div>
                    </div>
                    <Button variant="outline">Upgrade Plan</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Upgrade Plans Section */}
              <Card className="bg-gradient-to-r from-valasys-orange via-valasys-orange-light to-valasys-blue border-none">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between text-white">
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold">Become Pro Access</h3>
                      <p className="text-white/90 text-sm">
                        Try your experience for using more features
                      </p>
                    </div>
                    <Button
                      className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
                      variant="outline"
                    >
                      ✨ Upgrade Pro
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Usage This Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Credits Used</span>
                        <span>
                          {billing.usageThisMonth.toLocaleString()} /{" "}
                          {billing.credits.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-valasys-orange h-2 rounded-full"
                          style={{
                            width: `${(billing.usageThisMonth / billing.credits) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 pt-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          156
                        </div>
                        <div className="text-sm text-gray-600">Searches</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          2,150
                        </div>
                        <div className="text-sm text-gray-600">Exports</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          34
                        </div>
                        <div className="text-sm text-gray-600">Campaigns</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-8 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
                        VISA
                      </div>
                      <div>
                        <div className="font-medium">•••• •••• •••• 4532</div>
                        <div className="text-sm text-gray-600">
                          Expires 12/26
                        </div>
                      </div>
                    </div>
                    <Button variant="outline">Update</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* API Settings */}
          <TabsContent value="api">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>API Key Management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="apiKey">API Key</Label>
                    <div className="flex space-x-2">
                      <div className="relative flex-1">
                        <Input
                          id="apiKey"
                          type={showApiKey ? "text" : "password"}
                          value={apiSettings.apiKey}
                          readOnly
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2"
                          onClick={() => setShowApiKey(!showApiKey)}
                        >
                          {showApiKey ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                      <Button onClick={handleGenerateApiKey} variant="outline">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Regenerate
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">
                      Keep your API key secure. It provides full access to your
                      account.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="webhookUrl">Webhook URL</Label>
                    <Input
                      id="webhookUrl"
                      value={apiSettings.webhookUrl}
                      onChange={(e) =>
                        setApiSettings({
                          ...apiSettings,
                          webhookUrl: e.target.value,
                        })
                      }
                      placeholder="https://your-domain.com/webhook"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rateLimit">
                      Rate Limit (requests/hour)
                    </Label>
                    <Input
                      id="rateLimit"
                      type="number"
                      value={apiSettings.rateLimitPerHour}
                      onChange={(e) =>
                        setApiSettings({
                          ...apiSettings,
                          rateLimitPerHour: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>API Documentation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      Integrate Valasys with your applications using our REST
                      API. Access prospects, manage searches, and export data
                      programmatically.
                    </p>
                    <div className="flex space-x-2">
                      <Button variant="outline">
                        <Globe className="w-4 h-4 mr-2" />
                        View Documentation
                      </Button>
                      <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Download SDK
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Danger Zone */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">
                  Export Account Data
                </Label>
                <p className="text-sm text-gray-600">
                  Download a copy of all your account data
                </p>
              </div>
              <Button onClick={handleExportData} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-red-200">
              <div>
                <Label className="text-base font-medium text-red-600">
                  Delete Account
                </Label>
                <p className="text-sm text-gray-600">
                  Permanently delete your account and all data
                </p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your account and remove all your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Delete Account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
