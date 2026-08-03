#!/usr/bin/env bash
# 03-deploy-stack.sh — creates the /opt/rideconnect structure, generates
# secrets on first run, and starts the infrastructure stack. Idempotent.
# Expects the infra bundle to have been uploaded to /opt/rideconnect already
# (docker-compose.yml, nginx/, monitoring/, scripts/).
set -euo pipefail

BASE=/opt/rideconnect

echo "==> Deployment directory structure"
mkdir -p "$BASE"/{apps/dispatch,apps/contact-center,apps/api,database,nginx/conf.d,nginx/html,nginx/certbot/www,nginx/letsencrypt,monitoring,backups,scripts}

echo "==> Secrets (.env) — generated once, never overwritten"
if [ ! -f "$BASE/.env" ]; then
  cat > "$BASE/.env" <<EOF
POSTGRES_PASSWORD=$(openssl rand -hex 24)
REDIS_PASSWORD=$(openssl rand -hex 24)
GRAFANA_ADMIN_PASSWORD=$(openssl rand -hex 16)
EOF
  chmod 600 "$BASE/.env"
  echo "Generated new $BASE/.env"
else
  echo "$BASE/.env already exists — keeping existing secrets"
fi

echo "==> Starting stack"
cd "$BASE"
docker compose pull
docker compose up -d --remove-orphans

echo "==> Waiting for health"
sleep 10
docker compose ps

echo "==> Stack deployed."
