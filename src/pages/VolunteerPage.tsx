import { useState } from "react";
import { SimpleHeader } from "@/components/SimpleHeader";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Heart, Users, Shield, Clock, CheckCircle2, Loader2, HandHeart, Star } from "lucide-react";

const SKILLS = [
  { value: "ground_volunteer", label: "ग्राउंड वॉलंटियर (Embarkation duty)", labelEn: "Ground Volunteer" },
  { value: "helpdesk", label: "हेल्पडेस्क / कॉल सपोर्ट", labelEn: "Helpdesk / Call Support" },
  { value: "family_update", label: "फैमिली अपडेट टीम", labelEn: "Family Update Team" },
  { value: "tech_support", label: "टेक्निकल सपोर्ट", labelEn: "Technical Support" },
  { value: "translation", label: "ट्रांसलेशन (Hindi/Urdu/English/Arabic)", labelEn: "Translation" },
  { value: "medical", label: "मेडिकल बैकग्राउंड", labelEn: "Medical Background" },
  { value: "logistics", label: "लॉजिस्टिक्स / मैनेजमेंट", labelEn: "Logistics / Management" },
];

const LANGUAGES = [
  { value: "hindi", label: "हिंदी" },
  { value: "urdu", label: "اردو" },
  { value: "english", label: "English" },
  { value: "arabic", label: "العربية" },
  { value: "marathi", label: "मराठी" },
];

const AVAILABILITY = [
  { value: "3", label: "3 दिन (3 Days)" },
  { value: "7", label: "7 दिन (7 Days)" },
  { value: "15", label: "15 दिन (15 Days)" },
  { value: "full_season", label: "पूरा सीज़न (Full Season)" },
];

const DUTY_LOCATIONS = [
  { value: "embarkation", label: "Embarkation City" },
  { value: "local", label: "Local City" },
  { value: "remote", label: "Remote (Call / Tech Support)" },
];

const INDIAN_STATES = [
  "Andhra Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jammu & Kashmir", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
];

const DECLARATIONS = [
  "मैं समय की पाबंदी रखूँगा/रखूँगी",
  "बिना अनुमति ड्यूटी नहीं छोड़ूँगा/छोड़ूँगी",
  "हाजी की जानकारी गोपनीय रखूँगा/रखूँगी",
  "संगठन के नियमों का पालन करूँगा/करूँगी",
];

const VolunteerPage = () => {
  const { toast } = useToast();
  const { isRTL } = useLanguage();
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [volunteerId, setVolunteerId] = useState("");

  const [form, setForm] = useState({
    full_name: "",
    father_name: "",
    age: "",
    mobile: "",
    whatsapp: "",
    email: "",
    full_address: "",
    city: "",
    district: "",
    state: "",
    skills: [] as string[],
    availability_days: "",
    duty_location: "",
    languages: [] as string[],
    other_language: "",
    declaration_agreed: false,
  });

  const toggleArray = (key: "skills" | "languages", value: string) => {
    setForm(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter(v => v !== value)
        : [...prev[key], value],
    }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!form.full_name || !form.father_name || !form.age || !form.mobile || !form.whatsapp || !form.full_address || !form.city || !form.district || !form.state) {
      toast({ title: "कृपया सभी अनिवार्य फ़ील्ड भरें", description: "Please fill all required fields", variant: "destructive" });
      return;
    }
    if (form.mobile.length !== 10 || !/^\d{10}$/.test(form.mobile)) {
      toast({ title: "मोबाइल नंबर 10 अंकों का होना चाहिए", variant: "destructive" });
      return;
    }
    if (form.skills.length === 0) {
      toast({ title: "कम से कम एक स्किल चुनें", variant: "destructive" });
      return;
    }
    if (!form.availability_days || !form.duty_location) {
      toast({ title: "Availability और Duty Location चुनें", variant: "destructive" });
      return;
    }
    if (form.languages.length === 0) {
      toast({ title: "कम से कम एक भाषा चुनें", variant: "destructive" });
      return;
    }
    if (!form.declaration_agreed) {
      toast({ title: "कृपया Declaration को स्वीकार करें", variant: "destructive" });
      return;
    }

    const age = parseInt(form.age);
    if (isNaN(age) || age < 18 || age > 65) {
      toast({ title: "उम्र 18-65 के बीच होनी चाहिए", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      // Check duplicate mobile
      const { data: existing } = await (supabase as any)
        .from("volunteers")
        .select("volunteer_id")
        .eq("mobile", form.mobile)
        .maybeSingle();

      if (existing) {
        toast({ title: "इस मोबाइल नंबर से पहले ही रजिस्ट्रेशन हो चुका है", description: `ID: ${existing.volunteer_id}`, variant: "destructive" });
        setSubmitting(false);
        return;
      }

      const langs = [...form.languages];
      if (form.other_language.trim()) langs.push(form.other_language.trim());

      const { data, error } = await (supabase as any)
        .from("volunteers")
        .insert({
          full_name: form.full_name.trim(),
          father_name: form.father_name.trim(),
          age,
          mobile: form.mobile.trim(),
          whatsapp: form.whatsapp.trim(),
          email: form.email.trim() || null,
          full_address: form.full_address.trim(),
          city: form.city.trim(),
          district: form.district.trim(),
          state: form.state,
          skills: form.skills,
          availability_days: form.availability_days,
          duty_location: form.duty_location,
          languages: langs,
          declaration_agreed: true,
          volunteer_id: "TEMP", // Will be overwritten by trigger
        })
        .select("volunteer_id")
        .single();

      if (error) throw error;

      setVolunteerId(data.volunteer_id);
      setSuccess(true);
      toast({ title: "✅ रजिस्ट्रेशन सफल!", description: `आपकी Volunteer ID: ${data.volunteer_id}` });
    } catch (err: any) {
      console.error("Volunteer registration error:", err);
      toast({ title: "रजिस्ट्रेशन में त्रुटि", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
        <SimpleHeader />
        <main className="container max-w-2xl mx-auto px-4 py-8">
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
            <CardContent className="p-8 text-center space-y-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">जज़ाकल्लाहु खैरन! 🤲</h2>
              <p className="text-muted-foreground">आपका रजिस्ट्रेशन सफलतापूर्वक हो गया है</p>
              <div className="bg-card border rounded-xl p-4 space-y-2">
                <p className="text-sm text-muted-foreground">आपकी Volunteer ID</p>
                <p className="text-2xl font-mono font-bold text-primary">{volunteerId}</p>
              </div>
              <div className="bg-muted/50 rounded-xl p-4 text-sm text-muted-foreground space-y-1">
                <p>📋 अगला कदम: Screening → Training → Deployment</p>
                <p>📞 हमारी टीम जल्द ही आपसे संपर्क करेगी</p>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
      <SimpleHeader />
      <main className="container max-w-2xl mx-auto px-4 py-6 space-y-6">

        {/* Landing Prompt */}
        {!showForm && (
          <div className="space-y-6 animate-fade-up">
            <Card className="border-primary/20 overflow-hidden">
              <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background p-6 sm:p-8 text-center space-y-5">
                <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                  <HandHeart className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-foreground leading-snug">
                  क्या आप हज पर जाने वाले हाजियों की खिदमत करना चाहते हैं?
                </h1>
                <p className="text-base text-primary font-semibold">
                  हज की खिदमत सिर्फ सेवा नहीं — ये अमानत है।
                </p>

                <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto text-left">
                  {[
                    { icon: Shield, text: "अनुशासन में काम" },
                    { icon: Clock, text: "समय दे सकते हैं" },
                    { icon: Users, text: "जिम्मेदारी उठा सकते हैं" },
                    { icon: Star, text: "सवाब कमाना चाहते हैं" },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-2 p-2 rounded-lg bg-card border">
                      <Icon className="w-4 h-4 text-primary shrink-0" />
                      <span className="text-xs sm:text-sm text-foreground">{text}</span>
                    </div>
                  ))}
                </div>

                <p className="text-sm text-muted-foreground">
                  तो <span className="font-semibold text-foreground">HajjCare AI Support Volunteer Team</span> से जुड़िए।
                </p>
                <p className="text-xs text-muted-foreground">👉 नीचे फॉर्म भरें — हमारी टीम आपसे संपर्क करेगी</p>

                <Button size="lg" className="w-full max-w-xs text-base" onClick={() => setShowForm(true)}>
                  <Heart className="w-5 h-5" />
                  REGISTER AS VOLUNTEER
                </Button>
              </div>
            </Card>

            {/* Selection Process */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Selection & Training Funnel</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {["Registration", "Screening", "Shortlisted", "Online Training", "Assessment", "Final Deployment"].map((step, i) => (
                    <div key={step} className="flex items-center gap-1">
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">{step}</span>
                      {i < 5 && <span className="text-muted-foreground text-xs">→</span>}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Registration Form */}
        {showForm && (
          <div className="space-y-5 animate-fade-up">
            <h2 className="text-lg font-bold text-foreground">📝 Volunteer Registration Form</h2>

            {/* A. Basic Identity */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">A</span>
                  Basic Identity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">पूरा नाम *</Label>
                    <Input placeholder="Full Name" value={form.full_name} onChange={e => setForm(p => ({ ...p, full_name: e.target.value }))} />
                  </div>
                  <div>
                    <Label className="text-xs">पिता का नाम *</Label>
                    <Input placeholder="Father's Name" value={form.father_name} onChange={e => setForm(p => ({ ...p, father_name: e.target.value }))} />
                  </div>
                  <div>
                    <Label className="text-xs">उम्र (18-65) *</Label>
                    <Input type="number" min={18} max={65} placeholder="Age" value={form.age} onChange={e => setForm(p => ({ ...p, age: e.target.value }))} />
                  </div>
                  <div>
                    <Label className="text-xs">मोबाइल नंबर *</Label>
                    <Input type="tel" maxLength={10} placeholder="10 digit mobile" value={form.mobile} onChange={e => setForm(p => ({ ...p, mobile: e.target.value.replace(/\D/g, "").slice(0, 10) }))} />
                  </div>
                  <div>
                    <Label className="text-xs">WhatsApp नंबर *</Label>
                    <Input type="tel" maxLength={10} placeholder="WhatsApp number" value={form.whatsapp} onChange={e => setForm(p => ({ ...p, whatsapp: e.target.value.replace(/\D/g, "").slice(0, 10) }))} />
                  </div>
                  <div>
                    <Label className="text-xs">Email ID</Label>
                    <Input type="email" placeholder="email@example.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <Label className="text-xs">पूरा पता *</Label>
                  <Textarea placeholder="Full Address" rows={2} value={form.full_address} onChange={e => setForm(p => ({ ...p, full_address: e.target.value }))} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <Label className="text-xs">शहर *</Label>
                    <Input placeholder="City" value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} />
                  </div>
                  <div>
                    <Label className="text-xs">जिला *</Label>
                    <Input placeholder="District" value={form.district} onChange={e => setForm(p => ({ ...p, district: e.target.value }))} />
                  </div>
                  <div>
                    <Label className="text-xs">राज्य *</Label>
                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.state} onChange={e => setForm(p => ({ ...p, state: e.target.value }))}>
                      <option value="">Select State</option>
                      {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* B. Skills */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">B</span>
                  Skill & Capability Mapping
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mb-3">आप किस तरह की खिदमत कर सकते हैं? (Multi-select)</p>
                <div className="space-y-2">
                  {SKILLS.map(skill => (
                    <label key={skill.value} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                      <Checkbox checked={form.skills.includes(skill.value)} onCheckedChange={() => toggleArray("skills", skill.value)} />
                      <span className="text-sm">{skill.label}</span>
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* C. Availability */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">C</span>
                  Availability Filter
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-2">आप कितने दिन सेवा दे सकते हैं? *</p>
                  <RadioGroup value={form.availability_days} onValueChange={v => setForm(p => ({ ...p, availability_days: v }))}>
                    {AVAILABILITY.map(a => (
                      <label key={a.value} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer">
                        <RadioGroupItem value={a.value} />
                        <span className="text-sm">{a.label}</span>
                      </label>
                    ))}
                  </RadioGroup>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-2">आप किस शहर में ड्यूटी दे सकते हैं? *</p>
                  <RadioGroup value={form.duty_location} onValueChange={v => setForm(p => ({ ...p, duty_location: v }))}>
                    {DUTY_LOCATIONS.map(d => (
                      <label key={d.value} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer">
                        <RadioGroupItem value={d.value} />
                        <span className="text-sm">{d.label}</span>
                      </label>
                    ))}
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>

            {/* D. Languages */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">D</span>
                  Language Capability
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs text-muted-foreground">आप कौन-कौन सी भाषा जानते हैं? *</p>
                <div className="grid grid-cols-2 gap-2">
                  {LANGUAGES.map(lang => (
                    <label key={lang.value} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer">
                      <Checkbox checked={form.languages.includes(lang.value)} onCheckedChange={() => toggleArray("languages", lang.value)} />
                      <span className="text-sm">{lang.label}</span>
                    </label>
                  ))}
                </div>
                <div>
                  <Label className="text-xs">अन्य भाषा (Other)</Label>
                  <Input placeholder="Other language" value={form.other_language} onChange={e => setForm(p => ({ ...p, other_language: e.target.value }))} />
                </div>
              </CardContent>
            </Card>

            {/* E. Declaration */}
            <Card className="border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">E</span>
                  Declaration / शपथ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs text-muted-foreground">मैं यह स्वीकार करता/करती हूँ कि:</p>
                <ul className="space-y-1.5 pl-1">
                  {DECLARATIONS.map(d => (
                    <li key={d} className="text-sm text-foreground flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      {d}
                    </li>
                  ))}
                </ul>
                <label className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20 cursor-pointer">
                  <Checkbox checked={form.declaration_agreed} onCheckedChange={v => setForm(p => ({ ...p, declaration_agreed: !!v }))} />
                  <span className="text-sm font-medium text-foreground">मैं सहमत हूँ / I Agree</span>
                </label>
              </CardContent>
            </Card>

            {/* Submit */}
            <Button
              size="lg"
              className="w-full text-base"
              disabled={submitting || !form.declaration_agreed}
              onClick={handleSubmit}
            >
              {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Heart className="w-5 h-5" />}
              {submitting ? "Submitting..." : "REGISTER AS VOLUNTEER"}
            </Button>

            <Button variant="ghost" className="w-full" onClick={() => setShowForm(false)}>
              ← वापस जाएं
            </Button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default VolunteerPage;
