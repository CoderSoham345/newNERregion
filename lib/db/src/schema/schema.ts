import {
  pgTable,
  text,
  integer,
  numeric,
  doublePrecision,
  bigint,
  boolean,
  timestamp,
  jsonb,
  pgView,
} from "drizzle-orm/pg-core";

// ==========================================
// 1. STATES TABLE
// ==========================================
export const states = pgTable("states", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code").notNull(),
  capital: text("capital").notNull(),
  areaSqKm: doublePrecision("area_sq_km").default(0),
  populationTotal: text("population_total").default(""),
  districtCount: integer("district_count").default(0),
  center: jsonb("center").$type<[number, number]>().default([26.0, 92.0]),
  zoom: integer("zoom").default(7),
  accessibility: doublePrecision("accessibility").default(100),
  blocked: integer("blocked").default(0),
  atRisk: integer("at_risk").default(0),
  incidents: integer("incidents").default(0),
  weatherSummary: text("weather_summary").default(""),
  rainfall24h: doublePrecision("rainfall_24h").default(0),
  temperatureAvg: doublePrecision("temperature_avg").default(22),
  landslideRisk: doublePrecision("landslide_risk").default(0),
  floodRisk: doublePrecision("flood_risk").default(0),
  activeCargo: integer("active_cargo").default(0),
  monitoredHighways: integer("monitored_highways").default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// ==========================================
// 2. DISTRICTS TABLE
// ==========================================
export const districts = pgTable("districts", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  stateId: text("state_id").references(() => states.id).notNull(),
  center: jsonb("center").$type<[number, number]>().default([26.0, 92.0]),
  population: text("population").default(""),
  roadCount: integer("road_count").default(0),
  highwayCount: integer("highway_count").default(0),
  accessibilityScore: doublePrecision("accessibility_score").default(100),
  riskScore: doublePrecision("risk_score").default(0),
  weather: text("weather").default("Clear"),
  rainfall: doublePrecision("rainfall").default(0),
  temperature: doublePrecision("temperature").default(22),
  humidity: doublePrecision("humidity").default(60),
  windSpeed: doublePrecision("wind_speed").default(10),
  trafficStatus: text("traffic_status").default("Free"),
  incidentCount: integer("incident_count").default(0),
  blockedRoadCount: integer("blocked_road_count").default(0),
  atRiskRoadCount: integer("at_risk_road_count").default(0),
  cargoCount: integer("cargo_count").default(0),
  terrainType: text("terrain_type").default("Hilly / Mountainous"),
  helplineCount: integer("helpline_count").default(1),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// ==========================================
// 3. HIGHWAYS TABLE
// ==========================================
export const highways = pgTable("highways", {
  id: text("id").primaryKey(),
  number: text("number").notNull(),
  name: text("name").notNull(),
  type: text("type").default("NH"),
  stateId: text("state_id").references(() => states.id).notNull(),
  districtIds: jsonb("district_ids").$type<string[]>().default([]),
  origin: text("origin").default(""),
  destination: text("destination").default(""),
  totalLengthKm: doublePrecision("total_length_km").default(0),
  overallStatus: text("overall_status").default("Accessible"),
  avgRiskScore: doublePrecision("avg_risk_score").default(0),
  trafficLevel: text("traffic_level").default("Free"),
  averageSpeed: doublePrecision("average_speed").default(45),
  expectedDelay: text("expected_delay").default("None"),
  incidentCount: integer("incident_count").default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// ==========================================
// 4. ROAD SEGMENTS TABLE
// ==========================================
export const roadSegments = pgTable("road_segments", {
  id: text("id").primaryKey(),
  highwayId: text("highway_id").references(() => highways.id),
  highwayNumber: text("highway_number").notNull(),
  highwayType: text("highway_type").default("NH"),
  highwayName: text("highway_name").default(""),
  stateId: text("state_id").references(() => states.id).notNull(),
  districtId: text("district_id").references(() => districts.id).notNull(),
  districtName: text("district_name").default(""),
  startLocation: text("start_location").notNull(),
  endLocation: text("end_location").notNull(),
  lengthKm: doublePrecision("length_km").default(0),
  coordinates: jsonb("coordinates").$type<[number, number][]>().default([]),
  roadStatus: text("road_status").default("Accessible"),
  riskScore: doublePrecision("risk_score").default(0),
  trafficLevel: text("traffic_level").default("Free"),
  averageSpeed: doublePrecision("average_speed").default(45),
  congestionPct: doublePrecision("congestion_pct").default(0),
  vehicleCount: integer("vehicle_count").default(0),
  rainfall: doublePrecision("rainfall").default(0),
  temperature: doublePrecision("temperature").default(22),
  weatherCondition: text("weather_condition").default("Clear"),
  landslideRisk: doublePrecision("landslide_risk").default(0),
  floodRisk: doublePrecision("flood_risk").default(0),
  soilSaturation: doublePrecision("soil_saturation").default(0),
  slopeExposure: doublePrecision("slope_exposure").default(0),
  expectedDelay: text("expected_delay").default("None"),
  lastUpdated: text("last_updated").default(""),
  incidentIds: jsonb("incident_ids").$type<string[]>().default([]),
  primaryReason: text("primary_reason").default("Normal conditions"),
  alternateRoute: text("alternate_route").default(""),
  alternateRouteKm: doublePrecision("alternate_route_km").default(0),
  alternateRouteEta: text("alternate_route_eta").default(""),
  affectedCargo: jsonb("affected_cargo").$type<string[]>().default([]),
  elevationMeters: doublePrecision("elevation_meters").default(500),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// ==========================================
// 5. ROAD INCIDENTS TABLE
// ==========================================
export const roadIncidents = pgTable("road_incidents", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  type: text("type").notNull(),
  stateId: text("state_id").references(() => states.id).notNull(),
  districtId: text("district_id").references(() => districts.id).notNull(),
  districtName: text("district_name").default(""),
  highwayNumber: text("highway_number").default(""),
  roadSegmentId: text("road_segment_id").references(() => roadSegments.id),
  locationName: text("location_name").notNull(),
  coords: jsonb("coords").$type<[number, number]>().default([26.0, 92.0]),
  severity: text("severity").default("Moderate"),
  status: text("status").default("Reported"),
  reportedBy: text("reported_by").notNull(),
  reportedByRole: text("reported_by_role").default("Field Officer"),
  reportedAt: text("reported_at").default(""),
  timestampMs: bigint("timestamp_ms", { mode: "number" }).default(0),
  description: text("description").default(""),
  lanesAffected: text("lanes_affected").default("Single lane open"),
  estimatedClearanceTime: text("estimated_clearance_time").default("Pending assessment"),
  verifiedBy: text("verified_by"),
  photoUrl: text("photo_url"),
  isOfflineReported: boolean("is_offline_reported").default(false),
  syncStatus: text("sync_status").default("Synced"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// ==========================================
// 6. ACTIVE HAZARDS TABLE
// ==========================================
export const activeHazards = pgTable("active_hazards", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  hazardType: text("hazard_type").notNull(),
  stateId: text("state_id").references(() => states.id).notNull(),
  districtId: text("district_id").references(() => districts.id),
  locationName: text("location_name").notNull(),
  highwayNumber: text("highway_number").default(""),
  coords: jsonb("coords").$type<[number, number]>().default([26.0, 92.0]),
  severity: text("severity").default("Moderate"),
  status: text("status").default("Active"),
  description: text("description").default(""),
  reportedAt: text("reported_at").default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// ==========================================
// 7. SYSTEM ALERTS TABLE
// ==========================================
export const systemAlerts = pgTable("system_alerts", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  stateId: text("state_id").default("All states"),
  districtName: text("district_name"),
  severity: text("severity").default("Moderate"),
  timestamp: text("timestamp").default(""),
  content: text("content").notNull(),
  recommendedAction: text("recommended_action").default(""),
  roadSegmentId: text("road_segment_id"),
  isRead: boolean("is_read").default(false),
  source: text("source").default("National Disaster Management Authority"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// ==========================================
// 8. FLOOD ALERTS TABLE
// ==========================================
export const floodAlerts = pgTable("flood_alerts", {
  id: text("id").primaryKey(),
  stateId: text("state_id").notNull(),
  districtName: text("district_name").notNull(),
  riverBasin: text("river_basin").notNull(),
  waterLevelMeters: doublePrecision("water_level_meters").default(0),
  dangerThresholdMeters: doublePrecision("danger_threshold_meters").default(0),
  riskLevel: text("risk_level").default("WATCH"),
  warningIssuedAt: text("warning_issued_at").default(""),
  affectedHighways: jsonb("affected_highways").$type<string[]>().default([]),
  advisory: text("advisory").default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// ==========================================
// 9. LANDSLIDE ALERTS TABLE
// ==========================================
export const landslideAlerts = pgTable("landslide_alerts", {
  id: text("id").primaryKey(),
  stateId: text("state_id").notNull(),
  districtName: text("district_name").notNull(),
  slopeLocation: text("slope_location").notNull(),
  highwayNumber: text("highway_number").notNull(),
  soilSaturationPct: doublePrecision("soil_saturation_pct").default(0),
  slopeAngleDegrees: doublePrecision("slope_angle_degrees").default(0),
  riskCategory: text("risk_category").default("HIGH"),
  clearanceMachineryDeployed: boolean("clearance_machinery_deployed").default(false),
  alternateRoute: text("alternate_route").default(""),
  updatedAt: text("updated_at").default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// ==========================================
// 10. NEWS UPDATES TABLE
// ==========================================
export const newsUpdates = pgTable("news_updates", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  source: text("source").default("NER Emergency Desk"),
  category: text("category").default("Road Infrastructure"),
  timestamp: text("timestamp").default(""),
  fullText: text("full_text").default(""),
  relevantStates: jsonb("relevant_states").$type<string[]>().default([]),
  isBreaking: boolean("is_breaking").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// ==========================================
// 11. EMERGENCY HELPLINES TABLE
// ==========================================
export const emergencyHelplines = pgTable("emergency_helplines", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  stateId: text("state_id").references(() => states.id).notNull(),
  districtId: text("district_id"),
  districtName: text("district_name"),
  phoneNumber: text("phone_number").notNull(),
  alternateNumber: text("alternate_number"),
  tollFreeNumber: text("toll_free_number"),
  email: text("email"),
  location: text("location").default(""),
  description: text("description").default(""),
  is24x7: boolean("is_24x7").default(true),
  priorityOrder: integer("priority_order").default(10),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// ==========================================
// 12. CARGO ITEMS TABLE
// ==========================================
export const cargoItems = pgTable("cargo_items", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  origin: text("origin").notNull(),
  originState: text("origin_state").notNull(),
  destination: text("destination").notNull(),
  destinationState: text("destination_state").notNull(),
  priority: text("priority").default("Routine"),
  status: text("status").default("In Transit"),
  vehicleId: text("vehicle_id").default(""),
  assignedRoadSegmentId: text("assigned_road_segment_id").references(() => roadSegments.id),
  currentLocationName: text("current_location_name").default(""),
  currentCoords: jsonb("current_coords").$type<[number, number]>().default([26.0, 92.0]),
  eta: text("eta").default(""),
  distanceKm: doublePrecision("distance_km").default(0),
  riskLevel: text("risk_level").default("LOW"),
  riskScore: doublePrecision("risk_score").default(0),
  reason: text("reason").default("Normal transit"),
  alternateRouteAvailable: boolean("alternate_route_available").default(false),
  alternateRouteRecommendation: text("alternate_route_recommendation").default(""),
  alternateRouteTimeSaved: text("alternate_route_time_saved").default(""),
  temperatureControlled: boolean("temperature_controlled").default(false),
  requiredDeliveryTime: text("required_delivery_time").default(""),
  consignee: text("consignee").default(""),
  contactNumber: text("contact_number").default(""),
  isMyCargo: boolean("is_my_cargo").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// ==========================================
// 13. LIVE VEHICLES TABLE
// ==========================================
export const liveVehicles = pgTable("live_vehicles", {
  id: text("id").primaryKey(),
  type: text("type").default("Cargo Heavy Truck"),
  registrationNumber: text("registration_number").notNull(),
  cargoId: text("cargo_id"),
  cargoDescription: text("cargo_description").default(""),
  stateId: text("state_id").default("Assam"),
  driverName: text("driver_name").default(""),
  contactNumber: text("contact_number").default(""),
  speedKmh: doublePrecision("speed_kmh").default(40),
  currentCoords: jsonb("current_coords").$type<[number, number]>().default([26.0, 92.0]),
  headingDegrees: doublePrecision("heading_degrees").default(0),
  currentRoadSegmentId: text("current_road_segment_id").references(() => roadSegments.id),
  destination: text("destination").default(""),
  eta: text("eta").default(""),
  fuelLevelPct: doublePrecision("fuel_level_pct").default(80),
  status: text("status").default("In Transit"),
  waypointTrail: jsonb("waypoint_trail").$type<[number, number][]>().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// ==========================================
// 14. STRATEGIC INFRASTRUCTURE TABLE
// ==========================================
export const strategicInfrastructure = pgTable("strategic_infrastructure", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  stateId: text("state_id").references(() => states.id).notNull(),
  districtId: text("district_id").references(() => districts.id).notNull(),
  coords: jsonb("coords").$type<[number, number]>().default([26.0, 92.0]),
  capacity: text("capacity").default(""),
  operationalStatus: text("operational_status").default("Fully Operational"),
  contactPerson: text("contact_person").default(""),
  contactPhone: text("contact_phone").default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// ==========================================
// 15. WEATHER STATIONS TABLE
// ==========================================
export const weatherStations = pgTable("weather_stations", {
  id: text("id").primaryKey(),
  stationName: text("station_name").notNull(),
  stateId: text("state_id").references(() => states.id).notNull(),
  districtName: text("district_name").default(""),
  coords: jsonb("coords").$type<[number, number]>().default([26.0, 92.0]),
  temperature: doublePrecision("temperature").default(22),
  rainfallLast1h: doublePrecision("rainfall_last_1h").default(0),
  rainfallLast24h: doublePrecision("rainfall_last_24h").default(0),
  humidity: doublePrecision("humidity").default(65),
  windSpeed: doublePrecision("wind_speed").default(12),
  atmosphericPressure: doublePrecision("atmospheric_pressure").default(1012),
  recordedAt: text("recorded_at").default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// ==========================================
// 16. BYPASS ROUTES TABLE
// ==========================================
export const bypassRoutes = pgTable("bypass_routes", {
  id: text("id").primaryKey(),
  primaryRoadSegmentId: text("primary_road_segment_id").references(() => roadSegments.id),
  alternateRoadName: text("alternate_road_name").notNull(),
  bypassLengthKm: doublePrecision("bypass_length_km").default(0),
  additionalTravelTime: text("additional_travel_time").default(""),
  vehicleRestrictions: text("vehicle_restrictions").default("All vehicles permitted"),
  roadCondition: text("road_condition").default("Paved 2-lane"),
  status: text("status").default("Open"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// ==========================================
// 17. CLEARANCE TEAMS TABLE
// ==========================================
export const clearanceTeams = pgTable("clearance_teams", {
  id: text("id").primaryKey(),
  teamName: text("team_name").notNull(),
  organization: text("organization").notNull(),
  baseLocation: text("base_location").notNull(),
  stateId: text("state_id").references(() => states.id).notNull(),
  currentAssignmentRoadId: text("current_assignment_road_id").references(() => roadSegments.id),
  machineryDeployed: jsonb("machinery_deployed").$type<string[]>().default([]),
  crewCount: integer("crew_count").default(12),
  contactCommander: text("contact_commander").default(""),
  phoneNumber: text("phone_number").default(""),
  status: text("status").default("Standby"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// ==========================================
// 18. CROWDSOURCED REPORTS TABLE
// ==========================================
export const crowdsourcedReports = pgTable("crowdsourced_reports", {
  id: text("id").primaryKey(),
  reporterName: text("reporter_name").notNull(),
  reporterPhone: text("reporter_phone").default(""),
  reporterRole: text("reporter_role").default("Citizen"),
  locationText: text("location_text").notNull(),
  coords: jsonb("coords").$type<[number, number]>().default([26.0, 92.0]),
  issueType: text("issue_type").notNull(),
  severity: text("severity").default("Moderate"),
  description: text("description").default(""),
  photoUrl: text("photo_url"),
  status: text("status").default("Pending Verification"),
  upvotes: integer("upvotes").default(1),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// ==========================================
// 19. AUDIT LOGS TABLE
// ==========================================
export const auditLogs = pgTable("audit_logs", {
  id: text("id").primaryKey(),
  timestamp: text("timestamp").notNull(),
  action: text("action").notNull(),
  actor: text("actor").notNull(),
  details: text("details").default(""),
  category: text("category").default("Road Status"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// ==========================================
// 20. USERS & AUTHENTICATION TABLE
// ==========================================
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  salt: text("salt").notNull(),
  name: text("name").notNull(),
  role: text("role").default("Field Officer"),
  department: text("department").default("Northeast Disaster Management"),
  assignedState: text("assigned_state").default("All states"),
  assignedDistrict: text("assigned_district"),
  badgeId: text("badge_id").default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// ==========================================
// COMPATIBLE VIEWS (with securityInvoker: true)
// ==========================================
export const activeHazardsView = pgView("active_hazards_view")
  .with({ securityInvoker: true })
  .as((qb) => qb.select().from(activeHazards));
