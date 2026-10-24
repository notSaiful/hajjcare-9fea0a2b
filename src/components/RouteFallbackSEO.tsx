import { useLocation } from "react-router-dom";
import { SEO } from "@/components/SEO";
import routes from "@/seo/routes.json";

type RouteMeta = {
  path: string;
  title: string;
  description: string;
};

const PUBLIC_ROUTES = routes as RouteMeta[];

/** Segment-aware so /inspector does not hide /inspector-directory. */
const PRIVATE_PREFIXES = [
  "/admin",
  "/auth",
  "/login",
  "/reset-password",
  "/error",
  "/profile",
  "/security-settings",
  "/payment",
  "/billing-history",
  "/command-center",
  "/national-command",
  "/coordinator",
  "/medical-alerts",
  "/inspector",
  "/inspector-group",
  "/my-hajj-group",
  "/video-call",
];

function matchesSegment(path: string, prefix: string) {
  return path === prefix || path.startsWith(`${prefix}/`);
}

export function RouteFallbackSEO() {
  const { pathname } = useLocation();
  const path = pathname !== "/" && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
  const exact = PUBLIC_ROUTES.find((route) => route.path === path);
  const parent = PUBLIC_ROUTES
    .filter((route) => route.path !== "/" && path.startsWith(`${route.path}/`))
    .sort((a, b) => b.path.length - a.path.length)[0];
  const isPrivate = PRIVATE_PREFIXES.some((prefix) => matchesSegment(path, prefix));
  const known = Boolean(exact || parent);
  const noindex = isPrivate || !known;
  const title = exact?.title ?? parent?.title ?? (noindex ? "Page not found" : "HajCare");
  const description =
    exact?.description ??
    parent?.description ??
    "HajCare is a digital companion for Hajj and Umrah pilgrims.";

  return <SEO title={title} description={description} path={path} noindex={noindex} />;
}
