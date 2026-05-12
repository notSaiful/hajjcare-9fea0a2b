import { Link } from "react-router-dom";
import { MainLayout } from "@/components/MainLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, MapPin, Phone, Stethoscope, Building2, Eye, AlertTriangle } from "lucide-react";
import {
  MEDICAL_FACILITIES,
  MEDICAL_EMERGENCY_NUMBERS,
  MEDICAL_FACILITIES_LABELS as L,
  type MedicalFacility,
} from "@/data/medicalFacilitiesContent";

const FacilityCard = ({ f, openLabel }: { f: MedicalFacility; openLabel: string }) => {
  const Icon = f.category === "observation" ? Eye : f.category === "clinic" ? Stethoscope : Building2;
  const ring =
    f.category === "observation"
      ? "border-primary/40 bg-primary/5"
      : f.category === "clinic"
        ? "border-status-safe/30 bg-status-safe/5"
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
            Bldg <span className="font-mono font-semibold text-foreground">{f.building}</span>
            {f.area ? <span className="ml-2">· {f.area}</span> : null}
          </p>
        </div>
        <Button
          asChild
          size="sm"
          variant="outline"
          className="flex-shrink-0 h-11 px-3 gap-1.5"
        >
          <a href={f.mapUrl} target="_blank" rel="noopener noreferrer" aria-label={`${openLabel} ${f.description}`}>
            <MapPin className="w-4 h-4" />
            <span className="hidden sm:inline">{openLabel}</span>
          </a>
        </Button>
      </CardContent>
    </Card>
  );
};

export default function MedicalFacilitiesPage() {
  const { language, isRTL } = useLanguage();
  const t = (k: keyof typeof L) => L[k][language as keyof typeof L.title] || L[k].en;

  const observation = MEDICAL_FACILITIES.filter((f) => f.category === "observation");
  const clinics = MEDICAL_FACILITIES.filter((f) => f.category === "clinic");
  const teams = MEDICAL_FACILITIES.filter((f) => f.category === "team");

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

        {observation.length > 0 && (
          <section className="space-y-2.5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground px-1">
              {t("observation")}
            </h2>
            {observation.map((f) => (
              <FacilityCard key={f.sno} f={f} openLabel={t("openMap")} />
            ))}
          </section>
        )}

        <section className="space-y-2.5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground px-1">
            {t("clinics")} ({clinics.length})
          </h2>
          {clinics.map((f) => (
            <FacilityCard key={f.sno} f={f} openLabel={t("openMap")} />
          ))}
        </section>

        <section className="space-y-2.5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground px-1">
            {t("teams")} ({teams.length})
          </h2>
          {teams.map((f) => (
            <FacilityCard key={f.sno} f={f} openLabel={t("openMap")} />
          ))}
        </section>
      </div>
    </MainLayout>
  );
}
