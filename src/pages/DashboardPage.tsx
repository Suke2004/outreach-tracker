import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Mail, Bell, MessageSquare, Calendar, Target, ArrowRight, Sparkles } from "lucide-react";
import { useContacts } from "@/hooks/useContacts";
import { getDailyGoal } from "@/lib/store";
import StatCard from "@/components/StatCard";
import AnimateIn from "@/components/AnimateIn";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function DashboardPage() {
  const { contacts, followUpSent } = useContacts();
  const navigate = useNavigate();
  const dailyGoal = getDailyGoal();

  const stats = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    const emailsSent = contacts.filter((c) => c.status !== "Not Contacted").length;
    const followUpsPending = contacts.filter(
      (c) => c.followUpDate && c.followUpDate <= today && c.status !== "Replied" && c.status !== "Interview Scheduled" && c.status !== "Rejected"
    );
    const replies = contacts.filter((c) => c.status === "Replied" || c.status === "Interview Scheduled").length;
    const interviews = contacts.filter((c) => c.status === "Interview Scheduled").length;
    const sentToday = contacts.filter((c) => c.lastContacted === today).length;

    return { total: contacts.length, emailsSent, followUpsPending, replies, interviews, sentToday };
  }, [contacts]);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Hero Header */}
      <AnimateIn>
        <div className="relative rounded-2xl gradient-primary p-8 overflow-hidden shadow-elevated">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-primary-glow/20 pointer-events-none" />
          <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-primary-glow/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-primary-glow/15 blur-2xl pointer-events-none" />
          
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-primary-foreground/70" />
              <span className="text-xs font-semibold text-primary-foreground/70 uppercase tracking-wider">Dashboard</span>
            </div>
            <h1 className="text-3xl font-bold text-primary-foreground tracking-tight">Welcome back!</h1>
            <p className="text-sm text-primary-foreground/70 mt-1">Your internship outreach overview at a glance</p>
          </div>
        </div>
      </AnimateIn>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <AnimateIn delay={50}><StatCard label="Total Contacts" value={stats.total} icon={<Users className="h-5 w-5" />} accent /></AnimateIn>
        <AnimateIn delay={100}><StatCard label="Emails Sent" value={stats.emailsSent} icon={<Mail className="h-5 w-5" />} /></AnimateIn>
        <AnimateIn delay={150}><StatCard label="Follow Ups Pending" value={stats.followUpsPending.length} icon={<Bell className="h-5 w-5" />} /></AnimateIn>
        <AnimateIn delay={200}><StatCard label="Replies Received" value={stats.replies} icon={<MessageSquare className="h-5 w-5" />} /></AnimateIn>
        <AnimateIn delay={250}><StatCard label="Interviews" value={stats.interviews} icon={<Calendar className="h-5 w-5" />} /></AnimateIn>
      </div>

      <AnimateIn delay={300}>
      <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary shadow-glow">
              <Target className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Daily Goal</h2>
              <p className="text-xs text-muted-foreground">Send {dailyGoal} emails today</p>
            </div>
          </div>
          <span className="text-2xl font-bold text-gradient">
            {stats.sentToday}/{dailyGoal}
          </span>
        </div>
        <Progress value={(stats.sentToday / dailyGoal) * 100} className="h-2.5 rounded-full" />
      </div>
      </AnimateIn>

      {/* Follow-up Reminders */}
      {stats.followUpsPending.length > 0 && (
        <AnimateIn delay={350}>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-status-orange/15">
                <Bell className="h-4 w-4 text-status-orange" />
              </div>
              <h2 className="font-semibold text-foreground">Follow-Up Reminders</h2>
            </div>
            {stats.followUpsPending.length > 5 && (
              <Button variant="ghost" size="sm" onClick={() => navigate("/follow-ups")} className="text-primary">
                View all ({stats.followUpsPending.length}) <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
          <div className="space-y-3">
            {stats.followUpsPending.slice(0, 5).map((contact) => {
              const isOverdue = contact.followUpDate < new Date().toISOString().split("T")[0];
              return (
                <div key={contact.id} className="flex items-center justify-between rounded-xl border border-border p-4 hover:shadow-soft transition-all duration-200 hover:border-primary/20">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-card-foreground">{contact.name}</span>
                      {isOverdue && (
                        <span className="text-[10px] font-bold bg-status-red/15 text-status-red px-2 py-0.5 rounded-full uppercase tracking-wide">Overdue</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{contact.company} · {contact.email}</p>
                    <p className="text-xs text-muted-foreground">Follow up: {contact.followUpDate}</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => followUpSent(contact.id)}>
                    Send Follow Up
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
        </AnimateIn>
      )}
    </div>
  );
}