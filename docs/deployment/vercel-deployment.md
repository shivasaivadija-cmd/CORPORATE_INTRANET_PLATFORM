# 🚀 Vercel Deployment Guide - 2coms Corporate Intranet Platform

## Prerequisites

- GitHub account with repository access
- Vercel account (free tier available)
- Backend API deployed (Railway, Heroku, or your own server)
- Environment variables ready

## Step 1: Prepare Your Repository

### 1.1 Ensure all files are committed
```bash
git add .
git commit -m "chore: prepare for Vercel deployment"
git push origin main
```

### 1.2 Verify Vercel configuration files exist
- ✅ `vercel.json` - Routing configuration
- ✅ `.vercelignore` - Files to exclude from build
- ✅ `apps/web/src/app/layout.tsx` - Contains SPA routing fix script

## Step 2: Deploy Frontend to Vercel

### 2.1 Connect GitHub to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click **"New Project"**
3. Select **"Import Git Repository"**
4. Connect your GitHub account
5. Select the `corporate-intranet_platform` repository
6. Click **"Import"**

### 2.2 Configure Project Settings

**Framework Preset:** Next.js
**Root Directory:** `apps/web`
**Build Command:** `npm run build`
**Output Directory:** `.next`

### 2.3 Set Environment Variables

Add these environment variables in Vercel dashboard:

```
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api/v1
NEXT_PUBLIC_WS_URL=https://your-api-domain.com
```

**Example values:**
- If backend is on Railway: `https://your-app-name.up.railway.app/api/v1`
- If backend is on Heroku: `https://your-app-name.herokuapp.com/api/v1`
- If backend is self-hosted: `https://api.yourdomain.com/api/v1`

### 2.4 Deploy

Click **"Deploy"** and wait for the build to complete.

## Step 3: Configure Custom Domain (Optional)

1. Go to **Project Settings** → **Domains**
2. Click **"Add Domain"**
3. Enter your domain (e.g., `intranet.yourdomain.com`)
4. Follow DNS configuration instructions
5. Wait for DNS propagation (5-30 minutes)

## Step 4: Verify Deployment

### 4.1 Test Frontend
- ✅ Visit your Vercel URL
- ✅ Login with demo credentials
- ✅ Navigate between pages
- ✅ Check console for errors

### 4.2 Test API Connection
- ✅ Create a post (should call backend API)
- ✅ Upload a document
- ✅ Use AI Customer Support
- ✅ Check network tab for API calls

### 4.3 Test SPA Routing
- ✅ Refresh on any page (should not 404)
- ✅ Share URL with query parameters
- ✅ Use browser back/forward buttons

## Step 5: Backend Deployment (Separate)

### Option A: Deploy to Railway

```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login to Railway
railway login

# 3. Create new project
railway init

# 4. Deploy
railway up
```

### Option B: Deploy to Heroku

```bash
# 1. Install Heroku CLI
npm install -g heroku

# 2. Login
heroku login

# 3. Create app
heroku create your-app-name

# 4. Set environment variables
heroku config:set DATABASE_URL=your_database_url
heroku config:set JWT_SECRET=your_jwt_secret
heroku config:set GROK_API_KEY=your_grok_key

# 5. Deploy
git push heroku main
```

### Option C: Self-Hosted (VPS/Dedicated Server)

```bash
# 1. SSH into your server
ssh user@your-server.com

# 2. Clone repository
git clone https://github.com/your-org/corporate-intranet-platform.git
cd corporate-intranet-platform

# 3. Install dependencies
npm install

# 4. Setup environment
cp apps/api/.env.example apps/api/.env
# Edit .env with your values

# 5. Setup database
npm run db:migrate

# 6. Start backend
npm run start:api

# 7. Setup reverse proxy (Nginx)
# Configure Nginx to proxy requests to localhost:4000
```

## Step 6: Environment Variables Reference

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api/v1
NEXT_PUBLIC_WS_URL=https://your-api-domain.com
```

### Backend (.env)
```
NODE_ENV=production
PORT=4000
API_URL=https://your-api-domain.com
FRONTEND_URL=https://your-frontend-domain.com

DATABASE_URL=postgresql://user:password@host:5432/dbname
REDIS_URL=redis://:password@host:6379

JWT_SECRET=your-secret-key
REFRESH_TOKEN_SECRET=your-refresh-secret

GROK_API_KEY=your-grok-api-key
GROK_MODEL=grok-2-1212
GROK_API_URL=https://api.x.ai/v1
```

## Step 7: Monitoring & Maintenance

### 7.1 Monitor Vercel Deployment
- Go to **Project Settings** → **Analytics**
- Check build times and performance
- Monitor error rates

### 7.2 View Logs
```bash
# Vercel CLI
vercel logs

# Or in dashboard: Deployments → Select deployment → Logs
```

### 7.3 Rollback if Needed
1. Go to **Deployments**
2. Select previous deployment
3. Click **"Promote to Production"**

## Step 8: Performance Optimization

### 8.1 Enable Caching
In `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### 8.2 Enable Compression
Already enabled by default in Vercel.

### 8.3 Monitor Core Web Vitals
- Check Vercel Analytics dashboard
- Use Google PageSpeed Insights
- Monitor Lighthouse scores

## Troubleshooting

### Issue: 404 on page refresh
**Solution:** SPA routing script is already included in `layout.tsx`. Verify `vercel.json` rewrites are correct.

### Issue: API calls failing
**Solution:** 
1. Check `NEXT_PUBLIC_API_URL` is correct
2. Verify backend is running and accessible
3. Check CORS configuration on backend
4. Review browser console for errors

### Issue: Build failing
**Solution:**
1. Check build logs in Vercel dashboard
2. Verify `apps/web` directory exists
3. Run `npm run build` locally to test
4. Check for TypeScript errors: `npm run type-check`

### Issue: Slow performance
**Solution:**
1. Check Vercel Analytics
2. Optimize images with Next.js Image component
3. Enable ISR (Incremental Static Regeneration)
4. Check backend API response times

## Security Checklist

- ✅ Environment variables are secrets (not in code)
- ✅ HTTPS is enabled (automatic on Vercel)
- ✅ CORS is properly configured
- ✅ JWT secrets are strong and unique
- ✅ Database credentials are secure
- ✅ API keys are rotated regularly
- ✅ Rate limiting is enabled on backend

## Support & Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Railway Documentation](https://docs.railway.app)
- [Heroku Documentation](https://devcenter.heroku.com)

---

**Deployment Status:** Ready for production ✅
