#!/usr/bin/env bash
set -euo pipefail

TARGET="76.76.21.21"
CNAME_TARGET="cname.vercel-dns.com"

DOMAINS=(
  dovertaxi.co.uk
  rideconnectuk.com
  dovertogatwicktaxi.com
  oriontaxis.co.uk
)

ok=0
fail=0

echo "RideConnect UK network — DNS check (expect A @ → ${TARGET})"
echo ""

for domain in "${DOMAINS[@]}"; do
  echo "── ${domain}"
  A_RECORDS=$(dig +short "${domain}" A 2>/dev/null | sort -u || true)

  if [[ -z "${A_RECORDS}" ]]; then
    echo "  ❌ No A records"
    ((fail++)) || true
    echo ""
    continue
  fi

  echo "  A: ${A_RECORDS//$'\n'/, }"

  if echo "${A_RECORDS}" | grep -qx "${TARGET}"; then
    CODE=$(curl -sS -m 15 -o /dev/null -w "%{http_code}" "https://${domain}/" 2>/dev/null || echo "000")
    TITLE=$(curl -sS -m 15 -L "https://${domain}/" 2>/dev/null | rg -o '<title>[^<]+</title>' -m1 | sed 's/<[^>]*>//g' || echo "")
    if [[ "${CODE}" == "200" ]] && echo "${TITLE}" | rg -qi "RideConnect|Dover Taxi|Gatwick"; then
      echo "  ✅ HTTPS ${CODE} — ${TITLE}"
      ((ok++)) || true
    elif [[ "${CODE}" == "200" ]]; then
      echo "  ⚠️  HTTPS ${CODE} but title looks wrong: ${TITLE}"
      ((fail++)) || true
    else
      echo "  ⚠️  DNS OK, HTTPS returned ${CODE} — wait for SSL"
      ((ok++)) || true
    fi
  else
    echo "  ❌ Still on old hosting (not Vercel). Fix in GoDaddy → DNS:"
    echo "     Delete parking A records, add:  @  A  ${TARGET}"
    echo "     Add:  www  CNAME  ${CNAME_TARGET}"
    ((fail++)) || true
  fi
  echo ""
done

echo "Summary: ${ok} OK, ${fail} need DNS fix"
echo ""
echo "All four domains must be on Vercel project: dovertaxi"
echo "GoDaddy DNS (domaincontrol.com nameservers):"
echo "  @   A      ${TARGET}"
echo "  www CNAME  ${CNAME_TARGET}"
echo ""
echo "dispatch.rideconnectuk.com stays on rideconnect-dispatch project."

if [[ "${fail}" -gt 0 ]]; then
  exit 1
fi
