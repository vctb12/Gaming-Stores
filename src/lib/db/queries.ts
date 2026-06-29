import { mapListing, mapProduct, mapStore } from "@/lib/db/mappers";
import { prisma } from "@/lib/prisma";
import type { ListingWithStore, ProductWithListings, Store } from "@/lib/types";

const productWithListingsInclude = {
  listings: {
    include: {
      store: true,
    },
  },
} as const;

function toProductWithListings(
  product: Awaited<
    ReturnType<typeof prisma.product.findMany<{ include: typeof productWithListingsInclude }>>
  >[number],
): ProductWithListings {
  return {
    ...mapProduct(product),
    listings: product.listings.map((listing) => ({
      ...mapListing(listing),
      store: mapStore(listing.store),
    })),
  };
}

export async function getAllProducts(): Promise<ProductWithListings[]> {
  const products = await prisma.product.findMany({
    include: productWithListingsInclude,
    orderBy: { name: "asc" },
  });

  return products.map(toProductWithListings);
}

export async function getProductBySlug(
  slug: string,
): Promise<ProductWithListings | null> {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: productWithListingsInclude,
  });

  if (!product) return null;
  return toProductWithListings(product);
}

export async function searchProducts(query: string): Promise<ProductWithListings[]> {
  const products = await getAllProducts();
  const normalized = query.trim().toLowerCase();
  if (!normalized) return products;

  return products.filter((product) => {
    const haystack = [
      product.name,
      product.brand,
      product.category,
      ...Object.values(product.specs),
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(normalized);
  });
}

export async function getStoresWithListingCounts(): Promise<
  { store: Store; count: number }[]
> {
  const stores = await prisma.store.findMany({
    include: {
      _count: {
        select: { listings: true },
      },
    },
    orderBy: { name: "asc" },
  });

  return stores.map((store) => ({
    store: mapStore(store),
    count: store._count.listings,
  }));
}

export async function getStoreBySlug(slug: string): Promise<Store | null> {
  const store = await prisma.store.findUnique({ where: { slug } });
  if (!store) return null;
  return mapStore(store);
}
