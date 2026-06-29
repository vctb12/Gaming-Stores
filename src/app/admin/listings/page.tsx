import { AdminHeader } from "@/components/admin/AdminHeader";

export default function AdminListingsPlaceholderPage() {
  return (
    <>
      <AdminHeader
        title="Listings"
        description="Manage store prices and offers"
      />
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="max-w-md rounded-2xl border border-dashed border-white/10 p-8 text-center">
          <p className="text-4xl">💰</p>
          <h2 className="mt-4 text-lg font-semibold text-white">
            Listing management
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Add, edit prices, and track offers. Coming in a future PR.
          </p>
        </div>
      </div>
    </>
  );
}
