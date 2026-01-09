import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AppLayout } from "@/components/AppLayout";
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
import HajjGuidePage from "./pages/guides/HajjGuidePage";
import UmrahGuidePage from "./pages/guides/UmrahGuidePage";
import MakkahGuidePage from "./pages/guides/MakkahGuidePage";
import MadinahGuidePage from "./pages/guides/MadinahGuidePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppLayout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/prepare" element={<PreparePage />} />
              <Route path="/prepare/:ritualId" element={<RitualDetailPage />} />
              <Route path="/rules" element={<RulesBriefingPage />} />
              <Route path="/rules/:sectionId" element={<RulesSectionPage />} />
              <Route path="/family-status" element={<FamilyViewPage />} />
              <Route path="/family-dashboard" element={<FamilyDashboardPage />} />
              <Route path="/family" element={<FamilyPage />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/guides/hajj" element={<HajjGuidePage />} />
              <Route path="/guides/hajj/:topicId" element={<RitualDetailPage />} />
              <Route path="/guides/umrah" element={<UmrahGuidePage />} />
              <Route path="/guides/umrah/:topicId" element={<RitualDetailPage />} />
              <Route path="/guides/makkah" element={<MakkahGuidePage />} />
              <Route path="/guides/makkah/:topicId" element={<RitualDetailPage />} />
              <Route path="/guides/madinah" element={<MadinahGuidePage />} />
              <Route path="/guides/madinah/:topicId" element={<RitualDetailPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
