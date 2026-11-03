# Database Design & Schema Specification â€” talentflow-ats

## 1. Entity Relationship Model
The database is structured to support strong referential integrity, tenant isolation where applicable, auditability, and optimal query throughput.

`
+--------------------+        1:N         +--------------------+
|       Users        |------------------->|    AuditLogs       |
+--------------------+                    +--------------------+
| id (PK)            |                    | id (PK)            |
| email (Unique)     |                    | user_id (FK)       |
| password_hash      |                    | action             |
| role               |                    | ip_address         |
| created_at         |                    | created_at         |
+--------------------+                    +--------------------+
          â”‚
          â”‚ 1:N
          â–¼
+--------------------+        1:N         +--------------------+
|  CoreEntities      |------------------->|   EntityDetails    |
+--------------------+                    +--------------------+
| id (PK)            |                    | id (PK)            |
| owner_id (FK)      |                    | entity_id (FK)     |
| title / name       |                    | metadata (JSONB)   |
| status             |                    | updated_at         |
| created_at         |                    +--------------------+
+--------------------+
`

## 2. Core Tables & Schemas

### 2.1 users Table
Stores credential records, roles, profiles, and account verification states.
- id: UUID (Primary Key, default gen_random_uuid())
- email: VARCHAR(255) (NOT NULL, UNIQUE, Indexed)
- password_hash: VARCHAR(255) (NOT NULL)
- ole: VARCHAR(50) (NOT NULL, DEFAULT 'user')
- is_active: BOOLEAN (DEFAULT TRUE)
- created_at: TIMESTAMPTZ (DEFAULT NOW())
- updated_at: TIMESTAMPTZ (DEFAULT NOW())

### 2.2 core_entities Table
Houses primary domain resources specific to the **talentflow-ats** business workflow.
- id: UUID (Primary Key)
- user_id: UUID (Foreign Key references users(id) ON DELETE CASCADE)
- 
ame: VARCHAR(255) (NOT NULL)
- status: VARCHAR(50) (NOT NULL, DEFAULT 'draft')
- config: JSONB (DEFAULT '{}')
- created_at: TIMESTAMPTZ (DEFAULT NOW())
- updated_at: TIMESTAMPTZ (DEFAULT NOW())

### 2.3 udit_logs Table
Immutable operational tracking for security compliance and debugging.
- id: BIGSERIAL (Primary Key)
- user_id: UUID (Nullable, Foreign Key references users(id))
- ction: VARCHAR(100) (NOT NULL)
- payload: JSONB (Nullable)
- ip_address: VARCHAR(45)
- created_at: TIMESTAMPTZ (DEFAULT NOW())

## 3. Indexing Strategy & Optimization
- **B-Tree Indexes:** Enforced on all primary keys, foreign keys (user_id, entity_id), and lookup attributes (email, status).
- **GIN Indexes:** Applied on metadata and config JSONB columns for accelerated sub-field query resolution.
- **Compound Indexes:** Placed on (user_id, created_at DESC) for high-performance paginated listings.
