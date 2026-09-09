# Tourism Datasets, Schemas & Provenance Standards

> [!NOTE]
> Per Section XI of the **Master Product & Engineering Blueprint (V2)**, all data in the prototype is treated as `UNVERIFIED` until audited against checkable official archives in Phase 2.

## Dataset Catalogue
- `data/india_tourism_database.json`: Master JSON catalog covering 28 states, 174 cities, and 172 curated attractions (currently unverified baseline).
- `data/states.json`: List of 28 Indian States and 8 Union Territories with capitals, regions, and representative coordinates.
- `data/cities.json`: Major metropolitan hubs, tier-2 tourism centers, and connectivity hubs.
- `data/india_tourism.json`: Curated destinations across India with historical summaries, entry fees, and categories.
- `data/railway_stations.json`: Suburban railway and inter-city terminals with railway lines and GPS coordinates.
- `data/heritage/monuments.json`: Historical metadata for 3D monument visualizations.
- Regional datasets: `data/mumbai/places.json`, `data/delhi/places.json`, `data/rajasthan/places.json`, `data/kerala/places.json`, `data/maharashtra/places.json`, `data/bihar/places.json`, `data/goa/places.json`, `data/ladakh/places.json`, `data/jammu-kashmir/places.json`, `data/kolkata/places.json`.

## Field-Level Provenance Standards (Phase 2 Target)
Every factual claim (construction dates, entry fees, timings, historical facts) carries a 7-state provenance enum:
1. `OFFICIAL`: Sourced directly from ASI or State Tourism Departments (Tier 1).
2. `TRUSTED_THIRD_PARTY`: Corroborated via UNESCO, Sahapedia, or cross-checked Wikipedia (Tier 2).
3. `COMMUNITY_REPORTED`: User-submitted, pending editorial review (Tier 4).
4. `MODELLED`: Computed algorithmically (e.g. fare estimates).
5. `ESTIMATED`: Bounded approximations where exact data is unavailable.
6. `STALE`: Previously verified but past its freshness window.
7. `UNVERIFIED`: Default initial state for all legacy/unvetted data.
