#!/usr/bin/env bash
# 07-install-offsite.sh — prepares encrypted off-site backup support with rclone.
# Installs rclone, creates a root-only secrets dir with 600 templates, and a
# systemd timer. Uploads NOTHING until you fill in the secrets. Idempotent.
set -euo pipefail

BASE=/opt/rideconnect
SECRETS_DIR="$BASE/secrets"

echo "==> Installing rclone"
if ! command -v rclone >/dev/null 2>&1; then
  apt-get update -y
  apt-get install -y rclone
fi
rclone version | head -1

echo "==> Secrets directory (root-only, 700)"
mkdir -p "$SECRETS_DIR"
chmod 700 "$SECRETS_DIR"

echo "==> offsite.env template (600) — never committed to Git"
if [ ! -f "$SECRETS_DIR/offsite.env" ]; then
  cat > "$SECRETS_DIR/offsite.env" <<'EOF'
# Which rclone remote to sync to. MUST be a crypt remote (client-side encryption).
# Examples: "offsite-crypt:rideconnect"
RCLONE_REMOTE=
# How many days of dated backups to keep OFF-SITE.
RETENTION_DAYS=14
EOF
  chmod 600 "$SECRETS_DIR/offsite.env"
  echo "created $SECRETS_DIR/offsite.env (fill in RCLONE_REMOTE)"
else
  echo "$SECRETS_DIR/offsite.env exists — leaving as is"
fi

echo "==> rclone.conf placeholder (600) — add remotes here or via 'rclone config'"
if [ ! -f "$SECRETS_DIR/rclone.conf" ]; then
  cat > "$SECRETS_DIR/rclone.conf" <<'EOF'
# Populate with 'rclone config' pointed at this file, e.g.:
#   RCLONE_CONFIG=/opt/rideconnect/secrets/rclone.conf rclone config
#
# Recommended layout (see docs/OFFSITE_BACKUP.md):
#   [offsite-remote]  -> the raw backend (Hetzner Storage Box via sftp, OR S3)
#   [offsite-crypt]   -> crypt remote wrapping offsite-remote (encrypts data+names)
#
# --- Option A: Hetzner Storage Box (SFTP) ---
# [offsite-remote]
# type = sftp
# host = uXXXXXX.your-storagebox.de
# user = uXXXXXX
# port = 23
# key_file = /opt/rideconnect/secrets/storagebox_ed25519
#
# --- Option B: S3-compatible (AWS/Wasabi/Backblaze/MinIO) ---
# [offsite-remote]
# type = s3
# provider = AWS
# access_key_id = ...
# secret_access_key = ...
# region = eu-central-1
# endpoint =
#
# --- Encryption wrapper (REQUIRED) ---
# [offsite-crypt]
# type = crypt
# remote = offsite-remote:rideconnect-backups
# password = <rclone obscure output>
# password2 = <rclone obscure output>
EOF
  chmod 600 "$SECRETS_DIR/rclone.conf"
  echo "created $SECRETS_DIR/rclone.conf (add remotes)"
else
  echo "$SECRETS_DIR/rclone.conf exists — leaving as is"
fi

chmod +x "$BASE/scripts/offsite-backup.sh"

echo "==> systemd service + timer (runs 03:15, after nightly local backup at 02:33)"
cat > /etc/systemd/system/rideconnect-offsite.service <<EOF
[Unit]
Description=RideConnect off-site encrypted backup sync
After=network-online.target rideconnect-backup.service
Wants=network-online.target

[Service]
Type=oneshot
ExecStart=$BASE/scripts/offsite-backup.sh
EOF

cat > /etc/systemd/system/rideconnect-offsite.timer <<'EOF'
[Unit]
Description=Run RideConnect off-site backup sync nightly at 03:15

[Timer]
OnCalendar=*-*-* 03:15:00
Persistent=true
RandomizedDelaySec=300

[Install]
WantedBy=timers.target
EOF

systemctl daemon-reload
systemctl enable --now rideconnect-offsite.timer
systemctl list-timers rideconnect-offsite.timer --no-pager | grep -E "NEXT|rideconnect" || true

echo
echo "Off-site support installed. It is currently a SAFE NO-OP until you:"
echo "  1. Add remotes to $SECRETS_DIR/rclone.conf (see docs/OFFSITE_BACKUP.md)"
echo "  2. Set RCLONE_REMOTE in $SECRETS_DIR/offsite.env"
echo "Then test with: $BASE/scripts/offsite-backup.sh"
