import { Router } from "express";
import { db, adminsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { createHash } from "crypto";
import { AdminLoginBody } from "@workspace/api-zod";

const router = Router();

export function hashPassword(password: string): string {
  return createHash("sha256").update(password + (process.env.SESSION_SECRET || "Indrayani Mahavidyalaya-secret-key")).digest("hex");
}

router.post("/admin/login", async (req, res) => {
  const body = AdminLoginBody.safeParse(req.body);
  if (!body.success) { res.status(400).json({ error: "Invalid input" }); return; }

  const [admin] = await db.select().from(adminsTable).where(eq(adminsTable.username, body.data.username));
  if (!admin || admin.passwordHash !== hashPassword(body.data.password)) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  req.session.adminId = admin.id;
  res.json({ id: admin.id, username: admin.username, isAdmin: admin.isAdmin });
});

router.post("/admin/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ ok: true });
  });
});

router.get("/admin/me", async (req, res) => {
  const adminId = req.session.adminId;
  if (!adminId) { res.status(401).json({ error: "Not authenticated" }); return; }

  const [admin] = await db.select().from(adminsTable).where(eq(adminsTable.id, adminId));
  if (!admin) { res.status(401).json({ error: "Not authenticated" }); return; }

  res.json({ id: admin.id, username: admin.username, isAdmin: admin.isAdmin });
});

export default router;
