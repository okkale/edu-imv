import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const admissionLeadsTable = pgTable("admission_leads", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  courseInterest: text("course_interest").notNull(),
  qualification: text("qualification"),
  message: text("message"),
  status: text("status").notNull().default("new"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertAdmissionLeadSchema = createInsertSchema(admissionLeadsTable).omit({ id: true, createdAt: true, status: true });
export type InsertAdmissionLead = z.infer<typeof insertAdmissionLeadSchema>;
export type AdmissionLead = typeof admissionLeadsTable.$inferSelect;
