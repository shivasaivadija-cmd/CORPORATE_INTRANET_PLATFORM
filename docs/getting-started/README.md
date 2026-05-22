# Getting Started

## Prerequisites

- **Node.js** 20+ ([Download](https://nodejs.org/))
- **Docker Desktop** ([Download](https://www.docker.com/products/docker-desktop))
- **Git** ([Download](https://git-scm.com/))

## Quick Start

### 1. Clone Repository

```bash
git clone <repository-url>
cd corporate-intranet-platform
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

```bash
# Copy environment template
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.local.example apps/web/.env.local

# Edit .env files with your values
```

### 4. Start Infrastructure

```bash
# Start PostgreSQL and Redis
npm run docker:up

# Wait 10 seconds for services to be ready
```

### 5. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed demo data
npm run db:seed
```

### 6. Start Development

```bash
npm run dev
```

### 7. Access Application

- **Frontend**: http://localhost:3000
- **API**: http://localhost:4000/api
- **API Docs**: http://localhost:4000/api/docs

### Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@acme.com | Password123! |
| Employee | sarah@acme.com | Password123! |

## Project Structure

```
corporate-intranet-platform/
├── apps/
│   ├── api/          # NestJS backend
│   ├── web/          # Next.js frontend
│   └── mobile/       # React Native app
├── packages/
│   └── types/        # Shared TypeScript types
├── infrastructure/   # Docker, Nginx configs
└── docs/            # Documentation
```

## Available Scripts

```bash
npm run dev              # Start all services
npm run build            # Build all apps
npm run lint             # Lint all code
npm run type-check       # TypeScript check
npm run db:studio        # Open Prisma Studio
npm run docker:up        # Start Docker services
npm run docker:down      # Stop Docker services
```

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3000 (Windows)
npx kill-port 3000

# Kill process on port 4000
npx kill-port 4000
```

### Docker Issues

```bash
# Restart Docker services
npm run docker:down
npm run docker:up
```

### Database Issues

```bash
# Reset database
npm run docker:down
npm run docker:up
npm run db:migrate
npm run db:seed
```

## Next Steps

- [Development Guide](../development/setup.md)
- [Architecture Overview](../development/architecture.md)
- [Deployment Guide](../deployment-guides/docker.md)
- [API Documentation](../api/endpoints.md)

## Support

For issues or questions:
1. Check [Troubleshooting](#troubleshooting)
2. Review [Development Guide](../development/setup.md)
3. Check application logs in terminal
