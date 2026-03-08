import { ContactStatus, STATUS_COLORS } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function StatusBadge({ status }: { status: ContactStatus }) {
  return (
    <span className={cn(
      "inline-flex items-center rounded-lg px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase",
      STATUS_COLORS[status]
    )}>
      {status}
    </span>
  );
}