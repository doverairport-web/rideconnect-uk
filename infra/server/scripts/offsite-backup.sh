#!/usr/bin/env bash
# offsite-backup.sh — encrypted off-site sync of the latest local backup using
# rclone. Safe no-op until credentials are configured, so it can be installed and
# scheduled ahead of time.
#
# It uploads NOTHING unless BOTH of these exist and are readable:
#   /opt/rideconnect/secrets/rclone.conf   (rclone remotes, incl. a crypt remote)
#   /opt/rideconnect/secrets/offsite.env   (defines RCLONE_REMOTE, RETENTION_DAYS)
#
# The remote MUST be an rclone "crypt" remote (client-side encryption) wrapping
# either a Hetzner Storage Box (sftp) or an S3-compatible bucket (s3). See
# docs/OFFSITE_BACKUP.md for setup of both.
set -euo pipefail

BASE=/opt/rideconnect
SECRETS_DIR="$BASE/secrets"
RCLONE_CONF="$SECRETS_DIR/rclone.conf"
OFFSITE_ENV="$SECRETS_DIR/offsite.env"
HOSTNAME_TAG="$(hostname)"

log() { echo "[offsite $(date +%H:%M:%S)] $*"; }

# --- guard: only run when fully configured -----------------------------------
if [ ! -r "$RCLONE_CONF" ] || [ ! -r "$OFFSITE_ENV" ]; then
  log "off-site backup not configured (missing $RCLONE_CONF or $OFFSITE_ENV) — skipping."
  exit 0
fi
if ! command -v rclone >/dev/null 2>&1; then
  log "rclone not installed — skipping."
  exit 0
fi

# shellcheck disable=SC1090
source "$OFFSITE_ENV"
RETENTION_DAYS="${RETENTION_DAYS:-14}"
if [ -z "${RCLONE_REMOTE:-}" ]; then
  log "off-site backup not configured (RCLONE_REMOTE empty in offsite.env) — skipping."
  exit 0
fi

export RCLONE_CONFIG="$RCLONE_CONF"

LATEST="$(ls -1d "$BASE"/backups/*/ 2>/dev/null | tail -1 || true)"
if [ -z "$LATEST" ]; then
  log "no local backup found in $BASE/backups — nothing to upload."
  exit 0
fi
DAY="$(basename "$LATEST")"
DEST="$RCLONE_REMOTE/$HOSTNAME_TAG/$DAY"

# --- upload (encrypted client-side by the crypt remote) ----------------------
log "uploading $LATEST -> $DEST"
rclone copy "$LATEST" "$DEST" \
  --transfers 4 --checkers 8 --contimeout 30s --timeout 5m --retries 3 \
  --stats-one-line --log-level NOTICE

# --- verify: cryptcheck compares local vs decrypted remote -------------------
log "verifying upload integrity (cryptcheck)"
if rclone cryptcheck "$LATEST" "$DEST" --one-way --log-level NOTICE; then
  log "verification OK"
else
  log "VERIFICATION FAILED for $DEST" >&2
  exit 1
fi

# --- remote retention: purge dated dirs older than RETENTION_DAYS -------------
log "applying remote retention: keeping last ${RETENTION_DAYS} days"
CUTOFF="$(date -d "-${RETENTION_DAYS} days" +%Y-%m-%d)"
rclone lsf --dirs-only "$RCLONE_REMOTE/$HOSTNAME_TAG" 2>/dev/null | while read -r d; do
  name="${d%/}"
  # only touch YYYY-MM-DD dirs
  [[ "$name" =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}$ ]] || continue
  if [[ "$name" < "$CUTOFF" ]]; then
    log "purging old remote backup: $name"
    rclone purge "$RCLONE_REMOTE/$HOSTNAME_TAG/$name" || log "warn: could not purge $name"
  fi
done

log "off-site backup complete: $DEST"
