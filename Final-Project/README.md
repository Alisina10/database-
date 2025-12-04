# 🏫 AUCA Dorm Management System

A full-stack dormitory management application built for managing students, rooms, payments, and maintenance requests in a university dormitory setting.

## 📋 Project Overview

The **AUCA Dorm Management System** is a modern web application that streamlines the administrative operations of a dormitory. It provides tools for managing student records, room assignments, payment tracking, and maintenance requests with a user-friendly interface.

### Key Features:
- **Dashboard** - Real-time statistics and overview of the dorm
- **Student Management** - Add, view, search, and soft-delete student records
- **Room Management** - Manage rooms, occupancy rates, facilities, and availability
- **Payment Tracking** - Record and track student payments with status management
- **Maintenance Requests** - Log and track maintenance issues by priority
- **Data Recovery** - Restore soft-deleted records within 30 days
- **Dark/Light Theme** - User-friendly interface with theme switching
- **Search Functionality** - Quick search across students, rooms, payments, and maintenance

---

## 🏗️ Project Structure

```
Final-Project/
├── Backend/                    # Node.js Express API + PostgreSQL
│   ├── server/
│   │   └── index.js           # Main Express API server
│   ├── schema.sql             # Database schema
│   ├── seed.sql               # Sample data
│   ├── indexes.sql            # Database indexes
│   ├── queries_basic.sql      # Basic SQL queries
│   ├── queries_advanced.sql   # Advanced queries (CTEs, windows)
│   ├── tx_demo.sql            # Transaction demonstrations
│   ├── backup_restore.txt     # Backup strategy
│   ├── package.json           # Backend dependencies
│   └── .env                   # Environment variables
│
└── Frontend/                   # React + Vite + Tailwind CSS
    └── dorm-web/
        ├── src/
        │   ├── app.jsx        # Main React component
        │   ├── main.jsx       # Entry point
        │   ├── index.css      # Styles
        │   └── app.css        # Application styles
        ├── package.json       # Frontend dependencies
        ├── vite.config.js     # Vite configuration
        ├── tailwind.config.js # Tailwind CSS config
        ├── index.html         # HTML entry
        └── .env               # Frontend environment
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18+)
- **PostgreSQL** (v12+)
- **npm** or **yarn**

### Step 1: Setup Database

1. **Create PostgreSQL database**:
```bash
psql -U postgres
CREATE DATABASE dorm_mgmt;
\q
```

2. **Load schema, seed, and indexes**:
```bash
cd Final-Project/Backend

# Initialize schema
psql -U postgres -d dorm_mgmt -f schema.sql

# Load sample data
psql -U postgres -d dorm_mgmt -f seed.sql

# Create indexes for performance
psql -U postgres -d dorm_mgmt -f indexes.sql
```

3. **Verify database setup**:
```bash
psql -U postgres -d dorm_mgmt -c "SELECT * FROM dorm_mgmt.student LIMIT 1;"
```

---

### Step 2: Setup Backend API

1. **Install dependencies**:
```bash
cd Final-Project/Backend
npm install
```

2. **Create `.env` file**:
```bash
# Backend/.env
DATABASE_URL=postgres://postgres:password@localhost:5432/dorm_mgmt
PORT=4000
NODE_ENV=development
```

3. **Start the API server**:
```bash
npm start
```

Expected output:
```
API running on 4000
```

4. **Test the API**:
```bash
curl http://localhost:4000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "dbTime": "2025-12-04T12:00:00.000Z"
}
```

---

### Step 3: Setup Frontend

1. **Install dependencies**:
```bash
cd Final-Project/Frontend/dorm-web
npm install
```

2. **Create `.env` file**:
```bash
# Frontend/dorm-web/.env
VITE_API_URL=http://localhost:4000
```

3. **Start development server**:
```bash
npm run dev
```

Expected output:
```
VITE v7.2.4 ready in 123 ms

➜  Local:   http://localhost:5173/
```

4. **Open in browser**: `http://localhost:5173/`

---

## 📚 API Endpoints

### Health Check
- `GET /api/health` - Check API and database connection status

### Students
- `GET /api/students` - List all active students (supports search with `?q=`)
- `GET /api/students?deleted=true` - List soft-deleted students (within 30 days)
- `POST /api/students` - Create new student
- `DELETE /api/students/:id` - Soft-delete a student
- `POST /api/students/:id/restore` - Restore deleted student

### Rooms
- `GET /api/rooms` - List all active rooms (supports search with `?q=` and `?available=true`)
- `GET /api/rooms?deleted=true` - List soft-deleted rooms
- `POST /api/rooms` - Create new room
- `DELETE /api/rooms/:id` - Soft-delete a room
- `POST /api/rooms/:id/restore` - Restore deleted room

### Payments
- `GET /api/payments` - List all active payments (supports search with `?q=`)
- `GET /api/payments?deleted=true` - List soft-deleted payments
- `POST /api/payments` - Record a payment
- `DELETE /api/payments/:id` - Soft-delete a payment
- `POST /api/payments/:id/restore` - Restore deleted payment

### Maintenance
- `GET /api/maintenance` - List all active requests (supports search with `?q=`)
- `GET /api/maintenance?deleted=true` - List soft-deleted requests
- `POST /api/maintenance` - Create maintenance request
- `DELETE /api/maintenance/:id` - Soft-delete a request
- `POST /api/maintenance/:id/restore` - Restore deleted request

### Statistics
- `GET /api/stats` - Get dashboard statistics (total students, rooms, occupancy rate, etc.)

---

## 🗄️ Database Schema

### Core Tables:
- **building** - Dormitory buildings
- **room_type** - Types of rooms (single, double, triple, etc.) with capacity and rates
- **room** - Individual rooms with status and facilities
- **student** - Student information
- **assignment** - Student-to-room assignments with bed numbers
- **facility** - Available facilities (WiFi, AC, etc.)
- **room_facility** - Many-to-many relationship between rooms and facilities
- **payment** - Student payment records with status and method
- **maintenance_request** - Maintenance issues logged for rooms
- **maintenance_log** - History of status changes for maintenance

### Soft Delete Feature:
- Records include `deleted_at` timestamp instead of hard deletion
- Records deleted within 30 days can be recovered
- Queries automatically filter out soft-deleted records

---

## 💾 Database Operations

### Run Sample Queries

**Basic queries**:
```bash
psql -U postgres -d dorm_mgmt -f Backend/queries_basic.sql
```

**Advanced queries** (CTEs, window functions, aggregations):
```bash
psql -U postgres -d dorm_mgmt -f Backend/queries_advanced.sql
```

**Transaction demo**:
```bash
psql -U postgres -d dorm_mgmt -f Backend/tx_demo.sql
```

### Backup and Restore

**Create backup**:
```bash
pg_dump -U postgres -d dorm_mgmt > dorm_backup.sql
```

**Restore from backup**:
```bash
psql -U postgres -d dorm_mgmt < dorm_backup.sql
```

---

## 🎨 Frontend Features

### Dashboard
- Overview of total students, rooms, and occupancy percentage
- Summary of pending payments
- Recent maintenance requests with priority levels

### Students Tab
- View all students with room assignments
- Search by name or email
- Add new students
- Soft-delete records

### Rooms Tab
- View all rooms as cards
- Display room details (type, occupancy, monthly rate, facilities)
- Search by building or room number
- Add new rooms
- Soft-delete records

### Payments Tab
- Tabular view of all payments
- Filter by student name
- Track payment status (pending/paid)
- Record new payments
- Soft-delete records

### Maintenance Tab
- View maintenance requests
- Filter by building, room, or category
- Priority indicators (high/medium/low)
- Status tracking (open/in-progress/resolved)
- Create new requests
- Soft-delete records

### Recovery Tab
- View all soft-deleted records from the last 30 days
- Restore students, rooms, payments, or maintenance requests

---

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM/Query**: pg (Node PostgreSQL library)
- **Environment**: dotenv

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **HTTP Client**: Fetch API

---

## 📝 Environment Variables

### Backend (`.env`)
```env
DATABASE_URL=postgres://user:password@host:port/database
PORT=4000
NODE_ENV=development
```

### Frontend (`.env`)
```env
VITE_API_URL=http://localhost:4000
```

---

## 🔍 Troubleshooting

### API won't start
- Check if PostgreSQL is running: `psql -U postgres`
- Verify `DATABASE_URL` in `.env`
- Ensure database exists: `psql -U postgres -l`

### Frontend can't connect to API
- Verify backend is running on port 4000
- Check `VITE_API_URL` in frontend `.env`
- Check browser console for CORS errors

### Database connection refused
- Verify PostgreSQL service is running
- Check connection string format: `postgres://user:pass@localhost:5432/db`
- Test connection: `psql -U postgres`

### Port already in use
- Backend: `lsof -i :4000` to find process using port 4000
- Frontend: `lsof -i :5173` to find process using port 5173

---

## 📊 Sample Data

The database is pre-populated with:
- 5 buildings
- 3 room types (single, double, triple)
- 15 sample rooms
- 10 sample students
- 5 assignments
- 8 payments
- 6 maintenance requests

Run `psql -U postgres -d dorm_mgmt -f Backend/seed.sql` to refresh sample data.

---

## 🔐 Security Features

- **Soft Deletes**: Data is never permanently deleted, allowing recovery within 30 days
- **Input Validation**: Backend validates all required fields
- **CORS**: Express configured with CORS middleware
- **SQL Parameterization**: All queries use parameterized statements to prevent SQL injection

---

## 📈 Performance Optimizations

- Database indexes on frequently queried columns
- Query result pagination support
- Lateral joins for efficient room-assignment queries
- Connection pooling via pg.Pool

---

## 🚧 Future Enhancements

- User authentication and authorization
- Role-based access control (admin, staff, student)
- Email notifications for payment reminders
- Payment history and invoicing
- Room inspection checklists
- Automated backup scheduling
- Advanced reporting and analytics
- Mobile app

---

## 📞 Support

For issues or questions, refer to:
- Backend README: `Final-Project/Backend/README.md`
- Database schema: `Final-Project/Backend/schema.sql`
- API documentation: Check endpoints in `server/index.js`

---

## 📄 License

This project is for educational purposes at AUCA.

---

**Happy Dorm Managing! 🎓**
