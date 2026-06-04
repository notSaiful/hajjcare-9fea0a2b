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
import LandingPage from "./pages/LandingPage";

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


function useCriticalPreload() {
  useEffect(() => {
    const preload = () => {
      const routes = [
        () => import("./pages/PreparePage"),
        () => import("./pages/UmrahGuidePage"),
      ];
      routes.forEach((load) => {
        try { load(); } catch { /* non-critical */ }
      });
    };
    if ("requestIdleCallback" in window) {
      (window as any).requestIdleCallback(preload, { timeout: 2000 });
    } else {
      setTimeout(preload, 1000);
    }
  }, []);
}

function AppContent() {
  useCriticalPreload();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />

      {/* Public routes — open without login */}
      <Route path="/home" element={<HomePage />} />
      <Route path="/prepare" element={<PreparePage />} />
      <Route path="/prepare/:ritualId" element={<RitualDetailPage />} />
      <Route path="/umrah" element={<UmrahGuidePage />} />
      <Route path="/umrah/:ritualId" element={<UmrahDetailPage />} />
      <Route path="/makkah-guide" element={<MakkahGuidePage />} />
      <Route path="/makkah-guide/:topicId" element={<MakkahGuideDetailPage />} />
      <Route path="/madinah-guide" element={<MadinahGuidePage />} />
      <Route path="/madinah-guide/:topicId" element={<MadinahGuideDetailPage />} />
      <Route path="/preparation" element={<PreparationGuidePage />} />
      <Route path="/dua" element={<DuaGuidePage />} />
      <Route path="/health" element={<HealthGuidePage />} />
      <Route path="/money" element={<MoneyGuidePage />} />
      <Route path="/telecom" element={<TelecomGuidePage />} />
      <Route path="/grievances" element={<GrievancesPage />} />
      <Route path="/contacts" element={<ContactNumbersPage />} />
      <Route path="/haj-directory" element={<HajMissionDirectoryPage />} />
      <Route path="/rules" element={<RulesBriefingPage />} />
      <Route path="/rules/:sectionId" element={<RulesSectionPage />} />
      <Route path="/family-status" element={<FamilyViewPage />} />
      <Route path="/family-dashboard" element={<FamilyDashboardPage />} />
      <Route path="/family" element={<FamilyPage />} />
      <Route path="/map" element={<MapPage />} />
      <Route path="/hajj-buildings" element={<HajjBuildingsPage />} />
      <Route path="/medical-facilities" element={<MedicalFacilitiesPage />} />
      <Route path="/open" element={<OpenAppPage />} />
      <Route path="/share" element={<OpenAppPage />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/tawaf-counter" element={<TawafCounterPage />} />
      <Route path="/counter" element={<TawafCounterPage />} />
      <Route path="/pre-hajj-india" element={<PreHajjIndiaPage />} />
      <Route path="/pre-hajj-india/:sectionId" element={<PreHajjIndiaDetailPage />} />
      <Route path="/post-hajj" element={<PostHajjGuidePage />} />
      <Route path="/women" element={<WomenSolutionsPage />} />
      <Route path="/socials" element={<SocialsPage />} />
      <Route path="/video-call" element={<VideoCallPage />} />
      <Route path="/qurbani" element={<QurbaniPage />} />
      <Route path="/food-guide" element={<FoodGuidePage />} />
      <Route path="/food" element={<FoodGuidePage />} />
      <Route path="/help" element={<HealthHelpPage />} />
      <Route path="/coordinator" element={<CoordinatorDashboardPage />} />
      <Route path="/medical-alerts" element={<MedicalAlertsPage />} />
      <Route path="/admin/roles" element={<AdminOnlyRoute><AdminRolesPage /></AdminOnlyRoute>} />
      <Route path="/admin/seo" element={<AdminOnlyRoute><AdminSEOStatusPage /></AdminOnlyRoute>} />
      <Route path="/admin/staff-requests" element={<AdminOnlyRoute><AdminStaffRequestsPage /></AdminOnlyRoute>} />
      <Route path="/admin/metrics" element={<AdminOnlyRoute><EmergencyMetricsPage /></AdminOnlyRoute>} />
      <Route path="/inspector" element={<InspectorDashboardPage />} />
      <Route path="/haj-inspectors" element={<HajInspectorsDirectoryPage />} />
      <Route path="/shi/:coverNumber" element={<ShiProfilePage />} />
      <Route path="/inspector-directory" element={<InspectorDirectoryPage />} />
      <Route path="/admin/inspectors" element={<AdminOnlyRoute><AdminInspectorsPage /></AdminOnlyRoute>} />
      <Route path="/admin/inspectors/upload" element={<AdminOnlyRoute><AdminInspectorUploadPage /></AdminOnlyRoute>} />
      <Route path="/inspector-group" element={<InspectorGroupManagePage />} />
        <Route path="/haj-inspector-register" element={<InspectorRegisterPage />} />
        <Route path="/inspector-register" element={<InspectorRegisterPage />} />
        <Route path="/join-group" element={<HajiJoinGroupPage />} />
        <Route path="/my-hajj-group" element={<HajiGroupDashboardPage />} />
      <Route path="/shi-training" element={<ShiTrainingPage />} />
      <Route path="/hajj-progress" element={<FamilyProgressPage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
      <Route path="/terms-conditions" element={<TermsConditionsPage />} />
      <Route path="/refund-policy" element={<RefundPolicyPage />} />
      <Route path="/shipping-policy" element={<ShippingPolicyPage />} />
      <Route path="/contact-us" element={<ContactUsPage />} />
      <Route path="/about-us" element={<AboutUsPage />} />
      <Route path="/pricing" element={<PricingDisclosurePage />} />
      <Route path="/govt-services" element={<GovtServicesPage />} />
      <Route path="/payment" element={<PaymentPage />} />
      <Route path="/billing-history" element={<BillingHistoryPage />} />
      <Route path="/rewards" element={<RewardsPage />} />
      <Route path="/admin/promo" element={<AdminOnlyRoute><AdminPromoPage /></AdminOnlyRoute>} />
      <Route path="/sukoon-rd" element={<SukoonRdPage />} />
      <Route path="/admin/operators" element={<AdminOnlyRoute><AdminOperatorsPage /></AdminOnlyRoute>} />
      <Route path="/admin/fraud-alerts" element={<AdminOnlyRoute><AdminFraudAlertsPage /></AdminOnlyRoute>} />
      <Route path="/admin/ai-dashboard" element={<AdminOnlyRoute><AdminAIDashboardPage /></AdminOnlyRoute>} />
      <Route path="/admin/sukoon-metrics" element={<AdminOnlyRoute><SukoonTrackingMetricsPage /></AdminOnlyRoute>} />
      <Route path="/admin/analytics" element={<AdminOnlyRoute><AdminAnalyticsPage /></AdminOnlyRoute>} />
      <Route path="/hajj-faq" element={<HajjFaqChatPage />} />
      <Route path="/hajj-wizard" element={<HajjQueryWizardPage />} />
      <Route path="/command-center" element={<ResponderCommandPage />} />
      <Route path="/national-command" element={<NationalCommandPage />} />
      <Route path="/admin/live-tracking" element={<AdminOnlyRoute><AdminLiveTrackingPage /></AdminOnlyRoute>} />
      <Route path="/deployment-roadmap" element={<DeploymentRoadmapPage />} />
      <Route path="/admin/compliance" element={<AdminOnlyRoute><ComplianceDashboardPage /></AdminOnlyRoute>} />
      <Route path="/admin/whatsapp-api" element={<AdminOnlyRoute><AdminWhatsAppApiPage /></AdminOnlyRoute>} />
      <Route path="/error/forbidden" element={<ForbiddenPage />} />
      <Route path="/error/rate-limited" element={<ForbiddenPage />} />
      <Route path="/security-settings" element={<SecuritySettingsPage />} />
      <Route path="/circulars" element={<CircularsPage />} />
      <Route path="/admin/circulars" element={<AdminOnlyRoute><AdminCircularsPage /></AdminOnlyRoute>} />

      <Route path="/free-umrah" element={<FreeUmrahApplyPage />} />
      <Route path="/free-umrah/status" element={<FreeUmrahStatusPage />} />
      <Route path="/admin/free-umrah" element={<FreeUmrahAdminPage />} />
      <Route path="/volunteer" element={<VolunteerPage />} />
      <Route path="/admin/volunteers" element={<VolunteerDashboardPage />} />
      <Route path="/admin/panel" element={<AdminControlPanelPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/lost-and-found" element={<LostAndFoundPage />} />
      <Route path="/mashair-map" element={<MashairMapPage />} />
      <Route path="/madinah-hotels" element={<MadinahHotelsPage />} />
      <Route path="/mina-tents" element={<MinaTentLocationsPage />} />
      <Route path="/mina-tent-locations" element={<MinaTentLocationsPage />} />
      <Route path="/mina-tents/:maktabId" element={<MinaMaktabDetailPage />} />
      <Route path="/return-to-camp" element={<ReturnToCampPage />} />
      <Route path="/lost" element={<ReturnToCampPage />} />
      <Route path="*" element={<NotFound />} />
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
