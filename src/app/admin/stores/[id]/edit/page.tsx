import { updateStoreAction } from "@/app/admin/stores/actions";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { StoreForm } from "@/components/admin/StoreForm";
import { getStoreById } from "@/lib/db/stores";
import Link from "next/link";
import { notFound } from "next/navigation";

interface EditStorePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditStorePage({ params }: EditStorePageProps) {
  const { id } = await params;
  const store = await getStoreById(id);
  if (!store) notFound();

  const boundAction = updateStoreAction.bind(null, id);

  return (
    <>
      <AdminHeader
        title={`Edit ${store.name}`}
        description="Update store details and price sources"
      />

      <div className="flex-1 p-8">
        <Link
          href="/admin/stores"
          className="mb-6 inline-block text-sm text-slate-400 hover:text-violet-300"
        >
          ← Back to stores
        </Link>

        <StoreForm
          action={boundAction}
          store={store}
          submitLabel="Save changes"
        />
      </div>
    </>
  );
}
