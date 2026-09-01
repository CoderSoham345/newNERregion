import { relations } from "drizzle-orm/relations";
import { states, districts, roadSegments, highways, roadStatus, trafficConditions, weatherConditions, rainfall, incidents, vehicles, vehicleLocations, shipments, cargoReadiness, news, alerts, helplines, landslideAlerts, floodAlerts } from "./schema.js";

export const districtsRelations = relations(districts, ({one, many}) => ({
	state: one(states, {
		fields: [districts.stateId],
		references: [states.id]
	}),
	roadSegments: many(roadSegments),
	weatherConditions: many(weatherConditions),
	rainfalls: many(rainfall),
	incidents: many(incidents),
	cargoReadinesses: many(cargoReadiness),
	news: many(news),
	alerts: many(alerts),
	landslideAlerts: many(landslideAlerts),
	floodAlerts: many(floodAlerts),
}));

export const statesRelations = relations(states, ({many}) => ({
	districts: many(districts),
	weatherConditions: many(weatherConditions),
	rainfalls: many(rainfall),
	incidents: many(incidents),
	news: many(news),
	alerts: many(alerts),
	helplines: many(helplines),
	highways: many(highways),
	landslideAlerts: many(landslideAlerts),
	floodAlerts: many(floodAlerts),
}));

export const roadSegmentsRelations = relations(roadSegments, ({one, many}) => ({
	district: one(districts, {
		fields: [roadSegments.districtId],
		references: [districts.id]
	}),
	highway: one(highways, {
		fields: [roadSegments.highwayId],
		references: [highways.id]
	}),
	roadStatuses: many(roadStatus),
	trafficConditions: many(trafficConditions),
	incidents: many(incidents),
	landslideAlerts: many(landslideAlerts),
}));

export const highwaysRelations = relations(highways, ({one, many}) => ({
	roadSegments: many(roadSegments),
	state: one(states, {
		fields: [highways.stateId],
		references: [states.id]
	}),
}));

export const roadStatusRelations = relations(roadStatus, ({one}) => ({
	roadSegment: one(roadSegments, {
		fields: [roadStatus.roadSegmentId],
		references: [roadSegments.id]
	}),
}));

export const trafficConditionsRelations = relations(trafficConditions, ({one}) => ({
	roadSegment: one(roadSegments, {
		fields: [trafficConditions.roadSegmentId],
		references: [roadSegments.id]
	}),
}));

export const weatherConditionsRelations = relations(weatherConditions, ({one}) => ({
	district: one(districts, {
		fields: [weatherConditions.districtId],
		references: [districts.id]
	}),
	state: one(states, {
		fields: [weatherConditions.stateId],
		references: [states.id]
	}),
}));

export const rainfallRelations = relations(rainfall, ({one}) => ({
	district: one(districts, {
		fields: [rainfall.districtId],
		references: [districts.id]
	}),
	state: one(states, {
		fields: [rainfall.stateId],
		references: [states.id]
	}),
}));

export const incidentsRelations = relations(incidents, ({one}) => ({
	district: one(districts, {
		fields: [incidents.districtId],
		references: [districts.id]
	}),
	roadSegment: one(roadSegments, {
		fields: [incidents.roadSegmentId],
		references: [roadSegments.id]
	}),
	state: one(states, {
		fields: [incidents.stateId],
		references: [states.id]
	}),
}));

export const vehicleLocationsRelations = relations(vehicleLocations, ({one}) => ({
	vehicle: one(vehicles, {
		fields: [vehicleLocations.vehicleId],
		references: [vehicles.id]
	}),
}));

export const vehiclesRelations = relations(vehicles, ({many}) => ({
	vehicleLocations: many(vehicleLocations),
	shipments: many(shipments),
}));

export const shipmentsRelations = relations(shipments, ({one}) => ({
	vehicle: one(vehicles, {
		fields: [shipments.vehicleId],
		references: [vehicles.id]
	}),
}));

export const cargoReadinessRelations = relations(cargoReadiness, ({one}) => ({
	district: one(districts, {
		fields: [cargoReadiness.districtId],
		references: [districts.id]
	}),
}));

export const newsRelations = relations(news, ({one}) => ({
	district: one(districts, {
		fields: [news.districtId],
		references: [districts.id]
	}),
	state: one(states, {
		fields: [news.stateId],
		references: [states.id]
	}),
}));

export const alertsRelations = relations(alerts, ({one}) => ({
	district: one(districts, {
		fields: [alerts.districtId],
		references: [districts.id]
	}),
	state: one(states, {
		fields: [alerts.stateId],
		references: [states.id]
	}),
}));

export const helplinesRelations = relations(helplines, ({one}) => ({
	state: one(states, {
		fields: [helplines.stateId],
		references: [states.id]
	}),
}));

export const landslideAlertsRelations = relations(landslideAlerts, ({one}) => ({
	district: one(districts, {
		fields: [landslideAlerts.districtId],
		references: [districts.id]
	}),
	roadSegment: one(roadSegments, {
		fields: [landslideAlerts.roadSegmentId],
		references: [roadSegments.id]
	}),
	state: one(states, {
		fields: [landslideAlerts.stateId],
		references: [states.id]
	}),
}));

export const floodAlertsRelations = relations(floodAlerts, ({one}) => ({
	district: one(districts, {
		fields: [floodAlerts.districtId],
		references: [districts.id]
	}),
	state: one(states, {
		fields: [floodAlerts.stateId],
		references: [states.id]
	}),
}));
