# SERVER.md — Operations Guide

## Server facts

| | |
|---|---|
| Host | Hetzner Cloud CPX22 |
| IP | 167.233.213.218 |
| OS | Ubuntu 24.04 LTS |
| Timezone | Europe/London |
| Swap | 2 GB `/swapfile`, swappiness 10 |
| SSH | key-only (password auth disabled), fail2ban protected |
| Firewall | ufw — inbound only 22, 80, 443 |

## Daily operations

### Stack control

```bash
cd /opt/rideconnect
docker compose ps               # status
docker compose logs -f nginx    # follow logs for one service
docker compose restart nginx    # restart one service
docker compose pull && docker compose up -d   # update images
```

### Database

```bash
docker exec -it rc-postgres psql -U rideconnect             # psql shell
docker exec rc-postgres pg_dumpall -U rideconnect > dump.sql # ad-hoc dump
```

### Redis

```bash
source /opt/rideconnect/.env
docker exec -it rc-redis redis-cli -a "$REDIS_PASSWORD"
```

### Monitoring access (SSH tunnels)

```bash
ssh -L 3000:127.0.0.1:3000 root@167.233.213.218   # Grafana  http://localhost:3000
ssh -L 9090:127.0.0.1:9090 root@167.233.213.218   # Prometheus
ssh -L 9443:127.0.0.1:9443 root@167.233.213.218   # Portainer https://localhost:9443
```

Grafana login: `admin` / `GRAFANA_ADMIN_PASSWORD` from `/opt/rideconnect/.env`.
Datasources (Prometheus + Loki) are provisioned automatically. Import dashboard
IDs **1860** (Node Exporter Full) and **14282** (cAdvisor) for host/container
views.

### Backups

- Nightly at 02:30 via systemd timer `rideconnect-backup.timer`
- Destination `/opt/rideconnect/backups/<YYYY-MM-DD>/`, 7-day retention
- Contents: `postgres-all.sql.gz`, one `.tar.gz` per Docker volume, `config.tar.gz`

```bash
systemctl list-timers rideconnect-backup.timer   # next run
/opt/rideconnect/scripts/backup.sh               # run now
journalctl -u rideconnect-backup.service         # last run log
```

**Recommended:** sync `/opt/rideconnect/backups` off-site (Hetzner Storage Box
or S3 via rclone) — local-only backups do not survive server loss.

## Domains / SSL

DNS A records to create (all → 167.233.213.218):

- `rideconnectuk.com`, `www.rideconnectuk.com`
- `dispatch.rideconnectuk.com`
- `contact.rideconnectuk.com`
- `api.rideconnectuk.com`

Once DNS resolves, issue certificates:

```bash
/opt/rideconnect/scripts/issue-certs.sh you@example.com
```

Then add an SSL server block per domain in `/opt/rideconnect/nginx/conf.d/`:

```nginx
server {
    listen 443 ssl;
    http2 on;
    server_name dispatch.rideconnectuk.com;
    ssl_certificate     /etc/letsencrypt/live/dispatch.rideconnectuk.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/dispatch.rideconnectuk.com/privkey.pem;
    # ... same locations as the port-80 block ...
}
```

and change the port-80 `location /` to `return 301 https://$host$request_uri;`
(keep the ACME location). Reload: `docker compose exec nginx nginx -s reload`.

Renewal (add to root crontab once certs exist):

```
0 3 1 * * cd /opt/rideconnect && docker compose run --rm certbot renew && docker compose exec nginx nginx -s reload
```

## Security posture

- ufw default-deny inbound; only 22/80/443 open
- fail2ban bans IPs after 5 failed SSH attempts (1 h ban)
- SSH: keys only, root login `prohibit-password`
- unattended-upgrades installs security patches automatically
- Postgres/Redis/Grafana/Prometheus/Portainer bound to 127.0.0.1 only
- Docker json-file logs capped at 3×10 MB per container
- Audit any time: `/opt/rideconnect/scripts/06-security-audit.sh`

## Adding a deploy user (optional, recommended later)

```bash
adduser --disabled-password deploy
usermod -aG docker deploy
mkdir -p /home/deploy/.ssh && cp /root/.ssh/authorized_keys /home/deploy/.ssh/
chown -R deploy:deploy /home/deploy/.ssh && chmod 700 /home/deploy/.ssh
```
