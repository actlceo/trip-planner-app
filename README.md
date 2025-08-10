# Itinerary MVP — Next.js 14 + Prisma (Postgres) + NextAuth + PDF

## Quickstart
1. `pnpm install`
2. Copy `.env.example` to `.env` and fill values (Postgres + SMTP).
3. `pnpm migrate`  (runs `prisma migrate dev`)
4. `pnpm dev` → http://localhost:3000
   - Sign in at `/api/auth/signin`
   - Create a trip on the homepage
   - Visit `/dashboard` to export a PDF

## Scripts
- `pnpm dev` — run dev server
- `pnpm build` / `pnpm start` — production build
- `pnpm migrate` — Prisma migrate

## Notes
- PDF export checks ownership so only the trip owner can download.
- Switch to Neon/Supabase for hosted Postgres and set `DATABASE_URL`.
