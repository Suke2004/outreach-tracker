import { useState } from "react";
import { Columns3 } from "lucide-react";
import { useContacts } from "@/hooks/useContacts";
import { ContactStatus, STATUS_COLORS } from "@/lib/types";
import StatusBadge from "@/components/StatusBadge";
import { cn } from "@/lib/utils";

const PIPELINE_COLUMNS: ContactStatus[] = [
  "Not Contacted",
  "Email Sent",
  "Follow-up Sent",
  "Replied",
  "Interview Scheduled",
  "Rejected",
];

export default function PipelinePage() {
  const { contacts, update } = useContacts();
  const [dragId, setDragId] = useState<string | null>(null);

  const handleDragStart = (id: string) => setDragId(id);

  const handleDrop = (status: ContactStatus) => {
    if (dragId) {
      const today = new Date().toISOString().split("T")[0];
      update(dragId, {
        status,
        lastContacted: today,
        timeline: [
          ...(contacts.find((c) => c.id === dragId)?.timeline || []),
          { date: today, action: status },
        ],
      });
      setDragId(null);
    }
  };

  return (
    <div className="p-6 max-w-full mx-auto space-y-4">
      <div className="flex items-center gap-2">
        <Columns3 className="h-5 w-5 text-primary" />
        <h1 className="text-2xl font-bold text-foreground">Outreach Pipeline</h1>
      </div>
      <p className="text-sm text-muted-foreground">Drag contacts between stages to update their status</p>

      <div className="flex gap-3 overflow-x-auto pb-4">
        {PIPELINE_COLUMNS.map((status) => {
          const items = contacts.filter((c) => c.status === status);
          return (
            <div
              key={status}
              className="min-w-[220px] flex-shrink-0 rounded-xl border border-border bg-muted/30 p-3"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(status)}
            >
              <div className="flex items-center justify-between mb-3">
                <StatusBadge status={status} />
                <span className="text-xs font-medium text-muted-foreground">{items.length}</span>
              </div>
              <div className="space-y-2 min-h-[100px]">
                {items.map((c) => (
                  <div
                    key={c.id}
                    draggable
                    onDragStart={() => handleDragStart(c.id)}
                    className={cn(
                      "rounded-lg border border-border bg-card p-3 cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-shadow",
                      dragId === c.id && "opacity-50"
                    )}
                  >
                    <p className="text-sm font-medium text-card-foreground">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.company}</p>
                    {c.followUpDate && (
                      <p className="text-[10px] text-muted-foreground mt-1">Follow up: {c.followUpDate}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
