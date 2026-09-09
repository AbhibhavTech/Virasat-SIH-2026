# =============================================================
# Stage 1: Build Stage (Vite SPA + Node.js Backend Bundle)
# =============================================================
FROM node:22-alpine AS builder

WORKDIR /app

# Install build dependencies
COPY package*.json ./
RUN npm ci

# Copy source files and configuration
COPY tsconfig*.json ./
COPY vite.config.ts ./
COPY tailwind.config.js ./
COPY postcss.config.js ./
COPY index.html ./
COPY src/ ./src/
COPY server.ts ./
COPY server/ ./server/
COPY data/ ./data/

# Build Vite client static assets and bundle backend server
RUN npm run build

# =============================================================
# Stage 2: Production Minimal Runtime Stage
# =============================================================
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Install production dependencies only
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy compiled assets from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/data ./data
COPY --from=builder /app/package.json ./package.json

# Use non-root unprivileged node user for container security
USER node

EXPOSE 3000

# Built-in container liveness probe
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:' + (process.env.PORT || 3000) + '/api/health', (res) => process.exit(res.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

CMD ["node", "dist/server.cjs"]
