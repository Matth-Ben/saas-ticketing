# ============================================
# Base Stage
# ============================================
FROM node:18-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat openssl

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
RUN npx prisma generate
EXPOSE 4000
CMD ["npm", "run", "dev"]

# ============================================
# Builder Stage
# ============================================
FROM base AS builder
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

# ============================================
# Production Stage
# ============================================
FROM base AS production
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
RUN npx prisma generate
EXPOSE 4000
CMD ["npm", "run", "start"]
