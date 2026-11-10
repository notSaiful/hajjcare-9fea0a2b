import { Suspense, lazy, memo, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { InspectorOnlyRoute } from "@/components/InspectorOnlyRoute";
import { AdminOnlyRoute } from "@/components/AdminOnlyRoute";
import { DevRoleSwitcher } from "@/components/dev/DevRoleSwitcher";

// Handle dynamic import failures (stale cache, network issues)
if (typeof window !== "undefined") {
  window.addEventListener("unhandledrejection", (event) => {
    if (
      event.reason?.message?.includes("Failed to fetch dynamically imported module") ||
      event.reason?.message?.includes("Loading chunk")
    ) {
      const reloadKey = "dynamic-import-reload";
      const hasReloaded = sessionStorage.getItem(reloadKey);
      if (!hasReloaded) {
        sessionStorage.setItem(reloadKey, "true");
        window.location.reload();
      } else {
        sessionStorage.removeItem(reloadKey);
        console.error("Dynamic import failed after reload:", event.reason);
      }
      event.preventDefault();
    }
  });
}

// Eager load landing page for fast initial render
// Lazy load all other pages
const HomePage = lazy(() => import("./pages/HomePage"));
const PreparePage = lazy(() => import("./pages/PreparePage"));
const RitualDetailPage = lazy(() => import("./pages/RitualDetailPage"));
const RulesBriefingPage = lazy(() => import("./pages/RulesBriefingPage"));
const RulesSectionPage = lazy(() => import("./pages/RulesSectionPage"));
const FamilyViewPage = lazy(() => import("./pages/FamilyViewPage"));
const FamilyDashboardPage = lazy(() => import("./pages/FamilyDashboardPage"));
const MapPage = lazy(() => import("./pages/MapPage"));

const FamilyPage = lazy(() => import("./pages/FamilyPage"));
const UmrahGuidePage = lazy(() => import("./pages/UmrahGuidePage"));
const UmrahDetailPage = lazy(() => import("./pages/UmrahDetailPage"));
const MakkahGuidePage = lazy(() => import("./pages/MakkahGuidePage"));
const MakkahGuideDetailPage = lazy(() => import("./pages/MakkahGuideDetailPage"));
const MadinahGuidePage = lazy(() => import("./pages/MadinahGuidePage"));
const MadinahGuideDetailPage = lazy(() => import("./pages/MadinahGuideDetailPage"));
const PreparationGuidePage = lazy(() => import("./pages/PreparationGuidePage"));
const DuaGuidePage = lazy(() => import("./pages/DuaGuidePage"));
const HealthGuidePage = lazy(() => import("./pages/HealthGuidePage"));
const MoneyGuidePage = lazy(() => import("./pages/MoneyGuidePage"));
const TelecomGuidePage = lazy(() => import("./pages/TelecomGuidePage"));
const GrievancesPage = lazy(() => import("./pages/GrievancesPage"));
const ContactNumbersPage = lazy(() => import("./pages/ContactNumbersPage"));
const HajMissionDirectoryPage = lazy(() => import("./pages/HajMissionDirectoryPage"));
const PreHajjIndiaPage = lazy(() => import("./pages/PreHajjIndiaPage"));
const PreHajjIndiaDetailPage = lazy(() => import("./pages/PreHajjIndiaDetailPage"));
const PostHajjGuidePage = lazy(() => import("./pages/PostHajjGuidePage"));
const WomenSolutionsPage = lazy(() => import("./pages/WomenSolutionsPage"));
const SocialsPage = lazy(() => import("./pages/SocialsPage"));
const VideoCallPage = lazy(() => import("./pages/VideoCallPage"));
const QurbaniPage = lazy(() => import("./pages/QurbaniPage"));
const FoodGuidePage = lazy(() => import("./pages/FoodGuidePage"));
const HajjBuildingsPage = lazy(() => import("./pages/HajjBuildingsPage"));
const MedicalFacilitiesPage = lazy(() => import("./pages/MedicalFacilitiesPage"));
const OpenAppPage = lazy(() => import("./pages/OpenAppPage"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ChatPage = lazy(() => import("./pages/ChatPage"));
const TawafCounterPage = lazy(() => import("./pages/TawafCounterPage"));
const HealthHelpPage = lazy(() => import("./pages/HealthHelpPage"));
const CoordinatorDashboardPage = lazy(() => import("./pages/CoordinatorDashboardPage"));
const AdminRolesPage = lazy(() => import("./pages/AdminRolesPage"));
const AdminSEOStatusPage = lazy(() => import("./pages/AdminSEOStatusPage"));
const AdminStaffRequestsPage = lazy(() => import("./pages/AdminStaffRequestsPage"));
const MedicalAlertsPage = lazy(() => import("./pages/MedicalAlertsPage"));
const EmergencyMetricsPage = lazy(() => import("./pages/EmergencyMetricsPage"));
const InspectorDashboardPage = lazy(() => import("./pages/InspectorDashboardPage"));
const HajInspectorsDirectoryPage = lazy(() => import("./pages/HajInspectorsDirectoryPage"));
const ShiProfilePage = lazy(() => import("./pages/ShiProfilePage"));
const InspectorRegisterPage = lazy(() => import("./pages/InspectorRegisterPage"));
const FreeUmrahApplyPage = lazy(() => import("./pages/FreeUmrahApplyPage"));
const FreeUmrahAdminPage = lazy(() => import("./pages/FreeUmrahAdminPage"));
const FreeUmrahStatusPage = lazy(() => import("./pages/FreeUmrahStatusPage"));
const ShiTrainingPage = lazy(() => import("./pages/ShiTrainingPage"));
const FamilyProgressPage = lazy(() => import("./pages/FamilyProgressPage"));
const PrivacyPolicyPage = lazy(() => import("./pages/PrivacyPolicyPage"));
const TermsConditionsPage = lazy(() => import("./pages/TermsConditionsPage"));
const RefundPolicyPage = lazy(() => import("./pages/RefundPolicyPage"));
const ShippingPolicyPage = lazy(() => import("./pages/ShippingPolicyPage"));
const ContactUsPage = lazy(() => import("./pages/ContactUsPage"));
const AboutUsPage = lazy(() => import("./pages/AboutUsPage"));
const PricingDisclosurePage = lazy(() => import("./pages/PricingDisclosurePage"));
const GovtServicesPage = lazy(() => import("./pages/GovtServicesPage"));
const PaymentPage = lazy(() => import("./pages/PaymentPage"));
const BillingHistoryPage = lazy(() => import("./pages/BillingHistoryPage"));
const RewardsPage = lazy(() => import("./pages/RewardsPage"));
const AdminPromoPage = lazy(() => import("./pages/AdminPromoPage"));
const SukoonRdPage = lazy(() => import("./pages/SukoonRdPage"));
const AdminOperatorsPage = lazy(() => import("./pages/AdminOperatorsPage"));
const AdminFraudAlertsPage = lazy(() => import("./pages/AdminFraudAlertsPage"));
const AdminAIDashboardPage = lazy(() => import("./pages/AdminAIDashboardPage"));
const SukoonTrackingMetricsPage = lazy(() => import("./pages/SukoonTrackingMetricsPage"));
const AdminAnalyticsPage = lazy(() => import("./pages/AdminAnalyticsPage"));
const HajjFaqChatPage = lazy(() => import("./pages/HajjFaqChatPage"));
const HajjQueryWizardPage = lazy(() => import("./pages/HajjQueryWizardPage"));
const VolunteerPage = lazy(() => import("./pages/VolunteerPage"));
const VolunteerTrainingPage = lazy(() => import("./pages/VolunteerTrainingPage"));
const VolunteerDashboardPage = lazy(() => import("./pages/VolunteerDashboardPage"));
const ResponderCommandPage = lazy(() => import("./pages/ResponderCommandPage"));
const NationalCommandPage = lazy(() => import("./pages/NationalCommandPage"));
const AdminLiveTrackingPage = lazy(() => import("./pages/AdminLiveTrackingPage"));
const DeploymentRoadmapPage = lazy(() => import("./pages/DeploymentRoadmapPage"));
const ComplianceDashboardPage = lazy(() => import("./pages/ComplianceDashboardPage"));
const AdminWhatsAppApiPage = lazy(() => import("./pages/AdminWhatsAppApiPage"));
const ForbiddenPage = lazy(() => import("./pages/ForbiddenPage"));
const SecuritySettingsPage = lazy(() => import("./pages/SecuritySettingsPage"));
const CircularsPage = lazy(() => import("./pages/CircularsPage"));
const AdminCircularsPage = lazy(() => import("./pages/AdminCircularsPage"));
const AdminControlPanelPage = lazy(() => import("./pages/AdminControlPanelPage"));
const InspectorGroupManagePage = lazy(() => import("./pages/InspectorGroupManagePage"));
const InspectorDirectoryPage = lazy(() => import("./pages/InspectorDirectoryPage"));
const AdminInspectorsPage = lazy(() => import("./pages/AdminInspectorsPage"));
const AdminInspectorUploadPage = lazy(() => import("./pages/AdminInspectorUploadPage"));
const HajiJoinGroupPage = lazy(() => import("./pages/HajiJoinGroupPage"));
const HajiGroupDashboardPage = lazy(() => import("./pages/HajiGroupDashboardPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const LostAndFoundPage = lazy(() => import("./pages/LostAndFoundPage"));
const MashairMapPage = lazy(() => import("./pages/MashairMapPage"));
const MadinahHotelsPage = lazy(() => import("./pages/MadinahHotelsPage"));
const MinaTentLocationsPage = lazy(() => import("./pages/MinaTentLocationsPage"));
const MinaMaktabDetailPage = lazy(() => import("./pages/MinaMaktabDetailPage"));
const ReturnToCampPage = lazy(() => import("./pages/ReturnToCampPage"));
const SaudiSimUpdatePage = lazy(() => import("./pages/SaudiSimUpdatePage"));
const ShiDashboardDemoPage = lazy(() => import("./pages/ShiDashboardDemoPage"));
const HajjTrainingVideosPage = lazy(() => import("./pages/HajjTrainingVideosPage"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

const PageLoader = memo(() => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  </div>
));
PageLoader.displayName = "PageLoader";


function LeaveToDemo() {
  useEffect(() => {
    window.location.replace("/");
  }, []);
  return null;
}

function AppContent() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/volunteer/training" element={<VolunteerTrainingPage />} />
      <Route path="/volunteer" element={<VolunteerPage />} />
      <Route path="/service-fee" element={<PaymentPage />} />
      <Route path="*" element={<LeaveToDemo />} />
    </Routes>
  );
}

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Suspense fallback={<PageLoader />}>
                <AppContent />
              </Suspense>
              <DevRoleSwitcher />
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
