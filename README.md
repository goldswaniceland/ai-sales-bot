# Legacy Paths - MVP Platform

A luxury travel journey builder and booking platform for Iceland experiences.

## Features

### Public Features
- **Journey Catalog**: Browse 3 journey types (ACTIVE, SERENE, EXPLORER)
- **Journey Details**: View detailed day-by-day itineraries
- **Booking Request Flow**: Submit booking requests with add-ons and customization
- **Price Calculator**: Real-time price calculation based on selections

### Admin Features
- **Booking Management**: View and manage all booking requests
- **Dashboard Analytics**: Track pending, confirmed, and cancelled bookings
- **Journey Management**: Full CRUD for journey templates (database level)

### Payment Integration
- **Stripe Integration**: Secure payment processing
- **Split Payments**: 50% deposit upfront, 50% balance before trip
- **Webhook Handling**: Automatic confirmation emails

## Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **React 18** + TypeScript
- **Tailwind CSS** + shadcn/ui components
- **Framer Motion** (animations)

### Backend
- **Next.js API Routes**
- **PostgreSQL** (via Supabase/Railway)
- **Prisma ORM**
- **NextAuth.js** (authentication)

### Services
- **Stripe** (payments)
- **Resend** (emails)
- **Vercel** (hosting)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (local or Supabase/Railway)
- Stripe account (for payments)
- Resend account (for emails)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd legacy-paths
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Fill in the required values in `.env`:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
   - `STRIPE_SECRET_KEY` & `STRIPE_PUBLISHABLE_KEY`: From Stripe dashboard
   - `RESEND_API_KEY`: From Resend dashboard

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run db:generate

   # Push schema to database
   npm run db:push

   # Seed with sample data
   npm run db:seed
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open the app**
   - Public site: http://localhost:3000
   - Admin dashboard: http://localhost:3000/admin/requests
   - Admin login: Use `admin@legacypaths.guide`

## Database Schema

The platform uses the following main models:

- **User**: Customer and admin accounts
- **JourneyTemplate**: Journey definitions (ACTIVE, SERENE, EXPLORER)
- **ItineraryDay**: Day-by-day itinerary for each journey
- **Accommodation**: Hotels and lodging
- **AddOn**: Optional extras (activities, dining, special experiences)
- **BookingRequest**: Customer booking submissions
- **Booking**: Confirmed bookings with payment info
- **Partner**: Hotels, tour operators, etc.

## Seeded Data

After running `npm run db:seed`, you'll have:

- **3 Journey Templates**:
  - Iceland Active Adventure (7 days, $4,500)
  - Iceland Serene Retreat (7 days, $4,200)
  - Iceland Cultural Explorer (7 days, $4,000)

- **6 Add-ons**:
  - Glacier Hiking Experience ($250)
  - Private Hot Spring Tour ($150)
  - Northern Lights Photography Tour ($300)
  - Michelin Star Dinner ($200)
  - Helicopter Volcano Tour ($500)
  - Spa & Wellness Package ($180)

- **3 Accommodations**:
  - Blue Lagoon Retreat & Spa
  - Vik Luxury Lodge
  - Reykjavik Grand Hotel

- **1 Admin User**: admin@legacypaths.guide

## Project Structure

```
legacy-paths/
├── app/
│   ├── (public)/
│   │   ├── page.tsx                 # Homepage
│   │   └── journeys/
│   │       ├── page.tsx             # Journey catalog
│   │       └── [slug]/
│   │           ├── page.tsx         # Journey detail
│   │           └── book/
│   │               └── page.tsx     # Booking flow
│   ├── admin/
│   │   ├── layout.tsx               # Auth wrapper
│   │   └── requests/
│   │       └── page.tsx             # Booking requests
│   ├── api/
│   │   ├── journeys/                # Journey APIs
│   │   ├── booking-requests/        # Booking APIs
│   │   ├── payments/                # Stripe integration
│   │   ├── webhooks/                # Stripe webhooks
│   │   └── auth/                    # NextAuth
│   └── layout.tsx                   # Root layout
├── components/
│   ├── ui/                          # shadcn components
│   ├── JourneyCard.tsx
│   ├── BookingForm.tsx
│   └── PriceCalculator.tsx
├── lib/
│   ├── db.ts                        # Prisma client
│   ├── stripe.ts                    # Stripe client
│   ├── email.ts                     # Email service
│   ├── auth.ts                      # NextAuth config
│   └── utils.ts                     # Utilities
├── prisma/
│   ├── schema.prisma                # Database schema
│   └── seed.ts                      # Seed script
└── package.json
```

## API Routes

### Public APIs

- `GET /api/journeys` - List all published journeys
- `GET /api/journeys/[slug]` - Get single journey details
- `GET /api/add-ons?type=[journeyType]` - Get available add-ons
- `POST /api/booking-requests` - Create booking request

### Payment APIs

- `POST /api/payments/create-intent` - Create Stripe PaymentIntent
- `POST /api/webhooks/stripe` - Handle Stripe webhooks

### Auth APIs

- `POST /api/auth/signin` - Sign in
- `GET /api/auth/session` - Get current session

## Deployment

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Connect to Vercel**
   - Import project from GitHub
   - Set environment variables in Vercel dashboard
   - Deploy

3. **Set up database**
   ```bash
   # Run migrations
   npx prisma migrate deploy

   # Seed data
   npm run db:seed
   ```

4. **Configure Stripe Webhook**
   - Get webhook signing secret from Stripe
   - Add `STRIPE_WEBHOOK_SECRET` to Vercel env vars
   - Set webhook URL: `https://your-domain.com/api/webhooks/stripe`

### Environment Variables for Production

Set these in Vercel dashboard:
- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL` (your production domain)
- `STRIPE_SECRET_KEY` (use live key)
- `STRIPE_WEBHOOK_SECRET`
- `RESEND_API_KEY`

## Development

### Database Commands

```bash
# Generate Prisma client
npm run db:generate

# Push schema changes
npm run db:push

# Create migration
npm run db:migrate

# Seed database
npm run db:seed
```

### Build Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Lint
npm run lint
```

## MVP Scope

### Included ✅
- Public journey catalog
- Journey detail with customization
- Booking request flow
- Admin dashboard (requests, journeys)
- Stripe payment integration
- Email notifications
- User authentication

### Not Included ❌ (Phase 2)
- Real-time availability checking
- Automated proposal generation
- Partner portal
- Mobile app
- Advanced analytics
- Multi-currency
- Booking modifications by user

## Support

For questions or issues, contact:
- **Email**: hello@legacypaths.guide
- **GitHub**: [Repository Issues](link-to-repo)

## License

Copyright © 2024 Legacy Paths. All rights reserved.
