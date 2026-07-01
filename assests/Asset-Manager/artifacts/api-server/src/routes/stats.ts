import { Router } from "express";
import { db, coursesTable, facultyTable, admissionLeadsTable, newsTable, placementsTable } from "@workspace/db";
import { count, desc } from "drizzle-orm";

const router = Router();

router.get("/stats/dashboard", async (req, res) => {
  const [coursesCount] = await db.select({ count: count() }).from(coursesTable);
  const [facultyCount] = await db.select({ count: count() }).from(facultyTable);
  const [placementsCount] = await db.select({ count: count() }).from(placementsTable);
  const [leadsCount] = await db.select({ count: count() }).from(admissionLeadsTable);
  const [newsCount] = await db.select({ count: count() }).from(newsTable);
  const allLeads = await db.select({ status: admissionLeadsTable.status }).from(admissionLeadsTable);
  const pendingLeads = allLeads.filter((l) => l.status === "new").length;

  res.json({
    totalCourses: Number(coursesCount.count),
    totalFaculty: Number(facultyCount.count),
    totalStudents: 2400,
    totalPlacements: Number(placementsCount.count),
    totalLeads: Number(leadsCount.count),
    recentNews: Number(newsCount.count),
    pendingLeads,
  });
});

router.get("/stats/placements", async (req, res) => {
  const allPlacements = await db.select().from(placementsTable).orderBy(desc(placementsTable.year));

  const total = allPlacements.length;

  const byCompany: Record<string, number> = {};
  const byYear: Record<number, number> = {};
  const byDept: Record<string, number> = {};

  for (const p of allPlacements) {
    byCompany[p.company] = (byCompany[p.company] || 0) + 1;
    byYear[p.year] = (byYear[p.year] || 0) + 1;
    byDept[p.department] = (byDept[p.department] || 0) + 1;
  }

  const topCompanies = Object.entries(byCompany)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([company, cnt]) => ({ company, count: cnt }));

  const byYearArr = Object.entries(byYear)
    .sort((a, b) => Number(a[0]) - Number(b[0]))
    .map(([year, cnt]) => ({ year: Number(year), count: cnt }));

  const byDepartmentArr = Object.entries(byDept)
    .sort((a, b) => b[1] - a[1])
    .map(([department, cnt]) => ({ department, count: cnt }));

  res.json({
    totalPlaced: total,
    averagePackage: "5.2 LPA",
    highestPackage: "18 LPA",
    topCompanies,
    byYear: byYearArr,
    byDepartment: byDepartmentArr,
  });
});

export default router;
