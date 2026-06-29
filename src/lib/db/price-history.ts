import { prisma } from "@/lib/prisma";

export async function recordPriceHistory(
  listingId: string,
  price: number,
  recordedAt = new Date(),
) {
  const latest = await prisma.priceHistory.findFirst({
    where: { listingId },
    orderBy: { recordedAt: "desc" },
  });

  if (latest?.price === price) {
    return latest;
  }

  return prisma.priceHistory.create({
    data: {
      listingId,
      price,
      recordedAt,
    },
  });
}

export function daysAgo(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}
