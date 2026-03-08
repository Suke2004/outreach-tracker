import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: ReactNode;
  className?: string;
  accent?: boolean;
}

export default function StatCard({ label, value, icon, className, accent }: StatCardProps) {
  return (
    <div
      className={cn(
        "group relative rounded-2xl border border-border bg-card p-5 flex items-center gap-4 shadow-card transition-all duration-300 hover:shadow-elevated hover:-translate-y-0.5 overflow-hidden",
        accent && "gradient-card-accent border-primary/20",
        className
      )}
    >
      {/* Hover glow effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-primary/5 to-transparent" />
      
      <div className={cn(
        "relative flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110",
        accent ? "gradient-primary text-primary-foreground shadow-glow" : "bg-accent text-accent-foreground"
      )}>
        {icon}
      </div>
      <div className="relative">
        <p className="text-2xl font-bold text-card-foreground tracking-tight">{value}</p>
        <p className="text-xs text-muted-foreground font-medium">{label}</p>
      </div>
    </div>
  );
}