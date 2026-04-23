import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
import { MainLayout } from "@/components/MainLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Search,
  Plus,
  User,
  Package,
  MapPin,
  Phone,
  Camera,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { compressImage } from "@/lib/imageCompression";

type ReportType = "person" | "item";
type ReportStatus = "open" | "found" | "closed";

interface LostFoundReport {
  id: string;
  report_type: ReportType;
  status: ReportStatus;
  person_name: string | null;
  person_age: number | null;
  person_gender: string | null;
  person_description: string | null;
  wearing_description: string | null;
  item_name: string | null;
  item_description: string | null;
  last_seen_location: string;
  last_seen_at: string | null;
  photo_url: string | null;
  reporter_name: string;
  reporter_mobile?: string | null;
  reporter_whatsapp?: string | null;
  notes: string | null;
  created_at: string;
}

const reportSchema = z.object({
  report_type: z.enum(["person", "item"]),
  person_name: z.string().trim().max(100).optional(),
  person_age: z.number().int().min(0).max(120).optional(),
  person_gender: z.string().max(20).optional(),
  person_description: z.string().trim().max(500).optional(),
  wearing_description: z.string().trim().max(300).optional(),
  item_name: z.string().trim().max(100).optional(),
  item_description: z.string().trim().max(500).optional(),
  last_seen_location: z.string().trim().min(2, "Location required").max(200),
  last_seen_at: z.string().optional(),
  reporter_name: z.string().trim().min(2, "Name required").max(100),
  reporter_mobile: z.string().trim().min(7, "Mobile required").max(20),
  reporter_whatsapp: z.string().trim().max(20).optional(),
  notes: z.string().trim().max(500).optional(),
});

const LostAndFoundPage = () => {
  const { language, isRTL } = useLanguage();
  const [reports, setReports] = useState<LostFoundReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | ReportType>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const [form, setForm] = useState({
    report_type: "person" as ReportType,
    person_name: "",
    person_age: "",
    person_gender: "male",
    person_description: "",
    wearing_description: "",
    item_name: "",
    item_description: "",
    last_seen_location: "",
    last_seen_at: "",
    reporter_name: "",
    reporter_mobile: "",
    reporter_whatsapp: "",
    notes: "",
  });

  const t = useMemo(() => {
    const labels = {
      title: { en: "Lost & Found", ar: "المفقودات", ur: "گم شدہ اور پایا گیا", hi: "खोया और पाया", ta: "தொலைந்தது & கிடைத்தது", te: "పోగొట్టుకున్నవి", mr: "हरवले व सापडले", bn: "হারানো ও প্রাপ্ত", or: "ହଜିଲା ଓ ମିଳିଲା", ml: "നഷ്ടപ്പെട്ടത്", pa: "ਗੁਆਚਿਆ ਅਤੇ ਮਿਲਿਆ" },
      subtitle: { en: "Report missing pilgrims or lost items", ar: "أبلغ عن الحجاج المفقودين أو الأشياء المفقودة", ur: "گم شدہ حجاج یا اشیاء کی اطلاع دیں", hi: "लापता हाजी या खोए सामान की रिपोर्ट करें", ta: "காணாமல் போனவர்களை அறிக்கையிடுங்கள்", te: "పోగొట్టుకున్న యాత్రికులను నివేదించండి", mr: "हरवलेले हाजी किंवा वस्तू नोंदवा", bn: "হারিয়ে যাওয়া হাজী বা সামগ্রী জানান", or: "ହଜିଯାଇଥିବା ହାଜି କିମ୍ବା ସାମଗ୍ରୀ ରିପୋର୍ଟ କରନ୍ତୁ", ml: "നഷ്ടപ്പെട്ട തീർത്ഥാടകർ റിപ്പോർട്ട് ചെയ്യുക", pa: "ਗੁਆਚੇ ਹਾਜੀ ਜਾਂ ਸਮਾਨ ਦੀ ਰਿਪੋਰਟ ਕਰੋ" },
      back: { en: "Back", ar: "رجوع", ur: "واپس", hi: "वापस", ta: "பின்", te: "వెనక్కి", mr: "मागे", bn: "ফিরে", or: "ପଛକୁ", ml: "തിരികെ", pa: "ਵਾਪਸ" },
      reportNew: { en: "Report Lost", ar: "أبلغ عن مفقود", ur: "گم شدہ کی اطلاع دیں", hi: "खोया दर्ज करें", ta: "புகாரளி", te: "నివేదించండి", mr: "नोंदवा", bn: "রিপোর্ট", or: "ରିପୋର୍ଟ", ml: "റിപ്പോർട്ട്", pa: "ਰਿਪੋਰਟ ਕਰੋ" },
      searchPlaceholder: { en: "Search reports...", ar: "بحث...", ur: "تلاش کریں...", hi: "खोजें...", ta: "தேடு...", te: "శోధించండి...", mr: "शोधा...", bn: "অনুসন্ধান...", or: "ସନ୍ଧାନ...", ml: "തിരയുക...", pa: "ਖੋਜੋ..." },
      all: { en: "All", ar: "الكل", ur: "تمام", hi: "सभी", ta: "அனைத்தும்", te: "అన్నీ", mr: "सर्व", bn: "সব", or: "ସବୁ", ml: "എല്ലാം", pa: "ਸਾਰੇ" },
      person: { en: "Person", ar: "شخص", ur: "شخص", hi: "व्यक्ति", ta: "நபர்", te: "వ్యక్తి", mr: "व्यक्ती", bn: "ব্যক্তি", or: "ବ୍ୟକ୍ତି", ml: "വ്യക്തി", pa: "ਵਿਅਕਤੀ" },
      item: { en: "Item", ar: "شيء", ur: "چیز", hi: "सामान", ta: "பொருள்", te: "వస్తువు", mr: "वस्तू", bn: "জিনিস", or: "ସାମଗ୍ରୀ", ml: "സാധനം", pa: "ਸਮਾਨ" },
      noReports: { en: "No reports yet. Be the first to report.", ar: "لا توجد تقارير بعد", ur: "ابھی کوئی رپورٹ نہیں", hi: "अभी कोई रिपोर्ट नहीं", ta: "இன்னும் அறிக்கை இல்லை", te: "ఇంకా నివేదికలు లేవు", mr: "अद्याप अहवाल नाहीत", bn: "এখনো কোনো রিপোর্ট নেই", or: "ଏପର୍ଯ୍ୟନ୍ତ କିଛି ନାହିଁ", ml: "ഇതുവരെ റിപ്പോർട്ടുകളില്ല", pa: "ਅਜੇ ਕੋਈ ਰਿਪੋਰਟ ਨਹੀਂ" },
      formTitle: { en: "Report Lost Person or Item", ar: "أبلغ عن شخص أو شيء مفقود", ur: "گم شدہ شخص یا چیز کی اطلاع دیں", hi: "खोए हुए व्यक्ति या सामान की रिपोर्ट करें", ta: "தொலைந்த நபர் அல்லது பொருளை அறிக்கையிடுங்கள்", te: "పోగొట్టుకున్న వ్యక్తి లేదా వస్తువును నివేదించండి", mr: "हरवलेल्या व्यक्ती किंवा वस्तूची नोंदवा", bn: "হারিয়ে যাওয়া ব্যক্তি বা জিনিস রিপোর্ট করুন", or: "ହଜିଯାଇଥିବା ବ୍ୟକ୍ତି କିମ୍ବା ସାମଗ୍ରୀ ରିପୋର୍ଟ କରନ୍ତୁ", ml: "നഷ്ടപ്പെട്ടത് റിപ്പോർട്ട് ചെയ്യുക", pa: "ਗੁਆਚੇ ਵਿਅਕਤੀ ਜਾਂ ਸਮਾਨ ਦੀ ਰਿਪੋਰਟ ਕਰੋ" },
      formDescription: { en: "Fill in details so others can help find them.", ar: "املأ التفاصيل ليساعد الآخرون في العثور عليه", ur: "تفصیلات بھریں تاکہ دوسرے ڈھونڈنے میں مدد کریں", hi: "विवरण भरें ताकि अन्य लोग ढूंढने में मदद कर सकें", ta: "மற்றவர்கள் கண்டுபிடிக்க உதவ விவரங்களை நிரப்பவும்", te: "ఇతరులు కనుగొనడంలో సహాయపడేలా వివరాలు పూరించండి", mr: "इतरांना शोधण्यात मदत करण्यासाठी तपशील भरा", bn: "বিস্তারিত পূরণ করুন যাতে অন্যরা খুঁজে পেতে সাহায্য করে", or: "ଅନ୍ୟମାନେ ଖୋଜିବାରେ ସାହାଯ୍ୟ କରିବାକୁ ବିବରଣୀ ପୂରଣ କରନ୍ତୁ", ml: "മറ്റുള്ളവർ കണ്ടെത്താൻ വിശദാംശങ്ങൾ പൂരിപ്പിക്കുക", pa: "ਵੇਰਵੇ ਭਰੋ ਤਾਂ ਜੋ ਦੂਜੇ ਲੋਕ ਲੱਭਣ ਵਿੱਚ ਮਦਦ ਕਰ ਸਕਣ" },
      reportType: { en: "What is lost?", ar: "ما المفقود؟", ur: "کیا گم ہوا؟", hi: "क्या खो गया?", ta: "என்ன தொலைந்தது?", te: "ఏది పోగొట్టుకున్నారు?", mr: "काय हरवले?", bn: "কী হারিয়েছে?", or: "କଣ ହଜିଲା?", ml: "എന്താണ് നഷ്ടപ്പെട്ടത്?", pa: "ਕੀ ਗੁਆਚਿਆ?" },
      personName: { en: "Full Name", ar: "الاسم الكامل", ur: "پورا نام", hi: "पूरा नाम", ta: "பெயர்", te: "పూర్తి పేరు", mr: "पूर्ण नाव", bn: "পুরো নাম", or: "ପୂର୍ଣ୍ଣ ନାମ", ml: "പൂർണ്ണ പേര്", pa: "ਪੂਰਾ ਨਾਮ" },
      age: { en: "Age", ar: "العمر", ur: "عمر", hi: "उम्र", ta: "வயது", te: "వయస్సు", mr: "वय", bn: "বয়স", or: "ବୟସ", ml: "പ്രായം", pa: "ਉਮਰ" },
      gender: { en: "Gender", ar: "الجنس", ur: "جنس", hi: "लिंग", ta: "பாலினம்", te: "లింగం", mr: "लिंग", bn: "লিঙ্গ", or: "ଲିଙ୍ଗ", ml: "ലിംഗം", pa: "ਲਿੰਗ" },
      male: { en: "Male", ar: "ذكر", ur: "مرد", hi: "पुरुष", ta: "ஆண்", te: "పురుషుడు", mr: "पुरुष", bn: "পুরুষ", or: "ପୁରୁଷ", ml: "പുരുഷൻ", pa: "ਮਰਦ" },
      female: { en: "Female", ar: "أنثى", ur: "عورت", hi: "महिला", ta: "பெண்", te: "స్త్రీ", mr: "महिला", bn: "মহিলা", or: "ମହିଳା", ml: "സ്ത്രീ", pa: "ਔਰਤ" },
      personDesc: { en: "Description (height, build, identifying marks)", ar: "الوصف", ur: "تفصیل", hi: "विवरण (कद, निशान)", ta: "விவரம்", te: "వివరణ", mr: "वर्णन", bn: "বিবরণ", or: "ବର୍ଣ୍ଣନା", ml: "വിവരണം", pa: "ਵੇਰਵਾ" },
      wearing: { en: "What were they wearing?", ar: "ماذا كان يرتدي؟", ur: "کیا پہن رکھا تھا؟", hi: "क्या पहना था?", ta: "என்ன அணிந்திருந்தார்?", te: "ఏమి ధరించారు?", mr: "काय परिधान केले होते?", bn: "কী পরেছিল?", or: "କଣ ପିନ୍ଧିଥିଲେ?", ml: "എന്ത് ധരിച്ചിരുന്നു?", pa: "ਕੀ ਪਹਿਨਿਆ ਸੀ?" },
      itemName: { en: "Item Name", ar: "اسم الشيء", ur: "چیز کا نام", hi: "सामान का नाम", ta: "பொருள் பெயர்", te: "వస్తువు పేరు", mr: "वस्तूचे नाव", bn: "জিনিসের নাম", or: "ସାମଗ୍ରୀ ନାମ", ml: "സാധനത്തിന്റെ പേര്", pa: "ਸਮਾਨ ਦਾ ਨਾਮ" },
      itemDesc: { en: "Description (color, brand, contents)", ar: "الوصف", ur: "تفصیل", hi: "विवरण (रंग, ब्रांड)", ta: "விவரம்", te: "వివరణ", mr: "वर्णन", bn: "বিবরণ", or: "ବର୍ଣ୍ଣନା", ml: "വിവരണം", pa: "ਵੇਰਵਾ" },
      lastLocation: { en: "Last Seen Location", ar: "آخر موقع", ur: "آخری مقام", hi: "आखिरी जगह", ta: "கடைசி இடம்", te: "చివరి ప్రదేశం", mr: "शेवटची जागा", bn: "শেষ স্থান", or: "ଶେଷ ସ୍ଥାନ", ml: "അവസാന സ്ഥലം", pa: "ਆਖਰੀ ਸਥਾਨ" },
      lastTime: { en: "Last Seen Time", ar: "آخر وقت", ur: "آخری وقت", hi: "आखिरी समय", ta: "கடைசி நேரம்", te: "చివరి సమయం", mr: "शेवटचा वेळ", bn: "শেষ সময়", or: "ଶେଷ ସମୟ", ml: "അവസാന സമയം", pa: "ਆਖਰੀ ਸਮਾਂ" },
      photo: { en: "Upload Photo", ar: "رفع صورة", ur: "تصویر اپ لوڈ", hi: "फोटो अपलोड", ta: "புகைப்படம்", te: "ఫోటో", mr: "फोटो अपलोड", bn: "ছবি আপলোড", or: "ଫଟୋ", ml: "ഫോട്ടോ", pa: "ਫੋਟੋ ਅੱਪਲੋਡ" },
      reporterName: { en: "Your Name", ar: "اسمك", ur: "آپ کا نام", hi: "आपका नाम", ta: "உங்கள் பெயர்", te: "మీ పేరు", mr: "तुमचे नाव", bn: "আপনার নাম", or: "ଆପଣଙ୍କ ନାମ", ml: "നിങ്ങളുടെ പേര്", pa: "ਤੁਹਾਡਾ ਨਾਮ" },
      mobile: { en: "Mobile Number", ar: "رقم الجوال", ur: "موبائل نمبر", hi: "मोबाइल नंबर", ta: "மொபைல் எண்", te: "మొబైల్ నంబర్", mr: "मोबाइल क्रमांक", bn: "মোবাইল নম্বর", or: "ମୋବାଇଲ ନମ୍ବର", ml: "മൊബൈൽ", pa: "ਮੋਬਾਈਲ ਨੰਬਰ" },
      whatsapp: { en: "WhatsApp (optional)", ar: "واتساب", ur: "واٹس ایپ", hi: "व्हाट्सएप", ta: "வாட்ஸ்அப்", te: "వాట్సాప్", mr: "व्हॉट्सअॅप", bn: "হোয়াটসঅ্যাপ", or: "ୱାଟସଆପ", ml: "വാട്ട്‌സാപ്പ്", pa: "ਵਟਸਐਪ" },
      notes: { en: "Additional Notes", ar: "ملاحظات", ur: "اضافی نوٹس", hi: "अतिरिक्त नोट्स", ta: "குறிப்புகள்", te: "గమనికలు", mr: "टिपा", bn: "অতিরিক্ত নোট", or: "ଅତିରିକ୍ତ ଟିପ୍ପଣୀ", ml: "കുറിപ്പുകൾ", pa: "ਨੋਟਸ" },
      submit: { en: "Submit Report", ar: "إرسال", ur: "جمع کرائیں", hi: "रिपोर्ट जमा करें", ta: "சமர்ப்பி", te: "సమర్పించండి", mr: "सबमिट करा", bn: "জমা দিন", or: "ଦାଖଲ କରନ୍ତୁ", ml: "സമർപ്പിക്കുക", pa: "ਜਮ੍ਹਾਂ ਕਰੋ" },
      cancel: { en: "Cancel", ar: "إلغاء", ur: "منسوخ", hi: "रद्द करें", ta: "ரத்து", te: "రద్దు", mr: "रद्द", bn: "বাতিল", or: "ବାତିଲ", ml: "റദ്ദാക്കുക", pa: "ਰੱਦ" },
      success: { en: "Report submitted successfully!", ar: "تم إرسال التقرير", ur: "رپورٹ جمع ہو گئی", hi: "रिपोर्ट जमा हो गई", ta: "அறிக்கை சமர்ப்பிக்கப்பட்டது", te: "నివేదిక సమర్పించబడింది", mr: "अहवाल सबमिट झाला", bn: "রিপোর্ট জমা হয়েছে", or: "ରିପୋର୍ଟ ଦାଖଲ ହେଲା", ml: "റിപ്പോർട്ട് സമർപ്പിച്ചു", pa: "ਰਿਪੋਰਟ ਜਮ੍ਹਾਂ ਹੋਈ" },
      contact: { en: "Contact", ar: "اتصال", ur: "رابطہ", hi: "संपर्क", ta: "தொடர்பு", te: "సంప్రదించండి", mr: "संपर्क", bn: "যোগাযোগ", or: "ଯୋଗାଯୋଗ", ml: "ബന്ധപ്പെടുക", pa: "ਸੰਪਰਕ" },
      open: { en: "Open", ar: "مفتوح", ur: "کھلا", hi: "खुला", ta: "திறந்தது", te: "ఓపెన్", mr: "उघडे", bn: "খোলা", or: "ଖୋଲା", ml: "തുറന്നു", pa: "ਖੁੱਲ੍ਹਾ" },
      found: { en: "Found", ar: "وُجد", ur: "مل گیا", hi: "मिल गया", ta: "கிடைத்தது", te: "దొరికింది", mr: "सापडले", bn: "পাওয়া গেছে", or: "ମିଳିଲା", ml: "കണ്ടെത്തി", pa: "ਮਿਲ ਗਿਆ" },
    };
    const get = (key: keyof typeof labels) =>
      (labels[key] as Record<string, string>)[language] || (labels[key] as Record<string, string>).en;
    return { get };
  }, [language]);

  const fetchReports = async () => {
    setLoading(true);
    // Authenticated users get full contact details from the base table.
    // Anonymous users get a public-safe view (no phone/whatsapp) to protect reporter privacy.
    const { data: { session } } = await supabase.auth.getSession();
    const query = session
      ? supabase.from("lost_and_found").select("*")
      : supabase.from("lost_and_found_public").select("*");

    const { data, error } = await query
      .in("status", ["open", "found"])
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setReports((data ?? []) as LostFoundReport[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max 10MB", variant: "destructive" });
      return;
    }
    try {
      const compressed = await compressImage(file, 2);
      setPhotoFile(compressed);
      setPhotoPreview(URL.createObjectURL(compressed));
    } catch {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setForm({
      report_type: "person",
      person_name: "",
      person_age: "",
      person_gender: "male",
      person_description: "",
      wearing_description: "",
      item_name: "",
      item_description: "",
      last_seen_location: "",
      last_seen_at: "",
      reporter_name: "",
      reporter_mobile: "",
      reporter_whatsapp: "",
      notes: "",
    });
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        report_type: form.report_type,
        person_name: form.report_type === "person" ? form.person_name || undefined : undefined,
        person_age: form.report_type === "person" && form.person_age ? Number(form.person_age) : undefined,
        person_gender: form.report_type === "person" ? form.person_gender : undefined,
        person_description: form.report_type === "person" ? form.person_description || undefined : undefined,
        wearing_description: form.report_type === "person" ? form.wearing_description || undefined : undefined,
        item_name: form.report_type === "item" ? form.item_name || undefined : undefined,
        item_description: form.report_type === "item" ? form.item_description || undefined : undefined,
        last_seen_location: form.last_seen_location,
        last_seen_at: form.last_seen_at || undefined,
        reporter_name: form.reporter_name,
        reporter_mobile: form.reporter_mobile,
        reporter_whatsapp: form.reporter_whatsapp || undefined,
        notes: form.notes || undefined,
      };

      const parsed = reportSchema.safeParse(payload);
      if (!parsed.success) {
        const firstErr = Object.values(parsed.error.flatten().fieldErrors)[0]?.[0];
        toast({ title: "Validation Error", description: firstErr || "Check fields", variant: "destructive" });
        setSubmitting(false);
        return;
      }

      let photo_url: string | null = null;
      if (photoFile) {
        const ext = photoFile.name.split(".").pop() || "jpg";
        const fileName = `${crypto.randomUUID()}.${ext}`;
        const { error: uploadErr } = await supabase.storage
          .from("lost-found-photos")
          .upload(fileName, photoFile, { contentType: photoFile.type });
        if (uploadErr) throw uploadErr;
        const { data: urlData } = supabase.storage.from("lost-found-photos").getPublicUrl(fileName);
        photo_url = urlData.publicUrl;
      }

      const { data: { user } } = await supabase.auth.getUser();
      const insertPayload: any = {
        ...parsed.data,
        photo_url,
        language,
        user_id: user?.id ?? null,
      };
      const { error } = await supabase.from("lost_and_found").insert(insertPayload);
      if (error) throw error;

      toast({ title: t.get("success"), description: "" });
      resetForm();
      setDialogOpen(false);
      fetchReports();
    } catch (err: any) {
      toast({ title: "Error", description: err.message ?? "Failed", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = reports.filter((r) => {
    if (filterType !== "all" && r.report_type !== filterType) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (r.person_name?.toLowerCase().includes(q)) ||
      (r.item_name?.toLowerCase().includes(q)) ||
      r.last_seen_location.toLowerCase().includes(q) ||
      (r.person_description?.toLowerCase().includes(q)) ||
      (r.item_description?.toLowerCase().includes(q))
    );
  });

  return (
    <MainLayout>
      <div className={`min-h-screen bg-gradient-to-b from-emerald-50/40 via-background to-background ${isRTL ? "rtl" : ""}`}>
        <div className="max-w-3xl mx-auto p-4 space-y-4 pb-24">
          {/* Header */}
          <div className="flex items-center justify-between gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/home">
                {isRTL ? <ArrowLeft className="rotate-180 h-4 w-4 mr-1" /> : <ArrowLeft className="h-4 w-4 mr-1" />}
                {t.get("back")}
              </Link>
            </Button>
          </div>

          <div className="text-center space-y-2 py-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600">
              <Search className="h-7 w-7" />
            </div>
            <h1 className="text-2xl font-bold">{t.get("title")}</h1>
            <p className="text-sm text-muted-foreground">{t.get("subtitle")}</p>
          </div>

          {/* CTA + Search */}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full h-12 text-base bg-emerald-600 hover:bg-emerald-700">
                <Plus className="h-5 w-5 mr-2" />
                {t.get("reportNew")}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{t.get("formTitle")}</DialogTitle>
                <DialogDescription>{t.get("formDescription")}</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Report type */}
                <div>
                  <Label>{t.get("reportType")}</Label>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <Button
                      type="button"
                      variant={form.report_type === "person" ? "default" : "outline"}
                      onClick={() => setForm({ ...form, report_type: "person" })}
                      className="h-12"
                    >
                      <User className="h-4 w-4 mr-2" />
                      {t.get("person")}
                    </Button>
                    <Button
                      type="button"
                      variant={form.report_type === "item" ? "default" : "outline"}
                      onClick={() => setForm({ ...form, report_type: "item" })}
                      className="h-12"
                    >
                      <Package className="h-4 w-4 mr-2" />
                      {t.get("item")}
                    </Button>
                  </div>
                </div>

                {/* Person fields */}
                {form.report_type === "person" && (
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="pname">{t.get("personName")} *</Label>
                      <Input
                        id="pname"
                        value={form.person_name}
                        onChange={(e) => setForm({ ...form, person_name: e.target.value })}
                        maxLength={100}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="age">{t.get("age")}</Label>
                        <Input
                          id="age"
                          type="number"
                          value={form.person_age}
                          onChange={(e) => setForm({ ...form, person_age: e.target.value })}
                          min={0}
                          max={120}
                        />
                      </div>
                      <div>
                        <Label htmlFor="gender">{t.get("gender")}</Label>
                        <Select
                          value={form.person_gender}
                          onValueChange={(v) => setForm({ ...form, person_gender: v })}
                        >
                          <SelectTrigger id="gender">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">{t.get("male")}</SelectItem>
                            <SelectItem value="female">{t.get("female")}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="pdesc">{t.get("personDesc")}</Label>
                      <Textarea
                        id="pdesc"
                        value={form.person_description}
                        onChange={(e) => setForm({ ...form, person_description: e.target.value })}
                        maxLength={500}
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label htmlFor="wear">{t.get("wearing")}</Label>
                      <Textarea
                        id="wear"
                        value={form.wearing_description}
                        onChange={(e) => setForm({ ...form, wearing_description: e.target.value })}
                        maxLength={300}
                        rows={2}
                      />
                    </div>
                  </div>
                )}

                {/* Item fields */}
                {form.report_type === "item" && (
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="iname">{t.get("itemName")} *</Label>
                      <Input
                        id="iname"
                        value={form.item_name}
                        onChange={(e) => setForm({ ...form, item_name: e.target.value })}
                        maxLength={100}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="idesc">{t.get("itemDesc")}</Label>
                      <Textarea
                        id="idesc"
                        value={form.item_description}
                        onChange={(e) => setForm({ ...form, item_description: e.target.value })}
                        maxLength={500}
                        rows={3}
                      />
                    </div>
                  </div>
                )}

                {/* Common fields */}
                <div>
                  <Label htmlFor="loc">{t.get("lastLocation")} *</Label>
                  <Input
                    id="loc"
                    value={form.last_seen_location}
                    onChange={(e) => setForm({ ...form, last_seen_location: e.target.value })}
                    maxLength={200}
                    placeholder="Mina, Arafat, Masjid al-Haram..."
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="time">{t.get("lastTime")}</Label>
                  <Input
                    id="time"
                    type="datetime-local"
                    value={form.last_seen_at}
                    onChange={(e) => setForm({ ...form, last_seen_at: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="photo">{t.get("photo")}</Label>
                  <Input
                    id="photo"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                  />
                  {photoPreview && (
                    <img src={photoPreview} alt="preview" className="mt-2 h-32 w-32 object-cover rounded-md" />
                  )}
                </div>

                <div className="border-t pt-3 space-y-3">
                  <div>
                    <Label htmlFor="rname">{t.get("reporterName")} *</Label>
                    <Input
                      id="rname"
                      value={form.reporter_name}
                      onChange={(e) => setForm({ ...form, reporter_name: e.target.value })}
                      maxLength={100}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="mob">{t.get("mobile")} *</Label>
                    <Input
                      id="mob"
                      type="tel"
                      value={form.reporter_mobile}
                      onChange={(e) => setForm({ ...form, reporter_mobile: e.target.value })}
                      maxLength={20}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="wa">{t.get("whatsapp")}</Label>
                    <Input
                      id="wa"
                      type="tel"
                      value={form.reporter_whatsapp}
                      onChange={(e) => setForm({ ...form, reporter_whatsapp: e.target.value })}
                      maxLength={20}
                    />
                  </div>
                  <div>
                    <Label htmlFor="notes">{t.get("notes")}</Label>
                    <Textarea
                      id="notes"
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      maxLength={500}
                      rows={2}
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} className="flex-1">
                    {t.get("cancel")}
                  </Button>
                  <Button type="submit" disabled={submitting} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : t.get("submit")}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.get("searchPlaceholder")}
              className="pl-9 h-11"
            />
          </div>

          {/* Tabs filter */}
          <Tabs value={filterType} onValueChange={(v) => setFilterType(v as any)}>
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="all">{t.get("all")} ({reports.length})</TabsTrigger>
              <TabsTrigger value="person">
                <User className="h-3.5 w-3.5 mr-1" />
                {t.get("person")}
              </TabsTrigger>
              <TabsTrigger value="item">
                <Package className="h-3.5 w-3.5 mr-1" />
                {t.get("item")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value={filterType} className="mt-4 space-y-3">
              {loading ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : filtered.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-10 text-muted-foreground">
                    <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>{t.get("noReports")}</p>
                  </CardContent>
                </Card>
              ) : (
                filtered.map((r) => (
                  <Card key={r.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex gap-3">
                        {r.photo_url ? (
                          <img
                            src={r.photo_url}
                            alt=""
                            className="h-20 w-20 object-cover rounded-md flex-shrink-0"
                            loading="lazy"
                          />
                        ) : (
                          <div className="h-20 w-20 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                            {r.report_type === "person" ? (
                              <User className="h-8 w-8 text-muted-foreground" />
                            ) : (
                              <Package className="h-8 w-8 text-muted-foreground" />
                            )}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-semibold truncate">
                              {r.report_type === "person" ? r.person_name : r.item_name}
                            </h3>
                            <Badge
                              variant={r.status === "found" ? "default" : "secondary"}
                              className={r.status === "found" ? "bg-emerald-500" : ""}
                            >
                              {r.status === "found" && <CheckCircle2 className="h-3 w-3 mr-1" />}
                              {t.get(r.status as "open" | "found")}
                            </Badge>
                          </div>
                          {r.report_type === "person" && (
                            <p className="text-xs text-muted-foreground">
                              {r.person_age ? `${r.person_age}y • ` : ""}
                              {r.person_gender === "female" ? t.get("female") : t.get("male")}
                            </p>
                          )}
                          <p className="text-sm mt-1 line-clamp-2">
                            {r.report_type === "person" ? r.person_description : r.item_description}
                          </p>
                          {r.wearing_description && (
                            <p className="text-xs text-muted-foreground mt-1 italic">
                              👕 {r.wearing_description}
                            </p>
                          )}
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate">{r.last_seen_location}</span>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-3">
                            {r.reporter_mobile ? (
                              <>
                                <Button asChild size="sm" variant="outline" className="h-8">
                                  <a href={`tel:${r.reporter_mobile}`}>
                                    <Phone className="h-3 w-3 mr-1" />
                                    {t.get("contact")}
                                  </a>
                                </Button>
                                {r.reporter_whatsapp && (
                                  <Button asChild size="sm" variant="outline" className="h-8">
                                    <a
                                      href={`https://wa.me/${r.reporter_whatsapp.replace(/\D/g, "")}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      WhatsApp
                                    </a>
                                  </Button>
                                )}
                              </>
                            ) : (
                              <p className="text-xs text-muted-foreground italic">
                                Sign in to view contact details
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default LostAndFoundPage;
