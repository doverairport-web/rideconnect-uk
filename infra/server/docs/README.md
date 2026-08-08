# RideConnect Production Infrastructure

Production server for RideConnect UK.

- **Provider:** Hetzner Cloud CPX22 (2 vCPU / 4 GB RAM / 80 GB disk)
- **OS:** Ubuntu 24.04 LTS
- **IP:** 167.233.213.218
- **Timezone:** Europe/London

## What runs here

| Service | Container | Access |
|---|---|---|
| Nginx (reverse proxy) | `rc-nginx` | ports 80/443 (public) |
| PostgreSQL 16 | `rc-postgres` | 127.0.0.1:5432 |
| Redis 7 | `rc-redis` | 127.0.0.1:6379 |
| Portainer | `rc-portainer` | 127.0.0.1:9443 (SSH tunnel) |
| Prometheus | `rc-prometheus` | 127.0.0.1:9090 (SSH tunnel) |
| Grafana | `rc-grafana` | 127.0.0.1:3000 (SSH tunnel) |
| Loki + Promtail | `rc-loki`, `rc-promtail` | internal |
| node-exporter, cAdvisor | `rc-node-exporter`, `rc-cadvisor` | internal |

Only nginx is exposed to the internet. Everything else binds to localhost and is
reached through an SSH tunnel, e.g.:

```bash
ssh -L 3000:127.0.0.1:3000 root@167.233.213.218   # then open http://localhost:3000 (Grafana)
ssh -L 9443:127.0.0.1:9443 root@167.233.213.218   # Portainer at https://localhost:9443
```

## Directory layout (`/opt/rideconnect`)

```
/opt/rideconnect
├── docker-compose.yml     # infrastructure stack
├── .env                   # generated secrets (chmod 600, never commit)
├── apps/
│   ├── dispatch/          # dispatch app (not deployed yet)
│   ├── contact-center/    # contact center app (not deployed yet)
│   └── api/               # API (not deployed yet)
├── database/              # DB init scripts / migrations
├── nginx/
│   ├── conf.d/            # vhosts: rideconnectuk.com + subdomains
│   ├── html/              # maintenance page
│   ├── certbot/www/       # ACME webroot
│   └── letsencrypt/       # certificates
├── monitoring/            # prometheus / grafana / loki / promtail configs
├── backups/               # nightly backups, 7 day retention
└── scripts/               # numbered setup + operational scripts
```

## Scripts

Run as root, in order, from `/opt/rideconnect/scripts`:

1. `01-secure-server.sh` — OS updates, swap, timezone, ufw, fail2ban, unattended-upgrades
2. `02-install-docker.sh` — Docker Engine + Compose plugin + log rotation
3. `03-deploy-stack.sh` — creates structure, generates `.env`, starts stack
4. `04-harden-ssh.sh` — disables password login (run only after key login verified!)
5. `05-install-backups.sh` — installs nightly backup systemd timer (02:30)
6. `06-security-audit.sh` — read-only audit; run any time
- `backup.sh` — the backup job itself (run manually to test)
- `issue-certs.sh <email>` — Let's Encrypt certs once DNS points here

All scripts are idempotent — re-running them is safe.

## Deploying the apps (later)

Each app gets a compose file in its `apps/<name>/` folder, joined to the
external `rideconnect_rideconnect` network. Then uncomment the `proxy_pass`
block in the matching nginx vhost and reload:

```bash
docker compose exec nginx nginx -s reload
```

## Secrets

`/opt/rideconnect/.env` holds `POSTGRES_PASSWORD`, `REDIS_PASSWORD`,
`GRAFANA_ADMIN_PASSWORD`. It is generated once by `03-deploy-stack.sh` and
never overwritten. Read it with `cat /opt/rideconnect/.env` on the server.

See `SERVER.md` for operations detail and `DISASTER_RECOVERY.md` for restore
procedures.
