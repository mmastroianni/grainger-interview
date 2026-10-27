# Products

A minimal Frontend → Backend → Database app: a React page that lists products and creates a product, a Spring Boot API behind it, and a Postgres `products` table.

| Layer    | Tech                          | Where        | URL                     |
| -------- | ----------------------------- | ------------ | ----------------------- |
| Frontend | React + TypeScript (Vite)     | `frontend/`  | http://localhost:3000   |
| Backend  | Java 21, Spring Boot 4        | `backend/`   | http://localhost:8080   |
| Database | Postgres 16 (Docker Compose)  | `docker-compose.yml` | localhost:5432  |

## Prerequisites

- JDK 21
- Node 20 (with npm)
- Docker, with the Compose plugin (used for Postgres, and by the backend integration test)

## Database setup

From the repo root:

```sh
docker compose up -d
```

This starts Postgres with database, user and password all set to `interview`, which are the backend's defaults. You do not need to run any SQL: the backend creates the `products` table itself on startup with a Flyway migration (`backend/src/main/resources/db/migration/V1__create_products.sql`):

```sql
CREATE TABLE products (
    id   BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL
);
```

## Start backend

```sh
cd backend
./mvnw spring-boot:run
```

The API listens on http://localhost:8080:

- `GET /api/products` returns `[{"id": 1, "name": "P1"}]`
- `POST /api/products` with `{"name": "P1"}` returns 201 and the created product (400 if the name is blank)

Run the tests with `./mvnw test` (the integration test starts its own Postgres container, so Docker must be running).

## Start frontend

```sh
cd frontend
npm install
npm run dev
```

Run the tests with `npm test`.

## Verify

1. Open http://localhost:3000.
2. Type `P1` in the Name field and click **Add product**.
3. Confirm `P1` appears in the list, and that it is still there after reloading the page.

## Notes

- **Stack:** the preferred stack is used as is (React, Spring Boot, Postgres). There are no deviations.
- **Credentials:** `interview`/`interview` are local-development defaults only. Postgres is published on `127.0.0.1`, so it is not reachable from other machines. Override them with `DB_USER` and `DB_PASSWORD` (compose and the backend read the same variables). The password is only applied when the database volume is first created, so after changing it run `docker compose down -v` first.
- **No app-level auth:** the API is open by design for this scaffold; authentication would be the first thing to add beyond local use.
- **Port already in use?** If something else is on 5432, start the database on another port and point the backend at it:
  ```sh
  DB_PORT=5433 docker compose up -d
  DB_URL=jdbc:postgresql://localhost:5433/interview ./mvnw spring-boot:run
  ```
  The backend also reads `DB_USER` and `DB_PASSWORD`. The frontend reads the API address from `VITE_API_URL` (default `http://localhost:8080`), and the backend allows browser calls from `app.cors.allowed-origin` (default `http://localhost:3000`).
- **Out of scope:** extra product fields, update/delete, auth and deployment. This is a scaffold to extend during the pairing session.

### How the frontend works (in backend terms)

- **Vite** is the build tool and dev server, roughly Maven plus Spring Boot DevTools. `npm run dev` is like `spring-boot:run` with hot reload, `npm run build` is like `mvn package`, and `package.json` is the `pom.xml`.
- **CORS** exists because the page (`localhost:3000`) and the API (`localhost:8080`) are different origins, and browsers block cross-origin calls unless the API says they are allowed. `backend/.../CorsConfig.java` sends that permission for `/api/**`. It only affects browsers, so `curl` and the backend tests never hit it.
- **`frontend/src/api.ts`** is the HTTP client: two `fetch` calls (list and create) that throw on a non-2xx response.
- **`frontend/src/App.tsx`** is the whole page: it loads the list when it first renders, and the form posts the new name and then adds the result to the list. The list, empty and error states are plain conditionals in the JSX.
