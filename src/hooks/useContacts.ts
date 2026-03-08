import { useState, useCallback, useEffect } from "react";
import { Contact } from "@/lib/types";
import { fetchContacts, addContactToSheet, updateContactInSheet, deleteContactFromSheet } from "@/lib/sheetsApi";
import { toast } from "sonner";

export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchContacts();
      setContacts(data);
    } catch (err) {
      console.error("Failed to fetch contacts:", err);
      toast.error("Failed to load contacts from Google Sheets");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const add = useCallback(
    async (c: { name: string; email: string; title: string; company: string }) => {
      try {
        await addContactToSheet(c);
        await refresh();
        toast.success("Contact added to Google Sheets");
      } catch (err) {
        console.error("Failed to add contact:", err);
        toast.error("Failed to add contact");
      }
    },
    [refresh]
  );

  const update = useCallback(
    async (id: string, updates: Partial<Contact>) => {
      try {
        await updateContactInSheet(id, updates);
        await refresh();
      } catch (err) {
        console.error("Failed to update contact:", err);
        toast.error("Failed to update contact");
      }
    },
    [refresh]
  );

  const remove = useCallback(
    async (id: string) => {
      try {
        await deleteContactFromSheet(id);
        await refresh();
        toast.success("Contact deleted");
      } catch (err) {
        console.error("Failed to delete contact:", err);
        toast.error("Failed to delete contact");
      }
    },
    [refresh]
  );

  const emailSent = useCallback(
    async (id: string) => {
      const contact = contacts.find((c) => c.id === id);
      if (!contact) return;
      const today = new Date().toISOString().split("T")[0];
      const followUp = new Date();
      followUp.setDate(followUp.getDate() + 4);
      await update(id, {
        status: "Email Sent",
        lastContacted: today,
        followUpDate: followUp.toISOString().split("T")[0],
        timeline: [...contact.timeline, { date: today, action: "Email Sent" }],
      });
    },
    [contacts, update]
  );

  const followUpSent = useCallback(
    async (id: string) => {
      const contact = contacts.find((c) => c.id === id);
      if (!contact) return;
      const today = new Date().toISOString().split("T")[0];
      const nextFollowUp = new Date();
      nextFollowUp.setDate(nextFollowUp.getDate() + 6);
      await update(id, {
        status: "Follow-up Sent",
        lastContacted: today,
        followUpDate: nextFollowUp.toISOString().split("T")[0],
        timeline: [...contact.timeline, { date: today, action: "Follow-up Sent" }],
      });
    },
    [contacts, update]
  );

  const replied = useCallback(
    async (id: string) => {
      const contact = contacts.find((c) => c.id === id);
      if (!contact) return;
      const today = new Date().toISOString().split("T")[0];
      await update(id, {
        status: "Replied",
        lastContacted: today,
        followUpDate: "",
        timeline: [...contact.timeline, { date: today, action: "Replied" }],
      });
    },
    [contacts, update]
  );

  return { contacts, loading, add, update, remove, emailSent, followUpSent, replied, refresh };
}
