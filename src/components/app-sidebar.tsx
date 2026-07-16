import { Link, useRouterState } from "@tanstack/react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Stethoscope,
  MapPin,
  Pill,
  Calendar,
  PackageSearch,
  HeartPulse,
  Bot,
} from "lucide-react";
import logo from "@/assets/mediqueue-logo.png";

const nav = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Symptom Checker", url: "/symptoms", icon: Stethoscope },
  { title: "Find a Clinic", url: "/clinics", icon: MapPin },
  { title: "Find a Pharmacy", url: "/pharmacies", icon: Pill },
  { title: "Appointments", url: "/appointments", icon: Calendar },
  { title: "Medicine Tracker", url: "/medicines", icon: PackageSearch },
  { title: "Mental Health", url: "/mental-health", icon: HeartPulse },
  { title: "AI Assistant", url: "/assistant", icon: Bot },
];

export function AppSidebar() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-3">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/95 p-1 shadow-md">
            <img src={logo} alt="MediQueue" className="h-full w-full object-contain" />
          </div>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <div className="truncate text-base font-bold tracking-tight">MediQueue</div>
            <div className="truncate text-[11px] text-sidebar-foreground/70">AI Healthcare</div>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {nav.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={pathname === item.url} tooltip={item.title}>
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
        <div className="px-2 py-2 text-[11px] text-sidebar-foreground/60 group-data-[collapsible=icon]:hidden">
          © MediQueue · For South Africa 🇿🇦
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}