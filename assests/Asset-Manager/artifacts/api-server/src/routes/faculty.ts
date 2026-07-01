import { Router } from "express";
import { db, facultyTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  GetFacultyQueryParams,
  CreateFacultyMemberBody,
  GetFacultyMemberParams,
  UpdateFacultyMemberParams,
  UpdateFacultyMemberBody,
  DeleteFacultyMemberParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/faculty", async (req, res) => {
  const query = GetFacultyQueryParams.safeParse(req.query);
  let members = await db.select().from(facultyTable).orderBy(facultyTable.department);
  if (query.success && query.data.department) {
    members = members.filter((f) => f.department === query.data.department);
  }
  res.json(members.map((f) => ({ ...f, createdAt: f.createdAt.toISOString() })));
});

router.post("/faculty", async (req, res) => {
  const body = CreateFacultyMemberBody.safeParse(req.body);
  if (!body.success) { res.status(400).json({ error: "Invalid input" }); return; }
  const [member] = await db.insert(facultyTable).values(body.data).returning();
  res.status(201).json({ ...member, createdAt: member.createdAt.toISOString() });
});

router.get("/faculty/:id", async (req, res) => {
  const params = GetFacultyMemberParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) { res.status(400).json({ error: "Invalid id" }); return; }
  const [member] = await db.select().from(facultyTable).where(eq(facultyTable.id, params.data.id));
  if (!member) { res.status(404).json({ error: "Not found" }); return; }
  res.json({ ...member, createdAt: member.createdAt.toISOString() });
});

router.patch("/faculty/:id", async (req, res) => {
  const params = UpdateFacultyMemberParams.safeParse({ id: Number(req.params.id) });
  const body = UpdateFacultyMemberBody.safeParse(req.body);
  if (!params.success || !body.success) { res.status(400).json({ error: "Invalid input" }); return; }
  const [member] = await db.update(facultyTable).set(body.data).where(eq(facultyTable.id, params.data.id)).returning();
  if (!member) { res.status(404).json({ error: "Not found" }); return; }
  res.json({ ...member, createdAt: member.createdAt.toISOString() });
});

router.delete("/faculty/:id", async (req, res) => {
  const params = DeleteFacultyMemberParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(facultyTable).where(eq(facultyTable.id, params.data.id));
  res.status(204).end();
});

export default router;
