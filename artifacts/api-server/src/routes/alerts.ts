import { Router, type IRouter } from "express";
import {
  getDb,
  systemAlerts,
  floodAlerts,
  landslideAlerts,
  activeHazards,
} from "@workspace/db";
import { desc } from "drizzle-orm";
import { logger } from "../lib/logger.js";

const router: IRouter = Router();

// GET /api/alerts - Fetch system alerts
router.get("/alerts", async (req, res) => {
  try {
    const { stateId, category, severity } = req.query;
    const database = getDb();
    if (database) {
      let rows: any[] = await database.select().from(systemAlerts).orderBy(desc(systemAlerts.createdAt));
      if (stateId && typeof stateId === "string" && stateId !== "All states") {
        rows = rows.filter((r: any) => r.stateId === stateId || r.stateId === "All states");
      }
      if (category && typeof category === "string") {
        rows = rows.filter((r: any) => r.category?.toLowerCase() === category.toLowerCase());
      }
      if (severity && typeof severity === "string") {
        rows = rows.filter((r: any) => r.severity?.toLowerCase() === severity.toLowerCase());
      }
      return res.status(200).json({ success: true, count: rows.length, data: rows });
    }
    return res.status(200).json({ success: true, count: 0, data: [] });
  } catch (error: any) {
    logger.error({ err: error.message }, "Error fetching alerts");
    return res.status(500).json({ success: false, error: "Failed to retrieve alerts" });
  }
});

// GET /api/flood-alerts - Fetch river basin flood warnings
router.get("/flood-alerts", async (req, res) => {
  try {
    const { stateId } = req.query;
    const database = getDb();
    if (database) {
      let rows: any[] = await database.select().from(floodAlerts);
      if (stateId && typeof stateId === "string" && stateId !== "All states") {
        rows = rows.filter((r: any) => r.stateId === stateId);
      }
      return res.status(200).json({ success: true, count: rows.length, data: rows });
    }
    return res.status(200).json({ success: true, count: 0, data: [] });
  } catch (error: any) {
    logger.error({ err: error.message }, "Error fetching flood alerts");
    return res.status(500).json({ success: false, error: "Failed to retrieve flood alerts" });
  }
});

// GET /api/landslide-alerts - Fetch slope failure & landslide watches
router.get("/landslide-alerts", async (req, res) => {
  try {
    const { stateId } = req.query;
    const database = getDb();
    if (database) {
      let rows: any[] = await database.select().from(landslideAlerts);
      if (stateId && typeof stateId === "string" && stateId !== "All states") {
        rows = rows.filter((r: any) => r.stateId === stateId);
      }
      return res.status(200).json({ success: true, count: rows.length, data: rows });
    }
    return res.status(200).json({ success: true, count: 0, data: [] });
  } catch (error: any) {
    logger.error({ err: error.message }, "Error fetching landslide alerts");
    return res.status(500).json({ success: false, error: "Failed to retrieve landslide alerts" });
  }
});

// GET /api/active-hazards - Fetch active geographic hazards
router.get("/active-hazards", async (req, res) => {
  try {
    const { stateId, hazardType } = req.query;
    const database = getDb();
    if (database) {
      let rows: any[] = await database.select().from(activeHazards);
      if (stateId && typeof stateId === "string" && stateId !== "All states") {
        rows = rows.filter((r: any) => r.stateId === stateId);
      }
      if (hazardType && typeof hazardType === "string") {
        rows = rows.filter((r: any) => r.hazardType?.toLowerCase() === hazardType.toLowerCase());
      }
      return res.status(200).json({ success: true, count: rows.length, data: rows });
    }
    return res.status(200).json({ success: true, count: 0, data: [] });
  } catch (error: any) {
    logger.error({ err: error.message }, "Error fetching active hazards");
    return res.status(500).json({ success: false, error: "Failed to retrieve active hazards" });
  }
});

export default router;
