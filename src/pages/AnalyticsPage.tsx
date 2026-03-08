import { useMemo } from "react";
import { BarChart3 } from "lucide-react";
import { useContacts } from "@/hooks/useContacts";
import { STATUS_OPTIONS } from "@/lib/types";
import StatCard from "@/components/StatCard";
import { Mail, MessageSquare, Forward, Users, Calendar } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function AnalyticsPage() {
  const { contacts } = useContacts();

  const stats = useMemo(() => {
    const total = contacts.length;
    const emailsSent = contacts.filter((c) => c.status !== "Not Contacted").length;
    const followUps = contacts.filter((c) => c.status === "Follow-up Sent").length;
    const replies = contacts.filter((c) => c.status === "Replied" || c.status === "Interview Scheduled").length;
    const interviews = contacts.filter((c) => c.status === "Interview Scheduled").length;
    const replyRate = emailsSent > 0 ? ((replies / emailsSent) * 100).toFixed(1) : "0";

    const byCompany: Record<string, number> = {};
    contacts.forEach((c) => {
      if (c.status !== "Not Contacted") {
        byCompany[c.company] = (byCompany[c.company] || 0) + 1;
      }
    });

    const byStatus: Record<string, number> = {};
    STATUS_OPTIONS.forEach((s) => {
      byStatus[s] = contacts.filter((c) => c.status === s).length;
    });

    return { total, emailsSent, followUps, replies, interviews, replyRate, byCompany, byStatus };
  }, [contacts]);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <BarChart3 className="h-5 w-5 text-primary" />
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label="Total Contacts" value={stats.total} icon={<Users className="h-5 w-5" />} />
        <StatCard label="Emails Sent" value={stats.emailsSent} icon={<Mail className="h-5 w-5" />} />
        <StatCard label="Follow-ups" value={stats.followUps} icon={<Forward className="h-5 w-5" />} />
        <StatCard label="Replies" value={stats.replies} icon={<MessageSquare className="h-5 w-5" />} />
        <StatCard label="Interviews" value={stats.interviews} icon={<Calendar className="h-5 w-5" />} />
      </div>

      {/* Reply Rate */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="font-semibold text-foreground mb-2">Reply Rate</h2>
        <div className="flex items-center gap-4">
          <Progress value={parseFloat(stats.replyRate)} className="flex-1 h-3" />
          <span className="text-xl font-bold text-primary">{stats.replyRate}%</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Status Distribution */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-semibold text-foreground mb-4">Status Distribution</h2>
          <div className="space-y-3">
            {STATUS_OPTIONS.map((s) => {
              const count = stats.byStatus[s] || 0;
              const pct = stats.total > 0 ? (count / stats.total) * 100 : 0;
              return (
                <div key={s} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-32 shrink-0">{s}</span>
                  <Progress value={pct} className="flex-1 h-2" />
                  <span className="text-xs font-medium text-card-foreground w-6 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Emails by Company */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-semibold text-foreground mb-4">Emails Sent by Company</h2>
          <div className="space-y-3">
            {Object.entries(stats.byCompany)
              .sort((a, b) => b[1] - a[1])
              .map(([company, count]) => {
                const pct = stats.emailsSent > 0 ? (count / stats.emailsSent) * 100 : 0;
                return (
                  <div key={company} className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-24 shrink-0 truncate">{company}</span>
                    <Progress value={pct} className="flex-1 h-2" />
                    <span className="text-xs font-medium text-card-foreground w-6 text-right">{count}</span>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
