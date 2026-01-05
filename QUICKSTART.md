# Quick Start Guide - Legacy Paths MVP

Get the platform running locally in **5 minutes**.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (we recommend Supabase free tier)

## Setup Steps

### 1. Install Dependencies (30 seconds)

```bash
npm install
```

### 2. Set Up Database (2 minutes)

**Option A: Supabase (Easiest)**

1. Go to https://supabase.com and create free account
2. Create new project (choose a password)
3. Wait for database to initialize (~2 min)
4. Go to Project Settings → Database → Connection String
5. Copy the "URI" connection string

**Option B: Local PostgreSQL**

```bash
# macOS
brew install postgresql
brew services start postgresql
createdb legacy_paths

# Docker
docker run --name legacy-db -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres
```

### 3. Configure Environment (1 minute)

```bash
# Copy example env file
cp .env.example .env

# Edit .env and add:
# 1. DATABASE_URL (from Supabase or local)
# 2. NEXTAUTH_SECRET (generate below)
```

**Generate NextAuth Secret:**
```bash
openssl rand -base64 32
```

### 4. Initialize Database (1 minute)

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with sample data (3 journeys, 6 add-ons)
npm run db:seed
```

### 5. Run! (30 seconds)

```bash
npm run dev
```

## ✅ You're Running!

Visit these URLs:

- **Homepage**: http://localhost:3000
- **Journey Catalog**: http://localhost:3000/journeys
- **Admin Login**: http://localhost:3000/login
  - Email: `admin@legacypaths.guide`
  - (No password needed in MVP)
- **Admin Dashboard**: http://localhost:3000/admin/requests

## Test the Platform

### 1. Browse Journeys
- Go to http://localhost:3000/journeys
- Click on any journey to see details

### 2. Submit a Booking Request
- On journey detail page, click "Request Booking"
- Fill out the form
- Select add-ons (optional)
- Submit
- You'll see success message

### 3. View in Admin
- Go to http://localhost:3000/login
- Enter: `admin@legacypaths.guide`
- View the booking request you just submitted

## Optional: Enable Emails & Payments

### Enable Email Notifications

1. Sign up at https://resend.com (free tier: 3k emails/month)
2. Get API key from dashboard
3. Add to `.env`:
   ```bash
   RESEND_API_KEY="re_..."
   ```
4. Restart dev server

### Enable Stripe Payments

1. Sign up at https://stripe.com
2. Get test API keys (Dashboard → Developers → API keys)
3. Add to `.env`:
   ```bash
   STRIPE_SECRET_KEY="sk_test_..."
   STRIPE_PUBLISHABLE_KEY="pk_test_..."
   ```
4. Restart dev server

## What's Included?

The seed script creates:

**3 Journey Templates:**
- Iceland Active Adventure - 7 days, $4,500
- Iceland Serene Retreat - 7 days, $4,200
- Iceland Cultural Explorer - 7 days, $4,000

**6 Add-ons:**
- Glacier Hiking Experience - $250
- Private Hot Spring Tour - $150
- Northern Lights Photography Tour - $300
- Michelin Star Dinner - $200
- Helicopter Volcano Tour - $500
- Spa & Wellness Package - $180

**3 Accommodations:**
- Blue Lagoon Retreat & Spa (Grindavík)
- Vik Luxury Lodge (Vík í Mýrdal)
- Reykjavik Grand Hotel (Reykjavík)

**1 Admin User:**
- admin@legacypaths.guide

## Common Issues

### "Can't connect to database"
- Check DATABASE_URL in .env is correct
- Make sure database is running
- For Supabase, verify project is not paused

### "Prisma Client did not initialize"
```bash
rm -rf node_modules/.prisma
npm run db:generate
```

### Port 3000 already in use
```bash
# Use different port
PORT=3001 npm run dev
```

## Next Steps

1. **Read the docs**:
   - `README.md` - Full documentation
   - `DEVELOPMENT.md` - Development guide
   - `DEPLOYMENT.md` - Deploy to production

2. **Customize**:
   - Edit journey data in `prisma/seed.ts`
   - Modify styles in `app/globals.css`
   - Update branding and copy

3. **Deploy**:
   - Push to GitHub
   - Deploy to Vercel (free)
   - See `DEPLOYMENT.md` for guide

## Need Help?

- Check `README.md` for detailed docs
- Check `DEVELOPMENT.md` for troubleshooting
- Review code comments for implementation details

## File Structure Quick Reference

```
app/
  ├── page.tsx              → Homepage
  ├── journeys/
  │   ├── page.tsx          → Journey catalog
  │   └── [slug]/
  │       ├── page.tsx      → Journey detail
  │       └── book/
  │           └── page.tsx  → Booking form
  ├── admin/
  │   └── requests/
  │       └── page.tsx      → Admin dashboard
  └── api/
      ├── journeys/         → Journey APIs
      ├── booking-requests/ → Booking APIs
      └── payments/         → Stripe integration

prisma/
  ├── schema.prisma         → Database schema
  └── seed.ts              → Sample data

lib/
  ├── db.ts                → Database client
  ├── auth.ts              → Authentication
  ├── stripe.ts            → Stripe integration
  └── email.ts             → Email service
```

Happy coding! 🚀
