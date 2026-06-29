"use client";

import { deleteProductAction } from "@/app/admin/products/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface DeleteProductButtonProps {
  productId: string;
  productName: string;
  listingCount: number;
}

export function DeleteProductButton({
  productId,
  productName,
  listingCount,
}: DeleteProductButtonProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const disabled = listingCount > 0;

  async function handleDelete() {
    if (disabled) return;

    const confirmed = window.confirm(
      `Delete ${productName}? This cannot be undone.`,
    );
    if (!confirmed) return;

    setPending(true);
    setError(null);

    const result = await deleteProductAction(productId);
    if (result.error) {
      setError(result.error);
      setPending(false);
      return;
    }

    router.refresh();
    setPending(false);
  }

  return (
    <div className="flex flex-col items-end">
      <button
        type="button"
        onClick={handleDelete}
        disabled={disabled || pending}
        title={
          disabled
            ? "Remove all listings before deleting this product"
            : "Delete product"
        }
        className="rounded-lg px-3 py-1.5 text-xs font-medium text-red-400 transition hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {pending ? "..." : "Delete"}
      </button>
      {error && <span className="mt-1 text-[10px] text-red-400">{error}</span>}
    </div>
  );
}
