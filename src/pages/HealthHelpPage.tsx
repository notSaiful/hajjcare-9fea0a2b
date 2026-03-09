import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/MainLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { HelpButton } from "@/components/HelpButton";
import {
  ArrowLeft,
  HeartPulse,
  Send,
  Loader2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Phone,
  MessageCircle,
  Stethoscope,
  ClipboardCheck,
  FileCheck,
  History,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

type TicketStatus = 
  | 'submitted'
  | 'ai_triaged' 
  | 'coordinator_reviewing'
  | 'whatsapp_alerted'
  | 'professional_responding'
  | 'action_taken'
  | 'resolved'
  | 'closed';

type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical';

interface HealthTicket {
  id: string;
  description: string;
  symptoms: string[] | null;
  status: TicketStatus;
  ai_urgency_level: UrgencyLevel;
  ai_triage_summary: string | null;
  ai_translated_text: string | null;
  ai_category: string | null;
  ai_recommendations: string[] | null;
  coordinator_notes: string | null;
  professional_response: string | null;
  action_taken: string | null;
  outcome: string | null;
  created_at: string;
  updated_at: string;
}

const labels = {
  title: {
    en: "Health Help Center",
    ar: "مركز المساعدة الصحية",
    ur: "صحت مدد مرکز",
    hi: "सेहत मदद सेंटर",
    ta: "சுகாதார உதவி மையம்",
    te: "ఆరోగ్య సహాయ కేంద్రం",
    mr: "आरोग्य मदत केंद्र",
    bn: "স্বাস্থ্য সহায়তা কেন্দ্র",
    or: "ସ୍ୱାସ୍ଥ୍ୟ ସହାୟତା କେନ୍ଦ୍ର",
    ml: "ആരോഗ്യ സഹായ കേന്ദ്രം",
    pa: "ਸਿਹਤ ਮਦਦ ਕੇਂਦਰ",
  },
  subtitle: {
    en: "Submit health concerns for immediate assistance",
    ar: "أرسل مخاوفك الصحية للحصول على مساعدة فورية",
    ur: "فوری مدد کے لیے صحت کی تشویشات جمع کریں",
    hi: "फ़ौरी मदद के लिए सेहत की परेशानी दर्ज करें",
    ta: "உடனடி உதவிக்கு சுகாதார கவலைகளை சமர்ப்பிக்கவும்",
    te: "తక్షణ సహాయం కోసం ఆరోగ్య సమస్యలను సమర్పించండి",
    mr: "त्वरित मदतीसाठी आरोग्य समस्या सादर करा",
    bn: "তাৎক্ষণিক সহায়তার জন্য স্বাস্থ্য সমস্যা জমা দিন",
    or: "ତୁରନ୍ତ ସହାୟତା ପାଇଁ ସ୍ୱାସ୍ଥ୍ୟ ଚିନ୍ତା ଦାଖଲ କରନ୍ତୁ",
    ml: "ഉടനടി സഹായത്തിനായി ആരോഗ്യ പ്രശ്നങ്ങൾ സമർപ്പിക്കുക",
    pa: "ਤੁਰੰਤ ਮਦਦ ਲਈ ਸਿਹਤ ਸਮੱਸਿਆ ਦਰਜ ਕਰੋ",
  },
  describeIssue: {
    en: "Describe your health issue",
    ar: "صف مشكلتك الصحية",
    ur: "اپنی صحت کی تشویش بیان کریں",
    hi: "अपनी सेहत की परेशानी बयान करें",
    ta: "உங்கள் சுகாதார பிரச்சனையை விவரிக்கவும்",
    te: "మీ ఆరోగ్య సమస్యను వివరించండి",
    mr: "तुमची आरोग्य समस्या वर्णन करा",
    bn: "আপনার স্বাস্থ্য সমস্যা বর্ণনা করুন",
    or: "ଆପଣଙ୍କ ସ୍ୱାସ୍ଥ୍ୟ ସମସ୍ୟା ବର୍ଣ୍ଣନା କରନ୍ତୁ",
    ml: "നിങ്ങളുടെ ആരോഗ്യ പ്രശ്നം വിവരിക്കുക",
    pa: "ਆਪਣੀ ਸਿਹਤ ਸਮੱਸਿਆ ਦੱਸੋ",
  },
  placeholder: {
    en: "Describe your symptoms, when they started, and how severe they are...",
    ar: "صف أعراضك، متى بدأت، ومدى شدتها...",
    ur: "اپنی علامات بیان کریں، کب شروع ہوئیں، اور کتنی شدید ہیں...",
    hi: "अपनी अलामात बयान करें, कब शुरू हुईं, और कितनी शदीद हैं...",
    ta: "உங்கள் அறிகுறிகள், எப்போது தொடங்கின, எவ்வளவு தீவிரமானவை என்று விவரிக்கவும்...",
    te: "మీ లక్షణాలు, ఎప్పుడు మొదలయ్యాయి, ఎంత తీవ్రంగా ఉన్నాయో వివరించండి...",
    mr: "तुमची लक्षणे, कधी सुरू झाली, किती गंभीर आहेत ते वर्णन करा...",
    bn: "আপনার উপসর্গ, কখন শুরু হয়েছে, কতটা গুরুতর তা বর্ণনা করুন...",
    or: "ଆପଣଙ୍କ ଲକ୍ଷଣ, କେବେ ଆରମ୍ଭ ହେଲା, କେତେ ଗୁରୁତର ତାହା ବର୍ଣ୍ଣନା କରନ୍ତୁ...",
    ml: "നിങ്ങളുടെ ലക്ഷണങ്ങൾ, എപ്പോൾ തുടങ്ങി, എത്ര ഗുരുതരമാണെന്ന് വിവരിക്കുക...",
    pa: "ਆਪਣੇ ਲੱਛਣ, ਕਦੋਂ ਸ਼ੁਰੂ ਹੋਏ, ਕਿੰਨੇ ਗੰਭੀਰ ਹਨ ਦੱਸੋ...",
  },
  submit: {
    en: "Submit for Help",
    ar: "إرسال للمساعدة",
    ur: "مدد کے لیے جمع کریں",
    hi: "मदद के लिए भेजें",
    ta: "உதவிக்கு சமர்ப்பிக்கவும்",
    te: "సహాయం కోసం సమర్పించండి",
    mr: "मदतीसाठी सादर करा",
    bn: "সাহায্যের জন্য জমা দিন",
    or: "ସହାୟତା ପାଇଁ ଦାଖଲ କରନ୍ତୁ",
    ml: "സഹായത്തിനായി സമർപ്പിക്കുക",
    pa: "ਮਦਦ ਲਈ ਭੇਜੋ",
  },
  submitting: {
    en: "Analyzing...",
    ar: "جاري التحليل...",
    ur: "تجزیہ ہو رہا ہے...",
    hi: "तहलील हो रही है...",
    ta: "பகுப்பாய்வு செய்கிறது...",
    te: "విశ్లేషిస్తోంది...",
    mr: "विश्लेषण करत आहे...",
    bn: "বিশ্লেষণ করা হচ্ছে...",
    or: "ବିଶ୍ଳେଷଣ ହେଉଛି...",
    ml: "വിശകലനം ചെയ്യുന്നു...",
    pa: "ਵਿਸ਼ਲੇਸ਼ਣ ਹੋ ਰਿਹਾ ਹੈ...",
  },
  voiceHelp: {
    en: "Or speak with AI Assistant",
    ar: "أو تحدث مع مساعد الذكاء الاصطناعي",
    ur: "یا AI اسسٹنٹ سے بات کریں",
    hi: "या AI असिस्टेंट से बात करें",
    ta: "அல்லது AI உதவியாளருடன் பேசுங்கள்",
    te: "లేదా AI అసిస్టెంట్‌తో మాట్లాడండి",
    mr: "किंवा AI सहाय्यकाशी बोला",
    bn: "অথবা AI সহকারীর সাথে কথা বলুন",
    or: "କିମ୍ବା AI ସହାୟକଙ୍କ ସହ କଥା ହୁଅନ୍ତୁ",
    ml: "അല്ലെങ്കിൽ AI അസിസ്റ്റന്റുമായി സംസാരിക്കുക",
    pa: "ਜਾਂ AI ਅਸਿਸਟੈਂਟ ਨਾਲ ਗੱਲ ਕਰੋ",
  },
  recentTickets: {
    en: "Your Recent Requests",
    ar: "طلباتك الأخيرة",
    ur: "آپ کی حالیہ درخواستیں",
    hi: "आपकी हालिया दरख्वास्तें",
    ta: "உங்கள் சமீபத்திய கோரிக்கைகள்",
    te: "మీ ఇటీవలి అభ్యర్థనలు",
    mr: "तुमच्या अलीकडील विनंत्या",
    bn: "আপনার সাম্প্রতিক অনুরোধ",
    or: "ଆପଣଙ୍କ ସାମ୍ପ୍ରତିକ ଅନୁରୋଧ",
    ml: "നിങ്ങളുടെ സമീപകാല അഭ്യർത്ഥനകൾ",
    pa: "ਤੁਹਾਡੀਆਂ ਹਾਲੀਆ ਬੇਨਤੀਆਂ",
  },
  loginRequired: {
    en: "Please login to submit assistance requests",
    ar: "يرجى تسجيل الدخول لإرسال طلبات المساعدة",
    ur: "مدد کی درخواستیں جمع کرنے کے لیے لاگ ان کریں",
    hi: "सहायता की दरख्वास्त भेजने के लिए लॉगिन करें",
    ta: "உதவி கோரிக்கைகளை சமர்ப்பிக்க உள்நுழையவும்",
    te: "సహాయ అభ్యర్థనలు సమర్పించడానికి లాగిన్ చేయండి",
    mr: "मदत विनंत्या सादर करण्यासाठी लॉगिन करा",
    bn: "সহায়তা অনুরোধ জমা দিতে লগইন করুন",
    or: "ସହାୟତା ଅନୁରୋଧ ଦାଖଲ କରିବାକୁ ଲଗଇନ୍ କରନ୍ତୁ",
    ml: "സഹായ അഭ്യർത്ഥനകൾ സമർപ്പിക്കാൻ ലോഗിൻ ചെയ്യുക",
    pa: "ਸਹਾਇਤਾ ਬੇਨਤੀਆਂ ਭੇਜਣ ਲਈ ਲਾਗਇਨ ਕਰੋ",
  },
  login: {
    en: "Login",
    ar: "تسجيل الدخول",
    ur: "لاگ ان",
    hi: "लॉगिन",
    ta: "உள்நுழை",
    te: "లాగిన్",
    mr: "लॉगिन",
    bn: "লগইন",
    or: "ଲଗଇନ୍",
    ml: "ലോഗിൻ",
    pa: "ਲਾਗਇਨ",
  },
  workflow: {
    en: "Request Workflow",
    ar: "سير العمل للطلب",
    ur: "درخواست کا عمل",
    hi: "दरख्वास्त का अमल",
    ta: "கோரிக்கை செயல்முறை",
    te: "అభ్యర్థన వర్క్‌ఫ్లో",
    mr: "विनंती कार्यप्रवाह",
    bn: "অনুরোধ কার্যপ্রবাহ",
    or: "ଅନୁରୋଧ କାର୍ଯ୍ୟପ୍ରବାହ",
    ml: "അഭ്യർത്ഥന വർക്ക്ഫ്ലോ",
    pa: "ਬੇਨਤੀ ਵਰਕਫਲੋ",
  },
  back: {
    en: "Back",
    ar: "رجوع",
    ur: "واپس",
    hi: "वापस",
    ta: "பின்செல்",
    te: "వెనుకకు",
    mr: "मागे",
    bn: "পিছনে",
    or: "ପଛକୁ",
    ml: "പിന്നോട്ട്",
    pa: "ਵਾਪਸ",
  },
};

const workflowSteps = [
  { key: 'submitted', icon: Send, label: { en: "Submitted", hi: "दर्ज", ar: "مُرسل", ur: "جمع" } },
  { key: 'ai_triaged', icon: Stethoscope, label: { en: "AI Triage", hi: "AI तहलील", ar: "فرز AI", ur: "AI تجزیہ" } },
  { key: 'coordinator_reviewing', icon: ClipboardCheck, label: { en: "Coordinator Review", hi: "कोआर्डिनेटर रिव्यू", ar: "مراجعة المنسق", ur: "کوآرڈینیٹر ریویو" } },
  { key: 'whatsapp_alerted', icon: MessageCircle, label: { en: "Team Alerted", hi: "टीम को इत्तला", ar: "تنبيه الفريق", ur: "ٹیم کو اطلاع" } },
  { key: 'professional_responding', icon: Phone, label: { en: "Professional Response", hi: "माहिर का जवाब", ar: "استجابة المحترف", ur: "ماہر کا جواب" } },
  { key: 'action_taken', icon: CheckCircle2, label: { en: "Action Taken", hi: "कार्रवाई", ar: "إجراء متخذ", ur: "کارروائی" } },
  { key: 'resolved', icon: FileCheck, label: { en: "Resolved", hi: "हल", ar: "تم الحل", ur: "حل" } },
];

const urgencyColors: Record<UrgencyLevel, string> = {
  low: "bg-primary/10 text-primary border-primary/20",
  medium: "bg-accent text-accent-foreground border-accent",
  high: "bg-destructive/20 text-destructive border-destructive/30",
  critical: "bg-destructive text-destructive-foreground border-destructive",
};

const urgencyLabels: Record<UrgencyLevel, Record<string, string>> = {
  low: { en: "Low", hi: "कम", ar: "منخفض", ur: "کم" },
  medium: { en: "Medium", hi: "दरमियानी", ar: "متوسط", ur: "درمیانی" },
  high: { en: "High", hi: "ज़्यादा", ar: "عالي", ur: "زیادہ" },
  critical: { en: "Critical", hi: "नाज़ुक", ar: "حرج", ur: "نازک" },
};

const HealthHelpPage = () => {
  const { language, isRTL } = useLanguage();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tickets, setTickets] = useState<HealthTicket[]>([]);
  const [expandedTicket, setExpandedTicket] = useState<string | null>(null);
  const [loadingTickets, setLoadingTickets] = useState(true);

  // Fetch user's tickets
  useEffect(() => {
    if (!user) {
      setLoadingTickets(false);
      return;
    }

    const fetchTickets = async () => {
      const { data, error } = await supabase
        .from('health_tickets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching tickets:', error);
      } else {
        setTickets(data as HealthTicket[] || []);
      }
      setLoadingTickets(false);
    };

    fetchTickets();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('health_tickets_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'health_tickets',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setTickets((prev) => [payload.new as HealthTicket, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setTickets((prev) =>
              prev.map((t) => (t.id === payload.new.id ? (payload.new as HealthTicket) : t))
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleSubmit = async () => {
    if (!description.trim() || !user) return;

    setIsSubmitting(true);
    try {
      // Get session for authenticated API calls
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        toast({
          title: "Error",
          description: "Please sign in to submit a health request",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Step 1: Create ticket in submitted state
      const { data: ticketData, error: insertError } = await supabase
        .from('health_tickets')
        .insert({
          user_id: user.id,
          description: description.trim(),
          original_language: language,
          status: 'submitted',
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Step 2: Call AI triage edge function with user token
      const triageResponse = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/health-triage`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            description: description.trim(),
            language,
          }),
        }
      );

      if (triageResponse.ok) {
        const triageData = await triageResponse.json();
        const triage = triageData.triage;

        // Step 3: Update ticket with AI triage results
        await supabase
          .from('health_tickets')
          .update({
            ai_triage_summary: triage.summary,
            ai_translated_text: triage.arabic_translation,
            ai_urgency_level: triage.urgency_level,
            ai_category: triage.category,
            ai_recommendations: triage.recommendations,
            zone: triage.suggested_zone,
            status: 'ai_triaged',
          })
          .eq('id', ticketData.id);

        // Step 4: For high/critical urgency, trigger WhatsApp alert
        if (triage.urgency_level === 'critical' || triage.urgency_level === 'high') {
          try {
            await fetch(
              `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/whatsapp-alert`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${session.access_token}`,
                },
                body: JSON.stringify({
                  ticketId: ticketData.id,
                  zone: triage.suggested_zone,
                  urgencyLevel: triage.urgency_level,
                  summary: triage.summary,
                  arabicText: triage.arabic_translation,
                  category: triage.category,
                }),
              }
            );
          } catch (alertErr) {
            console.error('WhatsApp alert error:', alertErr);
            // Non-blocking - ticket is still saved
          }
        }
      }

      setDescription("");
      toast({
        title: language === 'hi' ? "दरख्वास्त दर्ज हो गई" : "Request Submitted",
        description: language === 'hi' ? "जल्द ही मदद मिलेगी" : "Help is on the way",
      });
    } catch (error) {
      console.error('Submit error:', error);
      toast({
        title: "Error",
        description: "Failed to submit request",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStepIndex = (status: TicketStatus): number => {
    const index = workflowSteps.findIndex((s) => s.key === status);
    return index >= 0 ? index : 0;
  };

  const getProgressPercent = (status: TicketStatus): number => {
    const index = getStepIndex(status);
    return ((index + 1) / workflowSteps.length) * 100;
  };

  if (authLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6 pb-8" dir={isRTL ? "rtl" : "ltr"}>
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="shrink-0"
          >
            <ArrowLeft className={`w-5 h-5 ${isRTL ? "rotate-180" : ""}`} />
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <HeartPulse className="w-7 h-7 text-red-500" />
              {labels.title[language as keyof typeof labels.title] || labels.title.en}
            </h1>
            <p className="text-sm text-muted-foreground">
              {labels.subtitle[language as keyof typeof labels.subtitle] || labels.subtitle.en}
            </p>
          </div>
        </div>

        {/* Voice Help Button */}
        <Card className="border-2 border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground mb-3 text-center">
              {labels.voiceHelp[language as keyof typeof labels.voiceHelp] || labels.voiceHelp.en}
            </p>
            <HelpButton />
          </CardContent>
        </Card>

        {!isAuthenticated ? (
          // Login prompt
          <Card>
            <CardContent className="p-6 text-center space-y-4">
              <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
              <p className="text-muted-foreground">
                {labels.loginRequired[language as keyof typeof labels.loginRequired] || labels.loginRequired.en}
              </p>
              <Button onClick={() => navigate("/auth")}>
                {labels.login[language as keyof typeof labels.login] || labels.login.en}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Submit Form */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Send className="w-5 h-5" />
                  {labels.describeIssue[language as keyof typeof labels.describeIssue] || labels.describeIssue.en}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={labels.placeholder[language as keyof typeof labels.placeholder] || labels.placeholder.en}
                  rows={4}
                  className="text-base"
                  dir={isRTL ? "rtl" : "ltr"}
                />
                <Button
                  onClick={handleSubmit}
                  disabled={!description.trim() || isSubmitting}
                  className="w-full h-12 text-base"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      {labels.submitting[language as keyof typeof labels.submitting] || labels.submitting.en}
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      {labels.submit[language as keyof typeof labels.submit] || labels.submit.en}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Recent Tickets */}
            {tickets.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <History className="w-5 h-5" />
                  {labels.recentTickets[language as keyof typeof labels.recentTickets] || labels.recentTickets.en}
                </h2>

                {tickets.map((ticket) => (
                  <Card key={ticket.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      {/* Ticket Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm line-clamp-2">{ticket.description}</p>
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <Badge className={urgencyColors[ticket.ai_urgency_level]}>
                              {urgencyLabels[ticket.ai_urgency_level][language] || urgencyLabels[ticket.ai_urgency_level].en}
                            </Badge>
                            {ticket.ai_category && (
                              <Badge variant="outline" className="text-xs">
                                {ticket.ai_category}
                              </Badge>
                            )}
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(ticket.created_at).toLocaleString(language === 'ar' ? 'ar-SA' : 'en-IN')}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setExpandedTicket(expandedTicket === ticket.id ? null : ticket.id)}
                        >
                          {expandedTicket === ticket.id ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </Button>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-4">
                        <Progress value={getProgressPercent(ticket.status)} className="h-2" />
                        <div className="flex justify-between mt-2">
                          {workflowSteps.map((step, idx) => {
                            const currentIdx = getStepIndex(ticket.status);
                            const isComplete = idx <= currentIdx;
                            const isCurrent = idx === currentIdx;
                            const Icon = step.icon;
                            return (
                              <div
                                key={step.key}
                                className={`flex flex-col items-center ${
                                  isComplete ? "text-primary" : "text-muted-foreground/40"
                                }`}
                              >
                                <div
                                  className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                    isCurrent
                                      ? "bg-primary text-primary-foreground ring-2 ring-primary/30"
                                      : isComplete
                                      ? "bg-primary/20"
                                      : "bg-muted"
                                  }`}
                                >
                                  <Icon className="w-3 h-3" />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {expandedTicket === ticket.id && (
                        <div className="mt-4 pt-4 border-t space-y-3 text-sm">
                          {ticket.ai_triage_summary && (
                            <div>
                              <p className="font-medium text-muted-foreground mb-1">AI Analysis:</p>
                              <p>{ticket.ai_triage_summary}</p>
                            </div>
                          )}
                          {ticket.ai_recommendations && ticket.ai_recommendations.length > 0 && (
                            <div>
                              <p className="font-medium text-muted-foreground mb-1">Recommendations:</p>
                              <ul className="list-disc list-inside space-y-1">
                                {ticket.ai_recommendations.map((rec, i) => (
                                  <li key={i}>{rec}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {ticket.coordinator_notes && (
                            <div>
                              <p className="font-medium text-muted-foreground mb-1">Coordinator Notes:</p>
                              <p>{ticket.coordinator_notes}</p>
                            </div>
                          )}
                          {ticket.professional_response && (
                            <div>
                              <p className="font-medium text-muted-foreground mb-1">Professional Response:</p>
                              <p>{ticket.professional_response}</p>
                            </div>
                          )}
                          {ticket.outcome && (
                            <div className="bg-primary/10 p-3 rounded-lg border border-primary/20">
                              <p className="font-medium text-primary mb-1">Outcome:</p>
                              <p className="text-foreground">{ticket.outcome}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default HealthHelpPage;
