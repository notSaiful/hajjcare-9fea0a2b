import { memo } from "react";

/**
 * AmbientBackground
 * 
 * Creates a subtle, calming ambient background with slow-moving gradients.
 * Motion is so subtle it's felt, not noticed.
 * 
 * PERFORMANCE OPTIMIZED:
 * - Uses will-change for GPU acceleration
 * - Memoized to prevent re-renders
 * - CSS transforms only (no layout thrashing)
 * - Reduced layer count for mobile
 */

interface AmbientBackgroundProps {
  variant?: "default" | "minimal" | "warm";
  className?: string;
}

export const AmbientBackground = memo(function AmbientBackground({ 
  variant = "default",
  className = "" 
}: AmbientBackgroundProps) {
  const gradientStyles = {
    default: {
      primary: "from-[hsl(168_25%_92%)] via-[hsl(160_15%_95%)] to-[hsl(38_20%_94%)]",
    },
    minimal: {
      primary: "from-[hsl(160_10%_96%)] via-[hsl(160_8%_97%)] to-[hsl(160_10%_96%)]",
    },
    warm: {
      primary: "from-[hsl(38_22%_93%)] via-[hsl(35_18%_95%)] to-[hsl(40_20%_94%)]",
    },
  };

  const styles = gradientStyles[variant];

  return (
    <div 
      className={`fixed inset-0 -z-10 overflow-hidden pointer-events-none ${className}`}
      aria-hidden="true"
    >
      {/* Base gradient layer - static, no animation for fast paint */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br ${styles.primary}`}
      />

      {/* Single ambient layer - GPU accelerated */}
      <div 
        className="absolute -top-1/4 -left-1/4 w-3/4 h-3/4 rounded-full blur-3xl animate-ambient-glow"
        style={{ 
          background: `radial-gradient(circle at center, var(--gradient-ambient-1) 0%, transparent 70%)`,
          willChange: "opacity",
          transform: "translateZ(0)", // Force GPU layer
        }}
      />

      {/* Subtle vignette for depth - static */}
      <div 
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, hsl(160 12% 96% / 0.3) 100%)"
        }}
      />
    </div>
  );
});
