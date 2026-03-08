export type ContactStatus =
  | "Not Contacted"
  | "Email Sent"
  | "Follow-up Sent"
  | "Replied"
  | "Interview Scheduled"
  | "Rejected";

export interface Contact {
  id: string;
  sno: number;
  name: string;
  email: string;
  title: string;
  company: string;
  status: ContactStatus;
  lastContacted: string;
  followUpDate: string;
  response: string;
  notes: string;
  timeline: TimelineEntry[];
}

export interface TimelineEntry {
  date: string;
  action: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
}

export const STATUS_OPTIONS: ContactStatus[] = [
  "Not Contacted",
  "Email Sent",
  "Follow-up Sent",
  "Replied",
  "Interview Scheduled",
  "Rejected",
];

export const STATUS_COLORS: Record<ContactStatus, string> = {
  "Not Contacted": "bg-status-gray/15 text-status-gray",
  "Email Sent": "bg-status-blue/15 text-status-blue",
  "Follow-up Sent": "bg-status-orange/15 text-status-orange",
  "Replied": "bg-status-green/15 text-status-green",
  "Interview Scheduled": "bg-status-purple/15 text-status-purple",
  "Rejected": "bg-status-red/15 text-status-red",
};
