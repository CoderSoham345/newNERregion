import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import authRouter from "./auth.js";
import statesRouter from "./states.js";
import districtsRouter from "./districts.js";
import highwaysRouter from "./highways.js";
import incidentsRouter from "./incidents.js";
import alertsRouter from "./alerts.js";
import newsRouter from "./news.js";
import helplinesRouter from "./helplines.js";
import cargoRouter from "./cargo.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(statesRouter);
router.use(districtsRouter);
router.use(highwaysRouter);
router.use(incidentsRouter);
router.use(alertsRouter);
router.use(newsRouter);
router.use(helplinesRouter);
router.use(cargoRouter);

export default router;
