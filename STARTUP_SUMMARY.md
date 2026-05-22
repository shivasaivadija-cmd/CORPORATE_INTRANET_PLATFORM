# 🚀 STARTUP SUMMARY - GET RUNNING IN 2 MINUTES

## ⚡ Quick Start Command

```bash
cd d:\corporate-intranet_platform
npm run dev
```

That's it! Everything will start automatically.

---

## 📋 What Happens When You Run `npm run dev`

```
✅ Docker services start (PostgreSQL + Redis)
✅ Database migrations run
✅ Frontend (Next.js) starts on port 3000
✅ Backend (NestJS) starts on port 4000
✅ Hot reload enabled
✅ Ready to use!
```

---

## 🌐 Access Points

| Service | URL | Status |
|---------|-----|--------|
| Frontend | http://localhost:3000 | ✅ |
| Backend API | http://localhost:4000/api | ✅ |
| API Docs | http://localhost:4000/api/docs | ✅ |
| Prisma Studio | `npm run db:studio` | ✅ |

---

## 🔐 Demo Login

```
Email: admin@acme.com
Password: Password123!
```

Or try:
```
Email: sarah@acme.com
Password: Password123!
```

---

## 🛠️ If Something Goes Wrong

### Port Already in Use?
```bash
npm run kill:ports
npm run dev
```

### Database Error?
```bash
npm run db:migrate
npm run db:seed
npm run dev
```

### Full Reset?
```bash
npm run docker:down
npm run kill:ports
npm install
npm run docker:up
npm run dev
```

---

## 📊 Services Status

### Frontend (Port 3000)
- Framework: Next.js 15
- Status: ✅ Running
- URL: http://localhost:3000

### Backend (Port 4000)
- Framework: NestJS 10
- Status: ✅ Running
- URL: http://localhost:4000/api

### Database (Port 5432)
- Type: PostgreSQL 16
- Status: ✅ Running (Docker)
- Connection: postgresql://postgres:postgres@127.0.0.1:5432/intranet_db

### Cache (Port 6379)
- Type: Redis 7
- Status: ✅ Running (Docker)
- Connection: redis://:redis_secret@localhost:6379

---

## ✅ Startup Checklist

- [ ] Open terminal
- [ ] Run: `cd d:\corporate-intranet_platform`
- [ ] Run: `npm run dev`
- [ ] Wait 30-60 seconds
- [ ] Open: http://localhost:3000
- [ ] Login with demo credentials
- [ ] Test features

---

## 🎯 Common Commands

```bash
# Start everything
npm run dev

# Start Docker only
npm run docker:up

# Stop Docker
npm run docker:down

# Reset database
npm run db:migrate
npm run db:seed

# Kill ports
npm run kill:ports

# View database
npm run db:studio

# Build for production
npm run build

# Run tests
npm run test
```

---

## 📝 Troubleshooting Quick Links

| Issue | Solution |
|-------|----------|
| Port 3000 in use | `npm run kill:ports` |
| Port 4000 in use | `npm run kill:ports` |
| Database error | `npm run db:migrate` |
| Missing data | `npm run db:seed` |
| Docker not running | Start Docker Desktop |
| Dependencies missing | `npm install` |

---

## 🎉 Ready to Go!

### Next Steps
1. Run: `npm run dev`
2. Wait for startup
3. Open: http://localhost:3000
4. Login with demo credentials
5. Explore the application!

---

**Status:** ✅ Ready to Start

**Startup Time:** 2-3 minutes

**All Services:** ✅ Ready
