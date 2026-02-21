/**
 * Detailed mosque silhouette with minarets, dome, arched windows, and crescent.
 */
export function MosqueSilhouette() {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-32 sm:h-44 pointer-events-none overflow-hidden opacity-[0.07]" aria-hidden>
      <svg
        viewBox="0 0 1000 200"
        className="w-full h-full text-primary"
        preserveAspectRatio="xMidYMax slice"
        fill="currentColor"
      >
        {/* Left minaret */}
        <rect x="100" y="50" width="16" height="150" rx="2" />
        <rect x="96" y="45" width="24" height="8" rx="2" />
        <circle cx="108" cy="38" r="10" />
        <rect x="104" y="22" width="8" height="16" rx="1" />
        <polygon points="108,10 102,22 114,22" />

        {/* Left small dome */}
        <rect x="200" y="120" width="80" height="80" />
        <ellipse cx="240" cy="120" rx="40" ry="28" />

        {/* Central structure */}
        <rect x="350" y="100" width="300" height="100" />
        {/* Main dome */}
        <ellipse cx="500" cy="100" rx="120" ry="65" />
        {/* Crescent on dome */}
        <g transform="translate(500, 40)">
          <circle r="11" fill="currentColor" />
          <circle cx="4" cy="-2" r="9" fill="hsl(var(--background))" />
          <rect x="-2" y="-22" width="4" height="10" rx="1" />
        </g>

        {/* Arched windows */}
        {[400, 450, 500, 550, 600].map((x) => (
          <g key={x}>
            <rect x={x - 8} y="140" width="16" height="24" rx="1" fill="hsl(var(--background))" opacity="0.5" />
            <ellipse cx={x} cy="140" rx="8" ry="6" fill="hsl(var(--background))" opacity="0.5" />
          </g>
        ))}

        {/* Right small dome */}
        <rect x="720" y="120" width="80" height="80" />
        <ellipse cx="760" cy="120" rx="40" ry="28" />

        {/* Right minaret */}
        <rect x="884" y="50" width="16" height="150" rx="2" />
        <rect x="880" y="45" width="24" height="8" rx="2" />
        <circle cx="892" cy="38" r="10" />
        <rect x="888" y="22" width="8" height="16" rx="1" />
        <polygon points="892,10 886,22 898,22" />

        {/* Ground */}
        <rect x="0" y="185" width="1000" height="15" />
      </svg>
    </div>
  );
}
