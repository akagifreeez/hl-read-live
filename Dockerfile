# syntax=docker/dockerfile:1
# Multi-stage build for the Next.js standalone server.
# Result: a small, non-root node image that runs `node server.js` on :3000.

# 1) deps — install from the lockfile for a reproducible build
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# 2) build — produce .next/standalone
FROM node:20-alpine AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 3) runner — minimal runtime, runs as a non-root user
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
RUN addgroup -g 1001 -S nodejs && adduser -u 1001 -S nextjs -G nodejs
# standalone bundle + static assets + public dir
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
USER 1001
EXPOSE 3000
CMD ["node", "server.js"]
