import { useMemo, useState } from "react";
import {
  Activity,
  Bell,
  BookOpen,
  Braces,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Cloud,
  Code2,
  Database,
  FunctionSquare,
  Menu,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Table2,
  Users,
  X,
} from "lucide-react";

type NavItem = {
  label: string;
  icon: typeof Table2;
  badge?: string;
};

const navigation: NavItem[] = [
  { label: "Table Editor", icon: Table2 },
  { label: "Database", icon: Database },
  { label: "Authentication", icon: ShieldCheck },
  { label: "Edge Functions", icon: FunctionSquare, badge: "3" },
  { label: "Storage", icon: Cloud },
  { label: "API Docs", icon: Braces },
];

const stats = [
  { label: "Database size", value: "1.8 GB", trend: "+12.5%", detail: "of 8 GB included", dotClass: "bg-emerald-400" },
  { label: "API requests", value: "128.4K", trend: "+18.2%", detail: "in the last 30 days", dotClass: "bg-sky-400" },
  { label: "Active users", value: "3,842", trend: "+8.4%", detail: "across all environments", dotClass: "bg-violet-400" },
  { label: "Function invocations", value: "76.9K", trend: "+24.1%", detail: "in the last 30 days", dotClass: "bg-amber-400" },
];

const chartPoints = [18, 26, 23, 38, 31, 47, 43, 59, 49, 68, 58, 77, 72, 84];

function buildLinePath(points: number[]) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  return points
    .map((point, index) => {
      const x = (index / (points.length - 1)) * 100;
      const y = 94 - ((point - min) / (max - min)) * 78;
      return `${index === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
}

/**
 * A standalone, presentational Supabase-inspired admin overview.
 * It is intentionally data-source agnostic: replace the local mock arrays with
 * your Supabase queries without changing the responsive layout.
 */
export default function SupabaseStyleAdminDashboard() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [activeNav, setActiveNav] = useState("Table Editor");
  const linePath = useMemo(() => buildLinePath(chartPoints), []);

  const sidebarContent = (
    <>
      <div className="flex h-16 items-center gap-3 border-b border-white/10 px-4">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-400 text-zinc-950 shadow-[0_0_24px_rgba(52,211,153,0.35)]">
          <Sparkles className="h-4 w-4" strokeWidth={2.8} />
        </div>
        {!collapsed && <span className="text-sm font-semibold tracking-tight text-white">HajCare Cloud</span>}
        <button
          type="button"
          onClick={() => setCollapsed((value) => !value)}
          className="ml-auto hidden rounded-md p-1.5 text-zinc-500 transition hover:bg-white/5 hover:text-white lg:block"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
        <button type="button" onClick={() => setMobileNavOpen(false)} className="ml-auto rounded-md p-1.5 text-zinc-400 lg:hidden" aria-label="Close navigation">
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label="Project navigation">
        {!collapsed && <p className="px-2 pb-2 pt-3 text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-600">Platform</p>}
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = activeNav === item.label;
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => { setActiveNav(item.label); setMobileNavOpen(false); }}
              className={`group flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-sm transition ${
                isActive ? "bg-emerald-400/10 text-emerald-300" : "text-zinc-400 hover:bg-white/5 hover:text-zinc-100"
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span className="min-w-0 flex-1 truncate">{item.label}</span>}
              {!collapsed && item.badge && <span className="rounded-full bg-emerald-400/15 px-1.5 py-0.5 text-[10px] font-bold text-emerald-300">{item.badge}</span>}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-3">
        <button type="button" className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-sm text-zinc-400 transition hover:bg-white/5 hover:text-white" title={collapsed ? "Project Settings" : undefined}>
          <Settings className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Project Settings</span>}
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#181818] text-zinc-100">
      {mobileNavOpen && <button type="button" className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={() => setMobileNavOpen(false)} aria-label="Close navigation overlay" />}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-72 -translate-x-full flex-col border-r border-white/10 bg-[#1c1c1c] transition-transform lg:translate-x-0 ${collapsed ? "lg:w-[72px]" : "lg:w-64"} ${mobileNavOpen ? "translate-x-0" : ""}`}>
        {sidebarContent}
      </aside>

      <main className={`min-h-screen transition-[padding] ${collapsed ? "lg:pl-[72px]" : "lg:pl-64"}`}>
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-white/10 bg-[#181818]/90 px-4 backdrop-blur lg:px-8">
          <button type="button" onClick={() => setMobileNavOpen(true)} className="rounded-lg p-2 text-zinc-400 hover:bg-white/5 lg:hidden" aria-label="Open navigation">
            <Menu className="h-5 w-5" />
          </button>
          <button type="button" className="hidden items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm font-medium text-zinc-200 transition hover:bg-white/[0.06] sm:flex">
            hajcare-production <ChevronDown className="h-3.5 w-3.5 text-zinc-500" />
          </button>
          <span className="hidden rounded-full bg-emerald-400/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-300 md:inline-flex">Production</span>
          <div className="relative ml-auto hidden max-w-md flex-1 md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input className="h-9 w-full rounded-lg border border-white/10 bg-white/[0.03] pl-9 pr-12 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-emerald-400/50" placeholder="Search your project..." />
            <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded border border-white/10 px-1.5 py-0.5 text-[10px] text-zinc-600">⌘ K</kbd>
          </div>
          <a href="#docs" className="hidden items-center gap-1.5 text-sm text-zinc-400 transition hover:text-white sm:flex"><BookOpen className="h-4 w-4" /> Docs</a>
          <button type="button" className="relative rounded-lg p-2 text-zinc-400 transition hover:bg-white/5 hover:text-white" aria-label="Notifications"><Bell className="h-4 w-4" /><span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400" /></button>
          <button type="button" className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-emerald-300 to-teal-600 text-xs font-bold text-zinc-950" aria-label="Open account menu">SK</button>
        </header>

        <div className="mx-auto max-w-7xl space-y-7 px-4 py-7 sm:px-6 lg:px-8">
          <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">Project overview</p>
              <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">Good morning, Saiful</h1>
              <p className="mt-2 text-sm text-zinc-500">Your project is healthy and all services are operational.</p>
            </div>
            <button type="button" className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-400 px-4 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-[#181818]"><Plus className="h-4 w-4" /> New project item</button>
          </section>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <article key={stat.label} className="rounded-xl border border-white/10 bg-[#202020] p-5 shadow-sm">
                <div className="flex items-start justify-between"><p className="text-sm text-zinc-400">{stat.label}</p><span className={`h-2 w-2 rounded-full ${stat.dotClass} shadow-[0_0_10px_currentColor]`} /></div>
                <p className="mt-5 text-2xl font-semibold tracking-tight text-white">{stat.value}</p>
                <p className="mt-2 text-xs text-zinc-500"><span className="font-medium text-emerald-400">{stat.trend}</span> {stat.detail}</p>
              </article>
            ))}
          </section>

          <section className="grid gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(280px,0.8fr)]">
            <article className="rounded-xl border border-white/10 bg-[#202020] p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="font-semibold text-white">API traffic</h2><p className="mt-1 text-sm text-zinc-500">Requests processed across your production project</p></div><button type="button" className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-white/5">Last 14 days <ChevronDown className="ml-1 inline h-3 w-3" /></button></div>
              <div className="mt-7 h-56"><svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full overflow-visible" role="img" aria-label="API traffic trend chart"><defs><linearGradient id="traffic-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#34d399" stopOpacity="0.3" /><stop offset="100%" stopColor="#34d399" stopOpacity="0" /></linearGradient></defs>{[20, 40, 60, 80].map((line) => <line key={line} x1="0" x2="100" y1={line} y2={line} stroke="rgba(255,255,255,0.08)" strokeWidth="0.4" />)}<path d={`${linePath} L100,100 L0,100 Z`} fill="url(#traffic-fill)" /><path d={linePath} fill="none" stroke="#34d399" strokeWidth="1.2" vectorEffect="non-scaling-stroke" /></svg></div>
              <div className="flex justify-between text-[11px] text-zinc-600"><span>Jul 26</span><span>Jul 29</span><span>Aug 01</span><span>Aug 04</span><span>Today</span></div>
            </article>
            <article className="rounded-xl border border-white/10 bg-[#202020] p-5 sm:p-6"><div className="flex items-center justify-between"><div><h2 className="font-semibold text-white">System status</h2><p className="mt-1 text-sm text-zinc-500">All services are operational</p></div><Activity className="h-5 w-5 text-emerald-400" /></div><div className="mt-7 space-y-4">{["Database", "Authentication", "Edge Functions", "Storage"].map((service) => <div key={service} className="flex items-center justify-between border-b border-white/5 pb-3 last:border-0"><span className="text-sm text-zinc-300">{service}</span><span className="inline-flex items-center gap-1.5 text-xs text-emerald-400"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />Operational</span></div>)}</div><a href="#status" className="mt-3 inline-flex text-sm font-medium text-emerald-400 hover:text-emerald-300">View status page <ChevronRight className="ml-1 h-4 w-4" /></a></article>
          </section>

          <section className="grid gap-4 md:grid-cols-3"><QuickAction icon={Table2} title="Create a new table" description="Start modeling your application data." /><QuickAction icon={Users} title="Invite members" description="Collaborate with your project team." /><QuickAction icon={Code2} title="View API docs" description="Connect your app in minutes." /></section>
          <footer className="flex items-center gap-2 border-t border-white/10 pt-5 text-xs text-zinc-600"><CircleHelp className="h-3.5 w-3.5" /> Need help? <a href="#support" className="text-zinc-400 hover:text-emerald-400">Contact support</a></footer>
        </div>
      </main>
    </div>
  );
}

function QuickAction({ icon: Icon, title, description }: { icon: typeof Table2; title: string; description: string }) {
  return <button type="button" className="group flex items-start gap-4 rounded-xl border border-white/10 bg-[#202020] p-5 text-left transition hover:border-emerald-400/30 hover:bg-[#242424]"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-emerald-400/10 text-emerald-400 transition group-hover:bg-emerald-400 group-hover:text-zinc-950"><Icon className="h-5 w-5" /></span><span><span className="block text-sm font-semibold text-zinc-100">{title}</span><span className="mt-1 block text-sm leading-5 text-zinc-500">{description}</span></span></button>;
}
