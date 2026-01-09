import { Book, MapPin, Building2, Compass, Home, Users, Map, ChevronDown } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState, useEffect } from "react";

const guideItems = [
  { 
    title: { en: "Hajj Guide", ar: "دليل الحج", ur: "حج گائیڈ", hi: "हज्ज गाइड", tr: "Hac Rehberi", ru: "Руководство по Хаджу" },
    url: "/guides/hajj", 
    icon: Compass 
  },
  { 
    title: { en: "Umrah Guide", ar: "دليل العمرة", ur: "عمرہ گائیڈ", hi: "उमरा गाइड", tr: "Umre Rehberi", ru: "Руководство по Умре" },
    url: "/guides/umrah", 
    icon: Book 
  },
  { 
    title: { en: "Makkah Guide", ar: "دليل مكة", ur: "مکہ گائیڈ", hi: "मक्का गाइड", tr: "Mekke Rehberi", ru: "Руководство по Мекке" },
    url: "/guides/makkah", 
    icon: Building2 
  },
  { 
    title: { en: "Madinah Guide", ar: "دليل المدينة", ur: "مدینہ گائیڈ", hi: "मदीना गाइड", tr: "Medine Rehberi", ru: "Руководство по Медине" },
    url: "/guides/madinah", 
    icon: MapPin 
  },
];

const mainItems = [
  { 
    title: { en: "Home", ar: "الرئيسية", ur: "ہوم", hi: "होम", tr: "Ana Sayfa", ru: "Главная" },
    url: "/", 
    icon: Home 
  },
  { 
    title: { en: "Family", ar: "العائلة", ur: "خاندان", hi: "परिवार", tr: "Aile", ru: "Семья" },
    url: "/family", 
    icon: Users 
  },
  { 
    title: { en: "Map", ar: "الخريطة", ur: "نقشہ", hi: "मानचित्र", tr: "Harita", ru: "Карта" },
    url: "/map", 
    icon: Map 
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const currentPath = location.pathname;
  const { language, isRTL } = useLanguage();

  const isGuideActive = guideItems.some((item) => currentPath.startsWith(item.url));
  const [guidesOpen, setGuidesOpen] = useState(isGuideActive);

  useEffect(() => {
    if (isGuideActive) {
      setGuidesOpen(true);
    }
  }, [isGuideActive]);

  const getTitle = (titleObj: Record<string, string>) => {
    return titleObj[language] || titleObj.en;
  };

  return (
    <Sidebar 
      className={collapsed ? "w-14" : "w-64"}
      collapsible="icon"
      side={isRTL ? "right" : "left"}
    >
      <SidebarContent className="pt-4">
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground/70 px-3 mb-1">
            {language === "ar" ? "التنقل" : language === "ur" ? "نیویگیشن" : language === "hi" ? "नेविगेशन" : "Navigation"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild tooltip={getTitle(item.title)}>
                    <NavLink 
                      to={item.url} 
                      end={item.url === "/"} 
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-muted/60"
                      activeClassName="bg-primary/10 text-primary font-medium"
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!collapsed && <span>{getTitle(item.title)}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Guides Section */}
        <SidebarGroup>
          <Collapsible open={guidesOpen} onOpenChange={setGuidesOpen}>
            <CollapsibleTrigger className="w-full">
              <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground/70 px-3 mb-1 flex items-center justify-between cursor-pointer hover:text-foreground transition-colors">
                <span>
                  {language === "ar" ? "الأدلة الإسلامية" : language === "ur" ? "اسلامی گائیڈز" : language === "hi" ? "इस्लामिक गाइड्स" : "Islamic Guides"}
                </span>
                {!collapsed && (
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${guidesOpen ? "rotate-180" : ""}`} />
                )}
              </SidebarGroupLabel>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {guideItems.map((item) => (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton asChild tooltip={getTitle(item.title)}>
                        <NavLink 
                          to={item.url} 
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-muted/60"
                          activeClassName="bg-primary/10 text-primary font-medium"
                        >
                          <item.icon className="h-5 w-5 flex-shrink-0" />
                          {!collapsed && <span>{getTitle(item.title)}</span>}
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
    </Sidebar>
  );
}
