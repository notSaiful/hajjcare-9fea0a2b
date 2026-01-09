import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { SimpleHeader } from "@/components/SimpleHeader";
import { AmbientBackground } from "@/components/AmbientBackground";
import { useLanguage } from "@/contexts/LanguageContext";

interface AppLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showBackground?: boolean;
}

export function AppLayout({ children, showHeader = true, showBackground = true }: AppLayoutProps) {
  const { isRTL } = useLanguage();

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background" dir={isRTL ? "rtl" : "ltr"}>
        {showBackground && <AmbientBackground />}
        
        <AppSidebar />
        
        <div className="flex-1 flex flex-col min-w-0">
          {showHeader && (
            <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border/50">
              <div className="flex items-center h-16 px-4">
                <SidebarTrigger className="mr-3 h-9 w-9 rounded-lg hover:bg-muted/80" />
                <SimpleHeader />
              </div>
            </header>
          )}
          
          <main className="flex-1 relative z-10">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
