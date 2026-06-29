import { AdminHeader } from "@/components/admin/AdminHeader";
import { ListingTable } from "@/components/admin/ListingTable";
import { getAllListingsAdmin } from "@/lib/db/listings";
import Link from "next/link";

export default async function AdminListingsPage() {
  const listings = await getAllListingsAdmin();

  return (
    <>
      <AdminHeader
        title="Listings"
        description="Manage store prices and offers"
      />

      <div className="flex-1 p-8">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-slate-400">
            {listings.length} listing{listings.length === 1 ? "" : "s"} tracked
          </p>
          <Link
            href="/admin/listings/new"
            className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-500"
          >
            + Add listing
          </Link>
        </div>

        <ListingTable listings={listings} />
      </div>
    </>
  );
}
