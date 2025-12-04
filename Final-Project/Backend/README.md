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

## ER Diagram (mermaid)
```
erDiagram
  building ||--o{ room : has
  room_type ||--o{ room : typed
  student ||--o{ assignment : has
  room ||--o{ assignment : has
  room ||--o{ room_facility : has
  facility ||--o{ room_facility : has
  room ||--o{ maintenance_request : has
  maintenance_request ||--o{ maintenance_log : has
  student ||--o{ payment : makes
  assignment ||--o{ payment : relates

  building { int building_id PK
             varchar name }
  room_type { int room_type_id PK
             varchar name
             int capacity
             numeric monthly_rate }
```
  room { int room_id PK
        int building_id FK
        int room_type_id FK
        varchar room_no
        varchar status }
  student { int student_id PK
            varchar full_name
            varchar email
            varchar phone
            varchar gender }
  assignment { int assignment_id PK
               int student_id FK
               int room_id FK
               int bed_no
               date start_date
               date end_date
               bool active }
  facility { int facility_id PK
             varchar name }
  room_facility { int room_id FK
                  int facility_id FK }
  payment { int payment_id PK
            int student_id FK
            int assignment_id FK
            date period_start
            date period_end
            numeric amount
            varchar status
            timestamp paid_at
            varchar method }
  maintenance_request { int request_id PK
                        int room_id FK
                        int student_id FK
                        varchar priority
                        varchar category
                        varchar status
                        text description
                        timestamp created_at }
  maintenance_log { int log_id PK
                    int request_id FK
                    varchar status
                    text note
                    timestamp at_time }

                    
