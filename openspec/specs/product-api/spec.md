# product-api Specification

## Purpose

Defines the HTTP API for listing and creating products, and how products are stored in Postgres, so the frontend and the pairing session have a stable contract to build on.

## Requirements

### Requirement: List products
The system SHALL expose `GET /api/products`, returning a JSON array of all products ordered by `id` ascending, each as `{"id": <number>, "name": <string>}`.

#### Scenario: Products exist
- **WHEN** a client sends `GET /api/products` and two products have been created
- **THEN** the response is 200 with both products, the earlier-created one first

#### Scenario: No products
- **WHEN** a client sends `GET /api/products` and no products exist
- **THEN** the response is 200 with an empty JSON array

### Requirement: Create product
The system SHALL expose `POST /api/products` accepting a JSON body `{"name": <string>}` and creating a product with a database-generated `id`.

#### Scenario: Valid name
- **WHEN** a client posts `{"name": "P1"}`
- **THEN** the response is 201 with `{"id": <generated>, "name": "P1"}`
- **AND** a later `GET /api/products` includes that product

#### Scenario: Surrounding whitespace
- **WHEN** a client posts `{"name": "  P1  "}`
- **THEN** the stored and returned name is `P1`

### Requirement: Reject invalid product names
The system MUST reject a create request whose `name` is missing, null, empty or only whitespace with a 400 response, and MUST NOT create a product.

#### Scenario: Blank name
- **WHEN** a client posts `{"name": "   "}`
- **THEN** the response is 400
- **AND** `GET /api/products` is unchanged

#### Scenario: Missing name
- **WHEN** a client posts `{}`
- **THEN** the response is 400

### Requirement: Products persisted in Postgres
The system SHALL store products in a Postgres table `products` with an auto-generated primary key `id` and a required `name`, created by a versioned migration that runs at backend startup.

#### Scenario: Fresh database
- **WHEN** the backend starts against an empty Postgres database
- **THEN** the `products` table exists without any manual SQL being run

#### Scenario: Data survives restart
- **WHEN** a product is created and the backend is restarted
- **THEN** the product is still returned by `GET /api/products`

### Requirement: Browser access from the frontend
The system SHALL allow cross-origin requests to `/api/**` from the frontend's local origin (`http://localhost:3000`).

#### Scenario: Frontend origin
- **WHEN** a browser page served from `http://localhost:3000` calls `/api/products`
- **THEN** the response includes CORS headers permitting that origin
