import { useState, useEffect } from "react";
import { Sun, SunDim } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SunlightModeToggle({ className }: { className?: string }) {
  const [sunlight, setSunlight] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("sunlight");
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (sunlight) {
      root.classList.add("sunlight");
      root.classList.remove("dark");
    } else {
      root.classList.remove("sunlight");
    }
  }, [sunlight]);

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setSunlight(!sunlight)}
      className={cn(
        "gap-2 font-semibold border-2 transition-all duration-200",
        sunlight
          ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
          : "bg-card text-foreground border-border hover:bg-secondary",
        className
      )}
      aria-label={sunlight ? "Disable sunlight mode" : "Enable sunlight mode"}
    >
      {sunlight ? <Sun className="w-4 h-4" /> : <SunDim className="w-4 h-4" />}
      <span className="text-xs">☀️ {sunlight ? "Sunlight ON" : "Sunlight"}</span>
    </Button>
  );
}
