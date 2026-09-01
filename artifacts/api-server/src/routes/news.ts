import { Router, type IRouter } from "express";
import { getDb, newsUpdates } from "@workspace/db";
import { desc } from "drizzle-orm";
import { logger } from "../lib/logger.js";

const router: IRouter = Router();

// GET /api/news - Fetch latest situation reports and infrastructure news
router.get("/news", async (req, res) => {
  try {
    const { category } = req.query;
    const database = getDb();
    if (database) {
      let rows: any[] = await database.select().from(newsUpdates).orderBy(desc(newsUpdates.createdAt));
      if (category && typeof category === "string") {
        rows = rows.filter((r: any) => r.category?.toLowerCase() === category.toLowerCase());
      }
      return res.status(200).json({ success: true, count: rows.length, data: rows });
    }
    return res.status(200).json({ success: true, count: 0, data: [] });
  } catch (error: any) {
    logger.error({ err: error.message }, "Error fetching situation news");
    return res.status(500).json({ success: false, error: "Failed to retrieve news" });
  }
});

export default router;
