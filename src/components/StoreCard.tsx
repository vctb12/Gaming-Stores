import type { Store, StoreSource } from "@/lib/types";

const sourceLabels: Record<StoreSource, string> = {
  website: "Website",
  instagram: "Instagram",
  facebook: "Facebook",
  whatsapp: "WhatsApp",
  tiktok: "TikTok",
};

interface StoreCardProps {
  store: Store;
  listingCount: number;
}

export function StoreCard({ store, listingCount }: StoreCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 text-lg font-bold text-white">
          {store.logoInitials}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white">{store.name}</h3>
          <p className="text-sm text-slate-400">{store.location}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-amber-300">
            ★ {store.rating}
          </p>
          <p className="text-xs text-slate-500">{store.reviewCount} reviews</p>
        </div>
      </div>

      <p className="mt-4 text-sm text-slate-300">{store.warrantyDescription}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {store.sources.map((source) => (
          <span
            key={source}
            className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs text-cyan-300"
          >
            {sourceLabels[source]}
          </span>
        ))}
      </div>

      <p className="mt-4 text-xs text-slate-500">
        {listingCount} products listed · Default warranty {store.warrantyMonths}{" "}
        months
      </p>
    </div>
  );
}
