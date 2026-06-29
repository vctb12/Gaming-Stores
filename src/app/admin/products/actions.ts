"use server";

import {
  createProduct,
  deleteProduct,
  updateProduct,
  type ProductInput,
} from "@/lib/db/products";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type ProductFormState = {
  error?: string;
};

function parseSpecs(formData: FormData): Record<string, string> {
  const raw = String(formData.get("specs") ?? "").trim();
  if (!raw) return {};

  const specs: Record<string, string> = {};
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const colonIndex = trimmed.indexOf(":");
    if (colonIndex === -1) continue;

    const key = trimmed.slice(0, colonIndex).trim();
    const value = trimmed.slice(colonIndex + 1).trim();
    if (key) specs[key] = value;
  }

  return specs;
}

function parseProductForm(formData: FormData): ProductInput {
  return {
    name: String(formData.get("name") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    brand: String(formData.get("brand") ?? ""),
    category: String(formData.get("category") ?? ""),
    imageEmoji: String(formData.get("imageEmoji") ?? ""),
    specs: parseSpecs(formData),
  };
}

function revalidateProductPaths() {
  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/");
}

export async function createProductAction(
  _prev: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  try {
    await createProduct(parseProductForm(formData));
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to create product",
    };
  }

  revalidateProductPaths();
  redirect("/admin/products");
}

export async function updateProductAction(
  id: string,
  _prev: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  try {
    await updateProduct(id, parseProductForm(formData));
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to update product",
    };
  }

  revalidateProductPaths();
  redirect("/admin/products");
}

export async function deleteProductAction(
  id: string,
): Promise<ProductFormState> {
  try {
    await deleteProduct(id);
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to delete product",
    };
  }

  revalidateProductPaths();
  return {};
}
