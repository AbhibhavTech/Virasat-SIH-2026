# Production Deployment & DevOps Guide (Phase 8 Complete)

> **Document Status**: Production-Ready Deployment Specification implemented and verified per Phase 8 of the **Master Product & Engineering Blueprint (V2)**.

---

## 1. Container Architecture

Virasat is fully containerized with a secure, multi-stage Docker build:

- **Base Image**: `node:22-alpine` (Minimal attack surface, lightweight container footprint).
- **Security**: Runs under unprivileged user (`USER node`) to prevent container escape exploits.
- **Healthcheck**: Built-in HTTP probe at `/api/health` checking liveness every 30 seconds.
- **Port**: Ingress traffic routed through port 3000 (or dynamic Cloud Run `PORT`).

### Multi-Stage Build Stages
1. **Stage 1 (`builder`)**: Installs full dependencies, builds Vite client SPA into `dist/`, bundles server into `dist/server.cjs`.
2. **Stage 2 (`runner`)**: Copies only production artifacts (`dist/`, `data/`) and runs with production dependencies (`npm ci --omit=dev`).

---

## 2. Health & Readiness Probes

Virasat provides dedicated HTTP probes for Kubernetes, Google Cloud Run, and container orchestrators:

| Endpoint | Method | Purpose | Success Response | Failure Response |
|---|---|---|---|---|
| `/api/health` (or `/api/v1/health`) | `GET` | **Liveness Probe**: Confirms process is running, returns uptime and memory usage (RSS, heap). | `200 OK` (`{ status: "ok", uptime_seconds: ... }`) | Process dead |
| `/api/ready` (or `/api/v1/ready`) | `GET` | **Readiness Probe**: Confirms database and core seed catalogs are initialized. | `200 OK` (`{ status: "ready", database: { status: "healthy" } }`) | `503 Service Unavailable` |

---

## 3. Environment Variables & Secret Configuration

Configure in Cloud Run / hosting runtime environment:

| Variable | Required | Default | Description |
|---|---|---|---|
| `PORT` | Optional | `3000` | HTTP ingress port. |
| `NODE_ENV` | Optional | `development` | Set to `production` in live environments. |
| `JWT_SECRET` | Recommended | Built-in | HMAC-SHA256 secret key for signing user session tokens. |
| `GEMINI_API_KEY`| Optional | None | Google Gemini API key for live AI Concierge generation. (Fallback grounded engine active if unset). |
| `ALLOWED_ORIGINS` | Optional | `http://localhost:3000` | Comma-separated CORS origin whitelist. |

---

## 4. Google Cloud Run Deployment (Quick-Start)

```bash
# 1. Build and tag container image
docker build -t gcr.io/[PROJECT-ID]/virasat:latest .

# 2. Push to Google Container Registry / Artifact Registry
docker push gcr.io/[PROJECT-ID]/virasat:latest

# 3. Deploy to Cloud Run with auto-scaling (0 to 10 instances)
gcloud run deploy virasat \
  --image gcr.io/[PROJECT-ID]/virasat:latest \
  --platform managed \
  --region asia-south1 \
  --allow-unauthenticated \
  --port 3000 \
  --memory 512Mi \
  --cpu 1 \
  --set-env-vars NODE_ENV=production \
  --set-secrets GEMINI_API_KEY=virasat-gemini-key:latest
```

---

## 5. Automated CI/CD Pipeline (`.github/workflows/ci.yml`)

The repository includes a GitHub Actions workflow that automatically validates all changes on push and pull request:
- Multi-matrix testing across Node.js `20.x` and `22.x`.
- TypeScript static analysis (`npm run lint`).
- 200+ automated regression tests across all blueprint phases (`npm test`).
- Production bundle verification (`npm run build`).
