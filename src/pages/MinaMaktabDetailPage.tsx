import { useMemo } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { ArrowLeft, MapPin, Phone, MessageCircle, Bus, Train, ExternalLink, Copy, Check, Shield, UserCheck, Search, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { fuzzyMatches } from "@/lib/minaSearch";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MINA_MAKTABS, MINA_FULL_MAP_URL, type MaktabContact } from "@/data/minaTentLocations";
import { getInspectorsForMaktab, type MaktabInspector } from "@/data/maktabInspectorAllotment";
import MaktabTentMap from "@/components/MaktabTentMap";
import { toast } from "sonner";

const ROLES: Array<{ key: keyof typeof labelMap; label: string }> = [
  { key: "manager", label: "Manager" },
  { key: "assistantManager", label: "Assistant Manager" },
  { key: "receptionMakkahHousing", label: "Reception & Makkah Housing" },
  { key: "supportTawaf", label: "Support & Central Tawaf" },
  { key: "arafatCampsHousing", label: "Arafat Camps Housing" },
  { key: "minaCampsHousing", label: "Mina Camps Housing" },
];

const labelMap = {
  manager: "Manager",
  assistantManager: "Assistant Manager",
  receptionMakkahHousing: "Reception & Makkah Housing",
  supportTawaf: "Support & Central Tawaf",
  arafatCampsHousing: "Arafat Camps Housing",
  minaCampsHousing: "Mina Camps Housing",
} as const;

const ContactCard = ({ role, contact }: { role: string; contact: MaktabContact }) => {
  const [copied, setCopied] = useState(false);
  const intl = `+966${contact.phone}`;
  const waNumber = `966${contact.phone}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(intl);
      setCopied(true);
      toast.success("Number copied");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Could not copy");
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4 space-y-3">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold">
            {role}
          </p>
          <p className="text-base font-semibold leading-snug mt-1">{contact.name}</p>
          <p className="text-sm font-mono text-muted-foreground mt-1">{intl}</p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <a href={`tel:${intl}`} className="block">
            <Button variant="default" size="sm" className="w-full gap-1 h-11">
              <Phone className="w-4 h-4" /> Call
            </Button>
          </a>
          <a
            href={`https://wa.me/${waNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Button variant="outline" size="sm" className="w-full gap-1 h-11">
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </Button>
          </a>
          <Button variant="outline" size="sm" onClick={copy} className="gap-1 h-11">
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const InspectorCard = ({ insp }: { insp: MaktabInspector }) => {
  const indianIntl = `+91${insp.indianMobile}`;
  const saudiIntl = `+966${insp.saudiMobile}`;
  return (
    <Card className="overflow-hidden border-emerald-500/30">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start gap-2">
          <div className="w-9 h-9 rounded-full bg-emerald-500/15 flex items-center justify-center shrink-0">
            <UserCheck className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold">
              State Haj Inspector
            </p>
            <p className="text-base font-semibold leading-snug">{insp.name}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="rounded-xl border border-border p-3 space-y-2">
            <p className="text-[11px] font-semibold text-muted-foreground">🇮🇳 Indian Mobile</p>
            <p className="text-sm font-mono">{indianIntl}</p>
            <div className="grid grid-cols-2 gap-1.5">
              <a href={`tel:${indianIntl}`}>
                <Button size="sm" className="w-full h-10 gap-1"><Phone className="w-3.5 h-3.5" />Call</Button>
              </a>
              <a href={`https://wa.me/91${insp.indianMobile}`} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="w-full h-10 gap-1"><MessageCircle className="w-3.5 h-3.5" />WA</Button>
              </a>
            </div>
          </div>
          <div className="rounded-xl border border-border p-3 space-y-2">
            <p className="text-[11px] font-semibold text-muted-foreground">🇸🇦 Saudi Mobile</p>
            <p className="text-sm font-mono">{saudiIntl}</p>
            <div className="grid grid-cols-2 gap-1.5">
              <a href={`tel:${saudiIntl}`}>
                <Button size="sm" className="w-full h-10 gap-1"><Phone className="w-3.5 h-3.5" />Call</Button>
              </a>
              <a href={`https://wa.me/966${insp.saudiMobile}`} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="w-full h-10 gap-1"><MessageCircle className="w-3.5 h-3.5" />WA</Button>
              </a>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function MinaMaktabDetailPage() {
  const { maktabId } = useParams<{ maktabId: string }>();
  const m = useMemo(
    () => MINA_MAKTABS.find((x) => String(x.maktab) === String(maktabId)),
    [maktabId]
  );

  const inspectors = useMemo(
    () => (m ? getInspectorsForMaktab(Number(m.maktab)) : []),
    [m]
  );

  const [inspectorQuery, setInspectorQuery] = useState("");
  const filteredInspectors = useMemo(() => {
    const q = inspectorQuery.trim();
    if (!q) return inspectors;
    return inspectors.filter((i) =>
      fuzzyMatches(q, `${i.name} ${i.indianMobile} ${i.saudiMobile}`)
    );
  }, [inspectors, inspectorQuery]);

  if (!m) return <Navigate to="/mina-tents" replace />;

  const Icon = m.transportation === "Bus" ? Bus : Train;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link to="/mina-tents">
            <Button variant="ghost" size="icon" aria-label="Back">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold leading-tight">Maktab #{m.maktab}</h1>
            <p className="text-xs text-muted-foreground">Mina Tent — Hajj 2026</p>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-4 space-y-4">
        {/* Hero card */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-primary/5 border-b border-border p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-2xl shadow-soft">
                  {m.maktab}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Maktab Number</p>
                  <p className="font-bold text-lg">#{m.maktab}</p>
                </div>
              </div>
              <Badge variant="secondary" className="gap-1 text-sm py-1.5 px-3">
                <Icon className="w-4 h-4" />
                {m.transportation}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/40">
              <MapPin className="w-5 h-5 text-islamic-gold mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Tent Location</p>
                <p className="text-base font-semibold">{m.description}</p>
                <p className="text-xs font-mono text-muted-foreground mt-1">
                  Camp / Street: {m.campStreet}
                </p>
              </div>
            </div>
            <a
              href={MINA_FULL_MAP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Button variant="default" size="lg" className="w-full gap-2 h-12">
                <ExternalLink className="w-4 h-4" />
                Open Full Mina Map
              </Button>
            </a>
          </CardContent>
        </Card>

        {/* Schematic Tent Map */}
        <MaktabTentMap maktab={m} />

        {/* Contacts */}
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wide text-muted-foreground mb-2 px-1">
            Maktab Contacts
          </h2>
          <div className="grid gap-3">
            {ROLES.map(({ key, label }) => (
              <ContactCard key={key} role={label} contact={m[key as keyof typeof labelMap] as MaktabContact} />
            ))}
          </div>
        </div>

        {/* State Haj Inspectors allotted to this Maktab */}
        <div>
          <div className="flex items-center justify-between mb-2 px-1">
            <h2 className="text-sm font-bold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-700" />
              State Haj Inspectors
            </h2>
            <Badge variant="secondary" className="text-xs">
              {inspectors.length} allotted
            </Badge>
          </div>
          {inspectors.length > 0 ? (
            <>
              <div className="relative mb-3">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <Input
                  type="search"
                  inputMode="search"
                  placeholder="Search by name or phone…"
                  value={inspectorQuery}
                  onChange={(e) => setInspectorQuery(e.target.value)}
                  className="h-11 pl-9 pr-9 text-base"
                  aria-label="Search inspectors"
                />
                {inspectorQuery && (
                  <button
                    type="button"
                    onClick={() => setInspectorQuery("")}
                    aria-label="Clear search"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-muted-foreground hover:bg-muted"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              {filteredInspectors.length > 0 ? (
                <div className="grid gap-3">
                  {filteredInspectors.map((insp, i) => (
                    <InspectorCard key={`${insp.indianMobile}-${i}`} insp={insp} />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground text-center">
                  No inspector matches “{inspectorQuery}”.
                </div>
              )}
            </>
          ) : (
            <div className="rounded-2xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground text-center">
              No State Haj Inspector allotment published yet for Maktab #{m.maktab}.
            </div>
          )}
        </div>


        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-foreground/80">
          <strong>Unofficial directory.</strong> Numbers shown are Saudi mobile numbers (+966).
          For corrections contact <a href="tel:+919796762333" className="text-primary font-semibold">+91 97967 62333</a>.
        </div>
      </main>
    </div>
  );
}
