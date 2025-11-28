# Use Case & Architecture Guidelines

This file serves as a reference for implementing business logic and data flow within the application, following Clean Architecture principles.

## Architecture Overview
The project follows Clean Architecture. This file governs the implementation of business logic, data flow, and the "API" of the application—how the view layer communicates with the backend logic.

## Directory Structure & Responsibilities

### `/use-cases`
- Contains the main entry points for the application's business logic.
- Defines the contract between the client/view (e.g., mobile app) and the backend logic.
- **Responsibility**: Define what the view needs to provide (arguments) and what it gets back (return types).
- **Organization**: Holds directories for each part of the app (e.g., `/use-cases/account`, `/use-cases/transactions`).

### `/domains`
- Contains the core business entities.
- **Definition**: Use **Zod schemas** to define entities and infer their TypeScript types.
- **Creation**: Include a type for creating the entity (e.g., `CreateTransaction`) if applicable.
- **Usage**:
    - Create domain entities for important system data (e.g., `Transaction`, `Account`).
    - Reuse these entities across other parts of the application where they make sense.
    - **Exception**: Do NOT force the use of domain entities if it feels unnatural or if the data is specific to a view/calculation (e.g., `getPeriodFinancials` returns a specific shape that doesn't map 1:1 to a domain entity).

### `/repositories`
- Handles data access.
- Should use domain entity types where applicable, but not strictly required if the data shape differs significantly.

## Implementation Rules

1.  **Domain Usage**:
    - Prefer using defined domain entities from `/domains`.
    - If a new core concept is introduced, define it in `/domains` first using Zod.
    - If a use case returns a specific aggregation or view-model (like `PeriodFinancials`), define the type locally within the use case or a shared type file, rather than forcing a domain entity.

2.  **Scope of Changes**:
    - When working on use cases or business logic, strictly limit changes to the following directories:
        - `/database`
        - `/domains`
        - `/repositories`
        - `/use-cases`
        - `/utils`
    - **Critical**: If you believe changes are required outside these directories (e.g., in the UI layer), you **MUST** ask the user for permission first.

## Example Reference
- **Good Domain Usage**: `Transaction` and `Account` entities are defined in `/domains` because they represent persistent system data.
- **Good Non-Domain Usage**: `use-cases/account/getPeriodFinancials.ts` defines its own return type because it aggregates data (income, expenses, balance) rather than returning a single entity.
