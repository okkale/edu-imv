import { Router } from "express";
import { db, placementsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import {
  GetPlacementsQueryParams,
  CreatePlacementBody,
  UpdatePlacementParams,
  UpdatePlacementBody,
  DeletePlacementParams,
} from "@workspace/api-zod";

const router = Router();

const fmt = (p: typeof placementsTable.$inferSelect) => ({
  ...p,
  createdAt: p.createdAt.toISOString(),
});

router.get("/placements", async (req, res) => {
  const query = GetPlacementsQueryParams.safeParse(req.query);
  let items = await db.select().from(placementsTable).orderBy(desc(placementsTable.year));
  if (query.success && query.data.year) {
    items = items.filter((p) => p.year === Number(query.data.year));
  }
  if (query.success && query.data.department) {
    items = items.filter((p) => p.department === query.data.department);
  }
  res.json(items.map(fmt));
});

router.post("/placements", async (req, res) => {
  const body = CreatePlacementBody.safeParse(req.body);
  if (!body.success) { res.status(400).json({ error: "Invalid input" }); return; }
  const [item] = await db.insert(placementsTable).values(body.data).returning();
  res.status(201).json(fmt(item));
});

router.patch("/placements/:id", async (req, res) => {
  const params = UpdatePlacementParams.safeParse({ id: Number(req.params.id) });
  const body = UpdatePlacementBody.safeParse(req.body);
  if (!params.success || !body.success) { res.status(400).json({ error: "Invalid input" }); return; }
  const [item] = await db.update(placementsTable).set(body.data).where(eq(placementsTable.id, params.data.id)).returning();
  if (!item) { res.status(404).json({ error: "Not found" }); return; }
  res.json(fmt(item));
});

router.delete("/placements/:id", async (req, res) => {
  const params = DeletePlacementParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(placementsTable).where(eq(placementsTable.id, params.data.id));
  res.status(204).end();
});

export default router;
