"use server";

import {
  createStore,
  deleteStore,
  updateStore,
  type StoreInput,
} from "@/lib/db/stores";
import type { StoreSource } from "@/lib/types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type StoreFormState = {
  error?: string;
};

function parseStoreForm(formData: FormData): StoreInput {
  const sources = formData
    .getAll("sources")
    .map(String) as StoreSource[];

  return {
    name: String(formData.get("name") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    website: String(formData.get("website") ?? ""),
    sources,
    rating: Number(formData.get("rating") ?? 0),
    reviewCount: Number(formData.get("reviewCount") ?? 0),
    warrantyMonths: Number(formData.get("warrantyMonths") ?? 0),
    warrantyDescription: String(formData.get("warrantyDescription") ?? ""),
    location: String(formData.get("location") ?? ""),
    logoInitials: String(formData.get("logoInitials") ?? ""),
  };
}

function revalidateStorePaths() {
  revalidatePath("/admin/stores");
  revalidatePath("/stores");
  revalidatePath("/");
}

export async function createStoreAction(
  _prev: StoreFormState,
  formData: FormData,
): Promise<StoreFormState> {
  try {
    await createStore(parseStoreForm(formData));
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to create store",
    };
  }

  revalidateStorePaths();
  redirect("/admin/stores");
}

export async function updateStoreAction(
  id: string,
  _prev: StoreFormState,
  formData: FormData,
): Promise<StoreFormState> {
  try {
    await updateStore(id, parseStoreForm(formData));
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to update store",
    };
  }

  revalidateStorePaths();
  redirect("/admin/stores");
}

export async function deleteStoreAction(id: string): Promise<StoreFormState> {
  try {
    await deleteStore(id);
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to delete store",
    };
  }

  revalidateStorePaths();
  return {};
}
