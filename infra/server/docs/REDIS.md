# Redis configuration decision

## Setting

```
maxmemory        512mb
maxmemory-policy noeviction
appendonly       yes           (AOF persistence, kept)
requirepass      <from .env>   (auth, kept)
```

## Decision: keep `noeviction` (NOT `allkeys-lru`)

Redis is **not** cache-only. It holds durable application state, so evicting keys
to make room would silently destroy real data (queued calls, jobs, locks). With
`noeviction`, once 512 MB is reached Redis rejects further writes with an error
instead of dropping data — the safe failure mode for a queue/state store.

## Evidence from the RideConnect codebase (inspected 2026-07-18)

| Repo | Redis usage | Verdict |
|---|---|---|
| `rideconnect-contact-center` | `.env.example` sets `REDIS_URL`; worker `app.module.ts` notes "Redis Streams / BullMQ consumers"; dedicated `modules/queues` (queue-calls, queue-events, queue-sweeper, presence) | **Durable queues / streams / presence** |
| `rideconnect-dispatch` | grep hits were false positives (`requireDispatchSession`, `redirect`); no redis/bullmq in `package.json` | No Redis |
| `rideconnect-driver-mobile`, `rideconnectuk`, `dovertogatwick`, `dovertaxi` | none | No Redis |

BullMQ and Redis Streams persist jobs/messages in Redis; a contact-center queue
must not silently lose calls. Therefore durable semantics (`noeviction`) win.

## Re-evaluate if usage changes

If a future service uses this Redis purely as an ephemeral cache with TTLs, run a
**separate** Redis instance (or logical DB) for that workload with
`allkeys-lru` — do not switch this instance, which backs durable state.

## Capacity note

512 MB on a 3.7 GB host leaves ample room alongside Postgres and monitoring.
Watch `used_memory` in Grafana; raise `maxmemory` if the contact-center queue
depth grows. Alert suggestion: `used_memory / maxmemory > 0.8`.
