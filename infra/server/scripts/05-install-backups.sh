#!/usr/bin/env bash
# 05-install-backups.sh — installs the nightly backup systemd timer. Idempotent.
set -euo pipefail

chmod +x /opt/rideconnect/scripts/backup.sh

cat > /etc/systemd/system/rideconnect-backup.service <<'EOF'
[Unit]
Description=RideConnect nightly backup
After=docker.service
Requires=docker.service

[Service]
Type=oneshot
ExecStart=/opt/rideconnect/scripts/backup.sh
EOF

cat > /etc/systemd/system/rideconnect-backup.timer <<'EOF'
[Unit]
Description=Run RideConnect backup nightly at 02:30

[Timer]
OnCalendar=*-*-* 02:30:00
Persistent=true
RandomizedDelaySec=300

[Install]
WantedBy=timers.target
EOF

systemctl daemon-reload
systemctl enable --now rideconnect-backup.timer
systemctl list-timers rideconnect-backup.timer --no-pager
echo "Backup timer installed."
