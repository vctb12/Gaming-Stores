import { PrismaClient } from "@prisma/client";
import { listings, products, stores } from "../src/lib/data";

const prisma = new PrismaClient();

async function main() {
  await prisma.priceHistory.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.product.deleteMany();
  await prisma.store.deleteMany();

  const storeIdBySeedId = new Map<string, string>();
  for (const store of stores) {
    const created = await prisma.store.create({
      data: {
        id: store.id,
        name: store.name,
        slug: store.slug,
        website: store.website,
        sources: store.sources,
        rating: store.rating,
        reviewCount: store.reviewCount,
        warrantyMonths: store.warrantyMonths,
        warrantyDescription: store.warrantyDescription,
        location: store.location,
        logoInitials: store.logoInitials,
      },
    });
    storeIdBySeedId.set(store.id, created.id);
  }

  const productIdBySeedId = new Map<string, string>();
  for (const product of products) {
    const created = await prisma.product.create({
      data: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        brand: product.brand,
        category: product.category,
        imageEmoji: product.imageEmoji,
        specs: product.specs,
      },
    });
    productIdBySeedId.set(product.id, created.id);
  }

  for (const listing of listings) {
    await prisma.listing.create({
      data: {
        id: listing.id,
        productId: productIdBySeedId.get(listing.productId)!,
        storeId: storeIdBySeedId.get(listing.storeId)!,
        price: listing.price,
        currency: listing.currency,
        inStock: listing.inStock,
        url: listing.url,
        source: listing.source,
        warrantyMonths: listing.warrantyMonths,
        shippingCost: listing.shippingCost,
        shippingDays: listing.shippingDays,
        lastUpdated: new Date(listing.lastUpdated),
      },
    });
  }

  console.log(`Seeded ${stores.length} stores, ${products.length} products, ${listings.length} listings`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
