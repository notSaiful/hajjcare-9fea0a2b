import { useState } from "react";
import { SEO } from "@/components/SEO";
import { MainLayout } from "@/components/MainLayout";
import { PageHeader } from "@/components/PageHeader";
import { useCirculars, Circular } from "@/hooks/useCirculars";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell, ExternalLink, CheckCircle, AlertTriangle, Info, ChevronDown, ChevronUp } from "lucide-react";
import { format } from "date-fns";

const t = {
  en: { title: "Official Circulars", subtitle: "HCI & Saudi Govt updates", noCirculars: "No circulars published yet.", readMore: "Read More", collapse: "Collapse", markRead: "Mark as Read", read: "Read", new: "New", urgent: "Urgent", high: "Important", source: "Source", circularNo: "Circular No." },
  hi: { title: "आधिकारिक परिपत्र", subtitle: "HCI और सऊदी सरकार के अपडेट", noCirculars: "अभी तक कोई परिपत्र प्रकाशित नहीं हुआ।", readMore: "और पढ़ें", collapse: "बंद करें", markRead: "पढ़ा हुआ", read: "पढ़ा", new: "नया", urgent: "जरूरी", high: "महत्वपूर्ण", source: "स्रोत", circularNo: "परिपत्र संख्या" },
  ur: { title: "سرکاری سرکلر", subtitle: "HCI اور سعودی حکومت کی اپ ڈیٹس", noCirculars: "ابھی تک کوئی سرکلر شائع نہیں ہوا۔", readMore: "مزید پڑھیں", collapse: "بند کریں", markRead: "پڑھا ہوا", read: "پڑھا", new: "نیا", urgent: "فوری", high: "اہم", source: "ماخذ", circularNo: "سرکلر نمبر" },
};

const priorityConfig: Record<string, { color: string; icon: typeof AlertTriangle }> = {
  urgent: { color: "bg-destructive/10 text-destructive", icon: AlertTriangle },
  high: { color: "bg-accent text-accent-foreground", icon: AlertTriangle },
  normal: { color: "bg-secondary text-secondary-foreground", icon: Info },
  low: { color: "bg-muted text-muted-foreground", icon: Info },
};

function CircularCard({ circular, isRead, onMarkRead, lang }: { circular: Circular; isRead: boolean; onMarkRead: () => void; lang: string }) {
  const [expanded, setExpanded] = useState(false);
  const l = (t as any)[lang] || t.en;
  const prio = priorityConfig[circular.priority] || priorityConfig.normal;
  const PrioIcon = prio.icon;

  const title = lang === "hi" && circular.title_hi ? circular.title_hi
    : lang === "ur" && circular.title_ur ? circular.title_ur
    : circular.title;

  const summary = lang === "hi" && circular.summary_hi ? circular.summary_hi
    : lang === "ur" && circular.summary_ur ? circular.summary_ur
    : circular.summary_en;

  return (
    <Card className={`transition-all ${!isRead ? "border-primary/40 shadow-md" : "opacity-90"}`}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              {!isRead && <Badge variant="default" className="text-xs">{l.new}</Badge>}
              {circular.source && (
                <Badge
                  variant="outline"
                  className={`text-xs ${
                    circular.source === "HCI"
                      ? "bg-primary/10 border-primary/30 text-primary"
                      : "bg-accent/20 border-accent/40 text-accent-foreground"
                  }`}
                >
                  {circular.source_name_display || circular.source}
                </Badge>
              )}
              {circular.priority !== "normal" && circular.priority !== "low" && (
                <Badge className={`text-xs ${prio.color}`}>
                  <PrioIcon className="w-3 h-3 mr-1" />
                  {(l as any)[circular.priority] || circular.priority}
                </Badge>
              )}
              {circular.circular_number && (
                <span className="text-xs text-muted-foreground">{l.circularNo}: {circular.circular_number}</span>
              )}
            </div>
            <CardTitle className="text-base leading-tight">{title}</CardTitle>
          </div>
          {isRead && <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-1" />}
        </div>
        {circular.circular_date && (
          <p className="text-xs text-muted-foreground">{format(new Date(circular.circular_date), "dd MMM yyyy")}</p>
        )}
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        {summary && <p className="text-sm text-muted-foreground leading-relaxed">{summary}</p>}

        {expanded && (
          <div className="text-sm whitespace-pre-wrap border-t pt-3 mt-2">{circular.original_content}</div>
        )}

        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)}>
            {expanded ? <><ChevronUp className="w-3 h-3 mr-1" />{l.collapse}</> : <><ChevronDown className="w-3 h-3 mr-1" />{l.readMore}</>}
          </Button>

          {circular.source_url && (
            <Button variant="ghost" size="sm" asChild>
              <a href={circular.source_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-3 h-3 mr-1" />{l.source}
              </a>
            </Button>
          )}

          {!isRead && (
            <Button variant="outline" size="sm" onClick={onMarkRead}>
              <CheckCircle className="w-3 h-3 mr-1" />{l.markRead}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function CircularsPage() {
  const { circulars, isLoading, readIds, markRead } = useCirculars();
  const { language } = useLanguage();
  const l = (t as any)[language] || t.en;

  return (
    <MainLayout>
      <SEO title="Official Hajj Circulars" description="AI-summarized official Hajj circulars from the Indian Haj Committee — stay updated on policies and announcements." path="/circulars" type="website" jsonLd={{"@context":"https://schema.org","@type":"WebPage","headline":"Official Hajj Circulars","description":"AI-summarized official Hajj circulars from the Indian Haj Committee — stay updated on policies and announcements.","url":"https://hajjcare.in/circulars"}} />
      <PageHeader title={l.title} subtitle={l.subtitle} />
      <div className="px-4 pb-24 space-y-4 max-w-2xl mx-auto">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))
        ) : circulars.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 mx-auto text-muted-foreground/40 mb-3" />
            <p className="text-muted-foreground">{l.noCirculars}</p>
          </div>
        ) : (
          circulars.map((c) => (
            <CircularCard
              key={c.id}
              circular={c}
              isRead={readIds.has(c.id)}
              onMarkRead={() => markRead(c.id)}
              lang={language}
            />
          ))
        )}
      </div>
    </MainLayout>
  );
}
