import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";

// Eager load the home page for fast initial render
import HomePage from "./pages/HomePage";

// Lazy load all other pages for code splitting
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
const PostHajjGuidePage = lazy(() => import("./pages/PostHajjGuidePage"));
const WomenSolutionsPage = lazy(() => import("./pages/WomenSolutionsPage"));
const SocialsPage = lazy(() => import("./pages/SocialsPage"));
const VideoCallPage = lazy(() => import("./pages/VideoCallPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ChatPage = lazy(() => import("./pages/ChatPage"));

const queryClient = new QueryClient();

// Loading fallback for lazy-loaded pages
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="animate-pulse flex flex-col items-center gap-2">
      <div className="w-12 h-12 rounded-full bg-primary/20"></div>
      <div className="h-2 w-24 rounded bg-primary/20"></div>
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
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
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/pre-hajj-india" element={<PreHajjIndiaPage />} />
              <Route path="/post-hajj" element={<PostHajjGuidePage />} />
              <Route path="/women" element={<WomenSolutionsPage />} />
              <Route path="/socials" element={<SocialsPage />} />
              <Route path="/video-call" element={<VideoCallPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
