import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { sukoonRdContent } from "@/data/sukoonRdContent";
import { MainLayout } from "@/components/MainLayout";
import { PageHeader } from "@/components/PageHeader";
import { ShieldCheck, BookOpen, Calculator, FileText, Users, AlertTriangle } from "lucide-react";
import FraudAwareness from "@/components/sukoon-rd/FraudAwareness";
import RdCalculator from "@/components/sukoon-rd/RdCalculator";
import SbiRdGuide from "@/components/sukoon-rd/SbiRdGuide";
import OperatorDirectory from "@/components/sukoon-rd/OperatorDirectory";
import FraudAlertsFeed from "@/components/sukoon-rd/FraudAlertsFeed";

type Tab = "education" | "calculator" | "sbiGuide" | "operators" | "alerts";

const tabs: { id: Tab; icon: typeof BookOpen; labelKey: keyof typeof sukoonRdContent.nav }[] = [
  { id: "education", icon: BookOpen, labelKey: "education" },
  { id: "calculator", icon: Calculator, labelKey: "calculator" },
  { id: "sbiGuide", icon: FileText, labelKey: "sbiGuide" },
  { id: "operators", icon: Users, labelKey: "operators" },
  { id: "alerts", icon: AlertTriangle, labelKey: "alerts" },
];

export default function SukoonRdPage() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<Tab>("education");
  const t = sukoonRdContent;

  const getLabel = (obj: Record<string, string>) => obj[language] || obj.en;

  return (
    <MainLayout>
      <div className="min-h-screen bg-background pb-24">
        <PageHeader
          icon={ShieldCheck}
          title={getLabel(t.title)}
          subtitle={getLabel(t.subtitle)}
          backLink="/"
        />

        {/* Tab Navigation */}
        <div className="px-4 mt-4">
          <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-muted text-muted-foreground hover:bg-accent"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {getLabel(t.nav[tab.labelKey])}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="px-4 mt-4">
          {activeTab === "education" && <FraudAwareness />}
          {activeTab === "calculator" && <RdCalculator />}
          {activeTab === "sbiGuide" && <SbiRdGuide />}
          {activeTab === "operators" && <OperatorDirectory />}
          {activeTab === "alerts" && <FraudAlertsFeed />}
        </div>
      </div>
    </MainLayout>
  );
}
