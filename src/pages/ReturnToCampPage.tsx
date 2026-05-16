import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Phone,
  Tent,
  Bus,
  Train,
  Navigation,
  AlertTriangle,
  Edit3,
  CheckCircle2,
  LifeBuoy,
  Share2,
  Volume2,
  Loader2,
  Building2,
  Users,
  Siren,
  Maximize2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { MINA_MAKTABS, MINA_FULL_MAP_URL, type MinaMaktab } from "@/data/minaTentLocations";
import { getReturnToCampLabels } from "@/data/returnToCampContent";
import { normalizeNumerals } from "@/lib/minaSearch";
import { toast } from "@/hooks/use-toast";

const STORAGE_KEY = "hajjcare:saved-camp-v2";
const LEGACY_KEY = "hajjcare:saved-maktab";
const HAJJ_HELPLINE = "+919796762333";
const SAUDI_EMERGENCY = "911";

// Mina centroid (approx) — used for "far from Mina" detection
const MINA_LAT = 21.4131;
const MINA_LNG = 39.8932;
const FAR_THRESHOLD_KM = 5;

interface SavedCamp {
  maktab: string;
  tent?: string;
  sector?: string;
  groupCompany?: string;
  busRoute?: string;
  hotel?: string;
  leaderName?: string;
  leaderPhone?: string;
}

function readSaved(): SavedCamp | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as SavedCamp;
    // migrate legacy
    const legacy = localStorage.getItem(LEGACY_KEY);
    if (legacy) return { maktab: legacy };
  } catch { /* ignore */ }
  return null;
}

function findMaktab(num: string): MinaMaktab | null {
  const n = normalizeNumerals(num.trim());
  return MINA_MAKTABS.find((m) => String(m.maktab) === n) ?? null;
}

function saudiTel(local: string): string {
  const d = local.replace(/\D/g, "");
  if (!d) return "";
  if (d === "911") return "tel:911";
  return `tel:+966${d.replace(/^0+/, "")}`;
}

function rawTel(p: string): string {
  return `tel:${p.replace(/\s/g, "")}`;
}

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

function vibrate(pattern: number | number[]) {
  try { navigator.vibrate?.(pattern); } catch { /* ignore */ }
}

export default function ReturnToCampPage() {
  const { language, isRTL } = useLanguage();
  const t = getReturnToCampLabels(language);

  const [saved, setSaved] = useState<SavedCamp | null>(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<SavedCamp>({ maktab: "" });
  const [error, setError] = useState<string | null>(null);
  const [sharing, setSharing] = useState(false);
  const [alerting, setAlerting] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [farFromMina, setFarFromMina] = useState(false);
  const checkedFarRef = useRef(false);

  useEffect(() => {
    const s = readSaved();
    setSaved(s);
    if (!s) {
      setEditing(true);
    } else {
      setDraft(s);
    }
  }, []);

  const maktab = useMemo(() => (saved ? findMaktab(saved.maktab) : null), [saved]);

  // Proactive: check distance from Mina once per session if camp is saved
  useEffect(() => {
    if (!saved || checkedFarRef.current || !navigator.geolocation) return;
    checkedFarRef.current = true;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const km = haversineKm(pos.coords.latitude, pos.coords.longitude, MINA_LAT, MINA_LNG);
        if (km > FAR_THRESHOLD_KM) setFarFromMina(true);
      },
      () => { /* ignore */ },
      { maximumAge: 5 * 60 * 1000, timeout: 8000 }
    );
  }, [saved]);

  const handleSave = () => {
    setError(null);
    const m = findMaktab(draft.maktab);
    if (!m) {
      setError(t.invalidMaktab);
      vibrate([60, 40, 60]);
      return;
    }
    const next: SavedCamp = { ...draft, maktab: String(m.maktab) };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      localStorage.removeItem(LEGACY_KEY);
    } catch { /* ignore */ }
    setSaved(next);
    setEditing(false);
    vibrate(20);
  };

  const TransportIcon = maktab?.transportation === "Bus" ? Bus : Train;
  const transportLabel = maktab?.transportation === "Bus" ? t.bus : t.metro;

  const mapsUrl = maktab
    ? `https://www.google.com/maps/dir/?api=1&destination=Mina,Mecca,Saudi+Arabia&travelmode=walking`
    : MINA_FULL_MAP_URL;

  const handleShareLocation = async () => {
    if (!navigator.geolocation) {
      toast({ title: t.shareLocationError, variant: "destructive" });
      return;
    }
    setSharing(true);
    vibrate(20);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
        const text =
          `${t.showCardLabelLost}\n` +
          (saved?.maktab ? `Maktab: ${saved.maktab}\n` : "") +
          (saved?.tent ? `Tent: ${saved.tent}\n` : "") +
          (saved?.sector ? `Sector: ${saved.sector}\n` : "") +
          (saved?.groupCompany ? `Group: ${saved.groupCompany}\n` : "") +
          `\n📍 ${url}`;
        try {
          if (navigator.share) {
            await navigator.share({ title: "SafeReturn — Live Location", text });
          } else {
            await navigator.clipboard.writeText(text);
            toast({ title: "Location copied to clipboard" });
          }
        } catch { /* user cancelled */ }
        setSharing(false);
      },
      () => {
        toast({ title: t.shareLocationError, variant: "destructive" });
        setSharing(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSpeakArabic = () => {
    vibrate(20);
    try {
      const u = new SpeechSynthesisUtterance(t.showCardArabicLine);
      u.lang = "ar-SA";
      u.rate = 0.9;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    } catch {
      toast({ title: "Voice not available on this device" });
    }
  };

  // PANIC: Alert family via WhatsApp deep link + native share (with live location)
  const handleAlertFamily = () => {
    if (!saved?.leaderPhone) {
      toast({ title: t.alertFamilyNoLeader, variant: "destructive" });
      vibrate([80, 40, 80]);
      return;
    }
    setAlerting(true);
    vibrate([100, 50, 100, 50, 100]);

    const buildMessage = (locUrl?: string) => {
      const lines = [
        "🆘 SafeReturn — I AM LOST",
        `${t.showCardLabelLost}`,
        "",
        saved.maktab ? `Maktab: ${saved.maktab}` : "",
        saved.tent ? `Tent: ${saved.tent}` : "",
        saved.sector ? `Sector: ${saved.sector}` : "",
        saved.groupCompany ? `Group: ${saved.groupCompany}` : "",
        saved.hotel ? `Hotel: ${saved.hotel}` : "",
        "",
        locUrl ? `📍 Live location: ${locUrl}` : "📍 Location unavailable",
        "",
        "— Sent from HajjCare SafeReturn",
      ].filter(Boolean).join("\n");
      return lines;
    };

    const openWhatsApp = (msg: string) => {
      const phone = saved.leaderPhone!.replace(/[^\d+]/g, "").replace(/^\+/, "");
      const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
      window.open(url, "_blank", "noopener,noreferrer");
      toast({ title: t.alertFamilySent });
      // Best-effort native share too (lets user pick more channels)
      if (navigator.share) {
        navigator.share({ title: "SafeReturn — I am lost", text: msg }).catch(() => {});
      }
      setAlerting(false);
    };

    if (!navigator.geolocation) {
      openWhatsApp(buildMessage());
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const url = `https://www.google.com/maps?q=${pos.coords.latitude},${pos.coords.longitude}`;
        openWhatsApp(buildMessage(url));
      },
      () => openWhatsApp(buildMessage()),
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );
  };

  // Keep screen awake while fullscreen card is shown
  useEffect(() => {
    if (!fullscreen) return;
    let wakeLock: any = null;
    const nav = navigator as any;
    if (nav.wakeLock?.request) {
      nav.wakeLock.request("screen").then((wl: any) => { wakeLock = wl; }).catch(() => {});
    }
    return () => { try { wakeLock?.release?.(); } catch { /* ignore */ } };
  }, [fullscreen]);

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
      {/* Emergency-styled sticky header */}
      <header className="sticky top-0 z-20 bg-gradient-to-b from-destructive/10 to-background/95 backdrop-blur border-b border-destructive/20">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link to="/home">
            <Button variant="ghost" size="icon" aria-label={t.back} className="h-11 w-11">
              <ArrowLeft className={`w-6 h-6 ${isRTL ? "rotate-180" : ""}`} />
            </Button>
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold leading-tight flex items-center gap-2">
              <LifeBuoy className="w-5 h-5 text-destructive" />
              {t.title}
            </h1>
            <p className="text-xs text-muted-foreground line-clamp-1">{t.subtitle}</p>
          </div>
          <Badge variant="destructive" className="hidden sm:inline-flex">{t.qaBadge}</Badge>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-4 space-y-4 pb-16">
        {/* Proactive far-from-Mina banner */}
        {farFromMina && maktab && (
          <Card className="border-2 border-destructive/40 bg-destructive/5 animate-fade-in">
            <CardContent className="p-4 flex items-start gap-3">
              <div className="w-11 h-11 rounded-xl bg-destructive/15 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-base">{t.farFromMinaTitle}</h3>
                <p className="text-sm text-muted-foreground">{t.farFromMinaDesc}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* HERO: Big Arabic help banner — always visible when camp is saved */}
        {maktab && !editing && (
          <Card className="border-2 border-primary/40 bg-card overflow-hidden">
            <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider">{t.showCardTitle}</span>
              <div className="flex items-center gap-1.5">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => { vibrate(20); setFullscreen(true); }}
                  className="h-9 gap-1.5"
                  aria-label={t.fullscreenCardBtn}
                >
                  <Maximize2 className="w-4 h-4" />
                  <span className="text-xs hidden sm:inline">{t.fullscreenCardBtn}</span>
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleSpeakArabic}
                  className="h-9 gap-1.5"
                  aria-label={t.speakArabic}
                >
                  <Volume2 className="w-4 h-4" />
                  <span className="text-xs hidden sm:inline">{t.speakArabic}</span>
                </Button>
              </div>
            </div>
            <CardContent dir="rtl" className="p-5 space-y-4">
              <p className="text-2xl sm:text-3xl font-bold leading-snug text-center text-foreground">
                {t.showCardArabicLine}
              </p>
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-primary/15">
                <ArField label="المكتب" value={`#${maktab.maktab}`} />
                <ArField label="المخيم / الشارع" value={maktab.campStreet} mono />
                {saved?.tent && <ArField label="الخيمة" value={saved.tent} />}
                {saved?.sector && <ArField label="القطاع" value={saved.sector} />}
                {saved?.groupCompany && <ArField label="المجموعة" value={saved.groupCompany} fullWidth />}
                {saved?.busRoute && <ArField label="الحافلة" value={saved.busRoute} />}
                {saved?.hotel && <ArField label="فندق مكة" value={saved.hotel} fullWidth />}
                <ArField label="المدير" value={maktab.manager.name} fullWidth />
                <ArField label="هاتف المدير" value={`+966 ${maktab.manager.phone}`} mono fullWidth />
              </div>
              <p dir={isRTL ? "rtl" : "ltr"} className="text-xs text-muted-foreground italic text-center pt-1">
                {t.showCardLabelLost}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Saved camp / setup */}
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

              <Field
                label={t.yourMaktab}
                required
                input={
                  <Input
                    inputMode="numeric"
                    placeholder={t.enterMaktabPlaceholder}
                    value={draft.maktab}
                    onChange={(e) => setDraft({ ...draft, maktab: e.target.value })}
                    onKeyDown={(e) => e.key === "Enter" && handleSave()}
                    className="h-12 text-base"
                  />
                }
              />
              {error && (
                <p className="text-sm text-destructive flex items-center gap-1.5 font-medium">
                  <AlertTriangle className="w-4 h-4" />
                  {error}
                </p>
              )}

              <p className="text-xs text-muted-foreground pt-1">{t.optionalHint}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label={t.tentNumberLabel} input={
                  <Input className="h-11" placeholder={t.tentNumberPlaceholder} value={draft.tent ?? ""}
                    onChange={(e) => setDraft({ ...draft, tent: e.target.value })} />
                } />
                <Field label={t.sectorLabel} input={
                  <Input className="h-11" placeholder={t.sectorPlaceholder} value={draft.sector ?? ""}
                    onChange={(e) => setDraft({ ...draft, sector: e.target.value })} />
                } />
                <Field label={t.groupCompanyLabel} input={
                  <Input className="h-11" placeholder={t.groupCompanyPlaceholder} value={draft.groupCompany ?? ""}
                    onChange={(e) => setDraft({ ...draft, groupCompany: e.target.value })} />
                } />
                <Field label={t.busRouteLabel} input={
                  <Input className="h-11" placeholder={t.busRoutePlaceholder} value={draft.busRoute ?? ""}
                    onChange={(e) => setDraft({ ...draft, busRoute: e.target.value })} />
                } />
                <Field label={t.hotelLabel} input={
                  <Input className="h-11" placeholder={t.hotelPlaceholder} value={draft.hotel ?? ""}
                    onChange={(e) => setDraft({ ...draft, hotel: e.target.value })} />
                } />
                <Field label={t.leaderNameLabel} input={
                  <Input className="h-11" placeholder={t.leaderNamePlaceholder} value={draft.leaderName ?? ""}
                    onChange={(e) => setDraft({ ...draft, leaderName: e.target.value })} />
                } />
                <Field label={t.leaderPhoneLabel} input={
                  <Input inputMode="tel" className="h-11" placeholder={t.leaderPhonePlaceholder} value={draft.leaderPhone ?? ""}
                    onChange={(e) => setDraft({ ...draft, leaderPhone: e.target.value })} />
                } />
              </div>

              <div className="flex gap-2 pt-1">
                <Button onClick={handleSave} className="flex-1 h-14 text-base font-bold" size="lg">
                  <CheckCircle2 className="w-5 h-5" />
                  {t.saveBtn}
                </Button>
                {saved && (
                  <Button variant="outline" size="lg" onClick={() => { setEditing(false); setDraft(saved); setError(null); }} className="h-14">
                    {t.cancelBtn}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-primary/30 shadow-soft">
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">
                  {t.savedTitle}
                </p>
                <Button variant="ghost" size="sm" onClick={() => { setDraft(saved!); setEditing(true); }}
                  className="h-9 gap-1 text-xs">
                  <Edit3 className="w-4 h-4" />
                  {t.changeMaktabBtn}
                </Button>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-2xl shadow-soft shrink-0">
                  {maktab.maktab}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">{t.yourMaktab}</p>
                  <p className="font-bold text-xl leading-tight">#{maktab.maktab}</p>
                  <Badge variant="secondary" className="gap-1 mt-1">
                    <TransportIcon className="w-3.5 h-3.5" />
                    {transportLabel}
                  </Badge>
                </div>
              </div>

              <div className="rounded-xl bg-muted/50 p-3 space-y-2">
                <Row icon={MapPin} label={t.campStreet} value={`${maktab.description} · ${maktab.campStreet}`} />
                {saved?.tent && <Row icon={Tent} label={t.tentNumberLabel} value={saved.tent} />}
                {saved?.sector && <Row icon={MapPin} label={t.sectorLabel} value={saved.sector} />}
                {saved?.groupCompany && <Row icon={Users} label={t.groupCompanyLabel} value={saved.groupCompany} />}
                {saved?.busRoute && <Row icon={Bus} label={t.busRouteLabel} value={saved.busRoute} />}
                {saved?.hotel && <Row icon={Building2} label={t.hotelLabel} value={saved.hotel} />}
              </div>

              {/* MASSIVE one-tap actions */}
              <div className="grid grid-cols-1 gap-2.5">
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer" onClick={() => vibrate(20)}>
                  <Button className="w-full h-16 text-base font-bold gap-2.5" size="lg">
                    <Navigation className="w-6 h-6" />
                    {t.navigateToCamp}
                  </Button>
                </a>

                <Button
                  onClick={handleShareLocation}
                  disabled={sharing}
                  variant="secondary"
                  className="w-full h-14 text-base font-semibold gap-2 bg-islamic-gold/15 hover:bg-islamic-gold/25 border-2 border-islamic-gold/30"
                >
                  {sharing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Share2 className="w-5 h-5" />}
                  {sharing ? t.shareLocationLoading : t.shareLocation}
                </Button>

                {saved?.leaderPhone && (
                  <a href={rawTel(saved.leaderPhone)} onClick={() => vibrate(20)}>
                    <Button variant="outline" className="w-full h-14 text-base font-semibold gap-2 border-2">
                      <Phone className="w-5 h-5 text-primary" />
                      <span className="truncate">{t.callGroupLeader}{saved.leaderName ? ` · ${saved.leaderName}` : ""}</span>
                    </Button>
                  </a>
                )}

                <a href={saudiTel(maktab.manager.phone)} onClick={() => vibrate(20)}>
                  <Button variant="outline" className="w-full h-14 text-base font-semibold gap-2">
                    <Phone className="w-5 h-5 text-primary" />
                    {t.callManager}
                    <span className="ms-auto text-xs text-muted-foreground" dir="ltr">+966 {maktab.manager.phone}</span>
                  </Button>
                </a>
                <a href={saudiTel(maktab.assistantManager.phone)} onClick={() => vibrate(20)}>
                  <Button variant="outline" className="w-full h-12 text-sm font-medium gap-2">
                    <Phone className="w-4 h-4 text-primary" />
                    {t.callAssistant}
                  </Button>
                </a>
                <a href={saudiTel(maktab.minaCampsHousing.phone)} onClick={() => vibrate(20)}>
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
            <h3 className="font-bold text-base flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              {t.ifLostTitle}
            </h3>
            <ol className="space-y-2 text-base leading-relaxed list-decimal ps-5">
              <li>{t.ifLostStep1}</li>
              <li>{t.ifLostStep2}</li>
              <li>{t.ifLostStep3}</li>
              <li>{t.ifLostStep4}</li>
            </ol>
          </CardContent>
        </Card>

        {/* Emergency helplines */}
        <Card className="border-destructive/30">
          <CardContent className="p-4 space-y-2.5">
            <h3 className="font-bold text-base flex items-center gap-2">
              <Phone className="w-5 h-5 text-destructive" />
              {t.emergencyTitle}
            </h3>
            <a href="tel:911" onClick={() => vibrate([40, 30, 40])}>
              <Button variant="destructive" className="w-full h-14 font-bold text-base gap-2">
                <Phone className="w-5 h-5" />
                {t.saudiEmergency}
                <span className="ms-auto text-sm opacity-90 font-mono" dir="ltr">{SAUDI_EMERGENCY}</span>
              </Button>
            </a>
            <a href={`tel:${HAJJ_HELPLINE}`} onClick={() => vibrate(20)}>
              <Button variant="outline" className="w-full h-14 font-semibold text-base gap-2 border-2">
                <Phone className="w-5 h-5 text-primary" />
                {t.callShi}
                <span className="ms-auto text-xs text-muted-foreground font-mono" dir="ltr">{HAJJ_HELPLINE}</span>
              </Button>
            </a>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

/* ---------- helpers ---------- */

function Field({ label, input, required }: { label: string; input: React.ReactNode; required?: boolean }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-semibold text-foreground/80">
        {label}
        {required && <span className="text-destructive ms-1">*</span>}
      </span>
      {input}
    </label>
  );
}

function Row({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="w-4 h-4 text-islamic-gold mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold break-words">{value}</p>
      </div>
    </div>
  );
}

function ArField({ label, value, mono, fullWidth }: { label: string; value: string; mono?: boolean; fullWidth?: boolean }) {
  return (
    <div className={fullWidth ? "col-span-2" : ""}>
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className={`font-bold ${mono ? "font-mono" : ""}`} dir="ltr">{value}</p>
    </div>
  );
}
