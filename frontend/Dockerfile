# ============================================
# Base Stage
# ============================================
FROM node:18-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat

# ============================================
# Dependencies Stage
# ============================================
FROM base AS deps
COPY package*.json ./
RUN npm ci

# ============================================
# Development Stage
# ============================================
FROM base AS development
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

# ============================================
# Builder Stage
# ============================================
FROM base AS builder
COPY package*.json ./
RUN npm ci
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# ============================================
# Production Stage
# ============================================
FROM base AS production
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED 1
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/public ./public
USER nextjs
EXPOSE 3000
CMD ["npm", "run", "start"]
