import { createListingAction } from "@/app/admin/listings/actions";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ListingForm } from "@/components/admin/ListingForm";
import { getListingFormOptions } from "@/lib/db/listings";
import Link from "next/link";

export default async function NewListingPage() {
  const options = await getListingFormOptions();

  return (
    <>
      <AdminHeader
        title="Add listing"
        description="Add a store offer for a product"
      />

      <div className="flex-1 p-8">
        <Link
          href="/admin/listings"
          className="mb-6 inline-block text-sm text-slate-400 hover:text-violet-300"
        >
          ← Back to listings
        </Link>

        {options.products.length === 0 || options.stores.length === 0 ? (
          <div className="max-w-lg rounded-2xl border border-dashed border-white/10 p-8">
            <p className="text-white font-medium">Add products and stores first</p>
            <p className="mt-2 text-sm text-slate-400">
              Listings link a product to a store. Create at least one product and
              one store before adding listings.
            </p>
            <div className="mt-4 flex gap-3">
              <Link
                href="/admin/products/new"
                className="rounded-lg bg-violet-600 px-4 py-2 text-sm text-white hover:bg-violet-500"
              >
                Add product
              </Link>
              <Link
                href="/admin/stores/new"
                className="rounded-lg bg-white/5 px-4 py-2 text-sm text-slate-300 hover:bg-white/10"
              >
                Add store
              </Link>
            </div>
          </div>
        ) : (
          <ListingForm
            action={createListingAction}
            options={options}
            submitLabel="Create listing"
          />
        )}
      </div>
    </>
  );
}
