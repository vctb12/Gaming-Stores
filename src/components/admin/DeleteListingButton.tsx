"use client";

import { deleteListingAction } from "@/app/admin/listings/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface DeleteListingButtonProps {
  listingId: string;
  label: string;
}

export function DeleteListingButton({
  listingId,
  label,
}: DeleteListingButtonProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(`Delete listing for ${label}?`);
    if (!confirmed) return;

    setPending(true);
    setError(null);

    const result = await deleteListingAction(listingId);
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
        disabled={pending}
        className="rounded-lg px-3 py-1.5 text-xs font-medium text-red-400 transition hover:bg-red-500/15 disabled:opacity-50"
      >
        {pending ? "..." : "Delete"}
      </button>
      {error && <span className="mt-1 text-[10px] text-red-400">{error}</span>}
    </div>
  );
}
