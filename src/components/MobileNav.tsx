import { LayoutDashboard, Users, Bell, FileText, BarChart3, Columns3 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Home", icon: LayoutDashboard, path: "/" },
  { label: "Contacts", icon: Users, path: "/contacts" },
  { label: "Follow Ups", icon: Bell, path: "/follow-ups" },
  { label: "Templates", icon: FileText, path: "/templates" },
  { label: "Analytics", icon: BarChart3, path: "/analytics" },
  { label: "Pipeline", icon: Columns3, path: "/pipeline" },
];

export default function MobileNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-border flex justify-around py-2 px-1">
      {NAV_ITEMS.slice(0, 5).map((item) => {
        const active = location.pathname === item.path;
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={cn(
              "flex flex-col items-center gap-0.5 text-[10px] font-semibold px-2.5 py-1.5 rounded-xl transition-all duration-200",
              active ? "text-primary bg-accent" : "text-muted-foreground"
            )}
          >
            <item.icon className={cn("h-4 w-4", active && "animate-float")} />
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}