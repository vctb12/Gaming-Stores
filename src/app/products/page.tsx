import { ProductCard } from "@/components/ProductCard";
import { SearchBar } from "@/components/SearchBar";
import { searchProducts } from "@/lib/comparison";

interface ProductsPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { q = "" } = await searchParams;
  const products = searchProducts(q);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold text-white">Compare products</h1>
        <p className="mt-2 text-slate-400">
          Search gaming gear and compare prices across UAE stores and social
          sellers.
        </p>
      </div>

      <div className="mt-8">
        <SearchBar defaultValue={q} />
      </div>

      {q && (
        <p className="mt-6 text-sm text-slate-400">
          {products.length} result{products.length === 1 ? "" : "s"} for &ldquo;
          {q}&rdquo;
        </p>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {products.length === 0 && (
        <div className="mt-12 rounded-2xl border border-dashed border-white/10 p-10 text-center">
          <p className="text-lg font-medium text-white">No products found</p>
          <p className="mt-2 text-slate-400">
            Try searching for a brand, category, or product name.
          </p>
        </div>
      )}
    </div>
  );
}
