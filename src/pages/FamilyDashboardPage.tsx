import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SimpleHeader } from "@/components/SimpleHeader";
import { FamilyStatusCard } from "@/components/FamilyStatusCard";
import { SukoonLiveDashboard } from "@/components/SukoonLiveDashboard";
import { FamilyAssistancePanel } from "@/components/FamilyAssistancePanel";
import { PilgrimStatusSettings } from "@/components/PilgrimStatusSettings";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { useFamilyGroup } from "@/hooks/useFamilyGroup";
import { useLinkRequests } from "@/hooks/useLinkRequests";
import { usePilgrimStatus } from "@/hooks/usePilgrimStatus";
import { DASHBOARD_LABELS, CALMING_MESSAGE, PilgrimStatus } from "@/data/familyDashboardContent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Eye, Settings, ArrowLeft, ArrowRight, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import kaabaGreenDome from "@/assets/kaaba-green-dome.jpeg";

const FamilyDashboardPage = () => {
  const { language, isRTL } = useLanguage();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { group, members, memberLocations, isLoading: groupLoading, realtimeConnected } = useFamilyGroup();
  const { outgoingRequests, loading: linkRequestsLoading } = useLinkRequests();
  const { 
    status, 
    sharingEnabled, 
    lastUpdated,
    isLoading: statusLoading,
    updateStatus,
    toggleSharing,
  } = usePilgrimStatus();
  
  const navigate = useNavigate();
  const location = useLocation();
  const labels = DASHBOARD_LABELS[language];
  
  // For family view - get family members' statuses (NO timestamps per silence protocol)
  const [familyStatuses, setFamilyStatuses] = useState<Record<string, { 
    status: PilgrimStatus; 
    name: string;
    sharingEnabled: boolean;
  }>>({});

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/auth", {
        replace: true,
        state: { from: `${location.pathname}${location.search}${location.hash}` },
      });
    }
  }, [isAuthenticated, authLoading, location.hash, location.pathname, location.search, navigate]);

  // A family member is visible only when the pilgrim explicitly approved the
  // request. Group membership or an invite code is not location consent.
  useEffect(() => {
    if (!group || !members.length) {
      setFamilyStatuses({});
      return;
    }

    const approvedPilgrimIds = new Set(
      outgoingRequests
        .filter((request) => request.group_id === group.id && request.status === "approved")
        .map((request) => request.target_user_id),
    );

    const statuses: typeof familyStatuses = {};
    members
      .filter((member) => Boolean(member.user_id && approvedPilgrimIds.has(member.user_id)))
      .forEach((member) => {
        const location = memberLocations.find((candidate) => candidate.member_id === member.member_id);
        statuses[member.member_id] = {
          status: (location?.pilgrim_status as PilgrimStatus) || "normal",
          name: member.member_name,
          // RLS removes the row immediately when the pilgrim disables sharing.
          sharingEnabled: Boolean(location),
        };
      });

    setFamilyStatuses(statuses);
  }, [group, members, memberLocations, outgoingRequests]);

  // Silent background refresh removed — useFamilyGroup now handles
  // adaptive polling with Realtime fallback internally.

  const calmingMessage = CALMING_MESSAGE[language];
  
  // SILENCE PROTOCOL: Show calm default state instead of loading spinners
  // "Silence is a signal" - no activity indicators
  if (authLoading || groupLoading || statusLoading || linkRequestsLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
        {/* Show calming message during any loading - no spinners */}
        <div className="w-full max-w-md">
          <div className="flex items-start gap-3 p-5 bg-primary/5 rounded-xl border border-primary/20">
            <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="space-y-2">
              <p className="text-base font-medium text-foreground leading-snug">
                {calmingMessage.main}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {calmingMessage.secondary}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // The server RLS policy is the final authority. This client filter prevents
  // stale local data from briefly rendering after consent is withdrawn.
  const visibleMembers = Object.entries(familyStatuses);
  const visibleLocations = memberLocations.filter((location) => familyStatuses[location.member_id]?.sharingEnabled);

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
      <SimpleHeader />

      <main className="container max-w-2xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6">
        {/* Back Button */}
        <Link to="/">
          <Button variant="ghost" size="sm" className="gap-2 -ml-2 mb-3 sm:mb-4 h-10 sm:h-9 text-sm">
            {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            {language === "en" ? "Back" : language === "ar" ? "رجوع" : "واپس"}
          </Button>
        </Link>

        {/* Kaaba & Green Dome Image */}
        <div className="flex justify-center mb-4 sm:mb-6">
          <div className="h-24 sm:h-32 overflow-hidden flex items-start justify-center">
            <img 
              src={kaabaGreenDome} 
              alt="Kaaba & Green Dome" 
              className="h-28 sm:h-36 w-auto object-cover object-top"
            />
          </div>
        </div>

        <h1 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-center">{labels.title}</h1>

        {/* Connection Status Indicator */}
        {group && (
          <div className="flex items-center justify-center gap-2 mb-4 sm:mb-6">
            <div className={`w-2.5 h-2.5 rounded-full transition-all ${realtimeConnected ? 'bg-green-500 animate-pulse' : 'bg-amber-500'}`} />
            <span className="text-xs sm:text-sm text-muted-foreground">
              {realtimeConnected 
                ? (language === "en" ? "Live tracking" : language === "ar" ? "التتبع المباشر" : "لائیو ٹریکنگ")
                : (language === "en" ? "Sync mode" : language === "ar" ? "وضع المزامنة" : "سنک موڈ")
              }
            </span>
          </div>
        )}

        {!group ? (
          <Card className="bg-card">
            <CardContent className="py-6 sm:py-8 text-center px-4">
              <Users className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground mx-auto mb-3 sm:mb-4" />
              <p className="text-sm sm:text-base text-muted-foreground mb-4">
                {language === "en" 
                  ? "Join a family group to use the status dashboard" 
                  : language === "ar"
                  ? "انضم إلى مجموعة عائلية لاستخدام لوحة الحالة"
                  : "اسٹیٹس ڈیش بورڈ استعمال کرنے کے لیے فیملی گروپ میں شامل ہوں"
                }
              </p>
              <Link to="/sukoon-tracking">
                <Button className="h-11 sm:h-10">{language === "en" ? "Open Sukoon Tracking" : language === "ar" ? "افتح نظام سكون للتتبع" : "سکون ٹریکنگ کھولیں"}</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="pilgrim" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4 sm:mb-6 h-11 sm:h-10">
              <TabsTrigger value="pilgrim" className="gap-1.5 sm:gap-2 text-xs sm:text-sm">
                <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                {labels.pilgrimView}
              </TabsTrigger>
              <TabsTrigger value="family" className="gap-1.5 sm:gap-2 text-xs sm:text-sm">
                <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                {labels.familyView}
              </TabsTrigger>
            </TabsList>

            {/* Pilgrim Settings Tab */}
            <TabsContent value="pilgrim" className="mt-0">
              <PilgrimStatusSettings
                currentStatus={status}
                sharingEnabled={sharingEnabled}
                onStatusChange={updateStatus}
                onSharingChange={toggleSharing}
                isLoading={statusLoading}
              />
            </TabsContent>

            {/* Family View Tab - Read Only */}
            <TabsContent value="family" className="mt-0">
              {visibleMembers.length === 0 ? (
                <Card className="bg-card">
                  <CardContent className="py-6 sm:py-8 text-center px-4">
                    <Eye className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground mx-auto mb-3 sm:mb-4" />
                    <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
                      {language === "en" 
                        ? "Live location is currently unavailable because the pilgrim has disabled location sharing."
                        : language === "ar"
                        ? "لا يوجد أفراد من العائلة يشاركون حالتهم"
                        : "کوئی فیملی ممبر اپنی حالت شیئر نہیں کر رہا"
                      }
                    </p>
                    {/* Always show calming message */}
                    <div className="flex items-start gap-2.5 sm:gap-3 p-3 sm:p-4 bg-primary/5 rounded-xl border border-primary/20 text-left">
                      <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <p className="text-xs sm:text-sm font-medium text-foreground">
                          {calmingMessage.main}
                        </p>
                        <p className="text-[11px] sm:text-xs text-muted-foreground">
                          {calmingMessage.secondary}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4 sm:space-y-6">
                  <SukoonLiveDashboard locations={visibleLocations} />
                  {visibleLocations.length > 0 && <FamilyAssistancePanel locations={visibleLocations} />}
                  {visibleMembers.filter(([_, data]) => data.sharingEnabled).map(([memberId, data]) => (
                    <FamilyStatusCard
                      key={memberId}
                      status={data.status}
                      pilgrimName={data.name}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
};

export default FamilyDashboardPage;
