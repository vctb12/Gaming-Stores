import type { PriceChange } from "@/lib/types";

export function computePriceChange(
  currentPrice: number,
  history: { price: number }[],
): PriceChange | undefined {
  if (history.length < 2) return undefined;

  const previousPrice = history[1].price;
  const delta = currentPrice - previousPrice;

  if (delta === 0) return undefined;

  return {
    previousPrice,
    delta,
    percentChange: (delta / previousPrice) * 100,
  };
}

export function formatPriceChange(change: PriceChange): string {
  const direction = change.delta < 0 ? "↓" : "↑";
  const amount = Math.abs(change.delta).toLocaleString();
  return `${direction} ${amount} AED`;
}
