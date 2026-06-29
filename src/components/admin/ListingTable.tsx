import { DeleteListingButton } from "@/components/admin/DeleteListingButton";
import { formatPrice } from "@/lib/comparison";
import type { ListingAdminRow } from "@/lib/db/listings";
import Link from "next/link";

interface ListingTableProps {
  listings: ListingAdminRow[];
}

const sourceLabels: Record<string, string> = {
  website: "Website",
  instagram: "Instagram",
  facebook: "Facebook",
  whatsapp: "WhatsApp",
  tiktok: "TikTok",
};

export function ListingTable({ listings }: ListingTableProps) {
  if (listings.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center">
        <p className="text-4xl">💰</p>
        <p className="mt-4 text-slate-400">
          No listings yet. Add a store offer for a product to start comparing
          prices.
        </p>
        <Link
          href="/admin/listings/new"
          className="mt-4 inline-block rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500"
        >
          Add listing
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-white/10 bg-white/[0.03] text-xs uppercase tracking-wider text-slate-500">
          <tr>
            <th className="px-4 py-3">Product</th>
            <th className="px-4 py-3">Store</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">Source</th>
            <th className="px-4 py-3">Stock</th>
            <th className="px-4 py-3">Updated</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {listings.map((listing) => (
            <tr key={listing.id} className="hover:bg-white/[0.02]">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{listing.product.imageEmoji}</span>
                  <div>
                    <p className="font-medium text-white">
                      {listing.product.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {listing.product.slug}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded bg-slate-800 text-[10px] font-bold">
                    {listing.store.logoInitials}
                  </span>
                  <span className="text-slate-300">{listing.store.name}</span>
                </div>
              </td>
              <td className="px-4 py-3">
                <p className="font-medium text-white">
                  {formatPrice(listing.price)}
                </p>
                {listing.shippingCost > 0 && (
                  <p className="text-xs text-slate-500">
                    +{formatPrice(listing.shippingCost)} shipping
                  </p>
                )}
              </td>
              <td className="px-4 py-3">
                <span className="rounded bg-cyan-500/10 px-2 py-0.5 text-xs text-cyan-300">
                  {sourceLabels[listing.source] ?? listing.source}
                </span>
              </td>
              <td className="px-4 py-3">
                <span
                  className={`rounded px-2 py-0.5 text-xs ${
                    listing.inStock
                      ? "bg-emerald-500/10 text-emerald-300"
                      : "bg-red-500/10 text-red-300"
                  }`}
                >
                  {listing.inStock ? "In stock" : "Out of stock"}
                </span>
              </td>
              <td className="px-4 py-3 text-slate-400">{listing.lastUpdated}</td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`/admin/listings/${listing.id}/edit`}
                    className="rounded-lg px-3 py-1.5 text-xs font-medium text-violet-300 transition hover:bg-violet-500/15"
                  >
                    Edit
                  </Link>
                  <DeleteListingButton
                    listingId={listing.id}
                    label={`${listing.product.name} @ ${listing.store.name}`}
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
