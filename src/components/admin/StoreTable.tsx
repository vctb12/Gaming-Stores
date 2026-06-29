import type { StoreWithListingCount } from "@/lib/db/stores";
import { DeleteStoreButton } from "@/components/admin/DeleteStoreButton";
import Link from "next/link";

const sourceLabels: Record<string, string> = {
  website: "Web",
  instagram: "IG",
  facebook: "FB",
  whatsapp: "WA",
  tiktok: "TT",
};

interface StoreTableProps {
  stores: StoreWithListingCount[];
}

export function StoreTable({ stores }: StoreTableProps) {
  if (stores.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center">
        <p className="text-lg font-medium text-white">No stores yet</p>
        <p className="mt-2 text-sm text-slate-400">
          Add your first store to start tracking prices.
        </p>
        <Link
          href="/admin/stores/new"
          className="mt-4 inline-block rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500"
        >
          Add store
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-white/10 bg-white/[0.03] text-xs uppercase tracking-wider text-slate-500">
          <tr>
            <th className="px-4 py-3">Store</th>
            <th className="px-4 py-3">Location</th>
            <th className="px-4 py-3">Sources</th>
            <th className="px-4 py-3">Rating</th>
            <th className="px-4 py-3">Listings</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {stores.map((store) => (
            <tr key={store.id} className="hover:bg-white/[0.02]">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-xs font-bold">
                    {store.logoInitials}
                  </span>
                  <div>
                    <p className="font-medium text-white">{store.name}</p>
                    <p className="text-xs text-slate-500">{store.slug}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-slate-400">
                {store.location ?? "—"}
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1">
                  {store.sources.map((source) => (
                    <span
                      key={source}
                      className="rounded bg-cyan-500/10 px-1.5 py-0.5 text-[10px] text-cyan-300"
                    >
                      {sourceLabels[source] ?? source}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-4 py-3 text-slate-300">
                ★ {store.rating}{" "}
                <span className="text-slate-500">({store.reviewCount})</span>
              </td>
              <td className="px-4 py-3 text-slate-300">{store.listingCount}</td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`/admin/stores/${store.id}/edit`}
                    className="rounded-lg px-3 py-1.5 text-xs font-medium text-violet-300 transition hover:bg-violet-500/15"
                  >
                    Edit
                  </Link>
                  <DeleteStoreButton
                    storeId={store.id}
                    storeName={store.name}
                    listingCount={store.listingCount}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
