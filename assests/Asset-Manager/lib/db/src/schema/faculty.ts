import { pgTable, serial, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const facultyTable = pgTable("faculty", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  department: text("department").notNull(),
  designation: text("designation").notNull(),
  qualification: text("qualification"),
  specialization: text("specialization"),
  experience: integer("experience"),
  email: text("email"),
  phone: text("phone"),
  photoUrl: text("photo_url"),
  bio: text("bio"),
  isHOD: boolean("is_hod").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertFacultySchema = createInsertSchema(facultyTable).omit({ id: true, createdAt: true });
export type InsertFaculty = z.infer<typeof insertFacultySchema>;
export type FacultyMember = typeof facultyTable.$inferSelect;
