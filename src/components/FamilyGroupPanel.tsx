import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useFamilyGroup } from "@/hooks/useFamilyGroup";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Copy, MapPin, LogOut, UserPlus, Plus, Lock } from "lucide-react";
import { PhoneInvite } from "@/components/family/PhoneInvite";
import { useToast } from "@/hooks/use-toast";

export const FamilyGroupPanel = () => {
  const { t, isRTL } = useLanguage();
  const { isAuthenticated } = useAuth();
  const { group, members, memberLocations, isLoading, createGroup, joinGroup, leaveGroup, memberId } = useFamilyGroup();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [inviteCode, setInviteCode] = useState("");

  const handleCreate = async () => {
    if (!groupName.trim()) return;
    await createGroup(groupName);
    setShowCreateForm(false);
    setGroupName("");
  };

  const handleJoin = async () => {
    if (!/^\d{6}$/.test(inviteCode)) {
      toast({ title: "Invalid Code", description: "Invite code must be 6 digits", variant: "destructive" });
      return;
    }
    await joinGroup(inviteCode);
    setShowJoinForm(false);
    setInviteCode("");
  };

  const copyInviteLink = () => {
    if (group) {
      const link = `${window.location.origin}?join=${group.invite_code}`;
      navigator.clipboard.writeText(link);
      toast({ title: t("copied"), description: t("inviteLinkCopied") });
    }
  };

  const getStageLabel = (stage: string | null) => {
    if (!stage) return "-";
    const stageLabels: Record<string, Record<string, string>> = {
      mina_day1: { en: "Mina (Day 1)", ar: "منى (اليوم 1)" },
      arafat: { en: "Arafat", ar: "عرفات" },
      muzdalifah: { en: "Muzdalifah", ar: "مزدلفة" },
      mina_day2: { en: "Mina (Day 2)", ar: "منى (اليوم 2)" },
      mina_day3: { en: "Mina (Day 3)", ar: "منى (اليوم 3)" },
      makkah: { en: "Makkah", ar: "مكة" },
    };
    return stageLabels[stage]?.[isRTL ? "ar" : "en"] || stage;
  };

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardHeader className="pb-2 sm:pb-3 px-4 sm:px-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            {t("familyGroup")}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <div className="text-center py-3 sm:py-4">
            <Lock className="w-7 h-7 sm:w-8 sm:h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-xs sm:text-sm text-muted-foreground mb-3">
              {isRTL ? "سجل دخولك للانضمام لمجموعة عائلية" : "Sign in to join a family group"}
            </p>
            <Button onClick={() => navigate("/auth")} size="sm" className="h-9 sm:h-10">
              {isRTL ? "تسجيل الدخول" : "Sign In"}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!group) {
    return (
      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardHeader className="pb-2 sm:pb-3 px-4 sm:px-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            {t("familyGroup")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6">
          {!showCreateForm && !showJoinForm ? (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1 h-10 sm:h-11 text-sm"
                onClick={() => setShowCreateForm(true)}
              >
                <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                {t("create")}
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 h-10 sm:h-11 text-sm"
                onClick={() => setShowJoinForm(true)}
              >
                <UserPlus className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                {t("join")}
              </Button>
            </div>
          ) : showCreateForm ? (
            <div className="space-y-2.5 sm:space-y-3">
              <Input
                placeholder={t("groupName")}
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                dir={isRTL ? "rtl" : "ltr"}
                className="h-10 sm:h-11"
              />
              <div className="flex gap-2">
                <Button onClick={handleCreate} disabled={isLoading} className="flex-1 h-10 sm:h-11">
                  {t("create")}
                </Button>
                <Button variant="ghost" onClick={() => setShowCreateForm(false)} className="h-10 sm:h-11">
                  {t("cancel")}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2.5 sm:space-y-3">
              <Input
                placeholder={isRTL ? "أدخل 6 أرقام" : "Enter 6-digit code"}
                value={inviteCode}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                  setInviteCode(val);
                }}
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                dir="ltr"
                className="h-10 sm:h-11 text-center tracking-widest font-mono text-lg"
              />
              <div className="flex gap-2">
                <Button onClick={handleJoin} disabled={isLoading} className="flex-1 h-10 sm:h-11">
                  {t("join")}
                </Button>
                <Button variant="ghost" onClick={() => setShowJoinForm(false)} className="h-10 sm:h-11">
                  {t("cancel")}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/50 backdrop-blur border-border/50">
      <CardHeader className="pb-2 sm:pb-3 px-4 sm:px-6">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            {group.name}
          </CardTitle>
          <div className="flex gap-1 sm:gap-2">
            <Button variant="ghost" size="icon" onClick={copyInviteLink} className="h-8 w-8 sm:h-9 sm:w-9">
              <Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={leaveGroup} className="h-8 w-8 sm:h-9 sm:w-9">
              <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>
        <p className="text-[11px] sm:text-xs text-muted-foreground">
          {t("inviteCode")}: <span className="font-mono">{group.invite_code}</span>
        </p>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        <div className="space-y-2">
          <p className="text-xs sm:text-sm font-medium text-muted-foreground">
            {t("members")} ({members.length})
          </p>
          <div className="space-y-1.5 sm:space-y-2 max-h-40 sm:max-h-48 overflow-y-auto">
            {members.map((member) => {
              const location = memberLocations.find(l => l.member_id === member.member_id);
              const isMe = member.member_id === memberId || member.user_id === memberId;
              
              return (
                <div 
                  key={member.id || member.member_id} 
                  className={`flex items-center justify-between p-2 sm:p-2.5 rounded-lg ${isMe ? "bg-primary/10" : "bg-muted/50"}`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${location ? "bg-green-500" : "bg-muted-foreground"}`} />
                    <span className="text-xs sm:text-sm font-medium">
                      {member.member_name}
                      {isMe && <span className="text-[10px] sm:text-xs text-muted-foreground ml-1">({t("you")})</span>}
                    </span>
                  </div>
                  {location && (
                    <div className="flex items-center gap-1 text-[10px] sm:text-xs text-muted-foreground">
                      <MapPin className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                      <span>{getStageLabel(location.current_stage)}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <PhoneInvite />
      </CardContent>
    </Card>
  );
};
