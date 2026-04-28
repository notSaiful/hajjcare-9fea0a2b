import { useEffect, useState } from "react";
import { Shield, X } from "lucide-react";

/**
 * Preview/dev-only role switcher.
 * Writes to localStorage("dev:roleOverride") which `useUserRole` reads
 * to bypass Supabase role checks. Never renders in production builds
 * served from a custom domain.
 */
const DEV_ROLE_KEY = "dev:roleOverride";
const ROLES = ["admin", "coordinator", "medical_staff", "inspector"] as const;
type DevRole = (typeof ROLES)[number];

const isPreviewEnv = () => {
  if (typeof window === "undefined") return false;
  if (import.meta.env.DEV) return true;
  const h = window.location.hostname;
  return h.includes("lovable.app") || h.includes("lovableproject.com") || h === "localhost";
};

const readSelected = (): Set<DevRole> => {
  if (typeof window === "undefined") return new Set();
  const raw = localStorage.getItem(DEV_ROLE_KEY) || "";
  return new Set(
    raw.split(",").map((s) => s.trim()).filter(Boolean) as DevRole[]
  );
};

const writeSelected = (set: Set<DevRole>) => {
  const value = Array.from(set).join(",");
  if (value) localStorage.setItem(DEV_ROLE_KEY, value);
  else localStorage.removeItem(DEV_ROLE_KEY);
  window.dispatchEvent(new Event("dev:role-override-changed"));
};

export const DevRoleSwitcher = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Set<DevRole>>(new Set());

  useEffect(() => {
    setSelected(readSelected());
  }, []);

  if (!isPreviewEnv()) return null;

  const toggle = (role: DevRole) => {
    const next = new Set(selected);
    if (next.has(role)) next.delete(role);
    else next.add(role);
    setSelected(next);
    writeSelected(next);
  };

  const clearAll = () => {
    const next = new Set<DevRole>();
    setSelected(next);
    writeSelected(next);
  };

  const activeCount = selected.size;

  return (
    <div className="fixed bottom-4 left-4 z-[9999] font-sans">
      {open ? (
        <div className="w-64 rounded-lg border border-amber-300 bg-white shadow-xl dark:border-amber-700 dark:bg-zinc-900">
          <div className="flex items-center justify-between border-b border-amber-200 bg-amber-50 px-3 py-2 dark:border-amber-800 dark:bg-amber-950">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-900 dark:text-amber-200">
              <Shield className="h-3.5 w-3.5" />
              Dev Role Switcher
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded p-0.5 text-amber-900 hover:bg-amber-100 dark:text-amber-200 dark:hover:bg-amber-900"
              aria-label="Close"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="p-2">
            <p className="mb-2 px-1 text-[10px] leading-snug text-muted-foreground">
              Preview only — overrides your role locally. Reload pages after toggling.
            </p>
            <div className="space-y-1">
              {ROLES.map((role) => {
                const checked = selected.has(role);
                return (
                  <label
                    key={role}
                    className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-xs hover:bg-muted"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggle(role)}
                      className="h-3.5 w-3.5 accent-amber-600"
                    />
                    <span className="font-mono">{role}</span>
                  </label>
                );
              })}
            </div>
            <div className="mt-2 flex items-center justify-between border-t border-border pt-2">
              <button
                type="button"
                onClick={clearAll}
                className="text-[11px] text-muted-foreground hover:text-foreground"
              >
                Clear (use real account)
              </button>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="rounded bg-amber-600 px-2 py-1 text-[11px] font-medium text-white hover:bg-amber-700"
              >
                Reload
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-900 shadow-md hover:bg-amber-100 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-200"
          title="Dev role switcher (preview only)"
        >
          <Shield className="h-3.5 w-3.5" />
          Roles
          {activeCount > 0 && (
            <span className="rounded-full bg-amber-600 px-1.5 text-[10px] font-bold text-white">
              {activeCount}
            </span>
          )}
        </button>
      )}
    </div>
  );
};

export default DevRoleSwitcher;
