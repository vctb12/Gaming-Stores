import { AdminHeader } from "@/components/admin/AdminHeader";
import { getAdminStats } from "@/lib/db/queries";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();

  const statCards = [
    { label: "Stores", value: stats.storeCount, href: "/admin/stores" },
    { label: "Products", value: stats.productCount, href: "/admin/products" },
    { label: "Listings", value: stats.listingCount, href: "/admin/listings" },
    {
      label: "In stock",
      value: stats.inStockCount,
      href: "/admin/listings",
    },
    {
      label: "Price records",
      value: stats.priceHistoryCount,
      href: "/admin/listings",
    },
  ];

  return (
    <>
      <AdminHeader
        title="Dashboard"
        description="Overview of your marketplace data"
      />

      <div className="flex-1 p-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {statCards.map((card) => (
            <Link
              key={card.label}
              href={card.href}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-violet-400/30 hover:bg-white/[0.05]"
            >
              <p className="text-sm text-slate-400">{card.label}</p>
              <p className="mt-2 text-3xl font-bold text-white">{card.value}</p>
            </Link>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-dashed border-white/10 p-8">
          <h2 className="text-lg font-semibold text-white">Getting started</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Use the sidebar to manage stores, products, and listings. Store
            management, product catalog, and listing editors will be added in
            upcoming PRs — one feature at a time.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/admin/stores"
              className="rounded-lg bg-violet-500/15 px-4 py-2 text-sm font-medium text-violet-200 transition hover:bg-violet-500/25"
            >
              Manage stores →
            </Link>
            <Link
              href="/admin/products"
              className="rounded-lg bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10"
            >
              Manage products →
            </Link>
            <Link
              href="/admin/listings"
              className="rounded-lg bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10"
            >
              Manage listings →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
