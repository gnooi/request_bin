# RequestBin

A lightweight webhook capture and inspection tool. Create a bin, send HTTP requests to its unique URL, and inspect the method, headers, and body of everything it receives — handy for debugging webhooks, third-party integrations, or anything else that "calls back" to a URL.

## Tech stack

- **Client** — React + Vite ([client/](client))
- **Server** — Express ([server/](server))
- **Data** — PostgreSQL (bin/user/request metadata) + MongoDB (raw request payloads)
- **Orchestration** — Docker Compose

### Two databases?

Postgres holds structured, queryable metadata for each request (`method`, `path`, `headers`, `received_at`) — this is what powers the request list view. MongoDB holds the full raw payload as a flexible document, keyed by the same id Postgres generates, so requests that are lost while querying Postgres are saved in MongoDB.

Postgres schema path: [schema.sql](server/src/db/schema.sql)
MongoDB schema path: [RequestPayload.js](server/models/RequestPayload.js).

## Prerequisites

- Docker and Docker Compose
- A `.env` file in the project root (gitignored — create your own; see below)

## Getting started

1. Create a `.env` file in the project root with:

   ```
   POSTGRES_USER=your_user
   POSTGRES_PASSWORD=your_password
   POSTGRES_DB=requestbin
   MONGO_URI=mongodb://mongo:27017/requestbin
   ```

2. Build and start everything:

   ```
   docker compose up --build
   ```

   This starts four containers: 
   - `client` (Vite dev server, port 5173), 
   - `server` (Express API, port 3000), 
   - `db` (Postgres, port 5432),
   - `mongo` (MongoDB, port 27017). 

3. Visit `http://localhost:5173` for the client, or hit the API directly at `http://localhost:3000`.

4. Run `npm install` inside `client/` and `server/` on your host. 
- Although it is not required to run the app with docker, it is needed for your editor's autocomplete/linting and running `npm test` without going through `docker exec`.

### Troubleshooting

- **Installed a new server dependency but the container says it can't find the module** — the server's `node_modules` lives in an anonymous Docker volume that isn't replaced by `--build` alone. Run `docker compose down -v` (this also clears seeded DB data, which will be reseeded automatically) and `docker compose up --build` again.

## API reference

| Method | Path                                    | Auth | Description                             |
| ------ | ---------------------------------------- | ---- | ---------------------------------------- |
| POST   | `/api/auth/new`                          | No   | Issue a new usertoken                   |
| GET    | `/api/bins`                              | Yes  | List the authenticated user's bins       |
| POST   | `/api/bins`                              | Yes  | Create a new bin                         |
| ANY    | `/:bin_name`                             | No   | Capture an incoming request into a bin   |
| GET    | `/api/bins/:bin_name/requests`           | Yes  | List requests captured by a bin          |
| GET    | `/api/bins/:bin_name/requests/:id/raw`   | Yes  | Fetch one request's raw payload          |

Authenticated routes expect `Authorization: Bearer <token>`, where `<token>` comes from `POST /api/auth/new`.

## Scheduled cleanup

A daily job ([cleanup.js](server/src/jobs/cleanup.js)) purges requests older than 30 days from both Postgres and MongoDB to keep the datastores from growing unbounded, and decrements each affected bin's `request_count` accordingly. It runs automatically inside the server process via `node-cron` at 3 AM server time ([server.js](server/src/server.js)).

## Testing

From `server/`:

```
npm test
```

Tests mock both databases, so they run without the Docker stack. Run a single file with `npm test -- <pattern>`, or `npm run test:watch` for a watch loop.

## Project structure

```
client/    React + Vite frontend
server/
  src/
    controllers/   route handlers
    db/             Postgres/Mongo connection setup + schema/seed files
    jobs/           scheduled background jobs (e.g. request cleanup)
    middleware/     auth, body parsing, error handling
    models/         Postgres-backed data access
    routes/         Express routers
  models/           Mongoose models
```
