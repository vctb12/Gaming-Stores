import { mapStore } from "@/lib/db/mappers";
import { prisma } from "@/lib/prisma";
import { initialsFromName, slugify } from "@/lib/slug";
import type { Store, StoreSource } from "@/lib/types";

export interface StoreWithListingCount extends Store {
  listingCount: number;
}

export interface StoreInput {
  name: string;
  slug?: string;
  website?: string;
  sources: StoreSource[];
  rating: number;
  reviewCount: number;
  warrantyMonths: number;
  warrantyDescription: string;
  location?: string;
  logoInitials?: string;
}

function normalizeStoreInput(input: StoreInput) {
  const name = input.name.trim();
  const slug = slugify(input.slug?.trim() || name);
  const logoInitials =
    input.logoInitials?.trim().toUpperCase() || initialsFromName(name);

  return {
    name,
    slug,
    website: input.website?.trim() || null,
    sources: input.sources,
    rating: input.rating,
    reviewCount: input.reviewCount,
    warrantyMonths: input.warrantyMonths,
    warrantyDescription: input.warrantyDescription.trim(),
    location: input.location?.trim() || null,
    logoInitials,
  };
}

export async function getAllStoresAdmin(): Promise<StoreWithListingCount[]> {
  const stores = await prisma.store.findMany({
    include: {
      _count: { select: { listings: true } },
    },
    orderBy: { name: "asc" },
  });

  return stores.map((store) => ({
    ...mapStore(store),
    listingCount: store._count.listings,
  }));
}

export async function getStoreById(id: string): Promise<Store | null> {
  const store = await prisma.store.findUnique({ where: { id } });
  if (!store) return null;
  return mapStore(store);
}

export async function createStore(input: StoreInput): Promise<Store> {
  const data = normalizeStoreInput(input);

  const existing = await prisma.store.findUnique({ where: { slug: data.slug } });
  if (existing) {
    throw new Error("A store with this slug already exists");
  }

  const store = await prisma.store.create({ data });
  return mapStore(store);
}

export async function updateStore(
  id: string,
  input: StoreInput,
): Promise<Store> {
  const data = normalizeStoreInput(input);

  const existing = await prisma.store.findFirst({
    where: { slug: data.slug, NOT: { id } },
  });
  if (existing) {
    throw new Error("A store with this slug already exists");
  }

  const store = await prisma.store.update({
    where: { id },
    data,
  });
  return mapStore(store);
}

export async function deleteStore(id: string): Promise<void> {
  const listingCount = await prisma.listing.count({ where: { storeId: id } });
  if (listingCount > 0) {
    throw new Error(
      `Cannot delete store with ${listingCount} active listing(s). Remove listings first.`,
    );
  }

  await prisma.store.delete({ where: { id } });
}

export const ALL_STORE_SOURCES: StoreSource[] = [
  "website",
  "instagram",
  "facebook",
  "whatsapp",
  "tiktok",
];
