import { Outlet, Link } from "@tanstack/react-router";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { FloatingAssistant } from "./floating-assistant";
import { Toaster } from "@/components/ui/sonner";
import logo from "@/assets/mediqueue-logo.png";

export function AppShell() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-muted/30">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-background/80 backdrop-blur px-4">
            <SidebarTrigger />
            <Link to="/" className="flex items-center gap-2 min-w-0">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 p-1">
                <img src={logo} alt="MediQueue" className="h-full w-full object-contain" />
              </div>
              <span className="font-bold tracking-tight truncate">MediQueue</span>
            </Link>
            <div className="ml-auto hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              AI services online
            </div>
          </header>
          <main className="flex-1 min-w-0">
            <Outlet />
          </main>
          <footer className="border-t bg-background px-6 py-4 text-xs text-muted-foreground flex items-center gap-2">
            <img src={logo} alt="" className="h-5 w-5 object-contain" />
            <span>© {new Date().getFullYear()} MediQueue · AI is not a replacement for a healthcare professional. For emergencies call <strong>10177</strong>.</span>
          </footer>
        </div>
        <FloatingAssistant />
        <Toaster />
      </div>
    </SidebarProvider>
  );
}