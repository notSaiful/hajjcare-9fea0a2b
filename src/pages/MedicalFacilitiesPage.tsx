import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MainLayout } from "@/components/MainLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  MapPin,
  Phone,
  Stethoscope,
  Building2,
  Eye,
  AlertTriangle,
  Search,
  X,
} from "lucide-react";
import {
  MEDICAL_FACILITIES,
  MEDICAL_EMERGENCY_NUMBERS,
  MEDICAL_FACILITIES_LABELS as L,
  type MedicalFacility,
} from "@/data/medicalFacilitiesContent";

type FilterCat = "all" | "observation" | "clinic" | "team" | "hospital";

const FacilityCard = ({ f, openLabel, callLabel }: { f: MedicalFacility; openLabel: string; callLabel: string }) => {
  const Icon =
    f.category === "observation"
      ? Eye
      : f.category === "clinic"
        ? Stethoscope
        : f.category === "hospital"
          ? Phone
          : Building2;
  const ring =
    f.category === "observation"
      ? "border-primary/40 bg-primary/5"
      : f.category === "clinic"
        ? "border-status-safe/30 bg-status-safe/5"
        : f.category === "hospital"
          ? "border-rose-500/30 bg-rose-500/5"
          : "border-amber-500/30 bg-amber-500/5";

  return (
    <Card className={`border-2 ${ring} transition-all hover:shadow-md`}>
      <CardContent className="p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
        <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-background border flex items-center justify-center">
          <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm sm:text-base text-foreground truncate">
            {f.description}
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {f.building ? (
              <>Bldg <span className="font-mono font-semibold text-foreground">{f.building}</span></>
            ) : null}
            {f.area ? <span className={f.building ? "ml-2" : ""}>· {f.area}</span> : null}
          </p>
          {f.phone && (
            <p className="text-xs sm:text-sm font-mono text-emerald-600 mt-0.5">{f.phone}</p>
          )}
        </div>
        <div className="flex flex-col gap-2 flex-shrink-0">
          {f.phone && (
            <Button
              asChild
              size="sm"
              variant="default"
              className="h-10 px-3 gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <a href={`tel:${f.phone}`} aria-label={`${callLabel} ${f.description}`}>
                <Phone className="w-4 h-4" />
                <span className="hidden sm:inline">{callLabel}</span>
              </a>
            </Button>
          )}
          <Button
            asChild
            size="sm"
            variant="outline"
            className="h-10 px-3 gap-1.5"
          >
            <a href={f.mapUrl} target="_blank" rel="noopener noreferrer" aria-label={`${openLabel} ${f.description}`}>
              <MapPin className="w-4 h-4" />
              <span className="hidden sm:inline">{openLabel}</span>
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default function MedicalFacilitiesPage() {
  const { language, isRTL } = useLanguage();
  const t = (k: keyof typeof L) => L[k][language as keyof typeof L.title] || L[k].en;

  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<FilterCat>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MEDICAL_FACILITIES.filter((f) => {
      if (cat !== "all" && f.category !== cat) return false;
      if (!q) return true;
      return (
        f.description.toLowerCase().includes(q) ||
        (f.building?.toLowerCase().includes(q) ?? false) ||
        (f.area?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [query, cat]);

  const counts = useMemo(
    () => ({
      all: MEDICAL_FACILITIES.length,
      observation: MEDICAL_FACILITIES.filter((f) => f.category === "observation").length,
      clinic: MEDICAL_FACILITIES.filter((f) => f.category === "clinic").length,
      team: MEDICAL_FACILITIES.filter((f) => f.category === "team").length,
      hospital: MEDICAL_FACILITIES.filter((f) => f.category === "hospital").length,
    }),
    [],
  );

  const observation = filtered.filter((f) => f.category === "observation");
  const clinics = filtered.filter((f) => f.category === "clinic");
  const teams = filtered.filter((f) => f.category === "team");
  const hospitals = filtered.filter((f) => f.category === "hospital");

  const chips: { id: FilterCat; label: string; count: number }[] = [
    { id: "all", label: t("all"), count: counts.all },
    { id: "observation", label: t("observation"), count: counts.observation },
    { id: "clinic", label: t("clinics"), count: counts.clinic },
    { id: "team", label: t("teams"), count: counts.team },
    { id: "hospital", label: t("hospitals"), count: counts.hospital },
  ];

  return (
    <MainLayout>
      <div className="container max-w-2xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-5">
        <Link to="/">
          <Button variant="ghost" size="sm" className="gap-2 -ml-2 h-10">
            {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            Back
          </Button>
        </Link>

        <header className="space-y-1.5">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">{t("title")}</h1>
          <p className="text-sm sm:text-base text-muted-foreground">{t("subtitle")}</p>
        </header>

        {/* Emergency banner */}
        <Card className="border-2 border-destructive/40 bg-destructive/5">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-destructive flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm sm:text-base text-destructive">
                  {t("emergency")}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {MEDICAL_EMERGENCY_NUMBERS.map((n) => (
                    <Button
                      key={n}
                      asChild
                      size="sm"
                      variant="destructive"
                      className="h-11 gap-2"
                    >
                      <a href={`tel:${n}`} aria-label={`${t("call")} ${n}`}>
                        <Phone className="w-4 h-4" />
                        <span className="font-mono">{n}</span>
                      </a>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search + filter chips */}
        <div className="space-y-3 sticky top-0 z-10 bg-background/95 backdrop-blur-sm pt-1 pb-2 -mx-3 px-3 sm:-mx-4 sm:px-4">
          <div className="relative">
            <Search className={cn(
              "absolute top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none",
              isRTL ? "right-3" : "left-3",
            )} />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("searchPlaceholder")}
              inputMode="search"
              className={cn("h-12 text-base", isRTL ? "pr-9 pl-9" : "pl-9 pr-9")}
              aria-label={t("searchPlaceholder")}
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className={cn(
                  "absolute top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted text-muted-foreground",
                  isRTL ? "left-2" : "right-2",
                )}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex gap-2 overflow-x-auto -mx-1 px-1 pb-1 scrollbar-none">
            {chips.map((c) => {
              const active = cat === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCat(c.id)}
                  className={cn(
                    "flex-shrink-0 h-10 px-3 rounded-full border-2 text-sm font-medium transition-all flex items-center gap-2",
                    active
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-foreground border-border hover:border-primary/40",
                  )}
                  aria-pressed={active}
                >
                  <span>{c.label}</span>
                  <Badge
                    variant={active ? "secondary" : "outline"}
                    className="h-5 px-1.5 text-[10px]"
                  >
                    {c.count}
                  </Badge>
                </button>
              );
            })}
          </div>
        </div>

        {filtered.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="p-6 text-center text-sm text-muted-foreground">
              {t("noResults")}
            </CardContent>
          </Card>
        ) : (
          <>
            {observation.length > 0 && (
              <section className="space-y-2.5">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground px-1">
                  {t("observation")}
                </h2>
                {observation.map((f) => (
                  <FacilityCard key={f.sno} f={f} openLabel={t("openMap")} callLabel={t("call")} />
                ))}
              </section>
            )}

            {clinics.length > 0 && (
              <section className="space-y-2.5">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground px-1">
                  {t("clinics")} ({clinics.length})
                </h2>
                {clinics.map((f) => (
                  <FacilityCard key={f.sno} f={f} openLabel={t("openMap")} callLabel={t("call")} />
                ))}
              </section>
            )}

            {teams.length > 0 && (
              <section className="space-y-2.5">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground px-1">
                  {t("teams")} ({teams.length})
                </h2>
                {teams.map((f) => (
                  <FacilityCard key={f.sno} f={f} openLabel={t("openMap")} callLabel={t("call")} />
                ))}
              </section>
            )}

            {hospitals.length > 0 && (
              <section className="space-y-2.5">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground px-1">
                  {t("hospitals")} ({hospitals.length})
                </h2>
                {hospitals.map((f) => (
                  <FacilityCard key={f.sno} f={f} openLabel={t("openMap")} callLabel={t("call")} />
                ))}
              </section>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
}
