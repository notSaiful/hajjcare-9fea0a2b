import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

interface MainLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
}

export function MainLayout({ children, showHeader = true, showFooter = true }: MainLayoutProps) {
  const { isRTL } = useLanguage();

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="min-h-screen flex w-full" dir={isRTL ? "rtl" : "ltr"}>
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          {showHeader && (
            <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border/50 h-14 flex items-center px-4">
              <SidebarTrigger className="h-9 w-9 rounded-lg hover:bg-muted/80" />
            </header>
          )}
          <main className="flex-1">{children}</main>
          {showFooter && <Footer />}
        </div>
      </div>
    </SidebarProvider>
  );
}
