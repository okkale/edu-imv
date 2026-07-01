import { Router } from "express";
import { db, contactTable } from "@workspace/db";
import { desc } from "drizzle-orm";
import { SubmitContactBody } from "@workspace/api-zod";

const router = Router();

router.post("/contact", async (req, res) => {
  const body = SubmitContactBody.safeParse(req.body);
  if (!body.success) { res.status(400).json({ error: "Invalid input" }); return; }
  const [item] = await db.insert(contactTable).values(body.data).returning();
  res.status(201).json({ ...item, createdAt: item.createdAt.toISOString() });
});

router.get("/contact/submissions", async (req, res) => {
  const items = await db.select().from(contactTable).orderBy(desc(contactTable.createdAt));
  res.json(items.map((c) => ({ ...c, createdAt: c.createdAt.toISOString() })));
});

export default router;
