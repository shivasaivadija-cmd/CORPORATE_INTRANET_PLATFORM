FROM node:20-alpine AS builder
WORKDIR /app

RUN npm install -g turbo

COPY package.json turbo.json ./
COPY packages/types/package.json ./packages/types/
COPY apps/api/package.json ./apps/api/

RUN npm install --workspace=apps/api --workspace=packages/types

COPY packages/types ./packages/types
COPY apps/api ./apps/api

RUN cd apps/api && npx prisma generate
RUN cd apps/api && npm run build

FROM node:20-alpine AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/apps/api/prisma ./prisma
COPY --from=builder /app/apps/api/package.json ./

USER nestjs
EXPOSE 4000

CMD ["node", "dist/main"]
