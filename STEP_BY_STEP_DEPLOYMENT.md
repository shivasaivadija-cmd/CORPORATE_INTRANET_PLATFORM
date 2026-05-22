# 🚀 Step-by-Step Vercel Deployment Guide

## ✅ Pre-Deployment Checklist

Before you start, make sure:

- [ ] You have a GitHub account
- [ ] You have a Vercel account (free at vercel.com)
- [ ] Your code is pushed to GitHub
- [ ] Backend API is deployed and running
- [ ] You have the backend API URL ready

---

## 📝 Step 1: Prepare Your Code

### 1.1 Commit all changes
```bash
cd d:\corporate-intranet_platform
git add .
git commit -m "chore: prepare for Vercel deployment"
git push origin main
```

### 1.2 Verify files exist
- ✅ `vercel.json` - in root directory
- ✅ `.vercelignore` - in root directory
- ✅ `apps/web/src/app/layout.tsx` - contains SPA routing script

---

## 🌐 Step 2: Go to Vercel

1. Open browser and go to: **https://vercel.com**
2. Click **"Sign Up"** or **"Log In"** (if you have account)
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub account

---

## 📦 Step 3: Create New Project

1. After login, click **"New Project"** (top right)
2. Click **"Import Git Repository"**
3. Search for: `corporate-intranet-platform`
4. Click **"Import"**

---

## ⚙️ Step 4: Configure Project

### 4.1 Project Settings
- **Project Name:** `corporate-intranet-platform` (or your choice)
- **Framework:** `Next.js` (auto-detected)
- **Root Directory:** `apps/web` (IMPORTANT!)

### 4.2 Build Settings
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`

### 4.3 Environment Variables

Click **"Environment Variables"** and add:

**Variable 1:**
- Name: `NEXT_PUBLIC_API_URL`
- Value: `https://your-api-domain.com/api/v1`
  - Example: `https://my-api.railway.app/api/v1`
  - Example: `https://my-app.herokuapp.com/api/v1`

**Variable 2:**
- Name: `NEXT_PUBLIC_WS_URL`
- Value: `https://your-api-domain.com`
  - Example: `https://my-api.railway.app`
  - Example: `https://my-app.herokuapp.com`

---

## 🚀 Step 5: Deploy

1. Click **"Deploy"** button
2. Wait for build to complete (usually 2-5 minutes)
3. You'll see a success message with your deployment URL

---

## ✨ Step 6: Verify Deployment

### 6.1 Check Frontend
1. Click the deployment URL
2. You should see the login page
3. Try logging in with demo credentials:
   - Email: `admin@acme.com`
   - Password: `Password123!`

### 6.2 Test Navigation
- [ ] Click on different pages (Feed, Documents, etc.)
- [ ] Refresh the page (should not show 404)
- [ ] Check browser console for errors (F12)

### 6.3 Test API Connection
- [ ] Try creating a post
- [ ] Try uploading a document
- [ ] Check Network tab (F12 → Network) for API calls
- [ ] Verify API calls go to your backend URL

### 6.4 Test AI Customer Support
- [ ] Go to AI Customer Support page
- [ ] Ask a question
- [ ] Verify it responds correctly

---

## 🌍 Step 7: Add Custom Domain (Optional)

### 7.1 In Vercel Dashboard
1. Go to **Project Settings** → **Domains**
2. Click **"Add Domain"**
3. Enter your domain: `intranet.yourdomain.com`
4. Click **"Add"**

### 7.2 Configure DNS
1. Vercel will show DNS records to add
2. Go to your domain registrar (GoDaddy, Namecheap, etc.)
3. Add the DNS records provided by Vercel
4. Wait 24-48 hours for DNS to propagate

### 7.3 Verify Domain
1. After DNS propagates, visit your domain
2. Should show your deployed app
3. SSL certificate auto-issued

---

## 🔧 Step 8: Configure Backend (If Not Done)

### Option A: Deploy to Railway

```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Create new project
railway init

# 4. Set environment variables
railway variables set DATABASE_URL=your_db_url
railway variables set JWT_SECRET=your_secret
railway variables set GROK_API_KEY=your_key

# 5. Deploy
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
heroku config:set DATABASE_URL=your_db_url
heroku config:set JWT_SECRET=your_secret

# 5. Deploy
git push heroku main
```

---

## 📊 Step 9: Monitor Deployment

### 9.1 View Deployments
1. Go to **Deployments** tab in Vercel
2. See all deployment history
3. Click on any deployment to see details

### 9.2 Check Analytics
1. Go to **Analytics** tab
2. Monitor:
   - Page load times
   - Error rates
   - Traffic patterns
   - Core Web Vitals

### 9.3 View Logs
1. Click on a deployment
2. Scroll to **"Logs"** section
3. See build and runtime logs

---

## 🔄 Step 10: Continuous Deployment

### Auto-Deploy on Push
- Every time you push to `main` branch, Vercel auto-deploys
- No manual action needed
- Takes 2-5 minutes

### Manual Redeploy
1. Go to **Deployments** tab
2. Click **"Redeploy"** on any deployment
3. Or push a new commit to trigger deploy

---

## 🆘 Troubleshooting

### Issue: Build Fails
**Solution:**
1. Check build logs in Vercel dashboard
2. Run locally: `npm run build`
3. Fix any errors
4. Push to GitHub
5. Vercel will auto-redeploy

### Issue: 404 on Page Refresh
**Solution:**
1. Verify `vercel.json` is in root directory
2. Check rewrites configuration
3. Verify SPA routing script in `layout.tsx`
4. Redeploy

### Issue: API Calls Failing
**Solution:**
1. Check `NEXT_PUBLIC_API_URL` environment variable
2. Verify backend is running
3. Check CORS configuration on backend
4. Check Network tab (F12) for actual API URL

### Issue: Slow Performance
**Solution:**
1. Check Vercel Analytics
2. Optimize images
3. Check backend API response times
4. Enable caching

### Issue: Domain Not Working
**Solution:**
1. Wait 24-48 hours for DNS propagation
2. Check DNS records are correct
3. Use DNS checker: https://dnschecker.org
4. Contact domain registrar if issues persist

---

## 📋 Post-Deployment Checklist

- [ ] Frontend loads without errors
- [ ] Login works with demo credentials
- [ ] Can navigate between pages
- [ ] Page refresh doesn't cause 404
- [ ] API calls work (check Network tab)
- [ ] Create post functionality works
- [ ] Upload documents works
- [ ] AI Customer Support responds
- [ ] Mobile responsive design works
- [ ] Analytics dashboard shows traffic
- [ ] No errors in browser console
- [ ] Custom domain works (if added)

---

## 🎯 Common Environment Variable Values

### For Railway Backend
```
NEXT_PUBLIC_API_URL=https://your-project-name.up.railway.app/api/v1
NEXT_PUBLIC_WS_URL=https://your-project-name.up.railway.app
```

### For Heroku Backend
```
NEXT_PUBLIC_API_URL=https://your-app-name.herokuapp.com/api/v1
NEXT_PUBLIC_WS_URL=https://your-app-name.herokuapp.com
```

### For Self-Hosted Backend
```
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api/v1
NEXT_PUBLIC_WS_URL=https://api.yourdomain.com
```

---

## 📞 Getting Help

- **Vercel Support:** https://vercel.com/support
- **Vercel Docs:** https://vercel.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **GitHub Issues:** Create issue in your repository

---

## ✅ Deployment Complete!

Your application is now live on Vercel! 🎉

**Your Deployment URL:** `https://your-project-name.vercel.app`

**Next Steps:**
1. Share the URL with your team
2. Monitor analytics
3. Set up custom domain (optional)
4. Configure backend if not done
5. Test all features thoroughly

---

**Deployment Date:** _______________

**Deployed By:** _______________

**Status:** ✅ Live in Production
