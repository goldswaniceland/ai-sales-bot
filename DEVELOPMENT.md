# Development Guide

## Quick Start

### 1. Initial Setup

```bash
# Clone and install
git clone <repository-url>
cd legacy-paths
npm install

# Set up environment
cp .env.example .env
# Edit .env with your credentials
```

### 2. Database Setup

**Option A: Local PostgreSQL**
```bash
# Install PostgreSQL locally
brew install postgresql  # macOS
# or use Docker:
docker run --name legacy-paths-db -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres

# Update .env
DATABASE_URL="postgresql://postgres:password@localhost:5432/legacy_paths"
```

**Option B: Supabase (Recommended)**
1. Create account at https://supabase.com
2. Create new project
3. Copy connection string to `.env`
4. Database will be hosted and managed for you

**Option C: Railway**
1. Create account at https://railway.app
2. Create new PostgreSQL database
3. Copy connection string to `.env`

### 3. Initialize Database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with sample data
npm run db:seed
```

### 4. Set Up External Services

**Stripe:**
1. Create account at https://stripe.com
2. Get test API keys from Dashboard → Developers → API keys
3. Add to `.env`:
   ```
   STRIPE_SECRET_KEY="sk_test_..."
   STRIPE_PUBLISHABLE_KEY="pk_test_..."
   ```

**Resend:**
1. Create account at https://resend.com
2. Get API key from dashboard
3. Add to `.env`:
   ```
   RESEND_API_KEY="re_..."
   ```

**NextAuth Secret:**
```bash
# Generate secret
openssl rand -base64 32
# Add to .env
NEXTAUTH_SECRET="<generated-secret>"
```

### 5. Run Development Server

```bash
npm run dev
```

Visit:
- http://localhost:3000 - Public site
- http://localhost:3000/admin/requests - Admin (login: admin@legacypaths.guide)

## Development Workflow

### Making Database Changes

1. **Update schema**:
   ```bash
   # Edit prisma/schema.prisma
   ```

2. **Push changes** (development):
   ```bash
   npm run db:push
   ```

3. **Create migration** (production):
   ```bash
   npm run db:migrate
   ```

### Testing Booking Flow

1. Visit http://localhost:3000/journeys
2. Select a journey (e.g., "Iceland Active Adventure")
3. Click "Request Booking"
4. Fill out form and submit
5. Check email (if Resend configured) or console logs
6. View in admin at http://localhost:3000/admin/requests

### Testing Payments

1. Use Stripe test mode
2. Test card number: `4242 4242 4242 4242`
3. Any future expiry date
4. Any 3-digit CVC

### Testing Webhook (Local)

1. Install Stripe CLI:
   ```bash
   brew install stripe/stripe-cli/stripe  # macOS
   ```

2. Login:
   ```bash
   stripe login
   ```

3. Forward webhooks:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

4. Use the webhook signing secret from CLI output in `.env`

## Common Tasks

### Add a New Journey

```typescript
// prisma/seed.ts or admin panel (future feature)
await prisma.journeyTemplate.create({
  data: {
    name: "New Journey Name",
    slug: "new-journey-name",
    type: "ACTIVE", // or SERENE, EXPLORER
    duration: 7,
    basePrice: 500000, // $5,000 in cents
    description: "Journey description...",
    highlights: ["Highlight 1", "Highlight 2"],
    status: "published",
  },
});
```

### Add a New Add-on

```typescript
await prisma.addOn.create({
  data: {
    name: "New Add-on",
    category: "activities",
    price: 15000, // $150 in cents
    description: "Add-on description",
    applicableTo: ["ACTIVE", "EXPLORER"], // or ["all"]
  },
});
```

### Update Admin User

```typescript
// Create admin user if needed
await prisma.user.create({
  data: {
    email: "your-email@example.com",
    name: "Your Name",
    role: "admin",
  },
});
```

## Troubleshooting

### Database Connection Issues

```bash
# Test connection
npx prisma studio
# Opens database browser at localhost:5555
```

### Prisma Issues

```bash
# Reset Prisma client
rm -rf node_modules/.prisma
npm run db:generate

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

### Email Not Sending

- Check Resend API key is correct
- Check email logs in Resend dashboard
- For development, emails are logged to console if Resend not configured

## Project Structure Reference

```
app/
├── (public)/              # Public-facing pages
│   ├── page.tsx          # Homepage
│   └── journeys/         # Journey pages
├── admin/                # Admin dashboard
├── api/                  # API routes
│   ├── journeys/        # Journey APIs
│   ├── booking-requests/
│   ├── payments/        # Stripe integration
│   └── webhooks/        # Stripe webhooks
└── login/               # Login page

components/
├── ui/                  # Reusable UI components
├── JourneyCard.tsx     # Journey display card
├── BookingForm.tsx     # Booking form
└── PriceCalculator.tsx # Price calculation

lib/
├── db.ts               # Prisma client
├── stripe.ts           # Stripe client
├── email.ts            # Email service
├── auth.ts             # NextAuth config
└── utils.ts            # Utilities

prisma/
├── schema.prisma       # Database schema
└── seed.ts            # Seed data
```

## Environment Variables Reference

```bash
# Required
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"
STRIPE_SECRET_KEY="sk_test_..."

# Optional (for full functionality)
STRIPE_WEBHOOK_SECRET="whsec_..."
RESEND_API_KEY="re_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

## Getting Help

- Check README.md for general setup
- Review Prisma docs: https://www.prisma.io/docs
- Review Next.js docs: https://nextjs.org/docs
- Review Stripe docs: https://stripe.com/docs
