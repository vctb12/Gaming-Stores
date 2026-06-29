import { StoreCard } from "@/components/StoreCard";
import { listings, stores } from "@/lib/data";

export default function StoresPage() {
  const storeListingCounts = stores.map((store) => ({
    store,
    count: listings.filter((listing) => listing.storeId === store.id).length,
  }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold text-white">Stores & sellers</h1>
        <p className="mt-2 text-slate-400">
          UAE gaming retailers and social sellers with publicly visible product
          prices. We track offers from websites, Instagram, WhatsApp, Facebook,
          and TikTok.
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {storeListingCounts.map(({ store, count }) => (
          <StoreCard key={store.id} store={store} listingCount={count} />
        ))}
      </div>
    </div>
  );
}
