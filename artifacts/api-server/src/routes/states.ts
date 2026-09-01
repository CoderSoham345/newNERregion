import { Router, type IRouter } from "express";
import { getDb, states, districts } from "@workspace/db";
import { eq } from "drizzle-orm";
import { logger } from "../lib/logger.js";

const router: IRouter = Router();

// GET /api/states - Fetch all 8 North Eastern states
router.get("/states", async (_req, res) => {
  try {
    const database = getDb();
    if (database) {
      const data = await database.select().from(states);
      if (data && data.length > 0) {
        return res.status(200).json({ success: true, data });
      }
    }
    return res.status(200).json({ success: true, data: [] });
  } catch (error: any) {
    logger.error({ err: error.message }, "Error fetching states from database");
    return res.status(500).json({ success: false, error: "Failed to retrieve states data" });
  }
});

// GET /api/states/:id - Fetch single state with districts
router.get("/states/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const database = getDb();
    if (database) {
      const stateRows = await database.select().from(states).where(eq(states.id, id));
      if (stateRows.length > 0) {
        const districtRows = await database.select().from(districts).where(eq(districts.stateId, id));
        return res.status(200).json({
          success: true,
          data: {
            ...stateRows[0],
            districts: districtRows,
          },
        });
      }
    }
    return res.status(404).json({ success: false, error: "State not found" });
  } catch (error: any) {
    logger.error({ err: error.message, stateId: req.params.id }, "Error fetching state details");
    return res.status(500).json({ success: false, error: "Failed to retrieve state details" });
  }
});

export default router;
