import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useFamilyGroup } from "@/hooks/useFamilyGroup";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Copy, MapPin, LogOut, UserPlus, Plus, Lock } from "lucide-react";
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
    if (!inviteCode.trim()) return;
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
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="h-5 w-5 text-primary" />
            {t("familyGroup")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <Lock className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground mb-3">
              {isRTL ? "سجل دخولك للانضمام لمجموعة عائلية" : "Sign in to join a family group"}
            </p>
            <Button onClick={() => navigate("/auth")} size="sm">
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
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="h-5 w-5 text-primary" />
            {t("familyGroup")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!showCreateForm && !showJoinForm ? (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowCreateForm(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                {t("create")}
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowJoinForm(true)}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                {t("join")}
              </Button>
            </div>
          ) : showCreateForm ? (
            <div className="space-y-3">
              <Input
                placeholder={t("groupName")}
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                dir={isRTL ? "rtl" : "ltr"}
              />
              <div className="flex gap-2">
                <Button onClick={handleCreate} disabled={isLoading} className="flex-1">
                  {t("create")}
                </Button>
                <Button variant="ghost" onClick={() => setShowCreateForm(false)}>
                  {t("cancel")}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <Input
                placeholder={t("inviteCode")}
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                dir="ltr"
              />
              <div className="flex gap-2">
                <Button onClick={handleJoin} disabled={isLoading} className="flex-1">
                  {t("join")}
                </Button>
                <Button variant="ghost" onClick={() => setShowJoinForm(false)}>
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
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="h-5 w-5 text-primary" />
            {group.name}
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={copyInviteLink}>
              <Copy className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={leaveGroup}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          {t("inviteCode")}: <span className="font-mono">{group.invite_code}</span>
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            {t("members")} ({members.length})
          </p>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {members.map((member) => {
              const location = memberLocations.find(l => l.member_id === member.member_id);
              const isMe = member.member_id === memberId || member.user_id === memberId;
              
              return (
                <div 
                  key={member.id || member.member_id} 
                  className={`flex items-center justify-between p-2 rounded-lg ${isMe ? "bg-primary/10" : "bg-muted/50"}`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${location ? "bg-green-500" : "bg-muted-foreground"}`} />
                    <span className="text-sm font-medium">
                      {member.member_name}
                      {isMe && <span className="text-xs text-muted-foreground ml-1">({t("you")})</span>}
                    </span>
                  </div>
                  {location && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{getStageLabel(location.current_stage)}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
