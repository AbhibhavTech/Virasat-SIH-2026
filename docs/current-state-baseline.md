# Virasat — Pre-Rebuild Current State Baseline Snapshot

> **Phase 0.5 Deliverable**  
> **Document Status**: Immutable baseline record captured on **September 9, 2026** per Section XIII of the **Master Product & Engineering Blueprint (V2)**.  
> **Rule**: This document records the fixed starting point before Phase 1 architectural changes begin. It must never be retroactively rewritten to hide past issues; fixes will be tracked in subsequent phase status reports and milestone documents.

---

## 1. Automated Execution Baseline & Verbatim Outputs

### 1.1 Dependency Installation (`npm install`)
- **Status**: Completed with exit code `0`.
- **Packages**: 277 packages added, 278 packages audited.
- **Lockfile**: Created and committed `package-lock.json` (previously untracked in repository).
- **Warnings & Advisories**:
  ```text
  npm warn deprecated node-domexception@1.0.0: Use your platform's native DOMException instead
  3 moderate severity vulnerabilities
  ```

### 1.2 TypeScript Compilation / Lint (`npm run lint` -> `tsc --noEmit`)
- **Status**: Completed with exit code `0`.
- **Output**:
  ```text
  > virasat@1.0.0 lint
  > tsc --noEmit
  ```
  *(Zero compiler or type errors across frontend and backend TypeScript files)*.

### 1.3 Production Build (`npm run build`)
- **Command**: `vite build && esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs`
- **Status**: Completed with exit code `0`.
- **Verbatim Output**:
  ```text
  vite v6.4.3 building for production...
  transforming...
  ✓ 1916 modules transformed.
  rendering chunks...
  computing gzip size...
  dist/index.html                     1.70 kB │ gzip:   0.82 kB
  dist/assets/index-BcX5F2aC.css    141.67 kB │ gzip:  25.48 kB
  dist/assets/index-CSYGvvCZ.js   2,039.61 kB │ gzip: 397.85 kB

  (!) Some chunks are larger than 500 kB after minification. Consider:
  - Using dynamic import() to code-split the application
  - Use build.rollupOptions.output.manualChunks to improve chunking: https://rollupjs.org/configuration-options/#output-manualchunks
  - Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
  ✓ built in 15.82s

    dist\server.cjs      1.5mb
    dist\server.cjs.map  2.3mb

  Done in 80ms
  ```
- **Recorded Observations**:
  - Main client bundle `dist/assets/index-CSYGvvCZ.js` is **2,039.61 kB** (uncompressed) / 397.85 kB (gzip) due to bundled Leaflet, Three.js, and Lucide without route code-splitting.
  - Server bundle `dist/server.cjs` is **1.5 MB** due to bundled static routing engines and in-memory stores.

### 1.4 Test Suite Execution (`npm test`)
- **Status**: Failed with exit code `1` (Script missing).
- **Verbatim Output**:
  ```text
  npm error Missing script: "test"
  npm error
  npm error To see a list of scripts, run:
  npm error   npm run
  ```
- **Recorded Observation**: No test framework (Jest, Vitest, Pytest, Playwright) is currently installed or configured. No automated test files exist on disk despite earlier milestone claims. (Scheduled for resolution in Phase 7).

---

## 2. Frontend Navigation & Pages Inventory

The frontend is a single-page application (SPA) lacking URL-based routing (`react-router-dom` is not yet installed). Navigation is controlled via `useState<NavTab>` inside `src/App.tsx`. Refreshing any sub-view resets to the home tab; views are not shareable or bookmarkable.

### 2.1 Active NavTab Views (`src/components/layout/Sidebar.tsx` / `src/App.tsx`)

| # | NavTab Identifier | Component | Source Path | Description |
|---|---|---|---|---|
| 1 | `home` | `<HomePage />` | `src/pages/HomePage.tsx` | Landing hero, search bar, state scroll, featured heritage bento |
| 2 | `india` | `<IndiaHierarchyPage />` | `src/pages/IndiaHierarchyPage.tsx` | Master 28 states / 174 cities tree navigation |
| 3 | `dashboard` | `<CityHubPage />` | `src/pages/CityHubPage.tsx` | Selected city overview, key attractions, local weather & transit |
| 4 | `heritage` | `<HeritageSitesPage />` | `src/pages/HeritageSitesPage.tsx` | Filtered list of monuments and cultural heritage sites |
| 5 | `itinerary` | `<ItineraryPage />` | `src/pages/ItineraryPage.tsx` | Day circuit planner, topological stops, time/cost estimates |
| 6 | `map` | `<MapPage />` | `src/pages/MapPage.tsx` | Fullscreen Leaflet map with state bounds & attraction markers |
| 7 | `3d` | `<Heritage3DPage />` | `src/pages/Heritage3DPage.tsx` | Three.js 3D monument viewer (Gateway of India, CSMT, Hawa Mahal) |
| 8 | `ai` | `<AIAssistantPage />` | `src/pages/AIAssistantPage.tsx` | Conversational travel assistant with Gemini chat interface |
| 9 | `trips` | `<MyTripsPage />` | `src/pages/MyTripsPage.tsx` | Saved user itineraries (stored in memory/localStorage) |
| 10 | `favorites` | `<FavoritesPage />` | `src/pages/FavoritesPage.tsx` | Bookmarked heritage attractions |
| 11 | `profile` | `<ProfilePage />` | `src/pages/ProfilePage.tsx` | User profile details, travel style, and preferences |

### 2.2 Overlay Views (Conditional State in `App.tsx`)
- **Place Detail**: `<DestinationDetailPage />` (`src/pages/DestinationDetailPage.tsx`) — rendered when `selectedPlaceId !== null`.
- **Search Results**: `<SearchPage />` (`src/pages/SearchPage.tsx`) — rendered when `searchQuery !== null`.

### 2.3 Global Modals
- `<AuthModal />` (`src/components/auth/AuthModal.tsx`): Mock login and registration modal.
- `<OnboardingSurveyModal />` (`src/components/auth/OnboardingSurveyModal.tsx`): Post-registration travel style questionnaire.
- `<DatabaseStatusModal />` (`src/components/database/DatabaseStatusModal.tsx`): Overview of in-memory database records and image counts.

---

## 3. Backend API Routes Inventory (`server.ts`)

The backend is a single file (`server.ts`, ~3,834 lines) mounting ~60 Express route handlers against in-memory JavaScript `Map` and array data structures.

| # | HTTP Method | Endpoint Path | Source Line | Description / Security Status |
|---|---|---|---|---|
| 1 | `GET` | `/api/health`, `/health` | L516 | Returns `{ status: 'ok', app: 'Virasat' }` |
| 2 | `GET` | `/api/database/status` | L524 | In-memory counts of states, cities, places, images |
| 3 | `GET` | `/api/database/categories` | L529 | Distinct category list |
| 4 | `GET` | `/api/database/records` | L534 | Paginated raw database records |
| 5 | `GET` | `/api/database/images` | L548 | Paginated image catalog |
| 6 | `GET` | `/api/database/images/:entityId` | L586 | Image records for a given entity |
| 7 | `POST` | `/api/database/sync` | L602 | **CRITICAL SECURITY RISK**: Public unauthenticated write to database service |
| 8 | `GET` | `/api/database/schema-template` | L615 | Schema template JSON |
| 9 | `GET` | `/api/stats` | L633 | High-level site counts (monuments, cities, routes) |
| 10 | `GET` | `/api/heritage` | L658 | Heritage sites list |
| 11 | `GET` | `/api/heritage/:id` | L708 | Heritage site detail by ID |
| 12 | `GET` | `/api/mumbai-local/lines` | L724 | Mumbai local suburban lines |
| 13 | `GET` | `/api/mumbai-local/stations` | L731 | Mumbai suburban railway stations |
| 14 | `GET` | `/api/mumbai-local/route` | L754 | Point-to-point Mumbai suburban route calculation |
| 15 | `GET` | `/api/distance` | L868 | Haversine distance calculator |
| 16 | `GET` | `/api/states` | L913 | List of all states and UTs |
| 17 | `GET` | `/api/cities` | L917 | List of major cities |
| 18 | `GET` | `/api/destinations`, `/api/places` | L931 | Filterable list of tourist destinations |
| 19 | `GET` | `/api/places/nearby` | L970 | Nearby places by coordinates and radius |
| 20 | `GET` | `/api/destinations/:id`, `/api/places/:id` | L1005 | Single place detail record |
| 21 | `GET` | `/api/hotels/nearby` | L1121 | Hotels near location |
| 22 | `GET` | `/api/fares/tariffs` | L1147 | Regulated meter tariff rates |
| 23 | `GET` | `/api/culture` | L1154 | Regional crafts and cultural facts |
| 24 | `GET` | `/api/artisans` | L1171 | Local artisans directory |
| 25 | `GET` | `/api/providers` | L1187 | Verified service providers (guides/drivers) |
| 26 | `GET` | `/api/facilities` | L1212 | Tourism facilities catalog |
| 27 | `GET` | `/api/facilities/nearby` | L1233 | Facilities near coordinate |
| 28 | `GET` | `/api/accessibility` | L1249 | Accessibility details by place |
| 29 | `GET` | `/api/clusters` | L1274 | Tourism thematic clusters |
| 30 | `GET` | `/api/suburban-networks` | L1286 | Suburban rail transit networks |
| 31 | `GET` | `/api/destination-health` | L1301 | Destination status & health metrics |
| 32 | `GET` | `/api/reports` | L1330 | Citizen condition reports |
| 33 | `POST` | `/api/reports` | L1352 | Submit citizen condition report |
| 34 | `PATCH` | `/api/reports/:id/status` | L1387 | **HIGH SECURITY RISK**: Unauthenticated report status mutation |
| 35 | `GET` | `/api/search` | L1416 | Search across places, cities, and states |
| 36 | `GET` | `/api/locations/suggest` | L1456 | Search autocomplete suggestions |
| 37 | `GET` | `/api/railway-stations` | L1618 | Railway station catalogue |
| 38 | `GET` | `/api/railway-stations/nearby` | L1647 | Railway stations near coordinate |
| 39 | `GET` | `/api/routes` | L2102 | Multimodal route calculations (IR rail, highway, bus) |
| 40 | `GET` | `/api/maps/directions` | L2422 | Turn-by-turn directions wrapper |
| 41 | `GET` | `/api/weather` | L2444 | Weather retrieval endpoint |
| 42 | `POST` | `/api/geo/reverse-geocode` | L2476 | Reverse geocoding via public Nominatim |
| 43 | `POST` | `/api/ai/chat`, `/api/assistant/chat` | L2809 | Gemini AI assistant conversational endpoint |
| 44 | `GET` | `/api/itinerary/cities` | L3504 | Pre-baked itinerary cities |
| 45 | `POST` | `/api/itinerary`, `/api/itineraries/generate` | L3511 | Generate day circuit itinerary |
| 46 | `GET` | `/api/india-hierarchy` | L3595 | Complete 28 states / 174 cities tree |
| 47 | `GET` | `/api/india-hierarchy/states` | L3603 | States list with city counts |
| 48 | `GET` | `/api/india-hierarchy/state/:stateId` | L3622 | State detail with embedded cities |
| 49 | `GET` | `/api/india-hierarchy/city/:cityId` | L3634 | City detail with embedded attractions |
| 50 | `POST` | `/api/auth/register` | L3652 | **MOCK AUTH**: Mints in-memory `virasat-token-*` |
| 51 | `POST` | `/api/auth/login` | L3666 | **MOCK AUTH**: Accepts any email, mints token |
| 52 | `GET` | `/api/profile` | L3680 | Retrieves user profile from in-memory map |
| 53 | `PUT` | `/api/profile` | L3693 | Updates user profile in-memory |
| 54 | `POST` | `/api/profile/survey` | L3702 | Saves survey preferences to in-memory profile |
| 55 | `GET` | `/api/favorites` | L3714 | Retrieves favorites from in-memory map |
| 56 | `POST` | `/api/favorites` | L3734 | Adds favorite to in-memory map |
| 57 | `DELETE` | `/api/favorites/:id` | L3753 | Removes favorite from in-memory map |
| 58 | `GET` | `/api/trips` | L3767 | Retrieves trips from in-memory map |
| 59 | `POST` | `/api/trips` | L3785 | Adds trip to in-memory map |
| 60 | `DELETE` | `/api/trips/:id` | L3798 | Deletes trip from in-memory map |

---

## 4. Master Data Files Inventory (`data/`)

32 files total (21 root-level data files + 11 regional/monument datasets).

| File Path | Size (Bytes) | Category / Description |
|---|---|---|
| `data/india_tourism_database.json` | 1,268,348 | Master database (28 states, 174 cities, 172 attractions) — UNVERIFIED |
| `data/india_tourism.json` | 111,320 | Curated destinations with summaries and fees |
| `data/tourism_images.json` | 308,323 | Image registry mapping destinations to Unsplash stock URLs |
| `data/tourism_image_record.schema.json` | 2,099 | JSON Schema for tourism image records |
| `data/tourism_image_source_registry.json` | 1,869 | Companion registry for image attribution |
| `data/states.json` | 16,319 | 28 States & 8 UTs with geographic centers and capitals |
| `data/cities.json` | 6,130 | Major metropolitan and tourism cities |
| `data/railway_stations.json` | 20,684 | Railway junctions and stations (Contains known duplicate IDs) |
| `data/reports.json` | 4,524 | Sample citizen condition reports |
| `data/mumbai_local_network.json` | 21,721 | Mumbai suburban railway lines, stations, and interchange hubs |
| `data/suburban_networks.json` | 5,383 | Suburban rail networks for Delhi, Kolkata, Chennai |
| `data/accessibility.json` | 5,723 | Wheelchair, ramp, and tactile guide accessibility flags |
| `data/artisans.json` | 6,231 | Directory of traditional craft artisans |
| `data/providers.json` | 6,129 | Local tourism guides and verified transport operators |
| `data/culture.json` | 7,127 | Regional traditional crafts, dance forms, and cuisine |
| `data/facilities.json` | 3,572 | Restrooms, drinking water, EV charging, and medical points |
| `data/fares.json` | 1,456 | Metered auto/taxi tariff schedules |
| `data/hotels.json` | 10,309 | Sample accommodation listings |
| `data/clusters.json` | 6,038 | Thematic heritage circuits |
| `data/destination_health.json` | 8,771 | Crowd, air quality, and maintenance indicators |
| `data/.gitkeep` | 29 | Git placeholder |
| `data/heritage/monuments.json` | 126,819 | High-fidelity monument descriptions for 3D visualizations |
| `data/mumbai/places.json` | 26,838 | Detailed Mumbai landmark records |
| `data/delhi/places.json` | 2,657 | Delhi historical monuments |
| `data/rajasthan/places.json` | 10,252 | Jaipur, Udaipur, and desert fort records |
| `data/maharashtra/places.json` | 15,380 | Maharashtra cave temples and forts |
| `data/kerala/places.json` | 1,788 | Kerala backwaters and temples |
| `data/bihar/places.json` | 5,290 | Nalanda, Bodh Gaya, and ancient sites |
| `data/goa/places.json` | 8,979 | Goa churches and coastal heritage |
| `data/ladakh/places.json` | 11,943 | Ladakh monasteries and high-altitude passes |
| `data/jammu-kashmir/places.json` | 17,159 | Kashmir gardens and temples |
| `data/kolkata/places.json` | 2,480 | Kolkata colonial and cultural landmarks |

---

## 5. Environment Variables Inventory

| Variable Name | Defined / Read In | Purpose | Current Handling |
|---|---|---|---|
| `GEMINI_API_KEY` | `server.ts:499, 502` | Authentication for Google Gemini generative AI API | Read server-side from `process.env`. If missing, `getAIClient()` returns `null` |
| `NODE_ENV` | `server.ts:3813` | Determines runtime mode (`production` vs `development`) | If not `'production'`, initializes Vite dev middleware; else serves `dist/` |
| `PORT` | `server.ts:24` | Express server port | Hardcoded as `const PORT = 3000;` (does not currently read `process.env.PORT`) |

---

## 6. Major Services & Modules Inventory

### 6.1 Backend & Routing Logic (`src/server/`)
- **`railwayRoutingEngine.ts`** (~688 lines):
  - Track-aligned Indian Railways corridor routing (IR Trunk Geometry).
  - Inter-station distance algorithms and travel time models.
  - Class-based fare computation (Sleeper, 3AC, 2AC, 1AC, Vande Bharat Executive).
- **`transportResolver.ts`** (~660 lines):
  - Multimodal corridor routing combining rail, national highway drives, intercity buses, and local feeder connections.
  - Metro and suburban network resolvers for Mumbai, Delhi, Kolkata, Chennai.
- **`masterTourismDataService.ts`** (~620 lines):
  - In-memory aggregation and search indexing for states, cities, and attractions.

### 6.2 Client Services (`src/services/`)
- **`api.ts`** (~838 lines):
  - Central client API wrapper using `fetch()`.
  - Attaches `Authorization: Bearer <token>` from `safeLocalStorage`.
  - Contains silent fallbacks to fake data on network failures (Risk #16, to be fixed).

### 6.3 Context Providers (`src/contexts/`)
- **`AuthContext.tsx`** (~102 lines):
  - Manages authentication state in `localStorage` under `virasat_token`.
  - Triggers `<AuthModal>` and `<OnboardingSurveyModal>`.
- **`FavoritesContext.tsx`** (~80 lines):
  - In-memory bookmark store synchronized with `/api/favorites`.

---

## 7. Known Architectural Debt & Audit Findings (Reference Baseline)

These issues are captured as confirmed baseline facts to be methodically addressed in subsequent phases per the Risk Register (Section IV of Blueprint V2):
1. **No Database Persistence**: All user accounts, saved trips, favorites, and profile updates exist only in memory in `server.ts`. Any server restart wipes all state.
2. **Mock Authentication**: `/api/auth/register` and `/api/auth/login` accept any email/password without hashing, verification, or session expiration.
3. **No URL-Based Routing**: Frontend views are entirely governed by React tab state (`useState<NavTab>`), preventing deep-linking, bookmarking, and back-button functionality.
4. **Unauthenticated Mutating Endpoints**:
   - `POST /api/database/sync` allows anyone to overwrite or inject database records.
   - `PATCH /api/reports/:id/status` allows anyone to modify the status of citizen condition reports.
5. **Silent Fake Fallbacks in Client API**: Several functions in `src/services/api.ts` return fabricated mock data when upstream requests fail rather than propagating true error states.
6. **Duplicate Station IDs**: Collisions in `data/railway_stations.json` (`chennai-central`, `secunderabad-jn`, `madgaon-jn`, `puri-stn`, `bhopal-jn`).
7. **Unverified Heritage Data**: Core attractions catalog carries an embedded `accuracy_disclaimer` admitting timings and fees are unverified.
8. **Unbundled 2 MB Client Bundle**: Vite bundle is 2.04 MB without dynamic imports or code-splitting.
9. **Zero Automated Tests**: No unit, integration, or E2E tests exist on disk.
