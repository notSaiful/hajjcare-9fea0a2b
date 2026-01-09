import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import HomePage from "./pages/HomePage";
import PreparePage from "./pages/PreparePage";
import RitualDetailPage from "./pages/RitualDetailPage";
import RulesBriefingPage from "./pages/RulesBriefingPage";
import RulesSectionPage from "./pages/RulesSectionPage";
import FamilyViewPage from "./pages/FamilyViewPage";
import FamilyDashboardPage from "./pages/FamilyDashboardPage";
import MapPage from "./pages/MapPage";
import AuthPage from "./pages/AuthPage";
import FamilyPage from "./pages/FamilyPage";
import UmrahGuidePage from "./pages/UmrahGuidePage";
import UmrahDetailPage from "./pages/UmrahDetailPage";
import MakkahGuidePage from "./pages/MakkahGuidePage";
import MakkahGuideDetailPage from "./pages/MakkahGuideDetailPage";
import MadinahGuidePage from "./pages/MadinahGuidePage";
import MadinahGuideDetailPage from "./pages/MadinahGuideDetailPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
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
            <Route path="/rules" element={<RulesBriefingPage />} />
            <Route path="/rules/:sectionId" element={<RulesSectionPage />} />
            <Route path="/family-status" element={<FamilyViewPage />} />
            <Route path="/family-dashboard" element={<FamilyDashboardPage />} />
            <Route path="/family" element={<FamilyPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/auth" element={<AuthPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
