# 2coms Corporate Intranet Platform

<div align="center">

![2coms Logo](https://via.placeholder.com/150x150/0066FF/FFFFFF?text=2coms)

**Enterprise-grade internal communication and engagement platform**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10-E0234E?style=flat-square&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

[Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Architecture](#-architecture) • [Contributing](#-contributing)

</div>

---

## 🌟 Overview

2coms is a modern, full-featured corporate intranet platform designed to enhance internal communication, collaboration, and employee engagement. Built with cutting-edge technologies and best practices, it provides a seamless experience across web and mobile devices.

### Key Highlights

- 🚀 **Modern Stack** - Built with Next.js 15, NestJS, and TypeScript
- 🎨 **Beautiful UI** - Professional design with Tailwind CSS and Framer Motion
- 🤖 **AI-Powered** - Intelligent assistant powered by Grok AI
- 🔄 **Real-time** - Live updates via WebSocket connections
- 📱 **Mobile Ready** - React Native app for iOS and Android
- 🔐 **Enterprise Security** - JWT authentication, RBAC, and audit logging
- 🌐 **Multi-tenant** - Support for multiple organizations
- ⚡ **High Performance** - Optimized for speed and scalability

---

## ✨ Features

### Core Modules

| Module | Description |
|--------|-------------|
| 📱 **Social Feed** | LinkedIn-style feed with posts, reactions, comments, and hashtags |
| 📢 **Announcements** | Priority broadcasts with read receipts and acknowledgements |
| 📚 **Knowledge Hub** | Wiki with rich text editor, versioning, and semantic search |
| 📁 **Documents** | File management with S3 storage and AI-powered summaries |
| 👥 **People Directory** | Employee profiles, org chart, and skills directory |
| 🏆 **Recognition** | Peer kudos, badges, points system, and leaderboards |
| 📅 **Events** | Calendar with RSVP, virtual meetings, and reminders |
| 🔍 **Global Search** | Fuzzy search across all content with filters |
| 🔔 **Notifications** | Real-time notifications with WebSocket delivery |
| 🤖 **AI Assistant** | Intelligent chatbot for company information and support |

### AI Capabilities

- 📝 Daily digest generation
- 📄 Content summarization
- 🏷️ Auto-tagging for articles
- 🔍 Semantic search
- 💬 Conversational AI with context awareness
- 📊 Meeting recap generation

### Security & Compliance

- 🔐 JWT + Refresh token authentication
- 👮 Role-based access control (RBAC)
- 🏢 Multi-tenant data isolation
- 🚦 Rate limiting per route
- 🍪 Secure HttpOnly cookies
- ✅ Input validation (class-validator + Zod)
- 📋 Comprehensive audit logging

---

## 🏗️ Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5.7
- **Styling**: Tailwind CSS 3.4
- **Animations**: Framer Motion
- **State Management**: Zustand + TanStack Query
- **UI Components**: Radix UI + Custom components
- **Icons**: Lucide React

### Backend
- **Framework**: NestJS 10
- **Language**: TypeScript 5.7
- **ORM**: Prisma 5
- **Validation**: class-validator, class-transformer
- **Documentation**: Swagger/OpenAPI

### Database & Cache
- **Database**: PostgreSQL 16
- **Cache**: Redis 7
- **Queue**: BullMQ
- **Search**: PostgreSQL Full-Text Search

### Real-time & AI
- **WebSocket**: Socket.IO
- **AI**: Grok AI (xAI)
- **Embeddings**: Text-embedding-004

### Infrastructure
- **Containerization**: Docker + Docker Compose
- **Reverse Proxy**: Nginx
- **CI/CD**: GitHub Actions
- **Monorepo**: Turborepo
- **Storage**: AWS S3 / Cloudflare R2

### Mobile
- **Framework**: React Native (Expo)
- **Navigation**: Expo Router
- **State**: Zustand + TanStack Query

---

## 🚀 Quick Start

### Prerequisites

Ensure you have the following installed:

- **Node.js** 20.x or higher ([Download](https://nodejs.org/))
- **Docker Desktop** ([Download](https://www.docker.com/products/docker-desktop))
- **Git** ([Download](https://git-scm.com/))

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-org/corporate-intranet-platform.git
cd corporate-intranet-platform

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.local.example apps/web/.env.local

# Edit the .env files with your configuration
# Required: DATABASE_URL, JWT_SECRET, REFRESH_TOKEN_SECRET, GROK_API_KEY

# 4. Start infrastructure services
npm run docker:up

# Wait 10 seconds for PostgreSQL and Redis to be ready

# 5. Set up the database
npm run db:generate    # Generate Prisma client
npm run db:migrate     # Run migrations
npm run db:seed        # Seed demo data

# 6. Start development servers
npm run dev
```

### Access the Application

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **API**: [http://localhost:4000/api](http://localhost:4000/api)
- **API Documentation**: [http://localhost:4000/api/docs](http://localhost:4000/api/docs)
- **Prisma Studio**: Run `npm run db:studio`

### Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@acme.com | Password123! |
| Employee | sarah@acme.com | Password123! |
| Employee | marcus@acme.com | Password123! |

---

## 📁 Project Structure

```
corporate-intranet-platform/
├── apps/
│   ├── api/                      # NestJS Backend API
│   │   ├── prisma/              # Database schema & migrations
│   │   │   ├── migrations/
│   │   │   ├── schema.prisma
│   │   │   └── seed.ts
│   │   └── src/
│   │       ├── common/          # Shared utilities, guards, decorators
│   │       ├── config/          # Configuration modules
│   │       ├── database/        # Prisma service
│   │       ├── modules/         # Feature modules
│   │       │   ├── auth/
│   │       │   ├── users/
│   │       │   ├── feed/
│   │       │   ├── ai/
│   │       │   └── ...
│   │       ├── app.module.ts
│   │       └── main.ts
│   │
│   ├── web/                      # Next.js Frontend
│   │   ├── public/              # Static assets
│   │   └── src/
│   │       ├── app/             # App Router pages
│   │       │   ├── (auth)/     # Authentication pages
│   │       │   └── (dashboard)/ # Dashboard pages
│   │       ├── components/      # React components
│   │       │   ├── dashboard/
│   │       │   ├── feed/
│   │       │   ├── layout/
│   │       │   ├── providers/
│   │       │   ├── shared/
│   │       │   └── ui/
│   │       ├── hooks/           # Custom React hooks
│   │       ├── lib/             # Utilities & API client
│   │       ├── store/           # Zustand stores
│   │       ├── styles/          # Global styles
│   │       └── types/           # TypeScript types
│   │
│   └── mobile/                   # React Native Mobile App
│       └── src/
│           ├── app/             # Expo Router screens
│           ├── components/      # Mobile components
│           ├── hooks/           # Mobile hooks
│           ├── lib/             # Mobile utilities
│           └── store/           # Mobile state
│
├── packages/
│   └── types/                    # Shared TypeScript types
│       └── src/
│           └── index.ts
│
├── infrastructure/
│   ├── docker/                   # Docker configurations
│   │   └── postgres/
│   └── nginx/                    # Nginx configurations
│       └── nginx.conf
│
├── docs/                         # Documentation
│   ├── getting-started/
│   ├── development/
│   ├── deployment/
│   └── api/
│
├── scripts/                      # Build & deployment scripts
│   ├── setup/
│   └── dev/
│
├── .github/
│   └── workflows/               # CI/CD pipelines
│       └── ci-cd.yml
│
├── docker-compose.yml           # Docker Compose configuration
├── turbo.json                   # Turborepo configuration
├── package.json                 # Root package configuration
└── README.md                    # This file
```

---

## 📚 Documentation

### Getting Started
- [Installation Guide](docs/getting-started/installation.md)
- [Quick Start Tutorial](docs/getting-started/quick-start.md)
- [Environment Configuration](docs/getting-started/environment.md)
- [Troubleshooting](docs/getting-started/troubleshooting.md)

### Development
- [Development Setup](docs/development/setup.md)
- [Architecture Overview](docs/development/architecture.md)
- [Coding Standards](docs/development/coding-standards.md)
- [Testing Guide](docs/development/testing.md)
- [Contributing Guidelines](CONTRIBUTING.md)

### Deployment
- [Docker Deployment](docs/deployment/docker.md)
- [Vercel Deployment](docs/deployment/vercel.md)
- [Railway Deployment](docs/deployment/railway.md)
- [Production Checklist](docs/deployment/production-checklist.md)

### API Reference
- [API Documentation](docs/api/README.md)
- [Authentication](docs/api/authentication.md)
- [Endpoints](docs/api/endpoints.md)
- [WebSocket Events](docs/api/websocket.md)

---

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev              # Start all services in development mode
npm run build            # Build all applications
npm run lint             # Lint all code
npm run type-check       # Run TypeScript type checking
npm run test             # Run all tests

# Database
npm run db:generate      # Generate Prisma client
npm run db:migrate       # Run database migrations
npm run db:migrate:dev   # Create and apply new migration
npm run db:seed          # Seed database with demo data
npm run db:studio        # Open Prisma Studio

# Docker
npm run docker:up        # Start Docker services
npm run docker:down      # Stop Docker services
npm run docker:build     # Build Docker images
```

### Environment Variables

#### Backend (apps/api/.env)

```bash
# Application
NODE_ENV=development
PORT=4000
API_URL=http://localhost:4000
FRONTEND_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/intranet_db

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=redis_secret

# Authentication
JWT_SECRET=<generate-with-openssl-rand-base64-64>
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=<generate-with-openssl-rand-base64-64>
REFRESH_TOKEN_EXPIRES_IN=7d

# AI (Grok)
GROK_API_KEY=<your-grok-api-key>
GROK_MODEL=grok-2-1212
GROK_API_URL=https://api.x.ai/v1

# Storage (Optional)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=<your-aws-key>
AWS_SECRET_ACCESS_KEY=<your-aws-secret>
S3_BUCKET_NAME=intranet-uploads
```

#### Frontend (apps/web/.env.local)

```bash
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
NEXT_PUBLIC_WS_URL=http://localhost:4000
```

---

## 🏛️ Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
├─────────────────────────────────────────────────────────────┤
│  Next.js Web App  │  React Native Mobile  │  External APIs  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      API Gateway (Nginx)                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    NestJS Application                        │
├─────────────────────────────────────────────────────────────┤
│  Auth  │  Users  │  Feed  │  AI  │  Docs  │  Events  │ ... │
└─────────────────────────────────────────────────────────────┘
                              │
                 ┌────────────┼────────────┐
                 ▼            ▼            ▼
         ┌──────────┐  ┌──────────┐  ┌──────────┐
         │PostgreSQL│  │  Redis   │  │ Grok AI  │
         │    DB    │  │  Cache   │  │   API    │
         └──────────┘  └──────────┘  └──────────┘
```

### Key Design Patterns

- **Monorepo Architecture** - Turborepo for efficient builds
- **Modular Design** - Feature-based module organization
- **API-First** - RESTful API with OpenAPI documentation
- **Real-time Communication** - WebSocket for live updates
- **Caching Strategy** - Redis for session and query caching
- **Queue Processing** - BullMQ for async operations
- **Optimistic UI** - Instant feedback with background sync

---

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

---

## 🚢 Deployment

### Docker Production

```bash
# Build and start all services
docker-compose -f docker-compose.prod.yml up -d

# Run migrations
docker-compose exec api npm run db:migrate

# View logs
docker-compose logs -f
```

### Vercel (Frontend)

```bash
cd apps/web
vercel --prod
```

### Railway (Backend)

1. Connect your GitHub repository
2. Select `apps/api` as the root directory
3. Add environment variables
4. Deploy

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm run test`)
5. Commit your changes (`git commit -m 'feat: add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [NestJS](https://nestjs.com/) - Node.js framework
- [Prisma](https://www.prisma.io/) - Database ORM
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Radix UI](https://www.radix-ui.com/) - UI components
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [xAI Grok](https://x.ai/) - AI capabilities

---

## 📞 Support

- 📧 Email: support@2coms.com
- 💬 Discord: [Join our community](https://discord.gg/2coms)
- 📖 Documentation: [docs.2coms.com](https://docs.2coms.com)
- 🐛 Issues: [GitHub Issues](https://github.com/your-org/corporate-intranet-platform/issues)

---

<div align="center">

**Built with ❤️ by the 2coms Team**

[Website](https://2coms.com) • [Documentation](https://docs.2coms.com) • [Blog](https://blog.2coms.com)

</div>
