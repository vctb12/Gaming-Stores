export type StoreSource =
  | "website"
  | "instagram"
  | "facebook"
  | "whatsapp"
  | "tiktok";

export type SortOption = "cheapest" | "warranty" | "reviews" | "fastest";

export interface Store {
  id: string;
  name: string;
  slug: string;
  website?: string;
  sources: StoreSource[];
  rating: number;
  reviewCount: number;
  warrantyMonths: number;
  warrantyDescription: string;
  location?: string;
  logoInitials: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category: string;
  imageEmoji: string;
  specs: Record<string, string>;
}

export interface Listing {
  id: string;
  productId: string;
  storeId: string;
  price: number;
  currency: "AED";
  inStock: boolean;
  url?: string;
  source: StoreSource;
  warrantyMonths: number;
  lastUpdated: string;
  shippingCost: number;
  shippingDays: number;
}

export interface ListingWithStore extends Listing {
  store: Store;
  priceChange?: PriceChange;
}

export interface PriceChange {
  previousPrice: number;
  delta: number;
  percentChange: number;
}

export interface ProductWithListings extends Product {
  listings: ListingWithStore[];
}

export interface ComparisonHighlight {
  cheapestId: string | null;
  bestWarrantyId: string | null;
  bestReviewsId: string | null;
  fastestShippingId: string | null;
}
