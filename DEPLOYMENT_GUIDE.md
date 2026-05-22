# 🚀 Public Deployment Guide - 2coms Corporate Intranet Platform

## Overview
This guide will help you deploy the 2coms platform to public URLs with working employee and HR credentials.

## Deployment Architecture

```
Frontend (Vercel) → Backend (Railway/Render) → Database (Railway/Neon)
https://2coms.vercel.app → https://2coms-api.railway.app → PostgreSQL + Redis
```

---

## 📋 Prerequisites

- GitHub account
- Vercel account (free tier)
- Railway account (free tier) OR Render account (free tier)
- Neon account (free PostgreSQL) OR use Railway's PostgreSQL

---

## 🎯 Quick Deployment Steps

### Option 1: Railway (Recommended - Easiest)

#### Step 1: Deploy Backend to Railway

1. **Sign up at [Railway.app](https://railway.app)**

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Connect your GitHub account
   - Select the `corporate-intranet-platform` repository

3. **Configure Backend Service**
   - Click "Add Service" → "GitHub Repo"
   - Root Directory: `apps/api`
   - Add the following environment variables:

```env
NODE_ENV=production
PORT=4000
FRONTEND_URL=https://your-app.vercel.app

# Database (Railway will auto-generate)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Redis (Railway will auto-generate)
REDIS_HOST=${{Redis.REDIS_HOST}}
REDIS_PORT=${{Redis.REDIS_PORT}}
REDIS_PASSWORD=${{Redis.REDIS_PASSWORD}}

# JWT Secrets (Generate these)
JWT_SECRET=your-super-secret-jwt-key-min-32-chars-long-railway-2024
REFRESH_TOKEN_SECRET=your-super-secret-refresh-token-key-min-32-chars-long-railway-2024
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# Grok AI (Get from https://console.x.ai/)
GROK_API_KEY=xai-your-grok-api-key-here
GROK_MODEL=grok-2-1212
GROK_API_URL=https://api.x.ai/v1

# AWS S3 (Optional - for file uploads)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
S3_BUCKET_NAME=2coms-uploads
```

4. **Add PostgreSQL Database**
   - Click "New" → "Database" → "Add PostgreSQL"
   - Railway will automatically link it

5. **Add Redis**
   - Click "New" → "Database" → "Add Redis"
   - Railway will automatically link it

6. **Run Database Migrations**
   - Go to your API service settings
   - Add custom start command:
   ```bash
   npm run db:generate && npm run db:migrate && npm run db:seed && npm run start:prod
   ```

7. **Get Your API URL**
   - Railway will provide a public URL like: `https://your-app.up.railway.app`
   - Copy this URL for frontend configuration

#### Step 2: Deploy Frontend to Vercel

1. **Sign up at [Vercel.com](https://vercel.com)**

2. **Import Project**
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Framework Preset: Next.js
   - Root Directory: `apps/web`

3. **Configure Environment Variables**
   ```env
   NEXT_PUBLIC_API_URL=https://your-app.up.railway.app/api/v1
   NEXT_PUBLIC_WS_URL=https://your-app.up.railway.app
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your app will be live at: `https://your-app.vercel.app`

5. **Update Backend FRONTEND_URL**
   - Go back to Railway
   - Update `FRONTEND_URL` environment variable with your Vercel URL
   - Redeploy the backend service

---

### Option 2: Render (Alternative)

#### Backend on Render

1. **Sign up at [Render.com](https://render.com)**

2. **Create PostgreSQL Database**
   - Dashboard → "New" → "PostgreSQL"
   - Name: `2coms-db`
   - Copy the Internal Database URL

3. **Create Redis Instance**
   - Dashboard → "New" → "Redis"
   - Name: `2coms-redis`
   - Copy the Redis URL

4. **Create Web Service**
   - Dashboard → "New" → "Web Service"
   - Connect GitHub repository
   - Name: `2coms-api`
   - Root Directory: `apps/api`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run db:generate && npm run db:migrate && npm run db:seed && npm run start:prod`

5. **Add Environment Variables** (same as Railway above)

6. **Deploy and get URL**

---

## 🔑 Default Credentials for Demo

After deployment, use these credentials to access the application:

### Admin/HR Account
```
Email: admin@acme.com
Password: Password123!
Role: Admin (Full access to all features)
```

### Employee Account 1
```
Email: sarah@acme.com
Password: Password123!
Role: Employee
```

### Employee Account 2
```
Email: marcus@acme.com
Password: Password123!
Role: Employee
```

### Manager Account
```
Email: john@acme.com
Password: Password123!
Role: Manager
```

---

## 🛠️ Build Configuration Files

### For Railway - Create `railway.json` in project root

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "cd apps/api && npm install && npm run build"
  },
  "deploy": {
    "startCommand": "cd apps/api && npm run db:generate && npm run db:migrate && npm run db:seed && npm run start:prod",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### For Vercel - Create `vercel.json` in apps/web

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "outputDirectory": ".next"
}
```

---

## 📝 Post-Deployment Checklist

- [ ] Backend API is accessible at public URL
- [ ] Frontend is accessible at public URL
- [ ] Database migrations ran successfully
- [ ] Seed data is populated
- [ ] Can login with admin@acme.com
- [ ] Can login with sarah@acme.com
- [ ] WebSocket connection works (check notifications)
- [ ] API documentation accessible at `/api/docs`
- [ ] CORS is configured correctly
- [ ] Environment variables are set correctly

---

## 🧪 Testing the Deployment

### 1. Test API Health
```bash
curl https://your-api-url.railway.app/api/v1/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 2. Test Login
```bash
curl -X POST https://your-api-url.railway.app/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@acme.com","password":"Password123!"}'
```

### 3. Access Frontend
- Open `https://your-app.vercel.app`
- Login with credentials
- Test features: Feed, Announcements, Knowledge Hub, etc.

---

## 🔧 Troubleshooting

### Issue: Database connection failed
**Solution:** Check DATABASE_URL is correctly set and database is running

### Issue: CORS errors
**Solution:** Ensure FRONTEND_URL in backend matches your Vercel URL exactly

### Issue: 502 Bad Gateway
**Solution:** Check backend logs, ensure migrations ran successfully

### Issue: WebSocket not connecting
**Solution:** Ensure WS_URL is set correctly in frontend environment variables

### Issue: Seed data not loading
**Solution:** Manually run seed command:
```bash
# In Railway/Render console
npm run db:seed
```

---

## 📊 Monitoring & Logs

### Railway
- Go to your service → "Deployments" → Click on latest deployment
- View real-time logs
- Check metrics (CPU, Memory, Network)

### Vercel
- Go to your project → "Deployments" → Click on latest deployment
- View function logs
- Check analytics

---

## 💰 Cost Estimation

### Free Tier Limits

**Railway (Free Plan)**
- $5 credit per month
- Enough for small demo apps
- PostgreSQL + Redis + API service

**Vercel (Hobby Plan)**
- 100GB bandwidth/month
- Unlimited deployments
- Perfect for frontend

**Total Cost: $0/month** (within free tier limits)

---

## 🚀 Alternative: Docker Deployment on VPS

If you prefer self-hosting on a VPS (DigitalOcean, AWS EC2, etc.):

### 1. Provision VPS
- Ubuntu 22.04 LTS
- Minimum 2GB RAM
- 20GB storage

### 2. Install Docker
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo apt install docker-compose
```

### 3. Clone Repository
```bash
git clone https://github.com/your-org/corporate-intranet-platform.git
cd corporate-intranet-platform
```

### 4. Configure Environment
```bash
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.local.example apps/web/.env.local
# Edit the files with your configuration
```

### 5. Deploy
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### 6. Setup Domain
- Point your domain to VPS IP
- Configure Nginx for SSL (Let's Encrypt)

---

## 📧 Sharing with Recruiter

### Email Template

```
Subject: 2coms Corporate Intranet Platform - Live Demo

Hi [Recruiter Name],

I've deployed the 2coms Corporate Intranet Platform to public URLs for your review:

🌐 Application URL: https://your-app.vercel.app
📚 API Documentation: https://your-api.railway.app/api/docs

Demo Credentials:

HR/Admin Access:
Email: admin@acme.com
Password: Password123!

Employee Access:
Email: sarah@acme.com
Password: Password123!

Key Features to Explore:
✓ Social Feed with posts, comments, and reactions
✓ AI-Powered Assistant (chat icon in bottom right)
✓ Knowledge Hub with articles
✓ Employee Directory
✓ Recognition System (Kudos & Badges)
✓ Real-time Notifications
✓ Events Calendar

Technical Stack:
- Frontend: Next.js 15 + TypeScript + Tailwind CSS
- Backend: NestJS + PostgreSQL + Redis
- AI: Grok AI Integration
- Real-time: WebSocket (Socket.IO)

Source Code: https://github.com/your-username/corporate-intranet-platform

Feel free to explore all features. The application is fully functional with seeded demo data.

Best regards,
[Your Name]
```

---

## 🎯 Quick Deploy Commands Summary

```bash
# Generate secure secrets
openssl rand -base64 64

# Test API locally before deploy
cd apps/api
npm run build
npm run start:prod

# Test Frontend locally before deploy
cd apps/web
npm run build
npm run start

# Check environment variables
cd apps/api && cat .env
cd apps/web && cat .env.local
```

---

## ✅ Final Verification

Before sharing with recruiter, verify:

1. ✅ Application loads without errors
2. ✅ Login works with all credential types
3. ✅ Feed shows posts and interactions work
4. ✅ AI Assistant responds to queries
5. ✅ Notifications appear in real-time
6. ✅ All navigation links work
7. ✅ Mobile responsive design works
8. ✅ API documentation is accessible
9. ✅ No console errors in browser
10. ✅ Performance is acceptable (< 3s load time)

---

## 📞 Support

If you encounter issues during deployment:

1. Check Railway/Render/Vercel logs
2. Verify all environment variables
3. Ensure database migrations completed
4. Check CORS configuration
5. Verify API and Frontend URLs match

---

**Deployment Status: Ready for Production** ✅

Good luck with your demo! 🚀
