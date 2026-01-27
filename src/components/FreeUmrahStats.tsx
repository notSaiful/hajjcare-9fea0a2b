import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  FileCheck,
  TrendingUp
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface Applicant {
  id: string;
  status: string;
  role: string;
  state: string;
}

interface FreeUmrahStatsProps {
  applicants: Applicant[];
  language: string;
}

const content = {
  en: {
    total: "Total Applications",
    approved: "Approved",
    rejected: "Rejected",
    pending: "Pending Review",
    approvalRate: "Approval Rate",
    byRole: "By Role",
    byState: "Top States",
    noData: "No data available",
  },
  ar: {
    total: "إجمالي الطلبات",
    approved: "موافق عليها",
    rejected: "مرفوضة",
    pending: "قيد المراجعة",
    approvalRate: "نسبة الموافقة",
    byRole: "حسب الدور",
    byState: "أعلى الولايات",
    noData: "لا توجد بيانات",
  },
  ur: {
    total: "کل درخواستیں",
    approved: "منظور شدہ",
    rejected: "مسترد",
    pending: "زیر غور",
    approvalRate: "منظوری کی شرح",
    byRole: "کردار کے لحاظ سے",
    byState: "اعلیٰ ریاستیں",
    noData: "کوئی ڈیٹا نہیں",
  },
  hi: {
    total: "कुल आवेदन",
    approved: "स्वीकृत",
    rejected: "अस्वीकृत",
    pending: "समीक्षाधीन",
    approvalRate: "स्वीकृति दर",
    byRole: "भूमिका के अनुसार",
    byState: "शीर्ष राज्य",
    noData: "कोई डेटा नहीं",
  },
};

const COLORS = {
  approved: "hsl(var(--primary))",
  rejected: "hsl(var(--destructive))",
  pending: "hsl(var(--muted-foreground))",
  roles: [
    "hsl(142, 76%, 36%)",
    "hsl(221, 83%, 53%)",
    "hsl(262, 83%, 58%)",
    "hsl(24, 95%, 53%)",
  ],
};

export const FreeUmrahStats = ({ applicants, language }: FreeUmrahStatsProps) => {
  const t = content[language as keyof typeof content] || content.en;

  const stats = useMemo(() => {
    const total = applicants.length;
    const approved = applicants.filter((a) => a.status === "Approved").length;
    const rejected = applicants.filter((a) => a.status === "Rejected").length;
    const pending = applicants.filter(
      (a) => a.status === "Applied" || a.status === "Under Review"
    ).length;
    const approvalRate = total > 0 ? Math.round((approved / total) * 100) : 0;

    // Group by role
    const byRole = applicants.reduce((acc, a) => {
      acc[a.role] = (acc[a.role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const roleData = Object.entries(byRole)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    // Group by state (top 5)
    const byState = applicants.reduce((acc, a) => {
      acc[a.state] = (acc[a.state] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const stateData = Object.entries(byState)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    return { total, approved, rejected, pending, approvalRate, roleData, stateData };
  }, [applicants]);

  if (applicants.length === 0) {
    return null;
  }

  const statusData = [
    { name: t.approved, value: stats.approved, color: COLORS.approved },
    { name: t.rejected, value: stats.rejected, color: COLORS.rejected },
    { name: t.pending, value: stats.pending, color: COLORS.pending },
  ].filter((d) => d.value > 0);

  return (
    <div className="space-y-4">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">{t.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <CheckCircle2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.approved}</p>
                <p className="text-xs text-muted-foreground">{t.approved}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/10">
                <XCircle className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.rejected}</p>
                <p className="text-xs text-muted-foreground">{t.rejected}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted">
                <Clock className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-xs text-muted-foreground">{t.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Approval Rate */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              {t.approvalRate}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="text-3xl font-bold text-primary">
                  {stats.approvalRate}%
                </div>
                <Progress value={stats.approvalRate} className="mt-2 h-2" />
              </div>
              <div className="h-24 w-24">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={25}
                      outerRadius={40}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="flex gap-4 mt-3 text-xs">
              {statusData.map((item) => (
                <div key={item.name} className="flex items-center gap-1">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-muted-foreground">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* By Role */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileCheck className="w-4 h-4" />
              {t.byRole}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.roleData.length > 0 ? (
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.roleData}
                      cx="50%"
                      cy="50%"
                      outerRadius={50}
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      labelLine={false}
                    >
                      {stats.roleData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS.roles[index % COLORS.roles.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                {t.noData}
              </p>
            )}
          </CardContent>
        </Card>

        {/* By State */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="w-4 h-4" />
              {t.byState}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.stateData.length > 0 ? (
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.stateData} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={80}
                      tick={{ fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip />
                    <Bar
                      dataKey="value"
                      fill="hsl(var(--primary))"
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                {t.noData}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
