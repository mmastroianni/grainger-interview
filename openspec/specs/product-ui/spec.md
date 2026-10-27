# product-ui Specification

## Purpose

Defines the browser UI where a user sees the current products and adds a new one, as the front end of the Frontend → Backend → Database stack.

## Requirements

### Requirement: Display product list
The UI SHALL load products from the backend on page load and display each product's name in a list.

#### Scenario: Existing products
- **WHEN** the page loads and the backend has products P1 and P2
- **THEN** both names are shown, in the order returned by the API

#### Scenario: Empty list
- **WHEN** the page loads and the backend has no products
- **THEN** the UI shows an empty-state message instead of a list

#### Scenario: Backend unreachable
- **WHEN** the page loads and the backend cannot be reached
- **THEN** the UI shows an error message and does not crash

### Requirement: Create a product from the UI
The UI SHALL provide a form with a name field and a submit control that creates a product through the backend and then shows it in the list without a manual page reload.

#### Scenario: Successful create
- **WHEN** the user enters `P1` and submits
- **THEN** `P1` appears in the list
- **AND** the name field is cleared

#### Scenario: Blank name
- **WHEN** the user submits with an empty or whitespace-only name
- **THEN** no product is created and the UI tells the user a name is required

#### Scenario: Create fails
- **WHEN** the backend rejects or cannot process the create request
- **THEN** the UI shows an error message and keeps the entered name

### Requirement: Served on port 3000
The frontend dev server SHALL listen on `http://localhost:3000`.

#### Scenario: Start frontend
- **WHEN** the documented frontend start command is run
- **THEN** the app is reachable at `http://localhost:3000`
