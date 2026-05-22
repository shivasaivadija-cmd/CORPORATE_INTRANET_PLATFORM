# 🚀 Connect GitHub to Vercel - Complete Guide

## ✅ Your Code is Ready!

Your changes have been successfully committed and pushed to GitHub:

```
✅ Commit: feat: add Vercel deployment configuration and documentation
✅ Files Changed: 19
✅ Insertions: 2837+
✅ Status: Pushed to GitHub main branch
```

---

## 🔗 Step 1: Go to Vercel

1. Open your browser
2. Visit: **https://vercel.com**
3. Click **"Sign Up"** or **"Log In"**

---

## 🔐 Step 2: Sign In with GitHub

1. Click **"Continue with GitHub"**
2. You'll be redirected to GitHub
3. Click **"Authorize Vercel"**
4. GitHub will ask for permissions - click **"Authorize vercel"**
5. You'll be redirected back to Vercel

---

## 📦 Step 3: Create New Project

1. After login, you'll see Vercel dashboard
2. Click **"New Project"** (top right button)
3. You'll see: **"Import Git Repository"**

---

## 🔍 Step 4: Select Your Repository

1. In the search box, type: **corporate**
2. You should see: **shivasaivadija-cmd/corporate_infranet_platform**
3. Click **"Import"**

---

## ⚙️ Step 5: Configure Project

### 5.1 Project Name
- **Name:** `corporate-intranet-platform` (or your choice)
- Click **"Continue"**

### 5.2 Framework & Build Settings
Vercel will auto-detect:
- **Framework:** Next.js ✅
- **Root Directory:** Leave blank (Vercel will detect)

Click **"Edit"** if you need to change:
- **Root Directory:** `apps/web`
- **Build Command:** `npm run build`
- **Output Directory:** `.next`

### 5.3 Environment Variables

Click **"Environment Variables"** and add:

**Variable 1:**
```
Name: NEXT_PUBLIC_API_URL
Value: https://your-api-domain.com/api/v1
```

**Variable 2:**
```
Name: NEXT_PUBLIC_WS_URL
Value: https://your-api-domain.com
```

**Example Values:**
- Railway: `https://your-project.up.railway.app/api/v1`
- Heroku: `https://your-app.herokuapp.com/api/v1`
- Self-hosted: `https://api.yourdomain.com/api/v1`

---

## 🚀 Step 6: Deploy

1. Click **"Deploy"** button
2. Vercel will start building your project
3. Wait 2-5 minutes for build to complete
4. You'll see a success message with your deployment URL

---

## ✨ Step 7: Verify Deployment

### 7.1 Check Deployment URL
1. Click the deployment URL
2. You should see the login page
3. Try logging in:
   - Email: `admin@acme.com`
   - Password: `Password123!`

### 7.2 Test Navigation
- [ ] Click on different pages
- [ ] Refresh page (should not show 404)
- [ ] Check browser console (F12) for errors

### 7.3 Test API Connection
- [ ] Try creating a post
- [ ] Try uploading a document
- [ ] Check Network tab (F12 → Network) for API calls

---

## 🌍 Step 8: Add Custom Domain (Optional)

### 8.1 In Vercel Dashboard
1. Go to **Project Settings** → **Domains**
2. Click **"Add Domain"**
3. Enter your domain: `intranet.yourdomain.com`
4. Click **"Add"**

### 8.2 Configure DNS
1. Vercel will show DNS records
2. Go to your domain registrar (GoDaddy, Namecheap, etc.)
3. Add the DNS records provided by Vercel
4. Wait 24-48 hours for DNS to propagate

---

## 📊 Step 9: Monitor Your Deployment

### 9.1 View Deployments
1. Go to **Deployments** tab
2. See all deployment history
3. Click on any deployment for details

### 9.2 Check Analytics
1. Go to **Analytics** tab
2. Monitor:
   - Page load times
   - Error rates
   - Traffic patterns

### 9.3 View Logs
1. Click on a deployment
2. Scroll to **"Logs"** section
3. See build and runtime logs

---

## 🔄 Step 10: Automatic Deployments

### How It Works
- Every time you push to `main` branch, Vercel auto-deploys
- No manual action needed
- Takes 2-5 minutes

### Manual Redeploy
1. Go to **Deployments** tab
2. Click **"Redeploy"** on any deployment
3. Or push a new commit to trigger deploy

---

## 🆘 Troubleshooting

### Build Fails
**Solution:**
1. Check build logs in Vercel dashboard
2. Run locally: `npm run build`
3. Fix any errors
4. Push to GitHub
5. Vercel will auto-redeploy

### 404 on Page Refresh
**Solution:**
1. Verify `vercel.json` is in root directory
2. Check rewrites configuration
3. Verify SPA routing script in `layout.tsx`
4. Redeploy

### API Calls Failing
**Solution:**
1. Check `NEXT_PUBLIC_API_URL` environment variable
2. Verify backend is running
3. Check CORS configuration on backend
4. Check Network tab (F12) for actual API URL

### Slow Performance
**Solution:**
1. Check Vercel Analytics
2. Optimize images
3. Check backend API response times
4. Enable caching

---

## 📋 Quick Reference

### Your GitHub Repository
```
Repository: shivasaivadija-cmd/corporate_infranet_platform
Branch: main
Status: ✅ Ready for Vercel
```

### Vercel Configuration
```
Framework: Next.js
Root Directory: apps/web
Build Command: npm run build
Output Directory: .next
```

### Environment Variables
```
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api/v1
NEXT_PUBLIC_WS_URL=https://your-api-domain.com
```

---

## ✅ Deployment Checklist

- [ ] GitHub account connected to Vercel
- [ ] Repository imported to Vercel
- [ ] Project name set
- [ ] Root directory configured: `apps/web`
- [ ] Build command set: `npm run build`
- [ ] Environment variables added
- [ ] Deploy button clicked
- [ ] Build completed successfully
- [ ] Deployment URL working
- [ ] Login works
- [ ] API calls work
- [ ] Page refresh works

---

## 🎯 Next Steps After Deployment

1. **Test Everything**
   - Login with demo credentials
   - Navigate all pages
   - Test API calls
   - Check mobile responsiveness

2. **Monitor Performance**
   - Check Vercel Analytics
   - Monitor error rates
   - Review build times

3. **Setup Custom Domain** (Optional)
   - Add domain in Vercel
   - Configure DNS records
   - Wait for DNS propagation

4. **Deploy Backend** (If not done)
   - Choose: Railway, Heroku, or self-hosted
   - Deploy API
   - Update environment variables

5. **Setup Monitoring**
   - Enable error tracking
   - Setup performance monitoring
   - Configure alerts

---

## 📞 Support

- **Vercel Support:** https://vercel.com/support
- **Vercel Docs:** https://vercel.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **GitHub Issues:** Your repository

---

## 🎉 You're All Set!

Your application is now connected to Vercel and ready to deploy!

### Summary
✅ Code committed to GitHub
✅ Changes pushed to main branch
✅ Ready to connect to Vercel
✅ All configuration files in place
✅ Documentation complete

### Next Action
**Go to:** https://vercel.com/new

**Import:** shivasaivadija-cmd/corporate_infranet_platform

**Deploy:** Click "Deploy" button

---

**Status:** ✅ Ready for Vercel Deployment

**Deployment Time:** 5-10 minutes

**Support:** See documentation files for help
