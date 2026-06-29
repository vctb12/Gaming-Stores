# Gaming Stores UAE

A **product price comparison marketplace** for gaming gear in the UAE — think Skyscanner or Wego, but for products like RTX 5080 graphics cards, consoles, and PC components.

Instead of comparing flights, users compare **store offers** side by side: cheapest price, best warranty, top reviews, and fastest delivery.

## Live site

**App (Vercel):** https://gaming-stores.vercel.app

| Page | URL |
|------|-----|
| Homepage | https://gaming-stores.vercel.app |
| Admin | https://gaming-stores.vercel.app/admin |

Do **not** use GitHub Pages for the app — it only shows this README:

https://vctb12.github.io/Gaming-Stores/

### Disable GitHub Pages (one-time, 30 seconds)

1. Open https://github.com/vctb12/Gaming-Stores/settings/pages
2. Under **Build and deployment → Source**, choose **None**
3. Click **Save**

This stops the confusing README site from appearing at `github.io`.

## What it does

1. **Lists stores & sellers** — websites, Instagram shops, WhatsApp sellers, Facebook pages, TikTok stores
2. **Tracks product prices** — aggregates publicly visible prices from each source
3. **Compares offers** — ranks listings so users can pick the best deal for their priorities

## Example flow

Search for **NVIDIA GeForce RTX 5080** → see 5 store offers → sort by:

| Sort mode | What it finds |
|-----------|---------------|
| Cheapest | Lowest total price (product + shipping) |
| Best warranty | Longest warranty period on the listing |
| Top reviews | Highest-rated store (rating, then review count) |
| Fastest delivery | Shortest estimated shipping time |

Each listing shows badges like **Cheapest**, **Best warranty**, **Top rated**, and **Fastest** — similar to how flight comparison sites highlight best options.

## Tech stack

- **Next.js 16** (App Router) — SEO-friendly product pages
- **TypeScript** — type-safe data models
- **Tailwind CSS** — UI styling
- **Prisma** + **PostgreSQL** (Supabase on Vercel) — production data

## Getting started

```bash
npm install
cp .env.example .env.local   # add POSTGRES_URL values
npm run dev                  # migrates, seeds, starts dev server
```

Open [http://localhost:3000](http://localhost:3000).

To re-seed sample data locally: `npm run db:seed`

### Key routes

| Route | Description |
|-------|-------------|
| `/` | Homepage with search and trending products |
| `/products` | Browse and search all products |
| `/products/nvidia-geforce-rtx-5080` | Full comparison view for a product |
| `/stores` | Directory of tracked stores and sellers |
| `/admin` | Admin dashboard |
| `/admin/stores` | Manage stores |
| `/admin/products` | Manage products |
| `/admin/listings` | Manage prices and offers |

## Project structure

```
src/
├── app/                    # Next.js pages
│   ├── page.tsx            # Homepage
│   ├── products/           # Product listing & comparison
│   └── stores/             # Store directory
├── components/             # UI components
└── lib/
    ├── types.ts            # Data model types
    ├── data.ts             # Seed data (MVP)
    └── comparison.ts       # Sorting & highlight logic
prisma/
└── schema.prisma           # Database schema (for next phase)
```

## Roadmap

Full **20-phase plan** for Claude Code and future development: **[ROADMAP.md](./ROADMAP.md)**

| Status | Phases |
|--------|--------|
| Done | 1–2: MVP, admin CRUD, Postgres, price history |
| Next | 3: Admin auth → 4: UX polish → 5: SEO |
| Future | 6–20: Images, categories, alerts, scraping, API, mobile |

See [ROADMAP.md](./ROADMAP.md) for deliverables, acceptance criteria, and agent checklist per phase.

## Data model

```
Store ──┐
        ├── Listing (price, warranty, source, shipping)
Product ┘
```

Each **Listing** connects one **Product** to one **Store**, with price, warranty, stock status, source channel (website/Instagram/etc.), and shipping details.

## License

MIT — see [LICENSE](LICENSE).
