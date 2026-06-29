# Gaming Stores UAE — 20-Phase Roadmap

> **For AI agents (Claude Code, Cursor, etc.):** Read this before starting work. Each phase is a self-contained PR-sized unit. Complete phases in order unless the user directs otherwise. Mark phases done in this file when merged.

## Vision

A **Skyscanner for gaming gear in the UAE** — compare store offers (websites, Instagram, WhatsApp, TikTok sellers) by price, warranty, reviews, and delivery. Strong enough to become the default price-check tool for UAE gamers.

## Live stack (do not change without explicit approval)

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 App Router |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| Database | PostgreSQL via Supabase (Vercel) |
| ORM | Prisma 6 |
| Hosting | Vercel (`gaming-stores.vercel.app`) |
| Auth | None yet — Phase 3 |

## Architecture principles (all phases)

1. **Server Actions over REST** — admin CRUD uses `src/app/admin/*/actions.ts`, not API routes.
2. **DB layer in `src/lib/db/`** — one file per entity (`stores.ts`, `products.ts`, `listings.ts`). Mappers in `mappers.ts`.
3. **Prisma + pooled Postgres** — runtime uses `POSTGRES_URL` via `src/lib/db/connection.ts` (`pgbouncer=true`). Migrations use `POSTGRES_URL_NON_POOLING`.
4. **No seed on production build** — `npm run build` runs migrations only. Local seed via `npm run db:seed`.
5. **One PR per phase** — branch naming: `cursor/<phase-slug>-8afd`.
6. **Match existing admin UI** — violet accent, dark `#060b14` / `#0b1220` backgrounds, sidebar layout.

## Current state (Phases 1–2 complete)

- [x] Public comparison UI (`/`, `/products`, `/products/[slug]`, `/stores`)
- [x] Sort modes: cheapest, warranty, reviews, fastest
- [x] Admin CRUD: stores, products, listings
- [x] Price history on listing price changes
- [x] Vercel + Supabase production deploy

## Data model (today)

```
Store ──┐
        ├── Listing (price, warranty, source, shipping, inStock)
Product ┘
              └── PriceHistory (price snapshots)
```

---

## Phase 3 — Admin auth & security

**Goal:** Protect `/admin` from public access.

**Deliverables:**
- [ ] Add NextAuth.js (or Clerk) with email/password or magic link
- [ ] `User` model in Prisma (`role: admin | viewer`)
- [ ] Middleware: redirect unauthenticated users from `/admin/*`
- [ ] Login page at `/admin/login`
- [ ] Env vars: `AUTH_SECRET`, provider credentials

**Key files:** `src/middleware.ts`, `src/app/admin/login/page.tsx`, `prisma/schema.prisma`

**Acceptance:** `/admin` returns login when not authenticated. Admin user can CRUD after login.

---

## Phase 4 — Public UX polish & discoverability

**Goal:** Make the live site feel finished, not MVP.

**Deliverables:**
- [ ] Admin link in header (if not merged)
- [ ] Footer with links, live URL, “how it works”
- [ ] Empty states on `/products` and `/stores` when DB is empty
- [ ] Loading skeletons on product comparison page
- [ ] 404 and error pages styled to match site
- [ ] Open Graph / Twitter meta tags on product pages

**Key files:** `src/components/Header.tsx`, `src/app/(site)/layout.tsx`, `src/app/not-found.tsx`

**Acceptance:** Product share links preview correctly on WhatsApp/Twitter.

---

## Phase 5 — SEO & structured data

**Goal:** Rank on Google for “RTX 5080 price UAE” style queries.

**Deliverables:**
- [ ] `sitemap.xml` (dynamic from products + stores)
- [ ] `robots.txt`
- [ ] JSON-LD `Product` + `Offer` schema on `/products/[slug]`
- [ ] Canonical URLs, meta descriptions per product
- [ ] Category landing pages: `/products/category/graphics-cards`

**Key files:** `src/app/sitemap.ts`, `src/app/robots.ts`, product page metadata

**Acceptance:** Google Rich Results Test passes for a product page.

---

## Phase 6 — Product images & media

**Goal:** Replace emoji placeholders with real product images.

**Deliverables:**
- [ ] `imageUrl` field on `Product` (Prisma migration)
- [ ] Image upload in admin (Vercel Blob or Supabase Storage)
- [ ] Fallback to emoji when no image
- [ ] `next/image` on ProductCard and comparison page
- [ ] Store logos (optional `logoUrl` on Store)

**Key files:** `prisma/schema.prisma`, `src/components/admin/ProductForm.tsx`, `src/lib/storage.ts`

**Acceptance:** Admin can upload image; public pages show it with lazy loading.

---

## Phase 7 — Categories & browse filters

**Goal:** Scale beyond 3 seed products.

**Deliverables:**
- [ ] `Category` model (or normalized category table with slug)
- [ ] Filter sidebar on `/products`: category, brand, price range, in-stock only
- [ ] Sort products by lowest price, name, newest
- [ ] Category chips on homepage
- [ ] Admin: category management or strict datalist → table

**Key files:** `src/app/(site)/products/page.tsx`, `src/lib/db/queries.ts`

**Acceptance:** User can filter to “Graphics Cards” and see only those products.

---

## Phase 8 — Store profiles & detail pages

**Goal:** Each store gets a public page like each product.

**Deliverables:**
- [ ] `/stores/[slug]` — store info, all listings, rating, sources
- [ ] Link from StoreCard to profile
- [ ] “Products at this store” grid
- [ ] Store contact links (website, Instagram, WhatsApp deep links)

**Key files:** `src/app/(site)/stores/[slug]/page.tsx`, `src/components/StoreCard.tsx`

**Acceptance:** Clicking a store shows all its offers.

---

## Phase 9 — Price history charts (public)

**Goal:** Show price trends — key differentiator vs static price lists.

**Deliverables:**
- [ ] Price chart on `/products/[slug]` per listing (30/90 day)
- [ ] “Price dropped X%” badge when recent decrease
- [ ] Admin: view price history table per listing
- [ ] Lightweight chart lib (e.g. Recharts) — no heavy deps

**Key files:** `src/components/PriceChart.tsx`, `src/lib/db/price-history.ts`

**Acceptance:** RTX 5080 page shows historical price line for each store.

---

## Phase 10 — Bulk admin & data import

**Goal:** Onboard 50+ products without one-by-one forms.

**Deliverables:**
- [ ] CSV import for products (name, brand, category, specs)
- [ ] CSV import for listings (product slug, store slug, price, …)
- [ ] Export current data as CSV
- [ ] Duplicate product / listing actions in admin
- [ ] Admin search across stores, products, listings

**Key files:** `src/app/admin/import/page.tsx`, `src/lib/import/csv.ts`

**Acceptance:** Import 10 products + 20 listings from one CSV upload.

---

## Phase 11 — Listing verification & freshness

**Goal:** Users trust that prices are current.

**Deliverables:**
- [ ] `verifiedAt` timestamp on Listing (admin marks verified)
- [ ] “Verified {date}” badge on public listings
- [ ] Stale listing warning when `lastUpdated` > 7 days
- [ ] Admin dashboard: “listings needing review” queue
- [ ] Optional `expiresAt` for auto-hide stale offers

**Key files:** `prisma/schema.prisma`, `src/components/ListingRow.tsx`

**Acceptance:** Stale listings show amber “may be outdated” badge.

---

## Phase 12 — Store verification badges

**Goal:** Distinguish trusted retailers from random Instagram sellers.

**Deliverables:**
- [ ] `verified: boolean` + `verifiedAt` on Store
- [ ] Badge on store cards and listing rows
- [ ] Admin toggle to verify/unverify store
- [ ] Public filter: “Verified stores only”

**Key files:** `prisma/schema.prisma`, `src/components/StoreCard.tsx`

**Acceptance:** Verified stores show checkmark badge site-wide.

---

## Phase 13 — User accounts (public)

**Goal:** Let users save products and track prices.

**Deliverables:**
- [ ] `User` model extended for public users (separate from admin)
- [ ] Sign up / login (extend Phase 3 auth)
- [ ] Saved products (`SavedProduct` join table)
- [ ] `/account` page: saved comparisons, alert preferences
- [ ] “Save” button on product comparison page

**Key files:** `prisma/schema.prisma`, `src/app/(site)/account/page.tsx`

**Acceptance:** Logged-in user saves RTX 5080 and sees it on account page.

---

## Phase 14 — Price drop alerts

**Goal:** Notify users when a saved product gets cheaper.

**Deliverables:**
- [ ] `PriceAlert` model (user, product, targetPrice or percentDrop)
- [ ] Email via Resend (or similar) when price crosses threshold
- [ ] Cron job (Vercel Cron) daily: check prices vs alerts
- [ ] Admin: view alert volume stats

**Key files:** `src/app/api/cron/check-alerts/route.ts`, `src/lib/alerts.ts`

**Acceptance:** User sets alert at 4000 AED; email sent when listing drops below.

---

## Phase 15 — Manual price update workflow

**Goal:** Streamline daily ops for social-seller prices.

**Deliverables:**
- [ ] Admin “Quick update” — table of all listings, inline price edit
- [ ] Mobile-friendly admin view for price checks on phone
- [ ] Source link preview (open Instagram/WhatsApp from admin)
- [ ] Changelog: who updated what (audit log)

**Key files:** `src/app/admin/listings/quick/page.tsx`, `src/lib/db/audit.ts`

**Acceptance:** Admin updates 5 prices in under 2 minutes without opening edit forms.

---

## Phase 16 — Website price scraping (permitted stores only)

**Goal:** Auto-update prices for stores that opt in.

**Deliverables:**
- [ ] `scrapeConfig` JSON on Store (URL pattern, CSS selector or JSON-LD)
- [ ] Scraper script run via Vercel Cron (daily)
- [ ] Respect `robots.txt`; stores must have `scrapingEnabled: true`
- [ ] Scrape log table (success/fail, old price, new price)
- [ ] Admin: enable/disable scraping per store, manual trigger

**Key files:** `src/lib/scraper/`, `src/app/api/cron/scrape/route.ts`

**Acceptance:** One test store auto-updates price daily; failures logged in admin.

**⚠️ Legal:** Only scrape with store permission. Document in store onboarding.

---

## Phase 17 — Analytics & admin insights

**Goal:** Know what users search for and click.

**Deliverables:**
- [ ] Vercel Analytics or Plausible (privacy-friendly)
- [ ] Admin dashboard: top products, top stores, search terms
- [ ] Track comparison sort mode usage
- [ ] “Trending” homepage section driven by real views (not static)

**Key files:** `src/app/admin/analytics/page.tsx`, `src/lib/analytics.ts`

**Acceptance:** Admin sees top 10 products by page views last 7 days.

---

## Phase 18 — API layer & embeddable widgets

**Goal:** Let partners/stores embed price comparisons.

**Deliverables:**
- [ ] Read-only REST API: `GET /api/v1/products`, `GET /api/v1/products/[slug]/listings`
- [ ] API key auth for partners
- [ ] Rate limiting
- [ ] Embeddable iframe or JS widget: “Compare prices”
- [ ] OpenAPI spec at `/api/docs`

**Key files:** `src/app/api/v1/`, `docs/api.md`

**Acceptance:** External site can fetch listings JSON with API key.

---

## Phase 19 — Monetization & store partnerships

**Goal:** Sustainable business model.

**Deliverables:**
- [ ] “Featured listing” — pinned to top (admin flag, clearly labeled)
- [ ] Affiliate / referral URL field on Listing (`affiliateUrl`)
- [ ] Store partnership tier (free / featured / premium)
- [ ] “Claim your store” flow for store owners (links to Phase 13 auth)
- [ ] Terms page, affiliate disclosure

**Key files:** `prisma/schema.prisma`, `src/app/(site)/stores/claim/page.tsx`

**Acceptance:** Featured listing appears first with “Sponsored” label.

---

## Phase 20 — Mobile app & scale

**Goal:** Native presence and production hardening.

**Deliverables:**
- [ ] PWA manifest + service worker (installable web app)
- [ ] Push notifications for price alerts (web push)
- [ ] React Native / Expo app shell (optional, shares API from Phase 18)
- [ ] Redis caching for hot product pages (Upstash on Vercel)
- [ ] E2E tests (Playwright): homepage → product → sort
- [ ] Staging environment on Vercel preview + separate Supabase branch

**Key files:** `public/manifest.json`, `playwright.config.ts`, `src/lib/cache.ts`

**Acceptance:** Lighthouse PWA score > 90; E2E passes in CI.

---

## Phase dependency map

```
1–2 (done) → 3 (auth) → 4 (UX) → 5 (SEO)
                    ↓
              13 (users) → 14 (alerts)
                    ↓
3 → 10 (import) → 15 (quick update) → 16 (scraping)
4 → 6 (images) → 7 (categories) → 8 (store pages)
5 → 9 (charts) → 11 (freshness) → 12 (verification)
17 (analytics) ← any traffic-bearing phase
18 (API) → 19 (monetization) → 20 (scale/mobile)
```

## Recommended next 5 phases (priority)

| Order | Phase | Why now |
|-------|-------|---------|
| 1 | **3 — Admin auth** | `/admin` is publicly open |
| 2 | **4 — UX polish** | First impression for real users |
| 3 | **5 — SEO** | Organic traffic is free |
| 4 | **9 — Price charts** | Core value prop vs competitors |
| 5 | **10 — Bulk import** | Scale catalog past seed data |

## Out of scope (until Phase 20+)

- Multi-country (Saudi, Qatar) — needs currency, shipping rules
- Real-time chat with sellers
- Payment processing / checkout
- User-generated reviews (moderation burden)
- AI product recommendations

## How to start a phase (agent checklist)

1. Read this file and confirm phase number with user.
2. `git checkout main && git pull && git checkout -b cursor/<phase-slug>-8afd`
3. Implement deliverables only — no scope creep into later phases.
4. Run `npm run lint` and `npm run build` (with env vars).
5. Update this file: check off deliverables, add “Completed: YYYY-MM-DD” under phase heading.
6. Open PR with phase number in title: `Phase 3: Admin auth & security`

## Environment variables (reference)

| Variable | Required | Purpose |
|----------|----------|---------|
| `POSTGRES_URL` | Yes | Pooled DB connection (app) |
| `POSTGRES_URL_NON_POOLING` | Yes | Direct DB (migrations) |
| `AUTH_SECRET` | Phase 3+ | Session encryption |
| `RESEND_API_KEY` | Phase 14+ | Price alert emails |
| `BLOB_READ_WRITE_TOKEN` | Phase 6+ | Image uploads |
| `CRON_SECRET` | Phase 14+ | Secure cron endpoints |

## Live URLs

- **Production:** https://gaming-stores.vercel.app
- **Admin:** https://gaming-stores.vercel.app/admin
- **Do not use:** https://vctb12.github.io/Gaming-Stores/ (README only)
