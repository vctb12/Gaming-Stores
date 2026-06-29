import { DeleteProductButton } from "@/components/admin/DeleteProductButton";
import type { ProductWithListingCount } from "@/lib/db/products";
import Link from "next/link";

interface ProductTableProps {
  products: ProductWithListingCount[];
}

export function ProductTable({ products }: ProductTableProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center">
        <p className="text-4xl">📦</p>
        <p className="mt-4 text-slate-400">
          No products yet. Add your first product to start building the catalog.
        </p>
        <Link
          href="/admin/products/new"
          className="mt-4 inline-block rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500"
        >
          Add product
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-white/10 bg-white/[0.03] text-xs uppercase tracking-wider text-slate-500">
          <tr>
            <th className="px-4 py-3">Product</th>
            <th className="px-4 py-3">Brand</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Specs</th>
            <th className="px-4 py-3">Listings</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-white/[0.02]">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-lg">
                    {product.imageEmoji}
                  </span>
                  <div>
                    <p className="font-medium text-white">{product.name}</p>
                    <p className="text-xs text-slate-500">{product.slug}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-slate-300">{product.brand}</td>
              <td className="px-4 py-3">
                <span className="rounded bg-violet-500/10 px-2 py-0.5 text-xs text-violet-300">
                  {product.category}
                </span>
              </td>
              <td className="px-4 py-3 text-slate-400">
                {Object.keys(product.specs).length} spec
                {Object.keys(product.specs).length === 1 ? "" : "s"}
              </td>
              <td className="px-4 py-3 text-slate-300">
                {product.listingCount}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className="rounded-lg px-3 py-1.5 text-xs font-medium text-violet-300 transition hover:bg-violet-500/15"
                  >
                    Edit
                  </Link>
                  <DeleteProductButton
                    productId={product.id}
                    productName={product.name}
                    listingCount={product.listingCount}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
