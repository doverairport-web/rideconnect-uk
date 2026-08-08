#!/usr/bin/env bash
# 06-security-audit.sh — verifies firewall, docker, open ports, ssh,
# nginx and postgres configuration. Read-only; safe to run any time.
set -uo pipefail

PASS=0; FAIL=0
ok()   { echo "  [OK]   $1"; PASS=$((PASS+1)); }
bad()  { echo "  [FAIL] $1"; FAIL=$((FAIL+1)); }

echo "== FIREWALL =="
ufw status | grep -q "Status: active" && ok "ufw active" || bad "ufw not active"
ufw status | grep -qE "80/tcp.*ALLOW" && ok "HTTP allowed" || bad "HTTP rule missing"
ufw status | grep -qE "443/tcp.*ALLOW" && ok "HTTPS allowed" || bad "HTTPS rule missing"
ufw status | grep -qiE "OpenSSH|22/tcp" && ok "SSH allowed" || bad "SSH rule missing"

echo "== SSH =="
SSHD_CONF="$(sshd -T 2>/dev/null)"
echo "$SSHD_CONF" | grep -qi "^passwordauthentication no" \
  && ok "password auth disabled" || bad "password auth still enabled"
echo "$SSHD_CONF" | grep -qiE "^permitrootlogin (prohibit-password|without-password|no)" \
  && ok "root password login disabled" || bad "root password login allowed"
systemctl is-active --quiet fail2ban && ok "fail2ban running" || bad "fail2ban not running"
fail2ban-client status sshd >/dev/null 2>&1 && ok "fail2ban sshd jail active" || bad "sshd jail missing"

echo "== PUBLIC PORTS (should be only 22, 80, 443) =="
LISTEN=$(ss -tlnp | awk 'NR>1 {print $4}' | grep -vE '^(127\.|\[::1\])' | awk -F: '{print $NF}' | sort -un | tr '\n' ' ')
echo "  Listening publicly on: $LISTEN"
EXTRA=$(echo "$LISTEN" | tr ' ' '\n' | grep -vE '^(22|80|443)$' | grep -v '^$' || true)
[ -z "$EXTRA" ] && ok "no unexpected public ports" || bad "unexpected public ports: $EXTRA"

echo "== DOCKER =="
systemctl is-active --quiet docker && ok "docker running" || bad "docker not running"
docker compose -f /opt/rideconnect/docker-compose.yml ps --format '{{.Name}} {{.State}}' 2>/dev/null | while read -r name state; do
  [ "$state" = "running" ] && echo "  [OK]   $name running" || echo "  [FAIL] $name state=$state"
done
grep -q max-size /etc/docker/daemon.json 2>/dev/null && ok "docker log rotation configured" || bad "no docker log rotation"

echo "== POSTGRES =="
docker port rc-postgres 2>/dev/null | grep -q "127.0.0.1" && ok "postgres bound to localhost only" || bad "postgres publicly exposed"
docker exec rc-postgres pg_isready -U rideconnect >/dev/null 2>&1 && ok "postgres accepting connections" || bad "postgres not ready"

echo "== NGINX =="
docker exec rc-nginx nginx -t >/dev/null 2>&1 && ok "nginx config valid" || bad "nginx config invalid"
RAW_CODE=$(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1/ || true)
case "$RAW_CODE" in
  000|444) ok "default vhost rejects unknown hosts (code=$RAW_CODE)" ;;
  *)       bad "default vhost responds to raw IP (code=$RAW_CODE)" ;;
esac

echo "== UPDATES =="
systemctl is-active --quiet unattended-upgrades && ok "unattended-upgrades running" || bad "unattended-upgrades not running"

echo "== SWAP / TIME =="
swapon --show | grep -q swapfile && ok "swap active" || bad "no swap"
timedatectl show -p Timezone --value | grep -q "Europe/London" && ok "timezone Europe/London" || bad "wrong timezone"

echo
echo "AUDIT RESULT: $PASS passed, $FAIL failed"
exit "$([ "$FAIL" -eq 0 ] && echo 0 || echo 1)"
