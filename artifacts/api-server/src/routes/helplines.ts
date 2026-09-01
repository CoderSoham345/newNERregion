import { Router, type IRouter } from "express";
import { getDb, emergencyHelplines } from "@workspace/db";
import { asc } from "drizzle-orm";
import { logger } from "../lib/logger.js";

const router: IRouter = Router();

// GET /api/helplines - Fetch emergency and administrative helpline numbers
router.get("/helplines", async (req, res) => {
  try {
    const { stateId, category } = req.query;
    const database = getDb();
    if (database) {
      let rows: any[] = await database
        .select()
        .from(emergencyHelplines)
        .orderBy(asc(emergencyHelplines.priorityOrder));

      if (stateId && typeof stateId === "string" && stateId !== "All states") {
        rows = rows.filter((r: any) => r.stateId === stateId);
      }
      if (category && typeof category === "string") {
        rows = rows.filter((r: any) => r.category?.toLowerCase() === category.toLowerCase());
      }
      return res.status(200).json({ success: true, count: rows.length, data: rows });
    }
    return res.status(200).json({ success: true, count: 0, data: [] });
  } catch (error: any) {
    logger.error({ err: error.message }, "Error fetching helplines");
    return res.status(500).json({ success: false, error: "Failed to retrieve helplines" });
  }
});

export default router;
