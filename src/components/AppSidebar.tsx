import { useState } from "react";
import { useLocation } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUserRole } from "@/hooks/useUserRole";
import {
  BookOpen,
  Compass,
  Building2,
  MapPin,
  ChevronDown,
  ChevronRight,
  Users,
  Map,
  Home,
  BookMarked,
  FileText,
  Heart,
  Wallet,
  Smartphone,
  MessageSquareWarning,
  Phone,
  Shield,
  Activity,
  Crown,
  AlertTriangle,
  BarChart3,
  Gift,
  Route,
  Sparkles,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import logo from "@/assets/logo.jpeg";

const labels = {
  guides: {
    en: "Guides",
    ar: "الأدلة",
    ur: "گائیڈز",
    hi: "गाइड",
    tr: "Rehberler",
    ru: "Руководства",
  },
  hajjGuide: {
    en: "Hajj",
    ar: "الحج",
    ur: "حج",
    hi: "हज",
    tr: "Hac",
    ru: "Хадж",
  },
  umrahGuide: {
    en: "Umrah",
    ar: "العمرة",
    ur: "عمرہ",
    hi: "उमरा",
    tr: "Umre",
    ru: "Умра",
  },
  preparationGuide: {
    en: "Preparation Guide",
    ar: "دليل التحضير",
    ur: "تیاری گائیڈ",
    hi: "तैयारी गाइड",
    tr: "Hazırlık Rehberi",
    ru: "Руководство по подготовке",
  },
  duaGuide: {
    en: "Dua",
    ar: "الدعاء",
    ur: "دعا",
    hi: "दुआ",
    tr: "Dua",
    ru: "Дуа",
  },
  rulesRegulations: {
    en: "Rules & Awareness",
    ar: "القواعد والتوعية",
    ur: "قواعد و آگاہی",
    hi: "नियम और जागरूकता",
    tr: "Kurallar ve Farkındalık",
    ru: "Правила и осведомленность",
  },
  healthGuide: {
    en: "Health",
    ar: "الصحة",
    ur: "صحت",
    hi: "स्वास्थ्य",
    tr: "Sağlık",
    ru: "Здоровье",
  },
  moneyManagement: {
    en: "Money Management",
    ar: "إدارة المال",
    ur: "مالی انتظام",
    hi: "धन प्रबंधन",
    tr: "Para Yönetimi",
    ru: "Управление деньгами",
  },
  telecomGuide: {
    en: "Telecom Guide",
    ar: "دليل الاتصالات",
    ur: "ٹیلی کام گائیڈ",
    hi: "टेलीकॉम गाइड",
    tr: "Telekom Rehberi",
    ru: "Телеком руководство",
  },
  familyGuide: {
    en: "Family",
    ar: "العائلة",
    ur: "فیملی",
    hi: "परिवार",
    tr: "Aile",
    ru: "Семья",
  },
  hajjProgress: {
    en: "Hajj Progress",
    ar: "تقدم الحج",
    ur: "حج پیشرفت",
    hi: "हज प्रगति",
    tr: "Hac İlerlemesi",
    ru: "Прогресс хаджа",
  },
  grievances: {
    en: "Grievances",
    ar: "الشكاوى",
    ur: "شکایات",
    hi: "शिकायतें",
    tr: "Şikayetler",
    ru: "Жалобы",
  },
  contactNumbers: {
    en: "Contact Numbers",
    ar: "أرقام الاتصال",
    ur: "رابطہ نمبر",
    hi: "संपर्क नंबर",
    tr: "İletişim Numaraları",
    ru: "Контактные номера",
  },
  navigation: {
    en: "Navigation",
    ar: "التنقل",
    ur: "نیویگیشن",
    hi: "नेविगेशन",
    tr: "Gezinme",
    ru: "Навигация",
  },
  home: {
    en: "Home",
    ar: "الرئيسية",
    ur: "ہوم",
    hi: "होम",
    tr: "Ana Sayfa",
    ru: "Главная",
  },
  map: {
    en: "Map",
    ar: "الخريطة",
    ur: "نقشہ",
    hi: "नक्शा",
    tr: "Harita",
    ru: "Карта",
  },
  makkahGuide: {
    en: "Makkah Etiquette",
    ar: "آداب مكة",
    ur: "مکہ آداب",
    hi: "मक्का शिष्टाचार",
    tr: "Mekke Adabı",
    ru: "Этикет Мекки",
  },
  madinahGuide: {
    en: "Madinah Etiquette",
    ar: "آداب المدينة",
    ur: "مدینہ آداب",
    hi: "मदीना शिष्टाचार",
    tr: "Medine Adabı",
    ru: "Этикет Медины",
  },
  admin: {
    en: "Admin",
    ar: "الإدارة",
    ur: "ایڈمن",
    hi: "एडमिन",
    tr: "Yönetici",
    ru: "Админ",
  },
  controlPanel: {
    en: "Control Panel",
    ar: "لوحة التحكم",
    ur: "کنٹرول پینل",
    hi: "कंट्रोल पैनल",
    tr: "Kontrol Paneli",
    ru: "Панель управления",
  },
  coordinatorDashboard: {
    en: "Health Tickets",
    ar: "تذاكر الصحة",
    ur: "صحت ٹکٹس",
    hi: "हेल्थ टिकट",
    tr: "Sağlık Biletleri",
    ru: "Заявки здоровья",
  },
  roleManagement: {
    en: "Role Management",
    ar: "إدارة الأدوار",
    ur: "کردار انتظام",
    hi: "भूमिका प्रबंधन",
    tr: "Rol Yönetimi",
    ru: "Управление ролями",
  },
  medicalAlerts: {
    en: "Emergency Alerts",
    ar: "تنبيهات الطوارئ",
    ur: "ایمرجنسی الرٹس",
    hi: "आपातकालीन अलर्ट",
    tr: "Acil Uyarılar",
    ru: "Экстренные оповещения",
  },
  emergencyMetrics: {
    en: "Response Metrics",
    ar: "مقاييس الاستجابة",
    ur: "ردعمل کے میٹرکس",
    hi: "प्रतिक्रिया मेट्रिक्स",
    tr: "Yanıt Metrikleri",
    ru: "Метрики отклика",
  },
  freeUmrahAdmin: {
    en: "Free Umrah Applications",
    ar: "طلبات العمرة المجانية",
    ur: "مفت عمرہ درخواستیں",
    hi: "मुफ्त उमराह आवेदन",
    tr: "Ücretsiz Umre Başvuruları",
    ru: "Заявки на бесплатную умру",
  },
};

export function AppSidebar() {
  const { language, isRTL } = useLanguage();
  const { hasAnyCoordinatorRole, isAdmin } = useUserRole();
  const location = useLocation();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const adminRoutes = ["/admin/panel", "/coordinator", "/admin/roles", "/medical-alerts", "/admin/metrics", "/admin/free-umrah", "/admin/sukoon-metrics", "/admin/volunteers"];
  
  const guideRoutes = [
    "/prepare",
    "/umrah",
    "/preparation",
    "/dua",
    "/rules",
    "/health",
    "/money",
    "/telecom",
    "/family",
    "/hajj-progress",
    "/grievances",
    "/contacts",
    "/makkah-guide",
    "/madinah-guide",
  ];

  const isGuidesActive = guideRoutes.some((route) =>
    location.pathname.startsWith(route)
  );
  
  const isAdminActive = adminRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  const [guidesOpen, setGuidesOpen] = useState(isGuidesActive);
  const [adminOpen, setAdminOpen] = useState(isAdminActive);

  const adminItems = [
    {
      title: labels.controlPanel[language] || labels.controlPanel.en,
      url: "/admin/panel",
      icon: Shield,
    },
    {
      title: labels.medicalAlerts[language] || labels.medicalAlerts.en,
      url: "/medical-alerts",
      icon: AlertTriangle,
    },
    {
      title: labels.coordinatorDashboard[language] || labels.coordinatorDashboard.en,
      url: "/coordinator",
      icon: Activity,
    },
    ...(isAdmin ? [
      {
        title: labels.freeUmrahAdmin[language] || labels.freeUmrahAdmin.en,
        url: "/admin/free-umrah",
        icon: Gift,
      },
      {
        title: labels.roleManagement[language] || labels.roleManagement.en,
        url: "/admin/roles",
        icon: Crown,
      },
      {
        title: labels.emergencyMetrics[language] || labels.emergencyMetrics.en,
        url: "/admin/metrics",
        icon: BarChart3,
      },
      {
        title: language === "hi" ? "सुकून मेट्रिक्स" : "Sukoon Metrics",
        url: "/admin/sukoon-metrics",
        icon: Route,
      },
      {
        title: language === "hi" ? "वालंटियर प्रबंधन" : "Volunteer Management",
        url: "/admin/volunteers",
        icon: Users,
      },
    ] : []),
  ];

  const guideItems = [
    {
      title: labels.hajjGuide[language] || labels.hajjGuide.en,
      url: "/prepare",
      icon: BookOpen,
    },
    {
      title: labels.umrahGuide[language] || labels.umrahGuide.en,
      url: "/umrah",
      icon: Compass,
    },
    {
      title: labels.preparationGuide[language] || labels.preparationGuide.en,
      url: "/preparation",
      icon: BookMarked,
    },
    {
      title: labels.duaGuide[language] || labels.duaGuide.en,
      url: "/dua",
      icon: BookOpen,
    },
    {
      title: labels.rulesRegulations[language] || labels.rulesRegulations.en,
      url: "/rules",
      icon: FileText,
    },
    {
      title: labels.healthGuide[language] || labels.healthGuide.en,
      url: "/health",
      icon: Heart,
    },
    {
      title: labels.moneyManagement[language] || labels.moneyManagement.en,
      url: "/money",
      icon: Wallet,
    },
    {
      title: labels.telecomGuide[language] || labels.telecomGuide.en,
      url: "/telecom",
      icon: Smartphone,
    },
    {
      title: labels.familyGuide[language] || labels.familyGuide.en,
      url: "/family",
      icon: Users,
    },
    {
      title: labels.hajjProgress[language] || labels.hajjProgress.en,
      url: "/hajj-progress",
      icon: Route,
    },
    {
      title: labels.grievances[language] || labels.grievances.en,
      url: "/grievances",
      icon: MessageSquareWarning,
    },
    {
      title: labels.contactNumbers[language] || labels.contactNumbers.en,
      url: "/contacts",
      icon: Phone,
    },
    {
      title: labels.makkahGuide[language] || labels.makkahGuide.en,
      url: "/makkah-guide",
      icon: Building2,
    },
    {
      title: labels.madinahGuide[language] || labels.madinahGuide.en,
      url: "/madinah-guide",
      icon: MapPin,
    },
  ];

  const navItems = [
    {
      title: labels.home[language] || labels.home.en,
      url: "/",
      icon: Home,
    },
    {
      title: labels.map[language] || labels.map.en,
      url: "/map",
      icon: Map,
    },
  ];

  return (
    <Sidebar
      side={isRTL ? "right" : "left"}
      collapsible="icon"
      className="border-border/50"
    >
      <SidebarHeader className="border-b border-border/50 p-4">
        <NavLink to="/" className="flex items-center gap-3 group">
          <img
            src={logo}
            alt="Hajj Guide"
            className="w-9 h-9 rounded-full flex-shrink-0 shadow-soft transition-transform duration-300 group-hover:scale-105"
          />
          {!isCollapsed && (
            <span className="text-base font-semibold text-foreground truncate">
              {labels.hajjGuide[language] || labels.hajjGuide.en}
            </span>
          )}
        </NavLink>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {/* Navigation Links */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground mb-1">
            {!isCollapsed && (labels.navigation[language] || labels.navigation.en)}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                      activeClassName="bg-primary/10 text-primary hover:bg-primary/15"
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Guides Section - Collapsible */}
        <SidebarGroup>
          <Collapsible open={guidesOpen} onOpenChange={setGuidesOpen}>
            <CollapsibleTrigger className="w-full">
              <SidebarGroupLabel className="flex items-center justify-between w-full cursor-pointer hover:bg-muted/40 rounded-lg px-3 py-2 transition-colors">
                <span className="text-xs font-medium text-muted-foreground">
                  {!isCollapsed && (labels.guides[language] || labels.guides.en)}
                </span>
                {!isCollapsed && (
                  guidesOpen ? (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  )
                )}
              </SidebarGroupLabel>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {guideItems.map((item) => (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton asChild tooltip={item.title}>
                        <NavLink
                          to={item.url}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                          activeClassName="bg-primary/10 text-primary hover:bg-primary/15"
                        >
                          <item.icon className="w-5 h-5 flex-shrink-0" />
                          {!isCollapsed && <span>{item.title}</span>}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>

        {/* Admin Section - Only for coordinators/admins */}
        {hasAnyCoordinatorRole && (
          <SidebarGroup>
            <Collapsible open={adminOpen} onOpenChange={setAdminOpen}>
              <CollapsibleTrigger className="w-full">
                <SidebarGroupLabel className="flex items-center justify-between w-full cursor-pointer hover:bg-muted/40 rounded-lg px-3 py-2 transition-colors">
                  <span className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                    {!isCollapsed && (
                      <>
                        <Shield className="w-4 h-4" />
                        {labels.admin[language] || labels.admin.en}
                      </>
                    )}
                    {isCollapsed && <Shield className="w-4 h-4" />}
                  </span>
                  {!isCollapsed && (
                    adminOpen ? (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    )
                  )}
                </SidebarGroupLabel>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {adminItems.map((item) => (
                      <SidebarMenuItem key={item.url}>
                        <SidebarMenuButton asChild tooltip={item.title}>
                          <NavLink
                            to={item.url}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                            activeClassName="bg-primary/10 text-primary hover:bg-primary/15"
                          >
                            <item.icon className="w-5 h-5 flex-shrink-0" />
                            {!isCollapsed && <span>{item.title}</span>}
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </Collapsible>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-border/50 p-3 space-y-2">
        {!isCollapsed && (
          <>
            <button
              onClick={() => window.dispatchEvent(new Event("hajjcare:replay-tour"))}
              className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
            >
              <Sparkles className="w-5 h-5 flex-shrink-0 text-primary" />
              <span>{language === "hi" ? "ऐप टूर दोबारा देखें" : language === "ar" ? "إعادة جولة التطبيق" : language === "ur" ? "ایپ ٹور دوبارہ دیکھیں" : "Replay App Tour"}</span>
            </button>
            <p className="text-xs text-muted-foreground text-center">
              © 2024 Hajj Guide
            </p>
          </>
        )}
        {isCollapsed && (
          <button
            onClick={() => window.dispatchEvent(new Event("hajjcare:replay-tour"))}
            className="flex items-center justify-center p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-muted/60 transition-colors"
            title="Replay Tour"
          >
            <Sparkles className="w-5 h-5" />
          </button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
