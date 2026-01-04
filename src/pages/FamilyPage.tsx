import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { useFamilyGroup } from "@/hooks/useFamilyGroup";
import { useHajjLocation } from "@/hooks/useHajjLocation";
import { FamilyGroupPanel } from "@/components/FamilyGroupPanel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Users, MapPin, Loader2 } from "lucide-react";
import logo from "@/assets/logo.jpeg";

const FamilyPage = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { t, isRTL } = useLanguage();
  const { group, memberLocations, memberId, updateLocation } = useFamilyGroup();
  const { lat, lng, stage } = useHajjLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Update location for family group
  useEffect(() => {
    if (group && lat && lng) {
      updateLocation(lat, lng, stage);
    }
  }, [group, lat, lng, stage, updateLocation]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const otherMembers = memberLocations.filter(l => l.member_id !== memberId);

  const getStageLabel = (stageKey: string | null) => {
    if (!stageKey) return "-";
    const stageLabels: Record<string, Record<string, string>> = {
      mina_day1: { en: "Mina (Day 1)", ar: "منى (اليوم 1)" },
      arafat: { en: "Arafat", ar: "عرفات" },
      muzdalifah: { en: "Muzdalifah", ar: "مزدلفة" },
      mina_day2: { en: "Mina (Day 2)", ar: "منى (اليوم 2)" },
      mina_day3: { en: "Mina (Day 3)", ar: "منى (اليوم 3)" },
      makkah: { en: "Makkah", ar: "مكة" },
    };
    return stageLabels[stageKey]?.[isRTL ? "ar" : "en"] || stageKey;
  };

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
      <div className="absolute inset-0 islamic-pattern opacity-20 pointer-events-none" />
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50">
        <div className="container max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              {isRTL ? "العودة" : "Back"}
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <img src={logo} alt="Logo" className="w-8 h-8 rounded-full" />
            <span className="font-semibold">{t("familyGroup")}</span>
          </div>
          <div className="w-20" /> {/* Spacer for centering */}
        </div>
      </header>

      <main className="container max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Family Group Panel */}
        <FamilyGroupPanel />

        {/* Family Members Map View */}
        {group && otherMembers.length > 0 && (
          <Card className="bg-card/50 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="h-5 w-5 text-primary" />
                {isRTL ? "مواقع الأعضاء" : "Member Locations"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {otherMembers.map((loc) => (
                  <div 
                    key={loc.member_id}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <Users className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="font-medium">{loc.member_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(loc.updated_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="w-3 h-3 text-primary" />
                        <span className="font-medium">{getStageLabel(loc.current_stage)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <Link to="/map" className="block mt-4">
                <Button variant="outline" className="w-full">
                  {isRTL ? "عرض على الخريطة" : "View on Map"}
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {group && otherMembers.length === 0 && (
          <Card className="bg-card/50 backdrop-blur">
            <CardContent className="py-8 text-center">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">
                {isRTL 
                  ? "شارك رمز الدعوة مع عائلتك للانضمام" 
                  : "Share the invite code with your family to join"
                }
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default FamilyPage;
