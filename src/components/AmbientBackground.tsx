/**
 * AmbientBackground
 * 
 * Creates a subtle, calming ambient background with slow-moving gradients.
 * Motion is so subtle it's felt, not noticed.
 * 
 * Design Philosophy:
 * - Barely perceptible movement (20-40s loops)
 * - No sharp motion or parallax
 * - Soft layered gradients with very low saturation
 * - Creates atmosphere without distraction
 */

interface AmbientBackgroundProps {
  variant?: "default" | "minimal" | "warm";
  className?: string;
}

export const AmbientBackground = ({ 
  variant = "default",
  className = "" 
}: AmbientBackgroundProps) => {
  const gradientStyles = {
    default: {
      primary: "from-[hsl(168_25%_92%)] via-[hsl(160_15%_95%)] to-[hsl(38_20%_94%)]",
      secondary: "from-[hsl(155_20%_93%)] to-transparent",
      tertiary: "from-[hsl(42_15%_92%)] to-transparent",
    },
    minimal: {
      primary: "from-[hsl(160_10%_96%)] via-[hsl(160_8%_97%)] to-[hsl(160_10%_96%)]",
      secondary: "from-[hsl(168_12%_94%)] to-transparent",
      tertiary: "from-[hsl(38_10%_95%)] to-transparent",
    },
    warm: {
      primary: "from-[hsl(38_22%_93%)] via-[hsl(35_18%_95%)] to-[hsl(40_20%_94%)]",
      secondary: "from-[hsl(42_20%_92%)] to-transparent",
      tertiary: "from-[hsl(168_15%_93%)] to-transparent",
    },
  };

  const styles = gradientStyles[variant];

  return (
    <div 
      className={`fixed inset-0 -z-10 overflow-hidden pointer-events-none ${className}`}
      aria-hidden="true"
    >
      {/* Base gradient layer */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br ${styles.primary}`}
      />

      {/* Ambient layer 1 - Slow drift */}
      <div 
        className={`
          absolute -top-1/4 -left-1/4 w-3/4 h-3/4
          bg-gradient-radial ${styles.secondary}
          rounded-full blur-3xl
          animate-ambient-shift
        `}
        style={{ 
          background: `radial-gradient(circle at center, var(--gradient-ambient-1) 0%, transparent 70%)`,
          animationDelay: "0s" 
        }}
      />

      {/* Ambient layer 2 - Gentle glow */}
      <div 
        className={`
          absolute -bottom-1/4 -right-1/4 w-2/3 h-2/3
          rounded-full blur-3xl
          animate-ambient-glow
        `}
        style={{ 
          background: `radial-gradient(circle at center, var(--gradient-ambient-2) 0%, transparent 65%)`,
          animationDelay: "10s" 
        }}
      />

      {/* Ambient layer 3 - Subtle movement */}
      <div 
        className={`
          absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          w-full h-full
          rounded-full blur-3xl
          animate-ambient-drift
        `}
        style={{ 
          background: `radial-gradient(ellipse at center, var(--gradient-ambient-3) 0%, transparent 50%)`,
          animationDelay: "5s",
          opacity: 0.3
        }}
      />

      {/* Subtle islamic pattern overlay */}
      <div 
        className="absolute inset-0 islamic-pattern opacity-30"
        style={{ mixBlendMode: "overlay" }}
      />

      {/* Soft vignette for depth */}
      <div 
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, hsl(160 12% 96% / 0.4) 100%)"
        }}
      />
    </div>
  );
};
