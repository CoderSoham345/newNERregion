import { Router, type IRouter } from "express";
import { getDb, highways, roadSegments } from "@workspace/db";
import { eq } from "drizzle-orm";
import { logger } from "../lib/logger.js";

const router: IRouter = Router();

// GET /api/highways - Fetch all highways
router.get("/highways", async (req, res) => {
  try {
    const { stateId } = req.query;
    const database = getDb();
    if (database) {
      if (stateId && typeof stateId === "string" && stateId !== "All states") {
        const rows = await database.select().from(highways).where(eq(highways.stateId, stateId));
        return res.status(200).json({ success: true, count: rows.length, data: rows });
      }
      const allRows = await database.select().from(highways);
      return res.status(200).json({ success: true, count: allRows.length, data: allRows });
    }
    return res.status(200).json({ success: true, count: 0, data: [] });
  } catch (error: any) {
    logger.error({ err: error.message }, "Error fetching highways");
    return res.status(500).json({ success: false, error: "Failed to retrieve highways" });
  }
});

// GET /api/road-segments - Fetch road segments
router.get("/road-segments", async (req, res) => {
  try {
    const { stateId, districtId, status } = req.query;
    const database = getDb();
    if (database) {
      let rows: any[] = await database.select().from(roadSegments);
      if (stateId && typeof stateId === "string" && stateId !== "All states") {
        rows = rows.filter((r: any) => r.stateId === stateId);
      }
      if (districtId && typeof districtId === "string" && districtId !== "all") {
        rows = rows.filter((r: any) => r.districtId === districtId);
      }
      if (status && typeof status === "string") {
        rows = rows.filter((r: any) => r.roadStatus?.toLowerCase() === status.toLowerCase());
      }
      return res.status(200).json({ success: true, count: rows.length, data: rows });
    }
    return res.status(200).json({ success: true, count: 0, data: [] });
  } catch (error: any) {
    logger.error({ err: error.message }, "Error fetching road segments");
    return res.status(500).json({ success: false, error: "Failed to retrieve road segments" });
  }
});

export default router;
