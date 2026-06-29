import { AdminHeader } from "@/components/admin/AdminHeader";

export default function AdminProductsPlaceholderPage() {
  return (
    <>
      <AdminHeader
        title="Products"
        description="Manage the product catalog"
      />
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="max-w-md rounded-2xl border border-dashed border-white/10 p-8 text-center">
          <p className="text-4xl">📦</p>
          <h2 className="mt-4 text-lg font-semibold text-white">
            Product management
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Add, edit, and remove products. Coming in a future PR.
          </p>
        </div>
      </div>
    </>
  );
}
