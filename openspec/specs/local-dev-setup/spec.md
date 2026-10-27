# local-dev-setup Specification

## Purpose

Defines the documented, reproducible way for an interviewer to run the app locally and confirm it works end to end.

## Requirements

### Requirement: README with required sections
The repository root SHALL contain a `README.md` with the headings Prerequisites, Database setup, Start backend, Start frontend, Verify and Notes.

#### Scenario: Headings present
- **WHEN** a reviewer opens `README.md`
- **THEN** all six headings are present, using those names

### Requirement: Prerequisites state versions
The Prerequisites section SHALL state the required JDK and Node versions and that Docker is needed for the provided Postgres.

#### Scenario: Versions listed
- **WHEN** a reviewer reads Prerequisites
- **THEN** they can tell which JDK and Node versions to install

### Requirement: One-command database
The repository SHALL provide a Docker Compose file that starts Postgres with the credentials and database name the backend uses by default, so no backend configuration is needed for local runs.

#### Scenario: Start database and backend
- **WHEN** the database is started with the documented command and then the backend is started with its documented command
- **THEN** the backend starts without configuration changes and creates the `products` table

### Requirement: Verify walkthrough
The Verify section SHALL describe opening `http://localhost:3000`, creating a product named `P1`, and confirming it appears in the list.

#### Scenario: Follow Verify steps
- **WHEN** a reviewer follows the Verify steps against a running stack
- **THEN** `P1` appears in the list, and it is still there after a page reload

### Requirement: Stack deviations noted
The Notes section SHALL state that the preferred stack (React, Spring Boot, Postgres) is used, and list any deviation with its reason.

#### Scenario: No deviations
- **WHEN** the stack matches the preferred stack
- **THEN** Notes says so and records any other assumptions interviewers should know
