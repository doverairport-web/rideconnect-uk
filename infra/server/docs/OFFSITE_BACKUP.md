# Off-site encrypted backups (rclone)

Nightly local backups live in `/opt/rideconnect/backups` (7-day retention). This
adds an **encrypted off-site copy** so a full server loss doesn't lose the data.

- **Client-side encrypted** via an rclone `crypt` remote — the off-site provider
  only ever stores ciphertext (data *and* file names).
- **Supports Hetzner Storage Box (SFTP)** and **S3-compatible** storage.
- **Uploads nothing until configured** — the script is a safe no-op otherwise, so
  it can be installed and scheduled ahead of time.
- Runs nightly at **03:15** (after the 02:33 local backup) via
  `rideconnect-offsite.timer`. `backup.sh` also invokes it after each local run.

## Files

| Path | Purpose | Perms |
|---|---|---|
| `/opt/rideconnect/scripts/offsite-backup.sh` | upload + verify + remote retention | 755 |
| `/opt/rideconnect/scripts/07-install-offsite.sh` | installer (rclone, secrets, timer) | 755 |
| `/opt/rideconnect/secrets/rclone.conf` | rclone remotes (secret) | **600** |
| `/opt/rideconnect/secrets/offsite.env` | `RCLONE_REMOTE`, `RETENTION_DAYS` (secret) | **600** |

`/opt/rideconnect/secrets/` is `700`, root-only, and is **git-ignored**.

## Install

```bash
/opt/rideconnect/scripts/07-install-offsite.sh
```

## Configure — Option A: Hetzner Storage Box (SFTP)

1. Order a Storage Box; enable SSH/SFTP. Create a key on the server:
   ```bash
   ssh-keygen -t ed25519 -f /opt/rideconnect/secrets/storagebox_ed25519 -N ""
   chmod 600 /opt/rideconnect/secrets/storagebox_ed25519*
   ```
   Upload the public key to the Storage Box (Hetzner Robot → Storage Box → SSH keys).
2. Configure remotes (writes into the root-only conf):
   ```bash
   export RCLONE_CONFIG=/opt/rideconnect/secrets/rclone.conf
   rclone config   # create [offsite-remote] type=sftp, then [offsite-crypt] type=crypt
   ```
3. Generate obscured crypt passwords:
   ```bash
   rclone obscure 'a-long-random-passphrase'    # -> password
   rclone obscure 'another-random-passphrase'   # -> password2
   ```
   **Store both passphrases in your password manager** — without them the backups
   are unrecoverable.

## Configure — Option B: S3-compatible (AWS / Wasabi / Backblaze B2 / MinIO)

```bash
export RCLONE_CONFIG=/opt/rideconnect/secrets/rclone.conf
rclone config
# [offsite-remote] type=s3, provider, access_key_id, secret_access_key, region/endpoint
# [offsite-crypt]  type=crypt, remote = offsite-remote:rideconnect-backups
```

## Activate

Set the remote name in the env file, then test:

```bash
echo 'RCLONE_REMOTE=offsite-crypt:rideconnect' >> /opt/rideconnect/secrets/offsite.env
# (edit so there is exactly one RCLONE_REMOTE line)
/opt/rideconnect/scripts/offsite-backup.sh          # first real upload + cryptcheck
```

## Verify

```bash
export RCLONE_CONFIG=/opt/rideconnect/secrets/rclone.conf
rclone ls offsite-crypt:rideconnect/$(hostname)                 # decrypted listing
rclone cryptcheck /opt/rideconnect/backups/$(date +%F)/ \
  offsite-crypt:rideconnect/$(hostname)/$(date +%F) --one-way   # integrity
systemctl list-timers rideconnect-offsite.timer
journalctl -u rideconnect-offsite.service --no-pager | tail
```

## Restore from off-site (disaster recovery)

On a fresh server, after installing rclone and restoring
`/opt/rideconnect/secrets/` (rclone.conf + crypt passphrases):

```bash
export RCLONE_CONFIG=/opt/rideconnect/secrets/rclone.conf
# list available dated backups
rclone lsf --dirs-only offsite-crypt:rideconnect/OLD_HOSTNAME
# pull one down (decrypts automatically)
mkdir -p /opt/rideconnect/backups/RESTORE
rclone copy offsite-crypt:rideconnect/OLD_HOSTNAME/2026-07-18 \
  /opt/rideconnect/backups/RESTORE --progress
```

Then follow `DISASTER_RECOVERY.md` (Scenario 2/3) to load the Postgres dump and
volume archives. Remote retention: `RETENTION_DAYS` in `offsite.env` (default 14).

## Security notes

- Provider stores only ciphertext; losing the bucket/box does not leak data.
- Losing the crypt passphrases means **permanent** data loss — keep them offline.
- All secrets live under `/opt/rideconnect/secrets` (700, files 600), never in Git.
