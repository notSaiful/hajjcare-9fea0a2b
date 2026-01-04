import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        sm: "100%",
        md: "768px",
        lg: "1024px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['Noto Sans', 'Noto Sans Arabic', 'Noto Sans Devanagari', 'sans-serif'],
      },
      fontSize: {
        // High legibility sizes
        'body': ['1rem', { lineHeight: '1.7' }],
        'body-lg': ['1.125rem', { lineHeight: '1.7' }],
        'heading': ['1.5rem', { lineHeight: '1.3', fontWeight: '600' }],
        'heading-lg': ['2rem', { lineHeight: '1.2', fontWeight: '600' }],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Status colors - STRICT usage
        status: {
          safe: "hsl(var(--status-safe))",
          "safe-bg": "hsl(var(--status-safe-bg))",
          assistance: "hsl(var(--status-assistance))",
          "assistance-bg": "hsl(var(--status-assistance-bg))",
          emergency: "hsl(var(--status-emergency))",
          "emergency-bg": "hsl(var(--status-emergency-bg))",
        },
        // Calm palette
        calm: {
          teal: "hsl(var(--calm-teal))",
          "teal-light": "hsl(var(--calm-teal-light))",
          sand: "hsl(var(--calm-sand))",
          cream: "hsl(var(--calm-cream))",
          stone: "hsl(var(--calm-stone))",
        },
        // Sacred gold - sparingly
        sacred: {
          gold: "hsl(var(--sacred-gold))",
          "gold-soft": "hsl(var(--sacred-gold-soft))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "calc(var(--radius) + 4px)",
        "2xl": "calc(var(--radius) + 8px)",
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
        card: "var(--shadow-card)",
        elevated: "var(--shadow-elevated)",
        glow: "var(--shadow-glow)",
      },
      spacing: {
        // Touch-friendly spacing
        'touch': '56px',
        'touch-lg': '72px',
        '13': '3.25rem',
        '18': '4.5rem',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0", opacity: "0" },
          to: { height: "var(--radix-accordion-content-height)", opacity: "1" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)", opacity: "1" },
          to: { height: "0", opacity: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.97)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "ambient-shift": {
          "0%, 100%": { opacity: "0.4", transform: "translate(0%, 0%) scale(1)" },
          "33%": { opacity: "0.5", transform: "translate(2%, -1%) scale(1.02)" },
          "66%": { opacity: "0.45", transform: "translate(-1%, 1%) scale(1.01)" },
        },
        "ambient-glow": {
          "0%, 100%": { opacity: "0.3" },
          "50%": { opacity: "0.5" },
        },
        "ambient-drift": {
          "0%, 100%": { transform: "translate(0, 0) rotate(0deg)" },
          "25%": { transform: "translate(3%, 2%) rotate(1deg)" },
          "50%": { transform: "translate(1%, -1%) rotate(-0.5deg)" },
          "75%": { transform: "translate(-2%, 1%) rotate(0.5deg)" },
        },
        "pulse-status": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.88" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.25s ease-out",
        "accordion-up": "accordion-up 0.25s ease-out",
        "fade-in": "fade-in 0.5s cubic-bezier(0.25, 0.1, 0.25, 1) forwards",
        "fade-up": "fade-up 0.6s cubic-bezier(0.25, 0.1, 0.25, 1) forwards",
        "scale-in": "scale-in 0.4s cubic-bezier(0.25, 0.1, 0.25, 1) forwards",
        "ambient-shift": "ambient-shift 30s ease-in-out infinite",
        "ambient-glow": "ambient-glow 25s ease-in-out infinite",
        "ambient-drift": "ambient-drift 40s ease-in-out infinite",
        "pulse-status": "pulse-status 4s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
