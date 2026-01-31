import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SimpleHeader } from "@/components/SimpleHeader";
import { HajjProgressTimeline } from "@/components/HajjProgressTimeline";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { useFamilyGroup } from "@/hooks/useFamilyGroup";
import { PROGRESS_LABELS } from "@/data/hajjStagesContent";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Users, Shield, Loader2, Radio } from "lucide-react";

/**
 * Family Progress Dashboard
 * 
 * For relatives in India to track their elderly parents' Hajj journey.
 * 
 * Design Philosophy (Silence Protocol):
 * - NO refresh buttons (creates anxiety)
 * - NO loading spinners during updates
 * - NO timestamps (creates refresh obsession)
 * - ONE calm view, automatic updates via realtime
 * - "No news is good news" messaging
 * - Subtle "Live" indicator shows realtime connection
 */
const FamilyProgressPage = () => {
  const { language, isRTL } = useLanguage();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { group, members, memberLocations, memberId, isLoading } = useFamilyGroup();
  const navigate = useNavigate();
  const [isLive, setIsLive] = useState(true);
  
  const labels = PROGRESS_LABELS[language] || PROGRESS_LABELS.en;

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Realtime is handled by useFamilyGroup hook - no polling needed
  // The hook subscribes to member_locations changes and updates memberLocations state

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Get other family members (not self)
  const otherMembers = members.filter(m => m.member_id !== memberId && m.user_id !== memberId);
  
  return (
    <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
      <SimpleHeader />

      <main className="container max-w-2xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Back Button */}
        <div className="flex items-center justify-between">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2 -ml-2 h-10 sm:h-9 text-sm">
              {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
              Home
            </Button>
          </Link>
          
          {/* Subtle Live Indicator */}
          {group && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Radio className="w-3 h-3 text-primary animate-pulse" />
              <span>Live</span>
            </div>
          )}
        </div>

        {/* Page Title */}
        <div className="text-center space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">
            {labels.title}
          </h1>
          <p className="text-sm text-muted-foreground">{labels.subtitle}</p>
        </div>

        {!group ? (
          /* No Group State */
          <Card className="bg-card">
            <CardContent className="py-8 sm:py-12 text-center px-4">
              <Users className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-base sm:text-lg text-muted-foreground mb-4">
                {labels.noGroup}
              </p>
              <Link to="/family">
                <Button size="lg" className="h-11 sm:h-12">
                  {labels.joinGroup}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : otherMembers.length === 0 ? (
          /* No Other Members */
          <Card className="bg-card">
            <CardContent className="py-8 sm:py-12 text-center px-4">
              <Users className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-base sm:text-lg text-muted-foreground mb-2">
                {isRTL ? "لا يوجد أعضاء آخرون في مجموعتك" : "No other members in your group yet"}
              </p>
              <p className="text-sm text-muted-foreground">
                {isRTL 
                  ? "شارك رمز الدعوة مع عائلتك للانضمام" 
                  : "Share your invite code with family to join"
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          /* Family Members Progress */
          <div className="space-y-4 sm:space-y-6">
            {otherMembers.map((member) => {
              const location = memberLocations.find(l => l.member_id === member.member_id);
              const currentStage = location?.current_stage || null;

              return (
                <Card key={member.id || member.member_id} className="bg-card overflow-hidden">
                  <CardContent className="p-4 sm:p-6">
                    <HajjProgressTimeline 
                      currentStage={currentStage}
                      pilgrimName={member.member_name}
                    />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Calming Message - Always visible when in group */}
        {group && (
          <div className="flex items-start gap-3 p-4 sm:p-5 bg-primary/5 rounded-xl border border-primary/20">
            <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="space-y-1.5">
              <p className="text-sm sm:text-base font-medium text-foreground leading-snug">
                {labels.calmingMain}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {labels.calmingSecondary}
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default FamilyProgressPage;
