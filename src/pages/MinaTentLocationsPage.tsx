import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, MapPin, Search, Bus, Train, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MINA_MAKTABS, MINA_FULL_MAP_URL, type MinaMaktab } from "@/data/minaTentLocations";
import { useLanguage } from "@/contexts/LanguageContext";
import { getMinaTentsLabels, type MinaTentsLabels } from "@/data/minaTentsContent";
import { fuzzyMatches } from "@/lib/minaSearch";


const MaktabCard = ({ m, t }: { m: MinaMaktab; t: MinaTentsLabels }) => {
  const Icon = m.transportation === "Bus" ? Bus : Train;
  const transportLabel = m.transportation === "Bus" ? t.bus : t.metro;
  return (
    <Link to={`/mina-tents/${m.maktab}`} className="block focus:outline-none focus:ring-2 focus:ring-primary rounded-2xl">
      <Card className="overflow-hidden transition-all hover:shadow-md active:scale-[0.99]">
        <CardHeader className="bg-primary/5 border-b border-border p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg shadow-soft">
                {m.maktab}
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t.maktab}</p>
                <p className="font-bold text-base">#{m.maktab}</p>
              </div>
            </div>
            <Badge variant="secondary" className="gap-1">
              <Icon className="w-3.5 h-3.5" />
              {transportLabel}
            </Badge>
          </div>
          <div className="flex items-start gap-2 mt-3 p-2 rounded-lg bg-background/60">
            <MapPin className="w-4 h-4 text-islamic-gold mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold">{m.description}</p>
              <p className="text-xs text-muted-foreground font-mono">{t.campStreet}: {m.campStreet}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground">
            {t.manager}: <span className="text-foreground font-medium">{m.manager.name}</span>
          </p>
          <p className="text-xs text-primary font-semibold mt-2">{t.viewContacts}</p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default function MinaTentLocationsPage() {
  const { language, isRTL } = useLanguage();
  const t = getMinaTentsLabels(language);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "Metro Train" | "Bus">("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MINA_MAKTABS.filter((m) => {
      if (filter !== "all" && m.transportation !== filter) return false;
      if (!q) return true;
      const blob = [
        String(m.maktab),
        m.campStreet,
        m.description,
        m.manager.name, m.manager.phone,
        m.assistantManager.name, m.assistantManager.phone,
        m.receptionMakkahHousing.name, m.receptionMakkahHousing.phone,
        m.supportTawaf.name, m.supportTawaf.phone,
        m.arafatCampsHousing.name, m.arafatCampsHousing.phone,
        m.minaCampsHousing.name, m.minaCampsHousing.phone,
      ].join(" ").toLowerCase();
      return blob.includes(q);
    });
  }, [query, filter]);

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
      <header className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link to="/home">
            <Button variant="ghost" size="icon" aria-label={t.back}>
              <ArrowLeft className={`w-5 h-5 ${isRTL ? "rotate-180" : ""}`} />
            </Button>
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold leading-tight">{t.title}</h1>
            <p className="text-xs text-muted-foreground">{t.subtitle}</p>
          </div>
          <a href={MINA_FULL_MAP_URL} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm" className="gap-1">
              <ExternalLink className="w-3.5 h-3.5" />
              {t.mapBtn}
            </Button>
          </a>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-4 space-y-4">
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-foreground/80">
          <strong>{t.unofficial}</strong> {t.unofficialDetail} {t.forCorrections} <a href="tel:+919796762333" className="text-primary font-semibold" dir="ltr">+91 97967 62333</a>.
        </div>

        <div className="space-y-3">
          <div className="relative">
            <Search className={`w-4 h-4 absolute ${isRTL ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 text-muted-foreground`} />
            <Input
              placeholder={t.searchPlaceholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={isRTL ? "pr-9 h-11" : "pl-9 h-11"}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {(["all", "Metro Train", "Bus"] as const).map((f) => (
              <Button
                key={f}
                variant={filter === f ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(f)}
                className="gap-1"
              >
                {f === "Metro Train" && <Train className="w-3.5 h-3.5" />}
                {f === "Bus" && <Bus className="w-3.5 h-3.5" />}
                {f === "all" ? t.all : f === "Metro Train" ? t.metro : t.bus}
              </Button>
            ))}
            <span className={`${isRTL ? "mr-auto" : "ml-auto"} text-xs text-muted-foreground self-center`}>
              {t.countOf(filtered.length, MINA_MAKTABS.length)}
            </span>
          </div>
        </div>

        <div className="grid gap-3">
          {filtered.map((m) => (
            <MaktabCard key={m.maktab} m={m} t={t} />
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground text-sm">
              {t.noResults}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
