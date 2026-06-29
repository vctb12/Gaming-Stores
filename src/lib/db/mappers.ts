import type { Listing, Product, Store, StoreSource } from "@/lib/types";
import type { Listing as PrismaListing, Product as PrismaProduct, Store as PrismaStore } from "@prisma/client";

function parseSources(value: unknown): StoreSource[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is StoreSource => typeof item === "string");
}

function parseSpecs(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value).filter(
      (entry): entry is [string, string] => typeof entry[1] === "string",
    ),
  );
}

export function mapStore(store: PrismaStore): Store {
  return {
    id: store.id,
    name: store.name,
    slug: store.slug,
    website: store.website ?? undefined,
    sources: parseSources(store.sources),
    rating: store.rating,
    reviewCount: store.reviewCount,
    warrantyMonths: store.warrantyMonths,
    warrantyDescription: store.warrantyDescription,
    location: store.location ?? undefined,
    logoInitials: store.logoInitials,
  };
}

export function mapProduct(product: PrismaProduct): Product {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    brand: product.brand,
    category: product.category,
    imageEmoji: product.imageEmoji ?? "📦",
    specs: parseSpecs(product.specs),
  };
}

export function mapListing(listing: PrismaListing): Listing {
  return {
    id: listing.id,
    productId: listing.productId,
    storeId: listing.storeId,
    price: listing.price,
    currency: listing.currency as "AED",
    inStock: listing.inStock,
    url: listing.url ?? undefined,
    source: listing.source as StoreSource,
    warrantyMonths: listing.warrantyMonths,
    lastUpdated: listing.lastUpdated.toISOString().slice(0, 10),
    shippingCost: listing.shippingCost,
    shippingDays: listing.shippingDays,
  };
}
