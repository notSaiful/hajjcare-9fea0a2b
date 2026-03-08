import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, Loader2, User, Phone, MapPin, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const labels = {
  en: { title: "My Profile", name: "Full Name", phone: "Phone", embarkation: "Embarkation Point", emergency: "Emergency Contact", save: "Save Changes", saving: "Saving...", saved: "Profile updated!", back: "Back", security: "Security Settings" },
  ur: { title: "میری پروفائل", name: "پورا نام", phone: "فون", embarkation: "روانگی مقام", emergency: "ہنگامی رابطہ", save: "تبدیلیاں محفوظ کریں", saving: "محفوظ ہو رہا...", saved: "پروفائل اپڈیٹ!", back: "واپس", security: "سیکیورٹی سیٹنگز" },
  hi: { title: "मेरी प्रोफाइल", name: "पूरा नाम", phone: "फोन", embarkation: "रवानगी स्थान", emergency: "आपातकालीन संपर्क", save: "बदलाव सेव करें", saving: "सेव हो रहा...", saved: "प्रोफाइल अपडेट!", back: "वापस", security: "सुरक्षा सेटिंग्स" },
  ar: { title: "ملفي الشخصي", name: "الاسم الكامل", phone: "الهاتف", embarkation: "نقطة المغادرة", emergency: "جهة اتصال طوارئ", save: "حفظ التغييرات", saving: "جاري الحفظ...", saved: "تم تحديث الملف!", back: "رجوع", security: "إعدادات الأمان" },
};

const ProfilePage = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuthContext();
  const { language, isRTL } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const t = labels[language as keyof typeof labels] || labels.en;

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [embarkation, setEmbarkation] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [saving, setSaving] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/auth");
      return;
    }
    if (user) {
      (async () => {
        const { data } = await supabase
          .from("profiles")
          .select("full_name, phone, embarkation_point, emergency_contact")
          .eq("user_id", user.id)
          .maybeSingle();
        if (data) {
          setFullName(data.full_name || "");
          setPhone(data.phone || "");
          setEmbarkation(data.embarkation_point || "");
          setEmergencyContact(data.emergency_contact || "");
        }
        setLoadingProfile(false);
      })();
    }
  }, [user, authLoading, isAuthenticated, navigate]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        phone,
        embarkation_point: embarkation,
        emergency_contact: emergencyContact,
      })
      .eq("user_id", user.id);
    setSaving(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: t.saved });
    }
  };

  if (authLoading || loadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 max-w-lg mx-auto" dir={isRTL ? "rtl" : "ltr"}>
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-bold text-foreground">{t.title}</h1>
      </div>

      <Card className="mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
            {t.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="fullName">{t.name}</Label>
            <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone" className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" /> {t.phone}
            </Label>
            <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="embarkation" className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> {t.embarkation}
            </Label>
            <Input id="embarkation" value={embarkation} onChange={(e) => setEmbarkation(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="emergency">{t.emergency}</Label>
            <Input id="emergency" value={emergencyContact} onChange={(e) => setEmergencyContact(e.target.value)} />
          </div>

          <Button onClick={handleSave} disabled={saving} className="w-full gap-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? t.saving : t.save}
          </Button>
        </CardContent>
      </Card>

      <Button variant="outline" className="w-full gap-2" onClick={() => navigate("/security-settings")}>
        <Shield className="w-4 h-4" />
        {t.security}
      </Button>
    </div>
  );
};

export default ProfilePage;
