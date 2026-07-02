<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Project context

**Gaming Stores UAE** — price comparison marketplace for gaming gear in the UAE (Skyscanner for products).

Before starting any feature work, read **[ROADMAP.md](./ROADMAP.md)** for the 20-phase plan, architecture rules, and current progress.

### Quick reference

- **Live:** https://gaming-stores.vercel.app
- **Admin:** `/admin` (stores, products, listings CRUD)
- **Stack:** Next.js 16, Prisma, PostgreSQL (Supabase), Vercel
- **Pattern:** Server Actions in `src/app/admin/*/actions.ts`, DB layer in `src/lib/db/`
- **One PR per roadmap phase** — branch: `cursor/<phase-slug>-8afd`

## Cursor Cloud specific instructions

- **Database:** The repo ships no local DB. A local PostgreSQL 16 is baked into the VM snapshot but is **not auto-started** on boot — run `sudo pg_ctlcluster 16 main start` first. The seeded `gaming_stores` database persists in the snapshot (5 stores / 3 products / 9 listings).
- **Env:** A `.env` (gitignored) must define `POSTGRES_URL` and `POSTGRES_URL_NON_POOLING`. For local Postgres both point to `postgres://postgres:postgres@localhost:5432/gaming_stores`. Without it, every route throws `POSTGRES_URL environment variable is not set` (thrown at import time in `src/lib/prisma.ts` via `src/lib/db/connection.ts`).
- **Run:** `npm run dev` runs `prisma migrate deploy && prisma db seed` before `next dev`, so Postgres must be reachable at startup. Standard scripts live in `package.json` (`dev`, `build`, `lint`, `db:seed`).
- **Known caveat (admin UI):** The admin store/product/listing **forms crash in the browser** with `POSTGRES_URL ... not set`. Client form components import helpers from `src/lib/db/*`, which transitively imports `src/lib/prisma.ts` (evaluates the DB URL at module load) into the client bundle. This is a pre-existing app bug, not an env problem — SSR/`curl` of admin routes returns 200. Verify admin mutations via the DB/server-action layer, not the browser form, until fixed.
- **Never** run `pkill -f node` / `pkill -9 node` in this VM — it kills the execution daemon and bricks the session.
