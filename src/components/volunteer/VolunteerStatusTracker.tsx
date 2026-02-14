import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import { Search, CheckCircle2, Clock, Loader2, UserCheck, GraduationCap, Shield, Rocket } from "lucide-react";

const STATUSES = ["registered", "screening", "shortlisted", "training", "assessed", "deployed"] as const;

type VolunteerStatus = typeof STATUSES[number];

const STATUS_LABELS: Record<VolunteerStatus, Record<string, string>> = {
  registered: { en: "Registered", hi: "पंजीकृत", ur: "رجسٹرڈ", ar: "مسجل", ta: "பதிவு", te: "నమోదు", mr: "नोंदणी", bn: "নিবন্ধিত", or: "ପଞ୍ଜୀକୃତ", ml: "രജിസ്റ്റർ", pa: "ਰਜਿਸਟਰਡ" },
  screening: { en: "Screening", hi: "स्क्रीनिंग", ur: "اسکریننگ", ar: "فحص", ta: "ஆய்வு", te: "స్క్రీనింగ్", mr: "तपासणी", bn: "স্ক্রিনিং", or: "ଯାଞ୍ଚ", ml: "സ്ക്രീനിംഗ്", pa: "ਸਕ੍ਰੀਨਿੰਗ" },
  shortlisted: { en: "Shortlisted", hi: "शॉर्टलिस्ट", ur: "شارٹ لسٹ", ar: "مرشح", ta: "தேர்வு", te: "షార్ట్‌లిస్ట్", mr: "निवड", bn: "বাছাই", or: "ମନୋନୀତ", ml: "ഷോർട്ട്‌ലിസ്റ്റ്", pa: "ਚੁਣੇ ਗਏ" },
  training: { en: "Training", hi: "प्रशिक्षण", ur: "تربیت", ar: "تدريب", ta: "பயிற்சி", te: "శిక్షణ", mr: "प्रशिक्षण", bn: "প্রশিক্ষণ", or: "ପ୍ରଶିକ୍ଷଣ", ml: "പരിശീലനം", pa: "ਸਿਖਲਾਈ" },
  assessed: { en: "Assessed", hi: "मूल्यांकित", ur: "جائزہ", ar: "تقييم", ta: "மதிப்பீடு", te: "మూల్యాంకనం", mr: "मूल्यांकन", bn: "মূল্যায়ন", or: "ମୂଲ୍ୟାଙ୍କନ", ml: "വിലയിരുത്തൽ", pa: "ਮੁਲਾਂਕਣ" },
  deployed: { en: "Deployed", hi: "तैनात", ur: "تعینات", ar: "منتشر", ta: "நிலையமை", te: "నియమితం", mr: "तैनात", bn: "মোতায়েন", or: "ନିୟୋଜିତ", ml: "വിന്യസിച്ചു", pa: "ਤਾਇਨਾਤ" },
};

const STATUS_ICONS = [Clock, Search, UserCheck, GraduationCap, Shield, Rocket];

const TRACKER_LABELS: Record<string, Record<string, string>> = {
  title: { en: "Track Your Status", hi: "अपनी स्थिति देखें", ur: "اپنی حالت دیکھیں", ar: "تتبع حالتك", ta: "உங்கள் நிலை", te: "మీ స్థితి", mr: "तुमची स्थिती", bn: "আপনার অবস্থা", or: "ଆପଣଙ୍କ ସ୍ଥିତି", ml: "നിങ്ങളുടെ സ്ഥിതി", pa: "ਆਪਣੀ ਸਥਿਤੀ" },
  placeholder: { en: "Volunteer ID or Mobile", hi: "Volunteer ID या मोबाइल", ur: "والنٹیئر آئی ڈی یا موبائل", ar: "رقم المتطوع أو الجوال", ta: "தன்னார்வலர் ID அல்லது மொபைல்", te: "వాలంటీర్ ID లేదా మొబైల్", mr: "Volunteer ID किंवा मोबाइल", bn: "ভলান্টিয়ার ID বা মোবাইল", or: "ଭଲଣ୍ଟିଅର୍ ID କିମ୍ବା ମୋବାଇଲ୍", ml: "വോളണ്ടിയർ ID അല്ലെങ്കിൽ മൊബൈൽ", pa: "ਵਲੰਟੀਅਰ ID ਜਾਂ ਮੋਬਾਈਲ" },
  search: { en: "Search", hi: "खोजें", ur: "تلاش", ar: "بحث", ta: "தேடு", te: "వెతకండి", mr: "शोधा", bn: "খুঁজুন", or: "ସନ୍ଧାନ", ml: "തിരയുക", pa: "ਖੋਜੋ" },
  notFound: { en: "No volunteer found", hi: "कोई वॉलंटियर नहीं मिला", ur: "کوئی والنٹیئر نہیں ملا", ar: "لم يتم العثور على متطوع", ta: "தன்னார்வலர் இல்லை", te: "వాలంటీర్ కనుగొనబడలేదు", mr: "कोणीही आढळले नाही", bn: "কোনো ভলান্টিয়ার পাওয়া যায়নি", or: "ସ୍ବେଚ୍ଛାସେବୀ ମିଳିଲେ ନାହିଁ", ml: "വോളണ്ടിയറെ കണ്ടെത്തിയില്ല", pa: "ਕੋਈ ਵਲੰਟੀਅਰ ਨਹੀਂ ਮਿਲਿਆ" },
  name: { en: "Name", hi: "नाम", ur: "نام", ar: "الاسم", ta: "பெயர்", te: "పేరు", mr: "नाव", bn: "নাম", or: "ନାମ", ml: "പേര്", pa: "ਨਾਮ" },
  volunteerId: { en: "Volunteer ID", hi: "Volunteer ID", ur: "والنٹیئر آئی ڈی", ar: "رقم المتطوع", ta: "தன்னார்வலர் ID", te: "వాలంటీర్ ID", mr: "Volunteer ID", bn: "ভলান্টিয়ার ID", or: "ଭଲଣ୍ଟିଅର୍ ID", ml: "വോളണ്ടിയർ ID", pa: "ਵਲੰਟੀਅਰ ID" },
  progress: { en: "Recruitment Progress", hi: "भर्ती प्रगति", ur: "بھرتی کی پیشرفت", ar: "تقدم التوظيف", ta: "ஆட்சேர்ப்பு முன்னேற்றம்", te: "రిక్రూట్‌మెంట్ ప్రగతి", mr: "भरती प्रगती", bn: "নিয়োগ অগ্রগতি", or: "ନିଯୁକ୍ତି ପ୍ରଗତି", ml: "റിക്രൂട്ട്‌മെന്റ് പുരോഗതി", pa: "ਭਰਤੀ ਪ੍ਰਗਤੀ" },
};

const getLabel = (key: string, lang: Language, labels: Record<string, Record<string, string>>) => {
  return labels[key]?.[lang] || labels[key]?.en || key;
};

interface VolunteerData {
  full_name: string;
  volunteer_id: string;
  status: string;
  city: string;
  skills: string[];
  created_at: string;
}

const VolunteerStatusTracker = () => {
  const { language, isRTL } = useLanguage();
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [volunteer, setVolunteer] = useState<VolunteerData | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    const q = query.trim();
    if (!q) return;

    setLoading(true);
    setSearched(true);
    try {
      // Use secure RPC for volunteer lookup
      const result = await supabase.rpc("lookup_volunteer_status", { p_query: q });

      const volunteerData = result.data && result.data.length > 0 ? result.data[0] : null;
      setVolunteer(volunteerData);
      if (!volunteerData) {
        toast({ title: getLabel("notFound", language, TRACKER_LABELS), variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const currentIndex = volunteer ? STATUSES.indexOf(volunteer.status as VolunteerStatus) : -1;

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Search className="w-4 h-4 text-primary" />
          {getLabel("title", language, TRACKER_LABELS)}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder={getLabel("placeholder", language, TRACKER_LABELS)}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSearch()}
            className="flex-1"
          />
          <Button size="sm" onClick={handleSearch} disabled={loading || !query.trim()}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : getLabel("search", language, TRACKER_LABELS)}
          </Button>
        </div>

        {searched && volunteer && (
          <div className="space-y-4 animate-fade-up">
            {/* Volunteer Info */}
            <div className="bg-muted/50 rounded-xl p-4 space-y-1.5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground">{getLabel("name", language, TRACKER_LABELS)}</p>
                  <p className="font-semibold text-foreground">{volunteer.full_name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">{getLabel("volunteerId", language, TRACKER_LABELS)}</p>
                  <p className="font-mono font-bold text-primary">{volunteer.volunteer_id}</p>
                </div>
              </div>
            </div>

            {/* Progress Tracker */}
            <div>
              <p className="text-sm font-medium text-foreground mb-3">{getLabel("progress", language, TRACKER_LABELS)}</p>
              <div className="space-y-0">
                {STATUSES.map((status, i) => {
                  const Icon = STATUS_ICONS[i];
                  const isCompleted = i <= currentIndex;
                  const isCurrent = i === currentIndex;
                  const label = STATUS_LABELS[status]?.[language] || STATUS_LABELS[status]?.en;

                  return (
                    <div key={status} className="flex items-start gap-3">
                      {/* Vertical line + icon */}
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${
                            isCurrent
                              ? "bg-primary text-primary-foreground ring-2 ring-primary/30 ring-offset-2 ring-offset-background"
                              : isCompleted
                              ? "bg-primary/20 text-primary"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {isCompleted && !isCurrent ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            <Icon className="w-4 h-4" />
                          )}
                        </div>
                        {i < STATUSES.length - 1 && (
                          <div
                            className={`w-0.5 h-6 ${
                              i < currentIndex ? "bg-primary/40" : "bg-muted"
                            }`}
                          />
                        )}
                      </div>

                      {/* Label */}
                      <div className={`pt-1.5 ${isCurrent ? "font-semibold text-foreground" : isCompleted ? "text-foreground/80" : "text-muted-foreground"}`}>
                        <p className="text-sm leading-none">{label}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {searched && !volunteer && !loading && (
          <p className="text-sm text-muted-foreground text-center py-2">
            {getLabel("notFound", language, TRACKER_LABELS)}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default VolunteerStatusTracker;
