import { mapProduct } from "@/lib/db/mappers";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import type { Product } from "@/lib/types";

export interface ProductWithListingCount extends Product {
  listingCount: number;
}

export interface ProductInput {
  name: string;
  slug?: string;
  brand: string;
  category: string;
  imageEmoji?: string;
  specs: Record<string, string>;
}

function normalizeProductInput(input: ProductInput) {
  const name = input.name.trim();
  const slug = slugify(input.slug?.trim() || name);
  const brand = input.brand.trim();
  const category = input.category.trim();
  const imageEmoji = input.imageEmoji?.trim() || null;

  return {
    name,
    slug,
    brand,
    category,
    imageEmoji,
    specs: input.specs,
  };
}

export async function getAllProductsAdmin(): Promise<ProductWithListingCount[]> {
  const products = await prisma.product.findMany({
    include: {
      _count: { select: { listings: true } },
    },
    orderBy: { name: "asc" },
  });

  return products.map((product) => ({
    ...mapProduct(product),
    listingCount: product._count.listings,
  }));
}

export async function getProductById(id: string): Promise<Product | null> {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return null;
  return mapProduct(product);
}

export async function getProductCategories(): Promise<string[]> {
  const products = await prisma.product.findMany({
    select: { category: true },
    distinct: ["category"],
    orderBy: { category: "asc" },
  });

  return products.map((p) => p.category);
}

export async function createProduct(input: ProductInput): Promise<Product> {
  const data = normalizeProductInput(input);

  const existing = await prisma.product.findUnique({
    where: { slug: data.slug },
  });
  if (existing) {
    throw new Error("A product with this slug already exists");
  }

  const product = await prisma.product.create({ data });
  return mapProduct(product);
}

export async function updateProduct(
  id: string,
  input: ProductInput,
): Promise<Product> {
  const data = normalizeProductInput(input);

  const existing = await prisma.product.findFirst({
    where: { slug: data.slug, NOT: { id } },
  });
  if (existing) {
    throw new Error("A product with this slug already exists");
  }

  const product = await prisma.product.update({
    where: { id },
    data,
  });
  return mapProduct(product);
}

export async function deleteProduct(id: string): Promise<void> {
  const listingCount = await prisma.listing.count({ where: { productId: id } });
  if (listingCount > 0) {
    throw new Error(
      `Cannot delete product with ${listingCount} active listing(s). Remove listings first.`,
    );
  }

  await prisma.product.delete({ where: { id } });
}

export const DEFAULT_CATEGORIES = [
  "Graphics Cards",
  "Consoles",
  "Processors",
  "Monitors",
  "Peripherals",
];
