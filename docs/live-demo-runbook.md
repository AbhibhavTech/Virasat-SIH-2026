# Virasat (SIH 2026) — Live Presentation & Demo Runbook

> **Duration**: 5 Minutes  
> **Target Audience**: SIH Jury Panel, Ministry Evaluators & Technical Judges  
> **Prerequisites**: Server running locally (`npm start` or `npm run dev`) at `http://localhost:3000`.

---

## Demo Timeline Overview

```
[0:00 - 0:45] ── Act 1: The Vision & Regional Living Heritage Discovery
[0:45 - 1:45] ── Act 2: Monument Depth, Field-Level Provenance & 3D Architecture
[1:45 - 2:45] ── Act 3: Multimodal Public Transit Routing & Regulated Fares
[2:45 - 3:45] ── Act 4: Grounded AI Concierge & Real-Time Telemetry
[3:45 - 4:30] ── Act 5: Citizen Stewardship & Real-Time Destination Health Decay
[4:30 - 5:00] ── Act 6: Evaluator Telemetry Dashboard & Cloud Architecture
```

---

## Detailed Step-by-Step Runbook

### Act 1: The Vision & Regional Living Heritage (0:00 - 0:45)
- **Action**: Open browser to `http://localhost:3000`. Show brand splash screen loading into the home portal.
- **Talking Points**:
  - *"Honorable judges, India's heritage is immense, but digital tourism tools today are fragmented and prone to commercial bias. Virasat is India's first grounded cultural intelligence platform."*
  - Point to the **Tricolour Heritage Header** and the **Explore by State / City** selector.
  - Switch the regional filter from "All India" to **"Jaipur, Rajasthan"** or **"Mumbai, Maharashtra"**.
  - Show how destinations dynamically filter into curated historical clusters.

### Act 2: Monument Depth, Provenance Badges & 3D Explorer (0:45 - 1:45)
- **Action**: Click on **"Hawa Mahal"** or **"Gateway of India"**.
- **Talking Points**:
  - *"Notice our fundamental engineering rule: Zero Hallucination. Every single fact, ticket price, and timing carries a checkable Tier-1 provenance badge."*
  - Hover over the **ASI / UNESCO Provenance Badge** showing official citation metadata.
  - Click **"Launch 3D Monument Explorer"**.
  - Interact with the 3D model: rotate, zoom, toggle **Wireframe Mode**, and change daytime lighting presets.
  - Highlight: *"This is rendered in real-time Three.js geometry without relying on heavy external proprietary assets, making it accessible on standard mobile 4G connections."*

### Act 3: Multimodal Public Transit & Regulated Fares (1:45 - 2:45)
- **Action**: Scroll to the **Journey Planner & Fare Estimator** on the monument detail page.
- **Talking Points**:
  - *"Travelers in India often struggle with last-mile transit and unfair pricing. Virasat integrates India's actual public transit network."*
  - Select origin: e.g. **"CSMT Railway Terminus"** to **"Gateway of India"** (or Jaipur Railway Station to Amber Fort).
  - Switch between transit modes: **DRIVE**, **TRAIN / METRO**, and **WALK**.
  - Show the detailed route breakdown:
    - Distance in kilometers (geodesic & network).
    - Regulated auto/taxi meter estimates calculated against official government fare tables.
    - Public bus and rail options with interchange stops.

### Act 4: Grounded AI Concierge with Telemetry (2:45 - 3:45)
- **Action**: Click on **"AI Concierge"** tab in top navigation.
- **Talking Points**:
  - *"Most AI tourism chatbots invent places that don't exist. Virasat's AI Concierge is strictly grounded against our verified relational database."*
  - Ask a question: *"Plan a 2-day cultural heritage itinerary for Jaipur focusing on Rajput architecture and local handicrafts."*
  - Show the response generated with:
    - **Grounding Compliance Badge: 100% Grounded**.
    - Model fallback telemetry badge (`gemini-2.5-flash` / deterministic engine).
    - Response latency (ms).
    - Real structured destinations with direct clickable deep-links into the itinerary planner.

### Act 5: Citizen Stewardship & Destination Health Scoring (3:45 - 4:30)
- **Action**: Click **"Report Conservation Issue"** on a destination page or navigate to `/stewardship`.
- **Talking Points**:
  - *"Tourism must protect heritage, not destroy it. Virasat features Citizen Stewardship with real-time destination health feedback."*
  - Fill out a report: Category: **Cleanliness / Physical Damage**, Severity: **High**, description: *"Minor littering near east courtyard"*.
  - Submit the report:
    - Observe the monument's **Health Score decay** immediately (e.g. from 95 to 88).
    - Show the audit log entry recorded in the backend.
  - Switch to administrative role / resolve the report:
    - Health score immediately recalculates back to 100%.

### Act 6: Evaluator Telemetry Dashboard & Architecture (4:30 - 5:00)
- **Action**: Click **"More" → "Evaluation Telemetry (SIH 2026)"** in the top navbar.
- **Talking Points**:
  - *"For the SIH evaluation, we provide full transparency through our built-in live telemetry dashboard."*
  - Show:
    - Total Verified Destinations.
    - AI Grounding Compliance Rate (**100%**).
    - Multimodal Routes Computed.
    - Top Searched Keywords.
  - Click **"More" → "Database Architecture"** to reveal the 11 normalized database tables.
  - Conclude: *"Virasat is fully containerized with Docker, verified by over 300 automated assertions, and ready for deployment with state tourism boards across the nation. Thank you!"*

---

## Quick Reference / Backup Scenarios

| Scenario | Immediate Action |
|---|---|
| Offline or No Internet during demo | Virasat runs 100% locally; deterministic grounded engine handles AI requests seamlessly. |
| Resetting test data | Run `npm test` or restart the server process to reload clean seed catalogs. |
| Showing technical rigor to judge | Open terminal and show `npm test` running 13 test suites with 100% passing tests. |
