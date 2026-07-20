import pg from "pg";
import { createHash } from "crypto";
import { logger } from "./logger";

const { Pool } = pg;

export async function ensureDatabaseTablesAndSeed() {
  if (!process.env.DATABASE_URL) return;

  const connectionString = process.env.DATABASE_URL;
  const isProduction = process.env.NODE_ENV === "production";
  const isCloudUrl = Boolean(connectionString.includes("render.com") || connectionString.includes("sslmode="));

  const pool = new Pool({
    connectionString,
    ...(isProduction || isCloudUrl ? { ssl: { rejectUnauthorized: false } } : {}),
  });

  try {
    const client = await pool.connect();
    try {
      logger.info("Verifying database tables...");

      await client.query(`
        CREATE TABLE IF NOT EXISTS admins (
          id SERIAL PRIMARY KEY,
          username TEXT NOT NULL UNIQUE,
          password_hash TEXT NOT NULL,
          is_admin BOOLEAN NOT NULL DEFAULT TRUE,
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS courses (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          department TEXT NOT NULL,
          type TEXT NOT NULL DEFAULT 'UG',
          duration TEXT NOT NULL,
          seats INTEGER NOT NULL,
          description TEXT,
          eligibility TEXT,
          fees TEXT,
          image_url TEXT,
          is_active BOOLEAN NOT NULL DEFAULT TRUE,
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS faculty (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          title TEXT,
          department TEXT NOT NULL,
          designation TEXT NOT NULL,
          qualification TEXT,
          specialization TEXT,
          experience TEXT,
          skills TEXT,
          publications TEXT,
          memberships TEXT,
          research_guide TEXT,
          admin_roles TEXT,
          email TEXT,
          phone TEXT,
          photo_url TEXT,
          bio TEXT,
          is_hod BOOLEAN NOT NULL DEFAULT FALSE,
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS news (
          id SERIAL PRIMARY KEY,
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          category TEXT NOT NULL,
          published_at TIMESTAMP NOT NULL DEFAULT NOW(),
          image_url TEXT,
          is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS placements (
          id SERIAL PRIMARY KEY,
          student_name TEXT NOT NULL,
          company TEXT NOT NULL,
          package TEXT NOT NULL,
          role TEXT,
          department TEXT NOT NULL,
          year INTEGER NOT NULL,
          logo_url TEXT,
          testimonial TEXT,
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS admission_leads (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          phone TEXT NOT NULL,
          course_interest TEXT NOT NULL,
          qualification TEXT,
          message TEXT,
          status TEXT NOT NULL DEFAULT 'new',
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS contact_submissions (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          phone TEXT,
          subject TEXT NOT NULL,
          message TEXT NOT NULL,
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS media (
          id SERIAL PRIMARY KEY,
          title TEXT NOT NULL,
          type TEXT NOT NULL DEFAULT 'image',
          url TEXT NOT NULL,
          thumbnail_url TEXT,
          category TEXT NOT NULL DEFAULT 'campus',
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
      `);

      logger.info("Database tables verified.");

      const adminCheck = await client.query("SELECT COUNT(*) FROM admins");
      if (Number(adminCheck.rows[0].count) === 0) {
        const secret = process.env.SESSION_SECRET || "Indrayani Mahavidyalaya-secret-key";
        const hash = createHash("sha256").update("admin123" + secret).digest("hex");
        await client.query("INSERT INTO admins (username, password_hash) VALUES ($1, $2)", ["admin", hash]);
        logger.info("Admin user created.");
      }

      const courseCheck = await client.query("SELECT COUNT(*) FROM courses");
      if (Number(courseCheck.rows[0].count) === 0) {
        logger.info("Seeding initial database content...");
        
        const courses = [
          {
            name: "Bachelor of Business Administration (BBA)",
            department: "Management Studies",
            type: "UG",
            duration: "3 Years",
            seats: 120,
            description: "The BBA program at Indrayani Mahavidyalaya is designed to develop future business professionals and entrepreneurs.",
            eligibility: "Passed 10+2 or equivalent examination from a recognized board as per university norms.",
            fees: "As per university and government norms.",
            image_url: "/bba.png",
            is_active: true,
          },
          {
            name: "Bachelor of Computer Applications (BCA)",
            department: "Computer Applications",
            type: "UG",
            duration: "3 Years",
            seats: 120,
            description: "The BCA program at Indrayani Mahavidyalaya provides a strong foundation in computer science, software development, and programming.",
            eligibility: "Passed 10+2 or equivalent examination from a recognized board as per university norms.",
            fees: "As per university and government norms.",
            image_url: "/bca.png",
            is_active: true,
          },
          {
            name: "Master of Business Administration (MBA)",
            department: "Management Studies",
            type: "PG",
            duration: "2 Years",
            seats: 120,
            description: "The MBA program at Indrayani Mahavidyalaya is designed to prepare future leaders and managers through advanced studies.",
            eligibility: "Bachelor's degree from a recognized university. Admission as per State CET Cell / university guidelines.",
            fees: "As per government and university norms.",
            image_url: "/mba.png",
            is_active: true,
          },
          {
            name: "Master of Computer Applications (MCA)",
            department: "Computer Applications",
            type: "PG",
            duration: "2 Years",
            seats: 120,
            description: "The MCA program at Indrayani Mahavidyalaya focuses on advanced computing, software engineering, and cloud computing.",
            eligibility: "Bachelor's degree with Mathematics at 10+2 or graduation level. Admission as per State CET Cell / university guidelines.",
            fees: "As per government and university norms.",
            image_url: "/mca.png",
            is_active: true,
          },
        ];

        for (const c of courses) {
          await client.query(
            `INSERT INTO courses (name, department, type, duration, seats, description, eligibility, fees, image_url, is_active)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
            [c.name, c.department, c.type, c.duration, c.seats, c.description, c.eligibility, c.fees, c.image_url, c.is_active]
          );
        }

        const news = [
          {
            title: "Admissions Open for 2026-27",
            content: "Indrayani Mahavidyalaya invites applications for BBA, BCA, MBA, and MCA admissions for academic year 2026-27.",
            category: "announcement",
            published_at: new Date("2026-05-01"),
            is_pinned: true,
          },
          {
            title: "Job Fair 2026 Successfully Conducted at Indrayani Mahavidyalaya",
            content: "A Job Fair was successfully conducted connecting aspiring candidates with prospective employers across multiple industries.",
            category: "event",
            published_at: new Date("2026-03-26"),
            is_pinned: true,
          },
        ];

        for (const n of news) {
          await client.query(
            `INSERT INTO news (title, content, category, published_at, is_pinned)
             VALUES ($1,$2,$3,$4,$5)`,
            [n.title, n.content, n.category, n.published_at, n.is_pinned]
          );
        }

        logger.info("Database seeding completed.");
      }
    } finally {
      client.release();
    }
  } catch (err) {
    logger.error({ err }, "Failed to auto-initialize database tables");
  } finally {
    await pool.end();
  }
}
