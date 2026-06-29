"use server";

import {
  createListing,
  deleteListing,
  updateListing,
  type ListingInput,
} from "@/lib/db/listings";
import type { StoreSource } from "@/lib/types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type ListingFormState = {
  error?: string;
};

function parseListingForm(formData: FormData): ListingInput {
  return {
    productId: String(formData.get("productId") ?? ""),
    storeId: String(formData.get("storeId") ?? ""),
    price: Number(formData.get("price") ?? 0),
    currency: String(formData.get("currency") ?? "AED"),
    inStock: formData.get("inStock") === "on",
    url: String(formData.get("url") ?? ""),
    source: String(formData.get("source") ?? "website") as StoreSource,
    warrantyMonths: Number(formData.get("warrantyMonths") ?? 0),
    shippingCost: Number(formData.get("shippingCost") ?? 0),
    shippingDays: Number(formData.get("shippingDays") ?? 1),
    lastUpdated: String(formData.get("lastUpdated") ?? ""),
  };
}

function revalidateListingPaths(productSlug?: string) {
  revalidatePath("/admin/listings");
  revalidatePath("/products");
  revalidatePath("/stores");
  revalidatePath("/");
  if (productSlug) {
    revalidatePath(`/products/${productSlug}`);
  }
}

export async function createListingAction(
  _prev: ListingFormState,
  formData: FormData,
): Promise<ListingFormState> {
  try {
    await createListing(parseListingForm(formData));
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to create listing",
    };
  }

  revalidateListingPaths();
  redirect("/admin/listings");
}

export async function updateListingAction(
  id: string,
  productSlug: string,
  _prev: ListingFormState,
  formData: FormData,
): Promise<ListingFormState> {
  try {
    await updateListing(id, parseListingForm(formData));
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to update listing",
    };
  }

  revalidateListingPaths(productSlug);
  redirect("/admin/listings");
}

export async function deleteListingAction(id: string): Promise<ListingFormState> {
  try {
    await deleteListing(id);
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to delete listing",
    };
  }

  revalidateListingPaths();
  return {};
}
