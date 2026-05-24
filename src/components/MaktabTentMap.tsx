import { useMemo, useState } from "react";
import { MINA_MAKTABS, MINA_FULL_MAP_URL, type MinaMaktab } from "@/data/minaTentLocations";
import { getInspectorsForMaktab, type MaktabInspector } from "@/data/maktabInspectorAllotment";
import { Button } from "@/components/ui/button";
import { ExternalLink, Bus, Train, UserCheck } from "lucide-react";

interface Props {
  maktab: MinaMaktab;
}

// Parse "28/62" or "1-2-4/513" -> { camp: 28, street: 62 }
function parseCampStreet(cs: string): { camp: number; street: number } | null {
  const m = cs.match(/(\d+)(?:-\d+)*\s*\/\s*(\d+)/);
  if (!m) return null;
  return { camp: Number(m[1]), street: Number(m[2]) };
}

interface PlottedMaktab {
  m: MinaMaktab;
  camp: number;
  street: number;
}

export default function MaktabTentMap({ maktab }: Props) {
  const inspectors = useMemo(
    () => getInspectorsForMaktab(Number(maktab.maktab)),
    [maktab],
  );
  const [activeInsp, setActiveInsp] = useState<MaktabInspector | null>(null);

  const plotted: PlottedMaktab[] = useMemo(() => {
    return MINA_MAKTABS
      .map((m) => {
        const cs = parseCampStreet(m.campStreet);
        return cs ? { m, camp: cs.camp, street: cs.street } : null;
      })
      .filter((x): x is PlottedMaktab => x !== null);
  }, []);

  const current = plotted.find((p) => String(p.m.maktab) === String(maktab.maktab));

  // Build a normalised grid: rank unique streets (X) and unique camps (Y)
  const { xScale, yScale, width, height, padding } = useMemo(() => {
    const streets = Array.from(new Set(plotted.map((p) => p.street))).sort((a, b) => a - b);
    const camps = Array.from(new Set(plotted.map((p) => p.camp))).sort((a, b) => a - b);
    const padding = 28;
    const width = 360;
    const height = 320;
    const innerW = width - padding * 2;
    const innerH = height - padding * 2;
    const xStep = streets.length > 1 ? innerW / (streets.length - 1) : 0;
    const yStep = camps.length > 1 ? innerH / (camps.length - 1) : 0;
    const xScale = (street: number) => padding + streets.indexOf(street) * xStep;
    const yScale = (camp: number) => padding + camps.indexOf(camp) * yStep;
    return { xScale, yScale, width, height, padding };
  }, [plotted]);

  if (!current) {
    return (
      <div className="rounded-2xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground text-center">
        Map view unavailable for this Maktab.
      </div>
    );
  }

  const cx = xScale(current.street);
  const cy = yScale(current.camp);

  // Inspectors arranged around current maktab pin on a small ring
  const ringRadius = 26;
  const inspectorPositions = inspectors.slice(0, 18).map((insp, i, arr) => {
    const angle = (i / arr.length) * Math.PI * 2 - Math.PI / 2;
    return {
      insp,
      x: cx + Math.cos(angle) * ringRadius,
      y: cy + Math.sin(angle) * ringRadius,
    };
  });

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between gap-2 p-3 border-b border-border bg-primary/5">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold">
            Mina Tent Map (Schematic)
          </p>
          <p className="text-sm font-semibold">
            Maktab #{maktab.maktab} · Camp {current.camp} / Street {current.street}
          </p>
        </div>
        <a href={MINA_FULL_MAP_URL} target="_blank" rel="noopener noreferrer">
          <Button variant="outline" size="sm" className="gap-1 h-9">
            <ExternalLink className="w-3.5 h-3.5" />
            Full Map
          </Button>
        </a>
      </div>

      <div className="p-3">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto bg-gradient-to-br from-amber-50 to-emerald-50 rounded-xl border border-border"
          role="img"
          aria-label={`Schematic Mina map highlighting Maktab ${maktab.maktab}`}
        >
          {/* Grid lines */}
          <g stroke="hsl(var(--muted-foreground) / 0.15)" strokeWidth="0.5">
            {Array.from({ length: 6 }).map((_, i) => {
              const y = padding + ((height - padding * 2) / 5) * i;
              return <line key={`h${i}`} x1={padding} x2={width - padding} y1={y} y2={y} />;
            })}
            {Array.from({ length: 6 }).map((_, i) => {
              const x = padding + ((width - padding * 2) / 5) * i;
              return <line key={`v${i}`} x1={x} x2={x} y1={padding} y2={height - padding} />;
            })}
          </g>

          {/* Axis labels */}
          <text x={width / 2} y={height - 6} textAnchor="middle" fontSize="9" fill="hsl(var(--muted-foreground))">
            Street →
          </text>
          <text
            x={10}
            y={height / 2}
            textAnchor="middle"
            fontSize="9"
            fill="hsl(var(--muted-foreground))"
            transform={`rotate(-90 10 ${height / 2})`}
          >
            ← Camp
          </text>

          {/* Other maktabs */}
          {plotted
            .filter((p) => String(p.m.maktab) !== String(maktab.maktab))
            .map((p) => {
              const x = xScale(p.street);
              const y = yScale(p.camp);
              const color = p.m.transportation === "Bus" ? "hsl(35 90% 55%)" : "hsl(195 70% 50%)";
              return (
                <g key={`mk-${p.m.maktab}`}>
                  <circle cx={x} cy={y} r={6} fill={color} fillOpacity={0.35} stroke={color} strokeWidth={1} />
                  <text x={x} y={y + 2.5} textAnchor="middle" fontSize="7" fill="hsl(var(--foreground))" fontWeight={600}>
                    {p.m.maktab}
                  </text>
                </g>
              );
            })}

          {/* Connecting lines from current maktab to inspectors */}
          {inspectorPositions.map((p, i) => (
            <line
              key={`ln-${i}`}
              x1={cx}
              y1={cy}
              x2={p.x}
              y2={p.y}
              stroke="hsl(160 60% 35% / 0.4)"
              strokeWidth={0.6}
              strokeDasharray="2 2"
            />
          ))}

          {/* Current maktab pin (large) */}
          <g>
            <circle cx={cx} cy={cy} r={16} fill="hsl(160 70% 25%)" opacity={0.18}>
              <animate attributeName="r" values="16;22;16" dur="2.4s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.18;0.05;0.18" dur="2.4s" repeatCount="indefinite" />
            </circle>
            <circle cx={cx} cy={cy} r={12} fill="hsl(160 70% 25%)" stroke="white" strokeWidth={2} />
            <text x={cx} y={cy + 4} textAnchor="middle" fontSize="10" fill="white" fontWeight={700}>
              {maktab.maktab}
            </text>
          </g>

          {/* Inspector dots */}
          {inspectorPositions.map((p, i) => {
            const active = activeInsp?.indianMobile === p.insp.indianMobile;
            return (
              <g
                key={`insp-${i}`}
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setActiveInsp(p.insp)}
                onMouseLeave={() => setActiveInsp(null)}
                onClick={() => setActiveInsp(active ? null : p.insp)}
              >
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={active ? 5 : 3.5}
                  fill="hsl(160 50% 40%)"
                  stroke="white"
                  strokeWidth={1}
                />
              </g>
            );
          })}
        </svg>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 mt-3 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded-full bg-[hsl(160_70%_25%)]" />
            This Maktab
          </span>
          <span className="flex items-center gap-1">
            <UserCheck className="w-3 h-3 text-emerald-700" />
            {inspectors.length} inspector{inspectors.length === 1 ? "" : "s"}
          </span>
          <span className="flex items-center gap-1">
            <Train className="w-3 h-3 text-sky-600" /> Metro maktab
          </span>
          <span className="flex items-center gap-1">
            <Bus className="w-3 h-3 text-amber-600" /> Bus maktab
          </span>
        </div>

        {/* Active inspector preview */}
        <div className="mt-3 min-h-[44px] rounded-xl border border-dashed border-border bg-muted/30 px-3 py-2 text-xs">
          {activeInsp ? (
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="font-semibold text-foreground">{activeInsp.name}</p>
                <p className="text-muted-foreground font-mono">
                  🇮🇳 +91 {activeInsp.indianMobile} · 🇸🇦 +966 {activeInsp.saudiMobile}
                </p>
              </div>
              <a href={`tel:+91${activeInsp.indianMobile}`}>
                <Button size="sm" variant="default" className="h-8">Call</Button>
              </a>
            </div>
          ) : (
            <p className="text-muted-foreground">
              {inspectors.length > 0
                ? "Tap a green dot to see the inspector's name and call them."
                : "No State Haj Inspectors allotted yet for this Maktab."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
