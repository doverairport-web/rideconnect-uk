# RideConnect UK

Public website and online booking for **RideConnectUk**.  
Standalone from `doverorionandcarecars.co.uk`. Bookings go to dispatch (Airtable today; your own API later).

Domain can be `dovertaxi.co.uk` or another host — set `NEXT_PUBLIC_SITE_URL` in `.env.local`.

> If the domain still opens the old “Orion & Care Cars” site, fix DNS in 123reg (see below).

## Quick start

```bash
cd ~/Projects/dovertaxi
npm install
cp .env.example .env.local
# Edit .env.local — add AIRTABLE_TOKEN and your phone number
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Purpose |
|----------|---------|
| `AIRTABLE_TOKEN` | Personal access token with write access to Bookings |
| `AIRTABLE_BASE_ID` | Defaults to your existing RideConnect base |
| `AIRTABLE_TABLE_NAME` | Defaults to `Bookings` |
| `NEXT_PUBLIC_PHONE` | Shown in header / hero (e.g. `+441302123456`) |
| `NEXT_PUBLIC_EMAIL` | Shown in footer |

## Deploy on Vercel (recommended)

1. Push this repo to GitHub.
2. Import the project at [vercel.com](https://vercel.com).
3. Add the environment variables from `.env.example`.
4. Deploy — you will get a `*.vercel.app` URL to test first.

## Disconnect from doverorionandcarecars.co.uk (123reg)

Do this **before** pointing the domain at this project:

1. **123reg** → `dovertaxi.co.uk` → **Manage DNS** / **Domain forwarding**.
2. **Remove** any of these if present:
   - **URL redirect / web forwarding** to `doverorionandcarecars.co.uk` (or www)
   - **CNAME** to Wix, Squarespace, Weebly, or the old site builder
   - **A records** that still point at the old hosting IP
3. If the old site used **123reg Website Builder**, disconnect the domain from that product so DNS is free to edit.
4. Leave `doverorionandcarecars.co.uk` unchanged — only change **dovertaxi.co.uk**.

After deploy, only **this** Next.js app should answer on `dovertaxi.co.uk`. No links to the Care Cars site are included in this codebase.

## Connect dovertaxi.co.uk to this site (123reg + Vercel)

In **123reg** → your domain → **Manage DNS** (or Advanced DNS).

In **Vercel** → Project → **Settings** → **Domains** → add:

- `dovertaxi.co.uk`
- `www.dovertaxi.co.uk`

Use the records Vercel shows. Typical setup:

| Host | Type | Value |
|------|------|--------|
| `www` | CNAME | `cname.vercel-dns.com` |
| `@` | A | `76.76.21.21` |

DNS can take up to 48 hours. HTTPS is automatic on Vercel.

**Tip:** In Vercel, set the primary domain to `www.dovertaxi.co.uk` and redirect bare `dovertaxi.co.uk` to www (or the reverse — pick one and stick to it).

## How bookings flow

1. Customer submits the form on the website.
2. `POST /api/bookings` validates the data.
3. A row is created in Airtable with `Dispatch Mode: Web`.
4. Dispatch reviews (or auto-offers to drivers when your automation is ready).
5. Driver assignment uses the same process as AI phone bookings.

When your custom dispatch app replaces Airtable, change only `src/lib/booking.ts` to call your new API — the website form stays the same.

## Project structure

- `src/app/page.tsx` — landing page
- `src/components/BookingForm.tsx` — booking UI
- `src/app/api/bookings/route.ts` — API endpoint
- `src/lib/booking.ts` — Airtable mapping (shared logic)
