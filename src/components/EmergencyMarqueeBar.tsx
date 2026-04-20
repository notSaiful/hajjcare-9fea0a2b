import { Phone, Siren } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Continuously scrolling emergency contact bar.
 * Stays visible at the top of the app so Hajis can always
 * reach critical helplines quickly. Numbers are click-to-call.
 */
const EMERGENCY_CONTACTS = [
  { label: { en: "Indian Haj Mission (Makkah)", hi: "भारतीय हज मिशन (मक्का)", ur: "انڈین حج مشن (مکہ)" }, number: "+966125420019" },
  { label: { en: "Indian Haj Mission (Madinah)", hi: "भारतीय हज मिशन (मदीना)", ur: "انڈین حج مشن (مدینہ)" }, number: "+966148220033" },
  { label: { en: "Saudi Ambulance", hi: "सऊदी एम्बुलेंस", ur: "سعودی ایمبولینس" }, number: "997" },
  { label: { en: "Saudi Police / Emergency", hi: "सऊदी पुलिस / आपातकाल", ur: "سعودی پولیس / ایمرجنسی" }, number: "911" },
  { label: { en: "Saudi Civil Defence (Fire)", hi: "सिविल डिफेंस (आग)", ur: "سول ڈیفنس (آگ)" }, number: "998" },
  { label: { en: "MOIA 24/7 Helpline India", hi: "MOIA 24/7 हेल्पलाइन भारत", ur: "MOIA 24/7 ہیلپ لائن انڈیا" }, number: "+911124300666" },
  { label: { en: "HajjCare Support", hi: "हज केयर सपोर्ट", ur: "حج کیئر سپورٹ" }, number: "+917588113830" },
];

export function EmergencyMarqueeBar() {
  const { language } = useLanguage();
  const lang = (["en", "hi", "ur"].includes(language) ? language : "en") as "en" | "hi" | "ur";

  // Duplicate the list for a seamless loop
  const items = [...EMERGENCY_CONTACTS, ...EMERGENCY_CONTACTS];

  return (
    <div
      role="region"
      aria-label="Emergency contacts"
      className="sticky top-0 z-[60] w-full bg-destructive text-destructive-foreground border-b border-destructive/40 shadow-sm overflow-hidden"
    >
      <div className="flex items-center gap-2 px-3 py-1.5">
        <div className="flex-shrink-0 flex items-center gap-1.5 pr-2 border-r border-destructive-foreground/30">
          <Siren className="w-3.5 h-3.5 animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">
            SOS
          </span>
        </div>

        <div
          className="flex-1 overflow-hidden relative"
          style={{ maskImage: "linear-gradient(90deg, transparent 0, #000 8%, #000 92%, transparent 100%)" }}
        >
          <div
            className="flex gap-6 whitespace-nowrap animate-marquee will-change-transform"
            style={{ animationDuration: "45s" }}
          >
            {items.map((c, i) => (
              <a
                key={`${c.number}-${i}`}
                href={`tel:${c.number}`}
                className="inline-flex items-center gap-1.5 text-xs font-medium hover:underline focus:underline outline-none"
              >
                <Phone className="w-3 h-3" />
                <span>{c.label[lang]}:</span>
                <span className="font-bold tabular-nums">{c.number}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
