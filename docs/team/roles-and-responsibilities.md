# Team Structure & Domain Responsibilities

## SIH 2026 Team Virasat

| Member | Primary Domain | Target Working Directory | Key Deliverables |
|---|---|---|---|
| **Member 1** | System Architecture & Integration | `server.ts`, `/server/src/`, deployment | Express gateway, Supabase/DB, CORS, contracts |
| **Member 2** | Frontend & UI/UX Design | `src/components/`, `src/pages/` | React UI, design system, responsive navigation |
| **Member 3** | Interactive India Map & Geospatial | `src/components/map/` | Leaflet map, geocoordinates, custom pins, filters |
| **Member 4** | AI Tourism Assistant | `src/server/`, AI modules | Gemini orchestration, prompts, grounding, tool calling |
| **Member 5** | 3D Heritage & Visual Navigation | `src/components/threed/` | Three.js monument models, orbital cameras, lighting |
| **Member 6** | Tourism Research, Content & Datasets | `data/`, `docs/datasets/` | Verified heritage facts, timings, fees, railways |

## Branching & Code Review Policy
- Feature work is confined to `feature/<domain-name>`.
- Merges are reviewed before landing on `develop`.
- Stable release snapshots are merged from `develop` into `main`.
