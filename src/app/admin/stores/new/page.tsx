import { createStoreAction } from "@/app/admin/stores/actions";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { StoreForm } from "@/components/admin/StoreForm";
import Link from "next/link";

export default function NewStorePage() {
  return (
    <>
      <AdminHeader
        title="Add store"
        description="Register a new retailer or social seller"
      />

      <div className="flex-1 p-8">
        <Link
          href="/admin/stores"
          className="mb-6 inline-block text-sm text-slate-400 hover:text-violet-300"
        >
          ← Back to stores
        </Link>

        <StoreForm action={createStoreAction} submitLabel="Create store" />
      </div>
    </>
  );
}
