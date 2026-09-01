import { Router, type IRouter } from "express";
import {
  getDb,
  cargoItems,
  liveVehicles,
  strategicInfrastructure,
} from "@workspace/db";
import { logger } from "../lib/logger.js";

const router: IRouter = Router();

// GET /api/cargo-readiness and /api/cargo - Track essential commodities & supply shipments
router.get(["/cargo-readiness", "/cargo"], async (req, res) => {
  try {
    const { priority, status, destinationState } = req.query;
    const database = getDb();
    if (database) {
      let rows: any[] = await database.select().from(cargoItems);
      if (priority && typeof priority === "string") {
        rows = rows.filter((r: any) => r.priority?.toLowerCase() === priority.toLowerCase());
      }
      if (status && typeof status === "string") {
        rows = rows.filter((r: any) => r.status?.toLowerCase() === status.toLowerCase());
      }
      if (destinationState && typeof destinationState === "string") {
        rows = rows.filter((r: any) => r.destinationState === destinationState);
      }
      return res.status(200).json({ success: true, count: rows.length, data: rows });
    }
    return res.status(200).json({ success: true, count: 0, data: [] });
  } catch (error: any) {
    logger.error({ err: error.message }, "Error fetching cargo supply readiness");
    return res.status(500).json({ success: false, error: "Failed to retrieve cargo data" });
  }
});

// GET /api/vehicles - Monitored vehicles and convoys
router.get("/vehicles", async (req, res) => {
  try {
    const { stateId, status } = req.query;
    const database = getDb();
    if (database) {
      let rows: any[] = await database.select().from(liveVehicles);
      if (stateId && typeof stateId === "string" && stateId !== "All states") {
        rows = rows.filter((r: any) => r.stateId === stateId);
      }
      if (status && typeof status === "string") {
        rows = rows.filter((r: any) => r.status?.toLowerCase() === status.toLowerCase());
      }
      return res.status(200).json({ success: true, count: rows.length, data: rows });
    }
    return res.status(200).json({ success: true, count: 0, data: [] });
  } catch (error: any) {
    logger.error({ err: error.message }, "Error fetching live vehicles");
    return res.status(500).json({ success: false, error: "Failed to retrieve vehicle data" });
  }
});

// GET /api/infrastructure - Strategic bridges, helipads, relief hubs
router.get("/infrastructure", async (req, res) => {
  try {
    const { stateId, type } = req.query;
    const database = getDb();
    if (database) {
      let rows: any[] = await database.select().from(strategicInfrastructure);
      if (stateId && typeof stateId === "string" && stateId !== "All states") {
        rows = rows.filter((r: any) => r.stateId === stateId);
      }
      if (type && typeof type === "string") {
        rows = rows.filter((r: any) => r.type?.toLowerCase() === type.toLowerCase());
      }
      return res.status(200).json({ success: true, count: rows.length, data: rows });
    }
    return res.status(200).json({ success: true, count: 0, data: [] });
  } catch (error: any) {
    logger.error({ err: error.message }, "Error fetching strategic infrastructure");
    return res.status(500).json({ success: false, error: "Failed to retrieve infrastructure" });
  }
});

export default router;
