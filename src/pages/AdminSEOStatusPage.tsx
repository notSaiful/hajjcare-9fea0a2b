import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useUserRole } from "@/hooks/useUserRole";
import { CheckCircle2, XCircle, AlertCircle, RefreshCw, ExternalLink, Loader2 } from "lucide-react";

const SITE_URL = "https://hajjcare.in";

interface CheckResult {
  label: string;
  status: "pass" | "fail" | "warn" | "pending";
  detail?: string;
}

interface FetchedResource {
  url: string;
  ok: boolean;
  status: number;
  contentType?: string;
  bytes?: number;
  preview?: string;
  error?: string;
}

async function fetchResource(path: string): Promise<FetchedResource> {
  const url = `${path}`;
  try {
    const res = await fetch(url, { cache: "no-store" });
    const text = await res.text();
    return {
      url,
      ok: res.ok,
      status: res.status,
      contentType: res.headers.get("content-type") ?? undefined,
      bytes: text.length,
      preview: text.slice(0, 2000),
    };
  } catch (e) {
    return { url, ok: false, status: 0, error: e instanceof Error ? e.message : String(e) };
  }
}

function StatusBadge({ status }: { status: CheckResult["status"] }) {
  if (status === "pass") return <Badge className="bg-emerald-600 hover:bg-emerald-600">Pass</Badge>;
  if (status === "fail") return <Badge variant="destructive">Fail</Badge>;
  if (status === "warn") return <Badge className="bg-amber-500 hover:bg-amber-500">Warn</Badge>;
  return <Badge variant="secondary">Pending</Badge>;
}

function StatusIcon({ status }: { status: CheckResult["status"] }) {
  if (status === "pass") return <CheckCircle2 className="h-5 w-5 text-emerald-600" />;
  if (status === "fail") return <XCircle className="h-5 w-5 text-destructive" />;
  if (status === "warn") return <AlertCircle className="h-5 w-5 text-amber-500" />;
  return <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />;
}

export default function AdminSEOStatusPage() {
  const { isAdmin, isLoading: rolesLoading } = useUserRole();
  const [loading, setLoading] = useState(false);
  const [sitemap, setSitemap] = useState<FetchedResource | null>(null);
  const [robots, setRobots] = useState<FetchedResource | null>(null);
  const [llms, setLlms] = useState<FetchedResource | null>(null);
  const [indexHtml, setIndexHtml] = useState<FetchedResource | null>(null);
  const [lastRun, setLastRun] = useState<string | null>(null);

  const runChecks = async () => {
    setLoading(true);
    const [s, r, l, h] = await Promise.all([
      fetchResource("/sitemap.xml"),
      fetchResource("/robots.txt"),
      fetchResource("/llms.txt"),
      fetchResource("/index.html"),
    ]);
    setSitemap(s);
    setRobots(r);
    setLlms(l);
    setIndexHtml(h);
    const stamp = new Date().toISOString();
    setLastRun(stamp);
    try {
      localStorage.setItem("seo:last-status-run", stamp);
    } catch {
      /* ignore */
    }
    setLoading(false);
  };

  useEffect(() => {
    try {
      const prev = localStorage.getItem("seo:last-status-run");
      if (prev) setLastRun(prev);
    } catch {
      /* ignore */
    }
    runChecks();
  }, []);

  // Derived checks
  const sitemapUrls = (() => {
    if (!sitemap?.preview) return [];
    const matches = sitemap.preview.matchAll(/<loc>([^<]+)<\/loc>/g);
    return Array.from(matches, (m) => m[1]);
  })();

  const robotsHasSitemap = !!robots?.preview?.toLowerCase().includes("sitemap:");
  const robotsBlocksAll = !!robots?.preview?.match(/User-agent:\s*\*[\s\S]*?Disallow:\s*\//i);

  const metaChecks: CheckResult[] = (() => {
    if (!indexHtml?.preview) return [];
    const html = indexHtml.preview;
    const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
    const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i);
    const canonicalMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']*)["']/i);
    const ogTitle = /<meta\s+property=["']og:title["']/i.test(html);
    const ogDesc = /<meta\s+property=["']og:description["']/i.test(html);
    const ogUrl = /<meta\s+property=["']og:url["']/i.test(html);
    const ogType = /<meta\s+property=["']og:type["']/i.test(html);
    const jsonLd = /<script[^>]+application\/ld\+json/i.test(html);
    const viewport = /<meta\s+name=["']viewport["']/i.test(html);

    const title = titleMatch?.[1] ?? "";
    const desc = descMatch?.[1] ?? "";
    return [
      {
        label: "<title>",
        status: title && title.length <= 60 && !/lovable/i.test(title) ? "pass" : title ? "warn" : "fail",
        detail: title ? `"${title}" (${title.length} chars)` : "missing",
      },
      {
        label: "meta description",
        status: desc && desc.length <= 160 && !/lovable/i.test(desc) ? "pass" : desc ? "warn" : "fail",
        detail: desc ? `"${desc}" (${desc.length} chars)` : "missing",
      },
      {
        label: "canonical link",
        status: canonicalMatch ? "pass" : "warn",
        detail: canonicalMatch?.[1] ?? "missing (per-route Helmet may provide it)",
      },
      { label: "og:title", status: ogTitle ? "pass" : "fail" },
      { label: "og:description", status: ogDesc ? "pass" : "fail" },
      { label: "og:url", status: ogUrl ? "pass" : "fail" },
      { label: "og:type", status: ogType ? "pass" : "fail" },
      { label: "JSON-LD structured data", status: jsonLd ? "pass" : "fail" },
      { label: "viewport meta", status: viewport ? "pass" : "fail" },
    ];
  })();

  if (rolesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Admins only</AlertTitle>
          <AlertDescription>You do not have permission to view this page.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>SEO Status — Internal</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-background p-6 md:p-10">
        <div className="max-w-6xl mx-auto space-y-6">
          <header className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">SEO Status</h1>
              <p className="text-muted-foreground mt-1">
                Internal dashboard for sitemap, robots, metadata, and Lighthouse verification.
              </p>
              {lastRun && (
                <p className="text-xs text-muted-foreground mt-2">
                  Last checked: {new Date(lastRun).toLocaleString()}
                </p>
              )}
            </div>
            <Button onClick={runChecks} disabled={loading} className="gap-2">
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Re-run checks
            </Button>
          </header>

          {/* Summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <SummaryCard
              title="Sitemap"
              status={sitemap?.ok ? "pass" : sitemap === null ? "pending" : "fail"}
              detail={sitemap ? `${sitemap.status} · ${sitemapUrls.length} URLs` : "…"}
            />
            <SummaryCard
              title="robots.txt"
              status={
                robots?.ok && robotsHasSitemap && !robotsBlocksAll ? "pass" : robots?.ok ? "warn" : "fail"
              }
              detail={robots ? (robotsBlocksAll ? "blocks all crawlers" : robotsHasSitemap ? "ok" : "no Sitemap:") : "…"}
            />
            <SummaryCard
              title="llms.txt"
              status={llms?.ok ? "pass" : "warn"}
              detail={llms?.ok ? "present" : "missing (optional)"}
            />
            <SummaryCard
              title="Metadata"
              status={
                metaChecks.length === 0
                  ? "pending"
                  : metaChecks.some((c) => c.status === "fail")
                    ? "fail"
                    : metaChecks.some((c) => c.status === "warn")
                      ? "warn"
                      : "pass"
              }
              detail={`${metaChecks.filter((c) => c.status === "pass").length}/${metaChecks.length} checks pass`}
            />
          </div>

          <Tabs defaultValue="sitemap">
            <TabsList>
              <TabsTrigger value="sitemap">Sitemap</TabsTrigger>
              <TabsTrigger value="robots">Robots</TabsTrigger>
              <TabsTrigger value="metadata">Metadata</TabsTrigger>
              <TabsTrigger value="lighthouse">Lighthouse</TabsTrigger>
              <TabsTrigger value="raw">Raw</TabsTrigger>
            </TabsList>

            <TabsContent value="sitemap" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <StatusIcon status={sitemap?.ok ? "pass" : "fail"} />
                    /sitemap.xml
                  </CardTitle>
                  <CardDescription>
                    {sitemap ? `${sitemap.status} · ${sitemap.contentType ?? "?"} · ${sitemap.bytes ?? 0} bytes` : "Loading…"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {sitemapUrls.length > 0 ? (
                    <div className="max-h-96 overflow-auto border rounded-md">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-12">#</TableHead>
                            <TableHead>URL</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {sitemapUrls.map((u, i) => (
                            <TableRow key={u}>
                              <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                              <TableCell>
                                <a
                                  href={u}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline inline-flex items-center gap-1"
                                >
                                  {u} <ExternalLink className="h-3 w-3" />
                                </a>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">No URLs parsed.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="robots" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <StatusIcon status={robots?.ok ? "pass" : "fail"} />
                    /robots.txt
                  </CardTitle>
                  <CardDescription>
                    {robots ? `${robots.status} · ${robots.bytes ?? 0} bytes` : "Loading…"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant={robotsHasSitemap ? "default" : "destructive"}>
                      Sitemap directive: {robotsHasSitemap ? "yes" : "missing"}
                    </Badge>
                    <Badge variant={robotsBlocksAll ? "destructive" : "secondary"}>
                      Wildcard disallow: {robotsBlocksAll ? "yes (blocks all)" : "no"}
                    </Badge>
                  </div>
                  <pre className="text-xs bg-muted p-3 rounded-md overflow-auto max-h-96 whitespace-pre-wrap">
                    {robots?.preview ?? "(empty)"}
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="metadata" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>index.html head tags</CardTitle>
                  <CardDescription>
                    Static fallback metadata served to non-JS social crawlers. Per-route values come from
                    <code className="mx-1 text-xs bg-muted px-1 rounded">react-helmet-async</code>.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-32">Status</TableHead>
                        <TableHead className="w-48">Tag</TableHead>
                        <TableHead>Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {metaChecks.map((c) => (
                        <TableRow key={c.label}>
                          <TableCell>
                            <StatusBadge status={c.status} />
                          </TableCell>
                          <TableCell className="font-mono text-xs">{c.label}</TableCell>
                          <TableCell className="text-sm text-muted-foreground break-all">
                            {c.detail ?? "—"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="lighthouse" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Lighthouse & verification</CardTitle>
                  <CardDescription>
                    Run audits against the published site. Results are not stored — open the linked tools.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ExternalCheckLink
                    label="PageSpeed Insights (Lighthouse)"
                    href={`https://pagespeed.web.dev/analysis?url=${encodeURIComponent(SITE_URL)}`}
                  />
                  <ExternalCheckLink
                    label="Google Rich Results Test"
                    href={`https://search.google.com/test/rich-results?url=${encodeURIComponent(SITE_URL)}`}
                  />
                  <ExternalCheckLink
                    label="Mobile-Friendly Test"
                    href={`https://search.google.com/test/mobile-friendly?url=${encodeURIComponent(SITE_URL)}`}
                  />
                  <ExternalCheckLink
                    label="Google Search Console"
                    href="https://search.google.com/search-console"
                  />
                  <ExternalCheckLink
                    label="Bing Webmaster Tools"
                    href="https://www.bing.com/webmasters"
                  />
                  <ExternalCheckLink
                    label="OpenGraph debugger"
                    href={`https://www.opengraph.xyz/url/${encodeURIComponent(SITE_URL)}`}
                  />
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Verification tip</AlertTitle>
                    <AlertDescription>
                      After publishing changes, re-run PageSpeed Insights and trigger an SEO rescan from the
                      project dashboard to refresh stored findings.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="raw">
              <Card>
                <CardHeader>
                  <CardTitle>Raw responses</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { name: "sitemap.xml", r: sitemap },
                    { name: "robots.txt", r: robots },
                    { name: "llms.txt", r: llms },
                  ].map(({ name, r }) => (
                    <div key={name}>
                      <h3 className="font-mono text-sm mb-2">
                        {name} — {r ? `${r.status}` : "…"}
                      </h3>
                      <pre className="text-xs bg-muted p-3 rounded-md overflow-auto max-h-64 whitespace-pre-wrap">
                        {r?.preview ?? r?.error ?? "(loading)"}
                      </pre>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}

function SummaryCard({
  title,
  status,
  detail,
}: {
  title: string;
  status: CheckResult["status"];
  detail: string;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{title}</CardDescription>
        <CardTitle className="flex items-center gap-2 text-lg">
          <StatusIcon status={status} />
          <StatusBadge status={status} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{detail}</p>
      </CardContent>
    </Card>
  );
}

function ExternalCheckLink({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between border rounded-lg p-3 hover:bg-muted/50 transition-colors"
    >
      <span className="font-medium">{label}</span>
      <ExternalLink className="h-4 w-4 text-muted-foreground" />
    </a>
  );
}
