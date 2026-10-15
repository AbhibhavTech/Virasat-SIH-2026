# System Design & Architecture (Target Specification)

> [!IMPORTANT]
> **TARGET ARCHITECTURE — NOT YET IMPLEMENTED**  
> This document specifies the planned target architecture for **Virasat** per Section XII of the **Master Product & Engineering Blueprint (V2)**.

---

## Overview
Virasat adopts a modular full-stack architecture tailored for high performance, geospatial querying, verified multimodal transit assistance, and interactive 3D web graphics.

```text
┌────────────────────────────────────────────────────────┐
│                   React SPA Frontend                   │
│   (Vite, Tailwind, React Router, TanStack Query)       │
└───────────────────────────┬────────────────────────────┘
                            │ REST / JSON (HTTP/1.1 & 2)
                            ▼
┌────────────────────────────────────────────────────────┐
│               Modular Express API Gateway              │
│       (/api/v1/*, Zod validation, Auth Middleware)     │
└───────┬───────────────────┬────────────────────┬───────┘
        │                   │                    │
        ▼                   ▼                    ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  AI Concierge│    │  PostgreSQL  │    │   Multimodal │
│ Orchestrator │    │  (Supabase)  │    │   Transit    │
│ Local Astra  │    │  Persistence │    │   Routing    │
└──────────────┘    └──────────────┘    └──────────────┘
```

## Key Architectural Principles
1. **Separation of Concerns**: Clean separation between frontend components, modular backend services (`/server/src/modules/*`), and the PostgreSQL data layer.
2. **Deterministic Routing**: Track-aligned railway algorithms, suburban local networks, and regulated meter fare estimators backed by verified transit nodes.
3. **Strict AI Grounding**: Virasat AI Astra resolves supported questions against local records and registered tools. It does not claim open-domain model coverage or live web access.
4. **Lightweight 3D Rendering**: Parametric and GLTF heritage models rendered via Three.js with lazy-loading and mobile performance optimization.
