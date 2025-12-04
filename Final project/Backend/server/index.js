import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
pool.on('connect', (client) => {
  client.query('set search_path to dorm_mgmt, public');
});

app.get('/api/health', async (_req, res) => {
  try {
    const { rows } = await pool.query('select now() as now');
    res.json({ status: 'ok', dbTime: rows[0].now });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.get('/api/students', async (req, res) => {
  const { q, deleted } = req.query;
  const showDeleted = deleted === 'true';
  const conditions = [
    showDeleted ? "s.deleted_at is not null and s.deleted_at > now() - interval '30 days'" : 's.deleted_at is null',
  ];
  const params = [];
  if (q) {
    params.push(q);
    conditions.push(`(s.full_name ilike '%' || $${params.length} || '%' or s.email ilike '%' || $${params.length} || '%')`);
  }

  const sql = `
    select
      s.student_id,
      s.full_name,
      s.email,
      s.phone,
      s.gender,
      a_info.room_no,
      a_info.building
    from student s
      left join lateral (
        select r.room_no, b.name as building
        from assignment a
          join room r on a.room_id = r.room_id
          join building b on r.building_id = b.building_id
        where a.student_id = s.student_id and a.active
        order by a.start_date desc
        limit 1
      ) a_info on true
    ${conditions.length ? `where ${conditions.join(' and ')}` : ''}
    order by s.full_name;
  `;
  try {
    const { rows } = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/students', async (req, res) => {
  const { full_name, email, phone, gender } = req.body;
  if (!full_name || !email) return res.status(400).json({ error: 'full_name and email required' });
  try {
    const { rows } = await pool.query(
      'insert into student (full_name, email, phone, gender) values ($1,$2,$3,$4) returning *',
      [full_name, email, phone || null, gender || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/students/:id', async (req, res) => {
  try {
    const { rowCount } = await pool.query('update student set deleted_at = now() where student_id = $1 and deleted_at is null', [req.params.id]);
    if (!rowCount) return res.status(404).json({ error: 'not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/students/:id/restore', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `update student
       set deleted_at = null
       where student_id = $1 and deleted_at is not null and deleted_at > now() - interval '30 days'
       returning *`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'not found or expired' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/rooms', async (req, res) => {
  const { q, available, deleted } = req.query;
  const showDeleted = deleted === 'true';
  const filters = [
    showDeleted ? "r.deleted_at is not null and r.deleted_at > now() - interval '30 days'" : 'r.deleted_at is null'
  ];
  const params = [];
  if (q) {
    params.push(q);
    filters.push(`(r.room_no ilike '%' || $${params.length} || '%' or b.name ilike '%' || $${params.length} || '%')`);
  }
  if (available === 'true') {
    filters.push(`r.status = 'available'`);
  }

  const sql = `
    select
      r.room_id,
      r.room_no,
      b.name as building,
      rt.name as room_type,
      rt.capacity,
      rt.monthly_rate,
      r.status,
      coalesce(array_remove(array_agg(f.name order by f.name), null), '{}') as facilities,
      coalesce(occ.occupied, 0) as occupied
    from room r
      join building b on r.building_id = b.building_id
      join room_type rt on r.room_type_id = rt.room_type_id
      left join room_facility rf on r.room_id = rf.room_id
      left join facility f on rf.facility_id = f.facility_id
      left join lateral (
        select count(*) as occupied
        from assignment a
        where a.room_id = r.room_id and a.active
      ) occ on true
    where ${filters.join(' and ')}
    group by r.room_id, b.name, rt.name, rt.capacity, rt.monthly_rate, r.status, occ.occupied
    order by b.name, r.room_no;
  `;

  try {
    const { rows } = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/rooms', async (req, res) => {
  const { building_id, room_type_id, room_no, status = 'available' } = req.body;
  if (!building_id || !room_type_id || !room_no) {
    return res.status(400).json({ error: 'building_id, room_type_id, room_no required' });
  }
  try {
    const { rows } = await pool.query(
      `insert into room (building_id, room_type_id, room_no, status)
       values ($1,$2,$3,$4) returning *`,
      [building_id, room_type_id, room_no, status]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/rooms/:id', async (req, res) => {
  try {
    const { rowCount } = await pool.query('update room set deleted_at = now() where room_id = $1 and deleted_at is null', [req.params.id]);
    if (!rowCount) return res.status(404).json({ error: 'not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/rooms/:id/restore', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `update room
       set deleted_at = null
       where room_id = $1 and deleted_at is not null and deleted_at > now() - interval '30 days'
       returning *`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'not found or expired' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/payments', async (req, res) => {
  const { q, deleted } = req.query;
  const showDeleted = deleted === 'true';
  const conditions = [
    showDeleted ? "p.deleted_at is not null and p.deleted_at > now() - interval '30 days'" : 'p.deleted_at is null',
  ];
  const params = [];
  if (q) {
    params.push(q);
    conditions.push(`s.full_name ilike '%' || $${params.length} || '%'`);
  }
  const sql = `
    select
      p.payment_id,
      s.full_name as student,
      p.amount,
      p.period_start,
      p.period_end,
      p.status,
      p.paid_at,
      p.method
    from payment p
      join student s on p.student_id = s.student_id
    ${conditions.length ? `where ${conditions.join(' and ')}` : ''}
    order by p.period_start desc, s.full_name;
  `;
  try {
    const { rows } = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/payments', async (req, res) => {
  const { student_id, assignment_id, period_start, period_end, amount, method, status = 'pending' } = req.body;
  if (!student_id || !period_start || !period_end || amount == null) {
    return res.status(400).json({ error: 'student_id, period_start, period_end, amount required' });
  }
  try {
    const { rows } = await pool.query(
      `insert into payment (student_id, assignment_id, period_start, period_end, amount, status, method)
       values ($1,$2,$3,$4,$5,$6,$7) returning *`,
      [student_id, assignment_id || null, period_start, period_end, amount, status, method || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/payments/:id', async (req, res) => {
  try {
    const { rowCount } = await pool.query('update payment set deleted_at = now() where payment_id = $1 and deleted_at is null', [req.params.id]);
    if (!rowCount) return res.status(404).json({ error: 'not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/payments/:id/restore', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `update payment
       set deleted_at = null
       where payment_id = $1 and deleted_at is not null and deleted_at > now() - interval '30 days'
       returning *`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'not found or expired' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/maintenance', async (req, res) => {
  const { q, deleted } = req.query;
  const showDeleted = deleted === 'true';
  const conditions = [
    showDeleted ? "mr.deleted_at is not null and mr.deleted_at > now() - interval '30 days'" : 'mr.deleted_at is null',
  ];
  const params = [];
  if (q) {
    params.push(q);
    conditions.push(
      `(b.name ilike '%' || $${params.length} || '%' or r.room_no ilike '%' || $${params.length} || '%' or mr.category ilike '%' || $${params.length} || '%' or mr.description ilike '%' || $${params.length} || '%')`
    );
  }
  const sql = `
    select
      mr.request_id,
      b.name as building,
      r.room_no,
      mr.priority,
      mr.category,
      mr.status,
      mr.description,
      mr.created_at,
      s.full_name as student
    from maintenance_request mr
      join room r on mr.room_id = r.room_id
      join building b on r.building_id = b.building_id
      left join student s on mr.student_id = s.student_id
    ${conditions.length ? `where ${conditions.join(' and ')}` : ''}
    order by mr.created_at desc;
  `;
  try {
    const { rows } = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/maintenance', async (req, res) => {
  const { room_id, student_id, priority = 'medium', category, status = 'open', description } = req.body;
  if (!room_id || !category) {
    return res.status(400).json({ error: 'room_id and category required' });
  }
  try {
    const { rows } = await pool.query(
      `insert into maintenance_request (room_id, student_id, priority, category, status, description)
       values ($1,$2,$3,$4,$5,$6) returning *`,
      [room_id, student_id || null, priority, category, status, description || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/maintenance/:id', async (req, res) => {
  try {
    const { rowCount } = await pool.query('update maintenance_request set deleted_at = now() where request_id = $1 and deleted_at is null', [req.params.id]);
    if (!rowCount) return res.status(404).json({ error: 'not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/maintenance/:id/restore', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `update maintenance_request
       set deleted_at = null
       where request_id = $1 and deleted_at is not null and deleted_at > now() - interval '30 days'
       returning *`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'not found or expired' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/stats', async (_req, res) => {
  const sql = `
    with cap as (
      select coalesce(sum(rt.capacity), 0) as capacity
      from room r
        join room_type rt on r.room_type_id = rt.room_type_id
      where r.deleted_at is null
    ),
    occ as (
      select count(*) as occupied
      from assignment a
      where a.active
    )
    select
      (select count(*) from student where deleted_at is null) as total_students,
      (select count(*) from room where deleted_at is null) as total_rooms,
      coalesce(round(100.0 * occ.occupied / nullif(cap.capacity, 0), 2), 0) as occupancy_rate,
      (select count(*) from payment where status = 'pending' and deleted_at is null) as pending_payments,
      (select count(*) from maintenance_request where status in ('open','in_progress') and deleted_at is null) as open_requests
    from cap, occ;
  `;
  try {
    const { rows } = await pool.query(sql);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`API running on ${port}`));
