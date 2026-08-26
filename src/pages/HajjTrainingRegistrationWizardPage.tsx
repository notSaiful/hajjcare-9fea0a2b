import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { MainLayout } from "@/components/MainLayout";
import { VoiceAssistant } from "@/components/VoiceAssistant";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  EMBARKATION_POINTS,
  STATE_EMBARKATION_SUGGESTIONS,
  TRAINING_COMMUNITY_URLS,
} from "@/data/trainingRegistrationOptions";
import {
  DISTRICTS_BY_STATE,
  INDIA_DISTRICT_CATALOG,
  INDIA_STATE_NAMES,
  type IndiaDistrict,
  getDistrictDisplayName,
} from "@/data/indiaDistricts";
import { loadLatestIndiaDistrictCatalog } from "@/lib/indiaDistrictCatalog";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  LockKeyhole,
  MessageCircle,
  ShieldCheck,
  Smartphone,
  UsersRound,
} from "lucide-react";
import zoyaApprovedImage from "@/assets/ai/zoya-hajj-companion.jpeg";

const DRAFT_KEY = "hajcare:100-day-registration:draft:v2";
const CONSENT_TEXT =
  "I confirm that the information provided is correct. I understand that my personal information will be kept strictly confidential and used only for HajCare AI training, guidance, emergency support, and official communication related to Hajj. My data will never be shared with any unauthorized third party.";

type Registration = {
  fullName: string;
  mobile: string;
  whatsapp: string;
  email: string;
  gender: string;
  age: string;
  firstHajj: boolean | null;
  hajjYear: string;
  coverNumber: string;
  state: string;
  district: string;
  city: string;
  embarkationPoint: string;
  pilgrimCategory: string;
  groupSize: string;
  memberRelationship: string;
  wheelchairRequired: boolean | null;
  medicalCondition: string;
  preferredLanguage: string;
  whatsappGroupOptIn: boolean | null;
  subscriptions: Record<string, boolean>;
  consent: boolean;
};
const blank: Registration = {
  fullName: "",
  mobile: "",
  whatsapp: "",
  email: "",
  gender: "",
  age: "",
  firstHajj: null,
  hajjYear: "2027",
  coverNumber: "",
  state: "",
  district: "",
  city: "",
  embarkationPoint: "",
  pilgrimCategory: "",
  groupSize: "1",
  memberRelationship: "",
  wheelchairRequired: null,
  medicalCondition: "",
  preferredLanguage: "en",
  whatsappGroupOptIn: null,
  subscriptions: {
    dailyTraining: true,
    circulars: true,
    emergencyAlerts: true,
    liveClasses: true,
    healthTips: true,
    travelUpdates: true,
  },
  consent: false,
};

const UI_COPY: Record<string, Record<string, string>> = {
  en: {
    title: "100 Days Free Hajj Training",
    subtitle:
      "A short, secure registration for daily guidance from HajCare AI.",
    next: "Next",
    back: "Back",
    save: "Saved automatically",
    mobileNote:
      "Your mobile number will be used only for Hajj training, important updates, and emergency communication. Your information will remain strictly confidential.",
    submit: "Complete registration",
    required: "This answer is required",
    privacy:
      "Your information is confidential and used only for Hajj training, support and official communication.",
    welcome: "Welcome to the HajCare AI family",
    success: "Your registration is complete.",
    whatsapp: "Contact me on WhatsApp",
    group: "Join official WhatsApp group",
    dashboard: "Open training dashboard",
  },
  hi: {
    title: "100 दिनों की निःशुल्क हज ट्रेनिंग",
    subtitle:
      "HajCare AI की रोज़ाना मार्गदर्शन के लिए छोटा और सुरक्षित पंजीकरण।",
    next: "आगे",
    back: "पीछे",
    save: "अपने आप सेव हो रहा है",
    mobileNote:
      "आपके मोबाइल नंबर का उपयोग केवल हज ट्रेनिंग, महत्वपूर्ण अपडेट और आपातकालीन संपर्क के लिए किया जाएगा। आपकी जानकारी पूरी तरह गोपनीय रहेगी।",
    submit: "पंजीकरण पूरा करें",
    required: "यह जानकारी आवश्यक है",
    privacy:
      "आपकी जानकारी गोपनीय रहेगी और केवल हज ट्रेनिंग, सहायता व आधिकारिक संवाद के लिए उपयोग होगी।",
    welcome: "HajCare AI परिवार में आपका स्वागत है",
    success: "आपका पंजीकरण पूरा हो गया है।",
    whatsapp: "WhatsApp पर संपर्क करें",
    group: "आधिकारिक WhatsApp समूह से जुड़ें",
    dashboard: "ट्रेनिंग डैशबोर्ड खोलें",
  },
  ur: {
    title: "100 دن کی مفت حج ٹریننگ",
    subtitle: "HajCare AI کی روزانہ رہنمائی کے لیے مختصر اور محفوظ رجسٹریشن۔",
    next: "آگے",
    back: "پیچھے",
    save: "خود بخود محفوظ ہو رہا ہے",
    mobileNote:
      "آپ کا موبائل نمبر صرف حج ٹریننگ، اہم اپ ڈیٹس اور ہنگامی رابطے کے لیے استعمال ہوگا۔ آپ کی معلومات مکمل طور پر خفیہ رہیں گی۔",
    submit: "رجسٹریشن مکمل کریں",
    required: "یہ معلومات ضروری ہے",
    privacy:
      "آپ کی معلومات خفیہ رہیں گی اور صرف حج ٹریننگ، مدد اور سرکاری رابطے کے لیے استعمال ہوں گی۔",
    welcome: "HajCare AI خاندان میں خوش آمدید",
    success: "آپ کی رجسٹریشن مکمل ہو گئی ہے۔",
    whatsapp: "WhatsApp پر رابطہ کریں",
    group: "سرکاری WhatsApp گروپ میں شامل ہوں",
    dashboard: "ٹریننگ ڈیش بورڈ کھولیں",
  },
  ar: {
    title: "تدريب الحج المجاني لمدة 100 يوم",
    subtitle: "تسجيل قصير وآمن للإرشاد اليومي من HajCare AI.",
    next: "التالي",
    back: "رجوع",
    save: "يتم الحفظ تلقائياً",
    mobileNote:
      "سيُستخدم رقم هاتفك فقط لتدريب الحج والتحديثات المهمة والتواصل في حالات الطوارئ. ستبقى معلوماتك سرية تماماً.",
    submit: "إكمال التسجيل",
    required: "هذه الإجابة مطلوبة",
    privacy:
      "ستبقى معلوماتك سرية وتستخدم فقط للتدريب والدعم والتواصل الرسمي للحج.",
    welcome: "مرحباً بك في عائلة HajCare AI",
    success: "اكتمل تسجيلك.",
    whatsapp: "تواصل معي عبر WhatsApp",
    group: "انضم إلى مجموعة WhatsApp الرسمية",
    dashboard: "فتح لوحة التدريب",
  },
};
const FIELD_KEYS = [
  "title",
  "subtitle",
  "next",
  "back",
  "save",
  "mobileNote",
  "submit",
  "required",
  "privacy",
  "welcome",
  "success",
  "whatsapp",
  "group",
  "dashboard",
];
const FIELD_LABELS: Record<string, string> = {
  fullName: "Full name as on Hajj application or passport",
  mobile: "Mobile number",
  whatsapp: "WhatsApp number",
  email: "Email (optional)",
  gender: "Gender",
  age: "Age",
  firstHajj: "Is this your first Hajj?",
  hajjYear: "Hajj year",
  coverNumber: "Hajj Cover Number",
  state: "State",
  district: "District",
  city: "City or town",
  embarkationPoint: "Embarkation point",
  pilgrimCategory: "Pilgrim category",
  groupSize: "Total members in your group",
  memberRelationship: "Relationship of members (optional)",
  wheelchairRequired: "Do you require a wheelchair?",
  medicalCondition: "Do you have a special medical condition?",
  preferredLanguage: "Preferred language",
  whatsappGroupOptIn: "Join the official HajCare AI WhatsApp group?",
  subscriptions: "What would you like to receive?",
  consent: "Consent and confidentiality",
};
const SUBSCRIPTIONS = [
  { key: "dailyTraining", label: "Daily Training" },
  { key: "circulars", label: "Important Hajj Circulars" },
  { key: "emergencyAlerts", label: "Emergency Alerts" },
  { key: "liveClasses", label: "Live Classes" },
  { key: "healthTips", label: "Health Tips" },
  { key: "travelUpdates", label: "Travel Updates" },
];
const HINDI_WELCOME = {
  greeting: "अस्सलामु अलैकुम व रहमतुल्लाहि व बरकातुहू",
  intro:
    "मैं ज़ोया हूँ। मैं आपको HajCare AI के निःशुल्क 100-दिवसीय हज प्रशिक्षण कार्यक्रम में आपका स्वागत करती हूँ।",
  guidance:
    "मैं आपकी चुनी हुई भाषा में हज से जुड़े प्रश्नों के उत्तर कुरआन, सहीह हदीस और भारत तथा सऊदी अरब के आधिकारिक हज दिशा-निर्देशों के अनुसार देने का प्रयास करूँगी।",
  action:
    "कृपया नीचे दिया गया पंजीकरण फ़ॉर्म भरें और अपनी हज यात्रा की तैयारी आज ही शुरू करें।",
};
const WELCOME_KEYS = ["greeting", "intro", "guidance", "action"];
const normalizePhone = (value: string) => {
  const digits = value.replace(/[^0-9]/g, "");
  return digits.length === 10
    ? `+91${digits}`
    : value.trim().startsWith("+")
      ? `+${digits}`
      : `+${digits}`;
};
const textFor = (language: string, key: string) =>
  UI_COPY[language]?.[key] || UI_COPY.en[key] || key;

function RegistrationHero({
  copy,
  welcome,
  showFallback,
}: {
  copy: (key: string) => string;
  welcome: (key: keyof typeof HINDI_WELCOME) => string;
  showFallback: boolean;
}) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-emerald-950 via-primary to-emerald-800 text-primary-foreground shadow-xl">
      <div className="flex items-center gap-4 p-4 sm:gap-5 sm:p-5">
        <div
          className="h-24 w-20 shrink-0 overflow-hidden rounded-2xl border-2 border-white/60 bg-emerald-100 shadow-lg sm:h-28 sm:w-24"
          aria-hidden="true"
        >
          <img
            src={zoyaApprovedImage}
            alt=""
            width={72}
            height={88}
            className="h-full w-full object-cover object-[34%_34%]"
          />
        </div>
        <div className="min-w-0 flex-1 text-center sm:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-200">
            HajCare AI · 100% Free
          </p>
          <h1 className="mt-1 text-xl font-bold sm:text-2xl">
            {copy("title")}
          </h1>
          <p className="mt-1 text-xs leading-5 text-white/85 sm:text-sm">
            {copy("subtitle")}
          </p>
        </div>
      </div>
      <div className="border-t border-white/15 bg-black/10 px-4 py-4 text-center sm:px-6">
        <p className="text-base font-semibold leading-7 sm:text-lg">
          {welcome("greeting")}
        </p>
        <div className="mx-auto mt-2 max-w-3xl space-y-1.5 text-sm leading-6 text-white/90 sm:text-[15px]">
          <p>{welcome("intro")}</p>
          <p>{welcome("guidance")}</p>
          <p>{welcome("action")}</p>
        </div>
        {showFallback && (
          <p className="mt-2 text-[11px] text-amber-100/90">
            Original Hindi wording is shown where a safe translation was
            unavailable.
          </p>
        )}
      </div>
      <div className="flex justify-center px-4 pb-4 sm:justify-start sm:px-5">
        <VoiceAssistant variant="cta" />
      </div>
    </section>
  );
}

export default function HajjTrainingRegistrationWizardPage() {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [form, setForm] = useState<Registration>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(DRAFT_KEY) || "null");
      if (!saved || typeof saved !== "object") return blank;
      return {
        ...blank,
        ...saved,
        subscriptions: {
          ...blank.subscriptions,
          ...(saved.subscriptions && typeof saved.subscriptions === "object"
            ? saved.subscriptions
            : {}),
        },
      };
    } catch {
      return blank;
    }
  });
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [complete, setComplete] = useState<{
    id: string;
    whatsappLink: string;
  } | null>(null);
  const [translated, setTranslated] = useState<Record<string, string>>({});
  const [translatedLabels, setTranslatedLabels] = useState<
    Record<string, string>
  >({});
  const [welcomeTranslation, setWelcomeTranslation] = useState<
    Record<string, string>
  >({});
  const [welcomeFallback, setWelcomeFallback] = useState(false);
  const [copyLoading, setCopyLoading] = useState(false);
  const [districtSearch, setDistrictSearch] = useState("");
  const [districtMenuOpen, setDistrictMenuOpen] = useState(false);
  const [districtCatalog, setDistrictCatalog] = useState<readonly IndiaDistrict[]>(
    INDIA_DISTRICT_CATALOG,
  );
  const submitLock = useRef(false);
  const copy = (key: string) => translated[key] || textFor(language, key);
  const welcome = (key: keyof typeof HINDI_WELCOME) =>
    language === "hi"
      ? HINDI_WELCOME[key]
      : welcomeTranslation[key] || HINDI_WELCOME[key];
  const districtsByState = useMemo(
    () =>
      districtCatalog.reduce<Record<string, IndiaDistrict[]>>((groups, district) => {
        (groups[district.state] ||= []).push(district);
        return groups;
      }, {}),
    [districtCatalog],
  );
  const stateNames = useMemo(
    () => Object.keys(districtsByState).sort((a, b) => a.localeCompare(b)),
    [districtsByState],
  );
  const districts = useMemo(
    () => districtsByState[form.state] || DISTRICTS_BY_STATE[form.state] || [],
    [districtsByState, form.state],
  );
  const filteredDistricts = useMemo(() => {
    const query = districtSearch.trim().toLocaleLowerCase();
    if (!query) return districts;
    return districts.filter((district) =>
      [district.name, district.localName]
        .filter(Boolean)
        .some((value) => value!.toLocaleLowerCase().includes(query)),
    );
  }, [districtSearch, districts]);
  const steps = useMemo(() => Object.keys(FIELD_LABELS), []);
  const currentKey = steps[step];
  const label = translatedLabels[currentKey] || FIELD_LABELS[currentKey];

  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
    } catch {
      /* optional cache */
    }
  }, [form]);
  useEffect(() => {
    let active = true;
    void loadLatestIndiaDistrictCatalog().then((catalog) => {
      if (active) setDistrictCatalog(catalog);
    });
    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    if (form.district && !districts.some((district) => district.name === form.district)) {
      setForm((current) => ({ ...current, district: "" }));
    }
  }, [districts, form.district]);
  useEffect(() => {
    let cancelled = false;
    if (language === "en") {
      setTranslated({});
      setTranslatedLabels({});
      return () => {
        cancelled = true;
      };
    }
    const items = [
      ...FIELD_KEYS.map((key) => ({ key, text: UI_COPY.en[key] })),
      ...Object.entries(FIELD_LABELS).map(([key, text]) => ({
        key: `label-${key}`,
        text,
      })),
    ];
    setCopyLoading(true);
    void supabase.functions
      .invoke("translate-start-here", {
        body: { sourceLanguage: "en", targetLanguage: language, items },
      })
      .then(({ data }) => {
        if (cancelled) return;
        const safe = (data?.translations || []).filter(
          (item: { key?: string; text?: string; confidence?: number }) =>
            item.key && item.text && (item.confidence ?? 0) >= 0.9,
        );
        const values = Object.fromEntries(
          safe.map((item: { key: string; text: string }) => [
            item.key,
            item.text,
          ]),
        );
        setTranslated(values);
        setTranslatedLabels(
          Object.fromEntries(
            Object.entries(values)
              .filter(([key]) => key.startsWith("label-"))
              .map(([key, value]) => [key.slice(6), value]),
          ),
        );
      })
      .finally(() => {
        if (!cancelled) setCopyLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [language]);
  useEffect(() => {
    let cancelled = false;
    if (language === "hi") {
      setWelcomeTranslation({});
      setWelcomeFallback(false);
      return () => {
        cancelled = true;
      };
    }
    void supabase.functions
      .invoke("translate-start-here", {
        body: {
          sourceLanguage: "hi",
          targetLanguage: language,
          items: WELCOME_KEYS.map((key) => ({
            key,
            text: HINDI_WELCOME[key as keyof typeof HINDI_WELCOME],
          })),
        },
      })
      .then(({ data }) => {
        if (cancelled) return;
        const safe = (data?.translations || []).filter(
          (item: { key?: string; text?: string; confidence?: number }) =>
            item.key && item.text && (item.confidence ?? 0) >= 0.9,
        );
        setWelcomeTranslation(
          Object.fromEntries(
            safe.map((item: { key: string; text: string }) => [
              item.key,
              item.text,
            ]),
          ),
        );
        setWelcomeFallback(safe.length !== WELCOME_KEYS.length);
      })
      .catch(() => {
        if (!cancelled) setWelcomeFallback(true);
      });
    return () => {
      cancelled = true;
    };
  }, [language]);

  const set = (
    key: keyof Registration,
    value: Registration[keyof Registration],
  ) => setForm((current) => ({ ...current, [key]: value }));
  const showError = () => {
    const messages: Record<string, string> = {
      fullName: "Please enter your full name as shown on your Hajj documents.",
      mobile: "Enter a valid mobile number with 10–15 digits.",
      whatsapp: "Enter a valid WhatsApp number with 10–15 digits.",
      age: "Enter an age between 1 and 120.",
      hajjYear: "Enter a valid Hajj year.",
      groupSize: "Enter a group size between 1 and 99.",
      consent: "Please accept the confidentiality declaration to continue.",
    };
    toast({
      title: messages[currentKey] || `${label}: ${copy("required")}`,
      variant: "destructive",
    });
  };
  const validCurrent = () => {
    if (currentKey === "fullName") return form.fullName.trim().length >= 2;
    if (currentKey === "mobile")
      return /^\+?[0-9]{10,15}$/.test(form.mobile.replace(/\s/g, ""));
    if (currentKey === "whatsapp")
      return /^\+?[0-9]{10,15}$/.test(form.whatsapp.replace(/\s/g, ""));
    if (["gender", "pilgrimCategory"].includes(currentKey))
      return String(form[currentKey as keyof Registration]).trim().length > 0;
    if (
      ["firstHajj", "wheelchairRequired", "whatsappGroupOptIn"].includes(
        currentKey,
      )
    )
      return form[currentKey as keyof Registration] !== null;
    if (currentKey === "age")
      return Number(form.age) >= 1 && Number(form.age) <= 120;
    if (currentKey === "hajjYear") return Number(form.hajjYear) >= 2025;
    if (
      [
        "coverNumber",
        "state",
        "district",
        "city",
        "embarkationPoint",
        "preferredLanguage",
      ].includes(currentKey)
    )
      return String(form[currentKey as keyof Registration]).trim().length > 0;
    if (currentKey === "groupSize")
      return Number(form.groupSize) >= 1 && Number(form.groupSize) <= 99;
    if (currentKey === "consent") return form.consent;
    return true;
  };
  const next = () => {
    if (!validCurrent()) return showError();
    setStep((current) => Math.min(current + 1, steps.length - 1));
  };
  const previous = () => setStep((current) => Math.max(current - 1, 0));
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (submitLock.current || submitting) return;
    if (!validCurrent()) return showError();
    submitLock.current = true;
    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "hajj-training-registration",
        {
          body: {
            action: "register_wizard",
            consent: true,
            consentText: CONSENT_TEXT,
            registration: {
              ...form,
              hajjYear: Number(form.hajjYear),
              age: Number(form.age),
              groupSize: Number(form.groupSize),
              preferredLanguage: language,
              mobile: normalizePhone(form.mobile),
              whatsapp: normalizePhone(form.whatsapp),
            },
          },
        },
      );
      if (error || !data?.success) {
        console.error("Hajj training registration failed", {
          status: error?.status,
          message: error?.message,
          serverError: data?.error,
        });
        return toast({
          title: "Registration could not be completed",
          description:
            data?.error ||
            "We could not save your registration. Please check your connection and try again.",
          variant: "destructive",
        });
      }
      try {
        localStorage.removeItem(DRAFT_KEY);
      } catch {
        /* optional cache */
      }
      setComplete({ id: data.registrationId, whatsappLink: data.whatsappLink });
    } catch (error) {
      console.error("Hajj training registration request failed", error);
      toast({
        title: "Registration could not be completed",
        description:
          "Please check your internet connection and try again. Your saved answers are still on this device.",
        variant: "destructive",
      });
    } finally {
      submitLock.current = false;
      setSubmitting(false);
    }
  };

  if (complete)
    return (
      <MainLayout>
        <main className="mx-auto max-w-xl px-4 py-8">
          <Card className="overflow-hidden shadow-xl">
            <div className="bg-gradient-to-br from-emerald-950 via-primary to-emerald-800 p-7 text-primary-foreground">
              <CheckCircle2 className="mb-4 h-12 w-12" />
              <h1 className="text-2xl font-bold">{copy("welcome")}</h1>
              <p className="mt-2 text-white/90">{copy("success")}</p>
            </div>
            <CardContent className="space-y-4 p-6">
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Registration ID
                </p>
                <p className="mt-1 font-mono text-2xl font-bold text-primary">
                  {complete.id}
                </p>
              </div>
              <Button asChild className="min-h-12 w-full gap-2">
                <a
                  href={complete.whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageCircle className="h-5 w-5" />
                  {copy("whatsapp")}
                </a>
              </Button>
              {TRAINING_COMMUNITY_URLS.whatsapp && (
                <Button
                  asChild
                  variant="outline"
                  className="min-h-12 w-full gap-2"
                >
                  <a
                    href={TRAINING_COMMUNITY_URLS.whatsapp}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <UsersRound className="h-5 w-5" />
                    {copy("group")}
                  </a>
                </Button>
              )}
              <Button asChild variant="outline" className="min-h-12 w-full">
                <Link to="/hajj-training-videos">{copy("dashboard")}</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </MainLayout>
    );

  const renderCurrent = () => {
    if (currentKey === "mobile")
      return (
        <div className="space-y-4">
          <Input
            autoFocus
            inputMode="tel"
            autoComplete="tel"
            value={form.mobile}
            onChange={(event) => set("mobile", event.target.value)}
            placeholder="10-digit mobile number"
            className="min-h-14 text-lg"
          />
          <p className="text-xs leading-5 text-muted-foreground">
            {copy("mobileNote")}
          </p>
        </div>
      );
    if (currentKey === "whatsapp")
      return (
        <div className="space-y-4">
          <p className="text-sm font-medium">Same as mobile number?</p>
          <div className="grid grid-cols-2 gap-3">
            {[true, false].map((same) => (
              <Button
                key={String(same)}
                type="button"
                variant={
                  same ===
                  (form.whatsapp === form.mobile && form.whatsapp !== "")
                    ? "default"
                    : "outline"
                }
                className="min-h-14"
                onClick={() => {
                  if (same) set("whatsapp", form.mobile);
                  else set("whatsapp", "");
                }}
              >
                {same ? "Yes" : "No"}
              </Button>
            ))}
          </div>
          {form.whatsapp !== form.mobile && (
            <Input
              autoFocus
              inputMode="tel"
              value={form.whatsapp}
              onChange={(event) => set("whatsapp", event.target.value)}
              placeholder="WhatsApp number"
              className="min-h-14 text-lg"
            />
          )}
        </div>
      );
    if (
      [
        "gender",
        "firstHajj",
        "wheelchairRequired",
        "whatsappGroupOptIn",
        "pilgrimCategory",
      ].includes(currentKey)
    ) {
      const options =
        currentKey === "gender"
          ? [
              ["female", "Female"],
              ["male", "Male"],
              ["prefer_not_to_say", "Prefer not to say"],
            ]
          : currentKey === "pilgrimCategory"
            ? [
                ["government", "Government Hajj"],
                ["private", "Private Hajj"],
              ]
            : [
                ["true", "Yes"],
                ["false", "No"],
              ];
      return (
        <div className="grid gap-3">
          {options.map(([value, text]) => {
            const selected =
              String(form[currentKey as keyof Registration]) === value;
            return (
              <Button
                key={value}
                type="button"
                variant={selected ? "default" : "outline"}
                className="min-h-14 justify-start text-base"
                onClick={() =>
                  set(
                    currentKey as keyof Registration,
                    currentKey === "gender" || currentKey === "pilgrimCategory"
                      ? value
                      : value === "true",
                  )
                }
              >
                {text}
              </Button>
            );
          })}
        </div>
      );
    }
    if (currentKey === "state")
      return (
        <select
          autoFocus
          value={form.state}
          onChange={(event) => {
            set("state", event.target.value);
            set("district", "");
            setDistrictSearch("");
            setDistrictMenuOpen(false);
            set(
              "embarkationPoint",
              STATE_EMBARKATION_SUGGESTIONS[event.target.value] || "",
            );
          }}
          className="min-h-14 w-full rounded-xl border bg-background px-4 text-lg"
        >
          <option value="">Select state</option>
          {(stateNames.length ? stateNames : INDIA_STATE_NAMES).map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
        </select>
      );
    if (currentKey === "district")
      return (
        <div className="relative">
          <Input
            autoFocus
            role="combobox"
            aria-expanded={districtMenuOpen}
            aria-controls="india-district-options"
            aria-autocomplete="list"
            value={
              districtMenuOpen
                ? districtSearch
                : form.district
                  ? getDistrictDisplayName(
                      districts.find((district) => district.name === form.district) || {
                        stateCode: "",
                        state: form.state,
                        districtCode: "",
                        name: form.district,
                      },
                      language,
                    )
                  : districtSearch
            }
            onFocus={() => setDistrictMenuOpen(true)}
            onChange={(event) => {
              setDistrictSearch(event.target.value);
              setDistrictMenuOpen(true);
              if (form.district) set("district", "");
            }}
            onBlur={() => window.setTimeout(() => setDistrictMenuOpen(false), 120)}
            disabled={!form.state}
            placeholder={form.state ? "Search district" : "Select state first"}
            className="min-h-14 text-lg"
          />
          {districtMenuOpen && form.state && (
            <div
              id="india-district-options"
              role="listbox"
              className="absolute z-50 mt-2 max-h-72 w-full overflow-auto rounded-xl border bg-popover p-1 text-popover-foreground shadow-xl"
            >
              {filteredDistricts.length ? (
                filteredDistricts.map((district) => (
                  <button
                    key={`${district.stateCode}-${district.districtCode}`}
                    type="button"
                    role="option"
                    aria-selected={form.district === district.name}
                    className="flex min-h-12 w-full items-center rounded-lg px-3 text-left text-base hover:bg-accent hover:text-accent-foreground"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => {
                      set("district", district.name);
                      setDistrictSearch("");
                      setDistrictMenuOpen(false);
                    }}
                  >
                    {getDistrictDisplayName(district, language)}
                    {district.localName &&
                      getDistrictDisplayName(district, language) !== district.name && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        ({district.name})
                      </span>
                      )}
                  </button>
                ))
              ) : (
                <p className="p-3 text-sm text-muted-foreground">
                  No district found in {form.state}.
                </p>
              )}
            </div>
          )}
          <p className="mt-2 text-xs text-muted-foreground">
            {districts.length} official LGD district{districts.length === 1 ? "" : "s"} in {form.state || "the selected state/UT"}.
          </p>
        </div>
      );
    if (currentKey === "embarkationPoint")
      return (
        <div className="space-y-2">
          <select
            autoFocus
            value={form.embarkationPoint}
            onChange={(event) => set("embarkationPoint", event.target.value)}
            className="min-h-14 w-full rounded-xl border bg-background px-4 text-lg"
          >
            <option value="">Select embarkation point</option>
            {EMBARKATION_POINTS.map((value) => (
              <option key={value} value={value}>
                {value}
                {STATE_EMBARKATION_SUGGESTIONS[form.state] === value
                  ? " (suggested)"
                  : ""}
              </option>
            ))}
          </select>
          {STATE_EMBARKATION_SUGGESTIONS[form.state] && (
            <p className="text-xs text-muted-foreground">
              Suggested from your State/UT: {STATE_EMBARKATION_SUGGESTIONS[form.state]}. You can change it if your official allocation is different.
            </p>
          )}
        </div>
      );
    if (currentKey === "preferredLanguage")
      return (
        <select
          autoFocus
          value={form.preferredLanguage}
          onChange={(event) => set("preferredLanguage", event.target.value)}
          className="min-h-14 w-full rounded-xl border bg-background px-4 text-lg"
        >
          <option value="en">English</option>
          <option value="hi">हिन्दी</option>
          <option value="ur">اردو</option>
          <option value="ar">العربية</option>
          <option value="kn">ಕನ್ನಡ</option>
          <option value="bn">বাংলা</option>
          <option value="mr">मराठी</option>
          <option value="ta">தமிழ்</option>
          <option value="te">తెలుగు</option>
          <option value="ml">മലയാളം</option>
          <option value="gu">ગુજરાતી</option>
          <option value="or">ଓଡ଼ିଆ</option>
          <option value="pa">ਪੰਜਾਬੀ</option>
        </select>
      );
    if (currentKey === "subscriptions")
      return (
        <div className="space-y-3">
          {SUBSCRIPTIONS.map((item) => (
            <label
              key={item.key}
              className="flex min-h-12 items-center gap-3 rounded-xl border p-3"
            >
              <Checkbox
                checked={form.subscriptions[item.key]}
                onCheckedChange={(checked) =>
                  set("subscriptions", {
                    ...form.subscriptions,
                    [item.key]: checked === true,
                  })
                }
              />
              <span>{item.label}</span>
            </label>
          ))}
        </div>
      );
    if (currentKey === "consent")
      return (
        <label className="flex items-start gap-3 rounded-2xl border bg-muted/40 p-4">
          <Checkbox
            checked={form.consent}
            onCheckedChange={(checked) => set("consent", checked === true)}
          />
          <span className="text-sm leading-6">{CONSENT_TEXT}</span>
        </label>
      );
    const isOptional = [
      "email",
      "memberRelationship",
      "medicalCondition",
    ].includes(currentKey);
    const type = ["age", "hajjYear", "groupSize"].includes(currentKey)
      ? "number"
      : currentKey === "email"
        ? "email"
        : "text";
    if (currentKey === "medicalCondition")
      return (
        <Textarea
          autoFocus
          value={form.medicalCondition}
          onChange={(event) => set("medicalCondition", event.target.value)}
          placeholder="Optional: tell us how we can assist"
          className="min-h-32 text-lg"
        />
      );
    return (
      <Input
        autoFocus
        type={type}
        inputMode={type === "number" ? "numeric" : undefined}
        value={String(form[currentKey as keyof Registration] || "")}
        onChange={(event) =>
          set(currentKey as keyof Registration, event.target.value)
        }
        placeholder={isOptional ? "Optional" : "Type your answer"}
        className="min-h-14 text-lg"
      />
    );
  };

  return (
    <MainLayout>
      <main className="mx-auto max-w-xl px-4 py-6 pb-16 sm:py-10">
        <RegistrationHero
          copy={copy}
          welcome={welcome}
          showFallback={welcomeFallback}
        />
        <div className="mt-5 flex items-center justify-between text-sm">
          <span className="font-semibold text-primary">
            {step + 1} / {steps.length}
          </span>
          <span className="text-muted-foreground">{copy("save")}</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>
        <Card className="mt-5 shadow-md">
          <CardContent className="p-5 sm:p-8">
            <form
              onSubmit={
                step === steps.length - 1
                  ? submit
                  : (event) => {
                      event.preventDefault();
                      next();
                    }
              }
            >
              <div className="mb-7">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                  Question {step + 1}
                </p>
                <h2 className="mt-2 text-2xl font-bold leading-tight">
                  {label}
                </h2>
                {copyLoading && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Translating…
                  </p>
                )}
              </div>
              {renderCurrent()}
              <div className="mt-8 flex gap-3">
                {step > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={previous}
                    className="min-h-12 flex-1 gap-2"
                  >
                    <ChevronLeft className="h-5 w-5" />
                    {copy("back")}
                  </Button>
                )}
                {step < steps.length - 1 ? (
                  <Button type="submit" className="min-h-12 flex-1 gap-2">
                    {copy("next")}
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="min-h-12 flex-1 gap-2"
                  >
                    {submitting ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <CheckCircle2 className="h-5 w-5" />
                    )}
                    {copy("submit")}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="flex gap-2 rounded-xl border p-3 text-xs">
            <ShieldCheck className="h-4 w-4 shrink-0 text-primary" />
            Secure registration
          </div>
          <div className="flex gap-2 rounded-xl border p-3 text-xs">
            <LockKeyhole className="h-4 w-4 shrink-0 text-primary" />
            Private information
          </div>
          <div className="flex gap-2 rounded-xl border p-3 text-xs">
            <Smartphone className="h-4 w-4 shrink-0 text-primary" />
            Admin contact enabled
          </div>
        </div>
      </main>
    </MainLayout>
  );
}
