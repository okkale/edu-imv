import dotenv from "dotenv";
import pg from "pg";
import { createHash } from "crypto";

dotenv.config();

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function init() {
  const client = await pool.connect();
  try {
    console.log("Creating tables if they don't exist...");
    
    // Create admin table
    await client.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        is_admin BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    
    console.log("✓ Tables created");
    
    // Clear existing admin
    await client.query("DELETE FROM admins WHERE username = 'admin'");
    
    // Insert admin user
    const secret = process.env.SESSION_SECRET || "dev-secret";
    const hash = createHash("sha256").update("admin123" + secret).digest("hex");
    await client.query(
      "INSERT INTO admins (username, password_hash) VALUES ($1, $2)",
      ["admin", hash]
    );
    
    console.log("✓ Admin created successfully");
    console.log("Credentials:");
    console.log("  Username: admin");
    console.log("  Password: admin123");
    
  } catch (error) {
    console.error("Init failed:", error);
  } finally {
    await client.end();
    await pool.end();
  }
}

init();
