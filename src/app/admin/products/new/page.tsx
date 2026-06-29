import { createProductAction } from "@/app/admin/products/actions";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ProductForm } from "@/components/admin/ProductForm";
import { getProductCategories } from "@/lib/db/products";
import Link from "next/link";

export default async function NewProductPage() {
  const categories = await getProductCategories();

  return (
    <>
      <AdminHeader
        title="Add product"
        description="Add a new product to the comparison catalog"
      />

      <div className="flex-1 p-8">
        <Link
          href="/admin/products"
          className="mb-6 inline-block text-sm text-slate-400 hover:text-violet-300"
        >
          ← Back to products
        </Link>

        <ProductForm
          action={createProductAction}
          categories={categories}
          submitLabel="Create product"
        />
      </div>
    </>
  );
}
