#!/usr/bin/env bash
# 01-secure-server.sh — base OS hardening. Idempotent; safe to re-run.
# Updates Ubuntu, creates swap, sets timezone, installs fail2ban + ufw,
# enables unattended security upgrades.
set -euo pipefail

export DEBIAN_FRONTEND=noninteractive

echo "==> Updating Ubuntu and installing security updates"
apt-get update -y
apt-get -o Dpkg::Options::="--force-confdef" -o Dpkg::Options::="--force-confold" upgrade -y
apt-get autoremove -y

echo "==> Installing base packages"
apt-get install -y ufw fail2ban unattended-upgrades apt-listchanges \
  curl ca-certificates gnupg jq htop

echo "==> Timezone Europe/London"
timedatectl set-timezone Europe/London

echo "==> Swap (2G, CPX22 has 4GB RAM)"
if ! swapon --show | grep -q '/swapfile'; then
  if [ ! -f /swapfile ]; then
    fallocate -l 2G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
  fi
  swapon /swapfile
fi
grep -q '^/swapfile' /etc/fstab || echo '/swapfile none swap sw 0 0' >> /etc/fstab
# Sensible swappiness for a server
sysctl -w vm.swappiness=10 >/dev/null
grep -q '^vm.swappiness' /etc/sysctl.d/99-rideconnect.conf 2>/dev/null || \
  echo 'vm.swappiness=10' > /etc/sysctl.d/99-rideconnect.conf

echo "==> UFW: default deny inbound; allow SSH/HTTP/HTTPS"
ufw default deny incoming
ufw default allow outgoing
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

echo "==> fail2ban: protect sshd"
cat > /etc/fail2ban/jail.local <<'EOF'
[DEFAULT]
bantime  = 1h
findtime = 10m
maxretry = 5
backend  = systemd

[sshd]
enabled = true
EOF
systemctl enable --now fail2ban
systemctl restart fail2ban

echo "==> Automatic security updates"
cat > /etc/apt/apt.conf.d/20auto-upgrades <<'EOF'
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Unattended-Upgrade "1";
APT::Periodic::AutocleanInterval "7";
EOF
systemctl enable --now unattended-upgrades

echo "==> Done. Reboot recommended if a new kernel was installed:"
[ -f /var/run/reboot-required ] && cat /var/run/reboot-required || echo "No reboot required."
