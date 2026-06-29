import { daysAgo, recordPriceHistory } from "../src/lib/db/price-history";
import { listings, products, stores } from "../src/lib/data";
import { prisma } from "../src/lib/prisma";

const listingPriceHistory: Record<
  string,
  { price: number; daysAgo: number }[]
> = {
  "list-1": [
    { price: 4499, daysAgo: 14 },
    { price: 4399, daysAgo: 7 },
    { price: 4299, daysAgo: 0 },
  ],
  "list-2": [
    { price: 4250, daysAgo: 10 },
    { price: 4200, daysAgo: 5 },
    { price: 4150, daysAgo: 0 },
  ],
  "list-3": [
    { price: 4199, daysAgo: 12 },
    { price: 4099, daysAgo: 6 },
    { price: 3999, daysAgo: 0 },
  ],
  "list-4": [
    { price: 4599, daysAgo: 21 },
    { price: 4549, daysAgo: 10 },
    { price: 4499, daysAgo: 0 },
  ],
  "list-5": [
    { price: 3999, daysAgo: 8 },
    { price: 3949, daysAgo: 3 },
    { price: 3899, daysAgo: 0 },
  ],
  "list-6": [
    { price: 3299, daysAgo: 14 },
    { price: 3199, daysAgo: 0 },
  ],
  "list-7": [
    { price: 3449, daysAgo: 9 },
    { price: 3349, daysAgo: 0 },
  ],
  "list-8": [
    { price: 2899, daysAgo: 11 },
    { price: 2799, daysAgo: 0 },
  ],
  "list-9": [
    { price: 2799, daysAgo: 15 },
    { price: 2699, daysAgo: 0 },
  ],
};

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

    const history = listingPriceHistory[listing.id] ?? [
      { price: listing.price, daysAgo: 0 },
    ];

    for (const entry of history) {
      await recordPriceHistory(listing.id, entry.price, daysAgo(entry.daysAgo));
    }
  }

  const historyCount = await prisma.priceHistory.count();
  console.log(
    `Seeded ${stores.length} stores, ${products.length} products, ${listings.length} listings, ${historyCount} price history records`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
