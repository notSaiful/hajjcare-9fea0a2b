import { useState } from "react";
import { useLocation } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  BookOpen,
  Compass,
  Building2,
  MapPin,
  ChevronDown,
  ChevronRight,
  Users,
  Map,
  FileText,
  Home,
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
    en: "Islamic Guides",
    ar: "الأدلة الإسلامية",
    ur: "اسلامی رہنمائی",
    hi: "इस्लामी गाइड",
    tr: "İslami Rehberler",
    ru: "Исламские руководства",
  },
  hajjGuide: {
    en: "Hajj Guide",
    ar: "دليل الحج",
    ur: "حج گائیڈ",
    hi: "हज गाइड",
    tr: "Hac Rehberi",
    ru: "Руководство по хаджу",
  },
  umrahGuide: {
    en: "Umrah Guide",
    ar: "دليل العمرة",
    ur: "عمرہ گائیڈ",
    hi: "उमरा गाइड",
    tr: "Umre Rehberi",
    ru: "Руководство по умре",
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
  family: {
    en: "Family",
    ar: "العائلة",
    ur: "فیملی",
    hi: "परिवार",
    tr: "Aile",
    ru: "Семья",
  },
  map: {
    en: "Map",
    ar: "الخريطة",
    ur: "نقشہ",
    hi: "नक्शा",
    tr: "Harita",
    ru: "Карта",
  },
  rules: {
    en: "Rules & Conduct",
    ar: "القواعد والسلوك",
    ur: "قواعد و آداب",
    hi: "नियम और आचरण",
    tr: "Kurallar ve Davranış",
    ru: "Правила и поведение",
  },
};

export function AppSidebar() {
  const { language, isRTL } = useLanguage();
  const location = useLocation();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const isGuidesActive =
    location.pathname.startsWith("/prepare") ||
    location.pathname.startsWith("/umrah") ||
    location.pathname.startsWith("/makkah-guide") ||
    location.pathname.startsWith("/madinah-guide");

  const [guidesOpen, setGuidesOpen] = useState(isGuidesActive);

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
      title: labels.family[language] || labels.family.en,
      url: "/family",
      icon: Users,
    },
    {
      title: labels.map[language] || labels.map.en,
      url: "/map",
      icon: Map,
    },
    {
      title: labels.rules[language] || labels.rules.en,
      url: "/rules",
      icon: FileText,
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
      </SidebarContent>

      <SidebarFooter className="border-t border-border/50 p-4">
        {!isCollapsed && (
          <p className="text-xs text-muted-foreground text-center">
            © 2024 Hajj Guide
          </p>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
