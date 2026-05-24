# RideConnectUk — co udělat vy (3 kroky)

Projekt je připravený na vašem Macu (`npm install` a build proběhly).

---

## Krok A — GitHub (jednou, ~5 minut)

1. Otevřete https://github.com/new  
2. Repository name: `rideconnect-uk`  
3. **Private** nebo Public — jak chcete  
4. **NEZAŠKRTÁVEJTE** „Add README“ (repo musí být prázdné)  
5. Klikněte **Create repository**  
6. Na stránce zkopírujte příkazy pod „push an existing repository“, nebo v Terminálu (nahraďte `VASE_GITHUB_JMENO`):

```bash
cd ~/Projects/dovertaxi
git remote add origin https://github.com/VASE_GITHUB_JMENO/rideconnect-uk.git
git push -u origin main
```

GitHub se zeptá na přihlášení — použijte svůj účet.

---

## Krok B — Vercel (jednou, ~10 minut)

1. https://vercel.com → **Sign Up** / **Log in** → **Continue with GitHub**  
2. **Add New… → Project** → vyberte `rideconnect-uk` → **Import**  
3. Nechte výchozí nastavení → **Deploy** (počkejte ~2 minuty)  
4. **Settings → Environment Variables** → přidejte:

| Name | Value |
|------|--------|
| `AIRTABLE_TOKEN` | token z airtable.com (viz níže) |
| `NEXT_PUBLIC_SITE_URL` | `https://dovertaxi.co.uk` |
| `NEXT_PUBLIC_PHONE` | vaše telefonní číslo |
| `NEXT_PUBLIC_EMAIL` | váš e-mail |

5. **Deployments** → u posledního deploye **⋯ → Redeploy**

Otestujte odkaz `https://rideconnect-uk.vercel.app` (název se může mírně lišit).

### Airtable token

1. https://airtable.com → váš base → **Help** → **API documentation**  
2. Vytvořte **Personal access token** s právem zapisovat do tabulky Bookings.

---

## Krok C — Doména v 123reg (~10 minut)

### C1 — Zrušit staré přesměrování

123reg → **dovertaxi.co.uk** → **Forwarding** / **DNS**  
→ smažte přesměrování na `doverorionandcarecars.co.uk`.

### C2 — Přidat doménu ve Vercelu

Vercel → váš projekt → **Settings → Domains**  
→ přidejte `dovertaxi.co.uk` a `www.dovertaxi.co.uk`.

### C3 — DNS v 123reg

Vercel ukáže přesné záznamy. Obvykle:

| Host | Type | Value |
|------|------|--------|
| `www` | CNAME | `cname.vercel-dns.com` |
| `@` | A | `76.76.21.21` |

Uložte. Za 15 min – 24 h bude fungovat **https://dovertaxi.co.uk**.

---

## Lokální náhled (kdykoli)

```bash
cd ~/Projects/dovertaxi
npm run dev
```

→ http://localhost:3000
