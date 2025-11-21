const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

exports.create = async (ticket) => {
  const query = `
    INSERT INTO support_tickets (description, screenshot_path, video_path, priority, status)
    VALUES ($1, $2, $3, $4, $5) RETURNING *`;
  const values = [
    ticket.description,
    ticket.screenshot_path,
    ticket.video_path,
    ticket.priority,
    ticket.status,
  ];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

exports.getAllSortedByPriority = async () => {
  const query = `
    SELECT * FROM support_tickets
    ORDER BY CASE priority
      WHEN 'high' THEN 1
      WHEN 'medium' THEN 2
      WHEN 'low' THEN 3
      ELSE 4 END, created_at DESC`;
  const { rows } = await pool.query(query);
  return rows;
};
