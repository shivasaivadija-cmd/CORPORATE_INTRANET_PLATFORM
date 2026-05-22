# 🚀 Quick Deployment Checklist

## Pre-Deployment

- [ ] All code committed to GitHub
- [ ] No sensitive data in code (check .env files)
- [ ] All tests passing locally
- [ ] Build succeeds locally: `npm run build`
- [ ] No TypeScript errors: `npm run type-check`
- [ ] Backend API is deployed and running
- [ ] Database migrations are up to date

## Vercel Configuration

- [ ] `vercel.json` exists in root directory
- [ ] `.vercelignore` exists in root directory
- [ ] `apps/web/src/app/layout.tsx` has SPA routing script
- [ ] Environment variables are set in Vercel dashboard:
  - [ ] `NEXT_PUBLIC_API_URL`
  - [ ] `NEXT_PUBLIC_WS_URL`

## Deployment Steps

1. [ ] Go to [vercel.com](https://vercel.com)
2. [ ] Click "New Project"
3. [ ] Import GitHub repository
4. [ ] Select `corporate-intranet_platform` repo
5. [ ] Set Root Directory to `apps/web`
6. [ ] Add environment variables
7. [ ] Click "Deploy"
8. [ ] Wait for build to complete

## Post-Deployment Testing

- [ ] Frontend loads without errors
- [ ] Login works with demo credentials
- [ ] Can navigate between pages
- [ ] API calls work (check Network tab)
- [ ] Create post functionality works
- [ ] Upload documents works
- [ ] AI Customer Support responds
- [ ] Page refresh doesn't cause 404
- [ ] Mobile responsive design works

## Custom Domain (Optional)

- [ ] Domain added in Vercel dashboard
- [ ] DNS records configured
- [ ] SSL certificate issued (automatic)
- [ ] Domain resolves correctly

## Monitoring

- [ ] Check Vercel Analytics dashboard
- [ ] Monitor error rates
- [ ] Check build times
- [ ] Review performance metrics

## Rollback Plan

- [ ] Know how to access previous deployments
- [ ] Know how to promote previous deployment
- [ ] Have backend rollback plan ready

---

**Status:** Ready to deploy ✅

**Deployment URL:** `https://your-vercel-url.vercel.app`

**Backend API URL:** `https://your-api-domain.com`

**Date Deployed:** _______________

**Deployed By:** _______________
