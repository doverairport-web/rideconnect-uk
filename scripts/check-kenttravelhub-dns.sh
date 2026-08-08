#!/usr/bin/env bash
set -euo pipefail

TARGET="76.76.21.21"
DOMAIN="kenttravelhub.co.uk"

echo "Checking DNS for ${DOMAIN}..."
echo "Expected A record: ${TARGET}"
echo ""

A_RECORDS=$(dig +short "${DOMAIN}" A 2>/dev/null | sort -u || true)

if [[ -z "${A_RECORDS}" ]]; then
  echo "❌ No A records found."
  exit 1
fi

echo "Current A records:"
echo "${A_RECORDS}"
echo ""

if echo "${A_RECORDS}" | grep -qx "${TARGET}"; then
  echo "✅ DNS looks correct. Testing HTTPS..."
  CODE=$(curl -sS -m 15 -o /dev/null -w "%{http_code}" "https://${DOMAIN}" 2>/dev/null || echo "000")
  if [[ "${CODE}" == "200" ]]; then
    echo "✅ https://${DOMAIN} is live (HTTP ${CODE})"
    exit 0
  fi
  echo "⚠️  DNS OK but HTTPS returned ${CODE} — wait a few minutes for SSL."
  exit 0
fi

echo "❌ DNS still points to GoDaddy parking, not Vercel."
echo ""
echo "Registrar: 123-reg (same as homekent.co.uk)"
echo "Fix in 123-reg → kenttravelhub.co.uk → Manage DNS:"
echo "  Delete A records: 76.223.67.189, 13.248.213.45"
echo "  Add A @ → ${TARGET}"
echo "  Add CNAME www → cname.vercel-dns.com"
echo ""
echo "If nameservers show domaincontrol.com, switch back to 123-reg DNS first."
echo ""
echo "Interim URL: https://dovertaxi.co.uk/kenttravelhub"
exit 1
