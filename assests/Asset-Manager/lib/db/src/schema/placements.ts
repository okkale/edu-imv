import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const placementsTable = pgTable("placements", {
  id: serial("id").primaryKey(),
  studentName: text("student_name").notNull(),
  company: text("company").notNull(),
  package: text("package").notNull(),
  role: text("role"),
  department: text("department").notNull(),
  year: integer("year").notNull(),
  logoUrl: text("logo_url"),
  testimonial: text("testimonial"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertPlacementSchema = createInsertSchema(placementsTable).omit({ id: true, createdAt: true });
export type InsertPlacement = z.infer<typeof insertPlacementSchema>;
export type Placement = typeof placementsTable.$inferSelect;
