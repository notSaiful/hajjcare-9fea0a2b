import { Suspense, lazy, memo, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

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
const AuthPage = lazy(() => import("./pages/AuthPage"));
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
const NotFound = lazy(() => import("./pages/NotFound"));
const ChatPage = lazy(() => import("./pages/ChatPage"));
const HealthHelpPage = lazy(() => import("./pages/HealthHelpPage"));
const CoordinatorDashboardPage = lazy(() => import("./pages/CoordinatorDashboardPage"));
const AdminRolesPage = lazy(() => import("./pages/AdminRolesPage"));
const MedicalAlertsPage = lazy(() => import("./pages/MedicalAlertsPage"));
const EmergencyMetricsPage = lazy(() => import("./pages/EmergencyMetricsPage"));
const InspectorDashboardPage = lazy(() => import("./pages/InspectorDashboardPage"));
const HajInspectorsDirectoryPage = lazy(() => import("./pages/HajInspectorsDirectoryPage"));
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
const DeploymentRoadmapPage = lazy(() => import("./pages/DeploymentRoadmapPage"));
const ComplianceDashboardPage = lazy(() => import("./pages/ComplianceDashboardPage"));
const AdminWhatsAppApiPage = lazy(() => import("./pages/AdminWhatsAppApiPage"));
const ForbiddenPage = lazy(() => import("./pages/ForbiddenPage"));
const SecuritySettingsPage = lazy(() => import("./pages/SecuritySettingsPage"));

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

/** Helper: wrap a page element with ProtectedRoute */
function P({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

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

      {/* Protected routes */}
      <Route path="/home" element={<P><HomePage /></P>} />
      <Route path="/prepare" element={<P><PreparePage /></P>} />
      <Route path="/prepare/:ritualId" element={<P><RitualDetailPage /></P>} />
      <Route path="/umrah" element={<P><UmrahGuidePage /></P>} />
      <Route path="/umrah/:ritualId" element={<P><UmrahDetailPage /></P>} />
      <Route path="/makkah-guide" element={<P><MakkahGuidePage /></P>} />
      <Route path="/makkah-guide/:topicId" element={<P><MakkahGuideDetailPage /></P>} />
      <Route path="/madinah-guide" element={<P><MadinahGuidePage /></P>} />
      <Route path="/madinah-guide/:topicId" element={<P><MadinahGuideDetailPage /></P>} />
      <Route path="/preparation" element={<P><PreparationGuidePage /></P>} />
      <Route path="/dua" element={<P><DuaGuidePage /></P>} />
      <Route path="/health" element={<P><HealthGuidePage /></P>} />
      <Route path="/money" element={<P><MoneyGuidePage /></P>} />
      <Route path="/telecom" element={<P><TelecomGuidePage /></P>} />
      <Route path="/grievances" element={<P><GrievancesPage /></P>} />
      <Route path="/contacts" element={<P><ContactNumbersPage /></P>} />
      <Route path="/haj-directory" element={<P><HajMissionDirectoryPage /></P>} />
      <Route path="/rules" element={<P><RulesBriefingPage /></P>} />
      <Route path="/rules/:sectionId" element={<P><RulesSectionPage /></P>} />
      <Route path="/family-status" element={<P><FamilyViewPage /></P>} />
      <Route path="/family-dashboard" element={<P><FamilyDashboardPage /></P>} />
      <Route path="/family" element={<P><FamilyPage /></P>} />
      <Route path="/map" element={<P><MapPage /></P>} />
      <Route path="/chat" element={<P><ChatPage /></P>} />
      <Route path="/pre-hajj-india" element={<P><PreHajjIndiaPage /></P>} />
      <Route path="/pre-hajj-india/:sectionId" element={<P><PreHajjIndiaDetailPage /></P>} />
      <Route path="/post-hajj" element={<P><PostHajjGuidePage /></P>} />
      <Route path="/women" element={<P><WomenSolutionsPage /></P>} />
      <Route path="/socials" element={<P><SocialsPage /></P>} />
      <Route path="/video-call" element={<P><VideoCallPage /></P>} />
      <Route path="/qurbani" element={<P><QurbaniPage /></P>} />
      <Route path="/food-guide" element={<P><FoodGuidePage /></P>} />
      <Route path="/food" element={<P><FoodGuidePage /></P>} />
      <Route path="/help" element={<P><HealthHelpPage /></P>} />
      <Route path="/coordinator" element={<P><CoordinatorDashboardPage /></P>} />
      <Route path="/medical-alerts" element={<P><MedicalAlertsPage /></P>} />
      <Route path="/admin/roles" element={<P><AdminRolesPage /></P>} />
      <Route path="/admin/metrics" element={<P><EmergencyMetricsPage /></P>} />
      <Route path="/inspector" element={<P><InspectorDashboardPage /></P>} />
      <Route path="/haj-inspectors" element={<P><HajInspectorsDirectoryPage /></P>} />
      <Route path="/haj-inspector-register" element={<P><InspectorRegisterPage /></P>} />
      <Route path="/free-umrah" element={<P><FreeUmrahApplyPage /></P>} />
      <Route path="/free-umrah/status" element={<P><FreeUmrahStatusPage /></P>} />
      <Route path="/admin/free-umrah" element={<P><FreeUmrahAdminPage /></P>} />
      <Route path="/shi-training" element={<P><ShiTrainingPage /></P>} />
      <Route path="/hajj-progress" element={<P><FamilyProgressPage /></P>} />
      <Route path="/privacy-policy" element={<P><PrivacyPolicyPage /></P>} />
      <Route path="/terms-conditions" element={<P><TermsConditionsPage /></P>} />
      <Route path="/refund-policy" element={<P><RefundPolicyPage /></P>} />
      <Route path="/shipping-policy" element={<P><ShippingPolicyPage /></P>} />
      <Route path="/contact-us" element={<P><ContactUsPage /></P>} />
      <Route path="/about-us" element={<P><AboutUsPage /></P>} />
      <Route path="/pricing" element={<P><PricingDisclosurePage /></P>} />
      <Route path="/govt-services" element={<P><GovtServicesPage /></P>} />
      <Route path="/payment" element={<P><PaymentPage /></P>} />
      <Route path="/billing-history" element={<P><BillingHistoryPage /></P>} />
      <Route path="/rewards" element={<P><RewardsPage /></P>} />
      <Route path="/admin/promo" element={<P><AdminPromoPage /></P>} />
      <Route path="/sukoon-rd" element={<P><SukoonRdPage /></P>} />
      <Route path="/admin/operators" element={<P><AdminOperatorsPage /></P>} />
      <Route path="/admin/fraud-alerts" element={<P><AdminFraudAlertsPage /></P>} />
      <Route path="/admin/ai-dashboard" element={<P><AdminAIDashboardPage /></P>} />
      <Route path="/admin/sukoon-metrics" element={<P><SukoonTrackingMetricsPage /></P>} />
      <Route path="/admin/analytics" element={<P><AdminAnalyticsPage /></P>} />
      <Route path="/hajj-faq" element={<P><HajjFaqChatPage /></P>} />
      <Route path="/hajj-wizard" element={<P><HajjQueryWizardPage /></P>} />
      <Route path="/volunteer" element={<P><VolunteerPage /></P>} />
      <Route path="/admin/volunteers" element={<P><VolunteerDashboardPage /></P>} />
      <Route path="/command-center" element={<P><ResponderCommandPage /></P>} />
      <Route path="/national-command" element={<P><NationalCommandPage /></P>} />
      <Route path="/deployment-roadmap" element={<P><DeploymentRoadmapPage /></P>} />
      <Route path="/admin/compliance" element={<P><ComplianceDashboardPage /></P>} />
      <Route path="/admin/whatsapp-api" element={<P><AdminWhatsAppApiPage /></P>} />
      <Route path="/error/forbidden" element={<P><ForbiddenPage /></P>} />
      <Route path="/error/rate-limited" element={<P><ForbiddenPage /></P>} />
      <Route path="/security-settings" element={<P><SecuritySettingsPage /></P>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
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
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
