/**
 * Rich SVG Islamic geometric pattern overlay with layered arabesque motifs.
 */
export function IslamicPattern() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {/* Primary star pattern — subtle */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.05]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="islamic-star" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            <polygon
              points="40,4 46,20 62,14 52,28 68,34 52,40 62,54 46,48 40,64 34,48 18,54 28,40 12,34 28,28 18,14 34,20"
              fill="none" stroke="currentColor" strokeWidth="0.8"
            />
            <polygon
              points="40,16 50,24 54,36 50,48 40,52 30,48 26,36 30,24"
              fill="none" stroke="currentColor" strokeWidth="0.5"
            />
            <line x1="0" y1="0" x2="18" y2="14" stroke="currentColor" strokeWidth="0.4" />
            <line x1="80" y1="0" x2="62" y2="14" stroke="currentColor" strokeWidth="0.4" />
            <line x1="0" y1="80" x2="18" y2="54" stroke="currentColor" strokeWidth="0.4" />
            <line x1="80" y1="80" x2="62" y2="54" stroke="currentColor" strokeWidth="0.4" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#islamic-star)" className="text-primary" />
      </svg>

      {/* Secondary interlocking lattice — even subtler */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="islamic-lattice" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
            <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="0.4" />
            <circle cx="0" cy="0" r="20" fill="none" stroke="currentColor" strokeWidth="0.4" />
            <circle cx="48" cy="0" r="20" fill="none" stroke="currentColor" strokeWidth="0.4" />
            <circle cx="0" cy="48" r="20" fill="none" stroke="currentColor" strokeWidth="0.4" />
            <circle cx="48" cy="48" r="20" fill="none" stroke="currentColor" strokeWidth="0.4" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#islamic-lattice)" className="text-primary" />
      </svg>

      {/* Radial vignette for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,hsl(var(--background))_100%)]" />
    </div>
  );
}
