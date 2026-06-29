import { AdminHeader } from "@/components/admin/AdminHeader";
import { StoreTable } from "@/components/admin/StoreTable";
import { getAllStoresAdmin } from "@/lib/db/stores";
import Link from "next/link";

export default async function AdminStoresPage() {
  const stores = await getAllStoresAdmin();

  return (
    <>
      <AdminHeader
        title="Stores"
        description="Manage retailers and social sellers"
      />

      <div className="flex-1 p-8">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-slate-400">
            {stores.length} store{stores.length === 1 ? "" : "s"} tracked
          </p>
          <Link
            href="/admin/stores/new"
            className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-500"
          >
            + Add store
          </Link>
        </div>

        <StoreTable stores={stores} />
      </div>
    </>
  );
}
