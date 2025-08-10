# Multi-stage build
FROM node:20-alpine AS deps
RUN corepack enable && corepack prepare pnpm@9.7.1 --activate
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile || pnpm install

FROM node:20-alpine AS builder
RUN corepack enable && corepack prepare pnpm@9.7.1 --activate
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm prisma generate
RUN pnpm build

FROM node:20-alpine AS runner
RUN addgroup -S app && adduser -S app -G app
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/prisma ./prisma
USER app
EXPOSE 3000
CMD ["node","node_modules/next/dist/bin/next","start","-p","3000"]
