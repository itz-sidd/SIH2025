import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface AppLayoutProps {
  children: React.ReactNode;
}

function HeaderContent({ children }: { children: React.ReactNode }) {
  const { toggleSidebar } = useSidebar();

  return (
    <div className="min-h-screen flex w-full bg-background">
      <AppSidebar />
      
      <div className="flex-1 flex flex-col">
        <header className="h-16 flex items-center justify-between border-b bg-card px-6 shadow-sm">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="h-9 w-9 hover:bg-accent"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Navigation</span>
            </Button>
            <h1 className="text-2xl font-bold text-primary">
              Mind<span className="text-[hsl(var(--wellness-primary))]">Ease</span>
            </h1>
          </div>
          <div className="text-sm text-muted-foreground">
            Mental Wellness Platform
          </div>
        </header>
        
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <HeaderContent>{children}</HeaderContent>
    </SidebarProvider>
  );
}