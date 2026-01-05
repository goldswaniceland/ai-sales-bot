# Deployment Guide

## Deploying to Vercel

### Prerequisites

- GitHub repository with the code
- Vercel account (free tier is sufficient for MVP)
- Supabase or Railway account for database
- Stripe account (test mode for staging, live mode for production)
- Resend account for emails

### Step 1: Set Up Database

**Using Supabase (Recommended):**

1. Go to https://supabase.com
2. Create a new project
3. Wait for database to initialize (~2 minutes)
4. Go to Project Settings → Database
5. Copy the connection string (Connection pooling → Transaction mode)
6. Format: `postgresql://postgres:[PASSWORD]@[HOST]:6543/postgres?pgbouncer=true`

**Using Railway:**

1. Go to https://railway.app
2. Create new project → Add PostgreSQL
3. Copy the connection string from the PostgreSQL service

### Step 2: Deploy to Vercel

1. **Connect Repository**
   - Go to https://vercel.com
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Select the repository

2. **Configure Build Settings**
   - Framework Preset: Next.js
   - Build Command: `prisma generate && next build`
   - Install Command: `npm install`
   - Output Directory: `.next`

3. **Add Environment Variables**

   Click "Environment Variables" and add:

   ```bash
   # Database
   DATABASE_URL=postgresql://...  # From Supabase/Railway

   # NextAuth
   NEXTAUTH_SECRET=  # Generate with: openssl rand -base64 32
   NEXTAUTH_URL=https://your-domain.vercel.app

   # Stripe (use test keys initially)
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_WEBHOOK_SECRET=  # Leave empty for now, will add after webhook setup

   # Email
   RESEND_API_KEY=re_...
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (~2-3 minutes)

### Step 3: Initialize Database

After deployment completes:

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Link Project**
   ```bash
   vercel link
   ```

4. **Push Database Schema**
   ```bash
   # Pull environment variables
   vercel env pull .env.production

   # Use production env
   export $(cat .env.production | xargs)

   # Push schema
   npx prisma db push
   ```

5. **Seed Database**
   ```bash
   npm run db:seed
   ```

### Step 4: Configure Stripe Webhook

1. **Get Webhook URL**
   - Your webhook URL: `https://your-domain.vercel.app/api/webhooks/stripe`

2. **Create Webhook in Stripe**
   - Go to Stripe Dashboard → Developers → Webhooks
   - Click "Add endpoint"
   - Endpoint URL: `https://your-domain.vercel.app/api/webhooks/stripe`
   - Select events: `payment_intent.succeeded`
   - Click "Add endpoint"

3. **Get Signing Secret**
   - Click on the webhook you just created
   - Copy the "Signing secret" (starts with `whsec_`)

4. **Add to Vercel**
   - Go to Vercel project → Settings → Environment Variables
   - Add `STRIPE_WEBHOOK_SECRET` with the signing secret
   - Redeploy the project

### Step 5: Configure Custom Domain (Optional)

1. Go to Vercel project → Settings → Domains
2. Add your custom domain (e.g., `legacypaths.guide`)
3. Update DNS records as instructed by Vercel
4. Update `NEXTAUTH_URL` environment variable to your custom domain
5. Redeploy

### Step 6: Test Production Deployment

1. **Visit your site**
   - Homepage: `https://your-domain.vercel.app`
   - Journeys: `https://your-domain.vercel.app/journeys`

2. **Test booking flow**
   - Select a journey
   - Submit booking request
   - Check if emails are sent (check Resend dashboard)

3. **Test admin access**
   - Go to: `https://your-domain.vercel.app/login`
   - Login with: `admin@legacypaths.guide`
   - View booking requests

4. **Test payment (test mode)**
   - Use test card: `4242 4242 4242 4242`
   - Verify webhook receives payment confirmation

### Step 7: Switch to Live Mode (When Ready)

1. **Get Stripe Live Keys**
   - Go to Stripe Dashboard
   - Toggle to "Live mode"
   - Get live API keys

2. **Update Environment Variables**
   ```bash
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_PUBLISHABLE_KEY=pk_live_...
   ```

3. **Create Live Webhook**
   - Create new webhook in Stripe (live mode)
   - Same URL: `https://your-domain.vercel.app/api/webhooks/stripe`
   - Get new signing secret
   - Update `STRIPE_WEBHOOK_SECRET` in Vercel

4. **Redeploy**

## Monitoring & Maintenance

### View Logs

```bash
# View recent logs
vercel logs

# Follow logs in real-time
vercel logs --follow
```

### Database Management

**Using Prisma Studio:**
```bash
# Pull production env
vercel env pull

# Open Prisma Studio
npx prisma studio
```

**Backup Database:**
- For Supabase: Use built-in backup feature
- For Railway: Use PostgreSQL dump
  ```bash
  pg_dump $DATABASE_URL > backup.sql
  ```

### Performance Monitoring

1. **Vercel Analytics**
   - Go to project → Analytics
   - Monitor page views, performance metrics

2. **Stripe Dashboard**
   - Monitor payments, disputes
   - Track revenue

3. **Resend Dashboard**
   - Monitor email delivery
   - Check bounce rates

### Updating the Application

1. **Push changes to GitHub**
   ```bash
   git push origin main
   ```

2. **Vercel auto-deploys**
   - Monitors main branch
   - Deploys automatically on push
   - ~2-3 minute deploy time

3. **Database migrations**
   ```bash
   # If schema changed
   vercel env pull
   npx prisma migrate deploy
   ```

## Common Issues

### Build Failures

**Prisma generation fails:**
- Check `DATABASE_URL` is set correctly
- Ensure `prisma generate` is in build command

**TypeScript errors:**
- Run `npm run lint` locally first
- Fix all type errors before deploying

### Runtime Errors

**Database connection issues:**
- Verify `DATABASE_URL` format
- Check database is accessible (not paused)
- For Supabase, use connection pooling URL

**Webhook not working:**
- Check `STRIPE_WEBHOOK_SECRET` is set
- Verify webhook URL in Stripe dashboard
- Check Vercel logs for errors

**Emails not sending:**
- Verify `RESEND_API_KEY` is set
- Check Resend dashboard for errors
- Verify "from" email is verified in Resend

## Security Checklist

- [ ] `NEXTAUTH_SECRET` is strong and unique
- [ ] Database credentials are secure
- [ ] Stripe live keys are only in production
- [ ] Environment variables are not committed to git
- [ ] CORS is properly configured
- [ ] Admin access is restricted
- [ ] SSL/HTTPS is enabled (automatic with Vercel)

## Cost Estimates (MVP Scale)

**Vercel:** Free tier (sufficient for MVP)
**Supabase:** Free tier (up to 500MB database)
**Stripe:** Pay per transaction (2.9% + $0.30)
**Resend:** Free tier (3,000 emails/month)

**Total Monthly Cost:** ~$0 for MVP testing

For production with ~100 bookings/month:
- Vercel: $20/month (Pro plan recommended)
- Supabase: $25/month (Pro plan)
- Stripe: Transaction fees only
- Resend: $10/month (50k emails)
- **Total: ~$55/month + transaction fees**
