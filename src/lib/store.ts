import { Contact, EmailTemplate } from "./types";

const CONTACTS_KEY = "coldmail_contacts";
const TEMPLATES_KEY = "coldmail_templates";
const DAILY_GOAL_KEY = "coldmail_daily_goal";

function generateId() {
  return Math.random().toString(36).substring(2, 11);
}

const MOCK_CONTACTS: Contact[] = [
  { id: generateId(), sno: 1, name: "Priya Sharma", email: "priya@google.com", title: "Engineering Manager", company: "Google", status: "Email Sent", lastContacted: "2026-03-05", followUpDate: "2026-03-09", response: "", notes: "Found on LinkedIn", timeline: [{ date: "2026-03-05", action: "Email Sent" }] },
  { id: generateId(), sno: 2, name: "Rahul Mehta", email: "rahul@microsoft.com", title: "HR Lead", company: "Microsoft", status: "Not Contacted", lastContacted: "", followUpDate: "", response: "", notes: "", timeline: [] },
  { id: generateId(), sno: 3, name: "Anita Desai", email: "anita@amazon.com", title: "Recruiter", company: "Amazon", status: "Replied", lastContacted: "2026-03-03", followUpDate: "", response: "Asked to send resume", notes: "Very responsive", timeline: [{ date: "2026-03-01", action: "Email Sent" }, { date: "2026-03-03", action: "Replied" }] },
  { id: generateId(), sno: 4, name: "Vikram Singh", email: "vikram@flipkart.com", title: "Tech Lead", company: "Flipkart", status: "Follow-up Sent", lastContacted: "2026-03-06", followUpDate: "2026-03-10", response: "", notes: "Met at tech event", timeline: [{ date: "2026-03-02", action: "Email Sent" }, { date: "2026-03-06", action: "Follow-up Sent" }] },
  { id: generateId(), sno: 5, name: "Sneha Patel", email: "sneha@razorpay.com", title: "VP Engineering", company: "Razorpay", status: "Interview Scheduled", lastContacted: "2026-03-04", followUpDate: "", response: "Interview on March 12", notes: "Referred by alumni", timeline: [{ date: "2026-02-28", action: "Email Sent" }, { date: "2026-03-02", action: "Follow-up Sent" }, { date: "2026-03-04", action: "Replied" }] },
  { id: generateId(), sno: 6, name: "Arjun Nair", email: "arjun@swiggy.com", title: "HR Manager", company: "Swiggy", status: "Rejected", lastContacted: "2026-03-01", followUpDate: "", response: "No openings currently", notes: "", timeline: [{ date: "2026-02-27", action: "Email Sent" }, { date: "2026-03-01", action: "Rejected" }] },
  { id: generateId(), sno: 7, name: "Meera Joshi", email: "meera@zomato.com", title: "Talent Acquisition", company: "Zomato", status: "Not Contacted", lastContacted: "", followUpDate: "", response: "", notes: "LinkedIn connection", timeline: [] },
  { id: generateId(), sno: 8, name: "Karan Gupta", email: "karan@phonepe.com", title: "Engineering Director", company: "PhonePe", status: "Email Sent", lastContacted: "2026-03-06", followUpDate: "2026-03-10", response: "", notes: "", timeline: [{ date: "2026-03-06", action: "Email Sent" }] },
];

const DEFAULT_TEMPLATES: EmailTemplate[] = [
  {
    id: generateId(),
    name: "Initial Outreach",
    subject: "Summer Internship Opportunity",
    body: `Hello {NAME},

I hope you are doing well.

I am a 3rd year B.Tech student interested in opportunities at {COMPANY}. I came across your role as {TITLE} and wanted to reach out regarding possible internship opportunities.

I would love to contribute and learn from your team.

Best regards
[Your Name]`,
  },
  {
    id: generateId(),
    name: "Follow Up",
    subject: "Following Up - Internship Inquiry",
    body: `Hello {NAME},

I wanted to follow up on my previous email regarding internship opportunities at {COMPANY}.

I remain very interested in contributing to your team and would appreciate any guidance you could provide.

Thank you for your time.

Best regards
[Your Name]`,
  },
];

export function getContacts(): Contact[] {
  const stored = localStorage.getItem(CONTACTS_KEY);
  if (!stored) {
    localStorage.setItem(CONTACTS_KEY, JSON.stringify(MOCK_CONTACTS));
    return MOCK_CONTACTS;
  }
  return JSON.parse(stored);
}

export function saveContacts(contacts: Contact[]) {
  localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
}

export function addContact(contact: Omit<Contact, "id" | "sno" | "status" | "lastContacted" | "followUpDate" | "response" | "notes" | "timeline">): Contact {
  const contacts = getContacts();
  const newContact: Contact = {
    ...contact,
    id: generateId(),
    sno: contacts.length + 1,
    status: "Not Contacted",
    lastContacted: "",
    followUpDate: "",
    response: "",
    notes: "",
    timeline: [],
  };
  contacts.push(newContact);
  saveContacts(contacts);
  return newContact;
}

export function updateContact(id: string, updates: Partial<Contact>) {
  const contacts = getContacts();
  const idx = contacts.findIndex((c) => c.id === id);
  if (idx !== -1) {
    contacts[idx] = { ...contacts[idx], ...updates };
    saveContacts(contacts);
  }
  return contacts;
}

export function deleteContact(id: string) {
  const contacts = getContacts().filter((c) => c.id !== id);
  saveContacts(contacts);
  return contacts;
}

export function markEmailSent(id: string) {
  const contacts = getContacts();
  const idx = contacts.findIndex((c) => c.id === id);
  if (idx !== -1) {
    const today = new Date().toISOString().split("T")[0];
    const followUp = new Date();
    followUp.setDate(followUp.getDate() + 4);
    contacts[idx].status = "Email Sent";
    contacts[idx].lastContacted = today;
    contacts[idx].followUpDate = followUp.toISOString().split("T")[0];
    contacts[idx].timeline.push({ date: today, action: "Email Sent" });
    saveContacts(contacts);
  }
  return contacts;
}

export function markFollowUpSent(id: string) {
  const contacts = getContacts();
  const idx = contacts.findIndex((c) => c.id === id);
  if (idx !== -1) {
    const today = new Date().toISOString().split("T")[0];
    const nextFollowUp = new Date();
    nextFollowUp.setDate(nextFollowUp.getDate() + 6);
    contacts[idx].status = "Follow-up Sent";
    contacts[idx].lastContacted = today;
    contacts[idx].followUpDate = nextFollowUp.toISOString().split("T")[0];
    contacts[idx].timeline.push({ date: today, action: "Follow-up Sent" });
    saveContacts(contacts);
  }
  return contacts;
}

export function markReplied(id: string) {
  const contacts = getContacts();
  const idx = contacts.findIndex((c) => c.id === id);
  if (idx !== -1) {
    const today = new Date().toISOString().split("T")[0];
    contacts[idx].status = "Replied";
    contacts[idx].lastContacted = today;
    contacts[idx].followUpDate = "";
    contacts[idx].timeline.push({ date: today, action: "Replied" });
    saveContacts(contacts);
  }
  return contacts;
}

export function getTemplates(): EmailTemplate[] {
  const stored = localStorage.getItem(TEMPLATES_KEY);
  if (!stored) {
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(DEFAULT_TEMPLATES));
    return DEFAULT_TEMPLATES;
  }
  return JSON.parse(stored);
}

export function saveTemplates(templates: EmailTemplate[]) {
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
}

export function addTemplate(template: Omit<EmailTemplate, "id">): EmailTemplate {
  const templates = getTemplates();
  const newTemplate = { ...template, id: generateId() };
  templates.push(newTemplate);
  saveTemplates(templates);
  return newTemplate;
}

export function deleteTemplate(id: string) {
  const templates = getTemplates().filter((t) => t.id !== id);
  saveTemplates(templates);
  return templates;
}

export function getDailyGoal(): number {
  return parseInt(localStorage.getItem(DAILY_GOAL_KEY) || "20", 10);
}

export function setDailyGoal(goal: number) {
  localStorage.setItem(DAILY_GOAL_KEY, goal.toString());
}
