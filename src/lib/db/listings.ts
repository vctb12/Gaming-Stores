import { mapListing, mapProduct, mapStore } from "@/lib/db/mappers";
import { recordPriceHistory } from "@/lib/db/price-history";
import { prisma } from "@/lib/prisma";
import type { Listing, Product, Store, StoreSource } from "@/lib/types";

export interface ListingInput {
  productId: string;
  storeId: string;
  price: number;
  currency?: string;
  inStock: boolean;
  url?: string;
  source: StoreSource;
  warrantyMonths: number;
  shippingCost: number;
  shippingDays: number;
  lastUpdated?: string;
}

export interface ListingAdminRow extends Listing {
  product: Product;
  store: Store;
}

function normalizeListingInput(input: ListingInput) {
  const lastUpdated = input.lastUpdated
    ? new Date(input.lastUpdated)
    : new Date();

  if (Number.isNaN(lastUpdated.getTime())) {
    throw new Error("Invalid last updated date");
  }

  return {
    productId: input.productId,
    storeId: input.storeId,
    price: input.price,
    currency: input.currency?.trim() || "AED",
    inStock: input.inStock,
    url: input.url?.trim() || null,
    source: input.source,
    warrantyMonths: input.warrantyMonths,
    shippingCost: input.shippingCost,
    shippingDays: input.shippingDays,
    lastUpdated,
  };
}

async function assertUniqueProductStore(
  productId: string,
  storeId: string,
  excludeId?: string,
) {
  const existing = await prisma.listing.findFirst({
    where: {
      productId,
      storeId,
      ...(excludeId ? { NOT: { id: excludeId } } : {}),
    },
  });

  if (existing) {
    throw new Error("This store already has a listing for this product");
  }
}

export async function getAllListingsAdmin(): Promise<ListingAdminRow[]> {
  const listings = await prisma.listing.findMany({
    include: {
      product: true,
      store: true,
    },
    orderBy: [{ product: { name: "asc" } }, { price: "asc" }],
  });

  return listings.map((listing) => ({
    ...mapListing(listing),
    product: mapProduct(listing.product),
    store: mapStore(listing.store),
  }));
}

export async function getListingById(id: string): Promise<ListingAdminRow | null> {
  const listing = await prisma.listing.findUnique({
    where: { id },
    include: {
      product: true,
      store: true,
    },
  });

  if (!listing) return null;

  return {
    ...mapListing(listing),
    product: mapProduct(listing.product),
    store: mapStore(listing.store),
  };
}

export async function createListing(input: ListingInput): Promise<Listing> {
  const data = normalizeListingInput(input);
  await assertUniqueProductStore(data.productId, data.storeId);

  const listing = await prisma.listing.create({ data });
  await recordPriceHistory(listing.id, listing.price, listing.lastUpdated);

  return mapListing(listing);
}

export async function updateListing(
  id: string,
  input: ListingInput,
): Promise<Listing> {
  const data = normalizeListingInput(input);
  await assertUniqueProductStore(data.productId, data.storeId, id);

  const existing = await prisma.listing.findUnique({ where: { id } });
  if (!existing) {
    throw new Error("Listing not found");
  }

  const listing = await prisma.listing.update({
    where: { id },
    data,
  });

  if (listing.price !== existing.price) {
    await recordPriceHistory(listing.id, listing.price, listing.lastUpdated);
  }

  return mapListing(listing);
}

export async function deleteListing(id: string): Promise<void> {
  await prisma.listing.delete({ where: { id } });
}

export async function getListingFormOptions() {
  const [products, stores] = await Promise.all([
    prisma.product.findMany({
      select: { id: true, name: true, slug: true, imageEmoji: true },
      orderBy: { name: "asc" },
    }),
    prisma.store.findMany({
      select: { id: true, name: true, slug: true, logoInitials: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return { products, stores };
}
