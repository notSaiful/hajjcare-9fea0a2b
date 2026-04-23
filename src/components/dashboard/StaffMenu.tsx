import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Users } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";
import { useLanguage } from "@/contexts/LanguageContext";
import { DashboardMenuItem } from "./DashboardMenuItem";
import type { MenuItem } from "./menuData";

/**
 * Role-gated menu shown only to staff (inspector / coordinator / admin / medical_staff).
 * Provides quick entry to the Inspector Dashboard where Sub-Group Management lives.
 */
export const StaffMenu = memo(function StaffMenu() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { isInspector, isAdmin, isCoordinator, isLoading } = useUserRole();

  const canSeeInspectorTools = isInspector || isAdmin || isCoordinator;

  const handleNavigate = useCallback(
    (route: string) => {
      if ("vibrate" in navigator) navigator.vibrate(10);
      navigate(route);
    },
    [navigate]
  );

  if (isLoading || !canSeeInspectorTools) return null;

  const items: MenuItem[] = [
    {
      id: "sub-group-management",
      icon: Users,
      label: {
        en: "Sub-Group Management",
        ar: "إدارة المجموعات الفرعية",
        ur: "ذیلی گروپ انتظام",
        hi: "उप-समूह प्रबंधन",
        ta: "துணை-குழு மேலாண்மை",
        te: "ఉప-సమూహ నిర్వహణ",
        mr: "उप-गट व्यवस्थापन",
        bn: "উপ-গ্রুপ পরিচালনা",
        or: "ଉପ-ଗୋଷ୍ଠୀ ପରିଚାଳନା",
        ml: "സബ്-ഗ്രൂപ്പ് മാനേജ്മെന്റ്",
        pa: "ਉਪ-ਗਰੁੱਪ ਪ੍ਰਬੰਧਨ",
      },
      route: "/inspector-dashboard",
      colorClass: "icon-emerald",
    },
    {
      id: "inspector-dashboard",
      icon: ShieldCheck,
      label: {
        en: "Inspector Dashboard",
        ar: "لوحة المفتش",
        ur: "انسپکٹر ڈیش بورڈ",
        hi: "इंस्पेक्टर डैशबोर्ड",
        ta: "ஆய்வாளர் டாஷ்போர்டு",
        te: "ఇన్‌స్పెక్టర్ డాష్‌బోర్డ్",
        mr: "इन्स्पेक्टर डॅशबोर्ड",
        bn: "ইন্সপেক্টর ড্যাশবোর্ড",
        or: "ଇନ୍ସପେକ୍ଟର ଡ୍ୟାସବୋର୍ଡ",
        ml: "ഇൻസ്പെക്ടർ ഡാഷ്ബോർഡ്",
        pa: "ਇੰਸਪੈਕਟਰ ਡੈਸ਼ਬੋਰਡ",
      },
      route: "/inspector-dashboard",
      colorClass: "icon-teal",
    },
  ];

  const sectionLabel: Record<string, string> = {
    en: "Staff Tools",
    ar: "أدوات الموظفين",
    ur: "اسٹاف ٹولز",
    hi: "स्टाफ टूल्स",
    ta: "ஊழியர் கருவிகள்",
    te: "సిబ్బంది సాధనాలు",
    mr: "कर्मचारी साधने",
    bn: "স্টাফ টুলস",
    or: "ଷ୍ଟାଫ ଟୁଲ୍ସ",
    ml: "സ്റ്റാഫ് ടൂളുകൾ",
    pa: "ਸਟਾਫ ਟੂਲਜ਼",
  };

  return (
    <section className="space-y-3 animate-fade-up" style={{ animationDelay: "100ms" }}>
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide px-1">
        {sectionLabel[language] || sectionLabel.en}
      </h3>
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {items.map((item) => (
          <DashboardMenuItem
            key={item.id}
            item={item}
            language={language}
            onNavigate={handleNavigate}
          />
        ))}
      </div>
    </section>
  );
});

export default StaffMenu;
