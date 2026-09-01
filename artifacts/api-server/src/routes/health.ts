import { Router, type IRouter } from "express";
import { HealthCheckResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/", (_req, res) => {
  res.json({
    status: "success",
    message: "Northeast Road Intelligence API is running",
  });
});

router.get("/health", (_req, res) => {
  res.json({
    status: "ok",
  });
});

router.get("/healthz", (_req, res) => {
  const data = HealthCheckResponse.parse({ status: "ok" });
  res.status(200).json(data);
});

export default router;
