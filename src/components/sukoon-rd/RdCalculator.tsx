import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { sukoonRdContent } from "@/data/sukoonRdContent";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Calculator, TrendingUp, Target, CalendarCheck } from "lucide-react";

const HAJJ_TARGET = 500000; // ₹5 lakh typical Hajj cost
const SBI_RD_RATE = 6.5; // Current SBI RD interest rate approx

export default function RdCalculator() {
  const { language } = useLanguage();
  const t = sukoonRdContent.calculator;
  const [monthly, setMonthly] = useState(5000);
  const [duration, setDuration] = useState(36);

  const totalDeposit = monthly * duration;
  const quarters = Math.floor(duration / 3);
  const interest = Math.round(
    totalDeposit * (SBI_RD_RATE / 100) * (quarters / 4)
  );
  const totalSavings = totalDeposit + interest;
  const readiness = Math.min(100, Math.round((totalSavings / HAJJ_TARGET) * 100));
  const targetDate = new Date();
  targetDate.setMonth(targetDate.getMonth() + duration);

  const getLabel = (obj: Record<string, string>) =>
    obj[language] || obj.en;

  return (
    <Card className="p-5 space-y-5 border-2 border-primary/20 bg-gradient-to-br from-background to-accent/10">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Calculator className="w-5 h-5 text-primary" />
        </div>
        <h3 className="text-lg font-bold text-foreground">
          {getLabel(t.title)}
        </h3>
      </div>

      {/* Monthly Amount */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          {getLabel(t.monthlyAmount)}
        </label>
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold text-primary">₹</span>
          <Input
            type="number"
            value={monthly}
            onChange={(e) => setMonthly(Math.max(100, Number(e.target.value)))}
            className="text-lg font-semibold"
            min={100}
            max={100000}
          />
        </div>
        <Slider
          value={[monthly]}
          onValueChange={(v) => setMonthly(v[0])}
          min={100}
          max={25000}
          step={500}
          className="mt-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>₹100</span>
          <span>₹25,000</span>
        </div>
      </div>

      {/* Duration */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          {getLabel(t.duration)}
        </label>
        <div className="flex gap-2">
          {[12, 24, 36, 48, 60].map((m) => (
            <button
              key={m}
              onClick={() => setDuration(m)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                duration === m
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-muted text-muted-foreground hover:bg-accent"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-2 gap-3">
        <ResultCard
          icon={<TrendingUp className="w-4 h-4" />}
          label={getLabel(t.totalSavings)}
          value={`₹${totalSavings.toLocaleString("en-IN")}`}
          sub={`+ ₹${interest.toLocaleString("en-IN")} ${getLabel(t.interestEarned)}`}
          color="text-emerald-600"
        />
        <ResultCard
          icon={<Target className="w-4 h-4" />}
          label={getLabel(t.hajjReadiness)}
          value={`${readiness}%`}
          sub={readiness >= 100 ? "✅ Ready!" : `₹${(HAJJ_TARGET - totalSavings).toLocaleString("en-IN")} more`}
          color={readiness >= 80 ? "text-emerald-600" : readiness >= 50 ? "text-amber-600" : "text-red-500"}
        />
        <ResultCard
          icon={<CalendarCheck className="w-4 h-4" />}
          label={getLabel(t.targetDate)}
          value={targetDate.toLocaleDateString(language === "ar" || language === "ur" ? "ar-SA" : "en-IN", {
            month: "short",
            year: "numeric",
          })}
          sub={`${duration} months`}
          color="text-primary"
          className="col-span-2"
        />
      </div>

      {/* Hajj Readiness Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">₹0</span>
          <span className="font-semibold text-foreground">₹{HAJJ_TARGET.toLocaleString("en-IN")} Target</span>
        </div>
        <div className="w-full h-4 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${readiness}%`,
              background: readiness >= 80
                ? "hsl(var(--primary))"
                : readiness >= 50
                ? "hsl(40, 90%, 50%)"
                : "hsl(0, 70%, 55%)",
            }}
          />
        </div>
      </div>
    </Card>
  );
}

function ResultCard({
  icon,
  label,
  value,
  sub,
  color,
  className = "",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  color: string;
  className?: string;
}) {
  return (
    <div className={`bg-card border rounded-xl p-3 space-y-1 ${className}`}>
      <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
        {icon} {label}
      </div>
      <p className={`text-xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-muted-foreground">{sub}</p>
    </div>
  );
}
