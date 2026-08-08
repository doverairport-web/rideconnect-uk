#!/usr/bin/env bash
# 04-harden-ssh.sh — disables SSH password login and root password login.
# ONLY run after confirming key-based login works. Idempotent.
set -euo pipefail

if [ ! -s /root/.ssh/authorized_keys ]; then
  echo "REFUSING: /root/.ssh/authorized_keys is empty — you would lock yourself out." >&2
  exit 1
fi

# sshd uses FIRST-match-wins across drop-ins loaded in lexical order. Cloud images
# ship /etc/ssh/sshd_config.d/50-cloud-init.conf with "PasswordAuthentication yes",
# which would win over our 99- file. Neutralise any conflicting directives in the
# other drop-ins so our hardening actually takes effect.
for f in /etc/ssh/sshd_config.d/*.conf; do
  [ "$f" = "/etc/ssh/sshd_config.d/99-rideconnect-hardening.conf" ] && continue
  sed -ri 's/^[[:space:]]*(PasswordAuthentication|PermitRootLogin|KbdInteractiveAuthentication|ChallengeResponseAuthentication)\b/# rideconnect-disabled \1/I' "$f"
done

cat > /etc/ssh/sshd_config.d/99-rideconnect-hardening.conf <<'EOF'
PasswordAuthentication no
KbdInteractiveAuthentication no
ChallengeResponseAuthentication no
PermitRootLogin prohibit-password
PermitEmptyPasswords no
X11Forwarding no
MaxAuthTries 4
LoginGraceTime 30
EOF

sshd -t
systemctl restart ssh
echo "SSH hardened: password auth disabled, root login key-only."
