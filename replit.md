# Northeast Road Intelligence

GIS-style logistics operations dashboard for monitoring road access, incidents, weather risk, and essential-cargo routes across North Eastern India.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/northeast-road-intelligence/src/App.tsx` — map-first dashboard, demo intelligence data, live geocoding, and route interactions
- `artifacts/northeast-road-intelligence/src/index.css` — application theme and shared utility styles
- `attached_assets/Pasted-IMPORTANT-MAP-REQUIREMENT-Do-NOT-create-a-fake-illustra_1787934126645.txt` — original map requirements
- `artifacts/api-server` — shared API service scaffold; the current prototype keeps its intelligence data local

## Architecture decisions

- The basemap uses Leaflet with OpenStreetMap tiles so the app shows real geography, roads, pan, and zoom rather than a fabricated illustration.
- Prototype road conditions, incidents, weather, logistics, and risk analysis are local DEMO DATA and are visually labeled as such.
- Search and district boundary lookup use OpenStreetMap Nominatim; route geometry uses OSRM and is requested only when a cargo route is calculated.
- The dashboard stays map-first with a compact overlay control surface so intelligence panels do not obscure the operating area.

## Product

The dashboard covers Assam, Arunachal Pradesh, Meghalaya, Manipur, Mizoram, Nagaland, Tripura, and Sikkim. Users can select states and districts, inspect road intelligence, toggle road/weather/incident/logistics layers, search places, review markers, and compare current versus AI-recommended cargo routes.

## User preferences

The map must be real and interactive; never substitute an illustrated, SVG, schematic, or fictional map.

## Gotchas

- Vite requires `PORT` and `BASE_PATH` from the managed workflow; direct production builds need both values supplied.
- Nominatim and OSRM are public prototype services; production deployment should move these calls behind a server-side data layer with provider policy, quotas, caching, and monitoring.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
