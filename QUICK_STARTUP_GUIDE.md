# 🚀 Quick Startup Guide - Get Running Again

## ⚡ Quick Start (2 Minutes)

### Option 1: Start Everything with One Command

```bash
cd d:\corporate-intranet_platform
npm run dev
```

This will start:
- ✅ Frontend (Next.js) on http://localhost:3000
- ✅ Backend (NestJS) on http://localhost:4000
- ✅ Database (PostgreSQL) via Docker
- ✅ Redis cache via Docker

---

## 📋 Step-by-Step Startup

### Step 1: Start Docker Services (Database & Redis)

```bash
cd d:\corporate-intranet_platform
npm run docker:up
```

Wait 10 seconds for services to be ready.

### Step 2: Start Development Servers

Open a new terminal and run:

```bash
npm run dev
```

### Step 3: Access Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:4000/api
- **API Docs:** http://localhost:4000/api/docs

---

## 🔐 Login Credentials

### Admin Account
```
Email: admin@acme.com
Password: Password123!
```

### Employee Accounts
```
Email: sarah@acme.com
Password: Password123!

Email: marcus@acme.com
Password: Password123!

Email: priya@acme.com
Password: Password123!
```

---

## 🛠️ Troubleshooting

### Issue: Port 3000 Already in Use

```bash
# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use this script
npm run kill:ports
```

### Issue: Port 4000 Already in Use

```bash
# Kill process on port 4000
netstat -ano | findstr :4000
taskkill /PID <PID> /F
```

### Issue: Docker Services Not Starting

```bash
# Check Docker status
docker ps

# Start Docker Desktop if not running
# Then run:
npm run docker:up
```

### Issue: Database Connection Error

```bash
# Reset database
npm run db:migrate

# Seed demo data
npm run db:seed
```

### Issue: Dependencies Missing

```bash
# Reinstall dependencies
npm install

# Then start
npm run dev
```

---

## 📊 Available Commands

### Development
```bash
npm run dev              # Start all services
npm run build            # Build all applications
npm run lint             # Lint all code
npm run type-check       # TypeScript type checking
npm run test             # Run tests
```

### Database
```bash
npm run db:generate      # Generate Prisma client
npm run db:migrate       # Run migrations
npm run db:seed          # Seed demo data
npm run db:studio        # Open Prisma Studio
```

### Docker
```bash
npm run docker:up        # Start Docker services
npm run docker:down      # Stop Docker services
npm run docker:build     # Build Docker images
```

### Utilities
```bash
npm run kill:ports       # Kill processes on ports 3000 & 4000
npm run reset:db         # Reset database
```

---

## ✅ Startup Checklist

- [ ] Docker Desktop is running
- [ ] Run: `npm run docker:up`
- [ ] Wait 10 seconds
- [ ] Run: `npm run dev`
- [ ] Frontend loads at http://localhost:3000
- [ ] Backend API at http://localhost:4000/api
- [ ] Login with demo credentials
- [ ] Navigate pages
- [ ] Test features

---

## 🎯 What Should Be Running

### Frontend (Port 3000)
```
✅ Next.js development server
✅ React application
✅ Hot reload enabled
```

### Backend (Port 4000)
```
✅ NestJS API server
✅ REST endpoints
✅ WebSocket support
✅ Swagger documentation
```

### Database (Port 5432)
```
✅ PostgreSQL database
✅ Running in Docker
✅ Demo data loaded
```

### Cache (Port 6379)
```
✅ Redis cache
✅ Running in Docker
✅ Session storage
```

---

## 📝 Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
NEXT_PUBLIC_WS_URL=http://localhost:4000
```

### Backend (.env)
```
NODE_ENV=development
PORT=4000
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/intranet_db
REDIS_URL=redis://:redis_secret@localhost:6379
JWT_SECRET=<your-jwt-secret-key>
GROK_API_KEY=<your-grok-api-key>
```

---

## 🔄 Full Restart Procedure

If something is broken, do a full restart:

```bash
# 1. Stop everything
npm run docker:down

# 2. Kill any remaining processes
npm run kill:ports

# 3. Clean up
npm run clean

# 4. Reinstall dependencies
npm install

# 5. Start Docker services
npm run docker:up

# 6. Wait 10 seconds

# 7. Start development servers
npm run dev
```

---

## 📞 Quick Help

### Frontend Not Loading?
1. Check: http://localhost:3000
2. Check console (F12) for errors
3. Check terminal for build errors
4. Try: `npm run dev` again

### API Not Responding?
1. Check: http://localhost:4000/api/docs
2. Check backend terminal for errors
3. Check database connection
4. Try: `npm run db:migrate`

### Database Connection Error?
1. Check Docker is running: `docker ps`
2. Check database: `npm run db:studio`
3. Reset database: `npm run db:migrate`
4. Seed data: `npm run db:seed`

### Port Already in Use?
1. Find process: `netstat -ano | findstr :3000`
2. Kill process: `taskkill /PID <PID> /F`
3. Or use: `npm run kill:ports`

---

## 🎉 You're Ready!

Everything should be running now!

### Access Points
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:4000/api
- **API Docs:** http://localhost:4000/api/docs
- **Prisma Studio:** `npm run db:studio`

### Demo Credentials
- Email: `admin@acme.com`
- Password: `Password123!`

---

**Status:** ✅ Ready to Start

**Startup Time:** 2-3 minutes

**Support:** See troubleshooting section above
