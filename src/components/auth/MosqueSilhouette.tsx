/**
 * A minimal mosque/minaret silhouette rendered at the bottom of the auth screen.
 */
export function MosqueSilhouette() {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-28 sm:h-36 pointer-events-none overflow-hidden opacity-[0.08]" aria-hidden>
      <svg
        viewBox="0 0 800 160"
        className="w-full h-full text-primary"
        preserveAspectRatio="xMidYMax slice"
        fill="currentColor"
      >
        {/* Left minaret */}
        <rect x="80" y="40" width="14" height="120" rx="2" />
        <circle cx="87" cy="35" r="9" />
        <rect x="83" y="20" width="8" height="16" rx="1" />
        <polygon points="87,8 81,20 93,20" />

        {/* Central dome */}
        <rect x="300" y="90" width="200" height="70" />
        <ellipse cx="400" cy="90" rx="100" ry="55" />
        {/* Crescent on dome */}
        <circle cx="400" cy="42" r="10" />
        <circle cx="404" cy="40" r="8" fill="hsl(var(--background))" />
        <rect x="398" y="28" width="4" height="8" rx="1" />

        {/* Right minaret */}
        <rect x="706" y="40" width="14" height="120" rx="2" />
        <circle cx="713" cy="35" r="9" />
        <rect x="709" y="20" width="8" height="16" rx="1" />
        <polygon points="713,8 707,20 719,20" />

        {/* Base wall */}
        <rect x="0" y="140" width="800" height="20" />
      </svg>
    </div>
  );
}
