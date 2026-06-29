"use client";

import type { ProductFormState } from "@/app/admin/products/actions";
import { DEFAULT_CATEGORIES } from "@/lib/db/products";
import { slugify } from "@/lib/slug";
import type { Product } from "@/lib/types";
import { useActionState, useState } from "react";

function specsToText(specs: Record<string, string>): string {
  return Object.entries(specs)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");
}

interface ProductFormProps {
  action: (
    prev: ProductFormState,
    formData: FormData,
  ) => Promise<ProductFormState>;
  product?: Product;
  categories?: string[];
  submitLabel: string;
}

const initialState: ProductFormState = {};

export function ProductForm({
  action,
  product,
  categories = [],
  submitLabel,
}: ProductFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(product?.slug));

  const categoryOptions = [
    ...new Set([...DEFAULT_CATEGORIES, ...categories]),
  ].sort();

  function handleNameChange(value: string) {
    setName(value);
    if (!slugTouched) {
      setSlug(slugify(value));
    }
  }

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      {state.error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {state.error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Product name" required>
          <input
            name="name"
            required
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            className={inputClass}
            placeholder="NVIDIA GeForce RTX 5080"
          />
        </Field>

        <Field label="Slug" required>
          <input
            name="slug"
            required
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value);
            }}
            className={inputClass}
            placeholder="nvidia-geforce-rtx-5080"
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Brand" required>
          <input
            name="brand"
            required
            defaultValue={product?.brand}
            className={inputClass}
            placeholder="NVIDIA"
          />
        </Field>

        <Field label="Category" required>
          <input
            name="category"
            required
            list="product-categories"
            defaultValue={product?.category}
            className={inputClass}
            placeholder="Graphics Cards"
          />
          <datalist id="product-categories">
            {categoryOptions.map((category) => (
              <option key={category} value={category} />
            ))}
          </datalist>
        </Field>
      </div>

      <Field label="Emoji" hint="Shown on product cards and comparison pages">
        <input
          name="imageEmoji"
          maxLength={4}
          defaultValue={product?.imageEmoji ?? "📦"}
          className={`${inputClass} max-w-[120px] text-center text-xl`}
          placeholder="🎮"
        />
      </Field>

      <Field
        label="Specs"
        hint="One per line: Key: Value (e.g. VRAM: 16 GB GDDR7)"
      >
        <textarea
          name="specs"
          rows={6}
          defaultValue={product ? specsToText(product.specs) : ""}
          className={inputClass}
          placeholder={"VRAM: 16 GB GDDR7\nBoost Clock: 2.62 GHz\nTDP: 320W"}
        />
      </Field>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-violet-500 disabled:opacity-50"
        >
          {pending ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-300">
        {label}
        {required && <span className="text-red-400"> *</span>}
      </span>
      {hint && (
        <span className="mt-0.5 block text-xs text-slate-500">{hint}</span>
      )}
      <div className="mt-2">{children}</div>
    </label>
  );
}

const inputClass =
  "w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none focus:border-violet-400/50 focus:ring-2 focus:ring-violet-400/20";
