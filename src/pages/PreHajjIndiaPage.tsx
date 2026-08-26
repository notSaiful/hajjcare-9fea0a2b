import { useNavigate } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { useLanguage } from "@/contexts/LanguageContext";
import { MainLayout } from "@/components/MainLayout";
import { TextToSpeechButton } from "@/components/TextToSpeechButton";
import { ArrowRight, BadgeCheck, BookOpenCheck, ClipboardCheck, FileCheck2, HeartPulse, IdCard, Luggage, MessagesSquare, MoonStar, PlaneTakeoff, type LucideIcon } from "lucide-react";

type SessionLanguage = "en" | "hi" | "ur";

type Feature = { icon: LucideIcon; href: string; title: Record<SessionLanguage, string>; description: Record<SessionLanguage, string> };

const copy: Record<SessionLanguage, { title: string; eyebrow: string; subtitle: string; free: string; cta: string; explore: string; note: string }> = {
  en: { title: "Pre-India Session | Haj 2027", eyebrow: "Haj 2027 (1448H)", subtitle: "Complete guidance for Indian pilgrims before departure.", free: "100% Free", cta: "Join Free Session", explore: "Explore guidance", note: "Content will be updated regularly as per the official Haj Committee of India and Government of India guidelines for Haj 2027." },
  hi: { title: "प्री-इंडिया सेशन | हज 2027", eyebrow: "हज 2027 (1448H)", subtitle: "प्रस्थान से पहले भारतीय तीर्थयात्रियों के लिए संपूर्ण मार्गदर्शन।", free: "100% निःशुल्क", cta: "निःशुल्क सेशन में जुड़ें", explore: "मार्गदर्शन देखें", note: "हज 2027 के लिए भारत हज समिति और भारत सरकार के आधिकारिक दिशानिर्देशों के अनुसार सामग्री नियमित रूप से अपडेट की जाएगी।" },
  ur: { title: "پری انڈیا سیشن | حج 2027", eyebrow: "حج 2027 (1448H)", subtitle: "روانگی سے پہلے ہندوستانی عازمین کے لیے مکمل رہنمائی۔", free: "100% مفت", cta: "مفت سیشن میں شامل ہوں", explore: "رہنمائی دیکھیں", note: "حج 2027 کے لیے حج کمیٹی آف انڈیا اور حکومت ہند کی سرکاری ہدایات کے مطابق مواد باقاعدگی سے اپ ڈیٹ کیا جائے گا۔" },
};

const features: Feature[] = [
  { icon: BookOpenCheck, href: "/pre-hajj-india/haj-committee-india", title: { en: "Haj 2027 Guidelines", hi: "हज 2027 दिशानिर्देश", ur: "حج 2027 رہنما اصول" }, description: { en: "Official requirements, timelines, and pilgrim essentials.", hi: "आधिकारिक आवश्यकताएं, समय-सीमा और जरूरी जानकारी।", ur: "سرکاری شرائط، اوقات اور ضروری معلومات۔" } },
  { icon: ClipboardCheck, href: "/pre-hajj-india/state-haj-committee", title: { en: "Application Process", hi: "आवेदन प्रक्रिया", ur: "درخواست کا عمل" }, description: { en: "Understand the digital HAF journey step by step.", hi: "डिजिटल HAF प्रक्रिया को चरण-दर-चरण समझें।", ur: "ڈیجیٹل HAF عمل کو مرحلہ وار سمجھیں۔" } },
  { icon: FileCheck2, href: "/pre-hajj-india/state-haj-committee", title: { en: "Document Verification", hi: "दस्तावेज़ सत्यापन", ur: "دستاویزات کی تصدیق" }, description: { en: "Prepare the documents needed for your application.", hi: "आवेदन के लिए जरूरी दस्तावेज़ तैयार करें।", ur: "درخواست کے لیے ضروری دستاویزات تیار کریں۔" } },
  { icon: IdCard, href: "/pre-hajj-india/embarkation-camp-process", title: { en: "Passport & Visa", hi: "पासपोर्ट और वीज़ा", ur: "پاسپورٹ اور ویزا" }, description: { en: "Keep passport and visa steps clear and organised.", hi: "पासपोर्ट और वीज़ा के चरण स्पष्ट और व्यवस्थित रखें।", ur: "پاسپورٹ اور ویزا کے مراحل واضح اور منظم رکھیں۔" } },
  { icon: HeartPulse, href: "/health", title: { en: "Vaccination & Health", hi: "टीकाकरण और स्वास्थ्य", ur: "ویکسینیشن اور صحت" }, description: { en: "Health screening, vaccines, and safe travel preparation.", hi: "स्वास्थ्य जांच, टीके और सुरक्षित यात्रा की तैयारी।", ur: "طبی جانچ، ویکسین اور محفوظ سفر کی تیاری۔" } },
  { icon: Luggage, href: "/pre-hajj-india/travel-preparation", title: { en: "Travel Preparation & Packing", hi: "यात्रा तैयारी और पैकिंग", ur: "سفری تیاری اور پیکنگ" }, description: { en: "Documents, packing, airport steps and prohibited items.", hi: "दस्तावेज़, पैकिंग, एयरपोर्ट चरण और निषिद्ध वस्तुएं।", ur: "دستاویزات، پیکنگ، ائیرپورٹ کے مراحل اور ممنوع اشیاء۔" } },
  { icon: MoonStar, href: "/prepare", title: { en: "Ihram Preparation", hi: "एहराम की तैयारी", ur: "احرام کی تیاری" }, description: { en: "Learn what to prepare before entering Ihram.", hi: "एहराम में प्रवेश से पहले क्या तैयार करें, जानें।", ur: "احرام میں داخل ہونے سے پہلے کی تیاری جانیں۔" } },
  { icon: PlaneTakeoff, href: "/pre-hajj-india/embarkation-points", title: { en: "Flight & Airport Guidance", hi: "उड़ान और हवाई अड्डा मार्गदर्शन", ur: "پرواز اور ہوائی اڈہ رہنمائی" }, description: { en: "Know what to expect from embarkation to departure.", hi: "एम्बार्केशन से प्रस्थान तक क्या उम्मीद करें, जानें।", ur: "ایمبارکیشن سے روانگی تک کیا توقع رکھیں، جانیں۔" } },
  { icon: MessagesSquare, href: "/chat", title: { en: "Live Q&A", hi: "लाइव प्रश्नोत्तर", ur: "لائیو سوال و جواب" }, description: { en: "Ask HajCare AI for clear, practical guidance.", hi: "स्पष्ट और व्यावहारिक मार्गदर्शन के लिए HajCare AI से पूछें।", ur: "واضح اور عملی رہنمائی کے لیے HajCare AI سے پوچھیں۔" } },
];

const PreHajjIndiaPage = () => {
  const { language, isRTL } = useLanguage();
  const navigate = useNavigate();
  const sessionLanguage: SessionLanguage = language === "hi" || language === "ur" ? language : "en";
  const l = copy[sessionLanguage];

  return (
    <MainLayout>
      <SEO title="Pre-India Session | Haj 2027" description="Complete guidance for Indian pilgrims before departure for Haj 2027 (1448H)." path="/pre-hajj-india" type="article" jsonLd={{ "@context": "https://schema.org", "@type": "Article", headline: "Pre-India Session | Haj 2027", description: "Complete guidance for Indian pilgrims before departure.", url: "https://hajjcare.in/pre-hajj-india" }} />
      <div className="relative isolate overflow-hidden rounded-[2rem] border border-emerald-100 bg-[#f8fcf8] px-4 py-6 shadow-[0_20px_80px_-40px_rgba(12,92,58,0.45)] sm:px-6 sm:py-10 lg:px-10" dir={isRTL ? "rtl" : "ltr"}>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top_right,_rgba(212,175,55,0.22),_transparent_42%),radial-gradient(circle_at_top_left,_rgba(5,117,71,0.18),_transparent_46%)]" />
        <div className="pointer-events-none absolute -right-24 top-28 h-56 w-56 rounded-full border-[28px] border-[#d4af37]/10" />
        <div className="pointer-events-none absolute -left-20 bottom-20 h-40 w-40 rounded-full border-[22px] border-emerald-700/10" />
        <section className="relative mx-auto max-w-5xl text-center">
          <div className="mx-auto mb-5 flex w-fit items-center gap-2 rounded-full border border-[#d4af37]/40 bg-white/90 px-4 py-2 text-sm font-bold text-[#876b12] shadow-sm"><BadgeCheck className="h-4 w-4" /><span>{l.free}</span></div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">{l.eyebrow}</p>
          <h1 className="mt-3 font-serif text-3xl font-bold leading-tight text-emerald-950 sm:text-5xl">{l.title}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-emerald-900/75 sm:text-lg">{l.subtitle}</p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <button onClick={() => navigate("/hajj-training-videos")} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-800 px-6 py-3 font-bold text-white shadow-lg shadow-emerald-900/20 transition hover:bg-emerald-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800">{l.cta}<ArrowRight className={`h-4 w-4 ${isRTL ? "rotate-180" : ""}`} /></button>
            <TextToSpeechButton text={`${l.title}. ${l.subtitle}`} variant="outline" size="default" />
          </div>
        </section>
        <section className="relative mx-auto mt-10 max-w-6xl" aria-label={l.explore}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return <button key={feature.href + feature.title.en} onClick={() => navigate(feature.href)} className="group flex min-h-44 flex-col rounded-2xl border border-emerald-100 bg-white p-5 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:border-[#d4af37]/60 hover:shadow-xl hover:shadow-emerald-950/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-800 text-[#f6d978] shadow-sm"><Icon className="h-5 w-5" /></span><span className="mt-4 text-base font-bold text-emerald-950">{feature.title[sessionLanguage]}</span><span className="mt-1 text-sm leading-6 text-slate-600">{feature.description[sessionLanguage]}</span><span className={`mt-auto pt-3 text-sm font-semibold text-emerald-700 ${isRTL ? "text-right" : "text-left"}`}>{l.explore}</span></button>;
            })}
          </div>
        </section>
        <footer className="relative mx-auto mt-8 max-w-5xl rounded-2xl border border-[#d4af37]/25 bg-[#fffdf5] px-5 py-4 text-center text-sm leading-6 text-[#685719]">{l.note}</footer>
      </div>
    </MainLayout>
  );
};

export default PreHajjIndiaPage;
