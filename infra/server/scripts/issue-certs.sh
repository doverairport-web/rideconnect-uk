#!/usr/bin/env bash
# issue-certs.sh — obtain Let's Encrypt certificates once DNS for the
# rideconnectuk.com domains points at this server (167.233.213.218).
# Usage: ./issue-certs.sh you@example.com
set -euo pipefail

EMAIL="${1:?Usage: issue-certs.sh <email>}"
BASE=/opt/rideconnect
DOMAINS=(rideconnectuk.com www.rideconnectuk.com dispatch.rideconnectuk.com contact.rideconnectuk.com api.rideconnectuk.com)

cd "$BASE"

for d in "${DOMAINS[@]}"; do
  echo "==> Requesting certificate for $d"
  docker compose run --rm certbot certonly \
    --webroot -w /var/www/certbot \
    -d "$d" \
    --email "$EMAIL" --agree-tos --no-eff-email --keep-until-expiring || {
      echo "WARN: cert for $d failed (DNS not pointing here yet?)"
    }
done

echo "==> Reloading nginx"
docker compose exec nginx nginx -s reload

echo
echo "After certs are issued, add 'listen 443 ssl;' blocks to the vhost files"
echo "in $BASE/nginx/conf.d (see SERVER.md for the template) and reload nginx."
echo
echo "Renewal: install a monthly cron/timer running:"
echo "  cd $BASE && docker compose run --rm certbot renew && docker compose exec nginx nginx -s reload"
