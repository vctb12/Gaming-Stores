import type {
  ComparisonHighlight,
  ListingWithStore,
  ProductWithListings,
  SortOption,
} from "./types";

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
