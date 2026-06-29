import { ListingRow } from "@/components/ListingRow";
import {
  formatPrice,
  getComparisonHighlights,
  getLowestPrice,
  getProductBySlug,
  sortListings,
} from "@/lib/comparison";
import type { SortOption } from "@/lib/types";
import Link from "next/link";
import { notFound } from "next/navigation";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: string }>;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "cheapest", label: "Cheapest" },
  { value: "warranty", label: "Best warranty" },
  { value: "reviews", label: "Top reviews" },
  { value: "fastest", label: "Fastest delivery" },
];

function isSortOption(value: string | undefined): value is SortOption {
  return sortOptions.some((option) => option.value === value);
}

export default async function ProductPage({
  params,
  searchParams,
}: ProductPageProps) {
  const { slug } = await params;
  const { sort: sortParam } = await searchParams;
  const sort: SortOption = isSortOption(sortParam) ? sortParam : "cheapest";

  const product = getProductBySlug(slug);
  if (!product) notFound();

  const highlights = getComparisonHighlights(product.listings);
  const sortedListings = sortListings(product.listings, sort);
  const lowestPrice = getLowestPrice(product);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Link
        href="/products"
        className="text-sm text-slate-400 transition hover:text-cyan-400"
      >
        ← Back to products
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="flex items-start gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-800 text-4xl">
              {product.imageEmoji}
            </div>
            <div>
              <p className="text-sm font-medium text-cyan-400">
                {product.category}
              </p>
              <h1 className="mt-1 text-3xl font-bold text-white sm:text-4xl">
                {product.name}
              </h1>
              <p className="mt-2 text-slate-400">
                {product.listings.filter((l) => l.inStock).length} stores
                compared · Updated daily
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {sortOptions.map((option) => (
              <Link
                key={option.value}
                href={`/products/${slug}?sort=${option.value}`}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  sort === option.value
                    ? "bg-cyan-500 text-white"
                    : "bg-white/5 text-slate-300 hover:bg-white/10"
                }`}
              >
                {option.label}
              </Link>
            ))}
          </div>

          <div className="mt-6 space-y-3">
            {sortedListings.map((listing, index) => (
              <ListingRow
                key={listing.id}
                listing={listing}
                highlights={highlights}
                rank={index + 1}
              />
            ))}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-5">
            <p className="text-sm text-cyan-200">Lowest in-stock price</p>
            <p className="mt-2 text-4xl font-bold text-white">
              {lowestPrice ? formatPrice(lowestPrice) : "N/A"}
            </p>
            <p className="mt-2 text-sm text-slate-400">
              Includes shipping where applicable
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="font-semibold text-white">Specifications</h2>
            <dl className="mt-4 space-y-3">
              {Object.entries(product.specs).map(([key, value]) => (
                <div key={key} className="flex justify-between gap-4 text-sm">
                  <dt className="text-slate-400">{key}</dt>
                  <dd className="text-right font-medium text-white">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="font-semibold text-white">How we compare</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-400">
              <li>Cheapest = product price + shipping</li>
              <li>Best warranty = longest warranty on the listing</li>
              <li>Top reviews = highest store rating, then review count</li>
              <li>Fastest = shortest estimated delivery time</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
