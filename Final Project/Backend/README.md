# 🏫 AUCA Dorm Management Backend (PostgreSQL)

## Overview
Normalized PostgreSQL backend for dormitory management: schema, seeds, indexes, sample queries (basic/advanced), transaction demo, backup plan, and Express/pg API.

## What’s Inside
- Schema & data: `schema.sql`, `seed.sql`, `indexes.sql`
- Queries: `queries_basic.sql`, `queries_advanced.sql` (CTEs/windows)
- Transactions: `tx_demo.sql`
- Backup/restore: `backup_restore.txt`; full exports `dorm_mgmt_full.sql`, `dorm_mgmt.dump`
- API: `server/index.js` (Express + pg)

## How to Run the Database
```bash
cd Backend
psql -U postgres -d postgres -f schema.sql
psql -U postgres -d postgres -f seed.sql
psql -U postgres -d postgres -f indexes.sql

# optional demos
psql -U postgres -d postgres -f queries_basic.sql
psql -U postgres -d postgres -f queries_advanced.sql
psql -U postgres -d postgres -f tx_demo.sql
```

## How to Run the API
```bash
cd Backend
npm install
# set DATABASE_URL in .env (e.g., postgres://user:pass@localhost:5432/postgres)
npm start
```
Default port: 4000. `search_path` is set to `dorm_mgmt, public`.

## ER Diagram
<img width="1263" height="892" alt="Untitled" src="https://github.com/user-attachments/assets/9cc424a4-ba0e-4fcc-bbdc-7a2760f35588" />


