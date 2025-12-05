# Database Schema Reference

## Database: `corporate_travel`

### Connection
```
Host: localhost
Port: 5432
User: postgres
Password: admin
Database: corporate_travel
```

---

## Core Tables (Sequelize Managed)

### 1. `users`
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'employee',
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Test Data:**
```sql
INSERT INTO users (name, email, password, role) VALUES
('Admin User', 'admin@corp.com', '<hashed>', 'admin'),
('Manager User', 'manager@corp.com', '<hashed>', 'manager'),
('Employee User', 'employee@corp.com', '<hashed>', 'employee');
```

---

### 2. `travels`
```sql
CREATE TABLE travels (
    id SERIAL PRIMARY KEY,
    "userId" INTEGER REFERENCES users(id),
    "employeeName" VARCHAR(255),
    destination VARCHAR(255) NOT NULL,
    purpose TEXT,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    budget DECIMAL(10,2),
    urgency VARCHAR(50),
    accommodation VARCHAR(255),
    status VARCHAR(50) DEFAULT 'Pending',
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Status Values:** `Pending`, `Approved`, `Rejected`

---

## Admin Portal Tables

### 3. `risk_advisories`
```sql
CREATE TABLE risk_advisories (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    severity VARCHAR(50) DEFAULT 'low',
    region VARCHAR(100),
    country VARCHAR(100),
    source VARCHAR(100),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);
```

**Severity Values:** `low`, `moderate`, `high`, `critical`

---

### 4. `trip_timeline`
```sql
CREATE TABLE trip_timeline (
    id SERIAL PRIMARY KEY,
    travel_id INTEGER REFERENCES travels(id),
    action VARCHAR(255) NOT NULL,
    actor VARCHAR(255),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    details TEXT
);
```

---

### 5. `trip_comments`
```sql
CREATE TABLE trip_comments (
    id SERIAL PRIMARY KEY,
    travel_id INTEGER REFERENCES travels(id),
    user_id INTEGER REFERENCES users(id),
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Useful Queries

### Get All Trips with User Info
```sql
SELECT t.*, u.name as user_name, u.email as user_email
FROM travels t
LEFT JOIN users u ON t."userId" = u.id
ORDER BY t."createdAt" DESC;
```

### Get Trip Statistics
```sql
SELECT 
    COUNT(*) as total_trips,
    COUNT(CASE WHEN LOWER(status) = 'approved' THEN 1 END) as approved,
    COUNT(CASE WHEN LOWER(status) = 'pending' THEN 1 END) as pending,
    COUNT(CASE WHEN LOWER(status) = 'rejected' THEN 1 END) as rejected,
    COALESCE(SUM(budget), 0) as total_budget
FROM travels;
```

### Get Active Risk Advisories
```sql
SELECT * FROM risk_advisories 
WHERE active = true 
ORDER BY severity DESC, created_at DESC;
```

---

## Setup Commands

```bash
# Connect to PostgreSQL
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres

# Create database
CREATE DATABASE corporate_travel;

# Connect to database
\c corporate_travel

# Run admin tables migration
\i Travel_backend/db/admin_tables.sql

# Seed test users (run from Node.js)
node Travel_backend/seed.js
```
