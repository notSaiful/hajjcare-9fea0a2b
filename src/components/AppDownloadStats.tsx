import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { Users, Download, Eye } from "lucide-react";

const labels = {
  title: {
    en: "App Statistics",
    hi: "ऐप आँकड़े",
    ur: "ایپ اعداد و شمار",
    ar: "إحصائيات التطبيق",
  },
  totalVisits: {
    en: "Total Visits",
    hi: "कुल विज़िट",
    ur: "کل وزٹ",
    ar: "إجمالي الزيارات",
  },
  uniqueVisitors: {
    en: "Unique Visitors",
    hi: "अद्वितीय विज़िटर",
    ur: "منفرد وزٹرز",
    ar: "الزوار الفريدون",
  },
  pwaInstalls: {
    en: "App Installs",
    hi: "ऐप इंस्टॉल",
    ur: "ایپ انسٹال",
    ar: "تثبيت التطبيق",
  },
};

type Lang = keyof typeof labels.title;

export function AppDownloadStats() {
  const { language } = useLanguage();
  const lang = (language in labels.title ? language : "en") as Lang;
  const [stats, setStats] = useState({ total_visits: 0, unique_visitors: 0, pwa_installs: 0 });

  useEffect(() => {
    const loadStats = async () => {
      // Total visits
      const { count: totalVisits } = await supabase
        .from("app_analytics")
        .select("*", { count: "exact", head: true })
        .eq("event_type", "visit");

      // Unique visitors (distinct visitor_id)
      const { data: visitorData } = await supabase
        .from("app_analytics")
        .select("visitor_id")
        .eq("event_type", "visit")
        .limit(10000);
      const uniqueCount = new Set((visitorData ?? []).map((r: any) => r.visitor_id)).size;

      // PWA installs
      const { count: installs } = await supabase
        .from("app_analytics")
        .select("*", { count: "exact", head: true })
        .eq("event_type", "pwa_install");

      setStats({
        total_visits: totalVisits ?? 0,
        unique_visitors: uniqueCount,
        pwa_installs: installs ?? 0,
      });
    };
    loadStats().catch(console.error);
  }, []);

  const items = [
    { icon: Eye, label: labels.totalVisits[lang], value: stats.total_visits },
    { icon: Users, label: labels.uniqueVisitors[lang], value: stats.unique_visitors },
    { icon: Download, label: labels.pwaInstalls[lang], value: stats.pwa_installs },
  ];

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <h3 className="text-sm font-semibold text-muted-foreground mb-3">
        {labels.title[lang]}
      </h3>
      <div className="grid grid-cols-3 gap-3">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col items-center gap-1 text-center">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <item.icon className="w-5 h-5 text-primary" />
            </div>
            <span className="text-lg font-bold text-foreground">
              {item.value.toLocaleString()}
            </span>
            <span className="text-[11px] text-muted-foreground leading-tight">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
