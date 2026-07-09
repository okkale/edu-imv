import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

console.log("Connecting to:", process.env.DATABASE_URL);
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

try {
  const client = await pool.connect();
  console.log("Connected successfully!");
  const res = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public';");
  console.log("Tables in DB:", res.rows.map(r => r.table_name));
  
  // Try querying faculty table
  const fac = await client.query("SELECT * FROM faculty LIMIT 5;");
  console.log("Faculty count:", fac.rowCount);
  if (fac.rowCount > 0) {
    console.log("Sample faculty member:", fac.rows[0]);
    console.log("createdAt type:", typeof fac.rows[0].created_at, fac.rows[0].created_at);
  }
  client.release();
} catch (err) {
  console.error("DB connection error:", err);
} finally {
  await pool.end();
}
