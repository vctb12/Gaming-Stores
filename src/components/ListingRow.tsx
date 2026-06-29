import type { ComparisonHighlight, ListingWithStore } from "@/lib/types";

const sourceLabels: Record<string, string> = {
  website: "Website",
  instagram: "Instagram",
  facebook: "Facebook",
  whatsapp: "WhatsApp",
  tiktok: "TikTok",
};

interface ListingRowProps {
  listing: ListingWithStore;
  highlights: ComparisonHighlight;
  rank: number;
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-amber-400/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-300">
      {children}
    </span>
  );
}

export function ListingRow({ listing, highlights, rank }: ListingRowProps) {
  const badges: string[] = [];
  if (listing.id === highlights.cheapestId) badges.push("Cheapest");
  if (listing.id === highlights.bestWarrantyId) badges.push("Best warranty");
  if (listing.id === highlights.bestReviewsId) badges.push("Top rated");
  if (listing.id === highlights.fastestShippingId) badges.push("Fastest");

  return (
    <div
      className={`grid gap-4 rounded-2xl border p-4 sm:grid-cols-[auto_1fr_auto] sm:items-center ${
        listing.inStock
          ? "border-white/10 bg-white/[0.03]"
          : "border-white/5 bg-white/[0.02] opacity-60"
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-sm font-bold text-slate-300">
          #{rank}
        </span>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 text-sm font-bold text-white">
          {listing.store.logoInitials}
        </div>
      </div>

      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-semibold text-white">{listing.store.name}</h3>
          {badges.map((badge) => (
            <Badge key={badge}>{badge}</Badge>
          ))}
          {!listing.inStock && (
            <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase text-red-300">
              Out of stock
            </span>
          )}
        </div>

        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-400">
          <span>★ {listing.store.rating} ({listing.store.reviewCount} reviews)</span>
          <span>{listing.warrantyMonths}mo warranty</span>
          <span>via {sourceLabels[listing.source]}</span>
          <span>
            {listing.shippingDays === 0
              ? "Pickup available"
              : `${listing.shippingDays} day delivery`}
          </span>
          {listing.store.location && <span>{listing.store.location}</span>}
        </div>
      </div>

      <div className="text-left sm:text-right">
        <p className="text-2xl font-bold text-white">
          {listing.price.toLocaleString()} AED
        </p>
        {listing.shippingCost > 0 && (
          <p className="text-xs text-slate-500">
            +{listing.shippingCost} AED shipping
          </p>
        )}
        {listing.url && listing.inStock && (
          <a
            href={listing.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-sm font-medium text-cyan-400 hover:text-cyan-300"
          >
            View offer →
          </a>
        )}
      </div>
    </div>
  );
}
