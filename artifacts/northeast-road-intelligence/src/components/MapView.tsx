import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { useOperating } from '../context/OperatingContext';
import { ALL_STATES, STATES_DATA, type StateId } from '../data/statesAndDistricts';
import { type RoadSegment, type RoadStatus } from '../data/roadNetwork';
import { SourceBadge } from './SourceBadge';
import {
  Layers,
  ZoomIn,
  ZoomOut,
  Compass,
  Radio,
  Building2,
  Crosshair,
  MapPin,
  Search,
  Globe,
  SlidersHorizontal,
  Info,
} from 'lucide-react';

export interface RouteGeometryData {
  id: string;
  name: string;
  origin: string;
  destination: string;
  coordinates: [number, number][];
  status: 'recommended' | 'alternative' | 'blocked';
  color: string;
  distance: string;
  duration: string;
}

interface MapViewProps {
  className?: string;
  onSelectSegment?: (segment: RoadSegment) => void;
  showLayerPanel?: boolean;
  showSearchHeader?: boolean;
  recommendedRoute?: RouteGeometryData | null;
  originalRoute?: RouteGeometryData | null;
  alternativeRoutes?: RouteGeometryData[];
  blockedSegments?: { coords: [number, number]; title: string; road: string }[];
  originCoords?: [number, number];
  destinationCoords?: [number, number];
  originName?: string;
  destinationName?: string;
}

// 4 Strict Road Status Colors as mandated:
// Green = Accessible, Orange = At Risk, Red = Blocked, Grey = Unknown
export const STATUS_COLORS: Record<string, string> = {
  Accessible: '#16a34a', // Green
  'At risk': '#ea580c', // Orange
  Caution: '#ea580c', // Orange
  Blocked: '#dc2626', // Red
  Unknown: '#64748b', // Grey
  'No data': '#64748b', // Grey
  'Under maintenance': '#64748b', // Grey
};

export type BaseMapStyle = 'outdoor' | 'streets' | 'hybrid' | 'dark' | 'osm';

const isValidCoord = (c: any): c is [number, number] => {
  return (
    Array.isArray(c) &&
    c.length === 2 &&
    typeof c[0] === 'number' &&
    typeof c[1] === 'number' &&
    !Number.isNaN(c[0]) &&
    !Number.isNaN(c[1]) &&
    Number.isFinite(c[0]) &&
    Number.isFinite(c[1]) &&
    c[0] >= -90 &&
    c[0] <= 90 &&
    c[1] >= -180 &&
    c[1] <= 180
  );
};

export const MapView: React.FC<MapViewProps> = ({
  className = 'h-[550px] w-full',
  onSelectSegment,
  showLayerPanel = true,
  showSearchHeader = true,
  recommendedRoute,
  originalRoute,
  alternativeRoutes,
  blockedSegments,
  originCoords,
  destinationCoords,
  originName,
  destinationName,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const layersGroupRef = useRef<{
    roads: L.LayerGroup;
    incidents: L.LayerGroup;
    vehicles: L.LayerGroup;
    infrastructure: L.LayerGroup;
    routes: L.LayerGroup;
  } | null>(null);

  const {
    selectedState,
    setSelectedState,
    selectedDistrictId,
    setSelectedDistrictId,
    selectedHighwayId,
    setSelectedHighwayId,
    selectedRoadSegment,
    filteredRoadSegments,
    filteredIncidents,
    filteredVehicles,
    infrastructure,
    mapLayers,
    toggleMapLayer,
    inspectRoad,
    inspectIncident,
    inspectVehicle,
    darkMode,
    demoMode,
  } = useOperating();

  const [baseMapStyle, setBaseMapStyle] = useState<BaseMapStyle>('outdoor');
  const [layerDropdownOpen, setLayerDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sourceNoticeOpen, setSourceNoticeOpen] = useState(false);

  // Read MapTiler API key safely without hardcoding
  const maptilerApiKey =
    (typeof import.meta !== 'undefined' && import.meta.env
      ? import.meta.env.VITE_MAPTILER_API_KEY ||
        import.meta.env.MAPTILER_API ||
        import.meta.env.VITE_MAPTILER_API
      : '') || '';

  // Compute Tile URL based on selected baseMapStyle and theme
  const getTileUrl = (style: BaseMapStyle) => {
    if (style === 'osm' || !maptilerApiKey) {
      return darkMode
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    }

    switch (style) {
      case 'outdoor':
        return `https://api.maptiler.com/maps/outdoor-v2/{z}/{x}/{y}.png?key=${maptilerApiKey}`;
      case 'streets':
        return `https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${maptilerApiKey}`;
      case 'hybrid':
        return `https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=${maptilerApiKey}`;
      case 'dark':
        return `https://api.maptiler.com/maps/dataviz-dark/{z}/{x}/{y}.png?key=${maptilerApiKey}`;
      default:
        return `https://api.maptiler.com/maps/outdoor-v2/{z}/{x}/{y}.png?key=${maptilerApiKey}`;
    }
  };

  // Initialize Leaflet Map
  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container) return;
    if (mapInstanceRef.current) return;

    // Safety: prevent duplicate initialization if container has leftover leaflet id
    if ((container as any)._leaflet_id) {
      delete (container as any)._leaflet_id;
    }

    let map: L.Map | null = null;
    try {
      // Default center to North East India coordinates
      map = L.map(container, {
        center: [26.0, 92.5],
        zoom: 7,
        minZoom: 5,
        maxZoom: 18,
        zoomControl: false,
        attributionControl: false,
      });

      // Custom attribution
      L.control
        .attribution({
          position: 'bottomright',
          prefix:
            '<a href="https://www.maptiler.com/" target="_blank" rel="noopener">MapTiler</a> | <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>',
        })
        .addTo(map);

      // Initial base tile layer
      const initialStyle: BaseMapStyle = darkMode ? 'dark' : 'outdoor';
      setBaseMapStyle(initialStyle);
      const tileLayer = L.tileLayer(getTileUrl(initialStyle), {
        maxZoom: 18,
        tileSize: 512,
        zoomOffset: -1,
        crossOrigin: true,
      }).addTo(map);

      tileLayerRef.current = tileLayer;

      // Create Layer Groups
      const roadsGroup = L.layerGroup().addTo(map);
      const incidentsGroup = L.layerGroup().addTo(map);
      const vehiclesGroup = L.layerGroup().addTo(map);
      const infraGroup = L.layerGroup().addTo(map);
      const routesGroup = L.layerGroup().addTo(map);

      layersGroupRef.current = {
        roads: roadsGroup,
        incidents: incidentsGroup,
        vehicles: vehiclesGroup,
        infrastructure: infraGroup,
        routes: routesGroup,
      };

      mapInstanceRef.current = map;

      // Invalidate map size after paint to ensure correct display on small mobile screens
      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 200);
    } catch (e) {
      console.warn('Leaflet map initialization skipped or caught:', e);
    }

    // Setup ResizeObserver for responsive resizing on Android mobile
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && container) {
      resizeObserver = new ResizeObserver(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      });
      resizeObserver.observe(container);
    }

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      if (map) {
        try {
          map.remove();
        } catch {
          // ignore cleanup errors
        }
      }
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Tile Layer when Base Style or Theme Changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (tileLayerRef.current) {
      try {
        mapInstanceRef.current.removeLayer(tileLayerRef.current);
      } catch {
        // ignore
      }
    }
    try {
      const newTileLayer = L.tileLayer(getTileUrl(baseMapStyle), {
        maxZoom: 18,
        tileSize: 512,
        zoomOffset: -1,
        crossOrigin: true,
      }).addTo(mapInstanceRef.current);

      tileLayerRef.current = newTileLayer;
    } catch (e) {
      console.warn('Failed to update tile layer:', e);
    }
  }, [baseMapStyle, darkMode]);

  // Handle State / District / Segment FlyTo
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    try {
      if (selectedRoadSegment && Array.isArray(selectedRoadSegment.coordinates)) {
        const validCoords = selectedRoadSegment.coordinates.filter(isValidCoord);
        if (validCoords.length > 0) {
          const bounds = L.latLngBounds(validCoords);
          if (bounds.isValid()) {
            map.flyToBounds(bounds, { padding: [60, 60], maxZoom: 12, duration: 1.2 });
            return;
          }
        }
      }

      if (selectedState !== 'All states' && STATES_DATA[selectedState as StateId]) {
        const st = STATES_DATA[selectedState as StateId];
        if (selectedDistrictId !== 'all') {
          const dist = st.districts.find((d) => d.id === selectedDistrictId);
          if (dist && isValidCoord(dist.center)) {
            map.flyTo(dist.center, 10, { duration: 1.2 });
            return;
          }
        }
        if (st && isValidCoord(st.center)) {
          map.flyTo(st.center, st.zoom, { duration: 1.2 });
          return;
        }
      }
      map.flyTo([26.0, 92.5], 7, { duration: 1.2 });
    } catch (e) {
      console.warn('Map flyTo failed:', e);
    }
  }, [selectedState, selectedDistrictId, selectedRoadSegment]);

  // Render UttarPURV Recommended, Original, and Alternative Routes on MapTiler
  useEffect(() => {
    const groups = layersGroupRef.current;
    if (!groups || !groups.routes) return;
    const map = mapInstanceRef.current;
    if (!map) return;

    groups.routes.clearLayers();
    const allCoords: [number, number][] = [];

    // 1. Draw Original Route (Red Dashed) if provided
    if (originalRoute && Array.isArray(originalRoute.coordinates)) {
      const validCoords = originalRoute.coordinates.filter(isValidCoord);
      if (validCoords.length > 0) {
        const origLine = L.polyline(validCoords, {
          color: '#dc2626',
          weight: 5,
          opacity: 0.85,
          dashArray: '6, 8',
        });
        origLine.bindTooltip(`<strong>Original Route (Blocked/Risk)</strong><br/>${originalRoute.distance} · ${originalRoute.duration}`, { sticky: true });
        origLine.addTo(groups.routes);
        allCoords.push(...validCoords);
      }
    }

    // 2. Draw Alternative Routes (Yellow/Orange)
    if (alternativeRoutes) {
      alternativeRoutes.forEach((alt) => {
        if (alt && Array.isArray(alt.coordinates)) {
          const validCoords = alt.coordinates.filter(isValidCoord);
          if (validCoords.length > 0) {
            const altLine = L.polyline(validCoords, {
              color: '#ea580c',
              weight: 4,
              opacity: 0.8,
            });
            altLine.bindTooltip(`<strong>Alternative</strong>: ${alt.name}<br/>${alt.distance} · ${alt.duration}`, { sticky: true });
            altLine.addTo(groups.routes);
            allCoords.push(...validCoords);
          }
        }
      });
    }

    // 3. Draw Recommended Route (Green, Prominent)
    if (recommendedRoute && Array.isArray(recommendedRoute.coordinates)) {
      const validCoords = recommendedRoute.coordinates.filter(isValidCoord);
      if (validCoords.length > 0) {
        const recLine = L.polyline(validCoords, {
          color: '#16a34a',
          weight: 7,
          opacity: 0.95,
          lineCap: 'round',
          lineJoin: 'round',
        });
        recLine.bindTooltip(`<strong>🟢 RECOMMENDED ROUTE</strong>: ${recommendedRoute.name}<br/>${recommendedRoute.distance} · ${recommendedRoute.duration}`, { sticky: true });
        recLine.addTo(groups.routes);
        allCoords.push(...validCoords);
      }
    }

    // 4. Draw Blocked Segment Markers (🚨)
    if (blockedSegments) {
      blockedSegments.forEach((seg) => {
        if (seg && isValidCoord(seg.coords)) {
          const blockIconHtml = `
            <div class="relative flex items-center justify-center">
              <span class="absolute w-9 h-9 rounded-full bg-red-500/50 animate-ping"></span>
              <div class="w-7 h-7 rounded-full bg-red-600 border-2 border-white flex items-center justify-center text-white font-black text-xs shadow-lg">
                🚨
              </div>
            </div>
          `;
          const icon = L.divIcon({
            html: blockIconHtml,
            className: 'block-marker-icon',
            iconSize: [28, 28],
            iconAnchor: [14, 14],
          });
          const marker = L.marker(seg.coords, { icon });
          marker.bindPopup(`<div class="p-1 text-slate-900"><strong class="text-red-600 font-bold">🚨 ROAD BLOCKED</strong><br/>${seg.title}<br/><span class="text-xs text-slate-600">${seg.road}</span></div>`);
          marker.addTo(groups.routes);
        }
      });
    }

    // 5. Draw Origin Marker (🟢)
    if (originCoords && isValidCoord(originCoords)) {
      const originIconHtml = `
        <div class="flex items-center justify-center">
          <div class="w-8 h-8 rounded-full bg-emerald-600 border-3 border-white flex items-center justify-center text-white font-black text-xs shadow-xl">
            🟢
          </div>
        </div>
      `;
      const oIcon = L.divIcon({
        html: originIconHtml,
        className: 'origin-marker-icon',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });
      const oMarker = L.marker(originCoords, { icon: oIcon });
      oMarker.bindPopup(`<div class="p-1 text-slate-950 font-bold">🟢 ORIGIN<br/>${originName || 'Start'}</div>`);
      oMarker.addTo(groups.routes);
      allCoords.push(originCoords);
    }

    // 6. Draw Destination Marker (🏁)
    if (destinationCoords && isValidCoord(destinationCoords)) {
      const destIconHtml = `
        <div class="flex items-center justify-center">
          <div class="w-8 h-8 rounded-full bg-blue-600 border-3 border-white flex items-center justify-center text-white font-black text-xs shadow-xl">
            🏁
          </div>
        </div>
      `;
      const dIcon = L.divIcon({
        html: destIconHtml,
        className: 'destination-marker-icon',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });
      const dMarker = L.marker(destinationCoords, { icon: dIcon });
      dMarker.bindPopup(`<div class="p-1 text-slate-950 font-bold">🏁 DESTINATION<br/>${destinationName || 'End'}</div>`);
      dMarker.addTo(groups.routes);
      allCoords.push(destinationCoords);
    }

    // 7. Auto-fit bounds to complete route
    if (allCoords.length > 0) {
      try {
        const bounds = L.latLngBounds(allCoords);
        if (bounds.isValid()) {
          map.fitBounds(bounds, { padding: [60, 60], maxZoom: 13, duration: 1.2 });
        }
      } catch (e) {
        console.warn('Failed to fit route bounds:', e);
      }
    }
  }, [recommendedRoute, originalRoute, alternativeRoutes, blockedSegments, originCoords, destinationCoords, originName, destinationName]);

  // Render Roads Polylines
  useEffect(() => {
    const groups = layersGroupRef.current;
    if (!groups) return;

    groups.roads.clearLayers();

    if (!mapLayers.roadStatus) return;

    filteredRoadSegments.forEach((segment) => {
      if (!segment || !Array.isArray(segment.coordinates)) return;
      const validCoords = segment.coordinates.filter(isValidCoord);
      if (validCoords.length === 0) return;

      const isSelected = selectedRoadSegment?.id === segment.id;
      const statusKey = segment.roadStatus || 'Accessible';
      const color = STATUS_COLORS[statusKey] || STATUS_COLORS['Accessible'];

      const polyline = L.polyline(validCoords, {
        color: color,
        weight: isSelected ? 8 : segment.roadStatus === 'Blocked' ? 6 : 5,
        opacity: isSelected ? 1 : 0.9,
        lineCap: 'round',
        lineJoin: 'round',
        dashArray: segment.roadStatus === 'At risk' ? '4, 8' : undefined,
      });

      polyline.bindTooltip(
        `<div style="font-family: sans-serif; font-size: 11px;">
          <strong>${segment.highwayNumber}</strong>: ${segment.startLocation} → ${segment.endLocation}<br/>
          <span style="color:${color}; font-weight:bold;">● Status: ${segment.roadStatus.toUpperCase()}</span><br/>
          <span style="color:#64748b;">Source: ${segment.lastUpdated || 'Current telemetry'}</span>
        </div>`,
        { sticky: true, className: 'map-road-tooltip' }
      );

      polyline.on('click', () => {
        inspectRoad(segment.id);
        if (onSelectSegment) onSelectSegment(segment);
      });

      polyline.addTo(groups.roads);
    });
  }, [filteredRoadSegments, selectedRoadSegment, mapLayers.roadStatus, inspectRoad, onSelectSegment]);

  // Render Incidents Markers
  useEffect(() => {
    const groups = layersGroupRef.current;
    if (!groups) return;

    groups.incidents.clearLayers();

    if (!mapLayers.incidents) return;

    filteredIncidents.forEach((inc) => {
      if (!inc || inc.status === 'Resolved' || !isValidCoord(inc.coords)) return;

      const isCritical = inc.severity === 'Critical';
      const isFieldReport = !inc.verifiedBy;
      const iconHtml = `
        <div class="relative flex items-center justify-center cursor-pointer">
          ${isCritical ? '<span class="absolute w-8 h-8 rounded-full bg-red-500/40 animate-ping"></span>' : ''}
          <div class="w-7 h-7 rounded-full flex items-center justify-center font-bold text-white shadow-lg border-2 border-white ${
            isCritical ? 'bg-red-600' : isFieldReport ? 'bg-purple-600' : 'bg-amber-600'
          }">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'incident-marker-icon',
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const marker = L.marker(inc.coords, { icon: customIcon });

      marker.bindPopup(
        `<div class="p-1 max-w-xs text-slate-800">
          <div class="text-[10px] uppercase font-bold ${isCritical ? 'text-red-600' : 'text-amber-600'} mb-0.5">
            ${inc.severity} · ${inc.type}
          </div>
          <h4 class="font-bold text-xs mb-1">${inc.title}</h4>
          <p class="text-[11px] text-slate-600 mb-1.5">${inc.description}</p>
          <div class="text-[10px] text-slate-500 font-semibold mb-1">Location: ${inc.locationName} (${inc.highwayNumber})</div>
          <div class="text-[10px] font-bold text-purple-700 mb-2">Source: ${inc.reportedBy} (${inc.verifiedBy ? 'Verified' : 'Field Report - Pending'})</div>
          <button id="popup-inc-btn-${inc.id}" class="w-full py-1 bg-slate-900 text-white font-bold text-[10px] rounded hover:bg-slate-800 cursor-pointer">
            Inspect Incident Details
          </button>
        </div>`
      );

      marker.on('popupopen', () => {
        const btn = document.getElementById(`popup-inc-btn-${inc.id}`);
        if (btn) {
          btn.onclick = () => inspectIncident(inc.id);
        }
      });

      marker.addTo(groups.incidents);
    });
  }, [filteredIncidents, mapLayers.incidents, inspectIncident]);

  // Render Vehicles Markers ONLY IF in Demo Mode or if real transponder attached
  useEffect(() => {
    const groups = layersGroupRef.current;
    if (!groups) return;

    groups.vehicles.clearLayers();

    if (!mapLayers.liveVehicles) return;

    // If not demoMode, we do NOT fabricate fake moving vehicles
    if (!demoMode) return;

    filteredVehicles.forEach((veh) => {
      if (!veh || !isValidCoord(veh.currentCoords)) return;
      const isAmbulance = veh.type === 'Emergency Ambulance';

      const iconHtml = `
        <div class="relative flex items-center justify-center cursor-pointer group">
          <div class="w-7 h-7 rounded-lg flex items-center justify-center text-white shadow-md border-2 border-white ${
            isAmbulance ? 'bg-rose-600' : 'bg-blue-600'
          }">
            <span class="text-[10px] font-black">SIM</span>
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'vehicle-marker-icon',
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const marker = L.marker(veh.currentCoords, { icon: customIcon });

      marker.bindPopup(
        `<div class="p-1 max-w-xs text-slate-800">
          <div class="text-[10px] uppercase font-bold text-orange-600 mb-0.5">● SIMULATED TELEMETRY</div>
          <h4 class="font-bold text-xs mb-0.5">${veh.registrationNumber} (${veh.type})</h4>
          <p class="text-[11px] text-slate-600 mb-1">Driver: ${veh.driverName} | Cargo: ${veh.cargoDescription}</p>
          <div class="text-[10px] text-slate-500 font-semibold mb-2">Destination: ${veh.destination}</div>
          <button id="popup-veh-btn-${veh.id}" class="w-full py-1 bg-blue-600 text-white font-bold text-[10px] rounded hover:bg-blue-700 cursor-pointer">
            Inspect Vehicle Telemetry
          </button>
        </div>`
      );

      marker.on('popupopen', () => {
        const btn = document.getElementById(`popup-veh-btn-${veh.id}`);
        if (btn) {
          btn.onclick = () => inspectVehicle(veh.id);
        }
      });

      marker.addTo(groups.vehicles);
    });
  }, [filteredVehicles, mapLayers.liveVehicles, demoMode, inspectVehicle]);

  // Render Infrastructure Markers
  useEffect(() => {
    const groups = layersGroupRef.current;
    if (!groups) return;

    groups.infrastructure.clearLayers();

    if (!mapLayers.infrastructure) return;

    infrastructure.forEach((infra) => {
      if (!infra || !isValidCoord(infra.coords)) return;
      const isHospital = infra.type === 'Hospital';
      const iconHtml = `
        <div class="w-6 h-6 rounded-md flex items-center justify-center text-white shadow-xs border border-white ${
          isHospital ? 'bg-emerald-600' : 'bg-slate-700'
        }">
          <span class="text-[9px] font-bold">${isHospital ? 'H' : 'LOG'}</span>
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'infra-marker-icon',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker(infra.coords, { icon: customIcon });

      marker.bindPopup(
        `<div class="p-1 text-slate-800">
          <div class="text-[10px] uppercase font-bold text-emerald-700 mb-0.5">Verified Facility</div>
          <h4 class="font-bold text-xs mb-0.5">${infra.name}</h4>
          <div class="text-[10px] text-slate-500 font-semibold">${infra.districtId}, ${infra.stateId}</div>
        </div>`
      );

      marker.addTo(groups.infrastructure);
    });
  }, [infrastructure, mapLayers.infrastructure]);

  // Map Navigation Handlers
  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();
  const handleResetView = () => mapInstanceRef.current?.flyTo([26.0, 92.5], 7);

  // Search filter handler
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const q = searchQuery.toLowerCase().trim();
    // Search states
    const foundState = ALL_STATES.find((s) => s.toLowerCase().includes(q));
    if (foundState && foundState !== 'All states') {
      setSelectedState(foundState);
      return;
    }

    // Search roads
    const foundRoad = filteredRoadSegments.find(
      (r) =>
        r.highwayNumber.toLowerCase().includes(q) ||
        r.startLocation.toLowerCase().includes(q) ||
        r.endLocation.toLowerCase().includes(q) ||
        r.districtName.toLowerCase().includes(q)
    );
    if (foundRoad) {
      inspectRoad(foundRoad.id);
      return;
    }
  };

  const stateData = selectedState !== 'All states' ? STATES_DATA[selectedState as StateId] : null;

  return (
    <div className={`relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 flex flex-col ${className}`}>
      {/* Search & Selector Header */}
      {showSearchHeader && (
        <div className="p-3 bg-white/95 dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800 z-10 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-2">
            {/* State Select */}
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value as any)}
              className="px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
            >
              {ALL_STATES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>

            {/* District Select */}
            {stateData && (
              <select
                value={selectedDistrictId}
                onChange={(e) => setSelectedDistrictId(e.target.value)}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
              >
                <option value="all">All {stateData.name} Districts</option>
                {stateData.districts.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            )}

          </div>

          {/* Quick Search */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-xs min-w-[200px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search highway, corridor, state, or district..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400"
            />
          </form>
        </div>
      )}

      {/* Map Target Canvas Container */}
      <div className="relative flex-1 w-full min-h-[380px]">
        <div ref={mapContainerRef} className="w-full h-full z-0 absolute inset-0" />

        {/* Top-Left Base Map Transparency Notice */}
        <div className="absolute top-3 left-3 z-10">
          <button
            onClick={() => setSourceNoticeOpen(!sourceNoticeOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-md border border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-900 cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            <span>MapTiler Base Layer</span>
            <Info className="w-3 h-3 text-slate-400" />
          </button>

          {sourceNoticeOpen && (
            <div className="mt-1.5 w-72 p-3 rounded-xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 text-xs space-y-1.5 text-slate-600 dark:text-slate-300 animate-in fade-in">
              <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                <span>MapTiler Geographic Basemap</span>
                <span className="text-[10px] text-emerald-600 font-bold">● ACTIVE</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                MapTiler is strictly used as the geographical basemap. Real road accessibility, risk scores, and closures are derived from meteorological observations and verified field officer reports.
              </p>
            </div>
          )}
        </div>

        {/* Floating Map Action Toolbar (Top Right) */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
          {/* Layer Panel Button & Dropdown */}
          {showLayerPanel && (
            <div className="relative">
              <button
                id="map-layers-toggle-btn"
                onClick={() => setLayerDropdownOpen(!layerDropdownOpen)}
                className="p-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-md border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                title="Toggle GIS Map Layers"
              >
                <Layers className="w-4 h-4" />
              </button>

              {layerDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-64 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 p-3 z-30 space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-1.5 text-xs font-bold text-slate-900 dark:text-white">
                    <span>GIS Layer Controls</span>
                    <button
                      onClick={() => setLayerDropdownOpen(false)}
                      className="text-slate-400 hover:text-slate-600 text-[10px]"
                    >
                      Close
                    </button>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <label className="flex items-center justify-between p-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded cursor-pointer">
                      <span className="text-slate-700 dark:text-slate-300 font-medium">Road Accessibility Network</span>
                      <input
                        type="checkbox"
                        checked={mapLayers.roadStatus}
                        onChange={() => toggleMapLayer('roadStatus')}
                        className="rounded text-emerald-600 focus:ring-emerald-500"
                      />
                    </label>

                    <label className="flex items-center justify-between p-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded cursor-pointer">
                      <span className="text-slate-700 dark:text-slate-300 font-medium">Field Incident Geotags</span>
                      <input
                        type="checkbox"
                        checked={mapLayers.incidents}
                        onChange={() => toggleMapLayer('incidents')}
                        className="rounded text-emerald-600 focus:ring-emerald-500"
                      />
                    </label>

                    <label className="flex items-center justify-between p-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded cursor-pointer">
                      <span className="text-slate-700 dark:text-slate-300 font-medium">
                        Vehicle Telemetry {demoMode ? '(SIM)' : '(Offline)'}
                      </span>
                      <input
                        type="checkbox"
                        checked={mapLayers.liveVehicles}
                        onChange={() => toggleMapLayer('liveVehicles')}
                        className="rounded text-emerald-600 focus:ring-emerald-500"
                      />
                    </label>

                    <label className="flex items-center justify-between p-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded cursor-pointer">
                      <span className="text-slate-700 dark:text-slate-300 font-medium">Hospitals & Logistics Hubs</span>
                      <input
                        type="checkbox"
                        checked={mapLayers.infrastructure}
                        onChange={() => toggleMapLayer('infrastructure')}
                        className="rounded text-emerald-600 focus:ring-emerald-500"
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Map Zoom Controls */}
          <div className="flex flex-col bg-white dark:bg-slate-900 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 overflow-hidden">
            <button
              onClick={handleZoomIn}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer border-b border-slate-200 dark:border-slate-800"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer border-b border-slate-200 dark:border-slate-800"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetView}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
              title="Fit North East Region"
            >
              <Crosshair className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Floating Road Status Model Legend (Bottom Left) */}
        <div className="absolute bottom-3 left-3 z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-xl p-3 shadow-lg border border-slate-200 dark:border-slate-800 text-xs flex flex-wrap items-center gap-3.5">
          <div className="font-bold text-[11px] text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-emerald-600" />
            <span>ROAD STATUS:</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#16a34a]" />
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Accessible</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#ea580c]" />
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">At Risk</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#dc2626] animate-pulse" />
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Blocked</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#64748b]" />
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Unknown</span>
          </div>
        </div>
      </div>
    </div>
  );
};
