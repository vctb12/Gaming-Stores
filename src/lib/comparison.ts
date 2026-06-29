import { listings, products, stores } from "./data";
import type {
  ComparisonHighlight,
  ListingWithStore,
  ProductWithListings,
  SortOption,
} from "./types";

const storeMap = new Map(stores.map((store) => [store.id, store]));

function attachStore(listing: (typeof listings)[number]): ListingWithStore {
  const store = storeMap.get(listing.storeId);
  if (!store) {
    throw new Error(`Store not found for listing ${listing.id}`);
  }
  return { ...listing, store };
}

export function getTotalPrice(listing: ListingWithStore): number {
  return listing.price + listing.shippingCost;
}

export function formatPrice(amount: number, currency = "AED"): string {
  return new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getAllProducts(): ProductWithListings[] {
  return products.map((product) => ({
    ...product,
    listings: listings
      .filter((listing) => listing.productId === product.id)
      .map(attachStore),
  }));
}

export function getProductBySlug(slug: string): ProductWithListings | undefined {
  const product = products.find((item) => item.slug === slug);
  if (!product) return undefined;

  return {
    ...product,
    listings: listings
      .filter((listing) => listing.productId === product.id)
      .map(attachStore),
  };
}

export function getStoreBySlug(slug: string) {
  return stores.find((store) => store.slug === slug);
}

export function getComparisonHighlights(
  productListings: ListingWithStore[],
): ComparisonHighlight {
  const inStock = productListings.filter((listing) => listing.inStock);
  if (inStock.length === 0) {
    return {
      cheapestId: null,
      bestWarrantyId: null,
      bestReviewsId: null,
      fastestShippingId: null,
    };
  }

  const cheapest = [...inStock].sort(
    (a, b) => getTotalPrice(a) - getTotalPrice(b),
  )[0];
  const bestWarranty = [...inStock].sort(
    (a, b) => b.warrantyMonths - a.warrantyMonths,
  )[0];
  const bestReviews = [...inStock].sort((a, b) => {
    if (b.store.rating !== a.store.rating) {
      return b.store.rating - a.store.rating;
    }
    return b.store.reviewCount - a.store.reviewCount;
  })[0];
  const fastestShipping = [...inStock].sort(
    (a, b) => a.shippingDays - b.shippingDays,
  )[0];

  return {
    cheapestId: cheapest.id,
    bestWarrantyId: bestWarranty.id,
    bestReviewsId: bestReviews.id,
    fastestShippingId: fastestShipping.id,
  };
}

export function sortListings(
  productListings: ListingWithStore[],
  sort: SortOption,
): ListingWithStore[] {
  const sorted = [...productListings];

  switch (sort) {
    case "cheapest":
      return sorted.sort((a, b) => getTotalPrice(a) - getTotalPrice(b));
    case "warranty":
      return sorted.sort((a, b) => b.warrantyMonths - a.warrantyMonths);
    case "reviews":
      return sorted.sort((a, b) => {
        if (b.store.rating !== a.store.rating) {
          return b.store.rating - a.store.rating;
        }
        return b.store.reviewCount - a.store.reviewCount;
      });
    case "fastest":
      return sorted.sort((a, b) => a.shippingDays - b.shippingDays);
    default:
      return sorted;
  }
}

export function getLowestPrice(product: ProductWithListings): number | null {
  const inStock = product.listings.filter((listing) => listing.inStock);
  if (inStock.length === 0) return null;
  return Math.min(...inStock.map(getTotalPrice));
}

export function searchProducts(query: string): ProductWithListings[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return getAllProducts();

  return getAllProducts().filter((product) => {
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
