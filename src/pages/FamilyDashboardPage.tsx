import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SimpleHeader } from "@/components/SimpleHeader";
import { FamilyStatusCard } from "@/components/FamilyStatusCard";
import { PilgrimStatusSettings } from "@/components/PilgrimStatusSettings";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { useFamilyGroup } from "@/hooks/useFamilyGroup";
import { usePilgrimStatus } from "@/hooks/usePilgrimStatus";
import { DASHBOARD_LABELS, PilgrimStatus } from "@/data/familyDashboardContent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Users, Eye, Settings, ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

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
  
  // For family view - get family members' statuses
  const [familyStatuses, setFamilyStatuses] = useState<Record<string, { 
    status: PilgrimStatus; 
    name: string;
    lastUpdated: string;
    sharingEnabled: boolean;
  }>>({});

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Load family member statuses
  useEffect(() => {
    if (!group || !members.length) return;

    const loadFamilyStatuses = async () => {
      const statuses: typeof familyStatuses = {};
      
      for (const member of members) {
        const location = memberLocations.find(l => l.member_id === member.member_id);
        
        // Check if member has sharing enabled (via their profile)
        let sharingEnabled = false;
        if (member.user_id) {
          const { data: profileData } = await supabase
            .from("profiles")
            .select("family_sharing_enabled")
            .eq("user_id", member.user_id)
            .maybeSingle();
          
          sharingEnabled = profileData?.family_sharing_enabled ?? false;
        }
        
        statuses[member.member_id] = {
          status: (location?.pilgrim_status as PilgrimStatus) || "normal",
          name: member.member_name,
          lastUpdated: location?.updated_at || new Date().toISOString(),
          sharingEnabled,
        };
      }
      
      setFamilyStatuses(statuses);
    };

    loadFamilyStatuses();
  }, [group, members, memberLocations]);

  // Refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refreshGroup();
    }, 60000);
    return () => clearInterval(interval);
  }, [refreshGroup]);

  if (authLoading || groupLoading || statusLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Filter members who have sharing enabled for family view
  const visibleMembers = Object.entries(familyStatuses)
    .filter(([_, data]) => data.sharingEnabled);

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
      <SimpleHeader />

      <main className="container max-w-lg mx-auto px-4 py-6">
        {/* Back Button */}
        <Link to="/">
          <Button variant="ghost" size="sm" className="gap-2 -ml-2 mb-4">
            {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            {language === "en" ? "Back" : language === "ar" ? "رجوع" : "واپس"}
          </Button>
        </Link>

        <h1 className="text-heading font-semibold mb-6">{labels.title}</h1>

        {!group ? (
          <Card className="bg-card">
            <CardContent className="py-8 text-center">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                {language === "en" 
                  ? "Join a family group to use the status dashboard" 
                  : language === "ar"
                  ? "انضم إلى مجموعة عائلية لاستخدام لوحة الحالة"
                  : "اسٹیٹس ڈیش بورڈ استعمال کرنے کے لیے فیملی گروپ میں شامل ہوں"
                }
              </p>
              <Link to="/family">
                <Button>{language === "en" ? "Family Group" : language === "ar" ? "مجموعة العائلة" : "فیملی گروپ"}</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="pilgrim" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="pilgrim" className="gap-2">
                <Settings className="w-4 h-4" />
                {labels.pilgrimView}
              </TabsTrigger>
              <TabsTrigger value="family" className="gap-2">
                <Eye className="w-4 h-4" />
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
                  <CardContent className="py-8 text-center">
                    <Eye className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      {language === "en" 
                        ? "No family members are sharing their status" 
                        : language === "ar"
                        ? "لا يوجد أفراد من العائلة يشاركون حالتهم"
                        : "کوئی فیملی ممبر اپنی حالت شیئر نہیں کر رہا"
                      }
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {visibleMembers.map(([memberId, data]) => (
                    <FamilyStatusCard
                      key={memberId}
                      status={data.status}
                      pilgrimName={data.name}
                      lastUpdated={data.lastUpdated}
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
