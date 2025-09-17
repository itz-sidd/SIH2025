import { NavLink, useLocation } from "react-router-dom";
import {
  Heart,
  MessageCircle,
  Users,
  Phone,
  FileText,
  Calendar,
  BookOpen,
  Settings,
  Bot,
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
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Wellness Dashboard",
    url: "/",
    icon: Heart,
    description: "Track your daily mood and wellness"
  },
  {
    title: "AI Companion",
    url: "/ai-chat",
    icon: Bot,
    description: "Chat with your AI wellness companion"
  },
  {
    title: "Community",
    url: "/community",
    icon: Users,
    description: "Connect with peer support groups"
  },
  {
    title: "Emergency Help",
    url: "/emergency",
    icon: Phone,
    description: "Quick access to crisis support"
  },
  {
    title: "Wellness Tests",
    url: "/tests",
    icon: FileText,
    description: "Self-assessment tools"
  },
  {
    title: "Learning Hub",
    url: "/learn",
    icon: BookOpen,
    description: "Educational resources & tools"
  },
  {
    title: "Appointments",
    url: "/appointments",
    icon: Calendar,
    description: "Book counseling sessions"
  },
  {
    title: "Admin Dashboard",
    url: "/admin",
    icon: Settings,
    description: "Platform administration"
  },
];

export function AppSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === "/") {
      return currentPath === "/";
    }
    return currentPath.startsWith(path);
  };

  return (
    <Sidebar className="border-r border-border">
      <SidebarContent className="pt-6">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-lg font-semibold text-[hsl(var(--wellness-primary))]">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 px-2">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild size="lg">
                    <NavLink
                      to={item.url}
                      className={({ isActive: navIsActive }) =>
                        `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all hover:bg-sidebar-accent ${
                          navIsActive || isActive(item.url)
                            ? "bg-[hsl(var(--wellness-primary)/0.1)] text-[hsl(var(--wellness-primary))] font-medium border-l-4 border-[hsl(var(--wellness-primary))]"
                            : "text-sidebar-foreground hover:text-sidebar-accent-foreground"
                        }`
                      }
                    >
                      <item.icon className="h-5 w-5" />
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{item.title}</span>
                        <span className="text-xs text-muted-foreground">
                          {item.description}
                        </span>
                      </div>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}