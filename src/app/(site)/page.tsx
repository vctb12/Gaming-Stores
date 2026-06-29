import { ProductCard } from "@/components/ProductCard";
import { SearchBar } from "@/components/SearchBar";
import { getAllProducts } from "@/lib/db/queries";
import Link from "next/link";

export default async function HomePage() {
  const products = await getAllProducts();

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.12),_transparent_45%)]" />

      <section className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
            UAE gaming marketplace
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Compare store prices like you compare flights
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-400">
            We aggregate prices from websites, Instagram shops, WhatsApp
            sellers, and more — then rank them by price, warranty, reviews, and
            delivery speed.
          </p>
        </div>

        <div className="mt-10">
          <SearchBar />
        </div>

        <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-400">
          <span className="rounded-full border border-white/10 px-3 py-1">
            Cheapest price
          </span>
          <span className="rounded-full border border-white/10 px-3 py-1">
            Best warranty
          </span>
          <span className="rounded-full border border-white/10 px-3 py-1">
            Top reviews
          </span>
          <span className="rounded-full border border-white/10 px-3 py-1">
            Fastest delivery
          </span>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Trending comparisons</h2>
            <p className="mt-2 text-slate-400">
              See all offers for a product in one place — like Skyscanner for
              gaming gear.
            </p>
          </div>
          <Link
            href="/products"
            className="hidden text-sm font-medium text-cyan-400 hover:text-cyan-300 sm:block"
          >
            View all →
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="border-t border-white/10 bg-white/[0.02]">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:grid-cols-3 sm:px-6">
          <div>
            <p className="text-3xl font-bold text-cyan-400">1</p>
            <h3 className="mt-2 font-semibold text-white">List stores & sellers</h3>
            <p className="mt-2 text-sm text-slate-400">
              Websites, social media shops, and local retailers across the UAE.
            </p>
          </div>
          <div>
            <p className="text-3xl font-bold text-cyan-400">2</p>
            <h3 className="mt-2 font-semibold text-white">Track product prices</h3>
            <p className="mt-2 text-sm text-slate-400">
              Collect visible prices from storefronts, posts, and catalog pages.
            </p>
          </div>
          <div>
            <p className="text-3xl font-bold text-cyan-400">3</p>
            <h3 className="mt-2 font-semibold text-white">Compare & decide</h3>
            <p className="mt-2 text-sm text-slate-400">
              Sort by cheapest, best warranty, reviews, or fastest shipping.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
