import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen, ExternalLink, Search, ShieldCheck } from "lucide-react";
import { SEO } from "@/components/SEO";
import { useLanguage } from "@/contexts/LanguageContext";

type Category = "quran" | "hadith" | "fiqh" | "hajj";
type Filter = Category | "all";

interface LibrarySource {
  title: string;
  tradition: string;
  category: Category;
  description: string;
  descriptionHi: string;
  url: string;
}

// Phase 1 is a directory of original publishers and source websites.
// Do not copy, index, or republish their texts without documented permission.
const sources: LibrarySource[] = [
  {
    title: "Quran.com",
    tradition: "Qur'an",
    category: "quran",
    description: "Read the Qur'an with available translations and navigation.",
    descriptionHi: "कुरआन और उपलब्ध अनुवाद मूल वेबसाइट पर पढ़ें।",
    url: "https://quran.com/",
  },
  {
    title: "HadeethEnc",
    tradition: "Hadith / multilingual",
    category: "hadith",
    description: "Selected hadiths, explanations and multilingual translations.",
    descriptionHi: "चुनी हुई हदीसें, व्याख्याएँ और अलग-अलग भाषाओं में अनुवाद।",
    url: "https://hadeethenc.com/en/home",
  },
  {
    title: "Sunnah.com",
    tradition: "Sunni hadith collections",
    category: "hadith",
    description: "Browse major hadith collections on the publisher's website.",
    descriptionHi: "सुन्नी हदीस के प्रमुख संग्रह मूल वेबसाइट पर पढ़ें।",
    url: "https://sunnah.com/",
  },
  {
    title: "Fatawa Razawiyya — Dawat-e-Islami",
    tradition: "Sunni / Barelvi / Hanafi",
    category: "fiqh",
    description: "Publisher's listing for Fatawa Razawiyya volumes.",
    descriptionHi: "फ़तावा रिज़विया की जिल्दें प्रकाशक की वेबसाइट पर देखें।",
    url: "https://www.dawateislami.net/bookslibrary/ur/fatawa-razawiyya-mukammal-30-jildain",
  },
  {
    title: "Darul Ifta Deoband",
    tradition: "Sunni / Deobandi / Hanafi",
    category: "fiqh",
    description: "Read published fatwa responses from Darul Ifta.",
    descriptionHi: "दारुल इफ़्ता के प्रकाशित फ़तवे मूल वेबसाइट पर पढ़ें।",
    url: "https://www.darulifta-deoband.com/home",
  },
  {
    title: "SeekersGuidance eBooks",
    tradition: "Sunni legal and educational resources",
    category: "fiqh",
    description: "Browse educational books on jurisprudence and other subjects.",
    descriptionHi: "फ़िक़्ह और दूसरे विषयों की शैक्षिक किताबें देखें।",
    url: "https://seekersguidance.org/ebooks/",
  },
  {
    title: "Al-Islam.org — Hadith Collections",
    tradition: "Shia / multiple traditions",
    category: "hadith",
    description: "Explore Shi'a hadith literature and related scholarship.",
    descriptionHi: "शिया हदीस साहित्य और संबंधित अध्ययन देखें।",
    url: "https://al-islam.org/library/hadith-collections",
  },
  {
    title: "Ayatollah Sistani — Books",
    tradition: "Shia / Ja'fari / Sistani",
    category: "hajj",
    description: "Official books including Islamic laws and Hajj guidance.",
    descriptionHi: "इस्लामी अहकाम और हज संबंधी आधिकारिक निर्देश देखें।",
    url: "https://www.sistani.org/english/book/fatwa/",
  },
];

const categoryLabels: Record<Filter, { en: string; hi: string; ur: string }> = {
  all: { en: "All sources", hi: "सभी स्रोत", ur: "تمام مصادر" },
  quran: { en: "Qur'an & Tafsir", hi: "कुरआन व तफ़सीर", ur: "قرآن و تفسیر" },
  hadith: { en: "Hadith", hi: "हदीस", ur: "حدیث" },
  fiqh: { en: "Fiqh & Fatawa", hi: "फ़िक़्ह व फ़तवे", ur: "فقہ و فتاویٰ" },
  hajj: { en: "Hajj & Umrah", hi: "हज व उमराह", ur: "حج و عمرہ" },
};

const filterOrder: Filter[] = ["all", "quran", "hadith", "fiqh", "hajj"];

const messages = {
  en: {
    title: "Islamic Digital Library",
    intro: "Explore original sources from different Islamic scholarly traditions.",
    search: "Search books, traditions or topics",
    open: "Open original source",
    notice: "This first version links to external publishers. Their books are not hosted here, and Zoya AI is not yet connected to these texts. Published rulings must be checked against their source and the scholar you follow.",
    none: "No matching sources. Try another keyword.",
    back: "Back to HajjCare",
    label: "Source directory",
  },
  hi: {
    title: "इस्लामिक डिजिटल लाइब्रेरी",
    intro: "अलग-अलग इस्लामी परंपराओं के मूल और आधिकारिक स्रोत खोजें।",
    search: "किताब, मसलक या विषय खोजें",
    open: "मूल वेबसाइट खोलें",
    notice: "इस पहले संस्करण में प्रकाशकों की बाहरी वेबसाइटों के लिंक हैं। पूरी किताबें यहाँ प्रकाशित नहीं की गई हैं और ज़ोया AI अभी इन किताबों से नहीं जुड़ी है। अमल के लिए अपने संबंधित विद्वान और मूल स्रोत से पुष्टि करें।",
    none: "कोई स्रोत नहीं मिला। दूसरा शब्द खोजें।",
    back: "HajjCare पर वापस",
    label: "स्रोत निर्देशिका",
  },
  ur: {
    title: "اسلامی ڈیجیٹل لائبریری",
    intro: "مختلف اسلامی علمی روایات کے اصل مصادر تلاش کریں۔",
    search: "کتاب، مسلک یا موضوع تلاش کریں",
    open: "اصل ویب سائٹ کھولیں",
    notice: "اس ابتدائی ورژن میں ناشرین کی بیرونی ویب سائٹس کے لنکس ہیں۔ مکمل کتابیں یہاں شائع نہیں کی گئیں اور زویا ابھی ان متون سے مربوط نہیں ہے۔ احکام کی اصل مصدر اور اپنے عالم سے تصدیق کریں۔",
    none: "کوئی ذریعہ نہیں ملا۔ دوسرا لفظ تلاش کریں۔",
    back: "HajjCare پر واپس",
    label: "مصادر کی فہرست",
  },
};

const IslamicLibraryPage = () => {
  const { language, isRTL } = useLanguage();
  const locale: "hi" | "ur" | "en" = language === "hi" || language === "ur" ? language : "en";
  const t = messages[locale];
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const filteredSources = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    return sources.filter((source) => {
      if (filter !== "all" && source.category !== filter) return false;
      const searchable = [
        source.title,
        source.tradition,
        source.description,
        source.descriptionHi,
        categoryLabels[source.category].en,
        categoryLabels[source.category].hi,
        categoryLabels[source.category].ur,
      ].join(" ").toLocaleLowerCase();
      return searchable.includes(normalized);
    });
  }, [filter, query]);

  return (
    <div className="min-h-screen bg-background text-foreground" dir={isRTL ? "rtl" : "ltr"}>
      <SEO title="Islamic Digital Library | HajCare AI" description="Browse original Islamic learning resources and official publishers from multiple scholarly traditions." path="/library" />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        <Link to="/home" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> {t.back}
        </Link>
        <header className="mb-8">
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-primary mb-3">
            <BookOpen className="h-5 w-5" aria-hidden="true" /> {t.label}
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{t.title}</h1>
          <p className="mt-3 text-muted-foreground max-w-2xl">{t.intro}</p>
        </header>

        <div className="rounded-xl border bg-card p-4 sm:p-5 mb-6">
          <label htmlFor="library-search" className="sr-only">{t.search}</label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" aria-hidden="true" />
            <input
              id="library-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t.search}
              className="w-full rounded-lg border bg-background py-2.5 pl-10 pr-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-2" aria-label="Library categories">
            {filterOrder.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setFilter(category)}
                aria-pressed={filter === category}
                className={
                  "rounded-full px-3 py-2 text-sm border transition-colors " +
                  (filter === category
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-foreground hover:bg-accent")
                }
              >
                {categoryLabels[category][locale]}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6 flex gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm leading-relaxed">
          <ShieldCheck className="h-5 w-5 shrink-0 text-primary mt-0.5" aria-hidden="true" />
          <p>{t.notice}</p>
        </div>

        {filteredSources.length === 0 ? (
          <p role="status" className="py-12 text-center text-muted-foreground">{t.none}</p>
        ) : (
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2" aria-label={t.label}>
            {filteredSources.map((source) => (
              <article key={source.url} className="rounded-xl border bg-card p-5 shadow-sm">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary">
                  {categoryLabels[source.category][locale]}
                </p>
                <h2 className="text-lg font-semibold">{source.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{source.tradition}</p>
                <p className="mt-3 text-sm leading-relaxed">
                  {locale === "hi" ? source.descriptionHi : source.description}
                </p>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                >
                  {t.open} <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </a>
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
};

export default IslamicLibraryPage;
