# Corporate Travel Policy Tool

A full-stack corporate travel management system with unified single-port architecture.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│              SINGLE-PORT ARCHITECTURE                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│              ┌──────────────────┐                       │
│              │   Unified Login  │                       │
│              │  localhost:3000  │                       │
│              └────────┬─────────┘                       │
│                       │                                 │
│         ┌─────────────┴─────────────┐                   │
│         ▼                           ▼                   │
│  ┌─────────────┐           ┌─────────────┐              │
│  │  Employee   │           │   Admin     │              │
│  │   Portal    │           │   Portal    │              │
│  │ /dashboard  │           │ /admin/#/.. │              │
│  └─────────────┘           └─────────────┘              │
│                                                         │
│              ┌──────────────────┐                       │
│              │   Backend API    │                       │
│              │  localhost:5000  │                       │
│              └────────┬─────────┘                       │
│                       │                                 │
│              ┌──────────────────┐                       │
│              │   PostgreSQL     │                       │
│              │ corporate_travel │                       │
│              └──────────────────┘                       │
└─────────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
Corporate-Travel-policy-Tool/
├── Travel_backend/          # Node.js + Express API
│   ├── controllers/         # Route handlers
│   ├── middleware/          # Auth middleware
│   ├── modules/             # Sequelize models
│   ├── routes/              # API routes
│   ├── db/db_dump.sql       # Database schema + sample data
│   ├── seed.js              # Create test users
│   └── server.js            # Main server (port 5000)
│
├── Travel_frontend/         # React Employee Portal
│   ├── public/admin/        # Admin Portal (built files)
│   └── src/                 # Employee Portal source
│
└── Admin_Portal/            # Admin Portal source (for development)
```

## 🚀 Quick Setup

### Prerequisites
- Node.js v16+
- PostgreSQL v12+
- Git Bash (Windows) or Terminal (Mac/Linux)

### Bash Commands

```bash
# 1. Clone repository
git clone https://github.com/Venkatareddy26/Corporate-Travel-policy-Tool.git
cd Corporate-Travel-policy-Tool

# 2. Database setup
psql -U postgres -c "CREATE DATABASE corporate_travel;"
psql -U postgres -d corporate_travel -f Travel_backend/db/db_dump.sql

# 3. Backend setup
cd Travel_backend
npm install
node seed.js
npm start

# 4. Frontend setup (new terminal)
cd Travel_frontend
npm install
npm start
```

## 🗄️ Database Commands

### PostgreSQL Setup
```bash
# Create database
psql -U postgres -c "CREATE DATABASE corporate_travel;"

# Import schema and sample data
psql -U postgres -d corporate_travel -f Travel_backend/db/db_dump.sql

# Create test users
cd Travel_backend
node seed.js
```

### Check Data in PostgreSQL
```bash
# Connect to database
psql -U postgres -d corporate_travel

# View all tables
\dt

# View users
SELECT * FROM "Users";

# View trips
SELECT * FROM "Trips";

# Exit
\q
```

### Using pgAdmin Query Tool
```sql
-- View all users
SELECT id, name, email, role FROM "Users";

-- View all trips
SELECT id, destination, status, "userId" FROM "Trips";

-- View trips with user details
SELECT t.id, t.destination, t.status, u.name, u.email 
FROM "Trips" t 
JOIN "Users" u ON t."userId" = u.id;
```

### Reset Database
```bash
# Drop and recreate
psql -U postgres -c "DROP DATABASE IF EXISTS corporate_travel;"
psql -U postgres -c "CREATE DATABASE corporate_travel;"
psql -U postgres -d corporate_travel -f Travel_backend/db/db_dump.sql
cd Travel_backend && node seed.js
```

### Environment Variables

Create `Travel_backend/.env`:
```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=corporate_travel
PORT=5000
JWT_SECRET=mysecretkey123
```

## 🔑 Test Credentials

| Role | Email | Password | Portal |
|------|-------|----------|--------|
| Admin | admin@corp.com | admin123 | Admin Portal |
| Manager | manager@corp.com | manager123 | Admin Portal |
| Employee | employee@corp.com | employee123 | Employee Portal |

## 🌐 URLs

| Service | URL |
|---------|-----|
| Login | http://localhost:3000/login |
| Employee Portal | http://localhost:3000/dashboard |
| Admin Portal | http://localhost:3000/admin/index.html#/dashboard |
| Backend API | http://localhost:5000 |

## ✨ Features

### Employee Portal
- ✈️ Trip requests & history
- 💰 Expense tracking
- 📋 Itinerary management
- 🛡️ Safety compliance
- 📄 Document management

### Admin Portal
- 📊 Dashboard with KPIs
- ✅ Approve/Reject requests
- 📈 Travel analytics
- ⚠️ Risk management
- 📋 Policy management

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/login | User login |
| POST | /api/auth/register | User registration |
| GET | /api/travel | Get trips |
| POST | /api/travel | Create trip |
| PATCH | /api/travel/:id/status | Update status |
| GET | /api/kpi | Dashboard KPIs |
| GET | /api/expenses | Expenses |

## 🔧 Troubleshooting

**Dashboard redirects to login:**
```bash
# Clear browser localStorage
# Press F12 → Console → type:
localStorage.clear()
# Then refresh and login again
```

**Database issues:**
```bash
# Re-run database setup
psql -U postgres -d corporate_travel -f Travel_backend/db/db_dump.sql
node seed.js
```

**Port in use:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :3000
kill -9 <PID>
```

## 🔄 Rebuild Admin Portal

If you modify Admin Portal source:
```bash
cd Admin_Portal
npm run build

# Windows
xcopy /E /Y dist\* ..\Travel_frontend\public\admin\

# Mac/Linux
cp -r dist/* ../Travel_frontend/public/admin/
```

## 🛡️ Tech Stack

- **Backend:** Node.js, Express, PostgreSQL, Sequelize, JWT
- **Frontend:** React 18, React Router, Axios
- **Admin:** React 18, Vite, Tailwind CSS, Recharts

---

**Author:** [@Venkatareddy26](https://github.com/Venkatareddy26)
