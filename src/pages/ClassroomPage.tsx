import { useMemo, useState } from "react";
import { SEO } from "@/components/SEO";
import { SimpleHeader } from "@/components/SimpleHeader";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  buildClassroomWhatsAppUrl,
  formatWhatsAppDisplay,
  publishedClasses,
  resolveWhatsAppDigits,
  type ClassroomClass,
} from "@/data/classroom";
import { BookOpen, Download, GraduationCap, MessageCircle } from "lucide-react";

const MENU = [
  { href: "/home", hi: "डैशबोर्ड", en: "Dashboard" },
  { href: "/classroom", hi: "क्लासरूम", en: "Classroom" },
  { href: "/library#quran", hi: "क़ुरआन लाइब्रेरी", en: "Quran Library" },
  { href: "/explore#hadith", hi: "हदीस लाइब्रेरी", en: "Hadith Library" },
  { href: "/#duas", hi: "दुआ संग्रह", en: "Dua Collection" },
  { href: "/#journey", hi: "मेरा हज सफ़र", en: "My Hajj Journey" },
] as const;

function hindiFirst(language: string) {
  return language === "hi" || language === "ur";
}

function Pair({
  hi,
  en,
  language,
  primaryClass = "",
  secondaryClass = "text-xs opacity-70",
}: {
  hi: string;
  en: string;
  language: string;
  primaryClass?: string;
  secondaryClass?: string;
}) {
  const hiLead = hindiFirst(language);
  return (
    <span className="block min-w-0">
      <span className={`block ${primaryClass}`} lang={hiLead ? "hi" : "en"}>
        {hiLead ? hi : en}
      </span>
      <span className={`block ${secondaryClass}`} lang={hiLead ? "en" : "hi"}>
        {hiLead ? en : hi}
      </span>
    </span>
  );
}

function fileDownload(url: string) {
  return /\.(mp4|pdf|pptx)(\?|$)/i.test(url);
}

function WhatsAppLink({ item, className, children }: { item: ClassroomClass; className: string; children: string }) {
  const href = buildClassroomWhatsAppUrl(item, import.meta.env.VITE_HAJCARE_WHATSAPP_NUMBER);
  return (
    <a className={className} href={href} target="_blank" rel="noopener noreferrer">
      <MessageCircle className="h-4 w-4 shrink-0" aria-hidden />
      <span>{children}</span>
    </a>
  );
}

const waClass =
  "inline-flex items-center justify-center gap-2 rounded-full bg-[#1f7a4d] px-4 py-2 text-sm font-semibold text-white hover:bg-[#17663f]";

export default function ClassroomPage() {
  const { language, isRTL } = useLanguage();
  const classes = useMemo(() => publishedClasses(), []);
  const [day, setDay] = useState(classes[0]?.day ?? 0);
  const selected = classes.find((item) => item.day === day) ?? classes[0];
  const studySheet = selected?.materials.find((item) => !fileDownload(item.url));
  const digits = resolveWhatsAppDigits(import.meta.env.VITE_HAJCARE_WHATSAPP_NUMBER);
  const displayNumber = formatWhatsAppDisplay(digits);

  return (
    <div className="min-h-screen bg-[#f6f3ec] text-[#1f4d3a]" dir={isRTL ? "rtl" : "ltr"}>
      <SEO
        title="HajCare AI Classroom"
        description="HajCare AI Classroom: recorded Hajj classes, study materials, and WhatsApp support. hajjcare.in"
        path="/classroom"
      />
      <SimpleHeader />
      <div className="mx-auto grid max-w-7xl gap-4 px-3 py-4 sm:px-5 lg:grid-cols-[13.5rem_minmax(0,1fr)_18.5rem] lg:items-start">
        <nav
          aria-label={hindiFirst(language) ? "क्लासरूम मेनू" : "Classroom menu"}
          className="order-5 flex gap-2 overflow-x-auto pb-1 lg:sticky lg:top-20 lg:order-none lg:col-start-1 lg:row-span-2 lg:flex-col lg:overflow-visible lg:pb-0"
        >
          {MENU.map((item) => {
            const current = item.en === "Classroom";
            return (
              <a
                key={item.en}
                href={item.href}
                aria-current={current ? "page" : undefined}
                className={`min-w-[9.5rem] shrink-0 rounded-2xl border px-3 py-2.5 lg:min-w-0 ${
                  current
                    ? "border-[#1f4d3a] bg-[#1f4d3a] text-[#f6f3ec]"
                    : "border-[#e4dcc8] bg-white text-[#1f4d3a] hover:border-[#c9a45c]"
                }`}
              >
                <Pair hi={item.hi} en={item.en} language={language} primaryClass="text-sm font-semibold" />
              </a>
            );
          })}
        </nav>

        <div className="order-1 min-w-0 space-y-3 lg:order-none lg:col-start-2 lg:row-start-1 lg:space-y-4">
          <header className="rounded-3xl border border-[#e4dcc8] bg-white px-3 py-2 sm:px-5 sm:py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8a6a2e]">HajCare AI</p>
            <h1 className="mt-1 text-xl font-semibold sm:text-3xl">
              <Pair
                hi="HajCare AI क्लासरूम"
                en="HajCare AI Classroom"
                language={language}
                primaryClass="leading-tight"
                secondaryClass="mt-1 text-sm font-medium text-[#5f6b4e]"
              />
            </h1>
            <p className="mt-2 hidden text-sm text-[#5f6b4e] sm:block">
              {hindiFirst(language)
                ? "रिकॉर्डेड कक्षा, अध्ययन सामग्री, और WhatsApp पर सवाल। लाइव कक्षा नहीं।"
                : "Recorded classes, study materials, and questions on WhatsApp. No live class."}
            </p>
          </header>

          {selected ? (
            <section className="overflow-hidden rounded-3xl border border-[#e4dcc8] bg-white" aria-label={selected.title_en}>
              <div className="bg-[#1f4d3a] px-3 py-2 text-[#f6f3ec] sm:px-5 sm:py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#e4cb87]">
                  {hindiFirst(language)
                    ? (selected.label_hi ?? `दिन ${selected.day} · रिकॉर्डेड`)
                    : (selected.label_en ?? `Day ${selected.day} · Recorded`)}
                </p>
                <h2 className="mt-1 text-xl font-semibold sm:text-2xl">
                  <Pair
                    hi={selected.title_hi}
                    en={selected.title_en}
                    language={language}
                    secondaryClass="mt-1 text-sm text-[#f6f3ec]/80"
                  />
                </h2>
                {selected.note_hi && selected.note_en ? (
                  <p className="mt-2 hidden text-sm text-[#f6f3ec]/80 sm:block">
                    {hindiFirst(language) ? selected.note_hi : selected.note_en}
                  </p>
                ) : null}
              </div>

              {studySheet ? (
                <a
                  className="mx-3 mt-3 flex items-center justify-center gap-2 rounded-full bg-[#1f4d3a] px-4 py-3 text-center text-sm font-semibold text-[#f6f3ec] sm:mx-5"
                  href={studySheet.url}
                >
                  <BookOpen className="h-4 w-4 shrink-0" aria-hidden />
                  <span>
                    {hindiFirst(language) ? studySheet.label_hi : studySheet.label_en}
                    <span className="mt-0.5 block text-xs font-medium opacity-80">
                      {hindiFirst(language) ? studySheet.label_en : studySheet.label_hi}
                    </span>
                  </span>
                </a>
              ) : null}

              {selected.youtube_id ? (
                <div className="aspect-video bg-black">
                  <iframe
                    className="h-full w-full"
                    src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(selected.youtube_id)}?rel=0&modestbranding=1&playsinline=1`}
                    title={`${selected.title_en} — Day ${selected.day}`}
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                </div>
              ) : (
                <div className="bg-black">
                  {selected.local_video_16x9 ? (
                    <video
                      key={`wide-${selected.day}`}
                      className="mx-auto hidden max-h-[70vh] w-full bg-black md:block"
                      controls
                      playsInline
                      preload="metadata"
                      src={selected.local_video_16x9}
                    />
                  ) : null}
                  {(selected.local_video_9x16 || selected.local_video_16x9) ? (
                    <video
                      key={`tall-${selected.day}`}
                      className="mx-auto block aspect-[9/16] w-full max-w-sm bg-black md:hidden"
                      controls
                      playsInline
                      preload="metadata"
                      src={selected.local_video_9x16 || selected.local_video_16x9}
                    />
                  ) : null}
                </div>
              )}

              <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                <p className="text-sm text-[#5f6b4e]">
                  {hindiFirst(language)
                    ? "वीडियो चलाएँ। सवाल अपनी भाषा में WhatsApp पर लिखें।"
                    : "Play the recording. Write your question on WhatsApp in your own language."}
                </p>
                <WhatsAppLink item={selected} className={waClass}>
                  {hindiFirst(language) ? "WhatsApp पर पूछें" : "Ask on WhatsApp"}
                </WhatsAppLink>
              </div>
            </section>
          ) : (
            <p className="rounded-3xl border border-[#e4dcc8] bg-white p-5 text-sm">
              {hindiFirst(language) ? "अभी कोई रिकॉर्डेड कक्षा प्रकाशित नहीं है।" : "No recorded class is published yet."}
            </p>
          )}
        </div>

        <div className="order-4 min-w-0 space-y-4 lg:col-start-2 lg:row-start-2">
          {selected && selected.materials.length > 0 ? (
            <section className="rounded-3xl border border-[#e4dcc8] bg-white p-4 sm:p-5" aria-labelledby="class-materials">
              <h2 id="class-materials" className="flex items-center gap-2 text-lg font-semibold">
                <Download className="h-5 w-5" aria-hidden />
                <Pair hi="कक्षा सामग्री" en="Class materials" language={language} primaryClass="text-lg" />
              </h2>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {selected.materials.map((material) => {
                  const download = fileDownload(material.url);
                  return (
                    <li key={material.url}>
                      <a
                        className="flex items-center justify-between gap-3 rounded-2xl border border-[#e4dcc8] px-3 py-3 hover:border-[#c9a45c]"
                        href={material.url}
                        {...(download
                          ? { download: "", target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                      >
                        <Pair hi={material.label_hi} en={material.label_en} language={language} primaryClass="text-sm font-semibold" />
                        <BookOpen className="h-4 w-4 shrink-0" aria-hidden />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </section>
          ) : null}

          <section className="rounded-3xl border border-[#e4dcc8] bg-white p-4 sm:p-5" aria-labelledby="recorded-classes">
            <h2 id="recorded-classes" className="text-lg font-semibold">
              <Pair hi="रिकॉर्डेड कक्षाएँ" en="Recorded classes" language={language} primaryClass="text-lg" />
            </h2>
            <ul className="mt-3 flex gap-3 overflow-x-auto pb-1">
              {classes.map((item) => {
                const active = item.day === selected?.day;
                return (
                  <li key={item.day} className="w-56 shrink-0">
                    <article className={`rounded-2xl border p-3 ${active ? "border-[#1f4d3a] bg-[#f3f7f2]" : "border-[#e4dcc8]"}`}>
                      <button
                        type="button"
                        className="w-full text-start"
                        onClick={() => setDay(item.day)}
                        aria-pressed={active}
                      >
                        <span className="text-xs font-semibold uppercase tracking-wide text-[#8a6a2e]">
                          {hindiFirst(language) ? `दिन ${item.day}` : `Day ${item.day}`}
                        </span>
                        <span className="mt-1 block">
                          <Pair hi={item.title_hi} en={item.title_en} language={language} primaryClass="text-sm font-semibold" />
                        </span>
                      </button>
                      <WhatsAppLink item={item} className={`${waClass} mt-3 w-full`}>
                        WhatsApp
                      </WhatsAppLink>
                    </article>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>

        <aside className="order-3 space-y-4 lg:sticky lg:top-20 lg:col-start-3 lg:row-start-1 lg:row-span-2">
          <section className="rounded-3xl border border-[#e4dcc8] bg-white p-4" aria-labelledby="class-teacher">
            <h2 id="class-teacher" className="text-sm font-semibold uppercase tracking-wide text-[#8a6a2e]">
              {hindiFirst(language) ? "शिक्षक" : "Teacher"}
            </h2>
            {selected?.teacher ? (
              <div className="mt-3 flex items-center gap-3">
                {selected.teacher.photo_url ? (
                  <img
                    src={selected.teacher.photo_url}
                    alt={hindiFirst(language) ? selected.teacher.name_hi : selected.teacher.name_en}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#1f4d3a] text-sm font-semibold text-[#f6f3ec]" aria-hidden>
                    HC
                  </div>
                )}
                <Pair
                  hi={selected.teacher.name_hi}
                  en={selected.teacher.name_en}
                  language={language}
                  primaryClass="font-semibold"
                />
              </div>
            ) : (
              <div className="mt-3 flex items-center gap-3">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#1f4d3a] text-[#f6f3ec]" aria-hidden>
                  <GraduationCap className="h-7 w-7" />
                </div>
                <div>
                  <Pair
                    hi="HajCare AI टीम"
                    en="HajCare AI team"
                    language={language}
                    primaryClass="font-semibold"
                    secondaryClass="text-xs text-[#5f6b4e]"
                  />
                  <p className="mt-1 text-xs text-[#5f6b4e]">
                    {hindiFirst(language)
                      ? "इस कक्षा के लिए अलग शिक्षक दर्ज नहीं है।"
                      : "No separate teacher is set for this class."}
                  </p>
                </div>
              </div>
            )}
            {selected?.teacher ? (
              <p className="mt-2 text-sm text-[#5f6b4e]">
                {hindiFirst(language) ? selected.teacher.title_hi : selected.teacher.title_en}
              </p>
            ) : null}
          </section>

          <section className="rounded-3xl border border-[#e4dcc8] bg-white p-4" aria-labelledby="ask-whatsapp">
            <h2 id="ask-whatsapp" className="text-lg font-semibold">
              <Pair hi="WhatsApp पर पूछें" en="Ask on WhatsApp" language={language} primaryClass="text-lg" />
            </h2>
            <p className="mt-2 text-sm text-[#5f6b4e]">
              {hindiFirst(language)
                ? "अपनी भाषा में लिखें। टीम ख़ुद जवाब देती है।"
                : "Write in your own language. The team replies personally."}
            </p>
            {displayNumber ? (
              <p className="mt-3 text-base font-semibold">{displayNumber} (WhatsApp)</p>
            ) : null}
            {selected ? (
              <WhatsAppLink item={selected} className={`${waClass} mt-3 w-full`}>
                {hindiFirst(language) ? "इस कक्षा का सवाल भेजें" : "Send a question about this class"}
              </WhatsAppLink>
            ) : null}
          </section>
        </aside>
      </div>
    </div>
  );
}
