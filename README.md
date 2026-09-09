# Virasat (SIH 2026)

> **Virasat** is an intelligent, map-driven Indian heritage and cultural discovery platform built for the **Smart India Hackathon (SIH) 2026** (Theme: *Tourism / Heritage & Culture*).

Virasat connects travelers to India's living heritage through interactive geospatial maps, multimodal transit guidance (railway, metro, bus), curated cultural archives, 3D monument experiences, and an AI-powered travel concierge.

---

## ⚠️ Repository Architecture & Current State Status

> [!NOTE]
> This repository is currently an **SIH prototype codebase** undergoing active transformation under the **Virasat Master Product & Engineering Blueprint (V2)**.
> All architectural documentation distinguishes between **CURRENT** (existing implementation) and **TARGET** (planned production architecture).

### Current Reality (As of Phase 0)
- **Frontend**: Single-Page Application built with **React 18**, **TypeScript**, **Vite**, and styled with **Tailwind CSS**. Includes interactive map exploration (**Leaflet**) and 3D heritage previews (**Three.js**).
- **Backend / API**: Single Express server (`server.ts`) providing ~55 REST endpoints with in-memory JavaScript data structures seeded at boot from static JSON files in `data/`.
- **Data Layer**: Static JSON files in `data/` covering 28 states, 174 cities, and 172 curated attractions. (Verification and database migration planned in Phases 1 & 2).
- **AI Assistant**: Conversational heritage concierge powered by Google Gemini (`@google/genai`) running server-side with strict grounding guidelines against inventing railway stations or transit routes.
- **Persistence & Auth**: Currently in-memory mock authentication and session tokens (`virasat-token-*`). Migration to persistent PostgreSQL database and authenticated sessions is scheduled for **Phase 1**.

---

## 🏛️ Core Features

1. **Heritage & Destination Discovery**: Explore states, cities, and monuments with historical summaries, entry fees, and cultural facts.
2. **Interactive Geospatial Map**: Leaflet-based interactive map of India with regional destination markers, state boundaries, and spatial filters.
3. **Multimodal Transit Engine**: Track-aligned railway corridors, suburban local rail, intercity bus, and metered transit fare estimations (`transportResolver.ts`, `railwayRoutingEngine.ts`).
4. **AI Tourism Concierge**: Conversational assistant powered by Gemini for custom heritage queries, route assistance, and cultural context.
5. **3D Heritage Monuments**: Interactive Three.js 3D monument visualizations (Gateway of India, CSMT, Hawa Mahal) with orbital camera controls and lighting modes.
6. **Cultural Guides**: Visual guide personas providing regional cultural insights, traditional crafts, and heritage context.

---

## 📁 Repository Structure

```text
virasat/
├── data/                 # Master JSON datasets (states, cities, attractions, transit, culture)
├── docs/                 # Project documentation, contracts, and roadmap
│   ├── api/              # API specifications
│   ├── architecture/     # System design and architecture specs (labeled TARGET)
│   ├── datasets/         # Data dictionaries and schemas
│   ├── deployment/       # Container and hosting documentation (labeled TARGET)
│   ├── roadmap/          # SIH 2026 milestone tracking & blueprint phases
│   ├── team/             # Team structure and contribution guide
│   ├── api-contract.md   # Baseline REST endpoint contract (TARGET)
│   ├── architecture.md   # Architecture overview (TARGET)
│   ├── development-guide.md # Git branching and collaboration guide
│   └── README.md         # Central documentation index
├── scripts/              # Utilities for image aggregation and dataset generation
├── src/                  # React 18 frontend source code
│   ├── assets/           # Static icons and assets
│   ├── components/       # UI components (map, 3d, auth, destination, home, etc.)
│   ├── contexts/         # React Context providers (AuthContext, etc.)
│   ├── data/             # Frontend-embedded data and state definitions
│   ├── pages/            # Page-level tab views
│   ├── server/           # Routing engines and data service logic
│   ├── services/         # Client API service handlers
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Helper utilities and storage wrappers
│   ├── App.tsx           # Main application shell
│   ├── main.tsx          # Application entry point
│   └── index.css         # Global Tailwind and custom animation styles
├── index.html            # Web application entry HTML
├── metadata.json         # Project metadata specification
├── package.json          # Node.js project manifest & dependencies
├── postcss.config.js     # PostCSS configuration
├── server.ts             # Express server (API endpoints + in-memory store)
├── tailwind.config.js    # Tailwind CSS design system configuration
├── tsconfig.json         # TypeScript configuration
├── tsconfig.node.json    # TypeScript configuration for Node environment
└── vite.config.ts        # Vite bundler configuration
```

---

## 🛠️ Tech Stack & Dependencies

| Layer | Technologies |
|---|---|
| **Frontend UI** | React 18, TypeScript, Tailwind CSS, Lucide Icons, clsx, tailwind-merge |
| **Mapping & 3D** | Leaflet, Three.js |
| **Backend** | Node.js, Express 4, TypeScript, tsx, esbuild |
| **AI Integration** | Google Gemini API via `@google/genai` (server-side orchestration) |
| **Bundling** | Vite 6 |

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher)
- Google Gemini API Key (optional, for AI Assistant features)

### 1. Installation
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory:
```env
PORT=3000
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Running Development Server
Starts the Express API server and Vite frontend concurrently:
```bash
npm run dev
```
Open your browser at `http://localhost:3000`.

### 4. Building for Production
```bash
npm run build
npm start
```

---

## 📖 Blueprint & Documentation Index

For detailed specifications, consult the documents in [`docs/`](file:///docs/README.md):
- **[SIH 2026 Milestones](file:///docs/roadmap/sih-2026-milestones.md)**: Current roadmap tracking based on the Master Blueprint V2.
- **[Target API Contract](file:///docs/api-contract.md)**: Specification of planned REST endpoints (TARGET).
- **[Target Architecture](file:///docs/architecture.md)**: Multi-tier architectural design (TARGET).
- **[Development Guide](file:///docs/development-guide.md)**: Collaboration and Git conventions.