# Corporate Travel Management System

A full-stack corporate travel management solution with unified single-port architecture. Both Employee and Admin portals run on a single port with role-based redirection.

![Node.js](https://img.shields.io/badge/Node.js-22.x-green)
![React](https://img.shields.io/badge/React-18.x-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-12+-blue)

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                    UNIFIED SINGLE-PORT ARCHITECTURE                  │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│                    ┌────────────────────┐                            │
│                    │   Single Login     │                            │
│                    │   localhost:3000   │                            │
│                    └─────────┬──────────┘                            │
│                              │                                       │
│              ┌───────────────┴───────────────┐                       │
│              │      Role-Based Redirect      │                       │
│              └───────────────┬───────────────┘                       │
│                              │                                       │
│         ┌────────────────────┴────────────────────┐                  │
│         ▼                                         ▼                  │
│   ┌──────────────┐                      ┌──────────────┐             │
│   │   Employee   │                      │    Admin     │             │
│   │   Portal     │                      │   Portal     │             │
│   │  /dashboard  │                      │ /admin/#/... │             │
│   └──────────────┘                      └──────────────┘             │
│                                                                      │
│                    ┌────────────────────┐                            │
│                    │   Backend API      │                            │
│                    │   localhost:5000   │                            │
│                    └─────────┬──────────┘                            │
│                              │                                       │
│                    ┌────────────────────┐                            │
│                    │    PostgreSQL      │                            │
│                    │  corporate_travel  │                            │
│                    └────────────────────┘                            │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
Corporate-Travel-Management/
├── Admin_Portal/            # Admin Portal Source Code
│   ├── src/
│   │   ├── components/      # Dashboard components
│   │   ├── pages/           # Admin pages
│   │   └── main.js          # Entry point (HashRouter)
│   ├── vite.config.js       # Vite config (base: /admin/)
│   └── package.json
│
├── Travel_backend/          # Backend API
│   ├── config/              # Database configuration
│   ├── controllers/         # Route handlers
│   ├── middleware/          # Auth middleware
│   ├── modules/             # Sequelize models
│   ├── routes/              # API routes
│   ├── .env                 # Environment variables
│   ├── server.js            # Main server
│   └── seed.js              # Database seeder
│
├── Travel_frontend/         # Employee Portal + Admin Built Files
│   ├── public/
│   │   └── admin/           # Admin Portal built files (auto-generated)
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── context/         # Auth context
│   │   ├── pages/           # Page components
│   │   │   └── login/       # Unified login page
│   │   └── services/        # API services
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## ✨ Features

### Single Login Page
- One unified login at `http://localhost:3000/login`
- Role-based automatic redirection
- Admin/Manager → Admin Portal
- Employee → Employee Portal

### Employee Portal
- ✈️ Create and manage travel requests
- 📋 View trip history
- 💰 Expense tracking
- 📄 Document management
- 🗓️ Itinerary management
- 🚨 Safety compliance & SOS alerts
- 🌍 Risk rating by destination
- 📞 Emergency contacts

### Admin Portal
- 📊 Dashboard with KPIs
- ✅ Approve/Reject travel requests
- 📈 Travel analytics
- 🗺️ Global travel map
- ⚠️ Risk management
- 📋 Policy management
- 💵 Expense oversight

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- PostgreSQL (v12+)

### Step 1: Clone Repository
```bash
git clone https://github.com/Venkatareddy26/travel-123.git
cd travel-123
```

### Step 2: Database Setup

**Option A: Fresh Setup (Recommended)**
```bash
# Create database
psql -U postgres -c "CREATE DATABASE corporate_travel;"

# Run setup script
psql -U postgres -d corporate_travel -f Travel_backend/db/setup.sql

# Seed test users
cd Travel_backend
node seed.js
```

**Option B: Restore from Dump (includes sample data)**
```bash
# Create database
psql -U postgres -c "CREATE DATABASE corporate_travel;"

# Restore full dump
psql -U postgres -d corporate_travel -f Travel_backend/db/db_dump.sql
```

**Database Files:**
| File | Description |
|------|-------------|
| `db/setup.sql` | Clean schema setup script |
| `db/db_dump.sql` | Full dump with sample data |
| `db/DATABASE_SCHEMA.md` | Schema documentation |
| `seed.js` | Creates test users |

### Step 3: Backend Setup
```bash
cd Travel_backend
npm install

# Configure .env file:
# DB_HOST=localhost
# DB_PORT=5432
# DB_USER=postgres
# DB_PASSWORD=your_password
# DB_NAME=corporate_travel
# PORT=5000
# JWT_SECRET=your_secret

node seed.js    # Create test users
npm start       # Start backend on port 5000
```

### Step 4: Frontend Setup
```bash
cd Travel_frontend
npm install
npm start       # Start on port 3000
```

### Step 5: Access Application
Open `http://localhost:3000/login`

---

## 🔑 Test Credentials

| Role | Email | Password | Redirects To |
|------|-------|----------|--------------|
| Admin | admin@corp.com | admin123 | Admin Portal |
| Manager | manager@corp.com | manager123 | Admin Portal |
| Employee | employee@corp.com | employee123 | Employee Portal |

---

## 🌐 URLs

| Service | URL |
|---------|-----|
| Login Page | http://localhost:3000/login |
| Employee Portal | http://localhost:3000/dashboard |
| Admin Portal | http://localhost:3000/admin/index.html#/dashboard |
| Backend API | http://localhost:5000 |

---

## 🔄 Rebuilding Admin Portal

If you modify Admin Portal source code:

```bash
cd Admin_Portal
npm run build

# Copy built files to frontend
# Windows:
xcopy /E /Y dist\* ..\Travel_frontend\public\admin\

# Mac/Linux:
cp -r dist/* ../Travel_frontend/public/admin/
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/register` | User registration |
| GET | `/api/travel` | Get user's trips |
| GET | `/api/trips` | Get all trips (Admin) |
| POST | `/api/travel` | Create trip request |
| PATCH | `/api/travel/:id/status` | Update trip status |
| GET | `/api/kpi` | Dashboard KPIs |
| GET | `/api/expenses` | Expense records |
| GET | `/api/documents` | Documents list |

---

## 🛡️ Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Node.js, Express, PostgreSQL, Sequelize, JWT |
| Employee Portal | React 18, React Router, Axios |
| Admin Portal | React 18, Vite, Tailwind CSS, Recharts |

---

## 🔧 Troubleshooting

**Database Connection Error:**
- Ensure PostgreSQL is running
- Verify `.env` credentials

**Port Already in Use:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Login Issues:**
- Run `node seed.js` to create test users
- Clear browser localStorage

---

## 👨‍💻 Author

**Venkatareddy26** - [@Venkatareddy26](https://github.com/Venkatareddy26)

---

**Happy Traveling! ✈️**
