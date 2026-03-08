import { LayoutDashboard, Users, Bell, FileText, BarChart3, Columns3, Mail, Sparkles, Moon, Sun } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/useTheme";

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { label: "Contacts", icon: Users, path: "/contacts" },
  { label: "Follow Ups", icon: Bell, path: "/follow-ups" },
  { label: "Templates", icon: FileText, path: "/templates" },
  { label: "Analytics", icon: BarChart3, path: "/analytics" },
  { label: "Pipeline", icon: Columns3, path: "/pipeline" },
];

export default function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggle } = useTheme();

  return (
    <aside className="hidden md:flex w-64 flex-col gradient-sidebar h-screen sticky top-0 overflow-hidden relative">
      {/* Subtle glow accent at the top */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
      
      <div className="relative flex items-center gap-3 px-6 py-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary shadow-glow">
          <Mail className="h-4 w-4 text-primary-foreground" />
        </div>
        <div>
          <span className="font-bold text-base text-sidebar-accent-foreground tracking-tight">ColdMail</span>
          <span className="text-xs block text-sidebar-muted">CRM Dashboard</span>
        </div>
      </div>

      <nav className="relative flex-1 px-3 py-2 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const active = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex items-center gap-3 w-full rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200",
                active
                  ? "gradient-primary text-primary-foreground shadow-glow"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Theme Toggle */}
      <div className="relative px-3 mb-2">
        <button
          onClick={toggle}
          className="flex items-center gap-3 w-full rounded-xl px-3.5 py-2.5 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200"
        >
          {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          {theme === "light" ? "Dark Mode" : "Light Mode"}
        </button>
      </div>

      <div className="relative px-4 py-4 mx-3 mb-3 rounded-xl border border-sidebar-border bg-sidebar-accent/50">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="h-3.5 w-3.5 text-sidebar-primary" />
          <p className="text-xs font-semibold text-sidebar-accent-foreground">Cold Mail Manager</p>
        </div>
        <p className="text-[11px] text-sidebar-muted">B.Tech Internship Outreach</p>
      </div>
    </aside>
  );
}