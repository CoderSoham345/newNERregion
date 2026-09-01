import { Router, type IRouter } from "express";
import { getDb, districts } from "@workspace/db";
import { eq } from "drizzle-orm";
import { logger } from "../lib/logger.js";

const router: IRouter = Router();

// GET /api/districts - Fetch districts (optionally filtered by ?stateId=)
router.get("/districts", async (req, res) => {
  try {
    const { stateId } = req.query;
    const database = getDb();
    if (database) {
      let query = database.select().from(districts);
      if (stateId && typeof stateId === "string" && stateId !== "All states") {
        const rows = await database.select().from(districts).where(eq(districts.stateId, stateId));
        return res.status(200).json({ success: true, count: rows.length, data: rows });
      }
      const allRows = await query;
      return res.status(200).json({ success: true, count: allRows.length, data: allRows });
    }
    return res.status(200).json({ success: true, count: 0, data: [] });
  } catch (error: any) {
    logger.error({ err: error.message }, "Error fetching districts from database");
    return res.status(500).json({ success: false, error: "Failed to retrieve districts" });
  }
});

// GET /api/districts/:id - Fetch single district
router.get("/districts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const database = getDb();
    if (database) {
      const rows = await database.select().from(districts).where(eq(districts.id, id));
      if (rows.length > 0) {
        return res.status(200).json({ success: true, data: rows[0] });
      }
    }
    return res.status(404).json({ success: false, error: "District not found" });
  } catch (error: any) {
    logger.error({ err: error.message, districtId: req.params.id }, "Error fetching district");
    return res.status(500).json({ success: false, error: "Failed to retrieve district details" });
  }
});

export default router;
