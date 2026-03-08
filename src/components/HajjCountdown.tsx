import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Landmark } from "lucide-react";

const labels: Record<string, { title: string; days: string; hours: string; mins: string; secs: string }> = {
  en: { title: "Hajj 2026 Countdown", days: "Days", hours: "Hours", mins: "Min", secs: "Sec" },
  ur: { title: "حج 2026 الٹی گنتی", days: "دن", hours: "گھنٹے", mins: "منٹ", secs: "سیکنڈ" },
  hi: { title: "हज 2026 उलटी गिनती", days: "दिन", hours: "घंटे", mins: "मिनट", secs: "सेकंड" },
  ar: { title: "العد التنازلي للحج 2026", days: "أيام", hours: "ساعات", mins: "دقائق", secs: "ثوانٍ" },
};

// Hajj 2026 approximate start: 8 Dhul Hijjah 1447 ≈ June 3, 2026
const HAJJ_DATE = new Date("2026-06-03T00:00:00+03:00");

function getTimeLeft() {
  const diff = HAJJ_DATE.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, mins: 0, secs: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    mins: Math.floor((diff / (1000 * 60)) % 60),
    secs: Math.floor((diff / 1000) % 60),
  };
}

export function HajjCountdown() {
  const [time, setTime] = useState(getTimeLeft);
  const { language } = useLanguage();
  const t = labels[language] || labels.en;

  useEffect(() => {
    const interval = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(interval);
  }, []);

  const blocks = [
    { value: time.days, label: t.days },
    { value: time.hours, label: t.hours },
    { value: time.mins, label: t.mins },
    { value: time.secs, label: t.secs },
  ];

  return (
    <div className="rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 p-4 sm:p-5">
      <div className="flex items-center gap-2 justify-center mb-3">
        <Landmark className="w-5 h-5 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">{t.title}</h3>
      </div>
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {blocks.map((b) => (
          <div key={b.label} className="text-center">
            <div className="bg-card rounded-xl py-2 px-1 shadow-sm border border-border">
              <span className="text-xl sm:text-2xl font-bold text-primary tabular-nums">
                {String(b.value).padStart(2, "0")}
              </span>
            </div>
            <span className="text-[10px] sm:text-xs text-muted-foreground mt-1 block">{b.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
