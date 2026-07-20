import { Link, useLocation } from "wouter";
import { GraduationCap, Users, Megaphone, Briefcase, FileText, Image, LogOut, LayoutDashboard } from "lucide-react";
import { useAdminLogout } from "@workspace/api-client-react";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const logout = useAdminLogout();

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        window.location.href = "/admin"; // Redirect to login
      }
    });
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    window.history.pushState({}, "", href);
    window.dispatchEvent(new Event("popstate"));
  };

  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/dashboard?tab=courses", label: "Courses", icon: GraduationCap },
    { href: "/admin/dashboard?tab=faculty", label: "Faculty", icon: Users },
    { href: "/admin/dashboard?tab=news", label: "News & Events", icon: Megaphone },
    { href: "/admin/dashboard?tab=placements", label: "Placements", icon: Briefcase },
    { href: "/admin/dashboard?tab=leads", label: "Admissions", icon: FileText },
    { href: "/admin/dashboard?tab=media", label: "Media", icon: Image },
  ];

  const currentTab = new URLSearchParams(window.location.search).get("tab") || "overview";

  return (
    <div className="min-h-[100dvh] flex flex-col md:flex-row bg-muted/30">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border shrink-0 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-sidebar-border">
          <span className="font-bold text-xl tracking-tight text-white">Indrayani Admin</span>
        </div>
        <nav className="flex-1 py-6 px-4 space-y-1">
          {navItems.map((item) => {
            const itemTab = item.href.includes("tab=") ? item.href.split("tab=")[1] : "overview";
            const reallyActive = currentTab === itemTab;

            return (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  reallyActive 
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold" 
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-white"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </a>
            );
          })}
        </nav>
        <div className="p-4 border-t border-sidebar-border">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-white transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-border flex items-center justify-between px-6 shrink-0 shadow-sm">
          <h1 className="font-semibold text-lg text-foreground">Content Management System</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Admin Mode</span>
            <Link href="/" className="text-sm font-medium text-accent hover:underline">View Live Site</Link>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
