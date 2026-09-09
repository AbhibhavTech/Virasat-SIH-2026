# Smart India Hackathon (SIH) 2026 — Project Roadmap & Milestones

This document tracks the engineering and product progress of **Virasat**, aligned with the **VIRASAT — Master Product & Engineering Blueprint (V2)**.

---

## 1. Initial Hackathon Prototype Status Audit (Current State)

### Milestone 1: Foundations & Architecture
- [ ] Real persistent database (PostgreSQL / Supabase) *(In progress — Phase 1)*
- [ ] Real user authentication and secure session handling *(In progress — Phase 1)*
- [x] Initial Express in-memory API prototype with JSON datasets
- [x] Baseline API contracts and schema documentation (`docs/api-contract.md`)
- [ ] Verified heritage datasets across all regions *(Pending audit — Phase 2)*

### Milestone 2: Geospatial & Multimodal Routing
- [x] Interactive Leaflet geospatial map with state boundaries and destination markers
- [x] Multimodal route calculator (Walking, Metro, Suburban Rail, Highway, Bus)
- [x] Regulated meter fare estimators and distance benchmarks

### Milestone 3: AI Tourism Assistant & Personalization
- [x] Gemini LLM integration with custom heritage and grounding prompts
- [x] Contextual conversational memory and suggestions
- [x] Onboarding survey modal for user travel style, pace, and interests
- [ ] Structured JSON tool-calling and verified itinerary generation *(Phase 3)*

### Milestone 4: 3D Heritage & Virtual Exploration
- [x] Interactive Three.js 3D monument viewer (Gateway of India, CSMT, Hawa Mahal)
- [x] Orbit controls, wireframe modes, and daytime lighting presets
- [x] Audio-visual narration modal with cultural backgrounds

### Milestone 5: Testing, Hardening & Final Evaluation
- [ ] Unit tests for backend routers and services *(Phase 7)*
- [ ] Automated test suites for multimodal routing and fare logic *(Phase 7)*
- [ ] Production CI/CD and containerized deployment *(Phase 8)*

---

## 2. Blueprint V2 Phased Build Program

| Phase | Phase Name | Focus Area | Status |
|---|---|---|---|
| **Phase 0** | **Truth & Hygiene** | Documentation honesty, naming consistency, unmarking false claims | **COMPLETED** |
| **Phase 0.5** | **Baseline Snapshot** | Capture pre-migration build/lint/test baseline in `docs/current-state-baseline.md` | **COMPLETED** |
| **Phase 1** | **Backend Foundations** | Real PostgreSQL database, real auth, URL routing (`react-router-dom`), TanStack Query | **COMPLETED** |
| **Phase 2** | **Data Audit & Provenance** | Field-level provenance, verify curated 6–8 flagship states, replace generic stock photos | PENDING |
| **Phase 3** | **Core Features** | Persistent itineraries, multimodal routing on DB, grounded AI with structured output | PENDING |
| **Phase 3B**| **Stewardship & Roles** | Citizen heritage reporting, role-based access control, audit logging, destination health | PENDING |
| **Phase 4** | **Google Login** | Google OAuth integration, account merging, persistent profile state | PENDING |
| **Phase 5** | **AI Hardening** | Verify live Gemini models against current docs, grounding audit logging, hallucination checks | PENDING |
| **Phase 6** | **Design System & A11y** | Shared UI primitives, WCAG AA compliance, responsive mobile audit, 3D accuracy | PENDING |
| **Phase 7** | **Automated & Security Tests**| Unit tests, integration tests, E2E journey tests (Playwright), security/injection tests | PENDING |
| **Phase 8** | **Observability & Deployment** | Containerization, CI/CD pipeline, Sentry error logging, CORS/rate limit hardening | PENDING |
| **Phase 9** | **SEO & Analytics** | Meta tags, OpenGraph, sitemap.xml, performance budgets, analytics event dashboard | PENDING |
| **Phase 10**| **SIH Packaging & Demo** | Pitch deck, live demo script, acceptance matrix verification, production readiness | PENDING |

---

## 3. Long-Term Horizon (MVP vs V2 vs V3)

### MVP (SIH Submission / First Real Launch)
- Real auth (Email/password + Google OAuth) & persistent user profiles
- Fully verified dataset for 6–8 flagship regions with field-level provenance badges
- Interactive India map & multimodal routing engine
- AI concierge grounded strictly in verified DB with structured itinerary output
- 3D monument viewer for flagship landmarks
- Fully honest documentation, CI testing, and production deployment

### V2 (Post-Hackathon)
- Expansion to all 28 states & 8 UTs at full verified depth
- Offline-capable GPS-triggered audio walking tours
- Local guide / artisan directory and inquiry flow
- User-contributed corrections and community reports with moderation queue
- Multilingual support (Hindi + English initial)

### V3 (Scale & Commercialization)
- Certified local guide/artisan booking marketplace
- B2G licensing / embeddable widgets for State Tourism Boards & ASI
- "Virasat Plus" premium subscription tier (unlimited AI planning, offline guides)
