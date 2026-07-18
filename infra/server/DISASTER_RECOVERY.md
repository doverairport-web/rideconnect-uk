# DISASTER_RECOVERY.md

Recovery procedures for the RideConnect production server (167.233.213.218).

## What is backed up

Nightly at 02:30 to `/opt/rideconnect/backups/<YYYY-MM-DD>/` (7-day retention):

| File | Contents |
|---|---|
| `postgres-all.sql.gz` | full `pg_dumpall` of all databases and roles |
| `rideconnect_pg_data.tar.gz` etc. | raw copy of every Docker volume |
| `config.tar.gz` | compose file, `.env`, nginx, monitoring, scripts, fail2ban, sshd config |

> ⚠️ Backups are local. Copy them off-site regularly (see SERVER.md) or a total
> server loss loses the backups too.

## Scenario 1 — One container is broken

```bash
cd /opt/rideconnect
docker compose logs <service>        # find the cause
docker compose up -d --force-recreate <service>
```

Volumes are untouched by recreation; no data is lost.

## Scenario 2 — Restore PostgreSQL data

```bash
cd /opt/rideconnect
BACKUP=/opt/rideconnect/backups/<DATE>

# Stop apps that use the DB (none yet), then:
gunzip -c "$BACKUP/postgres-all.sql.gz" | docker exec -i rc-postgres psql -U rideconnect postgres
```

For a clean rebuild instead (destroys current data):

```bash
docker compose stop postgres
docker volume rm rideconnect_pg_data
docker compose up -d postgres
sleep 10
gunzip -c "$BACKUP/postgres-all.sql.gz" | docker exec -i rc-postgres psql -U rideconnect postgres
```

## Scenario 3 — Restore a Docker volume (e.g. Grafana)

```bash
cd /opt/rideconnect
docker compose stop grafana
docker run --rm -v rideconnect_grafana_data:/data -v /opt/rideconnect/backups/<DATE>:/backup alpine \
  sh -c "rm -rf /data/* && tar xzf /backup/rideconnect_grafana_data.tar.gz -C /data"
docker compose start grafana
```

Same pattern for any volume; match the `.tar.gz` name to the volume name.

## Scenario 4 — Full server rebuild

1. **Provision** a new Hetzner Ubuntu 24.04 server; add your SSH key at creation.
2. **Copy** the newest off-site backup and the infra bundle to the new server:

```bash
scp -r infra/server root@NEW_IP:/opt/rideconnect-bundle
scp -r <offsite-backup-dir> root@NEW_IP:/root/restore
```

3. **Bootstrap** (each script is idempotent):

```bash
ssh root@NEW_IP
cd /opt/rideconnect-bundle/scripts
./01-secure-server.sh
./02-install-docker.sh
mkdir -p /opt/rideconnect
cp -r /opt/rideconnect-bundle/* /opt/rideconnect/
# Restore config INCLUDING .env before starting the stack:
tar xzf /root/restore/config.tar.gz -C /
./03-deploy-stack.sh          # keeps the restored .env
./05-install-backups.sh
```

4. **Restore data** — Scenario 2 for Postgres, Scenario 3 for other volumes.
5. **Re-point DNS** A records to the new IP, then run `issue-certs.sh <email>`.
6. **Harden SSH**: verify key login, then `./04-harden-ssh.sh`.
7. **Verify**: `./06-security-audit.sh` must report 0 failures.

## Scenario 5 — Locked out of SSH

Use the Hetzner Cloud Console (web VNC) → login on the virtual console →
inspect `/etc/ssh/sshd_config.d/99-rideconnect-hardening.conf`, fix or remove
it, `systemctl restart ssh`. If the root password is unknown, use Hetzner's
"Reset root password" feature first.

## Verification checklist after any recovery

- [ ] `docker compose ps` — all services `running`
- [ ] `docker exec rc-postgres psql -U rideconnect -c '\l'` — databases present
- [ ] Grafana reachable via SSH tunnel, dashboards show data
- [ ] `curl -I http://rideconnectuk.com` returns a response
- [ ] `06-security-audit.sh` passes
- [ ] `systemctl list-timers rideconnect-backup.timer` — timer active
