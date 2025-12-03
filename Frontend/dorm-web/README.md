Frontend (dorm-web)
===================

Vite/React UI for the AUCA Dorm management system. Tailwind for styling; data comes from the backend API via `VITE_API_URL`.

Quick start
-----------
1) `cd Frontend/dorm-web`  
2) `npm install`  
3) Create `.env` with `VITE_API_URL=http://localhost:4000`  
4) `npm run dev` and open the shown URL  

API
---
- Base URL: `VITE_API_URL`
- Endpoints: `/api/health`, `/api/stats`, `/api/students`, `/api/rooms`, `/api/payments`, `/api/maintenance` (+ delete/restore)
- Ensure backend is running and DB is seeded.

Project structure
-----------------
Your Final Project Structure

final-dorm/
├── Backend/
│   ├── backup_restore.txt
│   ├── dorm_mgmt_full.sql
│   ├── dorm_mgmt.dump
│   ├── indexes.sql
│   ├── queries_advanced.sql
│   ├── queries_basic.sql
│   ├── README.md
│   ├── schema.sql
│   ├── seed.sql
│   └── tx_demo.sql
│
└── Frontend/
    └── dorm-web/
        ├── public/
        ├── src/
        │   ├── app.jsx
        │   ├── app.css
        │   ├── index.css
        │   └── main.jsx
        ├── index.html
        ├── package.json
        ├── tailwind.config.js
        └── vite.config.js
