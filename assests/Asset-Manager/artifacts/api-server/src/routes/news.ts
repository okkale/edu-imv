import { Router } from "express";
import { db, newsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import {
  GetNewsQueryParams,
  CreateNewsItemBody,
  GetNewsItemParams,
  UpdateNewsItemParams,
  UpdateNewsItemBody,
  DeleteNewsItemParams,
} from "@workspace/api-zod";

const router = Router();

const fmt = (n: typeof newsTable.$inferSelect) => ({
  ...n,
  publishedAt: n.publishedAt.toISOString(),
  createdAt: n.createdAt.toISOString(),
});

router.get("/news", async (req, res) => {
  const query = GetNewsQueryParams.safeParse(req.query);
  let items = await db.select().from(newsTable).orderBy(desc(newsTable.publishedAt));
  if (query.success && query.data.category) {
    items = items.filter((n) => n.category === query.data.category);
  }
  res.json(items.map(fmt));
});

router.post("/news", async (req, res) => {
  const body = CreateNewsItemBody.safeParse(req.body);
  if (!body.success) { res.status(400).json({ error: "Invalid input" }); return; }
  const { publishedAt, ...rest } = body.data;
  const vals = {
    ...rest,
    publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
  };
  const [item] = await db.insert(newsTable).values(vals).returning();
  res.status(201).json(fmt(item));
});

router.get("/news/:id", async (req, res) => {
  const params = GetNewsItemParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) { res.status(400).json({ error: "Invalid id" }); return; }
  const [item] = await db.select().from(newsTable).where(eq(newsTable.id, params.data.id));
  if (!item) { res.status(404).json({ error: "Not found" }); return; }
  res.json(fmt(item));
});

router.patch("/news/:id", async (req, res) => {
  const params = UpdateNewsItemParams.safeParse({ id: Number(req.params.id) });
  const body = UpdateNewsItemBody.safeParse(req.body);
  if (!params.success || !body.success) { res.status(400).json({ error: "Invalid input" }); return; }
  const { publishedAt, ...rest } = body.data;
  const vals: Record<string, unknown> = { ...rest };
  if (publishedAt) vals.publishedAt = new Date(publishedAt);
  const [item] = await db.update(newsTable).set(vals).where(eq(newsTable.id, params.data.id)).returning();
  if (!item) { res.status(404).json({ error: "Not found" }); return; }
  res.json(fmt(item));
});

router.delete("/news/:id", async (req, res) => {
  const params = DeleteNewsItemParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(newsTable).where(eq(newsTable.id, params.data.id));
  res.status(204).end();
});

export default router;
