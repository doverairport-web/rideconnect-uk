#!/usr/bin/env node
/**
 * One-time setup: create "Travel Subscribers" table in Airtable.
 *
 * Usage:
 *   AIRTABLE_TOKEN=patxxx node scripts/setup-kth-subscribers-airtable.mjs
 *
 * Optional:
 *   AIRTABLE_BASE_ID=appxxx (default from .env.example)
 *   AIRTABLE_SUBSCRIBERS_TABLE="Travel Subscribers"
 */

const token = process.env.AIRTABLE_TOKEN?.trim();
const baseId =
  process.env.AIRTABLE_BASE_ID?.trim() || "appp3gYwPeng1JnRG";
const tableName =
  process.env.AIRTABLE_SUBSCRIBERS_TABLE?.trim() || "Travel Subscribers";

if (!token) {
  console.error("Missing AIRTABLE_TOKEN.");
  console.error(
    "Run: AIRTABLE_TOKEN=patxxx node scripts/setup-kth-subscribers-airtable.mjs",
  );
  process.exit(1);
}

async function listTables() {
  const res = await fetch(
    `https://api.airtable.com/v0/meta/bases/${baseId}/tables`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`List tables failed (${res.status}): ${body}`);
  }
  const data = await res.json();
  return data.tables ?? [];
}

async function createTable() {
  const res = await fetch(
    `https://api.airtable.com/v0/meta/bases/${baseId}/tables`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: tableName,
        description:
          "Kent Travel Hub email subscribers — Dover travel updates.",
        fields: [
          { name: "Email", type: "email" },
          { name: "Source", type: "singleLineText" },
          {
            name: "Subscribed At",
            type: "singleLineText",
            description: "ISO timestamp from kenttravelhub.co.uk",
          },
        ],
      }),
    },
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Create table failed (${res.status}): ${body}`);
  }

  return res.json();
}

async function main() {
  console.log(`Base: ${baseId}`);
  console.log(`Table: ${tableName}`);

  const tables = await listTables();
  const exists = tables.some((t) => t.name === tableName);
  if (exists) {
    console.log(`✓ Table "${tableName}" already exists.`);
    return;
  }

  const created = await createTable();
  console.log(`✓ Created table "${created.name}" (id: ${created.id})`);
  console.log("Fields: Email, Source, Subscribed At");
  console.log("");
  console.log("Optional — add to Vercel production:");
  console.log(
    `  npx vercel env add AIRTABLE_SUBSCRIBERS_TABLE production`,
  );
  console.log(`  Value: ${tableName}`);
}

main().catch((error) => {
  console.error(error.message);
  if (/INVALID_PERMISSIONS|403|401/.test(error.message)) {
    console.error("");
    console.error(
      "Your Airtable token needs schema.bases:read and schema.bases:write scopes.",
    );
    console.error(
      "Or create the table manually: Email (email), Source (text), Subscribed At (text).",
    );
  }
  process.exit(1);
});
