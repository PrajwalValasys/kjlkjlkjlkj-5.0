import "./global.css";
import React, { useEffect } from "react";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TourProvider } from "./contexts/TourContext";
import { store, persistor } from "./store";
import { initializeAuth } from "./store/reducers/authSlice";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import BuildVAIS from "./pages/BuildVAIS";
import VAISResults from "./pages/VAISResults";
import ABMLAL from "./pages/ABMLAL";
import FindProspect from "./pages/FindProspect";
import ProspectResults from "./pages/ProspectResults";
import BuildCampaign from "./pages/BuildCampaign";
import BuildMyCampaign from "./pages/BuildMyCampaign";
import CampaignOverview from "./pages/CampaignOverview";
import MyDownloadedList from "./pages/MyDownloadedList";
import Analytics from "./pages/Analytics";
import Users from "./pages/Users";
import Support from "./pages/Support";
import ChatSupport from "./pages/ChatSupport";
import FAQs from "./pages/FAQs";
import Settings from "./pages/Settings";
import FreeTrial from "./pages/FreeTrial";
import CreateAccount from "./pages/CreateAccount";
import EmailVerification from "./pages/EmailVerification";
import ForgotPassword from "./pages/ForgotPassword";
import ForgotPasswordEmailVerification from "./pages/ForgotPasswordEmailVerification";
import ResetPassword from "./pages/ResetPassword";
import AllNotifications from "./pages/AllNotifications";
import SpendingHistory from "./pages/SpendingHistory";
import RequireAuth from "./routes/RequireAuth";
import PublicOnly from "./routes/PublicOnly";

const queryClient = new QueryClient();

// App initialization component to handle Redux initialization
const AppInitializer = () => {
  useEffect(() => {
    store.dispatch(initializeAuth());
  }, []);

  return null;
};

const App = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
        forcedTheme="light"
      >
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <TourProvider>
              <AppInitializer />
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  {/* Public-only routes */}
                  <Route element={<PublicOnly />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route
                      path="/forgot-password-email-verification"
                      element={<ForgotPasswordEmailVerification />}
                    />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/free-trial" element={<FreeTrial />} />
                    <Route path="/create-account" element={<CreateAccount />} />
                    <Route
                      path="/email-verification"
                      element={<EmailVerification />}
                    />
                  </Route>

                  {/* Protected application routes */}
                  <Route element={<RequireAuth />}>
                    <Route path="/" element={<Index />} />
                    <Route path="/build-vais" element={<BuildVAIS />} />
                    <Route path="/vais-results" element={<VAISResults />} />
                    <Route path="/abm-lal" element={<ABMLAL />} />
                    <Route path="/find-prospect" element={<FindProspect />} />
                    <Route path="/prospect-results" element={<ProspectResults />} />
                    <Route path="/build-campaign" element={<BuildCampaign />} />
                    <Route path="/build-my-campaign" element={<BuildMyCampaign />} />
                    <Route path="/campaign-overview/:id" element={<CampaignOverview />} />
                    <Route path="/my-downloads" element={<MyDownloadedList />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/manage-users" element={<Users />} />
                    <Route path="/support" element={<Support />} />
                    <Route path="/chat-support/:ticketId" element={<ChatSupport />} />
                    <Route path="/faqs" element={<FAQs />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/notifications" element={<AllNotifications />} />
                    <Route path="/spending-history" element={<SpendingHistory />} />
                  </Route>

                  {/* Catch-all route - MUST be last */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TourProvider>
          </TooltipProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </PersistGate>
  </Provider>
);

// Handle HMR properly to avoid multiple createRoot calls
const container = document.getElementById("root")!;

// Check if we're in development and already have a root
let root: any;
if (import.meta.hot) {
  // Store root in hot module data to persist across reloads
  const hotData = import.meta.hot.data;
  if (hotData.root) {
    root = hotData.root;
  } else {
    root = createRoot(container);
    hotData.root = root;
  }
} else {
  // Production: create root normally
  root = createRoot(container);
}

root.render(<App />);
