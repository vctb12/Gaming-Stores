import { updateListingAction } from "@/app/admin/listings/actions";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ListingForm } from "@/components/admin/ListingForm";
import { getListingById, getListingFormOptions } from "@/lib/db/listings";
import Link from "next/link";
import { notFound } from "next/navigation";

interface EditListingPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditListingPage({ params }: EditListingPageProps) {
  const { id } = await params;
  const [listing, options] = await Promise.all([
    getListingById(id),
    getListingFormOptions(),
  ]);
  if (!listing) notFound();

  const boundAction = updateListingAction.bind(
    null,
    id,
    listing.product.slug,
  );

  return (
    <>
      <AdminHeader
        title="Edit listing"
        description={`${listing.product.name} at ${listing.store.name}`}
      />

      <div className="flex-1 p-8">
        <Link
          href="/admin/listings"
          className="mb-6 inline-block text-sm text-slate-400 hover:text-violet-300"
        >
          ← Back to listings
        </Link>

        <ListingForm
          action={boundAction}
          listing={listing}
          options={options}
          submitLabel="Save changes"
        />
      </div>
    </>
  );
}
