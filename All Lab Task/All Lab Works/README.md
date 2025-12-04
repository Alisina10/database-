# PostgreSQL Lab Tasks (Labs 1-17)

A collection of **17 lab assignments** covering PostgreSQL database management, from basic DDL/DML to advanced queries.

## Overview

These labs progressively teach:
- **Labs 1-2:** Foundation (setup)
- **Labs 3-8:** DDL/DML operations, table creation, data manipulation
- **Labs 9-12:** JOINs, foreign keys, constraints, referential integrity
- **Labs 13-17:** Window functions, CTEs, analytics, query optimization

## Key Topics

**Database Design:** Schema creation, relationships, normalization  
**Data Operations:** INSERT, UPDATE, DELETE, SELECT  
**Queries:** JOINs, Subqueries, CTEs, Window Functions  
**Constraints:** PRIMARY KEY, FOREIGN KEY, UNIQUE, CHECK  
**Analytics:** Aggregation, Grouping, Ranking, Running Totals

## Quick Start

```bash
# Connect to PostgreSQL
psql -h localhost -p 5432 -U postgres

# Execute a lab
\i lab3/lab3.txt
```

## Core Database Schema

```
students (student_id, first_name, last_name, email, age, program)
courses (course_id, course_name, department)
enrollments (enrollment_id, student_id, course_id, semester)
grades (grade_id, student_id, course, score)
```

## Difficulty & Skills

| Level | Labs | Skills |
|-------|------|--------|
| Beginner | 3-6 | DDL/DML, Table creation, Basic queries |
| Intermediate | 7-12 | JOINs, Foreign Keys, Cascading operations |
| Advanced | 13-17 | Window Functions, Analytics, Optimization |

## Common SQL Tasks

- `CREATE TABLE | ALTER TABLE | DROP TABLE`
- `INSERT INTO | UPDATE | DELETE FROM`
- `SELECT with JOINs, WHERE, GROUP BY`
- `RANK() OVER | SUM() OVER PARTITION BY`
- `WITH ... AS (CTEs)`

---

**Total Labs:** 17 | **Duration:** ~30-40 hours | **Level:** Beginner → Advanced
