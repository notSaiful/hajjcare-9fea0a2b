import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Shield, X } from "lucide-react";

/**
 * Preview/dev-only role switcher with PER-PAGE persistence.
 *
 * Storage model:
 *   - `dev:roleOverrideByPath` → JSON map { [pathname]: "admin,inspector" }
 *     This is the source of truth for what role(s) apply on a given route.
 *   - `dev:roleOverride` → flat string mirroring the CURRENT path's selection,
 *     kept in sync so `useUserRole` (which reads this single key) keeps working
 *     unchanged. We update this whenever the route changes or the user toggles.
 */
const DEV_ROLE_KEY = "dev:roleOverride";
const DEV_ROLE_MAP_KEY = "dev:roleOverrideByPath";
const ROLES = ["admin", "coordinator", "medical_staff", "inspector"] as const;
type DevRole = (typeof ROLES)[number];

const isPreviewEnv = () => {
  if (typeof window === "undefined") return false;
  if (import.meta.env.DEV) return true;
  // Only enable on localhost. Never on lovable.app/lovableproject.com production domains
  // to prevent client-side admin escalation via localStorage.
  return window.location.hostname === "localhost";
};

const readMap = (): Record<string, string> => {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(DEV_ROLE_MAP_KEY);
    return raw ? (JSON.parse(raw) as Record<string, string>) : {};
  } catch {
    return {};
  }
};

const writeMap = (map: Record<string, string>) => {
  localStorage.setItem(DEV_ROLE_MAP_KEY, JSON.stringify(map));
};

const writeActive = (value: string) => {
  if (value) localStorage.setItem(DEV_ROLE_KEY, value);
  else localStorage.removeItem(DEV_ROLE_KEY);
  window.dispatchEvent(new Event("dev:role-override-changed"));
};

const setForPath = (path: string, set: Set<DevRole>) => {
  const map = readMap();
  const value = Array.from(set).join(",");
  if (value) map[path] = value;
  else delete map[path];
  writeMap(map);
  writeActive(value);
};

const getForPath = (path: string): Set<DevRole> => {
  const map = readMap();
  const raw = map[path] ?? "";
  return new Set(raw.split(",").map((s) => s.trim()).filter(Boolean) as DevRole[]);
};

export const DevRoleSwitcher = () => {
  const location = useLocation();
  const path = location.pathname;
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Set<DevRole>>(new Set());

  // Sync active override + UI state whenever the route changes.
  useEffect(() => {
    if (!isPreviewEnv()) return;
    const next = getForPath(path);
    setSelected(next);
    writeActive(Array.from(next).join(","));
  }, [path]);

  if (!isPreviewEnv()) return null;

  const toggle = (role: DevRole) => {
    const next = new Set(selected);
    if (next.has(role)) next.delete(role);
    else next.add(role);
    setSelected(next);
    setForPath(path, next);
  };

  const clearAll = () => {
    const next = new Set<DevRole>();
    setSelected(next);
    setForPath(path, next);
  };

  const clearAllPages = () => {
    writeMap({});
    const next = new Set<DevRole>();
    setSelected(next);
    writeActive("");
  };

  const activeCount = selected.size;
  const savedPages = Object.keys(readMap()).length;

  return (
    <div className="fixed bottom-4 left-4 z-[9999] font-sans">
      {open ? (
        <div className="w-72 rounded-lg border border-amber-300 bg-white shadow-xl dark:border-amber-700 dark:bg-zinc-900">
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
            <p className="mb-1 px-1 text-[10px] leading-snug text-muted-foreground">
              Saved per page. Reload to apply.
            </p>
            <p className="mb-2 truncate rounded bg-muted px-2 py-1 font-mono text-[10px] text-muted-foreground" title={path}>
              {path}
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
            <div className="mt-2 flex items-center justify-between gap-2 border-t border-border pt-2">
              <div className="flex flex-col">
                <button
                  type="button"
                  onClick={clearAll}
                  className="text-left text-[11px] text-muted-foreground hover:text-foreground"
                >
                  Clear this page
                </button>
                <button
                  type="button"
                  onClick={clearAllPages}
                  className="text-left text-[11px] text-muted-foreground hover:text-foreground"
                  title={`${savedPages} page(s) saved`}
                >
                  Clear all pages ({savedPages})
                </button>
              </div>
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
          title={`Dev role switcher — ${path}`}
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
