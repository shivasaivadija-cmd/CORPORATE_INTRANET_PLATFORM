FROM node:20-alpine AS builder
WORKDIR /app

RUN npm install -g turbo

COPY package.json turbo.json ./
COPY packages/types/package.json ./packages/types/
COPY apps/web/package.json ./apps/web/

RUN npm install --workspace=apps/web --workspace=packages/types

COPY packages/types ./packages/types
COPY apps/web ./apps/web

ENV NEXT_TELEMETRY_DISABLED=1
RUN cd apps/web && npm run build

FROM node:20-alpine AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/web/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000 HOSTNAME=0.0.0.0 NEXT_TELEMETRY_DISABLED=1

CMD ["node", "server.js"]
