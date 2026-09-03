# Request Bin — API Contract (Split by Pair)

**Pair A owns:** users + bins
**Pair B owns:** requests + webhook capture

| Owner | Method | Path | Purpose | Request body | Success response | Error cases |
|---|---|---|---|---|---|---|
| — | GET | `/` | Serve the homepage (static HTML/React shell) | — | `200` HTML | — |
| **Pair A** | GET | `/api/bins` | List bins for the current user (by token) | — | `200 [{ id, url_endpoint, request_count, created_at }]` | `401` if no valid token |
| **Pair A** | POST | `/api/bins` | Create a new bin | `{ url_endpoint }` | `201 { id, url_endpoint }` | `409` if `url_endpoint` taken, `400` if invalid |
| **Pair B** | GET | `/api/bins/:url_endpoint/requests` | List parsed requests for a bin (from Postgres) | — | `200 [{ id, method, path, received_at }]` | `404` if bin doesn't exist |
| **Pair B** | GET | `/api/bins/:url_endpoint/requests/:id/raw` | Get the raw payload for one request (from Mongo) | — | `200 { request_payload }` | `404` if request/bin not found |
| **Pair B** | ALL | `/:url_endpoint` | Public webhook capture endpoint — any method, any 3rd party | raw body | `200 { received: true }` | `404` if bin doesn't exist |

---

## What each pair actually builds this weekend

**Pair A**
- Migration: `users` table, `bins` table
- Token-based identity handling (however you're issuing/checking tokens)
- The 2 routes above, with the uniqueness check on `url_endpoint`

**Pair B**
- Migration: `requests` table (Postgres) + the `RequestPayload` Mongo schema
- The webhook capture logic (parse → Postgres, raw → Mongo, increment `bins.request_count`)
- The 3 routes above

Everything else (homepage rendering, frontend) waits until Monday's integration, per your roadmap.
