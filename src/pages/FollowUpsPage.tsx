import { useMemo } from "react";
import { Bell } from "lucide-react";
import { useContacts } from "@/hooks/useContacts";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";

export default function FollowUpsPage() {
  const { contacts, followUpSent } = useContacts();

  const today = new Date().toISOString().split("T")[0];

  const pending = useMemo(
    () =>
      contacts
        .filter(
          (c) =>
            c.followUpDate &&
            c.followUpDate <= today &&
            c.status !== "Replied" &&
            c.status !== "Interview Scheduled" &&
            c.status !== "Rejected"
        )
        .sort((a, b) => a.followUpDate.localeCompare(b.followUpDate)),
    [contacts, today]
  );

  const upcoming = useMemo(
    () =>
      contacts
        .filter((c) => c.followUpDate && c.followUpDate > today)
        .sort((a, b) => a.followUpDate.localeCompare(b.followUpDate)),
    [contacts, today]
  );

  const Section = ({ title, list, overdue }: { title: string; list: typeof pending; overdue?: boolean }) => (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">{title} ({list.length})</h2>
      {list.length === 0 && <p className="text-sm text-muted-foreground">No contacts here</p>}
      {list.map((c) => (
        <div key={c.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-card-foreground">{c.name}</span>
              <StatusBadge status={c.status} />
              {overdue && (
                <span className="text-[10px] font-semibold bg-status-red/15 text-status-red px-1.5 py-0.5 rounded-full">OVERDUE</span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{c.company} · {c.email}</p>
            <p className="text-xs text-muted-foreground">Follow up: {c.followUpDate}</p>
          </div>
          <Button size="sm" onClick={() => followUpSent(c.id)}>Send Follow Up</Button>
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <Bell className="h-5 w-5 text-primary" />
        <h1 className="text-2xl font-bold text-foreground">Follow Ups</h1>
      </div>
      <Section title="Due / Overdue" list={pending} overdue />
      <Section title="Upcoming" list={upcoming} />
    </div>
  );
}
