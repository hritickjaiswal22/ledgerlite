# LedgerLite Backend

Production-oriented REST API for **LedgerLite**, a personal finance application for tracking accounts, income, expenses, budgets, and financial reports.

The backend is built with **Express.js, TypeScript, Prisma ORM, and PostgreSQL**, with a focus on **data consistency, efficient querying, concurrency safety, and scalable API design**.

---

## 🚀 Engineering Highlights

This project focuses on solving backend problems that appear in real production systems:

* **Cursor-based pagination** for efficient transaction feeds
* **Composite indexes** designed around actual query patterns
* **Partial indexes** to optimize frequently accessed subsets of data
* **Database-level constraints** to protect data integrity
* **Atomic database transactions** for financial operations
* **Row-level locking** to prevent concurrent balance inconsistencies
* **Prisma + PostgreSQL** with raw SQL migrations where ORM abstractions are insufficient
* **Zod-based request validation**
* **JWT-based authentication with HTTP-only cookies**
* **Separation of routing, middleware, controllers, and services**
* **Parameterized reporting APIs** for financial analytics

---

## 🏗️ Architecture

```text
                    Client
                      │
                      ▼
              Express REST API
                      │
          ┌───────────┴───────────┐
          │                       │
      Middleware               Routes
          │                       │
   ┌──────┼──────┐                ▼
   │      │      │           Controllers
 Auth   Zod   Error               │
        Validation                ▼
                              Services
                                  │
                          ┌───────┴────────┐
                          │                │
                       Prisma          Raw SQL
                          │                │
                          └───────┬────────┘
                                  ▼
                              PostgreSQL
```

The application keeps business logic inside the service layer rather than embedding it directly inside route handlers.

---

# 🧠 Key Backend Engineering Decisions

## 1. Cursor-Based Pagination

Transaction feeds support **cursor-based pagination** instead of traditional `OFFSET/LIMIT`.

A transaction feed can potentially grow to thousands or millions of records. Offset pagination becomes increasingly expensive because the database may need to scan and discard a large number of rows before returning the requested page.

LedgerLite uses a cursor composed of:

```text
cursorId
cursorDate
```

Transactions are ordered using the same fields used by the cursor.

```text
Page 1
──────────────
Transaction A
Transaction B
Transaction C
       │
       ▼
    Cursor
       │
       ▼
Page 2
──────────────
Transaction D
Transaction E
Transaction F
```

The API fetches:

```text
limit + 1
```

records to determine whether another page exists without requiring a separate `COUNT(*)` query.

### Why this matters

* Better performance for large datasets
* Stable pagination while records are inserted
* Avoids increasingly expensive large offsets
* Works naturally with indexed ordering
* Suitable for infinite scrolling and transaction feeds

---

# 2. Composite Indexes Based on Query Patterns

Indexes were designed around the application's actual access patterns rather than simply indexing individual columns.

For example, transaction queries commonly involve:

```text
user
+ date
+ id
+ transaction type
+ account/category filters
```

Composite indexes allow PostgreSQL to efficiently locate and order the relevant rows.

The important principle is:

> Indexes should be designed around how the application queries the database.

Not every column needs an index.

Too many indexes increase:

* Storage usage
* INSERT/UPDATE cost
* Database maintenance overhead

---

# 3. Partial Indexes

LedgerLite also uses **partial indexes** for queries that only operate on a subset of rows.

Conceptually:

```sql
CREATE INDEX ...
ON transactions (...)
WHERE ...
```

Instead of indexing the entire table, PostgreSQL indexes only the rows that satisfy the condition.

### Why?

A smaller index can mean:

* Less storage
* Fewer index entries
* Lower maintenance cost
* Faster relevant queries

This is particularly useful when the application repeatedly queries a predictable subset of records.

---

# 4. Transactional Consistency

Financial operations require stronger consistency guarantees than a typical CRUD application.

Creating a transaction can involve multiple database operations:

```text
Create Transaction
       │
       ├── Validate account
       │
       ├── Check current balance
       │
       ├── Update account balance
       │
       └── Create transaction record
```

These operations must not partially succeed.

LedgerLite uses PostgreSQL transactions through Prisma so that the operation behaves atomically:

```text
BEGIN

   Update account
        +
   Create transaction

COMMIT
```

If any operation fails:

```text
ROLLBACK
```

This prevents states such as:

```text
❌ Balance updated
❌ Transaction creation failed

→ Financial data becomes inconsistent
```

Instead:

```text
✅ Everything succeeds

OR

✅ Everything rolls back
```

---

# 5. Row-Level Locking & Concurrent Transactions

Atomic transactions alone are not enough when multiple requests can modify the same account concurrently.

Consider:

```text
Initial Balance = ₹10,000

Request A → Expense ₹7,000
Request B → Expense ₹6,000
```

If both requests read the balance before either updates it:

```text
A reads ₹10,000
B reads ₹10,000

A → ₹3,000
B → ₹4,000
```

The system could incorrectly accept both transactions.

LedgerLite uses PostgreSQL row-level locking with:

```sql
SELECT ... FOR UPDATE
```

The account row is locked while the transaction is being processed.

```text
Request A
   │
   ▼
Lock Account Row
   │
   ▼
Read Balance
   │
   ▼
Validate Expense
   │
   ▼
Update Balance
   │
   ▼
Commit
   │
   ▼
Release Lock
        │
        ▼
Request B continues
```

This ensures concurrent financial updates cannot independently operate on stale account state.

### Engineering principle

> Application-level checks are not sufficient for concurrent financial operations. The database must participate in enforcing consistency.

---

# 6. Database Constraints

Important invariants are enforced at the **database level**, not only in application code.

For example, account balance constraints ensure invalid financial states cannot be persisted even if application-level validation is accidentally bypassed.

This provides defense in depth:

```text
API Validation
      ↓
Business Logic
      ↓
Database Constraints
      ↓
PostgreSQL
```

The database remains the final authority over data integrity.

---

# 7. Prisma + PostgreSQL

Prisma is used as the primary ORM for type-safe database access.

```text
TypeScript
    │
    ▼
 Prisma Client
    │
    ▼
PostgreSQL
```

However, the project does not treat the ORM as a replacement for understanding SQL.

Where Prisma's abstraction was insufficient for database-specific functionality, **raw SQL migrations** were used.

Examples include:

* Partial indexes
* Advanced indexing strategies
* Database constraints
* PostgreSQL-specific locking

This keeps the application productive with Prisma while still taking advantage of PostgreSQL's capabilities.

---

# 8. Request Validation with Zod

API inputs are validated at the boundary before reaching business logic.

```text
HTTP Request
     │
     ▼
Zod Validation
     │
 ┌───┴───┐
 │       │
Valid   Invalid
 │       │
 ▼       ▼
Service  400
```

This is particularly important for query-heavy endpoints such as:

```text
GET /transactions
```

which supports:

* Cursor pagination
* Page size
* Account filtering
* Category filtering
* Transaction type
* Date ranges

Keeping validation at the API boundary prevents malformed input from leaking into deeper application layers.

---

# 9. Layered Backend Architecture

The backend follows a separation of concerns:

```text
Routes
  ↓
Middleware
  ↓
Controllers
  ↓
Services
  ↓
Prisma
  ↓
PostgreSQL
```

### Routes

Define HTTP endpoints.

### Middleware

Handles cross-cutting concerns such as:

* Authentication
* Request validation
* Error handling

### Controllers

Translate HTTP requests into application operations.

### Services

Contain business rules and transactional logic.

### Database Layer

Handles persistence through Prisma and PostgreSQL.

This structure keeps business logic independent from HTTP-specific concerns and makes the codebase easier to extend.

---

# 🔐 Authentication & Security

The API implements authentication using access and refresh tokens stored in **HTTP-only cookies**.

Security-related measures include:

* HTTP-only authentication cookies
* Secure cookies in production
* SameSite cookie configuration
* Authentication middleware
* Request validation
* Helmet security headers
* Centralized error handling

The goal is to keep authentication tokens inaccessible to client-side JavaScript and reduce common attack surfaces.

---

# 📊 Reporting APIs

LedgerLite provides APIs for financial analytics such as:

```text
Monthly Summary
Category Summary
Expense Trends
Budget vs Actual
```

Example:

```text
GET /reports/month-summary
GET /reports/category-summary
GET /reports/expense-trend
GET /reports/budget-summary
```

These endpoints demonstrate how transactional data can be transformed into application-level analytics while keeping reporting logic on the backend.

---

# 📡 API Capabilities

### Transactions

```text
POST /transactions
GET  /transactions
```

Supports:

* Cursor pagination
* Configurable page size
* Account filtering
* Category filtering
* Income/expense filtering
* Date-range filtering
* Next-page detection

### Reports

```text
GET /reports/month-summary
GET /reports/category-summary
GET /reports/expense-trend
GET /reports/budget-summary
```

### Authentication

```text
POST /auth/signup
POST /auth/login
```

Additional authentication flows are designed around the same token-based architecture.

---

# 🛠️ Tech Stack

| Layer            | Technology              |
| ---------------- | ----------------------- |
| Runtime          | Node.js                 |
| Language         | TypeScript              |
| Framework        | Express.js              |
| ORM              | Prisma                  |
| Database         | PostgreSQL              |
| Validation       | Zod                     |
| Authentication   | JWT + HTTP-only Cookies |
| Security         | Helmet                  |
| Logging          | Morgan                  |
| Database Hosting | Neon PostgreSQL         |

---

# 🎯 What This Project Demonstrates

LedgerLite intentionally goes beyond basic CRUD.

The main engineering problems addressed are:

```text
                 LedgerLite Backend
                        │
        ┌───────────────┼────────────────┐
        │               │                │
   Scalability     Consistency       Maintainability
        │               │                │
 Cursor Pagination  DB Transactions   Layered Architecture
 Composite Indexes  Row Locking       TypeScript
 Partial Indexes    DB Constraints     Zod Validation
        │               │                │
        └───────────────┼────────────────┘
                        │
                 PostgreSQL
```

The project demonstrates practical backend engineering concepts relevant to production systems:

* Designing APIs around real query patterns
* Efficient pagination for growing datasets
* Database indexing strategy
* Transactional consistency
* Concurrency control
* Database-level data integrity
* Type-safe database access
* Validation at system boundaries
* Separation of business logic from transport concerns

---

## 📌 Engineering Philosophy

> **The goal of LedgerLite is not simply to make CRUD APIs work, but to make the system behave correctly as data volume, concurrency, and application complexity increase.**

This project is intentionally designed to explore the backend engineering problems that appear when moving from a simple application toward a production-grade system.
