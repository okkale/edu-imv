import { Router } from "express";
import { db, mediaTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import {
  GetMediaItemsQueryParams,
  CreateMediaItemBody,
  DeleteMediaItemParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/media", async (req, res) => {
  const query = GetMediaItemsQueryParams.safeParse(req.query);
  let items = await db.select().from(mediaTable).orderBy(desc(mediaTable.createdAt));
  if (query.success && query.data.category) {
    items = items.filter((m) => m.category === query.data.category);
  }
  res.json(items.map((m) => ({ ...m, createdAt: m.createdAt.toISOString() })));
});

router.post("/media", async (req, res) => {
  const body = CreateMediaItemBody.safeParse(req.body);
  if (!body.success) { res.status(400).json({ error: "Invalid input" }); return; }
  const [item] = await db.insert(mediaTable).values(body.data).returning();
  res.status(201).json({ ...item, createdAt: item.createdAt.toISOString() });
});

router.delete("/media/:id", async (req, res) => {
  const params = DeleteMediaItemParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(mediaTable).where(eq(mediaTable.id, params.data.id));
  res.status(204).end();
});

export default router;
