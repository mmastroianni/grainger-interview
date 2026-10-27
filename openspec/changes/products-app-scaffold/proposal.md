# Proposal

## Why

The take-home asks for a minimal, runnable Frontend → Backend → Database "Products" app that will be extended live in a 45-minute pairing session. A backend skeleton exists, but there is no frontend, no way to start Postgres, and no README, so the app cannot yet be run end to end or handed to the interviewers.

## What Changes

- Keep and finish the existing Spring Boot + Postgres backend (`GET`/`POST /api/products`, Flyway `V1__create_products.sql`): allow the frontend's origin to call it, and add a database-backed integration test beside the existing controller tests.
- Add a React (Vite + TypeScript) frontend in `frontend/` that lists products and creates a product by name, with basic loading, error and empty states.
- Add a `docker-compose.yml` that starts Postgres with the credentials the backend defaults to (`interview`/`interview`/`interview`).
- Add a root `README.md` with the exact headings the prompt requires: Prerequisites, Database setup, Start backend, Start frontend, Verify, Notes.
- Remove the duplicate `db/schema.sql`; the Flyway migration is the single source of truth for the table.
- Out of scope: any extra product fields, update/delete, auth, pagination, or deployment. The pairing session will add features.

## Capabilities

### New Capabilities
- `product-api`: HTTP API to list and create products, persisted in the Postgres `products` table (auto-generated id, required name).
- `product-ui`: Browser UI that shows the product list and a form to create a product.
- `local-dev-setup`: How a reviewer starts the database, backend and frontend locally and verifies the app, as documented in the README.

### Modified Capabilities
<!-- None: openspec/specs/ is empty, so nothing is being modified. -->

## Impact

- `backend/`: CORS configuration, one integration test, minor cleanup. Existing endpoints and JSON shape (`{id, name}`) are unchanged.
- New `frontend/` project (Node 20, React, Vite) served on `http://localhost:3000`, which is the port the prompt's Verify step names.
- New `docker-compose.yml` and `README.md` at the repo root; `db/` is removed.
- No new runtime dependencies in the backend; the frontend adds React and Vite.
