import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Ticket, ExternalLink, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";

type Lang = "en" | "ar" | "ur" | "hi" | "ta" | "te" | "mr" | "bn" | "or" | "ml" | "pa";
const SUPPORTED: Lang[] = ["en", "ar", "ur", "hi", "ta", "te", "mr", "bn", "or", "ml", "pa"];

const t: Record<string, Record<Lang, string>> = {
  title: {
    en: "Find Your Coupon ID", ar: "اعثر على رقم قسيمتك", ur: "اپنا کوپن آئی ڈی تلاش کریں",
    hi: "अपना कूपन आईडी ढूंढें", ta: "உங்கள் கூப்பன் ஐடி கண்டறியவும்", te: "మీ కూపన్ ఐడిని కనుగొనండి",
    mr: "तुमचा कूपन आयडी शोधा", bn: "আপনার কুপন আইডি খুঁজুন", or: "ଆପଣଙ୍କ କୁପନ ଆଇଡି ଖୋଜନ୍ତୁ",
    ml: "നിങ്ങളുടെ കൂപ്പൺ ഐഡി കണ്ടെത്തുക", pa: "ਆਪਣਾ ਕੂਪਨ ਆਈਡੀ ਲੱਭੋ"
  },
  subtitle: {
    en: "Enter your Cover ID or Passport number",
    ar: "أدخل رقم الغلاف أو جواز السفر",
    ur: "اپنا کور آئی ڈی یا پاسپورٹ نمبر درج کریں",
    hi: "अपना कवर आईडी या पासपोर्ट नंबर डालें",
    ta: "உங்கள் கவர் ஐடி அல்லது பாஸ்போர்ட் எண் உள்ளிடவும்",
    te: "మీ కవర్ ఐడి లేదా పాస్‌పోర్ట్ నంబర్ నమోదు చేయండి",
    mr: "तुमचा कव्हर आयडी किंवा पासपोर्ट क्रमांक टाका",
    bn: "আপনার কভার আইডি বা পাসপোর্ট নম্বর লিখুন",
    or: "ଆପଣଙ୍କ କଭର ଆଇଡି କିମ୍ବା ପାସପୋର୍ଟ ନମ୍ବର ଦିଅନ୍ତୁ",
    ml: "നിങ്ങളുടെ കവർ ഐഡി അല്ലെങ്കിൽ പാസ്‌പോർട്ട് നമ്പർ നൽകുക",
    pa: "ਆਪਣਾ ਕਵਰ ਆਈਡੀ ਜਾਂ ਪਾਸਪੋਰਟ ਨੰਬਰ ਦਰਜ ਕਰੋ"
  },
  placeholder: {
    en: "Cover ID or Passport No.", ar: "رقم الغلاف أو جواز السفر", ur: "کور آئی ڈی / پاسپورٹ نمبر",
    hi: "कवर आईडी / पासपोर्ट नंबर", ta: "கவர் ஐடி / பாஸ்போர்ட்", te: "కవర్ ఐడి / పాస్‌పోర్ట్",
    mr: "कव्हर आयडी / पासपोर्ट", bn: "কভার আইডি / পাসপোর্ট", or: "କଭର ଆଇଡି / ପାସପୋର୍ଟ",
    ml: "കവർ ഐഡി / പാസ്‌പോർട്ട്", pa: "ਕਵਰ ਆਈਡੀ / ਪਾਸਪੋਰਟ"
  },
  search: {
    en: "Search", ar: "بحث", ur: "تلاش کریں", hi: "खोजें", ta: "தேடு", te: "శోధించు",
    mr: "शोधा", bn: "খুঁজুন", or: "ଖୋଜନ୍ତୁ", ml: "തിരയുക", pa: "ਖੋਜੋ"
  },
  found: {
    en: "Coupon Found", ar: "تم العثور على القسيمة", ur: "کوپن مل گیا", hi: "कूपन मिल गया",
    ta: "கூப்பன் கிடைத்தது", te: "కూపన్ దొరికింది", mr: "कूपन सापडले", bn: "কুপন পাওয়া গেছে",
    or: "କୁପନ ମିଳିଲା", ml: "കൂപ്പൺ കണ്ടെത്തി", pa: "ਕੂਪਨ ਮਿਲਿਆ"
  },
  couponLabel: {
    en: "Coupon ID", ar: "رقم القسيمة", ur: "کوپن آئی ڈی", hi: "कूपन आईडी", ta: "கூப்பன் ஐடி",
    te: "కూపన్ ఐడి", mr: "कूपन आयडी", bn: "কুপন আইডি", or: "କୁପନ ଆଇଡି", ml: "കൂപ്പൺ ഐഡി", pa: "ਕੂਪਨ ਆਈਡੀ"
  },
  notFound: {
    en: "No coupon found in our records. Try the official IDB Adahi portal below.",
    ar: "لم يتم العثور على القسيمة في سجلاتنا. جرب بوابة الأضحية الرسمية أدناه.",
    ur: "ہمارے ریکارڈ میں کوپن نہیں ملا۔ نیچے سرکاری IDB اضحی پورٹل آزمائیں۔",
    hi: "हमारे रिकॉर्ड में कूपन नहीं मिला। नीचे आधिकारिक IDB अधही पोर्टल पर देखें।",
    ta: "எங்கள் பதிவில் கூப்பன் இல்லை. கீழே உள்ள அதிகாரப்பூர்வ IDB தளத்தை முயற்சிக்கவும்.",
    te: "మా రికార్డ్‌లలో కూపన్ లేదు. క్రింది అధికారిక IDB పోర్టల్‌ను ప్రయత్నించండి.",
    mr: "आमच्या नोंदीत कूपन नाही. खाली अधिकृत IDB पोर्टल पहा.",
    bn: "আমাদের রেকর্ডে কুপন পাওয়া যায়নি। নিচের অফিসিয়াল IDB পোর্টাল চেষ্টা করুন।",
    or: "ଆମ ରେକର୍ଡରେ କୁପନ ମିଳିଲା ନାହିଁ। ତଳର ସରକାରୀ IDB ପୋର୍ଟାଲ ଚେଷ୍ଟା କରନ୍ତୁ।",
    ml: "ഞങ്ങളുടെ രേഖകളിൽ കൂപ്പൺ ഇല്ല. താഴെയുള്ള ഔദ്യോഗിക IDB പോർട്ടൽ പരീക്ഷിക്കുക.",
    pa: "ਸਾਡੇ ਰਿਕਾਰਡ ਵਿੱਚ ਕੂਪਨ ਨਹੀਂ ਮਿਲਿਆ। ਹੇਠਾਂ ਅਧਿਕਾਰਤ IDB ਪੋਰਟਲ ਅਜ਼ਮਾਓ।"
  },
  openIdb: {
    en: "Open IDB Adahi Portal", ar: "افتح بوابة الأضحية IDB", ur: "IDB اضحی پورٹل کھولیں",
    hi: "IDB अधही पोर्टल खोलें", ta: "IDB அதாஹி தளம் திற", te: "IDB అదాహీ పోర్టల్ తెరువు",
    mr: "IDB अदाही पोर्टल उघडा", bn: "IDB আদাহী পোর্টাল খুলুন", or: "IDB ଅଦାହୀ ପୋର୍ଟାଲ ଖୋଲନ୍ତୁ",
    ml: "IDB അദാഹി പോർട്ടൽ തുറക്കുക", pa: "IDB ਅਦਾਹੀ ਪੋਰਟਲ ਖੋਲ੍ਹੋ"
  },
  empty: {
    en: "Please enter a Cover ID or Passport number", ar: "يرجى إدخال رقم الغلاف أو جواز السفر",
    ur: "براہ کرم کور آئی ڈی یا پاسپورٹ نمبر درج کریں", hi: "कृपया कवर आईडी या पासपोर्ट नंबर डालें",
    ta: "தயவுசெய்து கவர் ஐடி அல்லது பாஸ்போர்ட் உள்ளிடவும்", te: "దయచేసి కవర్ ఐడి లేదా పాస్‌పోర్ట్ నమోదు చేయండి",
    mr: "कृपया कव्हर आयडी किंवा पासपोर्ट टाका", bn: "অনুগ্রহ করে কভার আইডি বা পাসপোর্ট লিখুন",
    or: "ଦୟାକରି କଭର ଆଇଡି କିମ୍ବା ପାସପୋର୍ଟ ଦିଅନ୍ତୁ", ml: "ദയവായി കവർ ഐഡി അല്ലെങ്കിൽ പാസ്‌പോർട്ട് നൽകുക",
    pa: "ਕਿਰਪਾ ਕਰਕੇ ਕਵਰ ਆਈਡੀ ਜਾਂ ਪਾਸਪੋਰਟ ਦਰਜ ਕਰੋ"
  },
  status: {
    en: "Status", ar: "الحالة", ur: "حالت", hi: "स्थिति", ta: "நிலை", te: "స్థితి",
    mr: "स्थिती", bn: "স্থিতি", or: "ସ୍ଥିତି", ml: "സ്റ്റാറ്റസ്", pa: "ਸਥਿਤੀ"
  },
  group: {
    en: "Group", ar: "المجموعة", ur: "گروپ", hi: "ग्रुप", ta: "குழு", te: "గ్రూప్",
    mr: "गट", bn: "গ্রুপ", or: "ଗୋଷ୍ଠୀ", ml: "ഗ്രൂപ്പ്", pa: "ਗਰੁੱਪ"
  }
};

const IDB_URL = "https://www.adahi.org/en/home";

interface Row {
  coupon_id: string;
  pilgrim_name: string | null;
  group_no: string | null;
  status: string;
  slaughter_date: string | null;
}

const QurbaniCouponLookup = () => {
  const { language } = useLanguage();
  const lang: Lang = SUPPORTED.includes(language as Lang) ? (language as Lang) : "en";
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Row[] | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    const q = query.trim();
    if (!q) {
      toast({ title: t.empty[lang], variant: "destructive" });
      return;
    }
    setLoading(true);
    setSearched(true);
    const lower = q.toLowerCase();
    const { data, error } = await supabase
      .from("qurbani_coupons")
      .select("coupon_id,pilgrim_name,group_no,status,slaughter_date")
      .or(`cover_id.ilike.${lower},passport_no.ilike.${lower}`)
      .limit(10);
    setLoading(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      setResult(null);
      return;
    }
    setResult(data ?? []);
  };

  return (
    <Card className="border-primary/20">
      <CardContent className="p-4 space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Ticket className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{t.title[lang]}</h3>
            <p className="text-sm text-muted-foreground">{t.subtitle[lang]}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder={t.placeholder[lang]}
            className="h-12 text-base"
            maxLength={50}
          />
          <Button onClick={handleSearch} disabled={loading} size="lg" className="shrink-0">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span className="ml-2 hidden sm:inline">{t.search[lang]}</span>
          </Button>
        </div>

        {searched && result && result.length > 0 && (
          <div className="space-y-2">
            {result.map((r, i) => (
              <div key={i} className="rounded-lg border border-primary/30 bg-primary/5 p-4 space-y-2">
                <div className="flex items-center gap-2 text-primary font-medium">
                  <CheckCircle2 className="w-5 h-5" />
                  {t.found[lang]}
                </div>
                <div className="text-2xl font-bold tracking-wider text-foreground">
                  {r.coupon_id}
                </div>
                <div className="text-xs text-muted-foreground">{t.couponLabel[lang]}</div>
                {r.pilgrim_name && (
                  <div className="text-sm text-foreground pt-1">{r.pilgrim_name}</div>
                )}
                <div className="flex flex-wrap gap-2 pt-1">
                  <Badge variant="secondary">{t.status[lang]}: {r.status}</Badge>
                  {r.group_no && <Badge variant="outline">{t.group[lang]}: {r.group_no}</Badge>}
                </div>
              </div>
            ))}
          </div>
        )}

        {searched && result && result.length === 0 && (
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 space-y-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-sm text-foreground">{t.notFound[lang]}</p>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.open(IDB_URL, "_blank", "noopener,noreferrer")}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              {t.openIdb[lang]}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QurbaniCouponLookup;
