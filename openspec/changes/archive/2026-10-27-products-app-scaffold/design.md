# Design

## Context

Observed in the repo today: `backend/` is a Spring Boot 4.1 / Java 21 app with Spring Data JPA, Flyway and Postgres. `ProductController` already implements `GET`/`POST /api/products` with bean validation, and `V1__create_products.sql` creates the table. `application.properties` defaults to `jdbc:postgresql://localhost:5432/interview` with user and password `interview`, and `ddl-auto=validate`. Its only test file is named `ProductsApplicationTests.java` but holds a `@WebMvcTest` class `ProductControllerTests`. There is no CORS config, frontend, compose file or README, and `db/schema.sql` repeats the migration. Java 21, Node 20, Docker and psql are installed locally. See proposal.md for motivation.

## Goals / Non-Goals

**Goals:**
- Anyone with JDK 21, Node 20 and Docker can run the full stack from the README in a few commands.
- Small, conventional code that is easy to extend live (add a field, endpoint or page).

**Non-Goals:**
- Production concerns: auth, deployment, containerizing the apps, CI.
- Changing the existing API shape or adding fields.

## Decisions

- **Keep the existing backend; add only what is missing.** The skeleton already matches the specs, so we add CORS and tests rather than rewrite. Alternative: regenerate from scratch, which discards working code for no gain.
- **CORS via a `WebMvcConfigurer` allowing `http://localhost:3000` on `/api/**`.** Mirrors production behavior and keeps the frontend free of proxy config. Alternative: a Vite dev proxy, which hides the cross-origin question the interviewers might ask about. The allowed origin is a property with that default.
- **Vite + React + TypeScript, no UI or state libraries.** A single `App` with `useState`/`useEffect`, and a small `api.ts` wrapping `fetch`. Vite's `server.port` is 3000 to match the prompt's Verify URL, and the API base URL is `VITE_API_URL`, defaulting to `http://localhost:8080`. Alternatives: Create React App (unmaintained), Next.js (heavier than the scaffold needs).
- **Postgres through `docker-compose.yml` only.** One `postgres:16` service whose env matches the backend defaults and with a named volume, so `docker compose up -d` is the whole database setup. Flyway creates the table when the backend starts, so the README's Database setup section is "run compose" and does not need manual SQL. Alternative: ask reviewers to install Postgres locally, which is more setup and more failure modes.
- **Flyway migration is the only schema source.** Delete `db/schema.sql` so the two can't drift.
- **Tests stay light.** Keep the `@WebMvcTest` tests (rename the file to `ProductControllerTests.java`), add one Testcontainers-backed repository/API test (test scope only) that proves migration plus persistence, and add a few Vitest + Testing Library tests for the list, empty, create and error states. Alternative: skip frontend tests, but the pairing session will edit the UI, so a safety net is worth about 20 minutes.

## Risks / Trade-offs

- [Testcontainers needs Docker at test time] → Reviewers already need Docker for the database; document it in Prerequisites.
- [Port 5432 or 8080 already in use on a reviewer's machine] → Put the override (`DB_URL`, `server.port`, `VITE_API_URL`) in README Notes.
- [Hard-coded `interview` credentials] → Acceptable for a local scaffold; README Notes says they are for local use only.
- [Two-hour budget] → The scope is deliberately small. If time runs short, the Vitest tests are the first thing to cut, because no spec requirement depends on them.
