import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useFamilyGroup } from "@/hooks/useFamilyGroup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Copy, MapPin, LogOut, UserPlus, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const FamilyGroupPanel = () => {
  const { t, isRTL } = useLanguage();
  const { group, members, memberLocations, isLoading, createGroup, joinGroup, leaveGroup, memberId } = useFamilyGroup();
  const { toast } = useToast();
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [userName, setUserName] = useState("");
  const [inviteCode, setInviteCode] = useState("");

  const handleCreate = async () => {
    if (!groupName.trim() || !userName.trim()) return;
    await createGroup(groupName, userName);
    setShowCreateForm(false);
    setGroupName("");
    setUserName("");
  };

  const handleJoin = async () => {
    if (!inviteCode.trim() || !userName.trim()) return;
    await joinGroup(inviteCode, userName);
    setShowJoinForm(false);
    setInviteCode("");
    setUserName("");
  };

  const copyInviteLink = () => {
    if (group) {
      const link = `${window.location.origin}?join=${group.invite_code}`;
      navigator.clipboard.writeText(link);
      toast({ title: "Copied!", description: "Invite link copied to clipboard" });
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

  if (!group) {
    return (
      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="h-5 w-5 text-primary" />
            {isRTL ? "مجموعة العائلة" : "Family Group"}
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
                {isRTL ? "إنشاء" : "Create"}
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowJoinForm(true)}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                {isRTL ? "انضمام" : "Join"}
              </Button>
            </div>
          ) : showCreateForm ? (
            <div className="space-y-3">
              <Input
                placeholder={isRTL ? "اسمك" : "Your name"}
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                dir={isRTL ? "rtl" : "ltr"}
              />
              <Input
                placeholder={isRTL ? "اسم المجموعة" : "Group name"}
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                dir={isRTL ? "rtl" : "ltr"}
              />
              <div className="flex gap-2">
                <Button onClick={handleCreate} disabled={isLoading} className="flex-1">
                  {isRTL ? "إنشاء" : "Create"}
                </Button>
                <Button variant="ghost" onClick={() => setShowCreateForm(false)}>
                  {isRTL ? "إلغاء" : "Cancel"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <Input
                placeholder={isRTL ? "اسمك" : "Your name"}
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                dir={isRTL ? "rtl" : "ltr"}
              />
              <Input
                placeholder={isRTL ? "رمز الدعوة" : "Invite code"}
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                dir="ltr"
              />
              <div className="flex gap-2">
                <Button onClick={handleJoin} disabled={isLoading} className="flex-1">
                  {isRTL ? "انضمام" : "Join"}
                </Button>
                <Button variant="ghost" onClick={() => setShowJoinForm(false)}>
                  {isRTL ? "إلغاء" : "Cancel"}
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
          {isRTL ? "رمز الدعوة:" : "Invite code:"} <span className="font-mono">{group.invite_code}</span>
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            {isRTL ? `الأعضاء (${members.length})` : `Members (${members.length})`}
          </p>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {members.map((member) => {
              const location = memberLocations.find(l => l.member_id === member.member_id);
              const isMe = member.member_id === memberId;
              
              return (
                <div 
                  key={member.id} 
                  className={`flex items-center justify-between p-2 rounded-lg ${isMe ? "bg-primary/10" : "bg-muted/50"}`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${location ? "bg-green-500" : "bg-muted-foreground"}`} />
                    <span className="text-sm font-medium">
                      {member.member_name}
                      {isMe && <span className="text-xs text-muted-foreground ml-1">({isRTL ? "أنت" : "you"})</span>}
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
