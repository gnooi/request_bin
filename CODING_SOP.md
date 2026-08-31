# Coding SOP

## Purpose
Keep the codebase predictable and consistent so any team member can quickly understand where code belongs and how it should be written.

## Project Structure

```text
src/
├── controllers/
│   └── requestsController.js
├── db/
│   ├── postgres.js
│   ├── mongo.js
│   ├── schema.sql
│   └── seed.sql
├── models/
│   └── rawRequest.js
├── middleware/
│   ├── authenticate.js
│   └── errorHandler.js
├── routes/
│   └── requestRouter.js
├── utils/
│   ├── errors.js
│   └── validation.js
├── app.js
└── server.js
```

## Naming Conventions

- **Functions / variables:** `camelCase`
  - `createBin`
  - `requestCount`
- **Classes / constructors:** `PascalCase`
  - `RawRequest`
- **Constants / environment-style constants:** `SCREAMING_SNAKE_CASE`
  - `MAX_REQUEST_SIZE`
- **JavaScript filenames:** `camelCase`
  - `requestsController.js`
  - `requestRouter.js`
  - `errorHandler.js`
- **SQL filenames:** `snake_case` when multiple words are needed
  - `schema.sql`
  - `seed.sql`

## File Responsibilities

- `controllers/` — request handling and application logic.
- `routes/` — Express route definitions only; delegate work to controllers.
- `middleware/` — authentication, validation, error handling, and request pipeline logic.
- `models/` — database/domain models.
- `db/` — database connections, schemas, seeds, and database-specific helpers.
- `utils/` — reusable helpers that do not belong to a specific feature.
- `app.js` — configure the Express application and middleware/routes.
- `server.js` — start the server and handle application startup/shutdown.

## JavaScript Style

- Use semicolons.
- Prefer `const`; use `let` only when reassignment is required.
- Use descriptive names; avoid vague names such as `data`, `thing`, `helper`, or `temp` when a clearer name is possible.
- Keep route files thin and move business logic into controllers/services.
- Keep one clear responsibility per module.

## Database Connections

### PostgreSQL
- PostgreSQL pool lives in `src/db/postgres.js`.
- Reuse the shared pool rather than creating new pools in controllers or routes.
- Close the pool during graceful application shutdown.

### MongoDB
- MongoDB connection setup lives in `src/db/mongo.js`.
- MongoDB integration ownership: Grant and Lily.
- Keep MongoDB connection logic out of routers/controllers.

## Graceful Shutdown

The server should close active database connections when the application shuts down.

Example responsibilities:

```text
SIGINT / SIGTERM
      ↓
stop accepting requests
      ↓
close PostgreSQL pool
      ↓
close MongoDB connection
      ↓
exit process
```

## Team Rule

Before adding a new file, first ask:

1. What responsibility does this code have?
2. Which existing folder owns that responsibility?
3. Does the filename follow the naming convention?
4. Is similar functionality already implemented elsewhere?

If a new convention is introduced, update this SOP before using it across the project.
