# Gaming Stores UAE

A **product price comparison marketplace** for gaming gear in the UAE — think Skyscanner or Wego, but for products like RTX 5080 graphics cards, consoles, and PC components.

Instead of comparing flights, users compare **store offers** side by side: cheapest price, best warranty, top reviews, and fastest delivery.

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
- **Prisma** (schema ready) — PostgreSQL for production data

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Key routes

| Route | Description |
|-------|-------------|
| `/` | Homepage with search and trending products |
| `/products` | Browse and search all products |
| `/products/nvidia-geforce-rtx-5080` | Full comparison view for a product |
| `/stores` | Directory of tracked stores and sellers |

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

### Phase 1 — MVP (current)
- [x] Product comparison UI
- [x] Multi-store listing with sort modes
- [x] Store directory
- [x] Seed data with RTX 5080 example

### Phase 2 — Data pipeline
- [ ] PostgreSQL + Prisma integration
- [ ] Admin panel to add stores and products
- [ ] Price history tracking
- [ ] Manual price entry for social media sellers

### Phase 3 — Automation
- [ ] Website price scraping (with store permission)
- [ ] Social media price monitoring
- [ ] Price drop alerts
- [ ] User accounts and saved comparisons

### Phase 4 — Growth
- [ ] Categories beyond gaming (electronics, etc.)
- [ ] Store verification badges
- [ ] Affiliate / referral links
- [ ] Mobile app

## Data model

```
Store ──┐
        ├── Listing (price, warranty, source, shipping)
Product ┘
```

Each **Listing** connects one **Product** to one **Store**, with price, warranty, stock status, source channel (website/Instagram/etc.), and shipping details.

## License

MIT — see [LICENSE](LICENSE).
