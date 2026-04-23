import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Users, LayoutDashboard } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";
import { useAuthContext } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { DashboardMenuItem } from "./DashboardMenuItem";
import type { MenuItem } from "./menuData";

/**
 * Role-gated menu shown only to authorised staff (admin / coordinator / inspector / SHI).
 *
 * - Hidden completely for guests and non-staff users.
 * - On click, re-validates the role before navigating (defence-in-depth, since
 *   roles can change between render and click).
 * - Routes use the actual paths registered in App.tsx:
 *     • Sub-Group Management → /inspector-group  (InspectorGroupManagePage)
 *     • Inspector Dashboard  → /inspector        (InspectorDashboardPage)
 *     • Admin Control Panel  → /admin/panel      (admins only)
 */
export const StaffMenu = memo(function StaffMenu() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { toast } = useToast();
  const { isAuthenticated } = useAuthContext();
  const { isInspector, isAdmin, isCoordinator, isLoading } = useUserRole();

  const canSeeInspectorTools = isAuthenticated && (isInspector || isAdmin || isCoordinator);

  const unauthorisedCopy: Record<string, { title: string; desc: string }> = {
    en: { title: "Access denied", desc: "Inspector, Coordinator, or Admin role required." },
    hi: { title: "पहुँच अस्वीकृत", desc: "इंस्पेक्टर, समन्वयक या व्यवस्थापक भूमिका आवश्यक।" },
    ur: { title: "رسائی مسترد", desc: "انسپکٹر، کوآرڈینیٹر یا ایڈمن کردار ضروری ہے۔" },
    ar: { title: "تم رفض الوصول", desc: "مطلوب دور المفتش أو المنسق أو المسؤول." },
  };

  const handleNavigate = useCallback(
    (route: string, requireAdmin = false) => {
      // Re-check authorisation at click time
      if (!isAuthenticated || !(isInspector || isAdmin || isCoordinator)) {
        const c = unauthorisedCopy[language] || unauthorisedCopy.en;
        toast({ title: c.title, description: c.desc, variant: "destructive" });
        return;
      }
      if (requireAdmin && !isAdmin) {
        const c = unauthorisedCopy[language] || unauthorisedCopy.en;
        toast({ title: c.title, description: "Admin role required.", variant: "destructive" });
        return;
      }
      if ("vibrate" in navigator) navigator.vibrate(10);
      navigate(route);
    },
    [navigate, isAuthenticated, isInspector, isAdmin, isCoordinator, language, toast]
  );

  if (isLoading || !canSeeInspectorTools) return null;

  const items: Array<MenuItem & { adminOnly?: boolean }> = [
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
      route: "/inspector-group",
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
      route: "/inspector",
      colorClass: "icon-teal",
    },
    ...(isAdmin
      ? [
          {
            id: "admin-control-panel",
            icon: LayoutDashboard,
            label: {
              en: "Admin Control Panel",
              ar: "لوحة تحكم المسؤول",
              ur: "ایڈمن کنٹرول پینل",
              hi: "व्यवस्थापक नियंत्रण पैनल",
              ta: "நிர்வாக கட்டுப்பாட்டு பலகை",
              te: "నిర్వాహక నియంత్రణ ప్యానెల్",
              mr: "प्रशासक नियंत्रण पॅनेल",
              bn: "অ্যাডমিন কন্ট্রোল প্যানেল",
              or: "ଆଡମିନ କଣ୍ଟ୍ରୋଲ ପ୍ୟାନେଲ",
              ml: "അഡ്മിൻ കൺട്രോൾ പാനൽ",
              pa: "ਐਡਮਿਨ ਕੰਟਰੋਲ ਪੈਨਲ",
            },
            route: "/admin/panel",
            colorClass: "icon-plum",
            adminOnly: true,
          } as MenuItem & { adminOnly: boolean },
        ]
      : []),
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
