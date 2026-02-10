import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Type } from "lucide-react";
import { cn } from "@/lib/utils";

export const LargeTextToggle = ({ className }: { className?: string }) => {
  const [largeText, setLargeText] = useState(() => {
    return localStorage.getItem("large-text") === "true";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("large-text", largeText);
    localStorage.setItem("large-text", String(largeText));
  }, [largeText]);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setLargeText((prev) => !prev)}
      className={cn(
        "h-10 w-10 sm:h-11 sm:w-11 rounded-xl hover:bg-muted/80 transition-colors duration-300",
        largeText && "bg-primary/10 text-primary",
        className
      )}
      title={largeText ? "Normal text size" : "Large text for elderly"}
    >
      <Type className={cn("w-5 h-5", largeText && "w-6 h-6")} />
    </Button>
  );
};
