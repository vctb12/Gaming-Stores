import Link from "next/link";
import { formatPrice, getLowestPrice } from "@/lib/comparison";
import type { ProductWithListings } from "@/lib/types";

interface ProductCardProps {
  product: ProductWithListings;
}

export function ProductCard({ product }: ProductCardProps) {
  const lowestPrice = getLowestPrice(product);
  const storeCount = product.listings.filter((l) => l.inStock).length;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-cyan-400/30 hover:bg-white/[0.07]"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-800 text-2xl">
          {product.imageEmoji}
        </div>
        <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-300">
          {storeCount} stores
        </span>
      </div>

      <h3 className="mt-4 text-lg font-semibold text-white group-hover:text-cyan-200">
        {product.name}
      </h3>
      <p className="mt-1 text-sm text-slate-400">{product.category}</p>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-500">
            From
          </p>
          <p className="text-2xl font-bold text-white">
            {lowestPrice ? formatPrice(lowestPrice) : "Out of stock"}
          </p>
        </div>
        <span className="text-sm font-medium text-cyan-400">Compare →</span>
      </div>
    </Link>
  );
}
