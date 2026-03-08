import { Contact } from "./types";

const FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/google-sheets`;
const AUTH_HEADER = `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`;

async function callSheets(action: string, method: "GET" | "POST" = "GET", body?: unknown): Promise<unknown> {
  const res = await fetch(`${FUNCTION_URL}?action=${action}`, {
    method,
    headers: {
      "Authorization": AUTH_HEADER,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }
  return res.json();
}

export async function fetchContacts(): Promise<Contact[]> {
  return await callSheets("list") as Contact[];
}

export async function addContactToSheet(contact: { name: string; email: string; title: string; company: string }): Promise<Contact> {
  return await callSheets("add", "POST", contact) as Contact;
}

export async function updateContactInSheet(id: string, updates: Partial<Contact>): Promise<Contact> {
  return await callSheets("update", "POST", { id, updates }) as Contact;
}

export async function deleteContactFromSheet(id: string): Promise<void> {
  await callSheets("delete", "POST", { id });
}
