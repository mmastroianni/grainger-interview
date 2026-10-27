# Tasks

## 1. Database and backend cleanup

- [x] 1.1 Add `docker-compose.yml` with a `postgres:16` service (db/user/password `interview`, port 5432, named volume); verify `docker compose up -d` starts it and `psql -h localhost -U interview interview -c '\dt'` connects
- [x] 1.2 Remove `db/schema.sql` and the empty `db/` directory; verify nothing in the repo references it (`grep -r schema.sql .`)
- [x] 1.3 Rename `ProductsApplicationTests.java` to `ProductControllerTests.java` to match its class; verify `./mvnw test` still passes in `backend/`

## 2. CORS and persistence test

- [x] 2.1 Add a `WebMvcConfigurer` allowing `app.cors.allowed-origin` (default `http://localhost:3000`) on `/api/**` for GET, POST and OPTIONS, and add a `@WebMvcTest` case sending `Origin: http://localhost:3000` that asserts the `Access-Control-Allow-Origin` header; verify the test passes
- [x] 2.2 Add test-scope Testcontainers (PostgreSQL) dependencies and one `@SpringBootTest` that posts a product, lists it, and asserts the migration created the table; verify `./mvnw test` passes with Docker running
- [x] 2.3 Start the backend against the compose database and verify `curl -X POST localhost:8080/api/products -H 'Content-Type: application/json' -d '{"name":"P1"}'` returns 201 and `curl localhost:8080/api/products` lists it, still after a backend restart

## 3. Frontend

- [x] 3.1 Scaffold `frontend/` with Vite + React + TypeScript, set `server.port` to 3000, and add `.gitignore` entries for `node_modules` and `dist`; verify `npm run dev` serves a page at `http://localhost:3000`
- [x] 3.2 Add `src/api.ts` (`listProducts`, `createProduct`, base URL from `VITE_API_URL`, default `http://localhost:8080`, errors thrown on non-2xx); verify with a Vitest test that mocks `fetch` for success and failure
- [x] 3.3 Implement `App` with the product list, empty state, load error, and a create form that rejects blank names, shows server errors, clears on success and keeps the name on failure; verify Vitest + Testing Library tests cover each scenario in `specs/product-ui/spec.md`
- [x] 3.4 Verify `npm run build` and `npm test` pass in `frontend/`

## 4. Documentation and end-to-end check

- [x] 4.1 Write the root `README.md` with the headings Prerequisites (JDK 21, Node 20, Docker), Database setup, Start backend, Start frontend, Verify and Notes (preferred stack used, no deviations, port overrides, local-only credentials), plus a short "How the frontend works" note in Notes (what Vite, CORS and the two frontend files do, in backend terms) so the author can explain it in the interview; verify each documented command runs as written from a clean checkout
- [x] 4.2 Run the full stack per the README's Verify steps: with compose, backend and frontend running, open `http://localhost:3000`, create `P1`, confirm it appears and persists after a reload
- [x] 4.3 Run `openspec validate products-app-scaffold` and verify it reports no errors

## Workflow follow-up

- Archive the change once the README's Verify steps pass (`/opsx:archive`).
- Initialize the git repository's first commit (the repo currently has none) when ready to send it to the interviewers.
