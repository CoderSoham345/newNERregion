import { Router, type IRouter } from "express";
import { getDb, roadIncidents } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { logger } from "../lib/logger.js";

const router: IRouter = Router();

// GET /api/incidents - Fetch all road incidents
router.get("/incidents", async (req, res) => {
  try {
    const { stateId, districtId, severity, status } = req.query;
    const database = getDb();
    if (database) {
      let rows: any[] = await database.select().from(roadIncidents).orderBy(desc(roadIncidents.createdAt));
      if (stateId && typeof stateId === "string" && stateId !== "All states") {
        rows = rows.filter((r: any) => r.stateId === stateId);
      }
      if (districtId && typeof districtId === "string" && districtId !== "all") {
        rows = rows.filter((r: any) => r.districtId === districtId);
      }
      if (severity && typeof severity === "string") {
        rows = rows.filter((r: any) => r.severity?.toLowerCase() === severity.toLowerCase());
      }
      if (status && typeof status === "string") {
        rows = rows.filter((r: any) => r.status?.toLowerCase() === status.toLowerCase());
      }
      return res.status(200).json({ success: true, count: rows.length, data: rows });
    }
    return res.status(200).json({ success: true, count: 0, data: [] });
  } catch (error: any) {
    logger.error({ err: error.message }, "Error fetching road incidents");
    return res.status(500).json({ success: false, error: "Failed to retrieve road incidents" });
  }
});

// POST /api/incidents - Create a new verified or field reported road incident
router.post("/incidents", async (req, res) => {
  try {
    const body = req.body;
    if (!body || !body.title || !body.type || !body.stateId || !body.locationName) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: title, type, stateId, locationName",
      });
    }

    const newIncident = {
      id: body.id || `inc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: String(body.title),
      type: String(body.type),
      stateId: String(body.stateId),
      districtId: String(body.districtId || "unassigned"),
      districtName: String(body.districtName || ""),
      highwayNumber: String(body.highwayNumber || "NH-Generic"),
      roadSegmentId: body.roadSegmentId ? String(body.roadSegmentId) : null,
      locationName: String(body.locationName),
      coords: body.coords || [26.0, 92.0],
      severity: String(body.severity || "Moderate"),
      status: String(body.status || "Reported"),
      reportedBy: String(body.reportedBy || "Field Officer"),
      reportedByRole: String(body.reportedByRole || "Field Officer"),
      reportedAt: body.reportedAt || new Date().toISOString(),
      timestampMs: Number(body.timestampMs || Date.now()),
      description: String(body.description || ""),
      lanesAffected: String(body.lanesAffected || "Single lane open"),
      estimatedClearanceTime: String(body.estimatedClearanceTime || "Pending assessment"),
      verifiedBy: body.verifiedBy ? String(body.verifiedBy) : null,
      photoUrl: body.photoUrl ? String(body.photoUrl) : null,
      isOfflineReported: Boolean(body.isOfflineReported),
      syncStatus: "Synced",
    };

    const database = getDb();
    if (database) {
      try {
        await database.insert(roadIncidents).values(newIncident);
      } catch (dbErr: any) {
        logger.warn({ err: dbErr.message }, "Database insert incident warning");
      }
    }

    return res.status(201).json({
      success: true,
      message: "Incident recorded successfully",
      data: newIncident,
    });
  } catch (error: any) {
    logger.error({ err: error.message }, "Error creating road incident");
    return res.status(500).json({ success: false, error: "Failed to record incident" });
  }
});

export default router;
