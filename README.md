# 🏢 Business Building Management System (BBMS)

A minimal, clean monorepo project demonstrating **CRUD operations**, **MongoDB relationships**, and **aggregation pipelines** — built for a college database demo.

## 📦 Tech Stack
- **Frontend**: React (Vite) + plain CSS + Axios
- **Backend**: Express.js + Mongoose (MongoDB)
- **Database**: MongoDB (local or Atlas)

## 🗂️ Project Structure
```
BBMS_DBMS/
├── backend/          # Express + Mongoose API
├── frontend/         # React (Vite) app
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js ≥ 18
- MongoDB running locally on `mongodb://localhost:27017`  
  (or set `MONGO_URI` in `backend/.env`)

### 1. Install & Run Backend
```bash
cd backend
npm install
node seed.js        # (optional) seed sample data
npm run dev         # starts on http://localhost:5000
```

### 2. Install & Run Frontend
```bash
cd frontend
npm install
npm run dev         # starts on http://localhost:5173
```

Open **http://localhost:5173** in your browser.

## 🗄️ MongoDB Collections & Relationships
```
Users        — username, password, role (admin/chairman)
Buildings    — name, address
Floors       — floorNumber, building (ref)
Rooms        — roomNumber, floor (ref)
Owners       — name, phone, email
Businesses   — name, room (ref), owner (ref)
Employees    — name, role, business (ref)
```

## 🔍 Key Demo Points
| Feature | Where |
|---------|-------|
| CRUD (Create/Read/Update/Delete) | All routes in `/backend/routes/` |
| MongoDB Aggregation Pipeline | `GET /api/floors/:id/summary` |
| Cross-collection Search | `GET /api/search?q=...` |
| Schema Relationships (ObjectId refs) | `/backend/models/` |
| Login (plain password check) | `POST /api/users/login` |
