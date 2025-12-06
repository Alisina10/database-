# Database Labs & Dorm Management System

This repo holds two parts: (1) a 17‑lab PostgreSQL learning track and (2) the AUCA Dorm Management System final project. Use the directories below to jump to what you need.

## Repo Layout
- `All Lab Task/` — PostgreSQL Lab Tasks (Labs 1–17)
- `Final-Project/Backend/` — Express + PostgreSQL API
- `Final-Project/Frontend/dorm-web/` — React/Vite frontend

## Lab Track (Labs 1–17)
A collection of hands-on PostgreSQL exercises from setup to advanced analytics.

- Progression:
  - Labs 1–2: setup + basics
  - Labs 3–8: DDL/DML, table creation, data manipulation
  - Labs 9–12: JOINs, foreign keys, constraints, referential integrity
  - Labs 13–17: CTEs, window functions, analytics, optimization
- Core schema used in labs: `students`, `courses`, `enrollments`, `grades`
- Quick run: `psql -h localhost -p 5432 -U postgres` then `\i lab3/lab3.txt`
- Common tasks: CREATE/ALTER/DROP TABLE, INSERT/UPDATE/DELETE, JOINs, GROUP BY, CTEs, window functions (`RANK()`, `SUM() OVER`)

## Final Project (Dorm Management System)
Full-stack app for dorm students, rooms, payments, and maintenance with soft deletes.

- Back end: Node.js, Express, PostgreSQL (`Final-Project/Backend/README.md` for endpoints and setup)
- Front end: React 19, Vite, Tailwind (`Final-Project/Frontend/dorm-web/README.md` for UI/dev server)
- Quick start:
  1) `cd Final-Project/Backend && npm install && npm start` (configure `.env` with `DATABASE_URL`)
  2) `cd ../Frontend/dorm-web && npm install && npm run dev` (set `VITE_API_URL` to the backend URL)

## Getting Started
- Want the labs? Open `All Lab Task` and run the lab files with `psql`.
- Want the app? Follow the back-end/front-end READMEs under `Final-Project/`.
