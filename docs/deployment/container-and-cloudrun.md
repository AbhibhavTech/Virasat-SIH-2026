# Deployment & DevOps Guide (Target Specification)

> [!IMPORTANT]
> **TARGET DEPLOYMENT SPECIFICATION — NOT YET IMPLEMENTED**  
> This document specifies the planned target deployment setup for **Virasat** per Phase 8 of the **Master Product & Engineering Blueprint (V2)**.  
> Currently (Phase 0), the application runs locally via `npm run dev` (`tsx server.ts`). Production containerization and CI/CD will be implemented in Phase 8.

---

## Target Container Architecture
Virasat will run as a containerized web service suitable for deployment on Google Cloud Run, Render, or Fly.io:
- **Port**: Ingress traffic routed through port 3000 (or `PORT` environment variable).
- **Frontend Assets**: React SPA compiled with `vite build` into static assets.
- **Backend Service**: Modular Express server compiled into `dist/` or executed via Node container runtime.
- **Database / Auth**: Managed PostgreSQL and Auth provided by Supabase.

## Target Environment Variables
Configured via secret management or hosting runtime environment:
- `PORT`: Server port (default 3000).
- `NODE_ENV`: `production` or `development`.
- `GEMINI_API_KEY`: Secret API key for Google Gemini AI concierge.
- `SUPABASE_URL`: URL for Supabase project instance (Phase 1+).
- `SUPABASE_SERVICE_ROLE_KEY`: Server-side secret key for Supabase access (Phase 1+).
