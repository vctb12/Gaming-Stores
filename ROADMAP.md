# Gaming Stores UAE — 40-Phase Roadmap

> **For AI agents (Claude Code, Cursor, etc.):** Read this before starting work. Each phase is a PR-sized unit — heavier phases split into several PRs (see each phase's **PRs** list). Complete phases in order unless the user directs otherwise. Mark phases/PRs done in this file when merged.
>
> **Structure:** Phases **1–20** are the core plan (below). Phases **21–40** (Part II) extend it into trust & community, search + AI intelligence, a seller marketplace, and localization/hardening. After Part II: a **PR Breakdown for phases 3–20**, a **Phase & PR index (1–40)**, an updated dependency map, env-var + data-model tables, and a **cited research appendix**.

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

---

# Part II — Phases 21–40 — Growth, Community, Intelligence & Marketplace

> Part II builds on the merged 1–20 foundation. Five themes, four phases each: **Trust & Community** (21–24), **Notifications & Discovery** (25–28), **AI & Price Intelligence** (29–32), **Seller & Marketplace** (33–36), and **Localization, Channels & Hardening** (37–40). The browser extension and Expo native app originally bundled into Phase 39 are tracked as follow-on phases **41–42** (each a distinct runtime sharing only the Phase 18 API). Every phase lists **Depends on / New models / Env vars / Risks / Out of scope** and a **PRs** breakdown.

## Phase 21 — Product & store reviews and ratings

**Goal:** Let signed-in users leave star ratings and written reviews on products and stores, with verified-purchase-style signals and helpful votes, all gated behind an admin moderation queue. Aggregate scores feed the existing comparison ranking so store rating finally reflects real UAE buyers instead of a static seed number.

**Depends on:** 3 (auth), 8 (store pages), 13 (user accounts)

**New models:** `Review`, `ReviewVote` (plus `ratingAvg`/`ratingCount` columns on `Product` and `Store`)

**Env vars:** none

**Deliverables:**
- [ ] `Review` and `ReviewVote` Prisma models + `ratingAvg`/`ratingCount` aggregates on `Product`/`Store`
- [ ] Public review submission, approved-review display, star averages, and helpful-vote toggles
- [ ] Admin moderation queue with bulk approve/reject and ranking cutover so `comparison.ts` uses real data
- [ ] `ReviewTargetType` and `ModerationStatus` enums (shared by Phases 22-24)

**Key files:** `prisma/schema.prisma`, `src/lib/db/reviews.ts`, `src/lib/db/mappers.ts`, `src/app/(site)/reviews/actions.ts`, `src/components/ReviewList.tsx`, `src/components/StarRating.tsx`, `src/app/admin/reviews/page.tsx`, `src/app/admin/reviews/actions.ts`

**Acceptance:** A logged-in user submits a 5-star review that stays hidden while PENDING; an admin approves it and the target Product/Store `ratingAvg` becomes the mean of APPROVED ratings, the store re-ranks in comparison, and a second helpful click toggles the vote off.

**PRs:**

- [ ] **PR 21.1 — Review & ReviewVote data model + db layer** (medium)
  - Add `Review`, `ReviewVote` models and `ratingAvg Float @default(0)` / `ratingCount Int @default(0)` columns to `Product` and `Store` via a Prisma migration (no prod seed). New enums `ReviewTargetType (PRODUCT|STORE)`, `ModerationStatus (PENDING|APPROVED|REJECTED)`. Add `reviews`/`reviewVotes` relations to `User`.
  - Create `src/lib/db/reviews.ts` with `ReviewInput`, `normalizeReviewInput` (trim title/body, clamp rating 1-5, resolve productId XOR storeId), `createReview` (status PENDING, one-per-user-per-target via `findFirst`), `getReviewsForProduct`/`getReviewsForStore` (APPROVED only, orderBy helpfulCount desc then createdAt desc).
  - Implement `recomputeTargetRating(targetType, id)` aggregating `AVG(rating)`/`COUNT` over APPROVED rows in a single transaction, writing `ratingAvg`/`ratingCount`.
  - Add `mapReview` to `mappers.ts` (lastUpdated via `toISOString().slice(0,10)`, coalesce nullable title) and `Review`/`ReviewSummary`/`ReviewTargetType` domain types to `src/lib/types.ts`.
  - **Prisma:** new `Review`, `ReviewVote`; `ratingAvg`/`ratingCount` on `Product`/`Store`; new enums `ReviewTargetType`, `ModerationStatus`.
  - **Acceptance:** Creating a review, approving it, and running `recomputeTargetRating` sets the target's `ratingAvg` to the mean of APPROVED ratings and `ratingCount` to the approved row count (unit-verifiable against a fixture).

- [ ] **PR 21.2 — Public review submission, display & helpful votes** (medium)
  - Add a Reviews section to `src/app/(site)/products/[slug]/page.tsx` and `src/app/(site)/stores/[slug]/page.tsx` showing approved reviews, star average and count.
  - Build `src/components/ReviewList.tsx` and `src/components/StarRating.tsx` (read + input variants) on the dark violet theme.
  - Add `createReviewAction(_prev, formData)` in `src/app/(site)/reviews/actions.ts` gated on Phase 13 session, returning `{error?}`; show a "Your review is pending moderation" state after submit and never render PENDING/REJECTED to other users.
  - Implement `voteReviewAction(reviewId)` using `ReviewVote` upsert/delete on `@@unique([reviewId,userId])`, updating `helpfulCount`; `revalidatePath` the product/store paths and `/`.
  - **Prisma:** none.
  - **Acceptance:** A 5-star product review does not appear publicly while PENDING, and clicking "Helpful" on an approved review increments `helpfulCount` exactly once per user (second click toggles it off).

- [ ] **PR 21.3 — Admin moderation queue, verified signal & ranking cutover** (medium)
  - Add `src/app/admin/reviews/page.tsx` listing PENDING reviews (target, author, rating, body excerpt, bulk select) and `src/app/admin/reviews/actions.ts` with `approveReviewAction`, `rejectReviewAction(id, reason)`, `deleteReviewAction` — each calling `recomputeTargetRating` and revalidating admin + public paths.
  - Add a `ReviewsTable` + `DeleteReviewButton` admin component pair mirroring existing `*Table`/`Delete*Button` components.
  - **Cutover (explicit):** change `mapStore` in `mappers.ts` to populate the domain `Store.rating`/`Store.reviewCount` from `ratingAvg`/`ratingCount`, falling back to legacy `rating`/`reviewCount` when `ratingCount = 0`, so the unchanged `comparison.ts` sort logic picks up real data with no edits. Do the equivalent fallback in `mapProduct`.
  - Compute the `verifiedSignal` heuristic here (`true` when the author has a Phase 13 `SavedProduct` or prior alert on the product), surfaced as a "Tracked this product" badge — moved out of 21.2 to keep its Phase-13 coupling visible alongside the ranking cutover.
  - Add a pending-review count badge to `src/components/admin/AdminSidebar.tsx`. Add the ROADMAP entry and check-off.
  - **Prisma:** none.
  - **Acceptance:** Approving a pending review publishes it and updates the store's comparison ranking (domain `Store.rating` equals `ratingAvg`); rejecting with a reason removes it from the queue and never publishes it.

**Risks:** Moderation backlog can outpace admin throughput — mitigate with bulk approve/reject and a default PENDING-hidden state. Review bombing/sockpuppets from rival sellers — rate-limit one review per user per target and surface `verifiedSignal`. Recomputing `ratingAvg` on every vote/approval can race — do it in a single transaction re-aggregating from APPROVED rows. Keep both legacy and aggregate fields until the mapper cutover lands.

**Out of scope:** Photo/video attachments, seller replies (Phase 22 plumbing), AI toxicity auto-moderation, importing Google/Trustpilot reviews, editing historical seed ratings, and email-on-approval (deferred to reuse Phase 14 Resend later).

---

## Phase 22 — Product Q&A

**Goal:** Add a community Q&A block to each product page where signed-in buyers ask questions and the community or verified store owners answer, with the best answer surfaced first. Reduce the pre-purchase friction of contacting WhatsApp/Instagram sellers one by one for the same warranty/compatibility questions.

**Depends on:** 3 (auth), 8 (store pages), 13 (user accounts), 21 (moderation + vote primitives)

**New models:** `Question`, `Answer`, `AnswerVote`

**Env vars:** none

**Deliverables:**
- [ ] `Question`, `Answer`, `AnswerVote` models reusing the Phase 21 `ModerationStatus` enum
- [ ] Public ask/answer forms and a Q&A thread on the product page with official answers pinned
- [ ] Admin moderation reusing the shared queue, with an "answer as official" action
- [ ] Pending-Q&A counts wired into the AdminSidebar moderation badge

**Key files:** `prisma/schema.prisma`, `src/lib/db/qa.ts`, `src/lib/db/mappers.ts`, `src/app/(site)/products/[slug]/page.tsx`, `src/app/(site)/qa/actions.ts`, `src/components/QnaThread.tsx`, `src/app/admin/qa/page.tsx`, `src/app/admin/qa/actions.ts`

**Acceptance:** A user asks a question, an admin approves it and posts an official answer, and the product page shows the question with the official answer pinned above community answers; unapproved Q&A is never publicly visible.

**PRs:**

- [ ] **PR 22.1 — Q&A data model + db layer** (medium)
  - Add `Question`, `Answer`, `AnswerVote` models via migration, reusing `ModerationStatus`. `storeId` optional relation on `Answer`; add `questions`/`answers`/`answerVotes` relations to `User`.
  - Create `src/lib/db/qa.ts` with `QuestionInput`/`AnswerInput`, normalize helpers, `createQuestion` (PENDING), `createAnswer` (PENDING; increments parent `answerCount` on approval), `getQuestionsForProduct` (APPROVED only, answers ordered isOfficial desc then helpfulCount desc), and `recomputeAnswerCount(questionId)` over APPROVED answers in a transaction.
  - Add `mapQuestion`/`mapAnswer` to `mappers.ts` and `Question`/`Answer`/`QnAThread` types to `src/lib/types.ts`.
  - **Prisma:** new `Question`, `Answer`, `AnswerVote` (reuse `ModerationStatus`).
  - **Acceptance:** `getQuestionsForProduct` returns only APPROVED questions with APPROVED answers, and an `isOfficial` answer always sorts ahead of a higher-`helpfulCount` community answer (unit-verifiable against a fixture).

- [ ] **PR 22.2 — Public Q&A on product page + admin moderation** (medium)
  - Add a Q&A section below reviews on `src/app/(site)/products/[slug]/page.tsx` with ask/answer forms gated on Phase 13 session.
  - Build `src/components/QnaThread.tsx` (question, answers, official badge, helpful-vote) on the dark violet theme.
  - Add `src/app/(site)/qa/actions.ts` with `askQuestionAction`, `postAnswerAction`, `voteAnswerAction` (`AnswerVote` upsert on `@@unique`), returning `{error?}` and revalidating the product path.
  - Add `src/app/admin/qa/page.tsx` + `actions.ts` moderation (approve/reject/delete for questions and answers) plus an admin "answer as official" mutation setting `isOfficial = true`. Wire pending Q&A counts into the AdminSidebar badge. Add ROADMAP entry + check-off.
  - **Prisma:** none.
  - **Acceptance:** A user asks a question, an admin approves it and posts an official answer, and the page pins the official answer above community answers; unapproved Q&A is never visible.

**Risks:** Empty questions look bad — surface a "Be the first to answer" state and let admins answer as official. Verified store-owner answering depends on the **Phase 33** seller membership/claim flow (not the Phase 19 lead form); until then scope `isOfficial` answers to admin-marked answers only. Spam reuses the shared `ModerationStatus` queue. Ordering by `helpfulCount` can bury a correct official answer — force `isOfficial` above community.

**Out of scope:** Threaded replies, @-mention notifications, AI-suggested answers, and a public store-owner answering dashboard (waits on **Phase 33** seller portal). Email-to-asker deferred to a later Phase 14 Resend reuse.

---

## Phase 23 — Trust & safety: reports, disputes & takedown

**Goal:** Let any visitor report a listing or store for scams, wrong prices, or fake stock, route reports into a unified moderation queue with resolution actions, give stores a structured way to dispute reports, and support content takedown that hides offending listings/stores or user content site-wide.

**Depends on:** 3 (auth), 8 (store pages), 11 (listing freshness), 12 (store verification), 13 (user accounts), 21 (moderation)

**New models:** `Report`, `Dispute` (plus `hidden`/`suspended` takedown columns on `Listing`/`Store`)

**Env vars:** `REPORT_ALERT_WEBHOOK_URL`

**Deliverables:**
- [ ] `Report`, `Dispute` models + takedown flags on `Listing`/`Store`, with public read paths filtering hidden/suspended
- [ ] Public report intake (anonymous + signed-in) with rate-limit and dedupe, plus an ops webhook
- [ ] Unified admin moderation queue with resolve/dismiss/hide/suspend/takedown and dispute handling

**Key files:** `prisma/schema.prisma`, `src/lib/db/reports.ts`, `src/lib/db/disputes.ts`, `src/lib/db/queries.ts`, `src/components/ReportDialog.tsx`, `src/app/(site)/report/actions.ts`, `src/app/admin/reports/page.tsx`, `src/app/admin/reports/actions.ts`, `src/app/admin/disputes/page.tsx`

**Acceptance:** An admin resolves a SCAM report by suspending the store; the store and all its listings disappear from public pages, and later upholding the store's dispute reinstates both in a single reversible action.

**PRs:**

- [ ] **PR 23.1 — Report & Dispute data model + takedown flags** (medium)
  - Add `Report`, `Dispute` models and `hidden`/`hiddenReason`/`hiddenAt` on `Listing`, `suspended`/`suspendedReason`/`suspendedAt` on `Store` via migration. New enums `ReportTargetType (LISTING|STORE|REVIEW|QUESTION|ANSWER|DEAL)`, `ReportReason (SCAM|WRONG_PRICE|FAKE_STOCK|COUNTERFEIT|OFFENSIVE|SPAM|OTHER)`, `ReportStatus (OPEN|TRIAGED|RESOLVED|DISMISSED)`, `DisputeStatus (SUBMITTED|UNDER_REVIEW|UPHELD|REJECTED)`. These are the canonical SCREAMING_CASE moderation enums; Phase 36 uses domain-prefixed names to avoid clashing.
  - Create `src/lib/db/reports.ts` (`ReportInput`, `createReport`, `getOpenReports`, `resolveReport(id, resolution, adminId)`) and `src/lib/db/disputes.ts` (`createDispute` linked to a Report, `updateDisputeStatus`).
  - Add `hideListing`/`unhideListing`/`suspendStore`/`reinstateStore` helpers in `listings.ts`/`stores.ts`.
  - Centralize the `hidden=false` / `suspended=false` filter in `queries.ts` and `productWithListingsInclude` so every public read path (comparison, sitemap, Phase 18 API) respects takedown.
  - **Prisma:** new `Report`, `Dispute`; takedown columns on `Listing`/`Store`; 4 new enums.
  - **Acceptance:** `hideListing` removes a listing from `getProductBySlug` results and comparison highlights while the row remains in the DB and admin views.

- [ ] **PR 23.2 — Public report flow + report intake action** (medium)
  - Add a "Report" affordance to `src/components/ListingRow.tsx` and the store page opening `src/components/ReportDialog.tsx` (reason dropdown, optional details, email for anonymous).
  - Add `src/app/(site)/report/actions.ts` with `submitReportAction(_prev, formData)` returning `{error?}`, capturing `reporterId` from Phase 13 session else `reporterEmail`. Rate-limit per email/IP per hour and dedupe identical OPEN reports for the same target.
  - POST to `REPORT_ALERT_WEBHOOK_URL` (Slack/Discord) on new report, failing soft. Reuse the same action to flag user content (review/question/answer/deal) by `targetType`. Show a neutral confirmation.
  - **Prisma:** none.
  - **Acceptance:** A "wrong price" report creates an OPEN `Report` with correct `targetType`/`targetId`/`reasonCode`, and an identical report within the window creates no duplicate OPEN row.

- [ ] **PR 23.3 — Admin moderation queue, dispute handling & takedown actions** (heavy)
  - Add `src/app/admin/reports/page.tsx` (unified queue across listings/stores/reviews/Q&A/deals, filters by status and reason, AdminSidebar count badge) and `src/app/admin/reports/actions.ts` (`resolveReportAction`, `dismissReportAction`, `hideListingAction`, `suspendStoreAction`, `takedownContentAction` setting `ModerationStatus REJECTED` on the linked content).
  - Add `src/app/admin/disputes/page.tsx` + `actions.ts` (record dispute, set UNDER_REVIEW/UPHELD/REJECTED, adminNote); upholding a dispute auto-reinstates a hidden listing or suspended store.
  - Wire `suspendStore` to cascade-hide its listings in one transaction and reinstate to reverse it. Render takedown state in `StoresTable`/`ListingsTable` and a neutral "unavailable" placeholder publicly. Keep a non-deletable resolution audit. Add ROADMAP entry + check-off.
  - **Prisma:** none.
  - **Acceptance:** Resolving a SCAM report by suspending the store removes the store and its listings from public pages, and upholding the store's dispute reinstates both in a single reversible action.

**Risks:** Anonymous reports enable false-flagging — capture `reporterEmail`, rate-limit by IP/email, never auto-hide on report count. Hiding must propagate through every public read path — centralize the filter. Disputes are legal-ish — keep an immutable audit (`resolvedById`, `adminNote`, timestamps); never delete reports, only resolve/dismiss.

**Out of scope:** ML fraud scoring, SLA timers/escalation, a public dispute portal (needs **Phase 33** seller portal), DMCA handling, emailing reporters (deferred Phase 14 reuse). No chargebacks/refunds.

---

## Phase 24 — Community deals feed

**Goal:** Add a user-submitted deals feed where signed-in users post hot gaming deals linked to existing listings (or external store URLs), the community upvotes them, and the feed sorts by hot/new with automatic expiry of dead deals. Turn the price-comparison catalog into a living, return-worthy community destination.

> **Naming note (collision fix):** This is the canonical `Deal` model and `/deals` surface. Phase 28's store-coupon engine is renamed to `Coupon`/`Promo` with `/promotions` and an `expire-coupons` cron, and Phase 28 depends on this phase rather than redefining `Deal`.

**Depends on:** 3 (auth), 9 (price history), 13 (user accounts), 14 (cron pattern), 21 (trust signals), 23 (report/takedown net)

**New models:** `Deal`, `DealVote`

**Env vars:** none

**Deliverables:**
- [ ] `Deal` (hot-ranking) and `DealVote` models reusing `ModerationStatus`
- [ ] Public hot/new feed, submission form, and up/down voting
- [ ] Admin moderation + a daily expiry cron flipping dead deals

**Key files:** `prisma/schema.prisma`, `src/lib/db/deals.ts`, `src/lib/db/mappers.ts`, `src/app/(site)/deals/page.tsx`, `src/app/(site)/deals/submit/page.tsx`, `src/app/(site)/deals/actions.ts`, `src/components/DealCard.tsx`, `src/components/Header.tsx`, `src/app/admin/deals/page.tsx`, `src/app/api/cron/expire-deals/route.ts`

**Acceptance:** A user submits a deal linked to an RTX 5080 listing; it stays hidden while PENDING, and after approval upvoting reorders it up the hot feed, while the expiry cron flips past-`expiresAt` deals to expired.

**PRs:**

- [ ] **PR 24.1 — Deal & DealVote data model + hot-ranking db layer** (medium)
  - Add `Deal` (unique `slug`, `hotScore`, `upvoteCount`/`downvoteCount`, `expiresAt`, `isExpired`, `isFeatured`, optional `listingId`/`storeId`) and `DealVote` (`@@unique([dealId,userId])`) via migration, reusing `ModerationStatus`. Add `deals`/`dealVotes` relations to `User`.
  - Create `src/lib/db/deals.ts` with `DealInput`, `normalizeDealInput` (trim, slugify with collision suffix, currency default AED, parse `expiresAt`, resolve listingId XOR externalUrl), `createDeal` (PENDING), `getDealsFeed(sort, {excludeExpired})`, `getDealBySlug`, `computeHotScore(up, down, createdAt)` (Reddit-style log + time-decay), `recomputeDealVotes(dealId)` in a transaction.
  - Add `Deal`/`DealVote`/`DealSort` types and `mapDeal` (dates via `toISOString().slice(0,10)`, join linked listing/store).
  - **Prisma:** new `Deal`, `DealVote` (reuse `ModerationStatus`).
  - **Acceptance:** `getDealsFeed('hot')` returns APPROVED non-expired deals ordered by `computeHotScore` desc, and a deal with more recent upvotes outranks an older deal with the same raw total (unit-verifiable against a fixture clock).

- [ ] **PR 24.2 — Public deals feed, submission & voting** (heavy)
  - Add `src/app/(site)/deals/page.tsx` (hot/new tabs, AED price + % off, store/listing link, expiry countdown, Expired state) and `deals/[slug]/page.tsx` detail.
  - Build `src/components/DealCard.tsx` and `DealVoteButton.tsx` (optimistic up/down) on the dark violet theme.
  - Add `deals/submit/page.tsx` gated on Phase 13 session with a typeahead to attach a Listing or paste an external URL, and `deals/actions.ts` (`submitDealAction` PENDING, `voteDealAction(dealId, value)` via `DealVote` upsert/delete then `recomputeDealVotes`).
  - Add a "Report this deal" entry point reusing the Phase 23 `ReportDialog` with `targetType DEAL`. Add a "Deals" nav entry in `Header.tsx`. `revalidatePath('/deals')` and the deal path.
  - **Prisma:** none.
  - **Acceptance:** A deal linked to an existing RTX 5080 listing stays hidden while PENDING; after approval upvoting increments `upvoteCount` once per user and reorders it up the hot feed.

- [ ] **PR 24.3 — Admin deal moderation + expiry cron** (medium)
  - Add `src/app/admin/deals/page.tsx` + `actions.ts` (`approveDealAction`, `rejectDealAction`, `featureDealAction`, `expireDealAction`, `deleteDealAction`).
  - Add `src/app/api/cron/expire-deals/route.ts` (Vercel Cron, `CRON_SECRET`) flipping past-`expiresAt` deals to `isExpired=true` daily and recomputing hotScore for active deals; register in `vercel.json`.
  - Wire pending-deal counts into the AdminSidebar badge. Surface an `isFeatured` "Featured deals" strip on the deals page. Add ROADMAP entry + final Trust & Community check-off.
  - **Prisma:** none.
  - **Acceptance:** Hitting `expire-deals` with the correct `CRON_SECRET` flips every past-`expiresAt` deal to expired and removes them from `getDealsFeed('hot')`; requests without the secret return 401.

**Risks:** Vote brigading — enforce `DealVote @@unique`. Hot-ranking decay must be deterministic and cron-recomputed, not per-read, or the feed flickers. Off-platform `externalUrl` deals bypass the comparison value prop and carry scam risk — require admin approval and route them through the Phase 23 report pipeline. Slug collisions — append a short suffix in `normalizeDealInput`.

**Out of scope:** Comment threads, deal-of-the-day digest (Phase 14 reuse), submitter karma, automatic price verification, ML feeds. No store-side submission portal (waits on **Phase 33** seller portal).

---

## Phase 25 — Unified Notification Center

**Goal:** Replace the single Phase 14 email-only price-drop alert with a unified notification center: an in-app inbox plus per-channel delivery (email, web push, WhatsApp opt-in) governed by user-level preferences. Every alert trigger fans out to the channels a user has enabled.

**Depends on:** 3 (auth), 13 (user accounts), 14 (alert cron), 18 (API), 20 (web-push transport + PushSubscription)

**New models:** `Notification`, `NotificationPreference`, `NotificationDelivery`, `WhatsAppContact` (reuses Phase 20's `PushSubscription`)

**Env vars:** `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT`, `NEXT_PUBLIC_VAPID_PUBLIC_KEY`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_VERIFY_TOKEN` (reuses `RESEND_API_KEY`, `CRON_SECRET`)

**Deliverables:**
- [ ] Notification core model + fan-out service writing one delivery row per enabled channel
- [ ] Email and web-push channel workers + a batched dispatch cron (reusing Phase 20 `PushSubscription`)
- [ ] WhatsApp opt-in channel (behind a flag) shippable independently of email/push
- [ ] In-app inbox UI + a notification preferences page

**Key files:** `prisma/schema.prisma`, `src/lib/db/notifications.ts`, `src/lib/db/notification-preferences.ts`, `src/lib/notifications/dispatch.ts`, `src/lib/alerts.ts`, `src/lib/notifications/channels/*`, `src/app/api/cron/dispatch-deliveries/route.ts`, `src/app/(site)/account/notifications/page.tsx`

**Acceptance:** When the alert cron detects a saved product crossing `targetPrice`, exactly one `Notification` and one `NotificationDelivery` per enabled channel is created; re-running the cron in the same window double-sends nothing.

**PRs:**

- [ ] **PR 25.1 — Notification core model, fan-out service, and channel preferences** (heavy)
  - Add `Notification`, `NotificationPreference`, `NotificationDelivery` models + migration; backfill a default `NotificationPreference` per existing User. `NotificationDelivery` has a unique `(notificationId, channel)` constraint for idempotency.
  - Build `src/lib/db/notifications.ts` (`createNotification`, `getNotificationsForUser` paginated, `markNotificationRead`, `markAllRead`, `getUnreadCount`), `src/lib/db/notification-preferences.ts` (`getPreference`, `upsertPreference`, `NotificationType` enum PRICE_DROP/BACK_IN_STOCK/NEW_DEAL/ALERT_DIGEST), and `src/lib/notifications/dispatch.ts` (`dispatchNotification(userId, type, payload)` resolving prefs, writing one Notification, enqueuing one delivery per enabled channel).
  - Refactor `src/lib/alerts.ts` so the alert cron calls `dispatchNotification` instead of sending email directly, preserving `targetPrice`/`percentDrop` logic.
  - **Prisma:** new `Notification`, `NotificationPreference (userId @unique)`, `NotificationDelivery (@@unique [notificationId, channel])`; relations from User.
  - **Acceptance:** A crossed `targetPrice` creates exactly one Notification and one pending delivery per enabled channel; re-running the cron in the same window creates no duplicates.

- [ ] **PR 25.2a — Email & web-push delivery workers + dispatch cron** (heavy)
  - Add `src/lib/notifications/channels/email.ts` (Resend, reuse Phase 14 sender) and `channels/push.ts` (web-push lib using VAPID keys, reading the **Phase 20** `PushSubscription` rows).
  - **Reuse, don't redefine:** the `PushSubscription` table and `/api/push/subscribe` route already exist from Phase 20.2; only add missing fields (`userAgent`, `lastUsedAt`) via an additive migration referencing the existing table. State this explicitly in the PR.
  - Add `src/app/api/cron/dispatch-deliveries/route.ts` (`CRON_SECRET`) draining pending deliveries in batches, calling the channel, setting `sent`/`failed` + `sentAt`, and pruning push subscriptions on HTTP 410 Gone. Format AED via `formatPrice` and link back to the product page.
  - **Prisma:** additive columns on the existing Phase 20 `PushSubscription` only.
  - **Acceptance:** A pending push delivery is sent to a registered subscription and flips to `sent` with `sentAt`; a subscription returning 410 is deleted and its delivery is marked failed.

- [ ] **PR 25.2b — WhatsApp opt-in channel (behind a flag)** (heavy)
  - Add `WhatsAppContact (userId @unique, phoneE164 @unique, verified, optInAt, optOutAt)` model + migration and `src/lib/notifications/channels/whatsapp.ts` (Meta WhatsApp Cloud API template send).
  - Add `src/app/api/whatsapp/webhook/route.ts` (GET verify with `WHATSAPP_VERIFY_TOKEN`, POST inbound) and a double-opt-in flow creating a verified `WhatsAppContact` only after the user replies to confirm.
  - Split from 25.2a because WhatsApp is gated on Meta Business verification and pre-approved templates and may stall — it must not block email/push or the inbox.
  - **Prisma:** new `WhatsAppContact`.
  - **Acceptance:** A user who completes double-opt-in gets a verified `WhatsAppContact`; a dispatched WhatsApp delivery uses an approved template and flips to `sent`.

- [ ] **PR 25.3 — In-app inbox UI and notification preferences page** (medium)
  - Build `src/app/(site)/account/notifications/page.tsx` inbox RSC (read/unread styling, grouped by day, mark-all-read) and an unread-count bell in `Header.tsx` from `getUnreadCount`.
  - Build `NotificationPreferenceForm.tsx` (client, `useActionState`) toggling email/push/whatsapp and per-type switches; the push toggle requests browser permission and calls the Phase 20 `/api/push/subscribe`. Add a UAE-phone WhatsApp opt-in field showing verified/pending state.
  - Add `account/notifications/actions.ts` (`markReadAction`, `markAllReadAction`, `updatePreferencesAction`) revalidating the inbox. Empty state matches Phase 4 styling.
  - **Prisma:** none.
  - **Acceptance:** Toggling push off persists `pushEnabled=false` (verified by reload) and a subsequently dispatched notification creates no push delivery for that user.

**Risks:** WhatsApp Cloud API needs Meta verification and approved templates (days of lead time) — hence the 25.2b split + flag. Web push has uneven iOS support and silently-expiring (410) subscriptions needing pruning. Fan-out from the daily cron can hit Resend/WhatsApp rate limits — batch and rely on the `(notificationId, channel)` idempotency. Phone numbers are PII.

**Out of scope:** SMS, real-time websockets/SSE (inbox polls on load), digest windows beyond per-channel on/off, marketing broadcasts, Instagram DM, A/B testing, rich WhatsApp buttons. Deals/recommendation notification sources are wired in Phases 27-28.

---

## Phase 26 — Advanced Search & Discovery

**Goal:** Replace the in-memory substring `searchProducts()` with a real engine: Postgres full-text search with trigram fuzzy matching as the default, an optional Meilisearch backend behind an adapter, typeahead, synonyms, faceted filters, and search-query analytics.

**Depends on:** 7 (categories/filters), 17 (analytics), 18 (API)

**New models:** `SearchSynonym`, `ProductSearchDocument`, `SearchQueryLog`

**Env vars:** `SEARCH_BACKEND`, `MEILISEARCH_HOST`, `MEILISEARCH_API_KEY`, `MEILISEARCH_INDEX_PREFIX`

**Deliverables:**
- [ ] Postgres FTS + trigram backend behind a pluggable `SearchBackend` adapter with graceful fallback
- [ ] Typeahead autocomplete and faceted filtering on `/products`
- [ ] Optional Meilisearch adapter + index sync (does not gate shipping)
- [ ] Search analytics with admin insights and a synonym manager

**Key files:** `prisma/schema.prisma`, `src/lib/search/index.ts`, `src/lib/search/postgres.ts`, `src/lib/db/queries.ts`, `src/app/api/search/suggest/route.ts`, `src/components/SearchBar.tsx`, `src/lib/search/meilisearch.ts`, `src/lib/search/sync.ts`, `src/app/admin/search/page.tsx`

**Acceptance:** Searching "grafix" returns GPU products via trigram similarity (zero from the old substring path), typing "rtx" shows an autocomplete dropdown within one keystroke debounce, and the admin dashboard lists zero-result queries.

**PRs:**

- [ ] **PR 26.1 — Postgres full-text + trigram search backend with a pluggable adapter** (heavy)
  - Add a Prisma migration enabling `pg_trgm` and a generated `tsvector` search column on `Product` over name/brand/category/specs. **Drift-avoidance (explicit):** model the column in `schema.prisma` as `searchVector Unsupported("tsvector")?` with `@@index([searchVector], type: Gin)` so Prisma owns it; keep only the GENERATED expression and the trigram index on `name` as hand-written SQL inside the migration. Document the approach in the PR so the next `prisma migrate dev` detects no drift.
  - Define `SearchBackend` in `src/lib/search/index.ts` (`search(query, facets, pagination)`, `suggest(prefix)`), selecting the implementation from `SEARCH_BACKEND` (default `postgres`).
  - Implement `src/lib/search/postgres.ts` via `prisma.$queryRaw` with `ts_rank` plus `similarity()` fuzzy fallback, returning ids + scores then hydrating via the db layer. Replace `searchProducts()` in `queries.ts` to delegate while keeping the `ProductWithListings` shape.
  - Add `SearchSynonym` model + `src/lib/db/search-synonyms.ts` for query expansion before tokenizing. Any backend error logs and falls back to postgres so `/products?q=` never 500s.
  - **Prisma:** raw-SQL migration for `pg_trgm` + generated tsvector + GIN/trgm indexes; `searchVector Unsupported("tsvector")?` modeled in schema; new `SearchSynonym (term @unique, synonyms String[])`.
  - **Acceptance:** Searching "grafix" returns GPU products via trigram similarity (zero from the old path), ranked closest-first.

- [ ] **PR 26.2a — Typeahead autocomplete** (medium)
  - Add `GET /api/search/suggest` returning ranked product/category suggestions for a prefix (debounced), consumed by an upgraded keyboard-navigable `src/components/SearchBar.tsx` dropdown. Show AED prices and image/emoji in rows, deep-linking to `/products/[slug]`.
  - **Prisma:** none.
  - **Acceptance:** Typing "rtx" shows an autocomplete dropdown of matching products within one keystroke debounce.

- [ ] **PR 26.2b — Faceted filters on /products** (medium)
  - Add faceted filtering to `/products` (category, brand, price-range AED, in-stock) with facet counts from the search backend, rendered as a filter sidebar matching Phase 7. Introduce `ProductSearchDocument` as the postgres-side denormalized facet source.
  - **Prisma:** new `ProductSearchDocument (productId @unique, name, brand, category, lowestPrice Int?, inStock, @@index [category], @@index [brand])`.
  - **Acceptance:** Selecting a brand facet narrows `/products` results with correct facet counts.

- [ ] **PR 26.3 — Search analytics and admin insights** (medium)
  - Add `SearchQueryLog` + `src/lib/db/search-analytics.ts` recording query text, normalized term, result count, backend, and click-through. Log every executed search server-side (non-blocking) and a click ping via `GET /api/search/click`.
  - Build `src/app/admin/search/page.tsx` (top terms 7/30d, zero-result queries, CTR). Feed top/zero-result terms into the Phase 17 dashboard data layer. Add an admin synonym manager (CRUD) so zero-result terms map to products. Aggregate with `groupBy`. Explicitly reuses Phase 17 analytics primitives — 17 = page-views, 26 = search events.
  - **Prisma:** new `SearchQueryLog (@@index [normalized], @@index [createdAt])`.
  - **Acceptance:** After a typo'd no-match search, the admin dashboard lists that term under "zero-result queries" with its occurrence count.

- [ ] **PR 26.4 — Optional Meilisearch adapter + index sync** (heavy)
  - Implement `src/lib/search/meilisearch.ts` behind `SearchBackend` (searchableAttributes, filterableAttributes, synonyms, typo tolerance) selectable via `SEARCH_BACKEND=meilisearch`. Add `src/lib/search/sync.ts` to upsert/delete a product's `ProductSearchDocument`/Meilisearch payload from product and listing server actions. Add an admin bulk-reindex action at `src/app/admin/search/actions.ts`.
  - Separated because Meilisearch is optional infra behind a flag — the Postgres path already satisfies the goal, so it must not gate shipping search.
  - **Prisma:** none.
  - **Acceptance:** With `SEARCH_BACKEND=meilisearch` and a populated index, search and facets resolve through Meilisearch; an admin reindex rebuilds the index from the DB; mis-set backend degrades to the Postgres path without a 500.

**Risks:** The generated `tsvector` column needs hand-written SQL + the `Unsupported` annotation to avoid Prisma drift. Meilisearch is external — must degrade gracefully if down/mis-set. Index sync must hook every product/listing mutation. Synonyms are locale-sensitive (Arabic transliterations).

**Out of scope:** Semantic/vector/image/voice search (Phase 32 owns visual), store search, personalized ranking (Phase 27), multi-language Arabic UI (Phase 37), "did you mean". Meilisearch provisioning docs only; no Algolia.

---

## Phase 27 — Recommendations & Personalization

**Goal:** Add discovery surfaces driven by behavior and catalog signals: "similar products", a personalized "Deals for you" rail for logged-in users, a recently-viewed list, and trending-by-category sections computed from real view and search data.

**Depends on:** 7 (categories), 13 (user accounts), 17 (analytics), 25 (notification fan-out), 26 (search signals)

**New models:** `ProductView`, `RecentlyViewed`, `ProductSimilarity`, `TrendingSnapshot`

**Env vars:** `RECOMMENDATIONS_ENABLED`, `ANTHROPIC_API_KEY`

**Deliverables:**
- [ ] View tracking, recently-viewed, and a cron-built similar-products engine
- [ ] Trending-by-category snapshots replacing the static homepage trending section
- [ ] Personalized "Deals for you" rail behind a feature flag

**Key files:** `prisma/schema.prisma`, `src/lib/db/product-views.ts`, `src/lib/recommendations/similar.ts`, `src/lib/recommendations/deals-for-you.ts`, `src/app/api/products/[slug]/view/route.ts`, `src/app/api/cron/build-similarity/route.ts`, `src/app/api/cron/build-trending/route.ts`, `src/app/(site)/page.tsx`

**Acceptance:** Visiting an RTX 5080 page records a view and shows a same-category "Similar products" rail; after the trending cron the homepage "Trending in Graphics Cards" rail lists products by `TrendingSnapshot` rank, and a logged-in GPU-viewer sees GPU price drops in "Deals for you".

**PRs:**

- [ ] **PR 27.1 — View tracking, recently-viewed, and similar-products engine** (heavy)
  - Add `ProductView` (keyed by userId or anonymous viewerId cookie), `RecentlyViewed`, `ProductSimilarity` models + migration, and `src/lib/db/product-views.ts` (`recordView`, `getRecentlyViewed` deduped).
  - Record a view from the product page RSC via `POST /api/products/[slug]/view` setting/reading the anonymous viewer cookie.
  - Build `src/lib/recommendations/similar.ts` (same category + brand affinity + nearest lowest-price using `getComparisonHighlights`/`getTotalPrice`), persisted into `ProductSimilarity` by `src/app/api/cron/build-similarity/route.ts` (`CRON_SECRET`); read cached rows at request time. Render "Similar products" and "Recently viewed" rails on the product page using `ProductCard`.
  - **Prisma:** new `ProductView (@@index [productId, createdAt], @@index [viewerId])`, `RecentlyViewed (@@unique [viewerKey, productId])`, `ProductSimilarity (@@unique [productId, similarProductId])`.
  - **Acceptance:** Visiting an RTX 5080 page records a `ProductView` and shows a same-category "Similar products" rail; revisiting after another product shows both under "Recently viewed" newest-first.

- [ ] **PR 27.2a — Trending-by-category snapshots** (heavy)
  - Add `TrendingSnapshot` model + `src/app/api/cron/build-trending/route.ts` scoring products per category from `ProductView` counts and `SearchQueryLog` hits over a rolling window. Replace the static homepage "Trending" section (Phase 17) with snapshot-driven rails per top category on `src/app/(site)/page.tsx`. Add `src/lib/db/trending.ts`.
  - **Prisma:** new `TrendingSnapshot (@@index [category, window, rank], @@unique [category, window, productId])`.
  - **Acceptance:** After the trending cron runs, the homepage "Trending in Graphics Cards" rail lists products ordered by `TrendingSnapshot` rank.

- [ ] **PR 27.2b — Personalized "Deals for you" rail** (heavy)
  - Build `src/lib/recommendations/deals-for-you.ts` ranking products by recent price drops (`PriceHistory`/price-change), category affinity from `RecentlyViewed`/`SavedProduct`, and in-stock availability. Add a "Deals for you" RSC rail on `/account` and the homepage (logged-in only), falling back to global top price drops for anonymous users. Gate behind `RECOMMENDATIONS_ENABLED`. Optionally enrich similarity `reason` copy via Anthropic when `ANTHROPIC_API_KEY` is set, defaulting to template strings.
  - Split from 27.2a because the two rails share no computation; trending is the higher-certainty half that can ship first.
  - **Prisma:** none.
  - **Acceptance:** A logged-in user who recently viewed GPUs sees those-category price drops in "Deals for you"; with the flag unset the rail is hidden.

**Risks:** Cold-start — heuristic fallbacks (same-category, price-adjacent, brand) must always backfill. Anonymous `ProductView` uses a cookie id, never PII. Trending must be a cron-built snapshot, not per-request. Optional Anthropic usage must be cost-capped and fully optional. "Deals for you" consumes price-drop signals here; the coupon source is finalized in Phase 28.

**Out of scope:** Real-time collaborative filtering, ML training/serving, embedding stores, cross-device stitching, recommendation digests, rail A/B testing, bandit optimization.

---

## Phase 28 — Coupons & Promo Codes Engine

**Goal:** Introduce a first-class store-coupon system: store-issued coupons and promo codes with validity windows and conditions, an admin to manage them, a public `/promotions` page aggregating live offers, and per-listing deal badges — feeding the notification and recommendation surfaces built in 25 and 27.

> **Naming note (collision fix):** This phase does **not** redefine Phase 24's `Deal`. Its entities are `Coupon` and `Promo`, its db files are `src/lib/db/coupons.ts`/`src/lib/db/promos.ts`, its public route is `/promotions`, and its cron is `src/app/api/cron/expire-coupons/route.ts`. It depends on Phase 24 and reuses the community `/deals` Header entry by adding a sibling "Promotions" entry. `ReportTargetType` gains a distinct `COUPON` member so reports disambiguate from `DEAL`.

**Depends on:** 7 (categories), 12 (store verification), 13 (user accounts), 24 (deals surface), 25 (notification fan-out), 27 (recommendation rails)

**New models:** `Coupon`, `Promo`, `CouponRedemptionLog`

**Env vars:** none

**Deliverables:**
- [ ] `Coupon`/`Promo` models, db layer, and Dubai-time effective-price logic
- [ ] Admin coupon/promo management and a public `/promotions` page with per-listing badges
- [ ] Promo notifications via Phase 25 and integration into Phase 27 "Deals for you"

**Key files:** `prisma/schema.prisma`, `src/lib/db/coupons.ts`, `src/lib/db/promos.ts`, `src/lib/deals/pricing.ts`, `src/app/admin/coupons/actions.ts`, `src/app/admin/promos/actions.ts`, `src/app/(site)/promotions/page.tsx`, `src/components/ListingRow.tsx`, `src/app/api/cron/expire-coupons/route.ts`, `src/lib/deals/notify.ts`

**Acceptance:** `applyCoupon` on a 4000 AED listing with a 10% (max 300 AED) coupon returns 3700 AED; an admin creates an active promo for an RTX 5080 listing that appears on `/promotions` with the post-coupon price and renders a "Save 300 AED" badge; publishing a verified promo for a saved product creates exactly one NEW_DEAL notification.

**PRs:**

- [ ] **PR 28.1 — Coupon & Promo models, db layer, and effective-price logic** (medium)
  - Add `Coupon` (belongs to a Store, optional Product/category scope) and `Promo` (references an optional Coupon + price/discount, unique `slug`) models + migration. Add a `COUPON` member to the Phase 23 `ReportTargetType` enum so promos are reportable distinctly from community deals.
  - Build `src/lib/db/coupons.ts` and `src/lib/db/promos.ts` (`CouponInput`/`PromoInput`, normalize with trim/AED defaults/Asia-Dubai date parsing for `startsAt`/`endsAt`, slug for promos, uniqueness, full CRUD).
  - Add `src/lib/deals/pricing.ts` (`applyCoupon(listing, coupon)` computing effective AED with `percentage|fixed`, `minSpend`, `maxDiscount` caps, returning a post-coupon `getTotalPrice`) and `isDealActive(promo, now)` honoring Dubai-time windows. Extend mappers/types and add `getActivePromosForProduct`/`getActivePromos`.
  - **Prisma:** new `Coupon`, `Promo` (relations to Store/Product/Listing/Coupon); `COUPON` added to `ReportTargetType`.
  - **Acceptance:** `applyCoupon` on a 4000 AED listing with a 10% (max 300 AED) coupon returns 3700 AED, and a coupon whose `endsAt` has passed in Dubai time is reported inactive by `isDealActive`.

- [ ] **PR 28.2a — Admin coupon/promo management** (medium)
  - Add admin CRUD `src/app/admin/promos/{page,new,[id]/edit}.tsx` and `src/app/admin/coupons/{...}` with server actions following the FormState parse/try-catch/revalidate/redirect pattern. Build `PromoForm.tsx` and `CouponForm.tsx` (`useActionState`, violet/dark) with store + product datalists, `discountType` select, Dubai-time date pickers, and an admin-only `verified` toggle (ties to Phase 12).
  - **Prisma:** none.
  - **Acceptance:** An admin creates an active promo for an RTX 5080 listing with a 10% coupon and a verified toggle, persisted with correct Dubai-time windows.

- [ ] **PR 28.2b — Public /promotions page, badges & expiry cron** (heavy)
  - Build `src/app/(site)/promotions/page.tsx` aggregating active promos, sorted by discount %, showing original vs effective AED price, store, validity countdown, and reveal-code button, respecting verified labeling. Add a deal badge to `src/components/ListingRow.tsx` ("Save X AED with CODE") when an active promo/coupon applies. Add `src/app/api/cron/expire-coupons/route.ts` (`CRON_SECRET`) deactivating promos/coupons past `endsAt`. Add a "Promotions" Header entry. `revalidatePath` `/promotions`, `/products`, affected `/products/[slug]`, and `/`.
  - **Prisma:** none.
  - **Acceptance:** An active promo appears on `/promotions` with the correct post-coupon AED price and a reveal-code button, and a "Save 300 AED" badge renders on the listing row.

- [ ] **PR 28.3 — Promo notifications and "Deals for you" integration** (medium)
  - On publishing a verified `Promo`, dispatch a NEW_DEAL notification via Phase 25 `dispatchNotification` to users who saved the related product or follow its category; guard so editing an existing promo does not re-notify (only first publish triggers).
  - Add `CouponRedemptionLog` model + a reveal ping (`GET /api/promos/[slug]/reveal`) recording reveals for analytics. Feed active promos into Phase 27 `deals-for-you` so it prefers products with a live coupon. Add an admin promo-analytics panel (top revealed, expiring soon). Surface a "Promotions" link in the public Header and an `/account` view of promos on saved products.
  - **Prisma:** new `CouponRedemptionLog (@@index [promoId, createdAt], @@index [couponId])`.
  - **Acceptance:** Publishing a verified promo for a saved product creates exactly one NEW_DEAL notification (and none on a subsequent edit), and revealing the code logs one `CouponRedemptionLog` row.

**Risks:** Effective-price math (percentage vs fixed AED, min-spend, max-discount caps, listing vs store-wide) is fiddly — unverifiable coupons are labeled "code provided by store, verify at checkout". Validity windows need Asia/Dubai (UTC+4) handling so promos don't expire a day early. Expired promos auto-hidden by cron; deletion must not orphan sent notifications. Legal: only display authorized codes (ties to Phase 12 / Phase 19).

**Out of scope:** Coupon scraping/validation, affiliate attribution (Phase 19), user-submitted coupons, cashback, loyalty points, stacking rules beyond a single best coupon, checkout. No payment flow.

---

## Phase 29 — Price Intelligence — Forecasting, Deal Scores & Buy-Now-or-Wait Signals

**Goal:** Turn the raw `PriceHistory` we already capture into actionable buying intelligence: a per-listing deal score, lowest-in-90-days badges, a statistical price forecast, and a clear "buy now or wait" verdict surfaced on every product page. This is the analytics foundation the later AI phases reason over.

**Depends on:** 9 (charts), 14 (cron/`CRON_SECRET`), 16 (scrape cron ordering), 17 (admin insights)

**New models:** `PriceForecast`, `ListingMetricsLog` (plus `Listing.lowestEver`)

**Env vars:** reuses `CRON_SECRET`

**Deliverables:**
- [ ] `PriceForecast` schema, a pure TypeScript forecasting engine, and a db layer
- [ ] A daily forecast cron + an admin price-intelligence metrics surface
- [ ] Public deal-score badges, lowest-in-90-days, and a buy-now-or-wait panel

**Key files:** `prisma/schema.prisma`, `src/lib/forecast.ts`, `src/lib/db/forecasts.ts`, `src/lib/db/mappers.ts`, `src/lib/db/queries.ts`, `src/app/api/cron/forecast/route.ts`, `src/components/DealBadge.tsx`, `src/components/BuyNowOrWaitPanel.tsx`

**Acceptance:** On a product where the cheapest listing's price equals its `lowest90`, a "Lowest in 90 days" badge and a BUY_NOW panel render; a listing without a forecast renders no badge and no console error.

**PRs:**

- [ ] **PR 29.1 — PriceForecast schema, forecasting engine & db layer** (medium)
  - Add `PriceForecast` (listingId unique, dealScore, verdict, predictedDrop* fields, `@@index verdict`/`dealScore`), `Listing.lowestEver Int?`, and `ListingMetricsLog` via migration.
  - Create `src/lib/forecast.ts` (pure `computeDealScore`, `computeWindowStats(history, days)`, `deriveVerdict` returning BUY_NOW|WAIT|FAIR, `predictDrop()` linear-trend returning `{dropAed, dropPct, horizonDays}` or null) and `src/lib/db/forecasts.ts` (`upsertForecast`, `getForecastByListingId`, `getAllForecastsForProduct`).
  - Add `ForecastResult` type + `mapForecast` (DateTime → ISO slice). Extend `ListingWithStore` with optional `forecast?` and wire it into `productWithListingsInclude`. **Integration point (explicit):** include `forecast` in the include and attach `forecast: listing.forecast ? mapForecast(listing.forecast) : undefined` inside `toListingWithStore` in `queries.ts`. Unit-test edge cases (<2 points → FAIR low-confidence, flat history → FAIR).
  - **Prisma:** new `PriceForecast`, `ListingMetricsLog`; `Listing.lowestEver Int?`.
  - **Acceptance:** A descending `PriceHistory` series yields a higher `computeDealScore` and BUY_NOW; <2 points yields FAIR with `sampleCount` reflected — covered by passing unit tests.

- [ ] **PR 29.2 — Daily forecast cron + admin metrics surface** (medium)
  - Add `src/app/api/cron/forecast/route.ts` (`CRON_SECRET` Bearer check) loading all listings with priceHistory, computing forecasts, upserting, updating `Listing.lowestEver`, and writing a `ListingMetricsLog` row. Batch (e.g. 100/iteration); record `durationMs`/error. Register in `vercel.json` after the Phase 16 scrape cron.
  - Add a read-only "Price Intelligence" card to `src/app/admin/page.tsx` (last run, listings scored, counts by verdict via `getForecastSummary()`) and a manual "Recompute forecasts" button wired to `recomputeForecastsAction` in `src/app/admin/forecasts/actions.ts`. Extend `getAdminStats()` with the verdict breakdown.
  - **Prisma:** none.
  - **Acceptance:** Hitting `/api/cron/forecast` with a valid token populates `PriceForecast` rows and writes one `ListingMetricsLog`; an invalid token returns 401.

- [ ] **PR 29.3 — Public deal-score badges, lowest-in-90-days & buy-now-or-wait UI** (medium)
  - Create `src/components/DealBadge.tsx` ("Lowest in 90 days" / "Deal score 92" / verdict pill, violet, AED via `formatPrice`) and `src/components/BuyNowOrWaitPanel.tsx` (verdict, predicted-drop sentence, low-confidence note). Render `DealBadge` on `ListingRow.tsx`/`ProductCard.tsx` and `BuyNowOrWaitPanel` on the product page alongside the Phase 9 chart. Add a "Best deals" section on `/products` sortable by `dealScore`. Components render nothing when `forecast` is undefined.
  - **Prisma:** none.
  - **Acceptance:** Where the cheapest listing's price equals its `lowest90`, a "Lowest in 90 days" badge and BUY_NOW panel render; a forecast-less listing renders no badge and no console error.

**Risks:** Sparse `PriceHistory` yields low-confidence forecasts — gate verdicts behind a minimum `sampleCount` and label clearly. The daily cron over all listings could exceed Vercel timeout — batch and cap. Forecasts are advisory ("historically lower in ~23 days"), never promissory.

**Out of scope:** ML model training/external forecasting (pure statistics in TypeScript). No Claude/LLM (Phase 30). No alert/notification changes. No per-store demand modelling.

---

## Phase 30 — AI Shopping Assistant — Claude-Powered Conversational Advisor

**Goal:** Add a streaming, Claude-powered chat advisor that answers natural-language buying questions ("best GPU under 4000 AED with 2yr warranty for 1440p") grounded strictly on our live catalog, listings, store ratings, and the Phase 29 forecasts — returning recommendations with real product links and AED prices.

**Depends on:** 3 (auth), 7 (catalog), 13 (user accounts), 18 (API/rate-limit surface), 29 (forecasts)

**New models:** `ChatSession`, `ChatMessage`, `AssistantUsage`

**Env vars:** `ANTHROPIC_API_KEY`, `ANTHROPIC_MODEL`, `ASSISTANT_DAILY_MSG_LIMIT`, `ASSISTANT_RATE_LIMIT_REDIS` (optional, reuses Phase 20 Upstash)

**Deliverables:**
- [ ] Anthropic client, a single catalog-retrieval tool, and an injection-sanitized grounding layer
- [ ] A streaming chat endpoint with a tool-use loop and per-user/per-anon rate limiting
- [ ] Streaming chat UI with trusted recommendation cards and site entry points

**Key files:** `src/lib/ai/client.ts`, `src/lib/ai/catalog-tool.ts`, `src/lib/ai/grounding.ts`, `src/lib/ai/system-prompt.ts`, `src/lib/db/chat.ts`, `src/app/api/assistant/route.ts`, `src/components/assistant/AssistantChat.tsx`, `src/app/(site)/assistant/page.tsx`

**Acceptance:** POSTing "cheapest RTX 4070 under 3500 AED with 2yr warranty" streams an answer plus a resolved list of real listing ids; exceeding the daily limit for the same anonId returns 429; the UI renders at least one clickable recommendation card linking to a real `/products/[slug]`.

**PRs:**

- [ ] **PR 30.1 — Anthropic client, catalog retrieval tool & grounding layer** (heavy)
  - Add `@anthropic-ai/sdk`; create `src/lib/ai/client.ts` initializing from `ANTHROPIC_API_KEY` + `ANTHROPIC_MODEL` (default `claude-opus-4-8`; `claude-haiku-4-5` is the cheap/high-throughput tier and `claude-sonnet-4-6` the balanced one). Use the Messages API with **streaming** (`client.messages.stream(...)` → `.finalMessage()`) inside the Route Handler, **tool use** for catalog grounding (the `searchCatalog` tool below), and **prompt caching** (`cache_control: { type: 'ephemeral' }`) on the stable system-prompt + catalog-schema prefix so repeated turns bill the prefix at ~0.1× input cost. Confirm streaming/tool-use shape against current Claude SDK guidance before coding (do not rely on training-data API shapes); verify the streaming approach against an actual Route Handler under `src/app/api/*`.
  - Create `src/lib/ai/catalog-tool.ts` defining one tool `searchCatalog({category?, brand?, maxPriceAed?, minWarrantyMonths?, inStockOnly?, query?})` calling `queries.ts` (`getAllProducts` + comparison helpers) and returning compact JSON of real products/listings/forecasts only. Create `src/lib/ai/grounding.ts` (token-efficient, injection-sanitized serialization: strip control chars, cap spec length) and `src/lib/ai/system-prompt.ts` (UAE gaming, AED, warranty/regional-shipping awareness, cite real listing ids, refuse on no match).
  - Add `ChatSession`/`ChatMessage`/`AssistantUsage` models + `src/lib/db/chat.ts`. Unit-test that `searchCatalog` returns only existing ids and respects `maxPriceAed`/`minWarrantyMonths`.
  - **Prisma:** new `ChatSession`, `ChatMessage` (content `@db.Text`, `toolCalls`/`recommendedListingIds` Json), `AssistantUsage`.
  - **Acceptance:** `searchCatalog({maxPriceAed:4000, minWarrantyMonths:24, category:'GPU'})` returns only DB listings satisfying both constraints and never fabricates an id (unit-verified against seeded data).

- [ ] **PR 30.2 — Streaming chat endpoint with tool-use loop & rate limiting** (heavy)
  - Create `src/app/api/assistant/route.ts` (POST) running the Claude streaming + tool-use loop (call `searchCatalog`, feed results back, stream final tokens), with `src/lib/ai/agent-loop.ts`. Persist user/assistant messages, tool calls, `recommendedListingIds`, and token counts.
  - Enforce per-user (Phase 13) and per-anon rate limiting + `ASSISTANT_DAILY_MSG_LIMIT` using `AssistantUsage` and optionally Phase 20 Upstash; return 429 with a friendly message. Resolve cited listing ids server-side to real `ListingWithStore` data so the client renders trusted cards. Structured errors: missing key → 503; tool errors degrade to an apologetic answer.
  - The programmatic `/api/v1` assistant exposure is deferred out of this PR (it adds a separate key-auth path); keep 30.2 focused on first-party streaming chat.
  - **Prisma:** none.
  - **Acceptance:** POSTing the example query streams an answer plus a resolved list of real listing ids; exceeding the daily limit for the same anonId returns 429.

- [ ] **PR 30.3 — Streaming chat UI & entry points** (medium)
  - Create `src/components/assistant/AssistantChat.tsx` (incremental tokens, typing indicator, trusted recommendation cards reusing `ProductCard`/`ListingRow`) and `AssistantLauncher.tsx` (floating violet button with UAE-tuned starter prompts). Add `src/app/(site)/assistant/page.tsx` full-page chat with session history for logged-in users. Persist `anonId` in a cookie; link sessions to userId on login. Wire the launcher into the site layout (dismissible, keyboard-accessible, `aria-live` for streamed text). Empty/rate-limited/error states match Phase 4.
  - **Prisma:** none.
  - **Acceptance:** Opening the assistant, typing a question, and submitting streams tokens and renders at least one clickable recommendation card linking to a real `/products/[slug]`.

**Risks:** Hallucinated products/prices destroy trust — hard-constrain Claude to the retrieval tool and render recommendations from DB ids, never model free text. Cost/abuse — per-anon and per-user rate limiting + a daily cap. Prompt injection via specs/store names — sanitize grounding text. Streaming latency — confirm runtime config against the real Route Handler.

**Out of scope:** Content generation/SEO copy (Phase 31), visual search (Phase 32), autonomous actions (orders, contacting sellers), fine-tuning, multilingual beyond the base model (Arabic polish deferred).

---

## Phase 31 — AI Content — Summaries, Product Q&A & Auto-Generated SEO Copy

**Goal:** Use Claude to generate and cache catalog content: concise spec/review summaries, natural-language answers to product questions, and auto-generated product descriptions plus SEO meta — all reviewable in admin and grounded on real specs, listings, and Phase 29 price signals.

> **Naming note (collision fix):** Phase 22 owns `src/lib/db/qa.ts` and the `Question`/`Answer` community Q&A. This phase's AI Q&A uses `src/lib/db/ai-qa.ts` and a distinct model `AiAnswer` (not `ProductQA`/`Question`/`Answer`) so the per-entity db convention is preserved.

**Depends on:** 5 (SEO), 11 (freshness pattern), 18 (API), 29 (price signals), 30 (Anthropic plumbing)

**New models:** `ProductContent`, `AiAnswer`, `ContentGenerationLog`

**Env vars:** `ANTHROPIC_CONTENT_MODEL` (optional override; reuses `ANTHROPIC_API_KEY`)

**Deliverables:**
- [ ] AI content generation engine (description/meta/spec-summary + grounded Q&A) and db layer
- [ ] An admin content studio: generate, review, edit, approve, publish
- [ ] Public AI content rendering, a product Q&A widget, and SEO wiring

**Key files:** `src/lib/ai/content.ts`, `src/lib/ai/qa.ts`, `src/lib/db/content.ts`, `src/lib/db/ai-qa.ts`, `src/app/admin/content/page.tsx`, `src/components/admin/ContentEditor.tsx`, `src/components/ProductQA.tsx`, `src/app/api/qa/route.ts`

**Acceptance:** An admin generates content, edits the draft, and Approve & Publishes; the product page renders the description and reflects `ProductContent.metaTitle`/`metaDescription`, and asking a spec question via the widget returns a grounded answer listed under the product.

**PRs:**

- [ ] **PR 31.1 — AI content generation engine, models & db layer** (heavy)
  - Add `ProductContent`, `AiAnswer`, `ContentGenerationLog` models via migration. Create `src/lib/ai/content.ts` (`generateDescription`, `generateMeta`, `generateSpecSummary` using the Phase 30 client + grounding, logging tokens) and `src/lib/ai/qa.ts` (`answerProductQuestion(product, question)` grounding strictly on specs/listings/forecast, returning `{answer, grounded}`; `grounded=false` + a "not in our data" answer when specs lack the info).
  - Create `src/lib/db/content.ts` (`upsertProductContent`, `getProductContent`, `setContentStatus`) and `src/lib/db/ai-qa.ts` (`createAiAnswer`, `getAiQAForProduct`). Add domain types + mappers. Default `ANTHROPIC_CONTENT_MODEL=claude-haiku-4-5` (bulk content is cost-sensitive); use **structured outputs** (`output_config.format` / `client.messages.parse`) so spec/review summaries validate to a schema, and run the bulk "generate for all missing" job through the **Batch API** (50% cost) rather than per-row live calls. Confirm the content model id/params against current Claude SDK guidance; unit-test that `answerProductQuestion` returns `grounded=false` for an absent spec.
  - **Prisma:** new `ProductContent (productId unique, status default draft, @db.Text fields)`, `AiAnswer`, `ContentGenerationLog`.
  - **Acceptance:** For a monitor whose specs omit refresh rate, "is it 144Hz?" returns `grounded=false` and an answer stating the spec isn't in our data rather than inventing one (unit-verified).

- [ ] **PR 31.2 — Admin content studio — generate, review, approve, publish** (medium)
  - Add `src/app/admin/content/actions.ts` (`generateContentAction`, `approveContentAction`, `publishContentAction`, `regenerateAction` — try/catch, `{error}|{}`, revalidate admin+public+`/`), `content/page.tsx` (queue by content status) and `content/[productId]/page.tsx` (side-by-side generated vs current, editable). Add `ContentEditor` (client, `useActionState`, violet approve, pending state) matching `ProductForm`. Flag content stale when product `updatedAt` is newer than `generatedAt`. Add a bulk "generate for all missing" action writing `ContentGenerationLog` rows. Surface content-status counts on admin home.
  - **Prisma:** none.
  - **Acceptance:** An admin generates, edits, and Approve & Publishes; `ProductContent.status` becomes `published` and the public page revalidates to show the new description.

- [ ] **PR 31.3 — Public AI content, product Q&A widget & SEO wiring** (medium)
  - Render published `ProductContent.description`/`specSummary` on the product page and feed `metaTitle`/`metaDescription` into `generateMetadata` (extending Phase 5 SEO + JSON-LD). Create `src/components/ProductQA.tsx` (ask box POSTing to `src/app/api/qa/route.ts`, rate-limited via Phase 20 limiter, calling `answerProductQuestion`, persisting `AiAnswer`). Show prior Q&A (`getAiQAForProduct`) with a helpful counter and a clear "not grounded" badge. Add AI-generated category intros to Phase 7 landing pages where content exists. Ensure JSON-LD stays valid and only published content is exposed.
  - **Prisma:** none.
  - **Acceptance:** On a product with published content, the description renders, `<title>`/meta reflect `ProductContent`, and a widget spec question returns a grounded answer then listed under the product.

**Risks:** Auto-generated SEO at scale risks thin/duplicate-content penalties — require admin approval, never auto-publish. AI Q&A can confidently answer absent specs — gate on available specs and mark missing data. Stale content after spec/price edits — flag when the product changes. Cost — batch and cache; generate Q&A on demand.

**Out of scope:** The conversational advisor (Phase 30), image generation (Phase 32), automated translation, a user-review collection system, and auto-publish without human review.

---

## Phase 32 — Catalog Intelligence — Identifier Normalization & Cross-Store Dedup

**Goal:** Make the catalog self-cleaning: normalize GTIN/EAN/model identifiers, automatically detect and surface duplicate products created across stores (including messy WhatsApp/Instagram names), and provide an admin review-and-merge workflow with reversible audit. Image-similarity is added as one optional dedup signal; the public visual-search experience is promoted to its own Phase 33-VS follow-up.

**Depends on:** 6 (images), 7 (categories), 10 (import), 15 (audit log), 16 (scraping), 18 (API)

**New models:** `ProductIdentifier`, `DuplicateCandidate`, `MergeLog`, `ProductEmbedding`

**Env vars:** `EMBEDDING_API_KEY`, `EMBEDDING_MODEL`, `VISUAL_SEARCH_ENABLED` (reuses `BLOB_READ_WRITE_TOKEN`)

**Deliverables:**
- [ ] Identifier normalization + a name/identifier matching engine producing duplicate candidates
- [ ] An admin dedup review & reversible merge workflow with a detection cron
- [ ] Image embeddings + an image-similarity signal feeding the dedup score (visual-search UX deferred)

**Key files:** `prisma/schema.prisma`, `src/lib/matching/identifiers.ts`, `src/lib/matching/similarity.ts`, `src/lib/db/identifiers.ts`, `src/lib/db/duplicates.ts`, `src/app/admin/duplicates/page.tsx`, `src/app/admin/duplicates/actions.ts`, `src/lib/matching/embeddings.ts`, `src/app/api/cron/dedup/route.ts`

**Acceptance:** Two products entered with the same EAN in different formats produce exactly one `DuplicateCandidate` with score ≥ 0.95 and reason `gtin-match`; approving a merge moves all listings onto the survivor, writes one `MergeLog` snapshot, and the survivor's comparison page shows the combined listings.

**PRs:**

- [ ] **PR 32.1 — Identifier normalization & matching engine** (heavy)
  - Add `ProductIdentifier (@@unique [kind, normalized])`, `DuplicateCandidate (@@unique pair, @@index [status, score])`, `MergeLog` models via migration. Create `src/lib/matching/identifiers.ts` (`normalizeGtin` strip/validate-check-digit/pad to GTIN-14, `normalizeModel`, upsert recording source) and `src/lib/matching/similarity.ts` (`nameSimilarity` token/Jaccard + brand/category gating, `scoreCandidates` merging identifier-match + name-fuzzy into a 0-1 score with reasons[]). Add `src/lib/db/identifiers.ts` and `src/lib/db/duplicates.ts`. Run candidate detection (exact identifier → high, fuzzy name within brand/category → medium), idempotent via the unique pair. Unit-test the GTIN-match and 8GB-vs-16GB-stays-below-threshold cases.
  - **Prisma:** new `ProductIdentifier`, `DuplicateCandidate`, `MergeLog`.
  - **Acceptance:** Two products with the same EAN in different formats (with/without leading zero) produce exactly one `DuplicateCandidate` with score ≥ 0.95 and reasons including `gtin-match`.

- [ ] **PR 32.1b — ProductForm identifier capture** (medium)
  - Add optional `gtin`/`ean`/`mpn` capture to `src/components/admin/ProductForm.tsx` and to `ProductInput`/`normalizeProductInput` in `src/lib/db/products.ts`, persisting via the upsert path from 32.1. Split out because touching the shared `ProductForm` (also modified by Phases 6/7/37) is independently reviewable and de-risks the core component.
  - **Prisma:** none (uses 32.1 models).
  - **Acceptance:** Saving a product with a GTIN persists a `ProductIdentifier` row with the normalized value and `source=manual`.

- [ ] **PR 32.2 — Admin dedup review & merge workflow** (medium)
  - Create `src/app/admin/duplicates/page.tsx` (pending candidates by score, both products side-by-side with listings/identifiers/images) and `actions.ts` (`mergeProductsAction(survivorId, mergedId)`, `dismissCandidateAction(id)`). Implement `mergeProducts` in `duplicates.ts`: re-point merged listings/identifiers/content to survivor, write a `MergeLog` snapshot, set status `merged`, delete the merged Product (cascade-safe). Add `src/app/api/cron/dedup/route.ts` (`CRON_SECRET`) refreshing candidates after scrape/import. Add an admin-home pending-candidate count + "rescan duplicates" button.
  - **Prisma:** none.
  - **Acceptance:** Approving a merge moves all merged-product listings onto the survivor, writes one `MergeLog` snapshot row, deletes the merged product, and the survivor's comparison page shows the combined listings.

- [ ] **PR 32.3 — Image embeddings & image-similarity dedup signal** (medium)
  - Add `ProductEmbedding (productId unique, vector Json, kind, imageUrl?)` usage; create `src/lib/matching/embeddings.ts` wrapping the provider (`EMBEDDING_API_KEY`/`EMBEDDING_MODEL`) to embed product images (Phase 6 `imageUrl`) with a text fallback, `src/lib/db/embeddings.ts`, and a batched backfill cron `src/app/api/cron/embeddings/route.ts` (`CRON_SECRET`). Add a `cosineSimilarity` util and feed `image-sim` into `scoreCandidates`, strengthening dedup for GTIN-less WhatsApp/Instagram listings. Cache vectors as Json with in-memory cosine (document pgvector as the scaling follow-up). Gate behind `VISUAL_SEARCH_ENABLED`.
  - Scoped to dedup signal only; the public visual-search upload UX is deferred (it is the heaviest, lowest-dedup-value surface and belongs with a discovery phase).
  - **Prisma:** new `ProductEmbedding`.
  - **Acceptance:** The embeddings cron populates a `ProductEmbedding` row for every product with an `imageUrl`, and two products with visually identical images surface a `DuplicateCandidate` whose reasons include `image-sim`.

**Risks:** Auto-merge is destructive (8GB vs 16GB variants) — merges are admin-reviewed, never automatic, fully logged with a `MergeLog` snapshot, and reversible-by-record. GTIN normalization edge cases (check digits, leading zeros). Json vectors + in-memory cosine is a temporary scaling compromise; pgvector is the flagged follow-up. Provider cost/latency requires batching.

**Out of scope:** Public visual-search upload UX (deferred follow-up), pgvector/ANN migration, unattended merging, barcode-scanning hardware, non-UAE catalogs, Product-schema re-architecture beyond additive tables.

---

## Phase 33 — Seller self-serve portal

**Goal:** Let verified UAE store owners claim their store and manage their own listings, prices, and stock from a role-scoped seller portal, without admin intervention. This turns the catalog from admin-curated into a self-updating marketplace.

**Depends on:** 3 (auth), 11 (freshness), 12 (verification), 13 (user accounts), 15 (quick update + audit), 19 (claim lead form)

**New models:** `StoreClaim`, `StoreMembership` (plus `Listing.ownerEditedAt`/`lastEditedByUserId`, `User.sellerOnboardedAt`)

**Env vars:** `SELLER_PORTAL_ENABLED`, `ADMIN_NOTIFY_EMAIL` (reuses `RESEND_API_KEY`)

**Deliverables:**
- [ ] Claim approval workflow + membership model converting the Phase 19 lead form into a real `StoreClaim`
- [ ] Seller portal shell, the central authorization primitive, and a dashboard
- [ ] Seller-scoped listing management with audited, membership-checked edits

**Key files:** `prisma/schema.prisma`, `src/lib/db/claims.ts`, `src/lib/db/memberships.ts`, `src/lib/auth/requireSeller.ts`, `src/app/(seller)/layout.tsx`, `src/app/(seller)/seller/listings/page.tsx`, `src/app/(seller)/seller/listings/actions.ts`, `src/lib/db/listings.ts`, `src/lib/db/audit.ts`

**Acceptance:** Submitting the public claim form creates a pending `StoreClaim`; an admin approving it creates an active owner `StoreMembership`; a seller editing one of their listing's AED price updates the public page and writes a `PriceHistory` row, while a crafted request with another store's listingId is rejected.

**PRs:**

- [ ] **PR 33.1 — Claim approval workflow & membership model** (heavy)
  - Add `StoreClaim`, `StoreMembership` models and `ClaimStatus`/`SellerRole`/`MembershipStatus` enums via migration; add `User.sellerOnboardedAt`. Build `src/lib/db/claims.ts` (`normalizeClaimInput`, `createClaim` with one-pending-per-store-per-user guard, `approveClaim` creating an active owner membership in a transaction, `rejectClaim`). Build `src/lib/db/memberships.ts` (`getMembershipsForUser`, `getMembershipForStoreUser`, `getStoreIdsForUser`). Convert the Phase 19 `stores/claim/page.tsx` static form into one that writes a `StoreClaim` (with `tradeLicenseNumber`, `instagramHandle`). Add `src/app/admin/claims/page.tsx` + `actions.ts` (approve/reject). Send Resend email to `ADMIN_NOTIFY_EMAIL` on new claim and to the claimant on resolution.
  - **Prisma:** new `StoreClaim`, `StoreMembership`; new enums `ClaimStatus`, `SellerRole`, `MembershipStatus`; `User.sellerOnboardedAt`.
  - **Acceptance:** Submitting the claim form creates a pending `StoreClaim`; admin approval creates an active owner `StoreMembership` and the claimant receives an approval email.

- [ ] **PR 33.2 — Seller portal shell, authorization primitive & dashboard** (medium)
  - Add `src/app/(seller)/layout.tsx` requiring a logged-in user with ≥1 active `StoreMembership`, else redirecting to `/seller/claim`. **Security foundation (moved here):** implement the full seller authorization primitive in this lighter PR — `src/lib/auth/requireSeller.ts` (returns active memberships + a store switcher), `getStoreIdsForUser`, and `assertSellerOwnsListing(listingId, userId)` / membership-scoped query helpers — with unit tests for the deny path, so the highest-risk authz logic is reviewed on its own rather than buried under listing UI.
  - Add a seller dashboard (`seller/page.tsx`: active store, listing count, stale-listing count via Phase 11, last-updated summary), `SellerSidebar.tsx` (violet/dark, seller badge), and a store profile editor limited to seller-safe fields (website, sources, location, warrantyDescription) — rating/reviewCount/verified stay admin-only.
  - **Prisma:** none.
  - **Acceptance:** A user with an active membership reaches `/seller` and sees only their own store; a logged-in user without a membership is redirected to the claim page; `assertSellerOwnsListing` denies cross-store ids (unit-tested).

- [ ] **PR 33.3 — Seller-scoped listing management** (heavy)
  - Add `seller/listings/page.tsx` (only rows where storeId ∈ the seller's active memberships) and `seller/listings/actions.ts` (`createSellerListingAction`, `updateSellerListingAction`, `deleteSellerListingAction`) that re-derive storeId from session membership via the already-reviewed 33.2 guard and reject any form-supplied storeId mismatch. Extend `listings.ts` with `updateListingAsSeller` (sets `ownerEditedAt`/`lastEditedByUserId`, reuses `recordPriceHistory`). Add membership-scoped inline AED quick-price/stock edit with WhatsApp/Instagram source preview. Write every seller edit to the Phase 15 audit log with the seller userId and `seller` actor type. Revalidate `/products`, `/products/[slug]`, `/stores/[slug]`, `/`.
  - **Prisma:** `Listing.ownerEditedAt DateTime?`, `Listing.lastEditedByUserId String?`.
  - **Acceptance:** A seller editing their listing's AED price updates the public product page and writes a `PriceHistory` row, while a crafted request with another store's listingId is rejected with an authorization error.

**Risks:** Authorization is the central risk — every seller action re-derives store ownership from session membership, never trusting a form `storeId`; the primitive now lands in 33.2 with deny-path tests. Self-serve price edits can degrade trust — keep verified badges admin-controlled and log every edit. Claim spoofing requires manual approval with trade-license evidence.

**Out of scope:** Seller billing/paid tiers (Phase 19), per-seller analytics (Phase 34), used/trade-in listings (Phase 36), seller-buyer chat, automated trade-license verification, multi-store franchise hierarchies.

---

## Phase 34 — Seller analytics & leads dashboard

**Goal:** Give each seller a private dashboard of impressions, listing clicks, click-throughs to their store/WhatsApp, conversion proxies, and how their offers rank against competitors on shared products — turning the portal into a reason sellers log in daily.

**Depends on:** 9 (charts), 17 (analytics primitives), 18 (event ingestion), 33 (membership scoping)

**New models:** `ListingEvent`, `DailyListingStat`, `StoreRankSnapshot`

**Env vars:** `ANALYTICS_INGEST_SECRET`, `CRON_SECRET`

**Deliverables:**
- [ ] Per-listing event capture + ingestion building on Phase 17 analytics (not a parallel system)
- [ ] Nightly rollups + a competitor-ranking cron with retention pruning
- [ ] A store-scoped seller analytics dashboard with privacy-safe competitor ranking

**Key files:** `prisma/schema.prisma`, `src/app/api/events/route.ts`, `src/lib/analytics/events.ts`, `src/components/seller/useImpressionTracker.ts`, `src/app/api/cron/rollup-listing-stats/route.ts`, `src/lib/db/seller-stats.ts`, `src/app/(seller)/seller/analytics/page.tsx`

**Acceptance:** Clicking a listing's WhatsApp deep link inserts one `whatsapp_click` event; the rollup cron produces one `DailyListingStat` per active listing with correct totals plus a `StoreRankSnapshot` matching `getTotalPrice` ordering; a seller sees KPI totals for only their own store and a ranking panel that never reveals a competitor's name or price.

**PRs:**

- [ ] **PR 34.1 — Event capture & ingestion** (medium)
  - Add `ListingEvent` model + `EventType` enum via migration. Instrument the public comparison UI (impression when a `ListingRow` enters the viewport via `useImpressionTracker`; `listing_click`/`outbound_click`/`whatsapp_click` on interactions), batched and POSTed to `src/app/api/events/route.ts` (validates `ANALYTICS_INGEST_SECRET`-derived origin, hashes session, drops obvious bots, bulk-inserts). Add `src/lib/analytics/events.ts` (`trackImpression`, `trackOutboundClick`) reusing the `StoreSource` union and explicitly building on Phase 17's analytics primitives (17 = page-views, 34 = per-listing seller events). Wire `whatsapp_click` into the existing deep links.
  - **Prisma:** new `ListingEvent`; new enum `EventType`.
  - **Acceptance:** Clicking a listing's WhatsApp deep link inserts exactly one `whatsapp_click` `ListingEvent` bound to the correct listingId/storeId.

- [ ] **PR 34.2 — Nightly rollups & competitor ranking cron** (medium)
  - Add `DailyListingStat` and `StoreRankSnapshot` models. Add `src/app/api/cron/rollup-listing-stats/route.ts` (`CRON_SECRET`) aggregating yesterday's events into `DailyListingStat` upserts and computing per-product price ranking by reusing `getTotalPrice` (price+shipping consistent) into `StoreRankSnapshot`. **Prune `ListingEvent` rows older than the retention window after a successful rollup** (acceptance criterion below). Add `src/lib/db/seller-stats.ts` (`getSellerKpis`, `getListingTrend`, `getRankSnapshots`).
  - **Prisma:** new `DailyListingStat`, `StoreRankSnapshot`.
  - **Acceptance:** The rollup over a day of seeded events produces one `DailyListingStat` per active listing with correct totals and a `StoreRankSnapshot` whose `priceRank` matches `getTotalPrice` ordering, and `ListingEvent` rows past the retention window are deleted.

- [ ] **PR 34.3 — Seller analytics dashboard UI** (medium)
  - Add `src/app/(seller)/seller/analytics/page.tsx` scoped via `requireSeller`, with a 7/30/90-day range selector, KPI cards (impressions, listing clicks, outbound + WhatsApp click-throughs, CTR, products where you're cheapest), per-listing trend charts reusing the Phase 9 Recharts component, and a competitor ranking panel showing "You rank #N of M on price" and AED gap-to-cheapest without revealing competitor identities or raw prices. Empty/low-data states match Phase 4.
  - **Prisma:** none.
  - **Acceptance:** A seller viewing `/seller/analytics` for 30 days sees KPI totals matching summed `DailyListingStat` rows for only their store and a ranking panel that never displays another store's name or price.

**Risks:** Event volume balloons — raw `ListingEvent` rolled up nightly and pruned. Bot/self-traffic — `sessionHash` + simple bot filter. Competitor rank must not leak exact prices — expose only rank position and gap-to-cheapest. Conversion is a proxy ("outbound clicks / WhatsApp taps", not "sales").

**Out of scope:** True purchase conversion/revenue (no checkout), paid boosts (Phase 19), exporting competitor pricing, real-time streaming, listing A/B testing, cross-store benchmarking as a product.

---

## Phase 35 — Gaming PC builder & compatibility configurator

**Goal:** Let users assemble a full gaming PC from catalog parts with real compatibility checks (socket, RAM type, wattage, form factor), see the total build price compared across UAE stores, and share a build via a public link.

**Depends on:** 5 (SEO/share), 7 (categories→slots), 8 (store pages), 9 (charts/links), 13 (user accounts)

**New models:** `ComponentSlot`, `CompatibilityRule`, `Build`, `BuildItem` (plus `Product.compatibilitySpecs`)

**Env vars:** `NEXT_PUBLIC_SITE_URL`

**Deliverables:**
- [ ] Compatibility schema, a typed `ProductForm` spec editor, and a pure evaluator
- [ ] A builder UI with slot picker, live compatibility, and cheapest-store totals
- [ ] Save/share + SEO build pages

**Key files:** `prisma/schema.prisma`, `src/lib/db/component-slots.ts`, `src/lib/db/compatibility-rules.ts`, `src/lib/builder/compatibility.ts`, `src/app/(site)/build/page.tsx`, `src/lib/db/builds.ts`, `src/app/(site)/build/[shareSlug]/page.tsx`, `src/app/(site)/build/actions.ts`

**Acceptance:** `evaluateBuild` flags an error for an AM5 board + LGA1700 CPU; selecting a CPU hides incompatible-socket motherboards; saving a build returns a `/build/<shareSlug>` URL that, opened anonymously, shows the same parts and a freshly computed total-across-stores price and increments `viewCount`.

**PRs:**

- [ ] **PR 35.1 — Compatibility schema, rules CRUD & pure evaluator** (heavy)
  - Add `ComponentSlot`, `CompatibilityRule` models, `RuleOperator`/`RuleSeverity` enums, and `Product.compatibilitySpecs Json?` via migration. Add `src/lib/db/component-slots.ts` and `src/lib/db/compatibility-rules.ts` (CRUD following the `normalize*Input` + slug/uniqueness pattern). Add admin screens `src/app/admin/builder/slots/` and `builder/rules/` with actions mirroring the create/update/delete + redirect pattern. Seed default slots (cpu, motherboard, gpu, ram, storage, psu, case, cooler) and core rules in `prisma/seed.ts` (local only). Add `src/lib/builder/compatibility.ts` (`evaluateBuild(items, rules)` returning typed errors/warnings, unit-testable without DB).
  - **Prisma:** new `ComponentSlot`, `CompatibilityRule`; enums `RuleOperator`, `RuleSeverity`; `Product.compatibilitySpecs Json?`.
  - **Acceptance:** `evaluateBuild` flags an error for an AM5 board + LGA1700 CPU and none for a socket-matched pair, driven purely by `CompatibilityRule` rows.

- [ ] **PR 35.1b — ProductForm compatibility-attributes editor** (medium)
  - Extend `src/components/admin/ProductForm.tsx` with a structured compatibility-attributes editor (typed key/value with allowed-value hints per category) writing `compatibilitySpecs`, plus the `ProductInput`/`normalizeProductInput` changes. Split out because the shared `ProductForm` is touched by Phases 6/7/32/37 and is independently reviewable.
  - **Prisma:** none (uses 35.1 migration).
  - **Acceptance:** An admin enters `{socket:AM5, memoryType:DDR5}` on a motherboard and it persists to `Product.compatibilitySpecs` and is read back by `evaluateBuild`.

- [ ] **PR 35.2 — Builder UI, slot picker & live compatibility** (heavy)
  - Add `src/app/(site)/build/page.tsx` (one row per `ComponentSlot`, a part picker filtered by the slot's `categorySlug`) and `src/lib/db/builds.ts` helpers (`getBuilderSlots`, `getCompatibleProductsForSlot` pre-filtering via `compatibility.ts`). Add a live compatibility panel (red=blocking, amber=advisory). Per-slot cheapest-store selection reusing `getTotalPrice`/`getComparisonHighlights`, honoring inStock + Phase 11 freshness. Running total AED with a per-slot "lowest at <store>" breakdown and product links. Hold in-progress build state in URL/query so it survives refresh.
  - **Prisma:** none.
  - **Acceptance:** Selecting a CPU then opening the motherboard picker hides incompatible-socket boards, and the running total equals the sum of each slot's cheapest in-stock listing via `getTotalPrice`.

- [ ] **PR 35.3 — Save, share & SEO build pages** (medium)
  - Add `src/app/(site)/build/actions.ts` (`saveBuildAction` creating `Build` + `BuildItem` with a unique `shareSlug`, attaching userId when logged in), a read-only `build/[shareSlug]/page.tsx` (parts, compatibility status, live re-priced total at view time), `builds.ts` (`createBuild` transaction, `getBuildByShareSlug`, `incrementBuildView`), OG/Twitter + JSON-LD extending Phase 5 helpers + sitemap inclusion, and a "My builds" list at `account/builds/page.tsx`. Copy-link share button; revalidate the build slug on save.
  - **Prisma:** new `Build`, `BuildItem`.
  - **Acceptance:** Saving a build returns a `/build/<shareSlug>` URL that, opened anonymously in a fresh session, shows the same parts and a freshly computed total-across-stores price and increments `viewCount`.

**Risks:** Compatibility data quality is make-or-break — the typed `compatibilitySpecs` layer plus admin entry/validation is required or checks give false confidence. Rule complexity can spiral — keep to a handful of high-value rules and mark the rest advisory. "Total across stores" must reuse Phase 11 freshness and inStock filtering. Public shared builds need bot/abuse handling.

**Out of scope:** Automated spec scraping (manual/CSV via Phase 10), one-click buy-whole-build, multi-store cart, peripherals/monitor bundling, AI part recommendations, wattage estimation beyond PSU-headroom, build revision history.

---

## Phase 36 — Used / trade-in marketplace

**Goal:** Add a second-hand gear marketplace where users and sellers list used gaming hardware with condition grading, seller trust signals, warranty-remaining info, and safe-meet guidance — kept clearly separate from new-retail comparison listings.

**Depends on:** 8 (store pages), 11 (freshness), 12 (verification), 13 (user accounts), 14 (alerts), 33 (seller portal)

**New models:** `UsedListing`, `UsedListingImage`, `SellerTrustProfile`, `UsedListingReport`

**Env vars:** `USED_MARKETPLACE_ENABLED`, `ADMIN_NOTIFY_EMAIL` (reuses `BLOB_READ_WRITE_TOKEN`)

**Deliverables:**
- [ ] Used-listing model + images + a logged-in user submission flow (pending_review by default)
- [ ] A public used marketplace, trust card, and safe-meet UX kept separate from retail comparison
- [ ] A moderation queue, reporting flow, and an expiry cron

**Key files:** `prisma/schema.prisma`, `src/lib/db/used-listings.ts`, `src/app/(site)/sell/page.tsx`, `src/app/(site)/sell/actions.ts`, `src/app/(site)/used/page.tsx`, `src/app/(site)/used/[slug]/page.tsx`, `src/app/admin/used/page.tsx`, `src/app/api/cron/expire-used-listings/route.ts`

**Acceptance:** A logged-in user submits a `UsedListing` (status pending_review, 30-day `expiresAt`, AED price, ≥1 image) that does not appear in the feed; an admin approving it makes it appear in `/used`; the expiry cron flips past-`expiresAt` listings to expired; the WhatsApp contact value appears only on the detail page (never in the feed or sitemap).

**PRs:**

- [ ] **PR 36.1 — Used listing model, images & seller submission** (heavy)
  - Add `UsedListing`, `UsedListingImage` models and `UsedCondition`/`Emirate`/`UsedListingStatus` enums via migration. Build `src/lib/db/used-listings.ts` (`normalizeUsedListingInput` trim + slugify + AED default + 30-day `expiresAt` default + status pending_review, `createUsedListing`, `getUsedListingBySlug`, `getActiveUsedListings`). Add the submission form at `src/app/(site)/sell/page.tsx` (condition grading, emirate, warranty-remaining, receipt toggle, contact source/value from `StoreSource`) and `sell/actions.ts` (`createUsedListingAction`, `updateUsedListingAction`, `markSoldAction` deriving `sellerUserId` from session). Image upload to Vercel Blob (reuse Phase 6 helper) writing `UsedListingImage` rows.
  - `SellerTrustProfile` is moved to 36.2 (it is orthogonal to the submission data path and is rendered/moderated there).
  - **Prisma:** new `UsedListing`, `UsedListingImage`; enums `UsedCondition`, `Emirate`, `UsedListingStatus`.
  - **Acceptance:** A submitted used listing has status pending_review, a 30-day `expiresAt`, AED price, and ≥1 linked image, and does not yet appear in the public feed.

- [ ] **PR 36.2 — Public used marketplace, trust & safe-meet UX** (medium)
  - Add `SellerTrustProfile` model + `src/lib/db/seller-trust.ts` (auto-create/update on first listing: `joinedAt`, `displayName`). Build `src/app/(site)/used/page.tsx` (filters category/condition/emirate/price, only active + unexpired) and `used/[slug]/page.tsx` (image gallery, condition badge, warranty-remaining, seller trust card, gated contact reveal). Add a `SafeMeetGuide` component (public-place tips, inspect-before-pay, "platform does not handle payment" disclaimer). Keep `/used` visually distinct so used items never mix into retail comparison. `incrementUsedListingView`; exclude contact value from sitemap/feeds.
  - **Prisma:** new `SellerTrustProfile`.
  - **Acceptance:** The `/used` feed shows only active, non-expired listings, and a listing's WhatsApp contact appears only on its detail page (never in the feed or sitemap), behind a reveal action.

- [ ] **PR 36.3 — Moderation queue, reporting & expiry cron** (medium)
  - Add `UsedListingReport` model + **domain-prefixed enums `UsedReportReason`/`UsedReportStatus`** (avoiding the Phase 23 `ReportReason`/`ReportStatus` global-namespace clash). Add `src/app/admin/used/page.tsx` + `actions.ts` (approve pending_review → active, reject/remove, view open reports). Add a public "report this listing" flow writing `UsedListingReport` with Resend notification to `ADMIN_NOTIFY_EMAIL`. Add `src/app/api/cron/expire-used-listings/route.ts` (`CRON_SECRET`) flipping past-`expiresAt` active listings to expired and emailing a relist prompt. Add admin ability to toggle `SellerTrustProfile.isIdVerified` and increment `completedSales` on sold. Reuse Phase 14 alert plumbing so a saved-product alert can optionally include matching active used listings.
  - **Prisma:** new `UsedListingReport`; enums `UsedReportReason`, `UsedReportStatus`.
  - **Acceptance:** Approving a pending_review listing makes it appear in `/used`, the expiry cron flips a past-`expiresAt` listing to expired, and a report creates an open `UsedListingReport` plus an admin email.

**Risks:** Trust & safety dominate — pending_review default + moderation queue + reporting are mandatory before anything is public; the platform must not imply it brokers deals. `UsedListing` stays fully separate from retail `Listing` — comparison logic must never ingest used items. Contact details are PII — detail-page only, never in feeds/sitemaps, rate-limited reveals. Safe-meet guidance is advisory with clear disclaimers (extend Phase 19 terms).

**Out of scope:** Payments/escrow, shipping/logistics, automated ID verification (flag-only), buyer-seller chat, dispute resolution, importing dubizzle listings, used-vs-retail comparison, trade-in valuation.

---

## Phase 37 — Internationalization & Arabic RTL Localization

**Goal:** Add a full i18n layer so the public site serves both English (LTR) and Arabic (RTL) with localized number, currency, and date formatting. Make the locale a first-class part of the URL and persisted per visitor, without forking the admin into a second language.

**Depends on:** 4 (UX), 5 (SEO), 7 (categories), 8 (store pages)

**New models:** `Translation` (plus `Product.nameAr`/`specsAr`, `Store.warrantyDescriptionAr`/`locationAr`)

**Env vars:** `NEXT_PUBLIC_DEFAULT_LOCALE`, `NEXT_PUBLIC_SUPPORTED_LOCALES`

**Deliverables:**
- [ ] next-intl `[locale]` routing, composed locale+admin middleware, and message catalogs
- [ ] An RTL layout pass + locale-aware number/currency/date formatting (a breaking `formatPrice` signature change)
- [ ] A translation data model + admin Arabic editing

> **Migration note:** This phase restructures `src/app/(site)/*` to `src/app/[locale]/(site)/*`. It must migrate every code-referenced public path and `revalidatePath('/...')` call from Phases 21-36 to locale-prefixed variants, and update every `formatPrice` caller (ListingRow, ProductCard, product page, the Phase 25 channel bodies) for the new locale parameter — all within this phase.

**Key files:** `src/middleware.ts`, `src/i18n/routing.ts`, `src/i18n/request.ts`, `src/app/[locale]/(site)/layout.tsx`, `src/messages/{en,ar}.json`, `src/lib/comparison.ts`, `src/lib/format.ts`, `src/components/LocaleSwitcher.tsx`, `src/lib/db/translations.ts`

**Acceptance:** `/ar/products` renders with `<html dir="rtl" lang="ar">`, Arabic header/sort labels, mirrored comparison table, localized AED strings, and hreflang en/ar alternates, while `/products` (en) renders LTR and `/admin` is unaffected.

**PRs:**

- [ ] **PR 37.1 — next-intl routing, locale middleware & message catalogs** (heavy)
  - Add next-intl with a `[locale]` segment (en default LTR, ar RTL): restructure `src/app/(site)/*` under `src/app/[locale]/(site)/*`. Create `src/i18n/routing.ts` (`localePrefix: 'as-needed'`) and `request.ts`. Compose locale middleware with the existing admin-auth middleware in `src/middleware.ts` using a matcher excluding `/admin`, `/api`, and static assets. Add `src/messages/en.json`/`ar.json` for static chrome (header, footer, sort labels, empty states). Set `<html lang>`/`dir` from the active locale in the `[locale]` layout. Wire `useTranslations` into Header, SearchBar, and sort controls. **Migrate stale public paths and `revalidatePath` calls from Phases 21-36.**
  - **Prisma:** none.
  - **Acceptance:** `/ar/products` renders with `<html dir="rtl" lang="ar">` and Arabic header/sort labels; `/products` still renders LTR; `/admin` is unaffected.

- [ ] **PR 37.2 — RTL layout pass & localized number/currency/date formatting** (medium)
  - Migrate public components to Tailwind logical properties (`ms`/`me`/`ps`/`pe`, `text-start`/`end`) so ProductCard, ListingRow, StoreCard, and the comparison page mirror in RTL. **Breaking change:** extend `formatPrice` in `comparison.ts` to take a locale param (`Intl.NumberFormat(locale==='ar'?'ar-AE':'en-AE')`, currency AED, Western-digit `numberingSystem` default) and update all callers in this PR. Add `formatDate`/`formatNumber` in `src/lib/format.ts`. Localize lastUpdated, shipping days, and price-change badges. Add hreflang en/ar alternates + per-locale canonical to product/store metadata. Add a `LocaleSwitcher` preserving the current path.
  - **Prisma:** none.
  - **Acceptance:** On `/ar/products/[slug]` the comparison table is mirrored (cheapest badge on the correct side), prices render as a localized AED string, and the page exposes hreflang en/ar alternates.

- [ ] **PR 37.3 — Translation data model & admin translation editing** (medium)
  - Add `Translation` model + `Product.nameAr`/`specsAr` and `Store.warrantyDescriptionAr`/`locationAr` via migration. Add `src/lib/db/translations.ts` (`getTranslationsForEntity`, `upsertTranslation`). Extend mappers so `mapProduct`/`mapStore` optionally take a locale and return Arabic values when present, falling back to English. Add an Arabic tab to `ProductForm`/`StoreForm` wired through `upsertTranslation` actions. Add a "translation coverage" indicator (AR ✓ vs missing) to admin tables. Revalidate both `/en` and `/ar` paths after an upsert.
  - **Prisma:** new `Translation (@@unique [entityType, entityId, locale, field])`; `Product.nameAr`/`specsAr`; `Store.warrantyDescriptionAr`/`locationAr`.
  - **Acceptance:** An admin sets an Arabic product name; `/ar/products/[slug]` shows it while `/products/[slug]` shows English, and the admin table marks the product AR-translated.

**Risks:** next-intl middleware can conflict with the Phase 3 admin auth middleware — compose matchers carefully so `/admin` is excluded. RTL needs Tailwind logical properties; partial migration leaves mirrored-but-broken layouts. Arabic-Indic vs Western digits needs an explicit `numberingSystem` decision. Translation gaps fall back to English silently — flag in admin.

**Out of scope:** Translating the admin UI (English-only), machine translation of specs, multi-currency (Phase 38), RTL marketing/SEO content beyond hreflang.

---

## Phase 38 — Multi-Country & Multi-Currency Expansion

**Goal:** Expand beyond the UAE to KSA, Qatar, and Kuwait by introducing a Region concept that scopes stores, listings, shipping, and pricing, plus a currency + FX layer so prices display in the visitor's local currency. Add a region switcher so a user in Riyadh sees SAR-priced, KSA-available offers.

**Depends on:** 7 (categories), 8 (store pages), 12 (verification), 37 (locale plumbing)

**New models:** `Region`, `ExchangeRate`, `StoreRegion` (plus `Listing.regionId`)

**Env vars:** `OPENEXCHANGERATES_APP_ID`, `NEXT_PUBLIC_DEFAULT_REGION`, `FX_REFRESH_CRON_SECRET`

**Deliverables:**
- [ ] Region/currency models, an FX cron, money-precision utilities, and a listing backfill
- [ ] Region-scoped public catalog, a region switcher, and display-currency comparison
- [ ] Admin region management + per-store regional shipping

**Key files:** `prisma/schema.prisma`, `src/lib/db/regions.ts`, `src/lib/db/fx.ts`, `src/lib/money.ts`, `src/app/api/cron/refresh-fx/route.ts`, `src/lib/region.ts`, `src/lib/db/queries.ts`, `src/lib/comparison.ts`, `src/components/RegionSwitcher.tsx`, `src/app/admin/regions/actions.ts`

**Acceptance:** After backfill, `refresh-fx` inserts an AED→SAR rate and `convertPrice(4000,'AED','SAR')` returns the converted amount; switching to KSA shows only listings from stores shipping to SA with prices converted to SAR and the cheapest highlight computed on the SAR display total.

**PRs:**

- [ ] **PR 38.1 — Region & currency data model, FX cron, and listing backfill** (heavy)
  - Add `Region`, `ExchangeRate`, `StoreRegion` models and `Listing.regionId` via migration, plus a data migration backfilling all existing listings/stores to the AE region (or queries break). Add `src/lib/db/regions.ts` (`getActiveRegions`, `getRegionByCode`) and `src/lib/db/fx.ts` (`getLatestRate`, `recordRate`, `convert`). Add a daily `src/app/api/cron/refresh-fx/route.ts` (`FX_REFRESH_CRON_SECRET`) pulling AED→SAR/QAR/KWD from openexchangerates. Add `src/lib/money.ts` handling minor-unit precision (KWD=3 decimals) for convert/format, plus `convertPrice(amount, from, to)`. Seed the four regions (AE active, others inactive) in `prisma/seed.ts` (local only).
  - **Prisma:** new `Region`, `ExchangeRate`, `StoreRegion`; `Listing.regionId String?` + relation; data migration backfilling to AE.
  - **Acceptance:** After migrating, `refresh-fx` (with the secret) inserts an AED→SAR `ExchangeRate`, and `convertPrice(4000,'AED','SAR')` returns the converted amount at the stored rate.

- [ ] **PR 38.2 — Region-scoped public catalog, region switcher & display-currency comparison** (medium)
  - Add a region resolver (`src/lib/region.ts`: cookie + Accept-Region header + `?region=`, default AE) alongside the Phase 37 locale resolver. Scope `getAllProducts`/`getProductBySlug` to listings from stores shipping to the active region (via `StoreRegion`). Convert `getTotalPrice`/`sortListings` to operate on a common display currency so the cheapest badge is correct across mixed-currency listings. Add a `RegionSwitcher` (flag + currency) next to the LocaleSwitcher, persisting to a cookie. Show prices in the region currency with a "rate as of {date}" tooltip on converted prices. Hide inactive regions from the switcher.
  - **Prisma:** none.
  - **Acceptance:** Switching to KSA shows only listings from stores shipping to SA, with prices converted to SAR and the cheapest highlight computed on the SAR display total.

- [ ] **PR 38.3 — Admin region management & per-store regional shipping** (medium)
  - Add `/admin/regions` CRUD (`page`, `new`, `[id]/edit`, `actions.ts`) following the create/update/delete pattern (delete blocked if listings reference the region). Add `RegionForm` (`useActionState`, violet, FormState error) and `RegionTable` with a listing `_count`. Add a `StoreRegion` editor (multi-region checkboxes + per-region shipping cost/days) to `StoreForm` via a `manageStoreRegions` action. Add an admin manual exchange-rate entry (source `manual`) for FX-API outages. Add region + currency columns to the admin listings table + an optional region filter. Revalidate region-scoped public paths after mutations.
  - **Prisma:** none (uses 38.1 models).
  - **Acceptance:** An admin activates Qatar, marks a store as shipping to Qatar with 50 QAR shipping, and that store's listings appear in the public Qatar catalog with the configured shipping.

**Risks:** Existing listings have no `regionId` — the backfill must default to AE. Source-currency vs normalized-base is foundational — `getTotalPrice` must convert to a common display currency before sorting or the cheapest-sort corrupts. KWD has 3 decimals, breaking the integer-fils assumption. FX staleness needs a "rate as of" disclosure. Region and locale are independent (an Arabic speaker in UAE) — coupling them is a bug.

**Out of scope:** Real-time local-currency checkout, country VAT/invoicing, per-region admin roles, region ccTLDs (stays subpath), customs/duty estimation.

---

## Phase 39 — Distribution Surface — WhatsApp & Telegram Deal Bots

**Goal:** Push Gaming Stores into the channels UAE gamers live in: a WhatsApp Business + Telegram deal bot that broadcasts region-targeted price drops, with consent-based opt-in and an admin broadcast console. The browser extension and native mobile app — each a distinct runtime sharing no code with the bots beyond the Phase 18 API — are promoted to their own phases (40 and 41) so this phase ships independent value.

> **Phase-split note:** The original "three runtimes in one phase" design is split: this Phase 39 is the deal-bot surface only; the Manifest V3 browser extension becomes its own phase and the Expo native app becomes its own phase. Numbering for the hardening theme shifts accordingly (production hardening is Phase 40 below, kept as the headline closer; extension and mobile are tracked as follow-on phases 41-42).

**Depends on:** 9 (price history), 13 (user accounts), 14 (alerts), 18 (API), 37 (localized copy), 38 (region targeting)

**New models:** `BotSubscriber`, `BotBroadcast`

**Env vars:** `WHATSAPP_BUSINESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_WEBHOOK_VERIFY_TOKEN`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_WEBHOOK_SECRET`, `BOT_BROADCAST_CRON_SECRET`

**Deliverables:**
- [ ] Bot subscriber model, signature-verified webhooks, and opt-in commands with PDPL consent
- [ ] A deal-broadcast engine, cron, and an admin broadcast console

**Key files:** `prisma/schema.prisma`, `src/lib/db/bot-subscribers.ts`, `src/app/api/bots/telegram/route.ts`, `src/app/api/bots/whatsapp/route.ts`, `src/lib/bots/{telegram,whatsapp,index,broadcast}.ts`, `src/app/api/cron/send-deals/route.ts`, `src/app/admin/broadcasts/page.tsx`, `src/app/admin/broadcasts/actions.ts`

**Acceptance:** Sending `/start` to the Telegram webhook creates an active `BotSubscriber` with a consent timestamp; `/stop` deactivates it; when a tracked product's cheapest listing drops past the threshold, `send-deals` creates a `sent` `BotBroadcast` and delivers a localized, region-currency message to matching active Telegram subscribers.

**PRs:**

- [ ] **PR 39.1 — Bot subscriber model, webhook intake & opt-in commands** (heavy)
  - Add `BotSubscriber` and `BotBroadcast` models via migration plus `src/lib/db/bot-subscribers.ts` (`subscribe`, `unsubscribe`, `getActiveSubscribers` by channel/region/category). Add a Telegram webhook (`src/app/api/bots/telegram/route.ts`) verifying `TELEGRAM_WEBHOOK_SECRET` and handling `/start`, `/stop`, `/region`, `/category`. Add a WhatsApp Cloud webhook (`whatsapp/route.ts`) with GET `hub.challenge` verification and POST signature check, mapping opt-in keywords to subscribe/unsubscribe. Store explicit messaging consent + timestamp for PDPL. Add `src/lib/bots/` with a `sendMessage(channel, externalId, payload)` adapter. Region/locale-aware records for Phase 38 filtering.
  - **Prisma:** new `BotSubscriber (@@unique [channel, externalId])`, `BotBroadcast`.
  - **Acceptance:** Sending `/start` to the Telegram webhook creates an active `BotSubscriber` with a consent timestamp; `/stop` deactivates it (verified by a row update).

- [ ] **PR 39.2 — Deal-broadcast engine, cron, and admin broadcast console** (heavy)
  - Add `src/app/api/cron/send-deals/route.ts` (`BOT_BROADCAST_CRON_SECRET`) detecting significant price drops via Phase 9 history + Phase 14 thresholds and enqueuing `BotBroadcast` rows per region. Implement fan-out respecting the WhatsApp 24h-window/template rules and Telegram rate limits, updating `sentCount`/`status`. Compose localized (Phase 37) copy in region currency (Phase 38), deep-linking to `/[locale]/products/[slug]`. Add `/admin/broadcasts` (list, compose, schedule, send-now) with `actions.ts`, a `BroadcastForm` + `BroadcastTable`, per-broadcast delivery stats, subscriber/category targeting, and a dry-run preview.
  - **Prisma:** none (uses 39.1 models).
  - **Acceptance:** When a tracked product's cheapest listing drops past the threshold, `send-deals` creates a `sent` `BotBroadcast` and delivers a localized deal message to matching active Telegram subscribers.

**Risks:** WhatsApp Business Cloud API requires Meta-approved templates and enforces 24h session windows — broadcasts need pre-approved utility templates or they silently fail. Webhook endpoints are public attack surface — verify signatures (Telegram secret token, Meta `X-Hub-Signature`) and add replay protection. Bot-messaging consent intersects PDPL (Phase 40) — store explicit consent.

**Out of scope:** In-chat conversational AI (bots are broadcast + simple commands), payments/checkout in the bot, Instagram/TikTok DM automation. The browser extension and Expo app are separate phases (41-42).

---

## Phase 40 — Production Hardening & Governance

**Goal:** Harden Gaming Stores for real production traffic and regulatory exposure: observability (Sentry, structured logging, uptime), security (rate limiting, WAF, secure headers), UAE PDPL + GDPR compliance with cookie consent, Core Web Vitals + WCAG 2.1 AA, and feature flags / A/B testing behind enforced CI quality gates.

**Depends on:** 3 (auth), 13 (user accounts), 14 (alerts/PII), 17 (analytics), 18 (API guard), 37 (RTL a11y), 38 (regions), 39 (bot subscribers/consent)

**New models:** `ConsentRecord`, `DataRequest`, `FeatureFlag`, `Experiment`, `ExperimentAssignment` (plus a `CronRun` health table)

**Env vars:** `SENTRY_DSN`, `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_AUTH_TOKEN`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `UPTIME_HEARTBEAT_URL`, `DATA_REQUEST_NOTIFY_EMAIL`, `NEXT_PUBLIC_PRIVACY_POLICY_VERSION`

**Deliverables:**
- [ ] Observability: Sentry, structured logging, uptime heartbeats, an admin health page
- [ ] Security: rate limiting, secure headers/WAF, webhook hardening, CSRF, secrets hygiene
- [ ] PDPL + GDPR compliance: cookie consent + DSAR export/delete cascade + legal pages
- [ ] Feature flags + A/B testing, a performance pass, a WCAG 2.1 AA pass, and CI quality gates

**Key files:** `sentry.client.config.ts`, `sentry.server.config.ts`, `instrumentation.ts`, `src/lib/log.ts`, `src/app/admin/health/page.tsx`, `src/middleware.ts`, `src/lib/rate-limit.ts`, `src/lib/db/consent.ts`, `src/components/ConsentBanner.tsx`, `src/lib/flags.ts`, `.github/workflows/ci.yml`

**Acceptance:** A thrown server-action error appears in Sentry with requestId+region tags and PII scrubbed; exceeding the API rate returns 429 with Retry-After; a user's account deletion cascades across SavedProduct/PriceAlert/BotSubscriber/PushSubscription/ConsentRecord; an admin feature flag at 50% rollout shows for ~half of AE visitors (stable per visitorId); and a PR introducing an axe violation fails CI.

**PRs:**

- [ ] **PR 40.1 — Observability — Sentry, structured logging & uptime** (heavy)
  - Integrate Sentry (client/server/edge) with build-time source-map upload, scrubbing PII before send. Add `src/lib/log.ts` (JSON logs with requestId/route/region/locale) used by server actions, cron routes, and bot webhooks. Add request-id propagation, error boundaries, and a Sentry-reporting `global-error.tsx`. Add uptime heartbeats from cron routes (`refresh-fx`, `send-deals`, `check-alerts`) pinging `UPTIME_HEARTBEAT_URL` on success. Add `/admin/health` showing recent cron status, error counts, and last FX refresh from a definite `CronRun` table.
  - **Prisma:** new `CronRun(id, job, status, startedAt, finishedAt, error?)` backing the health page.
  - **Acceptance:** A thrown server-action error appears in Sentry with requestId+region tags and PII scrubbed, and `/admin/health` shows the last successful run time of each cron.

- [ ] **PR 40.2 — Security — rate limiting, WAF rules, secure headers & secrets hygiene** (heavy)
  - Add Upstash Redis rate limiting scoped to auth, admin mutations, the Phase 18 API, and bot webhooks (sliding window, per-IP and per-API-key). Add security headers (Sentry-compatible CSP, HSTS, frame-ancestors, Referrer-Policy) via `next.config.ts` + middleware. Add Vercel WAF/firewall rules config and document the ruleset. Harden webhook signature checks (Telegram secret, Meta `X-Hub-Signature`) + replay protection. Add CSRF protection on server-action forms + origin checks on the API. **Ground the API guard in the Phase 18 deliverable** (the shared helper in `src/lib/`, not a new `src/app/api/v1/_lib/`). Add secrets-scanning + dependency-audit and rotate any mis-exposed client env vars.
  - **Prisma:** none.
  - **Acceptance:** Exceeding the configured request rate on the Phase 18 API returns HTTP 429 with a Retry-After header, while normal browsing is unaffected.

- [ ] **PR 40.3 — PDPL + GDPR compliance, cookie consent & data subject requests** (heavy)
  - Add `ConsentRecord` and `DataRequest` models + `src/lib/db/consent.ts`/`data-requests.ts`. Add a cookie-consent banner (functional/analytics/marketing) that **defers** Phase 17 analytics and Phase 39 marketing scripts until consent, storing a `ConsentRecord` with `policyVersion`. Add `/[locale]/privacy` and `/[locale]/cookies` (EN + AR) referencing UAE PDPL and GDPR. Add a `/account/privacy` data-request flow (export / delete) creating `DataRequest` rows, with an admin fulfillment queue at `/admin/data-requests`. Implement export/delete cascading across User, SavedProduct, PriceAlert, BotSubscriber, PushSubscription, and ConsentRecord. Propagate bot opt-outs.
  - **Prisma:** new `ConsentRecord`, `DataRequest` (nullable FKs to User).
  - **Acceptance:** A user requests account deletion; an admin fulfills it from `/admin/data-requests` and the user's SavedProduct, PriceAlert, BotSubscriber, and ConsentRecord rows are removed, with the `DataRequest` marked completed.

- [ ] **PR 40.4a — Feature flags, experiments & admin console** (medium)
  - Add `FeatureFlag`, `Experiment`, `ExperimentAssignment` models and `src/lib/flags.ts` (`isEnabled(key, {region, visitorId})` with percentage + region rollout). Add `/admin/flags` to toggle flags and start/stop experiments with weighted, per-visitor variant assignment. Wire one real experiment (comparison-default-sort) reading assignment server-side and reporting variant to Phase 17 analytics.
  - **Prisma:** new `FeatureFlag`, `Experiment`, `ExperimentAssignment`.
  - **Acceptance:** An admin enables a flag at 50% rollout for AE; the gated UI shows for ~half of AE visitors, stable per `visitorId`.

- [ ] **PR 40.4b — Core Web Vitals performance pass** (medium)
  - Image/font optimization, RSC streaming/suspense on the comparison page, and a Lighthouse-CI budget in the pipeline.
  - **Prisma:** none.
  - **Acceptance:** The comparison page meets the configured Lighthouse performance budget in CI.

- [ ] **PR 40.4c — WCAG 2.1 AA accessibility pass** (medium)
  - Focus management, ARIA, color contrast, and RTL focus order (Phase 37), with axe checks added to CI.
  - **Prisma:** none.
  - **Acceptance:** Axe reports no AA violations on the comparison and product pages, including the `/ar` RTL layout.

- [ ] **PR 40.4d — CI quality-gate workflow** (medium)
  - Add `.github/workflows/ci.yml` enforcing lint, typecheck, Playwright E2E, axe, and Lighthouse budgets as required status checks.
  - **Prisma:** none.
  - **Acceptance:** A PR that introduces an axe accessibility violation fails the CI workflow.

**Risks:** Sentry source-map upload needs a build-time token and can break the Vercel build if misconfigured. Rate limiting must be scoped to mutating/auth/webhook routes only to avoid latency on the hot comparison path. Cookie-consent must actually defer analytics/push scripts until consent. WCAG AA on RTL is harder (focus order, ARIA in mirrored layouts). PDPL export/delete must cascade across every PII-holding model or it is incomplete.

**Out of scope:** SOC2/ISO27001 certification, a penetration-testing engagement, per-third-party consent UI, multi-region data residency, a bespoke A/B significance engine.

---

## PR Breakdown — Phases 3-20

Phases 3-20 are the mature, already-specified core. Each phase below is broken into the reviewable PRs that compose it, sized so one PR is one coherent unit of review. Intensity is a rough reviewer-load signal (light = single small surface, medium = a feature slice, heavy = a phase-defining chunk). PR counts: **38 PRs across the 18 phases.** Check off PRs as they merge.

### Phase 3 — Admin auth & security (heavy, 3 PRs)
- [ ] **PR 3.1 — User model & auth foundation** — NextAuth resolves a session against the `User` table and a local admin can authenticate.
- [ ] **PR 3.2 — Login page & session UI** — `/admin/login` renders the styled form; valid admin credentials log in and land on `/admin`.
- [ ] **PR 3.3 — Middleware route protection & role enforcement** — `/admin` returns the login page when unauthenticated; a logged-in admin can CRUD; viewers are read-only.

### Phase 4 — Public UX polish & discoverability (medium, 2 PRs)
- [ ] **PR 4.1 — Footer, header link, empty states & loading skeletons** — empty `/products` and `/stores` show friendly states; the comparison page shows a skeleton while loading.
- [ ] **PR 4.2 — Error/404 pages & social share meta** — product share links preview correctly on WhatsApp/Twitter and the 404 page matches the site theme.

### Phase 5 — SEO & structured data (medium, 2 PRs)
- [ ] **PR 5.1 — Sitemap, robots & canonical/meta** — `sitemap.xml` lists every product and store URL; `robots.txt` resolves and references the sitemap; admin paths are disallowed.
- [ ] **PR 5.2 — JSON-LD structured data & category landing pages** — Google Rich Results Test passes for a product page with valid Product/Offer markup; category pages read filtered products.

### Phase 6 — Product images & media (medium, 2 PRs)
- [ ] **PR 6.1 — imageUrl field, storage helper & admin upload** — an admin uploads an image in the product form and the URL is stored on the `Product` row.
- [ ] **PR 6.2 — Render images publicly with next/image & emoji fallback** — public pages show the uploaded image with lazy loading and fall back to emoji when none exists.

### Phase 7 — Categories & browse filters (medium, 2 PRs)
- [ ] **PR 7.1 — Category model & admin management** — an admin creates a category and assigns products; the category persists with a unique slug.
- [ ] **PR 7.2 — Public filter sidebar & product sorting** — filtering to "Graphics Cards" on `/products` shows only that category; sort by price/name/newest works.

### Phase 8 — Store profiles & detail pages (light, 1 PR)
- [ ] **PR 8.1 — Public store detail page** — clicking a store opens `/stores/[slug]` showing all its offers and contact deep links.

### Phase 9 — Price history charts (public) (medium, 2 PRs)
- [ ] **PR 9.1 — Public price chart with drop badge** — the RTX 5080 page shows a historical price line per store with a "price dropped X%" badge when applicable.
- [ ] **PR 9.2 — Admin price history view** — an admin opens a listing and sees its full recorded price history in a table.

### Phase 10 — Bulk admin & data import (heavy, 4 PRs)
- [ ] **PR 10.1 — CSV parsing core & product import** — uploading a product CSV creates the valid products and reports rejected rows.
- [ ] **PR 10.2 — Listing CSV import** — importing one CSV creates listings linked to existing stores by slug, enforcing product-store uniqueness.
- [ ] **PR 10.3 — CSV export & duplicate actions** — an admin exports products/listings to CSV and duplicates a product/listing in one click.
- [ ] **PR 10.4 — Admin global search** — admin search returns matching stores, products, and listings across all three entities.

### Phase 11 — Listing verification & freshness (medium, 2 PRs)
- [ ] **PR 11.1 — verifiedAt/expiresAt schema & admin verify action** — an admin marks a listing verified and `verifiedAt` persists.
- [ ] **PR 11.2 — Public freshness badges & review queue** — listings older than 7 days show an amber "may be outdated" badge; admin sees a needs-review queue.

### Phase 12 — Store verification badges (light, 1 PR)
- [ ] **PR 12.1 — Store verified flag, badge & filter** — verified stores show a checkmark badge site-wide and can be filtered to verified-only.

### Phase 13 — User accounts (public) (heavy, 3 PRs)
- [ ] **PR 13.1 — Public user schema & SavedProduct model** — a `SavedProduct` row links a public user to a product.
- [ ] **PR 13.2 — Public signup/login flow** — a new visitor signs up, logs in, and sees a logged-in state in the public header.
- [ ] **PR 13.3 — Save button & /account page** — a logged-in user saves the RTX 5080 and sees it on `/account`.

### Phase 14 — Price drop alerts (heavy, 3 PRs)
- [ ] **PR 14.1 — PriceAlert model & create-alert action** — a user sets an alert at 4000 AED and a `PriceAlert` row is created.
- [ ] **PR 14.2 — Email sending via Resend** — the alert-send function delivers a price-drop email via Resend for a crossed threshold.
- [ ] **PR 14.3 — Daily cron evaluation & admin stats** — the daily cron runs and a user with a 4000 AED alert receives an email when a listing drops below it.

### Phase 15 — Manual price update workflow (medium, 2 PRs)
- [ ] **PR 15.1 — Quick inline price-edit table** — an admin updates 5 prices in under 2 minutes from the quick-update table without opening edit forms.
- [ ] **PR 15.2 — Audit log of price changes** — each price update writes an audit entry visible in the admin changelog.

### Phase 16 — Website price scraping (heavy, 3 PRs)
- [ ] **PR 16.1 — scrapeConfig schema & scraper core** — the scraper core extracts a price from a configured store URL while honoring `robots.txt`.
- [ ] **PR 16.2 — Scrape log model & writeback** — a scrape attempt writes a `ScrapeLog` row and updates the listing price on success.
- [ ] **PR 16.3 — Scrape cron & admin controls** — one test store auto-updates its price daily via cron and failures are visible in the admin scrape log.

### Phase 17 — Analytics & admin insights (medium, 2 PRs)
- [ ] **PR 17.1 — Analytics integration & event tracking** — product/store views, sort-mode usage, and search terms are recorded.
- [ ] **PR 17.2 — Admin insights dashboard & trending** — an admin sees the top 10 products by page views over the last 7 days, and trending is real-data driven.

### Phase 18 — API layer & embeddable widgets (heavy, 3 PRs)
- [ ] **PR 18.1 — API key model & auth/rate-limit middleware** — requests to `/api/v1` without a valid API key are rejected and rate limits are enforced.
- [ ] **PR 18.2 — Read-only REST v1 endpoints** — an external caller fetches listings JSON for a product slug using a valid API key.
- [ ] **PR 18.3 — Embeddable widget & OpenAPI docs** — a partner embeds the widget on an external site and it renders live comparisons via the API. (If at risk of being fat, the widget can defer to a follow-up so 18.2 + docs deliver the API contract first.)

### Phase 19 — Monetization & store partnerships (medium, 2 PRs)
- [ ] **PR 19.1 — Featured listings, affiliate URL & partnership tiers** — a featured listing appears first in the comparison with a "Sponsored" label.
- [ ] **PR 19.2 — Claim-your-store flow & legal pages** — a store owner submits a claim and a request is recorded for admin review. (Phase 33 later converts this into a real `StoreClaim` model.)

### Phase 20 — Mobile app & scale (heavy, 4 PRs)
- [ ] **PR 20.1 — PWA manifest & service worker** — the site is installable as a PWA and Lighthouse PWA score is above 90.
- [ ] **PR 20.2 — Web push for price alerts** — a subscribed user receives a web push when a saved product's price drops (creates the canonical `PushSubscription` model + `/api/push/subscribe`, reused by Phase 25, not redefined).
- [ ] **PR 20.3 — Redis caching & Expo app shell** — hot product pages are served from Redis cache and the Expo shell loads data from the v1 API.
- [ ] **PR 20.4 — E2E tests & staging environment** — the homepage → product → sort E2E test passes in CI against the staging environment.

---

## Phase & PR index (1-40)

| Phase | Title | PRs | Theme | Depends on |
|-------|-------|-----|-------|------------|
| 1-2 | Comparison UI, sort modes, admin CRUD, price history | — | Foundation (done) | — |
| 3 | Admin auth & security | 3 | Foundation | 1-2 |
| 4 | Public UX polish & discoverability | 2 | Foundation | 3 |
| 5 | SEO & structured data | 2 | Foundation | 4 |
| 6 | Product images & media | 2 | Catalog | 4 |
| 7 | Categories & browse filters | 2 | Catalog | 6 |
| 8 | Store profiles & detail pages | 1 | Catalog | 7 |
| 9 | Price history charts (public) | 2 | Catalog | 5 |
| 10 | Bulk admin & data import | 4 | Ops | 3 |
| 11 | Listing verification & freshness | 2 | Trust | 9 |
| 12 | Store verification badges | 1 | Trust | 11 |
| 13 | User accounts (public) | 3 | Accounts | 3 |
| 14 | Price drop alerts | 3 | Accounts | 13 |
| 15 | Manual price update workflow | 2 | Ops | 10 |
| 16 | Website price scraping | 3 | Ops | 15 |
| 17 | Analytics & admin insights | 2 | Insights | any traffic |
| 18 | API layer & embeddable widgets | 3 | Platform | 17 |
| 19 | Monetization & store partnerships | 2 | Platform | 18 |
| 20 | Mobile app & scale | 4 | Platform | 18 |
| 21 | Product & store reviews and ratings | 3 | Trust & Community | 3, 8, 13 |
| 22 | Product Q&A | 2 | Trust & Community | 3, 8, 13, 21 |
| 23 | Trust & safety: reports, disputes & takedown | 3 | Trust & Community | 3, 8, 11, 12, 13, 21 |
| 24 | Community deals feed | 3 | Trust & Community | 3, 9, 13, 14, 21, 23 |
| 25 | Unified Notification Center | 5 | Notifications & Discovery | 3, 13, 14, 18, 20 |
| 26 | Advanced Search & Discovery | 6 | Notifications & Discovery | 7, 17, 18 |
| 27 | Recommendations & Personalization | 3 | Notifications & Discovery | 7, 13, 17, 25, 26 |
| 28 | Coupons & Promo Codes Engine | 4 | Notifications & Discovery | 7, 12, 13, 24, 25, 27 |
| 29 | Price Intelligence — Forecasting & Deal Scores | 3 | AI & Price Intelligence | 9, 14, 16, 17 |
| 30 | AI Shopping Assistant | 3 | AI & Price Intelligence | 3, 7, 13, 18, 29 |
| 31 | AI Content — Summaries, Q&A & SEO Copy | 3 | AI & Price Intelligence | 5, 11, 18, 29, 30 |
| 32 | Catalog Intelligence — Identifiers & Dedup | 4 | AI & Price Intelligence | 6, 7, 10, 15, 16, 18 |
| 33 | Seller self-serve portal | 3 | Seller & Marketplace | 3, 11, 12, 13, 15, 19 |
| 34 | Seller analytics & leads dashboard | 3 | Seller & Marketplace | 9, 17, 18, 33 |
| 35 | Gaming PC builder & compatibility configurator | 4 | Seller & Marketplace | 5, 7, 8, 9, 13 |
| 36 | Used / trade-in marketplace | 3 | Seller & Marketplace | 8, 11, 12, 13, 14, 33 |
| 37 | Internationalization & Arabic RTL | 3 | Localization & Hardening | 4, 5, 7, 8 |
| 38 | Multi-Country & Multi-Currency | 3 | Localization & Hardening | 7, 8, 12, 37 |
| 39 | Distribution — WhatsApp & Telegram deal bots | 2 | Localization & Hardening | 9, 13, 14, 18, 37, 38 |
| 40 | Production Hardening & Governance | 7 | Localization & Hardening | 3, 13, 14, 17, 18, 37, 38, 39 |

> Browser extension and Expo native app (originally bundled into Phase 39) are tracked as follow-on phases 41-42 — each is a distinct runtime sharing only the Phase 18 API with the rest of the platform.

## Phase dependency map (1–40)

```
1–2 (done) → 3 (auth) → 4 (UX) → 5 (SEO)
                  ↓
            13 (users) → 14 (alerts)
                  ↓
3 → 10 (import) → 15 (quick update) → 16 (scraping)
4 → 6 (images) → 7 (categories) → 8 (store pages)
5 → 9 (charts) → 11 (freshness) → 12 (verification)
17 (analytics) ← any traffic-bearing phase
18 (API) → 19 (monetization) → 20 (scale/mobile/push)

── Trust & Community ──────────────────────────────
13,8,3 → 21 (reviews+moderation) → 22 (Q&A)
                     ↓                  ↓
       11,12 ─────→ 23 (reports/takedown)
                     ↓
        9,14 ─────→ 24 (community deals)   [canonical Deal model + /deals]

── Notifications & Discovery ──────────────────────
14,18,20 → 25 (notification center; reuses 20 PushSubscription)
17,18,7  → 26 (search: postgres FTS default, meilisearch optional)
25,26 ───→ 27 (recommendations)
24,25,27 → 28 (coupons/promos)   [Coupon/Promo, /promotions — extends 24, no Deal collision]

── AI & Price Intelligence ────────────────────────
9,16,17 → 29 (price intelligence / forecasts)
29 ─────→ 30 (AI assistant) → 31 (AI content; ai-qa.ts, no qa.ts collision)
10,16,6 → 32 (identifier dedup + image-sim signal)

── Seller & Marketplace ───────────────────────────
12,13,15,19 → 33 (seller portal; authz primitive in 33.2)
33 ────────→ 34 (seller analytics) and → 36 (used marketplace; UsedReport* enums)
7,9,13 ────→ 35 (PC builder)

── Localization, Channels & Hardening ─────────────
4,5,7,8 → 37 (i18n/RTL; migrates earlier public paths + formatPrice)
37 ────→ 38 (multi-region/currency)
37,38 ─→ 39 (deal bots) ─────────────────────────┐
                                                  ↓
3,13,14,17,18,37,38,39 → 40 (hardening & governance: observability,
                              security, PDPL/GDPR, flags/A-B, CI gates)
                              → 41 (browser extension) → 42 (Expo app)
```

## New environment variables (Phases 21-40)

| Variable | Phase | Purpose |
|----------|-------|---------|
| `REPORT_ALERT_WEBHOOK_URL` | 23 | Slack/Discord ping on new abuse reports |
| `VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY` / `VAPID_SUBJECT` | 25 | Web-push delivery (server) |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | 25 | Web-push subscription (client) |
| `WHATSAPP_PHONE_NUMBER_ID` | 25 | WhatsApp Cloud API sender |
| `WHATSAPP_ACCESS_TOKEN` | 25 | WhatsApp Cloud API auth |
| `WHATSAPP_VERIFY_TOKEN` | 25 | WhatsApp webhook GET verification |
| `SEARCH_BACKEND` | 26 | Select `postgres` (default) or `meilisearch` |
| `MEILISEARCH_HOST` / `MEILISEARCH_API_KEY` / `MEILISEARCH_INDEX_PREFIX` | 26 | Optional Meilisearch backend |
| `RECOMMENDATIONS_ENABLED` | 27 | Dark-launch flag for recommendation rails |
| `ANTHROPIC_API_KEY` | 27, 30, 31 | Claude API (optional in 27; required in 30/31) |
| `ANTHROPIC_MODEL` | 30 | Assistant model id |
| `ASSISTANT_DAILY_MSG_LIMIT` | 30 | Per-user/anon daily message cap |
| `ASSISTANT_RATE_LIMIT_REDIS` | 30 | Optional Upstash limiter for the assistant |
| `ANTHROPIC_CONTENT_MODEL` | 31 | Optional cheaper/longer content model override |
| `EMBEDDING_API_KEY` / `EMBEDDING_MODEL` | 32 | Image/text embedding provider |
| `VISUAL_SEARCH_ENABLED` | 32 | Flag for embedding/image-sim work |
| `SELLER_PORTAL_ENABLED` | 33 | Flag for the seller self-serve portal |
| `ADMIN_NOTIFY_EMAIL` | 33, 36 | Ops notification recipient (claims, used reports) |
| `ANALYTICS_INGEST_SECRET` | 34 | Validates the seller event ingest origin |
| `NEXT_PUBLIC_SITE_URL` | 35 | Absolute URLs for shared build pages |
| `USED_MARKETPLACE_ENABLED` | 36 | Flag for the used/trade-in marketplace |
| `NEXT_PUBLIC_DEFAULT_LOCALE` / `NEXT_PUBLIC_SUPPORTED_LOCALES` | 37 | i18n routing config |
| `OPENEXCHANGERATES_APP_ID` | 38 | FX rate source |
| `NEXT_PUBLIC_DEFAULT_REGION` | 38 | Default region (AE) |
| `FX_REFRESH_CRON_SECRET` | 38 | Secures the FX refresh cron |
| `WHATSAPP_BUSINESS_TOKEN` | 39 | Bot WhatsApp Business send |
| `WHATSAPP_WEBHOOK_VERIFY_TOKEN` | 39 | Bot WhatsApp webhook verification |
| `TELEGRAM_BOT_TOKEN` / `TELEGRAM_WEBHOOK_SECRET` | 39 | Telegram bot + webhook auth |
| `BOT_BROADCAST_CRON_SECRET` | 39 | Secures the deal-broadcast cron |
| `SENTRY_DSN` / `NEXT_PUBLIC_SENTRY_DSN` / `SENTRY_AUTH_TOKEN` | 40 | Error monitoring + source maps |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | 40 | Rate-limit store (also Phase 20 cache) |
| `UPTIME_HEARTBEAT_URL` | 40 | Cron success heartbeats |
| `DATA_REQUEST_NOTIFY_EMAIL` | 40 | DSAR fulfillment notifications |
| `NEXT_PUBLIC_PRIVACY_POLICY_VERSION` | 40 | Consent policy versioning |

> Reused (not new): `RESEND_API_KEY` (25, 33, 36), `CRON_SECRET` (24, 25, 29, 32, 34, 36), `BLOB_READ_WRITE_TOKEN` (32, 36).

## Data model additions (Phases 21-40)

- **Phase 21 — reviews:** `Review`, `ReviewVote`; `ratingAvg`/`ratingCount` columns on `Product` and `Store`; enums `ReviewTargetType`, `ModerationStatus` (shared by 22-24).
- **Phase 22 — Q&A:** `Question`, `Answer`, `AnswerVote` (reuse `ModerationStatus`).
- **Phase 23 — trust & safety:** `Report`, `Dispute`; `hidden`/`suspended` takedown columns on `Listing`/`Store`; enums `ReportTargetType` (canonical, gains `COUPON` in 28), `ReportReason`, `ReportStatus`, `DisputeStatus`.
- **Phase 24 — community deals:** `Deal` (canonical), `DealVote` (reuse `ModerationStatus`).
- **Phase 25 — notifications:** `Notification`, `NotificationPreference`, `NotificationDelivery`, `WhatsAppContact`. Reuses Phase 20 `PushSubscription` (additive columns only, not redefined).
- **Phase 26 — search:** `SearchSynonym`, `ProductSearchDocument`, `SearchQueryLog`; `Product.searchVector Unsupported("tsvector")?` (Prisma-managed + GIN) plus raw-SQL pg_trgm.
- **Phase 27 — recommendations:** `ProductView`, `RecentlyViewed`, `ProductSimilarity`, `TrendingSnapshot`.
- **Phase 28 — coupons/promos:** `Coupon`, `Promo` (renamed from `Deal` to avoid the Phase 24 collision), `CouponRedemptionLog`; `COUPON` added to `ReportTargetType`.
- **Phase 29 — price intelligence:** `PriceForecast`, `ListingMetricsLog`; `Listing.lowestEver`.
- **Phase 30 — AI assistant:** `ChatSession`, `ChatMessage`, `AssistantUsage`.
- **Phase 31 — AI content:** `ProductContent`, `AiAnswer` (renamed from `ProductQA`; db file `ai-qa.ts` to avoid the Phase 22 `qa.ts` collision), `ContentGenerationLog`.
- **Phase 32 — catalog intelligence:** `ProductIdentifier`, `DuplicateCandidate`, `MergeLog`, `ProductEmbedding`; optional `gtin`/`ean`/`mpn` capture on `Product`.
- **Phase 33 — seller portal:** `StoreClaim`, `StoreMembership`; `Listing.ownerEditedAt`/`lastEditedByUserId`; `User.sellerOnboardedAt`; enums `ClaimStatus`, `SellerRole`, `MembershipStatus`.
- **Phase 34 — seller analytics:** `ListingEvent`, `DailyListingStat`, `StoreRankSnapshot`; enum `EventType`.
- **Phase 35 — PC builder:** `ComponentSlot`, `CompatibilityRule`, `Build`, `BuildItem`; `Product.compatibilitySpecs`; enums `RuleOperator`, `RuleSeverity`.
- **Phase 36 — used marketplace:** `UsedListing`, `UsedListingImage`, `SellerTrustProfile`, `UsedListingReport`; enums `UsedCondition`, `Emirate`, `UsedListingStatus`, `UsedReportReason`/`UsedReportStatus` (domain-prefixed to avoid the Phase 23 enum-namespace clash).
- **Phase 37 — i18n:** `Translation`; `Product.nameAr`/`specsAr`; `Store.warrantyDescriptionAr`/`locationAr`.
- **Phase 38 — multi-region:** `Region`, `ExchangeRate`, `StoreRegion`; `Listing.regionId` (+ AE backfill migration).
- **Phase 39 — deal bots:** `BotSubscriber`, `BotBroadcast`.
- **Phase 40 — hardening & governance:** `ConsentRecord`, `DataRequest`, `FeatureFlag`, `Experiment`, `ExperimentAssignment`, `CronRun`.

---

## Research grounding & references (Phases 21–40)

The externally-factual choices in Part II are grounded in the sources below (verified June 2026). Flag anything version-dependent before building — pricing tiers, API versions, and store-review timelines drift.

### Data protection — UAE PDPL (Phase 40)
- The UAE's general data-protection law is **Federal Decree-Law No. 45 of 2021 on Personal Data Protection (PDPL)** — a GDPR-analogue. Consent must be provable, given in a clear/simple/accessible manner, and **withdrawable at any time** (withdrawal does not void prior lawful processing). Data subjects have a **right to erasure** (delete when no longer needed or consent withdrawn), subject to statutory exceptions. This is why Phase 40 ships a cookie-consent gate, versioned `ConsentRecord`, and a DSAR export/delete cascade across every PII-holding model.
- Sources: UAE Government legislation portal — [Federal Decree-Law No. 45 of 2021 (full text)](https://uaelegislation.gov.ae/en/legislations/1972/download); [Securiti — UAE PDPL overview](https://securiti.ai/uae-personal-data-protection-law/).

### WhatsApp / Telegram channels (Phases 25, 39)
- **WhatsApp Business Platform (Cloud API)** bills **per delivered template message** by category: **marketing** (priciest), **utility** + **authentication** (~80–90% cheaper), and **service** messages (free). A user inbound opens a **24-hour customer-service window** for free service replies; business-initiated templates require prior **opt-in** and (for marketing/utility) pre-approved templates. This shapes Phase 25 (utility-template price alerts) and Phase 39 (opt-in deal broadcasts that must use approved templates or silently fail). **Telegram Bot API** is free — used for the public deals channel.
- Source: [Meta — Pricing on the WhatsApp Business Platform](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing).

### Site search (Phase 26)
- **Postgres FTS** (`tsvector` + GIN, `pg_trgm` for fuzzy) is the right default at small/medium catalog scale: zero new infra, transactional, runs on the existing Supabase Postgres. Its limits are no true typo-tolerance and sub-50ms search-as-you-type. **Meilisearch** (or Typesense) is the "step up" — built-in typo tolerance + prefix/typeahead (~12ms p99). Hence Phase 26 ships **Postgres FTS first (default), Meilisearch behind `SEARCH_BACKEND` later**.
- Sources: [Meilisearch vs PostgreSQL FTS](https://www.meilisearch.com/docs/resources/comparisons/postgresql); [Supabase — Postgres full-text search vs the rest](https://supabase.com/blog/postgres-full-text-search-vs-the-rest).

### Multi-currency / GCC + RTL (Phases 37, 38)
- GCC currencies and USD pegs: **AED ≈ 3.6725**, **SAR 3.75**, **QAR 3.64**, **BHD 0.376**, **OMR 0.3845** are hard USD pegs; **KWD** tracks an undisclosed USD-dominant basket (small float). Because most GCC pairs are USD-pegged, cross-rates are near-stable — store money as integer minor units + ISO currency code, refresh a daily FX feed (`OPENEXCHANGERATES_APP_ID`) mainly for non-pegged display. Arabic is **RTL**: `next-intl`, `<html dir="rtl" lang="ar">`, CSS **logical properties**, and `Intl.NumberFormat` for localized AED/SAR formatting.
- Sources: [BIS — common currency area for the Gulf](https://www.bis.org/publ/bppdf/bispap17k.pdf); [S&P — why GCC pegged regimes remain](https://www.spglobal.com/ratings/en/research/articles/200601-credit-faq-why-gcc-pegged-exchange-rate-regimes-will-remain-in-place-11509740).

### Browser extension (follow-on Phase 41)
- **Manifest V3 is mandatory in 2026** (MV2 is dead in Chrome): service workers (not persistent background pages), `declarativeNetRequest`, strict CSP, and **no remotely-hosted code**. Chrome Web Store update review is typically ~24–48h; rejections come from broad permissions, missing privacy policy, or CSP violations. Firefox WebExtensions are largely Chromium-compatible but **require Mozilla signing**; Edge is Chromium-based with the same APIs.
- Sources: [Chrome — What is Manifest V3](https://developer.chrome.com/docs/extensions/develop/migrate/what-is-mv3); [Chrome Web Store — MV3 program policies](https://developer.chrome.com/docs/webstore/program-policies/mv3-requirements).

### Production hardening (Phase 40)
- **Sentry** (`@sentry/nextjs`) for errors + performance/tracing across client/server/edge. **Core Web Vitals** targets: **LCP < 2.5s, INP < 200ms** (INP replaced FID), **CLS < 0.1**; `@vercel/speed-insights` for RUM on Vercel. **WCAG 2.1 AA** (POUR principles, ~70 success criteria: contrast, keyboard nav, focus order, alt text) — note AA on a mirrored RTL layout is harder.
- Sources: [Sentry for Next.js](https://docs.sentry.io/platforms/javascript/guides/nextjs/); [W3C — WCAG 2.1](https://www.w3.org/TR/WCAG21/).

### AI features (Phases 30, 31)
- Default `ANTHROPIC_MODEL=claude-opus-4-8`; **`claude-haiku-4-5`** for cheap/high-throughput paths (bulk descriptions, spec/review summaries); `claude-sonnet-4-6` as the balanced tier. Env: `ANTHROPIC_API_KEY`.
- **Phase 30 (shopping assistant):** ground strictly on the catalog via **tool use** (a `searchCatalog` tool hitting `src/lib/db`), **stream** responses for the chat UI, and **prompt-cache** the stable system + catalog-schema prefix (~0.1× input cost on repeated turns). Recommendation cards are always rendered from DB ids — never model free-text — to prevent hallucinated prices.
- **Phase 31 (AI content):** **structured outputs** (`output_config.format` / `messages.parse`) so summaries validate to a schema, and the **Batch API** (50% cost) for the bulk "generate for all missing" job.
- Source: Anthropic `claude-api` skill reference (model catalog, streaming, tool use, prompt caching, structured outputs, Batch API).

---

## Recommended next 5 phases (priority)

| Order | Phase | Why now |
|-------|-------|---------|
| 1 | **3 — Admin auth** | `/admin` is publicly open |
| 2 | **4 — UX polish** | First impression for real users |
| 3 | **5 — SEO** | Organic traffic is free |
| 4 | **9 — Price charts** | Core value prop vs competitors |
| 5 | **10 — Bulk import** | Scale catalog past seed data |

## Out of scope (still deferred after Phase 40)

> Several items previously parked here are now **planned in Part II**: multi-country/currency → Phase 38, user-generated reviews → Phase 21, AI recommendations → Phase 27/30. What remains genuinely out of scope:

- Real-time chat with sellers / in-app messaging
- Payment processing, checkout, escrow, or marketplace transactions (the site stays a comparison/referral layer)
- First-party logistics/delivery integration
- A full media/UGC platform (image/video review attachments beyond what Phase 21/36 allow)
- Anything requiring a financial-services or marketplace-operator license

## How to start a phase (agent checklist)

1. Read this file; confirm the phase number (and, for split phases, which **PR**) with the user.
2. `git checkout main && git pull && git checkout -b cursor/<phase-slug>-8afd` (one branch per PR for heavy phases).
3. Implement that PR's deliverables only — no scope creep into later PRs/phases. Honour the architecture principles (Server Actions for admin mutations, `src/lib/db/` per entity, Prisma migration for any schema change, no prod seed).
4. Run `npm run lint` and `npm run build` (with env vars).
5. Update this file: check off the phase/PR boxes; add “Completed: YYYY-MM-DD” under the phase heading when the last PR merges.
6. Open a PR with the phase (and PR) number in the title: `Phase 21 (PR 21.1): Review & ReviewVote data model`.

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
