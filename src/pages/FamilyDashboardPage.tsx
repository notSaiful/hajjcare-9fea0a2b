import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SimpleHeader } from "@/components/SimpleHeader";
import { FamilyStatusCard } from "@/components/FamilyStatusCard";
import { PilgrimStatusSettings } from "@/components/PilgrimStatusSettings";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { useFamilyGroup } from "@/hooks/useFamilyGroup";
import { usePilgrimStatus } from "@/hooks/usePilgrimStatus";
import { DASHBOARD_LABELS, CALMING_MESSAGE, PilgrimStatus } from "@/data/familyDashboardContent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Eye, Settings, ArrowLeft, ArrowRight, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import kaabaGreenDome from "@/assets/kaaba-green-dome.jpeg";

const FamilyDashboardPage = () => {
  const { language, isRTL } = useLanguage();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { group, members, memberLocations, refreshGroup, isLoading: groupLoading } = useFamilyGroup();
  const { 
    status, 
    sharingEnabled, 
    lastUpdated,
    isLoading: statusLoading,
    updateStatus,
    toggleSharing,
  } = usePilgrimStatus();
  
  const navigate = useNavigate();
  const labels = DASHBOARD_LABELS[language];
  
  // For family view - get family members' statuses (NO timestamps per silence protocol)
  const [familyStatuses, setFamilyStatuses] = useState<Record<string, { 
    status: PilgrimStatus; 
    name: string;
    sharingEnabled: boolean;
  }>>({});

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Load family member statuses - NO timestamps (silence protocol)
  useEffect(() => {
    if (!group || !members.length) return;

    const loadFamilyStatuses = async () => {
      const statuses: typeof familyStatuses = {};
      
      for (const member of members) {
        const location = memberLocations.find(l => l.member_id === member.member_id);
        
        // Check if member has sharing enabled (via limited profile view)
        // Using profiles_limited view which excludes phone/emergency_contact for privacy
        let sharingEnabled = false;
        if (member.user_id) {
          const { data: profileData } = await supabase
            .from("profiles_limited" as "profiles")
            .select("family_sharing_enabled")
            .eq("user_id", member.user_id)
            .maybeSingle();
          
          sharingEnabled = (profileData as { family_sharing_enabled: boolean } | null)?.family_sharing_enabled ?? false;
        }
        
        // FAIL-SAFE: Default to "normal" if no data - per silence protocol
        statuses[member.member_id] = {
          status: (location?.pilgrim_status as PilgrimStatus) || "normal",
          name: member.member_name,
          sharingEnabled,
        };
      }
      
      setFamilyStatuses(statuses);
    };

    loadFamilyStatuses();
  }, [group, members, memberLocations]);

  // Silent background refresh removed — useFamilyGroup now handles
  // adaptive polling with Realtime fallback internally.

  const calmingMessage = CALMING_MESSAGE[language];
  
  // SILENCE PROTOCOL: Show calm default state instead of loading spinners
  // "Silence is a signal" - no activity indicators
  if (authLoading || groupLoading || statusLoading) {
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

  // Filter members who have sharing enabled for family view
  const visibleMembers = Object.entries(familyStatuses)
    .filter(([_, data]) => data.sharingEnabled);

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
              <Link to="/family">
                <Button className="h-11 sm:h-10">{language === "en" ? "Family Group" : language === "ar" ? "مجموعة العائلة" : "فیملی گروپ"}</Button>
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
                        ? "No family members are sharing their status" 
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
                  {visibleMembers.map(([memberId, data]) => (
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
