# AUCA Dorm Management (Backend + Frontend)

Database/API project for AUCA’s dorm operations: students, rooms, payments, maintenance, and stats. Backend lives here; full frontend + backend bundle is in Google Drive (see link below).

## Stack
- Backend: Node.js (Express, pg, cors, dotenv), PostgreSQL
- Frontend: React + Vite + Tailwind (in Google Drive bundle)
- Exports: SQL schema/seed/indexes and dump files

## Prerequisites
- Node.js 18+ and npm
- PostgreSQL running locally
- `psql` in PATH

## Backend setup
1) `cd Backend`
2) Create `.env`:
DATABASE_URL=postgres://user:pass@localhost:5432/dorm_db
PORT=4000

3) Initialize database:
psql -U <user> -d <db> -f schema.sql
psql -U <user> -d <db> -f seed.sql
psql -U <user> -d <db> -f indexes.sql

4) Install & run:
npm install
npm start

5) Quick check: `curl http://localhost:4000/api/health`

## Frontend setup (from Drive bundle)
1) Download full project from Google Drive:
https://drive.google.com/drive/folders/1jFmjhWF3gMldoPyWROjXaceIvsYWz672?usp=sharing
2) In the downloaded `Frontend/dorm-web` folder:
npm install
npm run dev

3) Ensure Vite env points to the API:
VITE_API_URL=http://localhost:4000


## Notes
- Backend enforces `search_path` to `dorm_mgmt, public`.
- Soft-deletes with 30-day restore on students, rooms, payments, maintenance.
- Additional demo SQL: `queries_basic.sql`, `queries_advanced.sql`, `tx_demo.sql`.
