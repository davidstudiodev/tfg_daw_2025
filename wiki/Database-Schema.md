# Database Schema

The application uses **MySQL 8+** with the database name `jobsxdevs`. All tables are defined in [`backend/database/schema.sql`](../backend/database/schema.sql).

---

## Entity Relationship Diagram

```
┌──────────────────┐       ┌──────────────────────┐       ┌──────────────────┐
│      users       │       │     developers       │       │    companies     │
├──────────────────┤       ├──────────────────────┤       ├──────────────────┤
│ id (PK)          │◄──┐   │ user_id (PK, FK)     │   ┌──►│ user_id (PK, FK) │
│ name             │   ├───│                      │   │   │ description      │
│ email (UNIQUE)   │   │   │ description          │   │   │ location         │
│ password         │   │   │ years_experience     │   │   │ avatar           │
│ role (ENUM)      │   │   │ location             │   │   │ phone            │
│ created_at       │   │   │ tech_stack (JSON)     │   │   └──────────────────┘
└──────────────────┘   │   │ avatar               │   │
                       │   │ profession           │   │
                       │   │ phone                │   │
                       │   └──────────────────────┘   │
                       │                              │
                       │   ┌──────────────────────┐   │
                       │   │        jobs           │   │
                       │   ├──────────────────────┤   │
                       │   │ id (PK)              │   │
                       │   │ company_id (FK) ─────┼───┘
                       │   │ position             │
                       │   │ sector               │
                       │   │ salary               │
                       │   │ work_mode (ENUM)     │
                       │   │ work_time (ENUM)     │
                       │   │ tech_stack (JSON)     │
                       │   │ created_at           │
                       │   └───────────┬──────────┘
                       │               │
                       │   ┌───────────▼──────────┐
                       │   │    applications      │
                       │   ├──────────────────────┤
                       │   │ id (PK)              │
                       │   │ offer_id (FK) ───────┘  → jobs.id
                       └───│ dev_id (FK)              → developers.user_id
                           │ applied_at           │
                           │ UNIQUE(offer_id,     │
                           │        dev_id)       │
                           └──────────────────────┘

                       ┌──────────────────────┐
                       │  password_resets      │
                       ├──────────────────────┤
                       │ id (PK)              │
                       │ user_id (FK)         │
                       │ token                │
                       │ expires_at           │
                       └──────────────────────┘
```

---

## Tables

### `users`

Central user table shared by all roles (developer, company, admin).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `INT` | PK, AUTO_INCREMENT | Unique user identifier |
| `name` | `VARCHAR(255)` | | User display name |
| `email` | `VARCHAR(255)` | UNIQUE | Login email |
| `password` | `VARCHAR(255)` | | bcrypt-hashed password |
| `role` | `ENUM('dev','company','admin')` | | User role |
| `created_at` | `TIMESTAMP` | DEFAULT CURRENT_TIMESTAMP | Registration date |

### `developers`

Extended profile data for users with role `dev`.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `user_id` | `INT` | PK, FK → `users.id` ON DELETE CASCADE | Links to user |
| `description` | `TEXT` | | Bio / about me |
| `years_experience` | `INT` | NOT NULL, DEFAULT 0 | Years of experience |
| `location` | `VARCHAR(100)` | NOT NULL, DEFAULT '' | City / region |
| `tech_stack` | `JSON` | NOT NULL | Array of `{category, items[]}` |
| `avatar` | `LONGTEXT` | | Base64-encoded avatar image |
| `profession` | `VARCHAR(100)` | NULL | Job title / role |
| `phone` | `VARCHAR(20)` | NULL | Contact phone |

### `companies`

Extended profile data for users with role `company`.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `user_id` | `INT` | PK, FK → `users.id` ON DELETE CASCADE | Links to user |
| `description` | `TEXT` | | Company description |
| `location` | `VARCHAR(100)` | DEFAULT '' | Office location |
| `avatar` | `LONGTEXT` | | Base64-encoded logo |
| `phone` | `VARCHAR(20)` | DEFAULT '' | Contact phone |

### `jobs`

Job offers published by companies.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `INT` | PK, AUTO_INCREMENT | Unique job ID |
| `company_id` | `INT` | NOT NULL, FK → `companies.user_id` ON DELETE CASCADE | Publishing company |
| `position` | `VARCHAR(20)` | NOT NULL | Job title |
| `sector` | `VARCHAR(100)` | NOT NULL | Industry sector |
| `salary` | `DECIMAL(10,2)` | NOT NULL | Annual salary |
| `work_mode` | `ENUM('remoto','hibrido','local')` | NOT NULL | Remote / hybrid / on-site |
| `work_time` | `ENUM('completa','parcial','practicas')` | NOT NULL | Full-time / part-time / internship |
| `tech_stack` | `JSON` | NOT NULL | Required technologies |
| `created_at` | `TIMESTAMP` | DEFAULT CURRENT_TIMESTAMP | Publication date |

### `applications`

Tracks which developers have applied to which job offers.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `INT` | PK, AUTO_INCREMENT | Application ID |
| `offer_id` | `INT` | NOT NULL, FK → `jobs.id` ON DELETE CASCADE | Target job |
| `dev_id` | `INT` | NOT NULL, FK → `developers.user_id` ON DELETE CASCADE | Applicant |
| `applied_at` | `DATETIME` | NOT NULL | Application timestamp |
| | | UNIQUE(`offer_id`, `dev_id`) | Prevents duplicate applications |

### `password_resets`

Temporary tokens for the password recovery flow.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `INT` | PK, AUTO_INCREMENT | Reset request ID |
| `user_id` | `INT` | NOT NULL | User requesting reset |
| `token` | `VARCHAR(255)` | NOT NULL | Random hex token |
| `expires_at` | `DATETIME` | NOT NULL | Token expiry (1 hour) |

---

## Cascade Behavior

All foreign keys use `ON DELETE CASCADE`:

- Deleting a **user** automatically removes their `developers`/`companies` record, their `jobs`, and their `applications`.
- Deleting a **job** automatically removes all related `applications`.
