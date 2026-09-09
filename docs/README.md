# Virasat — Comprehensive Project Documentation

Welcome to the central documentation index for **Virasat (SIH 2026)**.

---

## ⚠️ Documentation Status Notice
All architectural and API design documents are labeled to distinguish between:
- **CURRENT**: The actual running state in code (React SPA + Express `server.ts` with in-memory state).
- **TARGET**: Target architecture specified in the **Master Product & Engineering Blueprint (V2)**, to be implemented across Phases 1–8.

---

## Documentation Index

1. **[Architecture](architecture/system-design.md)** `[TARGET]`
   - Multi-tier full-stack architecture, modular services, data flows, and state management.
   - Core file: [architecture.md](../architecture.md) `[TARGET]`
2. **[Roadmap & Milestones](roadmap/sih-2026-milestones.md)** `[CURRENT & ROADMAP]`
   - Hackathon prototype status, Blueprint V2 11-phase program, and MVP/V2/V3 horizon.
3. **[API Specifications](api/endpoints-spec.md)** `[TARGET]`
   - RESTful API contracts, payload schemas, request/response formats.
   - Core file: [api-contract.md](../api-contract.md) `[TARGET]`
4. **[Datasets & Provenance](datasets/sources-and-schema.md)** `[CURRENT & PROVENANCE SPEC]`
   - Data dictionary, schemas for Indian states, heritage monuments, transit hubs, and verification tiers.
5. **[Team & Domain Ownership](team/roles-and-responsibilities.md)** `[CURRENT]`
   - Team roles, Git branching rules, and PR protocols.
   - Core file: [development-guide.md](../development-guide.md) `[CURRENT]`
6. **[Deployment & DevOps](deployment/container-and-cloudrun.md)** `[TARGET]`
   - Containerization, Cloud Run / hosting guides, environment variables, and production builds.
