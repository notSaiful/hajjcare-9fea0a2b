import { useState } from "react";
import { HajInspector } from "@/data/hajInspectorsData";
import { Badge } from "@/components/ui/badge";
import {
  User,
  MapPin,
  Phone,
  MessageCircle,
  Building2,
  IdCard,
  Copy,
  Check,
  Link2,
  Star,
  Pencil,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { useInspectorFavorites } from "@/hooks/useInspectorFavorites";
import { useInspectorOverrides } from "@/hooks/useInspectorOverrides";
import { InspectorEditDialog } from "@/components/inspector/InspectorEditDialog";

const buildWaLink = (phone: string) =>
  `https://wa.me/${phone.replace(/[^\d+]/g, "").replace(/^\+/, "")}`;

interface InspectorNetworkRowProps {
  inspector: HajInspector;
  translations: Record<string, string>;
}

const sanitizePhone = (p: string) => p.replace(/[^\d+]/g, "");

/**
 * Compact, dense row for the "Inspector Network" view.
 * Optimized so inspectors can quickly find each other:
 * Name, State, Cover #, Indian Mobile, KSA Mobile, Makkah & Madinah Building.
 */
export const InspectorNetworkRow = ({
  inspector,
  translations: t,
}: InspectorNetworkRowProps) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const { isFavorite, toggleFavorite } = useInspectorFavorites();
  const { hasOverride } = useInspectorOverrides();
  const favorited = isFavorite(inspector.id);
  const edited = hasOverride(inspector.id);

  const handleToggleFavorite = () => {
    const nowFav = toggleFavorite(inspector.id);
    toast({
      title: nowFav ? "Added to favorites" : "Removed from favorites",
      description: inspector.name,
    });
  };

  const copyToClipboard = async (value: string, key: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);
      toast({ title: `${label} copied`, description: value });
      setTimeout(() => setCopiedKey((k) => (k === key ? null : k)), 1500);
    } catch {
      toast({ title: "Copy failed", description: "Please copy manually." });
    }
  };

  const hasContact = inspector.indianMobile || inspector.ksaMobile;
  const hasBuilding = inspector.makkahBuilding || inspector.madinahBuilding;

  return (
    <div
      className={cn(
        "rounded-lg border bg-card p-3 space-y-2",
        favorited && "border-amber-300 dark:border-amber-700 bg-amber-50/40 dark:bg-amber-950/20"
      )}
    >
      {/* Top row: name + state */}
      <div className="flex items-start gap-2.5">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <User className="w-4 h-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-sm text-foreground truncate">
              {inspector.name}
            </h3>
            {inspector.coverNumber && (
              <span className="inline-flex items-center gap-1 text-[11px] text-foreground bg-primary/10 px-1.5 py-0.5 rounded">
                <IdCard className="w-3 h-3" />
                {inspector.coverNumber}
              </span>
            )}
            <Badge
              variant={inspector.result === "Selected" ? "default" : "secondary"}
              className={cn(
                "text-[10px] h-4 px-1.5",
                inspector.result === "Selected"
                  ? "bg-emerald-500 hover:bg-emerald-600"
                  : "bg-amber-500 hover:bg-amber-600"
              )}
            >
              {inspector.result === "Selected" ? t.selected : t.waitlisted}
            </Badge>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-0.5">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="truncate">{inspector.state}</span>
          </div>
        </div>
        <div className="flex flex-col gap-1 shrink-0">
          <button
            type="button"
            onClick={handleToggleFavorite}
            className={cn(
              "h-7 w-7 rounded-md border flex items-center justify-center transition-colors",
              favorited
                ? "border-amber-400 bg-amber-100 text-amber-600 hover:bg-amber-200 dark:bg-amber-900/40 dark:border-amber-700"
                : "border-border bg-background text-muted-foreground hover:bg-accent"
            )}
            aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
            aria-pressed={favorited}
            title={favorited ? "Remove from favorites" : "Add to favorites"}
          >
            <Star
              className={cn("w-4 h-4", favorited && "fill-amber-500 text-amber-500")}
            />
          </button>
          <button
            type="button"
            onClick={() => setEditOpen(true)}
            className={cn(
              "h-7 w-7 rounded-md border flex items-center justify-center transition-colors",
              edited
                ? "border-primary/40 bg-primary/10 text-primary hover:bg-primary/20"
                : "border-border bg-background text-muted-foreground hover:bg-accent"
            )}
            aria-label="Edit inspector details"
            title={edited ? "Edited on this device — tap to update" : "Edit details"}
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {edited && (
        <div className="pl-10 -mt-1">
          <span className="inline-flex items-center gap-1 text-[10px] text-primary bg-primary/10 px-1.5 py-0.5 rounded">
            <Pencil className="w-2.5 h-2.5" />
            Edited on this device
          </span>
        </div>
      )}

      {/* Compact contact + building grid */}
      {(hasContact || hasBuilding) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-10">
          {inspector.indianMobile && (
            <div className="flex items-center justify-between gap-1.5 bg-muted/50 rounded px-2 py-1">
              <div className="min-w-0 flex-1">
                <div className="text-[10px] text-muted-foreground leading-tight">
                  🇮🇳 {t.indianMobile || "Indian"}
                </div>
                <div className="text-[12px] font-medium truncate leading-tight">
                  {inspector.indianMobile}
                </div>
              </div>
              <div className="flex gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    copyToClipboard(
                      inspector.indianMobile!,
                      `in-${inspector.id}`,
                      t.indianMobile || "Indian Mobile"
                    )
                  }
                  className="h-6 w-6 rounded-md border flex items-center justify-center hover:bg-accent"
                  aria-label="Copy Indian mobile"
                >
                  {copiedKey === `in-${inspector.id}` ? (
                    <Check className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
                <a
                  href={`tel:${sanitizePhone(inspector.indianMobile)}`}
                  className="h-6 w-6 rounded-md border flex items-center justify-center hover:bg-accent"
                  aria-label="Call"
                >
                  <Phone className="w-3 h-3" />
                </a>
                <a
                  href={buildWaLink(inspector.indianMobile)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-6 w-6 rounded-md border border-emerald-300 dark:border-emerald-700 flex items-center justify-center hover:bg-accent"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-3 h-3 text-emerald-600" />
                </a>
                <button
                  type="button"
                  onClick={() =>
                    copyToClipboard(
                      buildWaLink(inspector.indianMobile!),
                      `in-wa-${inspector.id}`,
                      `${t.indianMobile || "Indian"} WhatsApp link`
                    )
                  }
                  className="h-6 w-6 rounded-md border border-emerald-300 dark:border-emerald-700 flex items-center justify-center hover:bg-accent"
                  aria-label="Copy Indian WhatsApp link"
                >
                  {copiedKey === `in-wa-${inspector.id}` ? (
                    <Check className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <Link2 className="w-3 h-3 text-emerald-600" />
                  )}
                </button>
              </div>
            </div>
          )}

          {inspector.ksaMobile && (
            <div className="flex items-center justify-between gap-1.5 bg-muted/50 rounded px-2 py-1">
              <div className="min-w-0 flex-1">
                <div className="text-[10px] text-muted-foreground leading-tight">
                  🇸🇦 {t.ksaMobile || "KSA"}
                </div>
                <div className="text-[12px] font-medium truncate leading-tight">
                  {inspector.ksaMobile}
                </div>
              </div>
              <div className="flex gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    copyToClipboard(
                      inspector.ksaMobile!,
                      `ksa-${inspector.id}`,
                      t.ksaMobile || "KSA Mobile"
                    )
                  }
                  className="h-6 w-6 rounded-md border flex items-center justify-center hover:bg-accent"
                  aria-label="Copy KSA mobile"
                >
                  {copiedKey === `ksa-${inspector.id}` ? (
                    <Check className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
                <a
                  href={`tel:${sanitizePhone(inspector.ksaMobile)}`}
                  className="h-6 w-6 rounded-md border flex items-center justify-center hover:bg-accent"
                  aria-label="Call"
                >
                  <Phone className="w-3 h-3" />
                </a>
                <a
                  href={buildWaLink(inspector.ksaMobile)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-6 w-6 rounded-md border border-emerald-300 dark:border-emerald-700 flex items-center justify-center hover:bg-accent"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-3 h-3 text-emerald-600" />
                </a>
                <button
                  type="button"
                  onClick={() =>
                    copyToClipboard(
                      buildWaLink(inspector.ksaMobile!),
                      `ksa-wa-${inspector.id}`,
                      `${t.ksaMobile || "KSA"} WhatsApp link`
                    )
                  }
                  className="h-6 w-6 rounded-md border border-emerald-300 dark:border-emerald-700 flex items-center justify-center hover:bg-accent"
                  aria-label="Copy KSA WhatsApp link"
                >
                  {copiedKey === `ksa-wa-${inspector.id}` ? (
                    <Check className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <Link2 className="w-3 h-3 text-emerald-600" />
                  )}
                </button>
              </div>
            </div>
          )}

          {inspector.makkahBuilding && (
            <div className="flex items-start gap-1.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded px-2 py-1 sm:col-span-2">
              <Building2 className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400 mt-0.5 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="text-[10px] text-amber-800 dark:text-amber-300 font-medium leading-tight">
                  🕋 {t.makkahBuilding || "Makkah"}
                </div>
                <div className="text-[12px] font-medium text-foreground break-words leading-tight">
                  {inspector.makkahBuilding}
                </div>
              </div>
            </div>
          )}

          {inspector.madinahBuilding && (
            <div className="flex items-start gap-1.5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 rounded px-2 py-1 sm:col-span-2">
              <Building2 className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400 mt-0.5 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="text-[10px] text-emerald-800 dark:text-emerald-300 font-medium leading-tight">
                  🕌 {t.madinahBuilding || "Madinah"}
                </div>
                <div className="text-[12px] font-medium text-foreground break-words leading-tight">
                  {inspector.madinahBuilding}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {!hasContact && !hasBuilding && (
        <div className="pl-10 text-[11px] text-muted-foreground italic">
          {t.contactPending ||
            "Contact and building details will be updated soon."}
        </div>
      )}

      <InspectorEditDialog
        inspector={inspector}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </div>
  );
};
