import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SimpleHeader } from "@/components/SimpleHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { useFamilyGroup } from "@/hooks/useFamilyGroup";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Users, Info, Loader2 } from "lucide-react";

type MemberStatus = "safe" | "assistance" | "emergency";

const FamilyViewPage = () => {
  const { t, isRTL } = useLanguage();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { group, members, memberLocations, memberId, refreshGroup, isLoading } = useFamilyGroup();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    // Refresh every 30 seconds
    const interval = setInterval(() => {
      refreshGroup();
    }, 30000);
    return () => clearInterval(interval);
  }, [refreshGroup]);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Determine member status (in real app this would come from backend)
  const getMemberStatus = (memberId: string): MemberStatus => {
    // Default to safe - in real app this would be real status
    return "safe";
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
      <SimpleHeader />

      <main className="container max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Back Button */}
        <Link to="/">
          <Button variant="ghost" size="sm" className="gap-2 -ml-2">
            {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            {t("backToChat")}
          </Button>
        </Link>

        <h1 className="text-heading font-semibold">{t("familyStatus")}</h1>

        {/* Info Notice */}
        <div className="flex items-start gap-3 p-4 bg-muted rounded-xl">
          <Info className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground">
            {t("noUpdateMeansNormal")}
          </p>
        </div>

        {!group ? (
          <Card className="bg-card">
            <CardContent className="py-8 text-center">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                {isRTL ? "لم تنضم إلى مجموعة عائلية بعد" : "Not in a family group yet"}
              </p>
              <Link to="/family">
                <Button>{t("familyGroup")}</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Group Name */}
            <Card className="bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  {group.name}
                </CardTitle>
              </CardHeader>
            </Card>

            {/* Family Members Status - Read-only */}
            <div className="space-y-3">
              {members.map((member) => {
                const status = getMemberStatus(member.member_id);
                const location = memberLocations.find(l => l.member_id === member.member_id);
                const isMe = member.member_id === memberId || member.user_id === memberId;

                return (
                  <Card 
                    key={member.id || member.member_id} 
                    className={`bg-card ${isMe ? "ring-2 ring-primary/20" : ""}`}
                  >
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-lg">
                            {member.member_name}
                            {isMe && (
                              <span className="text-sm font-normal text-muted-foreground ml-2">
                                ({t("you")})
                              </span>
                            )}
                          </p>
                          {location && (
                            <p className="text-sm text-muted-foreground">
                              {t("lastUpdate")}: {formatTime(location.updated_at)}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {/* Status Only - No location details, no map */}
                      <StatusBadge status={status} />
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default FamilyViewPage;