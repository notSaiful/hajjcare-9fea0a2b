import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HAJ_INSPECTORS, INSPECTOR_STATES } from "@/data/hajInspectorsData";
import { InspectorNetworkRow } from "@/components/inspector/InspectorNetworkRow";
import { Search, Network, ExternalLink, X, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useInspectorFavorites } from "@/hooks/useInspectorFavorites";

const PREVIEW_COUNT = 8;

const NETWORK_T = {
  selected: "Selected",
  waitlisted: "Waitlisted",
  indianMobile: "Indian",
  ksaMobile: "KSA",
  makkahBuilding: "Makkah Building",
  madinahBuilding: "Madinah Building",
  contactPending: "Contact and building details will be updated soon.",
};

/**
 * Compact "Inspector Network" widget for the Inspector Dashboard.
 * Shows quick-access inspector rows (name, state, cover#, Indian + KSA numbers
 * with one-tap copy buttons, and Makkah / Madinah building) so inspectors
 * can find each other without leaving the dashboard.
 */
export const InspectorNetworkPanel = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [stateFilter, setStateFilter] = useState<string>("");
  const [showAll, setShowAll] = useState(false);

  const filtered = useMemo(() => {
    const normalize = (s: string) =>
      s.toLowerCase().replace(/[\s\-]+/g, "");
    const q = query.trim();
    const nq = normalize(q);

    return HAJ_INSPECTORS.filter((i) => {
      if (stateFilter && i.state.toLowerCase() !== stateFilter.toLowerCase()) {
        return false;
      }
      if (!q) return true;
      const haystack = [
        i.name,
        i.state,
        i.coverNumber || "",
        i.indianMobile || "",
        i.ksaMobile || "",
        i.makkahBuilding || "",
        i.madinahBuilding || "",
      ]
        .join(" ")
        .toLowerCase();
      if (haystack.includes(q.toLowerCase())) return true;
      // Building-style normalized search (216-A == 216a == 216 a)
      const normHay = normalize(haystack);
      return normHay.includes(nq);
    });
  }, [query, stateFilter]);

  const visible = showAll ? filtered : filtered.slice(0, PREVIEW_COUNT);

  return (
    <Card className="border-primary/20">
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <Network className="w-5 h-5 text-primary" />
            Inspector Network
          </h2>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs h-7"
            onClick={() => navigate("/haj-inspectors")}
          >
            Open full directory
            <ExternalLink className="w-3 h-3 ml-1" />
          </Button>
        </div>

        <p className="text-xs text-muted-foreground -mt-1">
          Find a colleague — name, state, cover #, building, or mobile.
          Tap 📋 to copy any number.
        </p>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search name / state / cover # / building / mobile"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 pr-9 h-9 text-sm"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* State quick chips */}
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setStateFilter("")}
            className={`text-[11px] px-2 py-1 rounded-full border transition-colors ${
              stateFilter === ""
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-muted/50 hover:bg-muted text-foreground border-border"
            }`}
          >
            All States
          </button>
          {INSPECTOR_STATES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStateFilter(stateFilter === s ? "" : s)}
              className={`text-[11px] px-2 py-1 rounded-full border transition-colors ${
                stateFilter === s
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted/50 hover:bg-muted text-foreground border-border"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Result count */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {filtered.length} inspector{filtered.length === 1 ? "" : "s"}
            {stateFilter && ` • ${stateFilter}`}
          </span>
          {!showAll && filtered.length > PREVIEW_COUNT && (
            <Badge variant="outline" className="text-[10px]">
              Showing {PREVIEW_COUNT}
            </Badge>
          )}
        </div>

        {/* Rows */}
        <div className="space-y-2">
          {visible.length === 0 ? (
            <div className="text-center py-6 text-sm text-muted-foreground">
              No inspectors match your filters.
            </div>
          ) : (
            visible.map((inspector) => (
              <InspectorNetworkRow
                key={inspector.id}
                inspector={inspector}
                translations={NETWORK_T}
              />
            ))
          )}
        </div>

        {/* Show more / less toggle */}
        {filtered.length > PREVIEW_COUNT && (
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => setShowAll((v) => !v)}
          >
            {showAll
              ? "Show less"
              : `Show all ${filtered.length} inspectors`}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default InspectorNetworkPanel;
