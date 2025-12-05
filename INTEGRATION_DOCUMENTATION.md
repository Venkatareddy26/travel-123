# Corporate Travel Management System - Integration Documentation

## Project Overview

This document covers all changes made to integrate the **Employee Portal** (Travel_frontend) with the **Admin Portal** (ad/project/Frontend) using a unified backend architecture.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     UNIFIED ARCHITECTURE                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌──────────────────┐         ┌──────────────────┐            │
│   │  Employee Portal │         │   Admin Portal   │            │
│   │   (React)        │         │   (React+Vite)   │            │
│   │   Port: 3000     │         │   Port: 5173     │            │
│   └────────┬─────────┘         └────────┬─────────┘            │
│            │                            │                       │
│            └──────────┬─────────────────┘                       │
│                       ▼                                         │
│            ┌──────────────────┐                                 │
│            │  Unified Backend │                                 │
│            │  (Node/Express)  │                                 │
│            │   Port: 5000     │                                 │
│            └────────┬─────────┘                                 │
│                     │                                           │
│                     ▼                                           │
│            ┌──────────────────┐                                 │
│            │   PostgreSQL     │                                 │
│            │ corporate_travel │                                 │
│            └──────────────────┘                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Database Configuration

### Connection Details
```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=admin
DB_NAME=corporate_travel
```

### Database Tables

#### 1. `users` Table
Stores all user accounts for both portals.

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key, auto-increment |
| name | VARCHAR(255) | User's full name |
| email | VARCHAR(255) | Unique email address |
| password | VARCHAR(255) | Hashed password |
| role | VARCHAR(50) | 'admin', 'manager', or 'employee' |
| createdAt | TIMESTAMP | Record creation time |
| updatedAt | TIMESTAMP | Last update time |

#### 2. `travels` Table
Stores all travel/trip requests.

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key, auto-increment |
| userId | INTEGER | Foreign key to users table |
| employeeName | VARCHAR(255) | Name of requesting employee |
| destination | VARCHAR(255) | Travel destination |
| purpose | TEXT | Purpose of travel |
| startDate | DATE | Trip start date |
| endDate | DATE | Trip end date |
| budget | DECIMAL | Estimated budget |
| urgency | VARCHAR(50) | Urgency level |
| accommodation | VARCHAR(255) | Accommodation details |
| status | VARCHAR(50) | 'Pending', 'Approved', 'Rejected' |
| createdAt | TIMESTAMP | Record creation time |
| updatedAt | TIMESTAMP | Last update time |

### Test Users (Seeded)

| Email | Password | Role |
|-------|----------|------|
| admin@corp.com | admin123 | admin |
| manager@corp.com | manager123 | manager |
| employee@corp.com | employee123 | employee |

---

## Backend Changes (Travel_backend)

### New Files Created

#### 1. `controllers/kpiController.js`
Provides KPI metrics for the Admin Dashboard.

**Endpoints:**
- `GET /api/kpi` - Returns dashboard KPI metrics
- `GET /api/analytics` - Returns detailed analytics data

**KPI Response Format:**
```json
{
  "success": true,
  "kpis": {
    "total_trips": 3,
    "trips_count": 3,
    "approved_trips": 1,
    "pending_trips": 2,
    "rejected_trips": 0,
    "distinct_travelers": 1,
    "destinations_count": 3,
    "total_budget": 8523,
    "total_spend": 0,
    "approval_rate": 33
  }
}
```

#### 2. `controllers/riskController.js`
Provides risk assessment data for travel destinations.

**Endpoints:**
- `GET /api/risk` - Returns risk alerts
- `GET /api/risk/:country` - Returns risk level for specific country

#### 3. `routes/kpiRoutes.js`
```javascript
router.get('/', authMiddleware, getKPIs);
```

#### 4. `routes/analyticsRoutes.js`
```javascript
router.get('/', authMiddleware, getAnalytics);
```



### Modified Files

#### 1. `server.js`
**Changes:**
- Added CORS support for both frontends (ports 3000 and 5173)
- Added Socket.IO for real-time updates
- Added new route imports for KPI, Analytics, and Risk
- Added `/api/trips` alias for admin portal compatibility

```javascript
// CORS Configuration
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5173"],
  credentials: true,
}));

// Socket.IO Configuration
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  },
});

// New Routes Added
app.use("/api/kpi", kpiRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/risk", riskRoutes);
app.use("/api/trips", travelRoutes); // Alias for admin portal
```

#### 2. `controllers/travelController.js`
**Changes:**
- Updated `getAllTravelRequests` to return admin-portal compatible format
- Added real-time Socket.IO notifications on status updates
- Added fields: `start`, `end`, `requester`, `costEstimate`, `riskLevel`

```javascript
// Admin-compatible response format
const formattedTrips = trips.map((trip) => ({
  id: t.id,
  destination: t.destination,
  start: t.startDate,           // Admin portal field
  end: t.endDate,               // Admin portal field
  status: t.status.toLowerCase(),
  requester: t.employeeName,    // Admin portal field
  costEstimate: Number(t.budget),
  // ... plus original fields for employee portal
}));
```

#### 3. `controllers/authController.js`
**Changes:**
- Added email trimming to fix login issues with trailing spaces

```javascript
const login = async (req, res) => {
  const email = req.body.email?.trim(); // Trim whitespace
  // ...
};
```

#### 4. `routes/travelRoutes.js`
**Changes:**
- Added PATCH endpoint for admin portal compatibility
- Added DELETE endpoint for trip deletion

```javascript
router.patch("/:id/status", authMiddleware, updateTravelStatus);
router.delete("/:id", authMiddleware, deleteTravelRequest);
```

#### 5. `seed.js`
**Changes:**
- Fixed model import from `User` to `Users`

```javascript
const { Users } = require("./modules");
```

---

## Admin Portal Changes (ad/project/Frontend)

### Modified Files

#### 1. `.env.local`
**Changes:**
- Updated API URL to point to unified backend

```
VITE_API_URL=http://localhost:5000
```

#### 2. `src/pages/dashboard.js`
**Changes:**
- Added authentication headers to API requests
- Updated to read `trips_count` from KPI response
- Added parallel fetch for KPI and trips data

```javascript
const token = localStorage.getItem('app_token');
const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
};

// Fetch KPI data
const kpiRes = await fetch(`${API_BASE}/api/kpi?range=30d`, { headers });

// Map trips_count to summary
trips: Number(k.trips_count) || 0,
```

#### 3. `src/pages/trips.js`
**Changes:**
- Added authentication headers to all API requests
- Updated to work with unified backend endpoints

```javascript
const token = localStorage.getItem('app_token');
const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
};
```

#### 4. `src/services/api.js`
**Changes:**
- Updated base URL configuration
- Added token handling for authenticated requests

---

## API Endpoints Reference

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/logout` | User logout |

### Travel/Trips
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/travel` | Get user's trips (Employee) |
| GET | `/api/trips` | Get all trips (Admin) |
| POST | `/api/travel` | Create new trip request |
| PATCH | `/api/travel/:id/status` | Update trip status |
| PUT | `/api/travel/:id/status` | Update trip status (alt) |
| DELETE | `/api/travel/:id` | Delete trip |

### KPI & Analytics (Admin)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/kpi` | Get dashboard KPIs |
| GET | `/api/analytics` | Get detailed analytics |

### Risk
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/risk` | Get risk alerts |
| GET | `/api/risk/:country` | Get country risk level |

---

## Real-Time Features (Socket.IO)

### Events Emitted by Server
| Event | Description | Payload |
|-------|-------------|---------|
| `dashboardUpdated` | Dashboard data changed | - |
| `tripsUpdated` | User's trips changed | - |
| `tripStatusUpdated` | Trip status changed | `{ tripId, status, message }` |

### Client Events
| Event | Description | Payload |
|-------|-------------|---------|
| `joinUser` | Join user's room | `userId` |

---

## Flow: Trip Request Lifecycle

```
1. EMPLOYEE CREATES TRIP
   └─► Employee Portal (port 3000)
       └─► POST /api/travel
           └─► Backend creates trip with status="Pending"
               └─► Socket.IO emits "dashboardUpdated"

2. ADMIN VIEWS PENDING TRIPS
   └─► Admin Portal (port 5173)
       └─► GET /api/trips
           └─► Returns all trips with admin-compatible format

3. ADMIN APPROVES/REJECTS
   └─► Admin Portal
       └─► PATCH /api/travel/:id/status
           └─► Backend updates status
               └─► Socket.IO emits "tripStatusUpdated" to employee
               └─► Socket.IO emits "dashboardUpdated"

4. EMPLOYEE SEES UPDATE
   └─► Employee Portal receives real-time notification
       └─► UI updates automatically
```



---

## Running the Application

### Prerequisites
- Node.js (v16+)
- PostgreSQL (v12+)
- npm or yarn

### Step 1: Database Setup
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE corporate_travel;

# Exit psql
\q
```

### Step 2: Backend Setup
```bash
cd Corporate-Travel-policy-Tool/Travel_backend

# Install dependencies
npm install

# Configure environment (.env file)
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=admin
DB_NAME=corporate_travel
JWT_SECRET=your_jwt_secret
PORT=5000

# Seed database with test users
node seed.js

# Start backend server
npm start
```

### Step 3: Employee Portal Setup
```bash
cd Corporate-Travel-policy-Tool/Travel_frontend

# Install dependencies
npm install

# Start frontend (port 3000)
npm start
```

### Step 4: Admin Portal Setup
```bash
cd ad/project/Frontend

# Install dependencies
npm install

# Configure environment (.env.local)
VITE_API_URL=http://localhost:5000

# Start admin portal (port 5173)
npm run dev
```

### Access URLs
- Employee Portal: http://localhost:3000
- Admin Portal: http://localhost:5173
- Backend API: http://localhost:5000

---

## Troubleshooting

### Issue: "User not found" on login
**Cause:** Trailing whitespace in email input
**Solution:** Fixed in `authController.js` with email trimming

### Issue: Dashboard showing 0 trips
**Cause:** Table name case sensitivity in SQL queries
**Solution:** Changed `"Travels"` to `travels` in `kpiController.js`

### Issue: CORS errors
**Cause:** Frontend URL not in CORS whitelist
**Solution:** Added both ports to CORS origin array in `server.js`

### Issue: Unauthorized errors on admin portal
**Cause:** Missing auth token in API requests
**Solution:** Added `Authorization` header to all fetch calls

---

## File Structure

```
Corporate-Travel-policy-Tool/
├── Travel_backend/
│   ├── config/
│   │   └── db.js                 # Database connection
│   ├── controllers/
│   │   ├── authController.js     # Authentication (MODIFIED)
│   │   ├── kpiController.js      # KPI metrics (NEW)
│   │   ├── riskController.js     # Risk data (NEW)
│   │   └── travelController.js   # Trip management (MODIFIED)
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT verification
│   ├── modules/
│   │   └── index.js              # Sequelize models
│   ├── routes/
│   │   ├── analyticsRoutes.js    # Analytics routes (NEW)
│   │   ├── kpiRoutes.js          # KPI routes (NEW)
│   │   ├── riskRoutes.js         # Risk routes (NEW)
│   │   └── travelRoutes.js       # Travel routes (MODIFIED)
│   ├── db/
│   │   └── admin_tables.sql      # SQL migrations (NEW)
│   ├── .env                      # Environment config
│   ├── seed.js                   # Database seeder (MODIFIED)
│   └── server.js                 # Main server (MODIFIED)
│
├── Travel_frontend/              # Employee Portal (unchanged)
│
└── INTEGRATION_DOCUMENTATION.md  # This file

ad/
└── project/
    └── Frontend/
        ├── src/
        │   ├── pages/
        │   │   ├── dashboard.js  # Dashboard (MODIFIED)
        │   │   └── trips.js      # Trips page (MODIFIED)
        │   └── services/
        │       └── api.js        # API service (MODIFIED)
        └── .env.local            # Environment config (MODIFIED)
```

---

## Summary of Changes

| Category | File | Change Type | Description |
|----------|------|-------------|-------------|
| Backend | server.js | Modified | Added CORS, Socket.IO, new routes |
| Backend | kpiController.js | New | KPI metrics for admin dashboard |
| Backend | riskController.js | New | Risk assessment data |
| Backend | travelController.js | Modified | Admin-compatible response format |
| Backend | authController.js | Modified | Email trimming fix |
| Backend | travelRoutes.js | Modified | Added PATCH/DELETE endpoints |
| Backend | kpiRoutes.js | New | KPI route definitions |
| Backend | analyticsRoutes.js | New | Analytics route definitions |
| Backend | seed.js | Modified | Fixed model import |
| Admin | .env.local | Modified | Updated API URL |
| Admin | dashboard.js | Modified | Auth headers, KPI integration |
| Admin | trips.js | Modified | Auth headers, API integration |
| Database | corporate_travel | New | Shared database for both portals |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Dec 2024 | Initial integration of Employee and Admin portals |

---

*Documentation generated for Corporate Travel Management System Integration*
