import { Router } from "express";
import { db, admissionLeadsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  GetAdmissionLeadsQueryParams,
  CreateAdmissionLeadBody,
  UpdateAdmissionLeadParams,
  UpdateAdmissionLeadBody,
} from "@workspace/api-zod";

const router = Router();

router.get("/admissions", async (req, res) => {
  const query = GetAdmissionLeadsQueryParams.safeParse(req.query);
  let leads = await db.select().from(admissionLeadsTable).orderBy(admissionLeadsTable.createdAt);
  if (query.success && query.data.status) {
    leads = leads.filter((l) => l.status === query.data.status);
  }
  res.json(leads.map((l) => ({ ...l, createdAt: l.createdAt.toISOString() })));
});

router.post("/admissions", async (req, res) => {
  const body = CreateAdmissionLeadBody.safeParse(req.body);
  if (!body.success) { res.status(400).json({ error: "Invalid input" }); return; }
  const [lead] = await db.insert(admissionLeadsTable).values({ ...body.data, status: "new" }).returning();
  res.status(201).json({ ...lead, createdAt: lead.createdAt.toISOString() });
});

router.patch("/admissions/:id", async (req, res) => {
  const params = UpdateAdmissionLeadParams.safeParse({ id: Number(req.params.id) });
  const body = UpdateAdmissionLeadBody.safeParse(req.body);
  if (!params.success || !body.success) { res.status(400).json({ error: "Invalid input" }); return; }
  const [lead] = await db
    .update(admissionLeadsTable)
    .set(body.data)
    .where(eq(admissionLeadsTable.id, params.data.id))
    .returning();
  if (!lead) { res.status(404).json({ error: "Not found" }); return; }
  res.json({ ...lead, createdAt: lead.createdAt.toISOString() });
});

export default router;
