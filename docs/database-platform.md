# Virasat database platform

Virasat supports PostgreSQL for production and keeps the JSON store for local development. The seven database upgrades are represented by migration `008_ai_database_platform.sql`, the database tools, and the existing verified tourism ingestion.

## Production setup

1. Provision PostgreSQL 15+ with the `vector` extension. On Render, create PostgreSQL in the same region as the web service.
2. Set `DATABASE_URL` only in the server environment. Never use a `VITE_` prefix or expose it to the browser.
3. Set the embedding provider variables `VIRASAT_EMBEDDING_URL`, `VIRASAT_EMBEDDING_MODEL`, and server-only `VIRASAT_EMBEDDING_API_KEY` when semantic retrieval is wanted.
4. Run `npm run db:migrate`, then `npm run db:verify`, `npm run knowledge:reindex`, `npm run knowledge:embed`, and `npm run check:data`.
5. Restart the service and confirm `/api/ready` reports PostgreSQL.

The migration runner uses a PostgreSQL advisory lock, a transaction per file, and SHA-256 checksums. It refuses to reapply a migration whose contents changed.

## What is stored

- AI conversations: owner-bound state, draft itinerary, saved trip, expiry and optimistic version.
- Verified retrieval documents: source identity, canonical location, review status, content hash and embedding.
- Trips: itinerary, days and stops are saved in one transaction. An owner-scoped idempotency key prevents duplicate AI trip saves.
- Data-quality issues: reviewable provenance, coordinate, duplicate and media findings.

Admin endpoints require both a valid login token and the `admin` role. `POST /api/v1/admin/data-quality/scan` finds current issues, persists the review queue in PostgreSQL, and `GET /api/v1/admin/data-quality/issues` lists it. Resolve or ignore an item with `PATCH /api/v1/admin/data-quality/issues/:id`. The `/api/ready` probe reports when production is serving from the non-durable JSON store.

With PostgreSQL active, AI request limits use shared fixed-window counters. When PostgreSQL is unavailable or not configured, the app keeps a per-process limiter for availability; this fallback does not coordinate across multiple instances.

## Backup and recovery

Use the managed provider's daily backups and point-in-time recovery. Before a schema release, take an encrypted custom-format backup:

```powershell
pg_dump --format=custom --no-owner --no-acl --file virasat-before-release.dump $env:DATABASE_URL
pg_restore --list virasat-before-release.dump
```

Restore only into a new recovery database first, run `npm run db:verify`, compare row counts, and then switch the service connection. Never test a restore against production.

## Operational limits

The file store remains available for developer machines. It is single-process storage and must not be treated as production durability. PostgreSQL and pgvector availability depend on the configured hosting plan; deploying this code does not itself provision or fund those services.
