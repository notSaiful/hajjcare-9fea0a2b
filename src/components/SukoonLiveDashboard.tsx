import { ExternalLink, MapPin, Navigation, Radio, ShieldAlert, WifiOff } from "lucide-react";
import { HAJJ_LOCATIONS, HAJJ_STAGES } from "@/hooks/useHajjLocation";
import type { MemberLocation } from "@/hooks/useFamilyGroup";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const LANDMARKS = ["kaaba", "mina", "arafat", "muzdalifah", "jamarat"] as const;

function distanceKm(a: number, b: number, c: number, d: number) {
  const r = 6371;
  const toRad = (n: number) => (n * Math.PI) / 180;
  const x = toRad(c - a);
  const y = toRad(d - b);
  const q = Math.sin(x / 2) ** 2 + Math.cos(toRad(a)) * Math.cos(toRad(c)) * Math.sin(y / 2) ** 2;
  return r * 2 * Math.atan2(Math.sqrt(q), Math.sqrt(1 - q));
}

function freshness(updatedAt: string) {
  const minutes = Math.max(0, Math.round((Date.now() - new Date(updatedAt).getTime()) / 60_000));
  if (minutes <= 2) return { label: "Online", detail: "Updated just now", tone: "bg-emerald-500" };
  if (minutes <= 15) return { label: "Last updated", detail: `${minutes} min ago`, tone: "bg-amber-500" };
  return { label: "Offline / delayed", detail: `${minutes} min ago`, tone: "bg-slate-400" };
}

/** Read-only family surface. Coordinates are shown only when server-side consent permits it. */
export function SukoonLiveDashboard({ locations }: { locations: MemberLocation[] }) {
  if (!locations.length) {
    return (
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="flex items-start gap-3 p-4 text-sm text-muted-foreground">
          <WifiOff className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <p>Live location is currently unavailable because the pilgrim has disabled location sharing.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <section aria-label="Family live location dashboard" className="space-y-3">
      {locations.map((location) => {
        const state = freshness(location.updated_at);
        const stage = location.current_stage ? HAJJ_STAGES[location.current_stage as keyof typeof HAJJ_STAGES] : undefined;
        const nearest = LANDMARKS
          .map((key) => ({ key, distance: distanceKm(location.latitude, location.longitude, HAJJ_LOCATIONS[key].lat, HAJJ_LOCATIONS[key].lng) }))
          .sort((a, b) => a.distance - b.distance)[0];
        const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${location.latitude},${location.longitude}`)}`;

        return (
          <Card key={location.id} className="overflow-hidden border-primary/20 bg-gradient-to-br from-emerald-50/80 via-background to-amber-50/70 shadow-sm dark:from-emerald-950/30 dark:to-background">
            <CardContent className="space-y-4 p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-foreground">{location.member_name || "Pilgrim"}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground"><span className={`h-2 w-2 rounded-full ${state.tone}`} aria-hidden="true" />{state.label} · {state.detail}</p>
                </div>
                {location.pilgrim_status === "emergency_managed" && <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-1 text-xs font-semibold text-destructive"><ShieldAlert className="h-3.5 w-3.5" />SOS</span>}
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-xl border border-border/60 bg-background/70 p-3"><p className="text-xs text-muted-foreground">Current area</p><p className="mt-1 font-medium">{stage?.nameEn || "Location shared"}</p></div>
                <div className="rounded-xl border border-border/60 bg-background/70 p-3"><p className="text-xs text-muted-foreground">Nearest Haj site</p><p className="mt-1 font-medium">{HAJJ_STAGES[nearest.key].nameEn} · {nearest.distance < 1 ? `${Math.round(nearest.distance * 1000)} m` : `${nearest.distance.toFixed(1)} km`}</p></div>
              </div>

              <div className="flex gap-2">
                <Button asChild className="flex-1 rounded-xl"><a href={mapUrl} target="_blank" rel="noreferrer"><MapPin className="h-4 w-4" />Open live map<ExternalLink className="h-3.5 w-3.5" /></a></Button>
                <Button asChild variant="outline" className="rounded-xl"><a href="tel:+966125420019" aria-label="Call Indian Haj Mission emergency contact"><Navigation className="h-4 w-4" />Help</a></Button>
              </div>
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><Radio className="h-3.5 w-3.5 text-primary" />Location is shared only while the pilgrim’s consent is active.</p>
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
}
