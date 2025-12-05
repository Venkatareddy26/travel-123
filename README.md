# Corporate Travel Management System

A comprehensive full-stack corporate travel management solution with separate portals for employees and administrators, powered by a unified backend architecture.

![Node.js](https://img.shields.io/badge/Node.js-22.x-green)
![React](https://img.shields.io/badge/React-18.x-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-12+-blue)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4.x-black)

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                      UNIFIED ARCHITECTURE                            │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   ┌────────────────────┐           ┌────────────────────┐           │
│   │   Employee Portal  │           │    Admin Portal    │           │
│   │   (React)          │           │   (React + Vite)   │           │
│   │   Port: 3000       │           │   Port: 5173       │           │
│   └─────────┬──────────┘           └─────────┬──────────┘           │
│             │                                │                       │
│             └────────────┬───────────────────┘                       │
│                          ▼                                           │
│              ┌────────────────────┐                                  │
│              │   Unified Backend  │                                  │
│              │  (Node.js/Express) │                                  │
│              │     Port: 5000     │                                  │
│              └─────────┬──────────┘                                  │
│                        │                                             │
│                        ▼                                             │
│              ┌────────────────────┐                                  │
│              │    PostgreSQL      │                                  │
│              │  corporate_travel  │                                  │
│              └────────────────────┘                                  │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
Corporate-Travel-Management/
│
├── Travel_backend/          # Unified Backend API
│   ├── config/              # Database configuration
│   ├── controllers/         # Route handlers
│   ├── middleware/          # Auth middleware
│   ├── modules/             # Sequelize models
│   ├── routes/              # API routes
│   ├── uploads/             # File uploads
│   ├── .env                 # Environment variables
│   ├── server.js            # Main server file
│   └── seed.js              # Database seeder
│
├── Travel_frontend/         # Employee Portal (React)
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── context/         # Auth context
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   └── utils/           # Utility functions
│   └── package.json
│
├── Admin_Portal/            # Admin Portal (React + Vite)
│   ├── src/
│   │   ├── components/      # Dashboard components
│   │   ├── pages/           # Admin pages
│   │   ├── services/        # API services
│   │   └── styles/          # CSS styles
│   ├── docs/                # Documentation
│   └── package.json
│
└── README.md
```

---

## ✨ Features

### Employee Portal (Port 3000)
- 🔐 User authentication (Login/Register)
- ✈️ Create and manage travel requests
- 📋 View trip history
- 💰 Expense tracking and submission
- 📄 Document management (upload/download)
- 🗓️ Itinerary management
- 🚨 Safety compliance & SOS alerts
- 🌍 Risk rating by destination
- 🏥 COVID health guidelines
- 📞 Emergency contacts & Embassy details
- 🔔 Real-time notifications via Socket.IO

### Admin Portal (Port 5173)
- 📊 Dashboard with KPIs and analytics
- ✅ Approve/Reject travel requests
- 👥 View all employee trips
- 📈 Travel analytics and reports
- 🗺️ Global travel map visualization
- ⚠️ Risk management and alerts
- 📋 Policy management
- 💵 Expense oversight
- 📁 Document management
- 🌱 ESG (Environmental, Social, Governance) tracking

---

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v12 or higher) - [Download](https://www.postgresql.org/download/)
- **npm** or **yarn** package manager
- **Git** - [Download](https://git-scm.com/)

---

## 🚀 Installation & Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/Venkatareddy26/travel-123.git
cd travel-123
```

### Step 2: Database Setup

1. **Start PostgreSQL** and connect:
```bash
psql -U postgres
```

2. **Create the database**:
```sql
CREATE DATABASE corporate_travel;
\q
```

### Step 3: Backend Setup

```bash
# Navigate to backend directory
cd Travel_backend

# Install dependencies
npm install

# Configure environment variables
# Edit .env file with your database credentials:
```

**`.env` file configuration:**
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=corporate_travel
PORT=5000
JWT_SECRET=your_jwt_secret_key
```

```bash
# Seed the database with test users
node seed.js

# Start the backend server
npm start
```

✅ Backend will run at: **http://localhost:5000**

### Step 4: Employee Portal Setup

```bash
# Open a new terminal
cd Travel_frontend

# Install dependencies
npm install

# Start the Employee Portal
npm start
```

✅ Employee Portal will run at: **http://localhost:3000**

### Step 5: Admin Portal Setup

```bash
# Open a new terminal
cd Admin_Portal

# Install dependencies
npm install

# Start the Admin Portal
npm run dev
```

✅ Admin Portal will run at: **http://localhost:5173**

---

## 🔑 Test Credentials

| Role | Email | Password | Portal |
|------|-------|----------|--------|
| Admin | admin@corp.com | admin123 | Admin Portal |
| Manager | manager@corp.com | manager123 | Both Portals |
| Employee | employee@corp.com | employee123 | Employee Portal |

---

## 🌐 Access URLs

| Service | URL | Description |
|---------|-----|-------------|
| Backend API | http://localhost:5000 | REST API endpoints |
| Employee Portal | http://localhost:3000 | Employee interface |
| Admin Portal | http://localhost:5173 | Admin dashboard |
| API Health Check | http://localhost:5000/api/healthcheck | Server status |

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/logout` | User logout |

### Travel/Trips
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/travel` | Get user's trips |
| GET | `/api/trips` | Get all trips (Admin) |
| POST | `/api/travel` | Create trip request |
| PATCH | `/api/travel/:id/status` | Update trip status |
| DELETE | `/api/travel/:id` | Delete trip |

### KPI & Analytics (Admin)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/kpi` | Dashboard KPIs |
| GET | `/api/analytics` | Detailed analytics |

### Other Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/expenses` | Expense records |
| GET | `/api/documents` | Documents list |
| GET | `/api/risk` | Risk alerts |
| GET | `/api/safety` | Safety data |
| GET | `/api/itinerary` | Itinerary data |
| GET | `/api/emergency` | Emergency contacts |

---

## 🔄 Real-Time Features (Socket.IO)

The system uses Socket.IO for real-time updates:

| Event | Description |
|-------|-------------|
| `dashboardUpdated` | Dashboard data changed |
| `tripsUpdated` | Trip list updated |
| `tripStatusUpdated` | Trip status changed |
| `joinUser` | User joins notification room |

**Flow Example:**
1. Employee creates a trip → Backend saves to DB
2. Socket.IO emits `dashboardUpdated`
3. Admin sees new pending trip in real-time
4. Admin approves trip → Socket.IO emits `tripStatusUpdated`
5. Employee receives instant notification

---

## 🗄️ Database Schema

### Users Table
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| name | VARCHAR | User's full name |
| email | VARCHAR | Unique email |
| password | VARCHAR | Hashed password |
| role | VARCHAR | admin/manager/employee |
| createdAt | TIMESTAMP | Creation time |

### Travels Table
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| userId | INTEGER | Foreign key to users |
| employeeName | VARCHAR | Requester name |
| destination | VARCHAR | Travel destination |
| purpose | TEXT | Trip purpose |
| startDate | DATE | Start date |
| endDate | DATE | End date |
| budget | DECIMAL | Estimated budget |
| status | VARCHAR | Pending/Approved/Rejected |

---

## 🛡️ Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Sequelize
- **Authentication:** JWT (JSON Web Tokens)
- **Real-time:** Socket.IO
- **File Upload:** Multer

### Employee Portal
- **Framework:** React 18
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **Real-time:** Socket.IO Client
- **PDF Generation:** jsPDF
- **Excel Export:** xlsx

### Admin Portal
- **Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Maps:** React Leaflet
- **Icons:** Lucide React

---

## 📝 Quick Start Commands

```bash
# Clone and setup (run these in order)
git clone https://github.com/Venkatareddy26/travel-123.git
cd travel-123

# Terminal 1: Backend
cd Travel_backend && npm install && node seed.js && npm start

# Terminal 2: Employee Portal
cd Travel_frontend && npm install && npm start

# Terminal 3: Admin Portal
cd Admin_Portal && npm install && npm run dev
```

---

## 🔧 Troubleshooting

### Database Connection Error
```bash
# Ensure PostgreSQL is running
# Check .env credentials match your PostgreSQL setup
```

### Port Already in Use
```bash
# Kill process on port (Windows)
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Kill process on port (Mac/Linux)
lsof -i :5000
kill -9 <PID>
```

### CORS Errors
- Ensure backend is running on port 5000
- Check that frontend URLs are in CORS whitelist in `server.js`

### Login Issues
- Run `node seed.js` to create test users
- Check email doesn't have trailing spaces

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License.

---

## 👨‍💻 Author

**Venkatareddy26**

- GitHub: [@Venkatareddy26](https://github.com/Venkatareddy26)

---

## 🙏 Acknowledgments

- React Team for the amazing frontend framework
- Express.js for the robust backend framework
- PostgreSQL for reliable data storage
- Socket.IO for real-time capabilities

---

**Happy Traveling! ✈️**
