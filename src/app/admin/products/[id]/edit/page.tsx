import { updateProductAction } from "@/app/admin/products/actions";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ProductForm } from "@/components/admin/ProductForm";
import { getProductById, getProductCategories } from "@/lib/db/products";
import Link from "next/link";
import { notFound } from "next/navigation";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    getProductById(id),
    getProductCategories(),
  ]);
  if (!product) notFound();

  const boundAction = updateProductAction.bind(null, id);

  return (
    <>
      <AdminHeader
        title={`Edit ${product.name}`}
        description="Update product details and specifications"
      />

      <div className="flex-1 p-8">
        <Link
          href="/admin/products"
          className="mb-6 inline-block text-sm text-slate-400 hover:text-violet-300"
        >
          ← Back to products
        </Link>

        <ProductForm
          action={boundAction}
          product={product}
          categories={categories}
          submitLabel="Save changes"
        />
      </div>
    </>
  );
}
