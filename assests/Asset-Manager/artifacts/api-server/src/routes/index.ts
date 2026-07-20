import { Router, type IRouter } from "express";
import healthRouter from "./health";
import coursesRouter from "./courses";
import facultyRouter from "./faculty";
import admissionsRouter from "./admissions";
import newsRouter from "./news";
import mediaRouter from "./media";
import placementsRouter from "./placements";
import contactRouter from "./contact";
import adminRouter from "./admin";
import statsRouter from "./stats";
import uploadRouter from "./upload";

const router: IRouter = Router();

router.use(healthRouter);
router.use(coursesRouter);
router.use(facultyRouter);
router.use(admissionsRouter);
router.use(newsRouter);
router.use(mediaRouter);
router.use(placementsRouter);
router.use(contactRouter);
router.use(adminRouter);
router.use(statsRouter);
router.use(uploadRouter);

export default router;
