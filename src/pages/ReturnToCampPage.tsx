import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Phone,
  Tent,
  Bus,
  Train,
  ExternalLink,
  AlertTriangle,
  Edit3,
  CheckCircle2,
  LifeBuoy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { MINA_MAKTABS, MINA_FULL_MAP_URL, type MinaMaktab } from "@/data/minaTentLocations";
import { getReturnToCampLabels } from "@/data/returnToCampContent";
import { normalizeNumerals } from "@/lib/minaSearch";

const STORAGE_KEY = "hajjcare:saved-maktab";
const HAJJ_HELPLINE = "+919796762333";
const SAUDI_EMERGENCY = "911";

function readSaved(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function findMaktab(num: string): MinaMaktab | null {
  const n = normalizeNumerals(num.trim());
  return MINA_MAKTABS.find((m) => String(m.maktab) === n) ?? null;
}

function saudiTel(local: string): string {
  // Strip non-digits and prefix with +966 (Saudi). 911 stays as-is.
  const d = local.replace(/\D/g, "");
  if (!d) return "";
  if (d === "911") return "tel:911";
  return `tel:+966${d.replace(/^0+/, "")}`;
}

export default function ReturnToCampPage() {
  const { language, isRTL } = useLanguage();
  const t = getReturnToCampLabels(language);

  const [savedNum, setSavedNum] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const s = readSaved();
    setSavedNum(s);
    if (!s) setEditing(true);
  }, []);

  const maktab = useMemo(() => (savedNum ? findMaktab(savedNum) : null), [savedNum]);

  const handleSave = () => {
    setError(null);
    const m = findMaktab(input);
    if (!m) {
      setError(t.invalidMaktab);
      return;
    }
    const n = String(m.maktab);
    try {
      localStorage.setItem(STORAGE_KEY, n);
    } catch {
      /* ignore */
    }
    setSavedNum(n);
    setEditing(false);
    setInput("");
  };

  const TransportIcon = maktab?.transportation === "Bus" ? Bus : Train;
  const transportLabel = maktab?.transportation === "Bus" ? t.bus : t.metro;

  // Google Maps directions to Mina (works without origin — phone uses current location)
  const mapsUrl = maktab
    ? `https://www.google.com/maps/dir/?api=1&destination=Mina,Mecca,Saudi+Arabia&destination_place_id=&travelmode=walking`
    : MINA_FULL_MAP_URL;

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
            <h1 className="text-lg font-bold leading-tight flex items-center gap-2">
              <LifeBuoy className="w-5 h-5 text-islamic-gold" />
              {t.title}
            </h1>
            <p className="text-xs text-muted-foreground">{t.subtitle}</p>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-4 space-y-4 pb-10">
        {/* Saved Maktab block */}
        {!maktab || editing ? (
          <Card className="border-islamic-gold/40 bg-islamic-gold/5">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-xl bg-islamic-gold/20 flex items-center justify-center shrink-0">
                  <Tent className="w-5 h-5 text-islamic-gold" />
                </div>
                <div className="flex-1">
                  <h2 className="font-bold text-base leading-tight">{t.noSavedTitle}</h2>
                  <p className="text-xs text-muted-foreground mt-1">{t.noSavedDesc}</p>
                </div>
              </div>
              <div className="space-y-2">
                <Input
                  inputMode="numeric"
                  placeholder={t.enterMaktabPlaceholder}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSave()}
                  className="h-12 text-base"
                  aria-label={t.enterMaktabPlaceholder}
                />
                {error && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {error}
                  </p>
                )}
                <div className="flex gap-2">
                  <Button onClick={handleSave} className="flex-1 h-12 font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    {t.saveBtn}
                  </Button>
                  {savedNum && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditing(false);
                        setInput("");
                        setError(null);
                      }}
                      className="h-12"
                    >
                      {t.cancelBtn}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-primary/30 shadow-soft">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">
                  {t.savedTitle}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setInput(savedNum ?? "");
                    setEditing(true);
                  }}
                  className="h-8 gap-1 text-xs"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  {t.changeMaktabBtn}
                </Button>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl shadow-soft">
                  {maktab.maktab}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">{t.yourMaktab}</p>
                  <p className="font-bold text-lg leading-tight">#{maktab.maktab}</p>
                  <Badge variant="secondary" className="gap-1 mt-1">
                    <TransportIcon className="w-3.5 h-3.5" />
                    {transportLabel}
                  </Badge>
                </div>
              </div>

              <div className="rounded-xl bg-muted/50 p-3 space-y-1">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-islamic-gold mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">{maktab.description}</p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {t.campStreet}: {maktab.campStreet}
                    </p>
                  </div>
                </div>
              </div>

              {/* One-tap actions */}
              <div className="grid grid-cols-1 gap-2">
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
                  <Button className="w-full h-14 text-base font-semibold gap-2" size="lg">
                    <ExternalLink className="w-5 h-5" />
                    {t.openInMaps}
                  </Button>
                </a>
                <a href={saudiTel(maktab.manager.phone)}>
                  <Button variant="outline" className="w-full h-14 text-base font-semibold gap-2" size="lg">
                    <Phone className="w-5 h-5 text-primary" />
                    {t.callManager}
                    <span className="ms-auto text-xs text-muted-foreground" dir="ltr">
                      +966 {maktab.manager.phone}
                    </span>
                  </Button>
                </a>
                <a href={saudiTel(maktab.assistantManager.phone)}>
                  <Button variant="outline" className="w-full h-12 text-sm font-medium gap-2">
                    <Phone className="w-4 h-4 text-primary" />
                    {t.callAssistant}
                  </Button>
                </a>
                <a href={saudiTel(maktab.minaCampsHousing.phone)}>
                  <Button variant="outline" className="w-full h-12 text-sm font-medium gap-2">
                    <Phone className="w-4 h-4 text-primary" />
                    {t.callMinaHousing}
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        )}

        {/* If lost — steps */}
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="p-4 space-y-2">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              {t.ifLostTitle}
            </h3>
            <ol className="space-y-1.5 text-sm leading-relaxed list-decimal ps-5">
              <li>{t.ifLostStep1}</li>
              <li>{t.ifLostStep2}</li>
              <li>{t.ifLostStep3}</li>
              <li>{t.ifLostStep4}</li>
            </ol>
          </CardContent>
        </Card>

        {/* Arabic show-card */}
        {maktab && (
          <Card className="border-2 border-primary/40 bg-card">
            <CardContent className="p-4 space-y-3">
              <div>
                <h3 className="font-bold text-sm">{t.showCardTitle}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{t.showCardDesc}</p>
              </div>
              <div
                dir="rtl"
                className="rounded-xl bg-primary/5 border border-primary/20 p-4 space-y-2 text-foreground"
              >
                <p className="text-base font-bold leading-snug">{t.showCardArabicLine}</p>
                <div className="grid grid-cols-2 gap-2 text-sm pt-2 border-t border-primary/15">
                  <div>
                    <p className="text-[11px] text-muted-foreground">المكتب</p>
                    <p className="font-bold text-lg" dir="ltr">#{maktab.maktab}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground">المخيم / الشارع</p>
                    <p className="font-bold font-mono" dir="ltr">{maktab.campStreet}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[11px] text-muted-foreground">المدير</p>
                    <p className="font-semibold">{maktab.manager.name}</p>
                    <p className="font-mono text-sm" dir="ltr">+966 {maktab.manager.phone}</p>
                  </div>
                </div>
              </div>
              {/* Same in user's language */}
              <p className="text-xs text-muted-foreground italic">{t.showCardLabelLost}</p>
            </CardContent>
          </Card>
        )}

        {/* Emergency helplines */}
        <Card>
          <CardContent className="p-4 space-y-2">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <Phone className="w-4 h-4 text-destructive" />
              {t.emergencyTitle}
            </h3>
            <a href="tel:911">
              <Button variant="destructive" className="w-full h-12 font-semibold gap-2">
                <Phone className="w-4 h-4" />
                {t.saudiEmergency}
                <span className="ms-auto text-xs opacity-90" dir="ltr">{SAUDI_EMERGENCY}</span>
              </Button>
            </a>
            <a href={`tel:${HAJJ_HELPLINE}`}>
              <Button variant="outline" className="w-full h-12 font-semibold gap-2">
                <Phone className="w-4 h-4 text-primary" />
                {t.hajjHelpline}
                <span className="ms-auto text-xs text-muted-foreground" dir="ltr">{HAJJ_HELPLINE}</span>
              </Button>
            </a>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
