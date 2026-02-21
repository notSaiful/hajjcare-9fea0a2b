/**
 * SVG Islamic geometric pattern overlay for auth screens.
 * Renders a subtle repeating arabesque pattern as a decorative background layer.
 */
export function IslamicPattern() {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-[0.06] pointer-events-none" aria-hidden>
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="islamic-geo" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            {/* 8-point star */}
            <polygon
              points="40,4 46,20 62,14 52,28 68,34 52,40 62,54 46,48 40,64 34,48 18,54 28,40 12,34 28,28 18,14 34,20"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.8"
            />
            {/* Inner octagon */}
            <polygon
              points="40,16 50,24 54,36 50,48 40,52 30,48 26,36 30,24"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            />
            {/* Corner connectors */}
            <line x1="0" y1="0" x2="18" y2="14" stroke="currentColor" strokeWidth="0.4" />
            <line x1="80" y1="0" x2="62" y2="14" stroke="currentColor" strokeWidth="0.4" />
            <line x1="0" y1="80" x2="18" y2="54" stroke="currentColor" strokeWidth="0.4" />
            <line x1="80" y1="80" x2="62" y2="54" stroke="currentColor" strokeWidth="0.4" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#islamic-geo)" className="text-primary" />
      </svg>
    </div>
  );
}
