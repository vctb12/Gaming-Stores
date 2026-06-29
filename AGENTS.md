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
