# 📋 Vercel Deployment Quick Reference

## Installation & Setup

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Navigate to project root
cd d:\corporate-intranet_platform
```

## Deploy to Vercel

### Option 1: Using Vercel Dashboard (Recommended)

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your GitHub repository
4. Configure:
   - **Framework:** Next.js
   - **Root Directory:** `apps/web`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
5. Add Environment Variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-api-domain.com/api/v1
   NEXT_PUBLIC_WS_URL=https://your-api-domain.com
   ```
6. Click "Deploy"

### Option 2: Using Vercel CLI

```bash
# Deploy from project root
vercel --prod

# Or deploy specific app
vercel --prod --cwd apps/web

# With environment variables
vercel --prod --env NEXT_PUBLIC_API_URL=https://your-api.com/api/v1
```

## Environment Variables

### Set via CLI
```bash
vercel env add NEXT_PUBLIC_API_URL
# Enter value: https://your-api-domain.com/api/v1

vercel env add NEXT_PUBLIC_WS_URL
# Enter value: https://your-api-domain.com
```

### View Environment Variables
```bash
vercel env list
```

### Remove Environment Variable
```bash
vercel env remove NEXT_PUBLIC_API_URL
```

## Domain Configuration

### Add Custom Domain
```bash
vercel domains add yourdomain.com
```

### List Domains
```bash
vercel domains list
```

### Remove Domain
```bash
vercel domains remove yourdomain.com
```

## Deployment Management

### View Deployments
```bash
vercel list
```

### View Specific Deployment
```bash
vercel inspect <deployment-url>
```

### Promote Previous Deployment
```bash
vercel promote <deployment-url>
```

### Rollback to Previous Deployment
```bash
vercel rollback
```

## Logs & Monitoring

### View Build Logs
```bash
vercel logs <deployment-url>
```

### View Function Logs
```bash
vercel logs <deployment-url> --follow
```

### View Analytics
```bash
vercel analytics
```

## Local Testing

### Build Locally
```bash
npm run build
```

### Test Build Locally
```bash
npm run build
npm run start
```

### Preview Deployment Locally
```bash
vercel --prod --local
```

## Troubleshooting Commands

### Clear Cache
```bash
vercel env pull
```

### Rebuild Deployment
```bash
vercel rebuild <deployment-url>
```

### Check Project Configuration
```bash
vercel project list
```

### View Project Settings
```bash
vercel project inspect
```

## CI/CD Integration

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install Vercel CLI
        run: npm install -g vercel
      
      - name: Deploy to Vercel
        run: vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
```

## Performance Optimization

### Enable Caching
```bash
# Already configured in vercel.json
# Check: vercel.json → headers section
```

### Monitor Performance
```bash
vercel analytics
```

### Check Build Size
```bash
npm run build
# Check .next/static folder size
```

## Security

### Rotate Secrets
```bash
# Remove old secret
vercel env remove GROK_API_KEY

# Add new secret
vercel env add GROK_API_KEY
```

### View Secret Usage
```bash
vercel env list
```

## Useful Links

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Project Settings:** https://vercel.com/dashboard/[project-name]/settings
- **Deployments:** https://vercel.com/dashboard/[project-name]/deployments
- **Analytics:** https://vercel.com/dashboard/[project-name]/analytics
- **Domains:** https://vercel.com/dashboard/[project-name]/domains

## Common Issues & Solutions

### Build Fails
```bash
# Clear cache and rebuild
vercel rebuild <deployment-url>

# Or redeploy
vercel --prod
```

### Environment Variables Not Working
```bash
# Pull latest env vars
vercel env pull

# Redeploy
vercel --prod
```

### Domain Not Resolving
```bash
# Check DNS records
vercel domains inspect yourdomain.com

# Wait 24-48 hours for DNS propagation
```

### API Calls Failing
```bash
# Check environment variables
vercel env list

# Verify API URL is correct
# Check CORS on backend
# Check backend is running
```

## Deployment Workflow

```bash
# 1. Make changes locally
git add .
git commit -m "feat: add new feature"

# 2. Push to GitHub
git push origin main

# 3. Vercel auto-deploys (if connected)
# Or manually deploy:
vercel --prod

# 4. Monitor deployment
vercel logs <deployment-url>

# 5. Test in production
# Visit https://your-domain.com

# 6. If issues, rollback
vercel rollback
```

---

**Quick Deploy Command:**
```bash
vercel --prod
```

**View Deployment:**
```bash
vercel list
```

**Check Logs:**
```bash
vercel logs <url>
```
