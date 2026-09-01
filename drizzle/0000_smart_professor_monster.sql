-- NER-SMART Supabase Migration Snapshot (0000_smart_professor_monster.sql)
-- Represents the existing 19 public tables and views in Supabase PostgreSQL

CREATE TABLE IF NOT EXISTS "states" (
  "id" text PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "code" text NOT NULL,
  "capital" text NOT NULL,
  "area_sq_km" double precision DEFAULT 0,
  "population_total" text DEFAULT '',
  "district_count" integer DEFAULT 0,
  "center" jsonb DEFAULT '[26.0, 92.0]',
  "zoom" integer DEFAULT 7,
  "accessibility" double precision DEFAULT 100,
  "blocked" integer DEFAULT 0,
  "at_risk" integer DEFAULT 0,
  "incidents" integer DEFAULT 0,
  "weather_summary" text DEFAULT '',
  "rainfall_24h" double precision DEFAULT 0,
  "temperature_avg" double precision DEFAULT 22,
  "landslide_risk" double precision DEFAULT 0,
  "flood_risk" double precision DEFAULT 0,
  "active_cargo" integer DEFAULT 0,
  "monitored_highways" integer DEFAULT 0,
  "created_at" timestamp with time zone DEFAULT now(),
  "updated_at" timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "districts" (
  "id" text PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "state_id" text NOT NULL REFERENCES "states"("id"),
  "center" jsonb DEFAULT '[26.0, 92.0]',
  "population" text DEFAULT '',
  "road_count" integer DEFAULT 0,
  "highway_count" integer DEFAULT 0,
  "accessibility_score" double precision DEFAULT 100,
  "risk_score" double precision DEFAULT 0,
  "weather" text DEFAULT 'Clear',
  "rainfall" double precision DEFAULT 0,
  "temperature" double precision DEFAULT 22,
  "humidity" double precision DEFAULT 60,
  "wind_speed" double precision DEFAULT 10,
  "traffic_status" text DEFAULT 'Free',
  "incident_count" integer DEFAULT 0,
  "blocked_road_count" integer DEFAULT 0,
  "at_risk_road_count" integer DEFAULT 0,
  "cargo_count" integer DEFAULT 0,
  "terrain_type" text DEFAULT 'Hilly / Mountainous',
  "helpline_count" integer DEFAULT 1,
  "created_at" timestamp with time zone DEFAULT now(),
  "updated_at" timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "highways" (
  "id" text PRIMARY KEY NOT NULL,
  "number" text NOT NULL,
  "name" text NOT NULL,
  "type" text DEFAULT 'NH',
  "state_id" text NOT NULL REFERENCES "states"("id"),
  "district_ids" jsonb DEFAULT '[]',
  "origin" text DEFAULT '',
  "destination" text DEFAULT '',
  "total_length_km" double precision DEFAULT 0,
  "overall_status" text DEFAULT 'Accessible',
  "avg_risk_score" double precision DEFAULT 0,
  "traffic_level" text DEFAULT 'Free',
  "average_speed" double precision DEFAULT 45,
  "expected_delay" text DEFAULT 'None',
  "incident_count" integer DEFAULT 0,
  "created_at" timestamp with time zone DEFAULT now(),
  "updated_at" timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "road_segments" (
  "id" text PRIMARY KEY NOT NULL,
  "highway_id" text REFERENCES "highways"("id"),
  "highway_number" text NOT NULL,
  "highway_type" text DEFAULT 'NH',
  "highway_name" text DEFAULT '',
  "state_id" text NOT NULL REFERENCES "states"("id"),
  "district_id" text NOT NULL REFERENCES "districts"("id"),
  "district_name" text DEFAULT '',
  "start_location" text NOT NULL,
  "end_location" text NOT NULL,
  "length_km" double precision DEFAULT 0,
  "coordinates" jsonb DEFAULT '[]',
  "road_status" text DEFAULT 'Accessible',
  "risk_score" double precision DEFAULT 0,
  "traffic_level" text DEFAULT 'Free',
  "average_speed" double precision DEFAULT 45,
  "congestion_pct" double precision DEFAULT 0,
  "vehicle_count" integer DEFAULT 0,
  "rainfall" double precision DEFAULT 0,
  "temperature" double precision DEFAULT 22,
  "weather_condition" text DEFAULT 'Clear',
  "landslide_risk" double precision DEFAULT 0,
  "flood_risk" double precision DEFAULT 0,
  "soil_saturation" double precision DEFAULT 0,
  "slope_exposure" double precision DEFAULT 0,
  "expected_delay" text DEFAULT 'None',
  "last_updated" text DEFAULT '',
  "incident_ids" jsonb DEFAULT '[]',
  "primary_reason" text DEFAULT 'Normal conditions',
  "alternate_route" text DEFAULT '',
  "alternate_route_km" double precision DEFAULT 0,
  "alternate_route_eta" text DEFAULT '',
  "affected_cargo" jsonb DEFAULT '[]',
  "elevation_meters" double precision DEFAULT 500,
  "created_at" timestamp with time zone DEFAULT now(),
  "updated_at" timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "road_incidents" (
  "id" text PRIMARY KEY NOT NULL,
  "title" text NOT NULL,
  "type" text NOT NULL,
  "state_id" text NOT NULL REFERENCES "states"("id"),
  "district_id" text NOT NULL REFERENCES "districts"("id"),
  "district_name" text DEFAULT '',
  "highway_number" text DEFAULT '',
  "road_segment_id" text REFERENCES "road_segments"("id"),
  "location_name" text NOT NULL,
  "coords" jsonb DEFAULT '[26.0, 92.0]',
  "severity" text DEFAULT 'Moderate',
  "status" text DEFAULT 'Reported',
  "reported_by" text NOT NULL,
  "reported_by_role" text DEFAULT 'Field Officer',
  "reported_at" text DEFAULT '',
  "timestamp_ms" bigint DEFAULT 0,
  "description" text DEFAULT '',
  "lanes_affected" text DEFAULT 'Single lane open',
  "estimated_clearance_time" text DEFAULT 'Pending assessment',
  "verified_by" text,
  "photo_url" text,
  "is_offline_reported" boolean DEFAULT false,
  "sync_status" text DEFAULT 'Synced',
  "created_at" timestamp with time zone DEFAULT now(),
  "updated_at" timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "active_hazards" (
  "id" text PRIMARY KEY NOT NULL,
  "title" text NOT NULL,
  "hazard_type" text NOT NULL,
  "state_id" text NOT NULL REFERENCES "states"("id"),
  "district_id" text REFERENCES "districts"("id"),
  "location_name" text NOT NULL,
  "highway_number" text DEFAULT '',
  "coords" jsonb DEFAULT '[26.0, 92.0]',
  "severity" text DEFAULT 'Moderate',
  "status" text DEFAULT 'Active',
  "description" text DEFAULT '',
  "reported_at" text DEFAULT '',
  "created_at" timestamp with time zone DEFAULT now(),
  "updated_at" timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "system_alerts" (
  "id" text PRIMARY KEY NOT NULL,
  "title" text NOT NULL,
  "category" text NOT NULL,
  "state_id" text DEFAULT 'All states',
  "district_name" text,
  "severity" text DEFAULT 'Moderate',
  "timestamp" text DEFAULT '',
  "content" text NOT NULL,
  "recommended_action" text DEFAULT '',
  "road_segment_id" text,
  "is_read" boolean DEFAULT false,
  "source" text DEFAULT 'National Disaster Management Authority',
  "created_at" timestamp with time zone DEFAULT now(),
  "updated_at" timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "flood_alerts" (
  "id" text PRIMARY KEY NOT NULL,
  "state_id" text NOT NULL,
  "district_name" text NOT NULL,
  "river_basin" text NOT NULL,
  "water_level_meters" double precision DEFAULT 0,
  "danger_threshold_meters" double precision DEFAULT 0,
  "risk_level" text DEFAULT 'WATCH',
  "warning_issued_at" text DEFAULT '',
  "affected_highways" jsonb DEFAULT '[]',
  "advisory" text DEFAULT '',
  "created_at" timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "landslide_alerts" (
  "id" text PRIMARY KEY NOT NULL,
  "state_id" text NOT NULL,
  "district_name" text NOT NULL,
  "slope_location" text NOT NULL,
  "highway_number" text NOT NULL,
  "soil_saturation_pct" double precision DEFAULT 0,
  "slope_angle_degrees" double precision DEFAULT 0,
  "risk_category" text DEFAULT 'HIGH',
  "clearance_machinery_deployed" boolean DEFAULT false,
  "alternate_route" text DEFAULT '',
  "updated_at" text DEFAULT '',
  "created_at" timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "news_updates" (
  "id" text PRIMARY KEY NOT NULL,
  "title" text NOT NULL,
  "summary" text NOT NULL,
  "source" text DEFAULT 'NER Emergency Desk',
  "category" text DEFAULT 'Road Infrastructure',
  "timestamp" text DEFAULT '',
  "full_text" text DEFAULT '',
  "relevant_states" jsonb DEFAULT '[]',
  "is_breaking" boolean DEFAULT false,
  "created_at" timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "emergency_helplines" (
  "id" text PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "category" text NOT NULL,
  "state_id" text NOT NULL REFERENCES "states"("id"),
  "district_id" text,
  "district_name" text,
  "phone_number" text NOT NULL,
  "alternate_number" text,
  "toll_free_number" text,
  "email" text,
  "location" text DEFAULT '',
  "description" text DEFAULT '',
  "is_24x7" boolean DEFAULT true,
  "priority_order" integer DEFAULT 10,
  "created_at" timestamp with time zone DEFAULT now(),
  "updated_at" timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "cargo_items" (
  "id" text PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "category" text NOT NULL,
  "origin" text NOT NULL,
  "origin_state" text NOT NULL,
  "destination" text NOT NULL,
  "destination_state" text NOT NULL,
  "priority" text DEFAULT 'Routine',
  "status" text DEFAULT 'In Transit',
  "vehicle_id" text DEFAULT '',
  "assigned_road_segment_id" text REFERENCES "road_segments"("id"),
  "current_location_name" text DEFAULT '',
  "current_coords" jsonb DEFAULT '[26.0, 92.0]',
  "eta" text DEFAULT '',
  "distance_km" double precision DEFAULT 0,
  "risk_level" text DEFAULT 'LOW',
  "risk_score" double precision DEFAULT 0,
  "reason" text DEFAULT 'Normal transit',
  "alternate_route_available" boolean DEFAULT false,
  "alternate_route_recommendation" text DEFAULT '',
  "alternate_route_time_saved" text DEFAULT '',
  "temperature_controlled" boolean DEFAULT false,
  "required_delivery_time" text DEFAULT '',
  "consignee" text DEFAULT '',
  "contact_number" text DEFAULT '',
  "is_my_cargo" boolean DEFAULT false,
  "created_at" timestamp with time zone DEFAULT now(),
  "updated_at" timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "live_vehicles" (
  "id" text PRIMARY KEY NOT NULL,
  "type" text DEFAULT 'Cargo Heavy Truck',
  "registration_number" text NOT NULL,
  "cargo_id" text,
  "cargo_description" text DEFAULT '',
  "state_id" text DEFAULT 'Assam',
  "driver_name" text DEFAULT '',
  "contact_number" text DEFAULT '',
  "speed_kmh" double precision DEFAULT 40,
  "current_coords" jsonb DEFAULT '[26.0, 92.0]',
  "heading_degrees" double precision DEFAULT 0,
  "current_road_segment_id" text REFERENCES "road_segments"("id"),
  "destination" text DEFAULT '',
  "eta" text DEFAULT '',
  "fuel_level_pct" double precision DEFAULT 80,
  "status" text DEFAULT 'In Transit',
  "waypoint_trail" jsonb DEFAULT '[]',
  "created_at" timestamp with time zone DEFAULT now(),
  "updated_at" timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "strategic_infrastructure" (
  "id" text PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "type" text NOT NULL,
  "state_id" text NOT NULL REFERENCES "states"("id"),
  "district_id" text NOT NULL REFERENCES "districts"("id"),
  "coords" jsonb DEFAULT '[26.0, 92.0]',
  "capacity" text DEFAULT '',
  "operational_status" text DEFAULT 'Fully Operational',
  "contact_person" text DEFAULT '',
  "contact_phone" text DEFAULT '',
  "created_at" timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "weather_stations" (
  "id" text PRIMARY KEY NOT NULL,
  "station_name" text NOT NULL,
  "state_id" text NOT NULL REFERENCES "states"("id"),
  "district_name" text DEFAULT '',
  "coords" jsonb DEFAULT '[26.0, 92.0]',
  "temperature" double precision DEFAULT 22,
  "rainfall_last_1h" double precision DEFAULT 0,
  "rainfall_last_24h" double precision DEFAULT 0,
  "humidity" double precision DEFAULT 65,
  "wind_speed" double precision DEFAULT 12,
  "atmospheric_pressure" double precision DEFAULT 1012,
  "recorded_at" text DEFAULT '',
  "created_at" timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "bypass_routes" (
  "id" text PRIMARY KEY NOT NULL,
  "primary_road_segment_id" text REFERENCES "road_segments"("id"),
  "alternate_road_name" text NOT NULL,
  "bypass_length_km" double precision DEFAULT 0,
  "additional_travel_time" text DEFAULT '',
  "vehicle_restrictions" text DEFAULT 'All vehicles permitted',
  "road_condition" text DEFAULT 'Paved 2-lane',
  "status" text DEFAULT 'Open',
  "created_at" timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "clearance_teams" (
  "id" text PRIMARY KEY NOT NULL,
  "team_name" text NOT NULL,
  "organization" text NOT NULL,
  "base_location" text NOT NULL,
  "state_id" text NOT NULL REFERENCES "states"("id"),
  "current_assignment_road_id" text REFERENCES "road_segments"("id"),
  "machinery_deployed" jsonb DEFAULT '[]',
  "crew_count" integer DEFAULT 12,
  "contact_commander" text DEFAULT '',
  "phoneNumber" text DEFAULT '',
  "status" text DEFAULT 'Standby',
  "created_at" timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "crowdsourced_reports" (
  "id" text PRIMARY KEY NOT NULL,
  "reporter_name" text NOT NULL,
  "reporter_phone" text DEFAULT '',
  "reporter_role" text DEFAULT 'Citizen',
  "location_text" text NOT NULL,
  "coords" jsonb DEFAULT '[26.0, 92.0]',
  "issue_type" text NOT NULL,
  "severity" text DEFAULT 'Moderate',
  "description" text DEFAULT '',
  "photo_url" text,
  "status" text DEFAULT 'Pending Verification',
  "upvotes" integer DEFAULT 1,
  "created_at" timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "audit_logs" (
  "id" text PRIMARY KEY NOT NULL,
  "timestamp" text NOT NULL,
  "action" text NOT NULL,
  "actor" text NOT NULL,
  "details" text DEFAULT '',
  "category" text DEFAULT 'Road Status',
  "created_at" timestamp with time zone DEFAULT now()
);
