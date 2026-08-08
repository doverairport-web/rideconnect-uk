#!/usr/bin/env bash
# backup.sh — nightly backup of PostgreSQL, Docker volumes and configuration.
# Run by systemd timer (rideconnect-backup.timer) at 02:30 Europe/London.
# Keeps 7 daily backups locally in /opt/rideconnect/backups.
set -euo pipefail

BASE=/opt/rideconnect
DEST="$BASE/backups/$(date +%F)"
RETENTION_DAYS=7

mkdir -p "$DEST"
# Backups contain database dumps and .env secrets — keep them root-only.
chmod 700 "$BASE/backups" "$DEST"

echo "==> [1/3] PostgreSQL dump"
docker exec rc-postgres pg_dumpall -U rideconnect | gzip > "$DEST/postgres-all.sql.gz"

echo "==> [2/3] Docker volumes"
for vol in rideconnect_pg_data rideconnect_redis_data rideconnect_portainer_data \
           rideconnect_grafana_data rideconnect_prometheus_data rideconnect_loki_data; do
  if docker volume inspect "$vol" >/dev/null 2>&1; then
    docker run --rm -v "$vol":/data:ro -v "$DEST":/backup alpine \
      tar czf "/backup/${vol}.tar.gz" -C /data .
  fi
done

echo "==> [3/3] Configuration"
tar czf "$DEST/config.tar.gz" \
  -C / \
  opt/rideconnect/docker-compose.yml \
  opt/rideconnect/.env \
  opt/rideconnect/nginx \
  opt/rideconnect/monitoring \
  opt/rideconnect/scripts \
  etc/fail2ban/jail.local \
  etc/ssh/sshd_config.d \
  2>/dev/null || true

echo "==> Restricting backup file permissions (contain secrets)"
chmod -R go-rwx "$DEST"

echo "==> Pruning backups older than ${RETENTION_DAYS} days"
find "$BASE/backups" -mindepth 1 -maxdepth 1 -type d -mtime +"$RETENTION_DAYS" -exec rm -rf {} +

du -sh "$DEST"
echo "Backup complete: $DEST"

# Off-site sync (encrypted). Safe no-op until credentials are configured.
if [ -x "$BASE/scripts/offsite-backup.sh" ]; then
  echo "==> Off-site sync"
  "$BASE/scripts/offsite-backup.sh" || echo "WARN: off-site sync failed (local backup is intact)"
fi
