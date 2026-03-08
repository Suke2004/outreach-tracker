import { useState } from "react";
import { Contact, ContactStatus, STATUS_OPTIONS } from "@/lib/types";
import StatusBadge from "@/components/StatusBadge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Mail, Forward, MessageSquare } from "lucide-react";

interface Props {
  contact: Contact;
  onClose: () => void;
  onUpdate: (updates: Partial<Contact>) => void;
  onEmailSent: () => void;
  onFollowUpSent: () => void;
  onReplied: () => void;
}

export default function ContactDetailSheet({ contact, onClose, onUpdate, onEmailSent, onFollowUpSent, onReplied }: Props) {
  const [notes, setNotes] = useState(contact.notes);
  const [response, setResponse] = useState(contact.response);
  const [followUpDate, setFollowUpDate] = useState(contact.followUpDate);
  const [status, setStatus] = useState<ContactStatus>(contact.status);

  const save = () => {
    onUpdate({ notes, response, followUpDate, status });
  };

  const isFollowUpDue = contact.followUpDate && contact.followUpDate <= new Date().toISOString().split("T")[0];

  return (
    <Sheet open onOpenChange={onClose}>
      <SheetContent className="sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-xl">{contact.name}</SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-5">
          {/* Info */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{contact.email}</p>
            <p className="text-sm text-card-foreground">{contact.title} at {contact.company}</p>
            <div className="flex gap-2 items-center">
              <StatusBadge status={contact.status} />
              {isFollowUpDue && (
                <span className="text-[10px] font-semibold bg-status-red/15 text-status-red px-1.5 py-0.5 rounded-full">Follow Up Needed</span>
              )}
              {contact.lastContacted && contact.lastContacted >= new Date(Date.now() - 2 * 86400000).toISOString().split("T")[0] && (
                <span className="text-[10px] font-semibold bg-status-blue/15 text-status-blue px-1.5 py-0.5 rounded-full">Recently Contacted</span>
              )}
            </div>
          </div>

          <Separator />

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={onEmailSent}><Mail className="h-3 w-3 mr-1" /> Mark Email Sent</Button>
            <Button size="sm" variant="outline" onClick={onFollowUpSent}><Forward className="h-3 w-3 mr-1" /> Mark Follow-up</Button>
            <Button size="sm" variant="outline" onClick={onReplied}><MessageSquare className="h-3 w-3 mr-1" /> Mark Replied</Button>
          </div>

          <Separator />

          {/* Editable Fields */}
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as ContactStatus)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Follow Up Date</Label>
              <Input type="date" value={followUpDate} onChange={(e) => setFollowUpDate(e.target.value)} />
            </div>
            <div>
              <Label className="text-xs">Response</Label>
              <Input value={response} onChange={(e) => setResponse(e.target.value)} placeholder="E.g. Asked to send resume" />
            </div>
            <div>
              <Label className="text-xs">Notes</Label>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="E.g. Met at LinkedIn, HR responded positively" rows={3} />
            </div>
            <Button onClick={save} className="w-full">Save Changes</Button>
          </div>

          <Separator />

          {/* Timeline */}
          {contact.timeline.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Timeline</h3>
              <div className="space-y-2">
                {contact.timeline.map((entry, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <div>
                      <p className="text-sm font-medium text-card-foreground">{entry.action}</p>
                      <p className="text-xs text-muted-foreground">{entry.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
