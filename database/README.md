# Database Architecture & Migration Management â€” TalentFlow ATS

This directory isolates all schema definition scripts, versioned database migrations, and development seed fixtures.

## Structure
- `migrations/`: Timestamped or sequential migration files defining schema state.
- `seeds/`: Deterministic test fixtures and development seed datasets.

## Standards
- Strict relational constraints and foreign key declarations.
- Required composite indexes on query hotspots.
- Non-destructive migration rollout and rollback definitions.
