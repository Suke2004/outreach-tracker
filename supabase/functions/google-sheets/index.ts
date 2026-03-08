import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SPREADSHEET_ID = "1mk4Ryz69DgaHYTf9dgckjTbv-UmZtQRAQDircsBSUiI";
let SHEET_NAME = "Sheet1";

async function getSheetName(token: string): Promise<string> {
  const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}?fields=sheets.properties.title`, {
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  });
  const data = await res.json();
  if (data.sheets && data.sheets.length > 0) {
    return data.sheets[0].properties.title;
  }
  return "Sheet1";
}

async function getAccessToken(): Promise<string> {
  const keyJson = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_KEY");
  if (!keyJson) throw new Error("GOOGLE_SERVICE_ACCOUNT_KEY not configured");
  
  console.log("Key starts with:", keyJson.substring(0, 20));
  
  let key;
  try {
    key = JSON.parse(keyJson);
  } catch (e) {
    throw new Error(`Failed to parse service account key: ${e}. First 50 chars: ${keyJson.substring(0, 50)}`);
  }
  
  // Create JWT
  const header = { alg: "RS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const claim = {
    iss: key.client_email,
    scope: "https://www.googleapis.com/auth/spreadsheets",
    aud: key.token_uri,
    iat: now,
    exp: now + 3600,
  };

  const encode = (obj: unknown) => btoa(JSON.stringify(obj)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const unsignedToken = `${encode(header)}.${encode(claim)}`;

  // Import key and sign
  const pemContents = key.private_key
    .replace("-----BEGIN PRIVATE KEY-----", "")
    .replace("-----END PRIVATE KEY-----", "")
    .replace(/\n/g, "");
  const binaryKey = Uint8Array.from(atob(pemContents), (c) => c.charCodeAt(0));
  
  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8",
    binaryKey,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    cryptoKey,
    new TextEncoder().encode(unsignedToken)
  );

  const signatureB64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

  const jwt = `${unsignedToken}.${signatureB64}`;

  // Exchange JWT for access token
  const tokenRes = await fetch(key.token_uri, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });

  const tokenData = await tokenRes.json();
  if (!tokenRes.ok) throw new Error(`Token error: ${JSON.stringify(tokenData)}`);
  return tokenData.access_token;
}

async function sheetsApi(path: string, options: RequestInit = {}) {
  const token = await getAccessToken();
  const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}${path}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Sheets API error: ${JSON.stringify(data)}`);
  return data;
}

// Headers expected in the sheet
const HEADERS = ["SNo", "Name", "Email", "Title", "Company", "Status", "LastContacted", "FollowUpDate", "Response", "Notes", "Timeline"];

async function ensureHeaders() {
  const data = await sheetsApi(`/values/${SHEET_NAME}!A1:K1`);
  if (!data.values || data.values.length === 0 || data.values[0][0] !== "SNo") {
    await sheetsApi(`/values/${SHEET_NAME}!A1:K1?valueInputOption=RAW`, {
      method: "PUT",
      body: JSON.stringify({ values: [HEADERS] }),
    });
  }
}

function rowToContact(row: string[], index: number) {
  return {
    id: `row_${index + 2}`, // row number in sheet (1-indexed + header)
    sno: parseInt(row[0]) || index + 1,
    name: row[1] || "",
    email: row[2] || "",
    title: row[3] || "",
    company: row[4] || "",
    status: row[5] || "Not Contacted",
    lastContacted: row[6] || "",
    followUpDate: row[7] || "",
    response: row[8] || "",
    notes: row[9] || "",
    timeline: row[10] ? JSON.parse(row[10]) : [],
  };
}

function contactToRow(c: { sno: number; name: string; email: string; title: string; company: string; status: string; lastContacted: string; followUpDate: string; response: string; notes: string; timeline: unknown[] }) {
  return [
    String(c.sno),
    c.name,
    c.email,
    c.title,
    c.company,
    c.status,
    c.lastContacted,
    c.followUpDate,
    c.response,
    c.notes,
    JSON.stringify(c.timeline || []),
  ];
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get("action");

    // Resolve actual sheet name
    const token = await getAccessToken();
    SHEET_NAME = await getSheetName(token);
    console.log("Using sheet name:", SHEET_NAME);

    await ensureHeaders();

    if (req.method === "GET" && action === "list") {
      const data = await sheetsApi(`/values/${SHEET_NAME}!A2:K1000`);
      const rows = data.values || [];
      const contacts = rows.map((row: string[], i: number) => rowToContact(row, i));
      return new Response(JSON.stringify(contacts), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (req.method === "POST" && action === "add") {
      const contact = await req.json();
      // Get current row count
      const data = await sheetsApi(`/values/${SHEET_NAME}!A:A`);
      const nextRow = (data.values?.length || 1) + 1;
      const sno = nextRow - 1;
      const newContact = { ...contact, sno, status: "Not Contacted", lastContacted: "", followUpDate: "", response: "", notes: "", timeline: [] };
      const row = contactToRow(newContact);
      await sheetsApi(`/values/${SHEET_NAME}!A${nextRow}:K${nextRow}?valueInputOption=RAW`, {
        method: "PUT",
        body: JSON.stringify({ values: [row] }),
      });
      return new Response(JSON.stringify({ ...newContact, id: `row_${nextRow}` }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (req.method === "POST" && action === "update") {
      const { id, updates } = await req.json();
      const rowNum = parseInt(id.replace("row_", ""));
      // Read current row
      const data = await sheetsApi(`/values/${SHEET_NAME}!A${rowNum}:K${rowNum}`);
      if (!data.values || data.values.length === 0) throw new Error("Row not found");
      const current = rowToContact(data.values[0], rowNum - 2);
      const updated = { ...current, ...updates };
      const row = contactToRow(updated);
      await sheetsApi(`/values/${SHEET_NAME}!A${rowNum}:K${rowNum}?valueInputOption=RAW`, {
        method: "PUT",
        body: JSON.stringify({ values: [row] }),
      });
      return new Response(JSON.stringify(updated), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (req.method === "POST" && action === "delete") {
      const { id } = await req.json();
      const rowNum = parseInt(id.replace("row_", ""));
      // Clear the row
      await sheetsApi(`/values/${SHEET_NAME}!A${rowNum}:K${rowNum}:clear`, { method: "POST" });
      return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error: unknown) {
    console.error("Error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
