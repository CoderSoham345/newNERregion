import { pgTable, unique, bigserial, text, bigint, numeric, timestamp, index, foreignKey, doublePrecision, check, integer, boolean, pgView } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const states = pgTable("states", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	name: text().notNull(),
	code: text().notNull(),
	capital: text(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	population: bigint({ mode: "number" }),
	areaSqKm: numeric("area_sq_km"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	unique("states_name_key").on(table.name),
	unique("states_code_key").on(table.code),
]);

export const districts = pgTable("districts", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	stateId: bigint("state_id", { mode: "number" }).notNull(),
	name: text().notNull(),
	code: text(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	population: bigint({ mode: "number" }),
	latitude: doublePrecision(),
	longitude: doublePrecision(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_district_state").using("btree", table.stateId.asc().nullsLast().op("int8_ops")),
	foreignKey({
			columns: [table.stateId],
			foreignColumns: [states.id],
			name: "districts_state_id_fkey"
		}).onDelete("cascade"),
	unique("districts_state_id_name_key").on(table.stateId, table.name),
]);

export const roadSegments = pgTable("road_segments", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	highwayId: bigint("highway_id", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	districtId: bigint("district_id", { mode: "number" }),
	name: text().notNull(),
	startPoint: text("start_point"),
	endPoint: text("end_point"),
	latitude: doublePrecision(),
	longitude: doublePrecision(),
	lengthKm: numeric("length_km"),
	roadType: text("road_type"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_roads_district").using("btree", table.districtId.asc().nullsLast().op("int8_ops")),
	index("idx_roads_highway").using("btree", table.highwayId.asc().nullsLast().op("int8_ops")),
	foreignKey({
			columns: [table.districtId],
			foreignColumns: [districts.id],
			name: "road_segments_district_id_fkey"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.highwayId],
			foreignColumns: [highways.id],
			name: "road_segments_highway_id_fkey"
		}).onDelete("cascade"),
]);

export const roadStatus = pgTable("road_status", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	roadSegmentId: bigint("road_segment_id", { mode: "number" }).notNull(),
	status: text().notNull(),
	riskScore: integer("risk_score"),
	averageSpeedKmh: numeric("average_speed_kmh"),
	estimatedDelayMinutes: integer("estimated_delay_minutes"),
	reason: text(),
	source: text(),
	isLive: boolean("is_live").default(false),
	observedAt: timestamp("observed_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_road_status_segment").using("btree", table.roadSegmentId.asc().nullsLast().op("int8_ops")),
	foreignKey({
			columns: [table.roadSegmentId],
			foreignColumns: [roadSegments.id],
			name: "road_status_road_segment_id_fkey"
		}).onDelete("cascade"),
	check("road_status_risk_score_check", sql`(risk_score >= 0) AND (risk_score <= 100)`),
	check("road_status_status_check", sql`status = ANY (ARRAY['accessible'::text, 'caution'::text, 'blocked'::text, 'restricted'::text, 'no_data'::text])`),
]);

export const trafficConditions = pgTable("traffic_conditions", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	roadSegmentId: bigint("road_segment_id", { mode: "number" }),
	trafficLevel: text("traffic_level"),
	averageSpeedKmh: numeric("average_speed_kmh"),
	congestionPercent: integer("congestion_percent"),
	vehicleCount: integer("vehicle_count"),
	source: text(),
	isLive: boolean("is_live").default(false),
	observedAt: timestamp("observed_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.roadSegmentId],
			foreignColumns: [roadSegments.id],
			name: "traffic_conditions_road_segment_id_fkey"
		}).onDelete("cascade"),
]);

export const weatherConditions = pgTable("weather_conditions", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	stateId: bigint("state_id", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	districtId: bigint("district_id", { mode: "number" }),
	temperatureC: numeric("temperature_c"),
	feelsLikeC: numeric("feels_like_c"),
	humidityPercent: integer("humidity_percent"),
	windSpeedKmh: numeric("wind_speed_kmh"),
	windDirection: text("wind_direction"),
	pressureHpa: numeric("pressure_hpa"),
	visibilityKm: numeric("visibility_km"),
	weatherCondition: text("weather_condition"),
	weatherDescription: text("weather_description"),
	source: text(),
	isLive: boolean("is_live").default(false),
	observedAt: timestamp("observed_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_weather_district").using("btree", table.districtId.asc().nullsLast().op("int8_ops")),
	foreignKey({
			columns: [table.districtId],
			foreignColumns: [districts.id],
			name: "weather_conditions_district_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.stateId],
			foreignColumns: [states.id],
			name: "weather_conditions_state_id_fkey"
		}).onDelete("cascade"),
]);

export const rainfall = pgTable("rainfall", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	stateId: bigint("state_id", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	districtId: bigint("district_id", { mode: "number" }),
	rainfall1HMm: numeric("rainfall_1h_mm"),
	rainfall3HMm: numeric("rainfall_3h_mm"),
	rainfall24HMm: numeric("rainfall_24h_mm"),
	rainfall7DMm: numeric("rainfall_7d_mm"),
	intensity: text(),
	source: text(),
	isLive: boolean("is_live").default(false),
	observedAt: timestamp("observed_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_rainfall_district").using("btree", table.districtId.asc().nullsLast().op("int8_ops")),
	foreignKey({
			columns: [table.districtId],
			foreignColumns: [districts.id],
			name: "rainfall_district_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.stateId],
			foreignColumns: [states.id],
			name: "rainfall_state_id_fkey"
		}).onDelete("cascade"),
]);

export const incidents = pgTable("incidents", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	stateId: bigint("state_id", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	districtId: bigint("district_id", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	roadSegmentId: bigint("road_segment_id", { mode: "number" }),
	incidentType: text("incident_type").notNull(),
	severity: text(),
	description: text(),
	latitude: doublePrecision(),
	longitude: doublePrecision(),
	photoUrl: text("photo_url"),
	reportedBy: text("reported_by"),
	verified: boolean().default(false),
	status: text().default('open'),
	reportedAt: timestamp("reported_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_incident_district").using("btree", table.districtId.asc().nullsLast().op("int8_ops")),
	foreignKey({
			columns: [table.districtId],
			foreignColumns: [districts.id],
			name: "incidents_district_id_fkey"
		}),
	foreignKey({
			columns: [table.roadSegmentId],
			foreignColumns: [roadSegments.id],
			name: "incidents_road_segment_id_fkey"
		}),
	foreignKey({
			columns: [table.stateId],
			foreignColumns: [states.id],
			name: "incidents_state_id_fkey"
		}),
]);

export const vehicles = pgTable("vehicles", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	vehicleNumber: text("vehicle_number").notNull(),
	vehicleType: text("vehicle_type"),
	operatorName: text("operator_name"),
	cargoType: text("cargo_type"),
	cargoWeightKg: numeric("cargo_weight_kg"),
	origin: text(),
	destination: text(),
	status: text().default('active'),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	unique("vehicles_vehicle_number_key").on(table.vehicleNumber),
]);

export const vehicleLocations = pgTable("vehicle_locations", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	vehicleId: bigint("vehicle_id", { mode: "number" }),
	latitude: doublePrecision().notNull(),
	longitude: doublePrecision().notNull(),
	speedKmh: numeric("speed_kmh"),
	heading: numeric(),
	recordedAt: timestamp("recorded_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_vehicle_location").using("btree", table.vehicleId.asc().nullsLast().op("int8_ops")),
	foreignKey({
			columns: [table.vehicleId],
			foreignColumns: [vehicles.id],
			name: "vehicle_locations_vehicle_id_fkey"
		}).onDelete("cascade"),
]);

export const shipments = pgTable("shipments", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	trackingNumber: text("tracking_number").notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	vehicleId: bigint("vehicle_id", { mode: "number" }),
	cargoType: text("cargo_type"),
	priority: text(),
	origin: text(),
	destination: text(),
	status: text(),
	expectedDelivery: timestamp("expected_delivery", { withTimezone: true, mode: 'string' }),
	actualDelivery: timestamp("actual_delivery", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.vehicleId],
			foreignColumns: [vehicles.id],
			name: "shipments_vehicle_id_fkey"
		}),
	unique("shipments_tracking_number_key").on(table.trackingNumber),
]);

export const cargoReadiness = pgTable("cargo_readiness", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	districtId: bigint("district_id", { mode: "number" }),
	essentialMedicine: integer("essential_medicine").default(0),
	foodSupply: integer("food_supply").default(0),
	fuel: integer().default(0),
	constructionMaterial: integer("construction_material").default(0),
	agricultureSupply: integer("agriculture_supply").default(0),
	overallScore: integer("overall_score"),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.districtId],
			foreignColumns: [districts.id],
			name: "cargo_readiness_district_id_fkey"
		}),
	check("cargo_readiness_overall_score_check", sql`(overall_score >= 0) AND (overall_score <= 100)`),
]);

export const news = pgTable("news", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	stateId: bigint("state_id", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	districtId: bigint("district_id", { mode: "number" }),
	title: text().notNull(),
	summary: text(),
	category: text(),
	severity: text(),
	sourceName: text("source_name"),
	sourceUrl: text("source_url"),
	publishedAt: timestamp("published_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	isVerified: boolean("is_verified").default(false),
}, (table) => [
	index("idx_news_state").using("btree", table.stateId.asc().nullsLast().op("int8_ops")),
	foreignKey({
			columns: [table.districtId],
			foreignColumns: [districts.id],
			name: "news_district_id_fkey"
		}),
	foreignKey({
			columns: [table.stateId],
			foreignColumns: [states.id],
			name: "news_state_id_fkey"
		}),
]);

export const alerts = pgTable("alerts", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	stateId: bigint("state_id", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	districtId: bigint("district_id", { mode: "number" }),
	alertType: text("alert_type"),
	title: text().notNull(),
	message: text(),
	severity: text(),
	source: text(),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_alerts_state").using("btree", table.stateId.asc().nullsLast().op("int8_ops")),
	foreignKey({
			columns: [table.districtId],
			foreignColumns: [districts.id],
			name: "alerts_district_id_fkey"
		}),
	foreignKey({
			columns: [table.stateId],
			foreignColumns: [states.id],
			name: "alerts_state_id_fkey"
		}),
]);

export const helplines = pgTable("helplines", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	stateId: bigint("state_id", { mode: "number" }),
	department: text().notNull(),
	serviceName: text("service_name").notNull(),
	phoneNumber: text("phone_number"),
	emergencyNumber: text("emergency_number"),
	website: text(),
	available24X7: boolean("available_24x7").default(false),
}, (table) => [
	foreignKey({
			columns: [table.stateId],
			foreignColumns: [states.id],
			name: "helplines_state_id_fkey"
		}),
]);

export const highways = pgTable("highways", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	name: text().notNull(),
	highwayNumber: text("highway_number"),
	highwayType: text("highway_type").notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	stateId: bigint("state_id", { mode: "number" }),
	startLocation: text("start_location"),
	endLocation: text("end_location"),
	totalLengthKm: numeric("total_length_km"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	routeName: text("route_name"),
	routeDescription: text("route_description"),
	lengthKm: numeric("length_km"),
	roadAuthority: text("road_authority"),
	operationalStatus: text("operational_status").default('active'),
	trafficEnabled: boolean("traffic_enabled").default(true),
	weatherEnabled: boolean("weather_enabled").default(true),
	floodMonitoringEnabled: boolean("flood_monitoring_enabled").default(true),
	landslideMonitoringEnabled: boolean("landslide_monitoring_enabled").default(true),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.stateId],
			foreignColumns: [states.id],
			name: "highways_state_id_fkey"
		}).onDelete("set null"),
]);

export const landslideAlerts = pgTable("landslide_alerts", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	stateId: bigint("state_id", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	districtId: bigint("district_id", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	roadSegmentId: bigint("road_segment_id", { mode: "number" }),
	latitude: doublePrecision(),
	longitude: doublePrecision(),
	severity: text(),
	probabilityPercent: integer("probability_percent"),
	description: text(),
	source: text(),
	status: text().default('active'),
	reportedAt: timestamp("reported_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	riskScore: integer("risk_score"),
	landslideType: text("landslide_type"),
	triggerFactor: text("trigger_factor"),
	rainfall24HMm: numeric("rainfall_24h_mm"),
	estimatedDebrisM3: numeric("estimated_debris_m3"),
	roadBlocked: boolean("road_blocked").default(false),
	affectedRoadLengthM: numeric("affected_road_length_m"),
	trafficImpact: text("traffic_impact"),
	alternativeRoute: text("alternative_route"),
	responseTeam: text("response_team"),
	clearanceStatus: text("clearance_status"),
	estimatedClearanceHours: numeric("estimated_clearance_hours"),
	alertMessage: text("alert_message"),
	isActive: boolean("is_active").default(true),
	detectedAt: timestamp("detected_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.districtId],
			foreignColumns: [districts.id],
			name: "landslide_alerts_district_id_fkey"
		}),
	foreignKey({
			columns: [table.roadSegmentId],
			foreignColumns: [roadSegments.id],
			name: "landslide_alerts_road_segment_id_fkey"
		}),
	foreignKey({
			columns: [table.stateId],
			foreignColumns: [states.id],
			name: "landslide_alerts_state_id_fkey"
		}),
]);

export const floodAlerts = pgTable("flood_alerts", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	stateId: bigint("state_id", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	districtId: bigint("district_id", { mode: "number" }),
	latitude: doublePrecision(),
	longitude: doublePrecision(),
	severity: text(),
	waterLevelM: numeric("water_level_m"),
	description: text(),
	source: text(),
	status: text().default('active'),
	reportedAt: timestamp("reported_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	roadSegmentId: bigint("road_segment_id", { mode: "number" }),
	riskScore: integer("risk_score"),
	waterLevelTrend: text("water_level_trend"),
	rainfall1HMm: numeric("rainfall_1h_mm"),
	rainfall24HMm: numeric("rainfall_24h_mm"),
	floodDepthCm: numeric("flood_depth_cm"),
	roadSubmerged: boolean("road_submerged").default(false),
	roadAccessibility: text("road_accessibility"),
	trafficImpact: text("traffic_impact"),
	affectedArea: text("affected_area"),
	evacuationRequired: boolean("evacuation_required").default(false),
	alternativeRoute: text("alternative_route"),
	responseTeam: text("response_team"),
	alertMessage: text("alert_message"),
	isActive: boolean("is_active").default(true),
	detectedAt: timestamp("detected_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.districtId],
			foreignColumns: [districts.id],
			name: "flood_alerts_district_id_fkey"
		}),
	foreignKey({
			columns: [table.stateId],
			foreignColumns: [states.id],
			name: "flood_alerts_state_id_fkey"
		}),
]);
export const activeHazards = pgView("active_hazards", {	hazardType: text("hazard_type"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	hazardId: bigint("hazard_id", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	stateId: bigint("state_id", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	districtId: bigint("district_id", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	roadSegmentId: bigint("road_segment_id", { mode: "number" }),
	latitude: doublePrecision(),
	longitude: doublePrecision(),
	riskScore: integer("risk_score"),
	trafficImpact: text("traffic_impact"),
	alternativeRoute: text("alternative_route"),
	alertMessage: text("alert_message"),
	source: text(),
	isActive: boolean("is_active"),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
}).with({"securityInvoker":true}).as(sql`SELECT 'landslide'::text AS hazard_type, la.id AS hazard_id, la.state_id, la.district_id, la.road_segment_id, la.latitude, la.longitude, la.risk_score, la.traffic_impact, la.alternative_route, la.alert_message, la.source, la.is_active, la.updated_at FROM landslide_alerts la WHERE la.is_active = true UNION ALL SELECT 'flood'::text AS hazard_type, fa.id AS hazard_id, fa.state_id, fa.district_id, fa.road_segment_id, fa.latitude, fa.longitude, fa.risk_score, fa.traffic_impact, fa.alternative_route, fa.alert_message, fa.source, fa.is_active, fa.updated_at FROM flood_alerts fa WHERE fa.is_active = true`);
