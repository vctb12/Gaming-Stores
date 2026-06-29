import { AdminHeader } from "@/components/admin/AdminHeader";
import { ProductTable } from "@/components/admin/ProductTable";
import { getAllProductsAdmin } from "@/lib/db/products";
import Link from "next/link";

export default async function AdminProductsPage() {
  const products = await getAllProductsAdmin();

  return (
    <>
      <AdminHeader
        title="Products"
        description="Manage the product catalog"
      />

      <div className="flex-1 p-8">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-slate-400">
            {products.length} product{products.length === 1 ? "" : "s"} in
            catalog
          </p>
          <Link
            href="/admin/products/new"
            className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-500"
          >
            + Add product
          </Link>
        </div>

        <ProductTable products={products} />
      </div>
    </>
  );
}
