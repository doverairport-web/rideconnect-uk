# RideConnectUk — nasazení LIVE (dovertaxi.co.uk)

## Krok 1 — nahrát kód na GitHub (5 min)

Kód je commitnutý lokálně. V **Cursoru**:

1. Vlevo ikona **větve** (Source Control)
2. Tlačítko **Publish Branch** nebo **Sync / Push**
3. Přihlásit se GitHub → repo: **doverairport-web/rideconnect-uk**

Nebo v terminálu (po přihlášení GitHub):

```bash
cd ~/Projects/dovertaxi
git push -u origin main
```

Ověření: https://github.com/doverairport-web/rideconnect-uk — musí tam být soubory `src/`, `public/images/`.

---

## Krok 2 — Vercel (10 min)

1. https://vercel.com → **Sign up / Log in** → **Continue with GitHub**
2. **Add New → Project** → vyberte **rideconnect-uk** → **Import**
3. **Deploy** (nechte výchozí nastavení Next.js)

### Environment Variables (Settings → Environment Variables)

| Name | Value |
|------|--------|
| `NEXT_PUBLIC_SITE_URL` | `https://dovertaxi.co.uk` |
| `NEXT_PUBLIC_PHONES` | `01304350125,01304208208,01304350777` |
| `NEXT_PUBLIC_EMAIL` | `doverairport@gmail.com` |
| `NEXT_PUBLIC_WHATSAPP` | `07405327650` |
| `AIRTABLE_TOKEN` | *(váš token — rezervace bez něj neuloží)* |
| `AIRTABLE_BASE_ID` | `appp3gYwPeng1JnRG` |
| `AIRTABLE_TABLE_NAME` | `Bookings` |

4. **Deployments** → **Redeploy** (po přidání proměnných)

Test: otevřete `https://rideconnect-uk.vercel.app` (název se může mírně lišit).

---

## Krok 3 — doména dovertaxi.co.uk v 123reg

### A) Zrušit staré přesměrování

123reg → **dovertaxi.co.uk** → **Domain forwarding**  
→ smažte redirect na `doverorionandcarecars.co.uk`.

### B) Přidat doménu ve Vercelu

Vercel → projekt → **Settings → Domains** → přidat:

- `dovertaxi.co.uk`
- `www.dovertaxi.co.uk`

Vercel ukáže DNS záznamy. Typicky:

| Host | Type | Value |
|------|------|--------|
| `@` | **A** | `76.76.21.21` |
| `www` | **CNAME** | `cname.vercel-dns.com` |

*(Použijte přesné hodnoty z Vercelu.)*

### C) Nastavit DNS v 123reg

**Manage DNS / Advanced DNS** → přidat záznamy → uložit.

Po 15 min – 24 h: **https://dovertaxi.co.uk** → RideConnectUk web. HTTPS automaticky.

---

## Krok 4 — kontrola

- [ ] Web se načte na dovertaxi.co.uk
- [ ] Telefony, e-mail, WhatsApp v patičce
- [ ] Sekce Prices (Hackney ceník)
- [ ] Test rezervace → řádek v Airtable *(potřebuje AIRTABLE_TOKEN)*

---

## Bez GitHubu (alternativa)

```bash
cd ~/Projects/dovertaxi
npx vercel login
npx vercel --prod
```

Pak doménu připojit ve Vercel panelu stejně jako výše.
