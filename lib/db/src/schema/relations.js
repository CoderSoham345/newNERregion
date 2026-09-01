import { relations } from "drizzle-orm";
import { states, districts, highways, roadSegments, roadIncidents, emergencyHelplines, cargoItems, liveVehicles, strategicInfrastructure, bypassRoutes, clearanceTeams, } from "./schema.js";
export const statesRelations = relations(states, ({ many }) => ({
    districts: many(districts),
    highways: many(highways),
    roadSegments: many(roadSegments),
    roadIncidents: many(roadIncidents),
    emergencyHelplines: many(emergencyHelplines),
    strategicInfrastructure: many(strategicInfrastructure),
}));
export const districtsRelations = relations(districts, ({ one, many }) => ({
    state: one(states, {
        fields: [districts.stateId],
        references: [states.id],
    }),
    roadSegments: many(roadSegments),
    roadIncidents: many(roadIncidents),
    strategicInfrastructure: many(strategicInfrastructure),
}));
export const highwaysRelations = relations(highways, ({ one, many }) => ({
    state: one(states, {
        fields: [highways.stateId],
        references: [states.id],
    }),
    segments: many(roadSegments),
}));
export const roadSegmentsRelations = relations(roadSegments, ({ one, many }) => ({
    highway: one(highways, {
        fields: [roadSegments.highwayId],
        references: [highways.id],
    }),
    state: one(states, {
        fields: [roadSegments.stateId],
        references: [states.id],
    }),
    district: one(districts, {
        fields: [roadSegments.districtId],
        references: [districts.id],
    }),
    incidents: many(roadIncidents),
    cargoItems: many(cargoItems),
    liveVehicles: many(liveVehicles),
    bypassRoutes: many(bypassRoutes),
    clearanceTeams: many(clearanceTeams),
}));
export const roadIncidentsRelations = relations(roadIncidents, ({ one }) => ({
    state: one(states, {
        fields: [roadIncidents.stateId],
        references: [states.id],
    }),
    district: one(districts, {
        fields: [roadIncidents.districtId],
        references: [districts.id],
    }),
    roadSegment: one(roadSegments, {
        fields: [roadIncidents.roadSegmentId],
        references: [roadSegments.id],
    }),
}));
export const emergencyHelplinesRelations = relations(emergencyHelplines, ({ one }) => ({
    state: one(states, {
        fields: [emergencyHelplines.stateId],
        references: [states.id],
    }),
}));
export const cargoItemsRelations = relations(cargoItems, ({ one }) => ({
    assignedRoadSegment: one(roadSegments, {
        fields: [cargoItems.assignedRoadSegmentId],
        references: [roadSegments.id],
    }),
}));
export const liveVehiclesRelations = relations(liveVehicles, ({ one }) => ({
    currentRoadSegment: one(roadSegments, {
        fields: [liveVehicles.currentRoadSegmentId],
        references: [roadSegments.id],
    }),
}));
export const strategicInfrastructureRelations = relations(strategicInfrastructure, ({ one }) => ({
    state: one(states, {
        fields: [strategicInfrastructure.stateId],
        references: [states.id],
    }),
    district: one(districts, {
        fields: [strategicInfrastructure.districtId],
        references: [districts.id],
    }),
}));
